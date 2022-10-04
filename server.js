const http = require('node:http');
const {readFileSync} = require('node:fs');
const {cwd} = require('node:process');
const path = require('node:path');
const Buffer = require('node:buffer');
const {URL} = require('node:url');

const html = readFileSync(path.join(cwd(), 'dist/tic-tac-toe.html'));
const css = readFileSync(path.join(cwd(), 'dist/tic-tac-toe.css'));
const js = readFileSync(path.join(cwd(), 'dist/main.js'));

// Create a local server to receive data from
const server = http.createServer((req, res) => {
    console.log(`request path: ${req.url}`);
    const url = new URL(req.url, 'http://localhost:8000/');
    if (url.pathname === '/tic-tac-toe.css') {
      res.writeHead(200, { 'Content-Type': 'text/css' });
      res.end(css);
    } else if (url.pathname === '/main.js') {
      res.writeHead(200, { 'Content-Type': 'text/javascript' });
      res.end(js);
    } else if (req.url === '/') {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(html);
    }
  });
  
server.listen(8000);