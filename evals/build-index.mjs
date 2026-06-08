// Pulls the live post catalog into index.fixture.json so evals reflect real
// posts. Usage:  node build-index.mjs [url]
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const url = process.argv[2] || 'https://chat.dailyai.studio/chat-index.json';
const out = join(dirname(fileURLToPath(import.meta.url)), 'index.fixture.json');

const res = await fetch(url);
if (!res.ok) {
  console.error(`Failed to fetch ${url}: ${res.status}`);
  process.exit(1);
}
const data = await res.json();
writeFileSync(out, JSON.stringify(data, null, 2));
console.log(`Wrote ${data.length} posts to ${out}`);
