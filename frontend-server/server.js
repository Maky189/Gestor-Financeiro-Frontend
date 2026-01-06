const express = require('express');
const path = require('path');
const fetch = global.fetch || require('node-fetch');

const app = express();
const PORT = process.env.PORT || 8080;
const BACKEND_BASE = process.env.BACKEND_BASE || 'http://localhost:3000';

// verify session by calling backend /api/users/me
async function checkSession(req) {
  try {
    const cookie = req.headers.cookie || '';
    const res = await fetch(new URL('/api/users/me', BACKEND_BASE).toString(), {
      headers: { Cookie: cookie }
    });
    return res.ok;
  } catch (err) {
    console.error('session check failed', err);
    return false;
  }
}

app.use('/styles', express.static(path.join(__dirname, '..', 'styles')));
app.use('/scripts', express.static(path.join(__dirname, '..', 'scripts')));
app.use('/images', express.static(path.join(__dirname, '..', 'images')));
app.use('/templates/assets', express.static(path.join(__dirname, '..', 'templates', 'assets'))); // if any

// Pages that require authentication
const protectedPages = new Set(['/index.html', '/categorias.html', '/historico.html', '/profile.html', '/options.html', '/despesas.html']);

// protect pages
app.get(['/', '/index.html', '/categorias.html', '/historico.html', '/profile.html', '/options.html', '/despesas.html'], async (req, res, next) => {
  const urlPath = req.path === '/' ? '/': req.path;

  // check session
  const authed = await checkSession(req);

  if (req.path === '/') {
    if (authed) return res.redirect('/index.html');
    return res.redirect('/login.html');
  }

  if (authed) {
    return res.sendFile(path.join(__dirname, '..', 'templates', req.path));
  } else {
    return res.redirect('/login.html');
  }
});

app.get(['/login.html', '/register.html'], async (req, res, next) => {
  const authed = await checkSession(req);
  if (authed) return res.redirect('/index.html');
  return res.sendFile(path.join(__dirname, '..', 'templates', req.path));
});

app.use(express.static(path.join(__dirname, '..', 'templates')));

const { createProxyMiddleware } = require('http-proxy-middleware');

app.use('/api', createProxyMiddleware({
  target: BACKEND_BASE,
  changeOrigin: true,
  cookieDomainRewrite: '',
  onProxyRes(proxyRes, req, res) {
    console.log('[proxy] %s %s -> %s %d', req.method, req.originalUrl, BACKEND_BASE + req.originalUrl, proxyRes.statusCode);
  },
  onError(err, req, res) {
    console.error('[proxy][error]', err);
    if (!res.headersSent) res.status(502).send('Bad gateway');
  },
  secure: false,
  logLevel: 'warn'
}));

app.listen(PORT, () => console.log(`Frontend server started on http://localhost:${PORT} (backend base: ${BACKEND_BASE})`));
