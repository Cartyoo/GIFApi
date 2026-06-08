const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const env = require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8057;
const TARGET = process.env.TARGET || 'https://gifs.foxes.cool';

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

app.listen(PORT, process.env.LISTEN, () => {
  console.log(`Reverse proxy listening at http://${process.env.LISTEN}:${PORT} -> ${TARGET}`);
});