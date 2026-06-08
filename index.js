const express = require('express');
const https = require('https');
const http = require('http');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8057;
const ALLOWED = /\.(gif|png|jpe?g)$/i;

app.get('/', (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'Missing ?url= parameter' });
  }

  let target;
  try {
    target = new URL(url);
  } catch {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  if (!ALLOWED.test(target.pathname)) {
    return res.status(403).json({ error: 'Only .gif, .png, .jpg, .jpeg files are allowed' });
  }

  const client = target.protocol === 'https:' ? https : http;

  client.get(url, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  }).on('error', (err) => {
    console.error('Proxy error:', err.message);
    res.status(502).json({ error: 'Bad gateway', message: err.message });
  });
});

app.listen(PORT, process.env.LISTEN || undefined, () => {
  console.log(`Image proxy listening at http://${process.env.LISTEN || 'localhost'}:${PORT}`);
});