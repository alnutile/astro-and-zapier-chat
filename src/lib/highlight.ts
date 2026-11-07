// Syntax highlighting for Portable Text code blocks, matching what Astro's
// markdown pipeline produced before the EmDash move (Shiki, github-dark).
//
// Uses Shiki's JavaScript regex engine instead of the Oniguruma WASM build so
// it runs inside a Cloudflare Worker. Languages are bundled up front; anything
// else falls back to plain text (e.g. `env`, which the old build didn't
// highlight either).
import { createHighlighterCore, type HighlighterCore } from 'shiki/core';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';

const LANGS: Record<string, () => Promise<unknown>> = {
  bash: () => import('shiki/langs/bash.mjs'),
  dockerfile: () => import('shiki/langs/dockerfile.mjs'),
  html: () => import('shiki/langs/html.mjs'),
  javascript: () => import('shiki/langs/javascript.mjs'),
  json: () => import('shiki/langs/json.mjs'),
  markdown: () => import('shiki/langs/markdown.mjs'),
  php: () => import('shiki/langs/php.mjs'),
  python: () => import('shiki/langs/python.mjs'),
  sql: () => import('shiki/langs/sql.mjs'),
  toml: () => import('shiki/langs/toml.mjs'),
  tsx: () => import('shiki/langs/tsx.mjs'),
  typescript: () => import('shiki/langs/typescript.mjs'),
  yaml: () => import('shiki/langs/yaml.mjs'),
};

const ALIASES: Record<string, string> = {
  sh: 'bash', shell: 'bash', zsh: 'bash', console: 'bash',
  js: 'javascript', mjs: 'javascript', ts: 'typescript',
  md: 'markdown', yml: 'yaml', py: 'python', docker: 'dockerfile',
};

let highlighter: Promise<HighlighterCore> | undefined;

function getHighlighter() {
  highlighter ??= createHighlighterCore({
    themes: [import('shiki/themes/github-dark.mjs')],
    langs: Object.values(LANGS).map((load) => load()) as any,
    engine: createJavaScriptRegexEngine(),
  });
  return highlighter;
}

export async function highlight(code: string, language?: string): Promise<string> {
  const requested = (language ?? '').toLowerCase();
  const lang = ALIASES[requested] ?? requested;
  const h = await getHighlighter();
  return h.codeToHtml(code, {
    lang: lang in LANGS ? lang : 'text',
    theme: 'github-dark',
  });
}
