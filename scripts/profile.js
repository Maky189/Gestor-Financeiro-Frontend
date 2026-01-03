(async function(){
  try {
    const res = await fetch(apiUrl('/api/users/me'), { credentials: 'include' });
    if (!res.ok) {
      window.location.href = 'login.html';
      return;
    }
    const user = await res.json();
    const nameEl = document.querySelector('.user-profile-name');
    if (nameEl) nameEl.textContent = `${user.nome} ${user.apelido}`;

    const contactEls = document.querySelectorAll('.user-profile-contact p');
    if (contactEls && contactEls.length >= 2) {
      contactEls[0].textContent = user.email || '';
      contactEls[1].textContent = user.telefone || '';
    }

    const addressEl = document.querySelectorAll('.user-profile-contact p')[2];
    if (addressEl) addressEl.textContent = user.morada || '';

  } catch (err) {
    console.error(err);
  }
})();
