import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const port = process.env.PORT || 3000;
const root = path.resolve(process.cwd(), 'out');

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath.endsWith('/')) {
    reqPath += 'index.html';
  }

  let filePath = path.join(root, reqPath);

  // If path is a directory without trailing slash, redirect
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    res.writeHead(301, { Location: reqPath + '/' });
    res.end();
    return;
  }

  // If file doesn't exist, check if appending .html works
  if (!fs.existsSync(filePath)) {
    if (fs.existsSync(filePath + '.html')) {
      filePath += '.html';
    } else if (fs.existsSync(path.join(root, reqPath, 'index.html'))) {
      filePath = path.join(root, reqPath, 'index.html');
    } else {
      // 404 page
      filePath = path.join(root, '404.html');
      res.statusCode = 404;
    }
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.statusCode = 404;
      res.end('File not found');
      return;
    }
    res.setHeader('Content-Type', contentType);
    res.end(data);
  });
});

server.listen(port, () => {
  console.log(`🚀 Static server listening on http://localhost:${port}`);
});
