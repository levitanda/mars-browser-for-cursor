import http from 'node:http';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const dir = dirname(fileURLToPath(import.meta.url));
const html = readFileSync(join(dir, 'index.html'),'utf8');
http.createServer((req,res)=>{
  if(req.url==='/api/fail'){res.statusCode=500;res.end(JSON.stringify({error:'failed'}));return;}
  if(req.url==='/api/success'){res.setHeader('content-type','application/json');res.end(JSON.stringify({ok:true}));return;}
  res.setHeader('content-type','text/html');res.end(html);
}).listen(3000,()=>console.log('demo app http://localhost:3000'));
