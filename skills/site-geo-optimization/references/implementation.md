# Reference implementation

Condensed, working code from a live Astro static site. Adapt the framework
specifics; the patterns are portable. Full source:
https://github.com/alnutile/astro-and-zapier-chat

## Table of contents
1. Audit command (score a live site)
2. llms.txt generator
3. llms-full.txt generator
4. robots.txt (AI crawlers)
5. Author Person entity (sameAs) + Article JSON-LD
6. Opt-in FAQ (visible + FAQPage schema)

---

## 1. Audit command

Check the real signals on a live site before scoring:

```bash
POST="https://example.com/posts/some-post/"; pp=$(curl -s "$POST")
for f in llms.txt llms-full.txt robots.txt sitemap-index.xml rss.xml; do
  printf "%-18s %s\n" "$f" "$(curl -s -o /dev/null -w '%{http_code}' https://example.com/$f)"
done
echo "$pp" | grep -oE '"@type":\s*"[^"]+"' | sort | uniq -c          # schema types
for p in 'rel="canonical"' og:title twitter:card 'name="author"' article:modified_time sameAs; do
  printf "%-22s %s\n" "$p" "$(echo "$pp" | grep -c "$p")"
done
curl -s https://example.com/robots.txt | grep -cE 'GPTBot|ClaudeBot|PerplexityBot'  # AI bots named
```

---

## 2. llms.txt generator (Astro endpoint)

```ts
// src/pages/llms.txt.ts
import { getCollection } from 'astro:content';
export async function GET(context) {
  const site = (context.site?.toString() ?? 'https://example.com').replace(/\/$/, '');
  const posts = (await getCollection('posts'))
    .sort((a, b) => new Date(b.data.date).valueOf() - new Date(a.data.date).valueOf());
  const lines = [
    '# Site Name', '',
    '> One-line summary of what the site is about.', '',
    '## Posts', '',
    ...posts.map((p) => `- [${p.data.title}](${site}/posts/${p.id}/) (${new Date(p.data.date).toISOString().slice(0,10)}): ${p.data.excerpt}`),
    '', '## Optional', '',
    `- [Full text of every post](${site}/llms-full.txt)`,
    `- [RSS feed](${site}/rss.xml)`, '',
  ];
  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  });
}
```

---

## 3. llms-full.txt generator

```ts
// src/pages/llms-full.txt.ts
import { getCollection } from 'astro:content';
export async function GET(context) {
  const site = (context.site?.toString() ?? 'https://example.com').replace(/\/$/, '');
  const posts = (await getCollection('posts'))
    .sort((a, b) => new Date(b.data.date).valueOf() - new Date(a.data.date).valueOf());
  const parts = ['# Site — Full content', ''];
  for (const p of posts) {
    parts.push('---', '', `# ${p.data.title}`, `URL: ${site}/posts/${p.id}/`,
      `Date: ${new Date(p.data.date).toISOString().slice(0,10)}`, '', (p.body ?? '').trim(), '');
  }
  return new Response(parts.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  });
}
```

`p.body` is the raw markdown for glob-loaded collection entries.

---

## 4. robots.txt (public/robots.txt)

```
User-agent: *
Allow: /

# AI / LLM crawlers — explicitly allowed
User-agent: GPTBot
Allow: /
User-agent: OAI-SearchBot
Allow: /
User-agent: ChatGPT-User
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: anthropic-ai
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: Google-Extended
Allow: /
User-agent: Applebot-Extended
Allow: /
User-agent: CCBot
Allow: /

Sitemap: https://example.com/sitemap-index.xml
```

---

## 5. Author Person entity (sameAs) + Article JSON-LD

The `sameAs` array is the key authority signal. Use the author's REAL profile
URLs — search their existing content for them; never invent URLs.

```astro
---
// in the <head> layout
const authorPerson = {
  "@type": "Person",
  "name": author,
  "url": new URL("/about", Astro.site).toString(),
  "sameAs": [
    "https://www.linkedin.com/in/USERNAME",
    "https://github.com/USERNAME",
    "https://www.youtube.com/@USERNAME",
    // ...the author's real profiles only
  ],
};
const websiteSchema = { "@context": "https://schema.org", "@type": "WebSite",
  name: siteName, url: Astro.site?.toString(), description, author: authorPerson };
const articleSchema = publishedDate ? { "@context": "https://schema.org", "@type": "Article",
  headline: title, image: ogImage, author: authorPerson,
  publisher: { "@type": "Organization", name: siteName, logo: { "@type": "ImageObject", url: logoUrl } },
  datePublished: publishedDate.toISOString(),
  dateModified: (modifiedDate || publishedDate).toISOString(),
  mainEntityOfPage: canonicalURL } : null;
const jsonLD = type === 'article' && articleSchema ? articleSchema : websiteSchema;
---
<meta name="author" content={author} />
<link rel="canonical" href={canonicalURL} />
{type === 'article' && <meta property="article:author" content={author} />}
{publishedDate && <meta property="article:modified_time" content={(modifiedDate||publishedDate).toISOString()} />}
<script type="application/ld+json" set:html={JSON.stringify(jsonLD)} />
```

---

## 6. Opt-in FAQ (visible + FAQPage schema)

Add a `faq` field to the content schema, render a visible section AND matching
schema from the same source. Posts without `faq` emit nothing.

```ts
// content.config.ts schema addition
faq: z.array(z.object({ question: z.string(), answer: z.string() })).optional(),
```

```astro
---
// FaqSection.astro — used in the post layout, and aggregated on a /faq hub page
const { faq } = Astro.props;
const items = (faq ?? []).filter((f) => f?.question && f?.answer);
const schema = items.length ? { "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: items.map((f) => ({ "@type": "Question", name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer } })) } : null;
---
{items.length > 0 && (
  <section aria-labelledby="faq-heading">
    <h2 id="faq-heading">Frequently asked questions</h2>
    <dl>{items.map((f) => (<div><dt>{f.question}</dt><dd>{f.answer}</dd></div>))}</dl>
    <script type="application/ld+json" set:html={JSON.stringify(schema)} />
  </section>
)}
```

A `/faq` hub page can `getCollection('posts')`, filter to those with `faq`, render
all visibly, and emit one aggregate `FAQPage` — a strong standalone GEO asset.
```
