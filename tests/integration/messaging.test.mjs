import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';

const proc = spawn('node', ['native-host/dist/mcp-stdio.js'], { stdio: ['pipe','pipe','inherit'] });
proc.stdin.write(JSON.stringify({ id:'1', tool:'system.ping', args:{}, safety:{sessionId:'s',readOnly:true,approvalRequired:false,allowDomains:[],maxActions:1,maxPages:1}, client:{name:'itest',version:'1',clientId:'x'} })+'\n');

const line = await new Promise((resolve) => {
  proc.stdout.once('data', (d) => resolve(String(d).trim()));
});
const msg = JSON.parse(line);
assert.equal(msg.ok, true);
proc.kill();
console.log('integration messaging test passed');
