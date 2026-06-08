// promptfoo prompt function. Builds the exact production prompt (shared
// system-prompt.js) + the test's user question, so evals test what ships.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { buildSystemPrompt } from '../worker/src/system-prompt.js';

const here = dirname(fileURLToPath(import.meta.url));

function loadIndex() {
  for (const name of ['index.fixture.json', 'index.sample.json']) {
    try {
      return JSON.parse(readFileSync(join(here, name), 'utf8'));
    } catch {}
  }
  return [];
}

const index = loadIndex();

export default function ({ vars }) {
  const system = buildSystemPrompt(index);
  return [
    { role: 'system', content: system },
    { role: 'user', content: vars.question },
  ];
}
