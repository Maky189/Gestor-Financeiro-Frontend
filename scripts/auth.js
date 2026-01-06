// Authentication helpers for register / login / logout

async function postJSON(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body)
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

// Register page
const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nome = document.getElementById('nomeInput').value.trim();
    const apelido = document.getElementById('apelidoInput').value.trim();
    const email = document.getElementById('emailInput').value.trim();
    const telefone = document.getElementById('telefoneInput').value.trim();
    const morada = document.getElementById('moradaInput').value.trim();
    const senha = document.getElementById('senha').value;
    const confirmar = document.getElementById('confirmarSenha').value;

    const erroMsg = document.getElementById('erroSenhas');
    const sucessoMsg = document.getElementById('sucessoCadastro');

    if (senha !== confirmar) {
      erroMsg.style.display = 'block';
      sucessoMsg.style.display = 'none';
      return;
    }

    erroMsg.style.display = 'none';

    // Prefer explicit username input if provided, otherwise derive one from email/name
    let username = '';
    const usernameInput = document.getElementById('usernameInput');
    if (usernameInput && usernameInput.value.trim()) username = usernameInput.value.trim();
    else username = email ? email.split('@')[0] : (nome || 'user') + Math.floor(Math.random() * 1000);

    const payload = {
      nome,
      apelido,
      username,
      email,
      morada,
      telefone,
      password: senha,
      confirmpassword: confirmar
    };

    const { ok, status, data } = await postJSON(apiUrl('/api/users'), payload);

    if (ok) {
      sucessoMsg.style.display = 'block';
      // redirect after short delay
      setTimeout(() => window.location.href = 'index.html', 900);
    } else {
      sucessoMsg.style.display = 'none';
      const errText = data && data.error ? data.error : `Erro ao criar conta (status ${status})`;
      alert(errText);
    }
  });
}

// Login page
const loginForm = document.querySelector('.main-login form') || document.querySelector('form');
if (loginForm && document.getElementById('loginBtn')) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const identity = document.getElementById('usernameInput').value.trim();
    const password = document.getElementById('passwordInput').value;

    const payload = { username: identity, password };
    const { ok, data } = await postJSON(apiUrl('/api/users/login'), payload);

    if (ok) {
      window.location.href = 'index.html';
    } else {
      const err = data && data.error ? data.error : 'Login failed';
      alert(err);
    }
  });
}

const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    const res = await fetch(apiUrl('/api/users/logout'), { method: 'POST', credentials: 'include' });
    if (res.ok) window.location.href = 'login.html';
    else alert('Erro ao fazer logout');
  });
}
