import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const html = readFileSync(new URL('../../demo-app/index.html', import.meta.url), 'utf8');
assert.ok(html.includes('QA Demo'));
assert.ok(html.includes('signup'));
console.log('demo fixture smoke passed');
