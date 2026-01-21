(async function(){
  try {
    const res = await fetch(apiUrl('/api/users/me'), { credentials: 'include' });
    if (!res.ok) {
      window.location.href = 'login.html';
      return;
    }
    const user = await res.json();    console.log('User data from /api/users/me:', user);    const nameEl = document.querySelector('.user-profile-name');
    if (nameEl) nameEl.textContent = `${user.nome || 'Nome'} ${user.apelido || 'Apelido'}`;

    const emailEl = document.getElementById('user-email');
    if (emailEl) emailEl.textContent = user.email || '';

    const telefoneEl = document.getElementById('user-telefone');
    if (telefoneEl) telefoneEl.textContent = user.numero || '';

    const moradaEl = document.getElementById('user-morada');
    if (moradaEl) moradaEl.textContent = user.morada || '';

  } catch (err) {
    console.error(err);
  }
})();
