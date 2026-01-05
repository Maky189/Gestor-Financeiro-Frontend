Frontend for Gestor Financeiro

This frontend is a static site that can integrate with the provided Node.js backend (see `Backend.md`). 
Run locally

- The repository now includes a small Express-based server that serves the static pages and performs session checks against the backend. To run locally:

```bash
npm install
npm start
```

- The server runs by default on `http://localhost:8080` and proxies `/api/*` requests to the backend. You can change the backend URL by setting `BACKEND_BASE` before starting, e.g.:

```bash
BACKEND_BASE=http://127.0.0.1:3000 npm start
```

- The frontend client is configured to use same-origin API calls by default (e.g. `fetch('/api/users')`) so requests hit this proxy and avoid CORS when using credentials. To bypass the proxy and call the backend directly, set `window.API_BASE = 'http://localhost:3000'` before the scripts load.

- Behavior:
  - `GET /` redirects to `/index.html` if the session is valid, otherwise to `/login.html`.
  - Protected pages (`/index.html`, `/categorias.html`, `/historico.html`, `/profile.html`, `/options.html`, `/despesas.html`) will be checked against the backend's `/api/users/me` (the server forwards the client's Cookie header). If the backend responds unauthorized, the server redirects to `/login.html`.
  - The server also **proxies `/api/*` requests** to the backend (preserving cookies and headers). This means the browser can call `/api/...` on the same origin (http://localhost:8080) and avoid CORS issues when using credentials (`fetch(..., { credentials: 'include' })`).


- The frontend as it is: when not authenticated it falls back to static demo content and shows console warnings.