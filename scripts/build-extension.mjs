import { cpSync, mkdirSync, rmSync } from 'node:fs';
import { execSync } from 'node:child_process';

const ext = new URL('../extension/', import.meta.url);
const out = new URL('../extension/dist/', import.meta.url);

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
execSync('pnpm --filter @mars/extension exec tsc -p tsconfig.json', { stdio: 'inherit', cwd: ext });
cpSync(new URL('../extension/manifest.json', import.meta.url), new URL('../extension/dist/manifest.json', import.meta.url));
cpSync(new URL('../extension/pages', import.meta.url), new URL('../extension/dist/pages', import.meta.url), { recursive: true });
cpSync(new URL('../extension/src/styles', import.meta.url), new URL('../extension/dist/styles', import.meta.url), { recursive: true });
