import { buildSystemPrompt } from './system-prompt.js';

// Cloudflare Worker: the only thing that holds the OpenAI key. It enforces the
// abuse protections (origin check, Turnstile, rate limits, hard daily cap),
// fetches+caches the post index, builds the prompt, and calls OpenAI.
//
// Required secrets (wrangler secret put):  OPENAI_API_KEY, TURNSTILE_SECRET
// Required binding (wrangler.toml):        RATELIMIT (KV namespace)
// Vars (wrangler.toml):                    ALLOWED_ORIGINS, INDEX_URL, SITE_URL,
//                                          MODEL, MAX_TOKENS, PER_MIN, PER_HOUR,
//                                          DAILY_CAP

const INDEX_CACHE_TTL = 3600; // seconds the Worker caches /chat-index.json
const MAX_MESSAGE_CHARS = 2000;
const MAX_HISTORY = 10;

export default {
  async fetch(request, env, ctx) {
    const origin = request.headers.get('Origin') || '';
    const cors = corsHeaders(origin, env);
    try {
      return await handle(request, env, ctx, origin, cors);
    } catch (err) {
      // Convert any uncaught throw into a CORS-friendly JSON error so the
      // browser sees a message instead of an opaque 500. Full detail goes to
      // `wrangler tail`.
      console.error('Worker error:', err && err.stack ? err.stack : err);
      return json({ error: 'Server error: ' + (err?.message || 'unknown') }, 500, cors);
    }
  },
};

async function handle(request, env, ctx, origin, cors) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }
    if (request.method !== 'POST') {
      return json({ error: 'Method not allowed' }, 405, cors);
    }
    if (!isAllowedOrigin(origin, env)) {
      return json({ error: 'Forbidden origin' }, 403, cors);
    }
    if (!env.RATELIMIT) {
      // Binding missing → most common cause of a 500 right after setup.
      return json({ error: 'KV binding RATELIMIT not found — redeploy after adding the namespace id to wrangler.toml' }, 500, cors);
    }

    // --- Parse + validate input ------------------------------------------
    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: 'Invalid JSON' }, 400, cors);
    }
    const { messages, turnstileToken } = body || {};
    if (!turnstileToken) {
      return json({ error: 'Missing Turnstile token' }, 400, cors);
    }
    if (!Array.isArray(messages) || messages.length === 0) {
      return json({ error: 'messages required' }, 400, cors);
    }

    // --- Turnstile (proves a human/browser, not a script) ----------------
    const ip = request.headers.get('CF-Connecting-IP') || '0.0.0.0';
    const human = await verifyTurnstile(turnstileToken, ip, env);
    if (!human) {
      return json({ error: 'Turnstile verification failed' }, 403, cors);
    }

    // --- Rate limits + hard daily cap ------------------------------------
    const limited = await checkRateLimits(ip, env);
    if (limited) {
      return json({ error: limited }, 429, cors);
    }

    // --- Sanitize history -------------------------------------------------
    const history = messages
      .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
      .slice(-MAX_HISTORY)
      .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_MESSAGE_CHARS) }));
    if (history.length === 0 || history[history.length - 1].role !== 'user') {
      return json({ error: 'Last message must be from the user' }, 400, cors);
    }

    // --- Build prompt from the cached post index -------------------------
    const index = await getIndex(env, ctx);
    const system = buildSystemPrompt(index, env.SITE_URL || 'https://chat.dailyai.studio');

    // --- Stream the reply from OpenAI ------------------------------------
    // Errors (non-2xx) still come back as JSON before any streaming begins,
    // so the widget can branch on res.ok.
    return streamOpenAI(system, history, env, ctx, cors);
}

// ---------------------------------------------------------------------------

function isAllowedOrigin(origin, env) {
  if (!origin) return false;
  const allowed = (env.ALLOWED_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean);
  return allowed.some((a) => {
    if (a.startsWith('*.')) {
      const base = a.slice(1); // ".dailyai.studio"
      try {
        return new URL(origin).hostname.endsWith(base.slice(1));
      } catch {
        return false;
      }
    }
    return origin === a;
  });
}

function corsHeaders(origin, env) {
  const allow = isAllowedOrigin(origin, env) ? origin : '';
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    Vary: 'Origin',
  };
}

async function verifyTurnstile(token, ip, env) {
  const form = new FormData();
  form.append('secret', env.TURNSTILE_SECRET);
  form.append('response', token);
  form.append('remoteip', ip);
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: form,
  });
  const data = await res.json().catch(() => ({ success: false }));
  return data.success === true;
}

// KV-based sliding-ish windows. Eventual consistency is fine for soft limits;
// the daily cap is the real cost backstop. Returns an error string if blocked.
async function checkRateLimits(ip, env) {
  const now = Date.now();
  const minBucket = Math.floor(now / 60000);
  const hourBucket = Math.floor(now / 3600000);
  const day = new Date(now).toISOString().slice(0, 10);

  const perMin = Number(env.PER_MIN || 10);
  const perHour = Number(env.PER_HOUR || 60);
  const dailyCap = Number(env.DAILY_CAP || 1000);

  const minKey = `rl:min:${ip}:${minBucket}`;
  const hourKey = `rl:hour:${ip}:${hourBucket}`;
  const dayKey = `budget:${day}`;

  const [minN, hourN, dayN] = await Promise.all([
    bump(env.RATELIMIT, minKey, 120),
    bump(env.RATELIMIT, hourKey, 3700),
    bump(env.RATELIMIT, dayKey, 90000),
  ]);

  if (dayN > dailyCap) return 'Daily limit reached. Please try again tomorrow.';
  if (minN > perMin) return 'Too many requests. Slow down a moment.';
  if (hourN > perHour) return 'Hourly limit reached. Please try again later.';
  return null;
}

async function bump(kv, key, ttl) {
  const current = Number((await kv.get(key)) || 0) + 1;
  await kv.put(key, String(current), { expirationTtl: ttl });
  return current;
}

async function getIndex(env, ctx) {
  const url = env.INDEX_URL || 'https://chat.dailyai.studio/chat-index.json';
  const cache = caches.default;
  const cacheKey = new Request(url, { method: 'GET' });

  let res = await cache.match(cacheKey);
  if (!res) {
    res = await fetch(url, { cf: { cacheTtl: INDEX_CACHE_TTL } });
    if (res.ok) {
      const toCache = new Response(res.clone().body, res);
      toCache.headers.set('Cache-Control', `public, max-age=${INDEX_CACHE_TTL}`);
      ctx.waitUntil(cache.put(cacheKey, toCache));
    }
  }
  try {
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return []; // degrade gracefully — bot still answers, just without the catalog
  }
}

// Streams OpenAI's response as plain text. We read OpenAI's SSE, pull out each
// delta, and write just the text through a TransformStream — so the widget can
// read the body with a plain reader instead of parsing SSE itself.
function streamOpenAI(system, history, env, ctx, cors) {
  return fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: env.MODEL || 'gpt-4o-mini',
      max_tokens: Number(env.MAX_TOKENS || 500),
      temperature: 0.3,
      stream: true,
      messages: [{ role: 'system', content: system }, ...history],
    }),
  }).then((upstream) => {
    if (!upstream.ok || !upstream.body) {
      return json({ error: 'Upstream error' }, 502, cors);
    }
    const { readable, writable } = new TransformStream();
    // Pump runs in the background; waitUntil keeps the worker alive for it.
    ctx.waitUntil(pumpDeltas(upstream.body, writable));
    return new Response(readable, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store', ...cors },
    });
  });
}

async function pumpDeltas(body, writable) {
  const writer = writable.getWriter();
  const reader = body.getReader();
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buf = '';
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      const lines = buf.split('\n');
      buf = lines.pop(); // keep the last, possibly-incomplete line
      for (const line of lines) {
        const t = line.trim();
        if (!t.startsWith('data:')) continue;
        const data = t.slice(5).trim();
        if (data === '[DONE]') {
          await writer.close();
          return;
        }
        try {
          const delta = JSON.parse(data).choices?.[0]?.delta?.content;
          if (delta) await writer.write(encoder.encode(delta));
        } catch {}
      }
    }
    await writer.close();
  } catch (e) {
    try {
      await writer.abort(e);
    } catch {}
  }
}

function json(obj, status, headers) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers },
  });
}
