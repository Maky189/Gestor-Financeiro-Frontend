(async function(){
  try {
    const res = await fetch(apiUrl('/api/categories'), { credentials: 'include' });
    if (!res.ok) {
      console.warn('Não foi possível obter categorias (não autenticado ou erro).');
      return;
    }
    const categories = await res.json();
    const list = document.querySelector('.lista-categorias');
    if (!list) return;

    list.innerHTML = '';
    categories.forEach(cat => {
      const el = document.createElement('div');
      el.className = 'categoria-item';
      el.innerHTML = `<span class="icon gray">📁</span> ${cat.nome || cat.name || cat.title}`;
      el.addEventListener('click', () => {
        document.querySelector('.categoria-display').innerHTML = `\n            <h2>${cat.nome || cat.name || cat.title}</h2>\n            <p>Não há registos ainda para esta categoria.</p>`;
      });
      list.appendChild(el);
    });

  } catch (err) {
    console.error(err);
  }
})();
