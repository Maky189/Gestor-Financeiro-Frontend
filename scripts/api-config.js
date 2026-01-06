window.API_BASE = (typeof window.API_BASE !== 'undefined') ? window.API_BASE : '';

function apiUrl(path) {
  if (/^https?:\/\//.test(path)) return path;

  if (path.startsWith('/')) {
    return window.API_BASE ? window.API_BASE + path : path;
  }

  return (window.API_BASE ? (window.API_BASE.replace(/\/$/, '') + '/') : '') + path;
}
