async function loadCategories(){
  try {
    const [catRes, spendRes] = await Promise.all([
      fetch(apiUrl('/api/categories'), { credentials: 'include' }),
      fetch(apiUrl('/api/spendings'), { credentials: 'include' })
    ]);

    if (!catRes.ok) {
      console.warn('Não foi possível obter categorias (não autenticado ou erro).');
      return [];
    }
    const categories = await catRes.json();
    const spendings = spendRes.ok ? await spendRes.json() : [];

    const list = document.querySelector('.lista-categorias');
    const display = document.querySelector('.categoria-display');
    if (!list || !display) return categories;

    list.innerHTML = '';

    function formatMoney(v){ const n = Number(v) || 0; return n % 1 === 0 ? `${n} esc` : `${n.toFixed(2)} esc`; }
    function escapeHtml(s){ return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

    const categoryIcons = {
      'Alimentação': '<span class="icon yellow"><i class="fa-solid fa-utensils"></i></span>',
      'Entretenimento': '<span class="icon purple"><i class="fa-solid fa-star"></i></span>',
      'Saúde': '<span class="icon green"><i class="fa-solid fa-heartbeat"></i></span>',
      'Transporte': '<span class="icon black"><i class="fa-solid fa-car"></i></span>',
      'Lazer': '<span class="icon red"><i class="fa-solid fa-futbol"></i></span>',
      'Gestão Pessoal': '<span class="icon blue"><i class="fa-solid fa-user-gear"></i></span>',
      'Gastos Pessoais': '<span class="icon blue"><i class="fa-solid fa-user-gear"></i></span>'
    };

    function renderCategory(cat, items){
      if (!items || items.length === 0) {
        display.innerHTML = `<h2>${escapeHtml(cat.nome || cat.name || cat.title)}</h2><p>no spenses</p>`;
        return;
      }
      let html = `<h2>${escapeHtml(cat.nome || cat.name || cat.title)}</h2>`;
      html += `<table class="categoria-tabela"><thead><tr><th>Produto</th><th>Valor</th></tr></thead><tbody>`;
      items.forEach(s => {
        const nome = s.nome || s.name || s.titulo || '';
        const preco = s.preco || s.valor || s.price || s.amount || 0;
        html += `<tr><td>${escapeHtml(nome)}</td><td>${formatMoney(preco)}</td></tr>`;
      });
      html += `</tbody></table>`;
      display.innerHTML = html;
    }

    categories.forEach(cat => {
      const el = document.createElement('div');
      el.className = 'categoria-item';
      const iconHtml = categoryIcons[cat.nome || cat.name || cat.title] || '<span class="icon gray">📁</span>';
      el.innerHTML = `${iconHtml} ${escapeHtml(cat.nome || cat.name || cat.title)}`;
      el.addEventListener('click', () => {
        const items = spendings.filter(s => {
          // match by category id or by name stored on spending
          if (s.categoria && typeof s.categoria === 'string') return (s.categoria === (cat.nome || cat.name || cat.title));
          const cid = s.categoria_id || s.category_id || s.categoria;
          return String(cid) === String(cat.id);
        });
        renderCategory(cat, items);
      });
      list.appendChild(el);
    });

    // auto-open first category
    if (categories.length > 0) list.querySelector('.categoria-item').click();

    return categories;
  } catch (err) {
    console.error(err);
    return [];
  }
}

// initial load
loadCategories();

// refresh on category or spending events
window.addEventListener('category:created', () => loadCategories());
window.addEventListener('spending:created', () => loadCategories());
