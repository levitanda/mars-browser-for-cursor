import { readFileSync } from 'node:fs';

const manifest = JSON.parse(readFileSync('extension/manifest.json', 'utf8'));
if (manifest.manifest_version !== 3) throw new Error('Manifest must be MV3');
const text = readFileSync('extension/src/background/service-worker.ts', 'utf8');
if (text.includes('eval(')) throw new Error('eval is forbidden');
console.log('Publishability checks passed');
