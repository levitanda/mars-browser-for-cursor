import http from "node:http";

export function createLocalHttpServer(token: string, allowedOrigin: string) {
  return http.createServer((req, res) => {
    if (req.socket.remoteAddress !== "127.0.0.1" && req.socket.remoteAddress !== "::1") {
      res.statusCode = 403; res.end("forbidden"); return;
    }
    if (req.headers.origin !== allowedOrigin) {
      res.statusCode = 403; res.end("invalid origin"); return;
    }
    if (req.headers.authorization !== `Bearer ${token}`) {
      res.statusCode = 401; res.end("unauthorized"); return;
    }
    res.setHeader("content-type", "application/json");
    res.end(JSON.stringify({ ok: true, note: "HTTP mode disabled by default; enable explicitly." }));
  });
}
