const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const port = 8057;
const TARGET = 'https://gifs.foxes.cool';

app.use(
  '/',
  createProxyMiddleware({
    target: TARGET,
    changeOrigin: true,
    on: {
      error: (err, req, res) => {
        console.error('Proxy error:', err.message);
        res.status(502).json({ error: 'Bad gateway', message: err.message });
      },
    },
  })
);

app.listen(port, () => {
  console.log(`Reverse proxy listening at http://localhost:${port} -> ${TARGET}`);
});