async function loadHistorico(){
  try {
    const [catRes, res] = await Promise.all([
      fetch(apiUrl('/api/categories'), { credentials: 'include' }),
      fetch(apiUrl('/api/spendings'), { credentials: 'include' })
    ]);

    const categories = catRes.ok ? await catRes.json() : [];
    const catMap = new Map();
    categories.forEach(c => catMap.set(String(c.id), (c.nome || c.name || c.title || '')));

    if (!res.ok) {
      console.warn('Unable to fetch spendings');
      return;
    }
    const spendings = await res.json();
    const tbody = document.querySelector('.historico-tabela tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    function formatMoney(v){
      const n = Number(v) || 0;
      return n % 1 === 0 ? `${n} esc` : `${n.toFixed(2)} esc`;
    }
    function formatDateRaw(d){
      if (!d) return '';
      try{ const dt = new Date(d); return dt.toLocaleDateString('pt-PT'); }catch(e){ return d; }
    }
    function escapeHtml(s){ return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

    spendings.forEach(s => {
      const dateRaw = s.data || s.createdAt || s.date || '';
      const date = formatDateRaw(dateRaw);
      const name = s.nome || s.name || s.titulo || '';
      const desc = s.descricao || s.description || '';
      let catName = '';
      if (s.categoria && typeof s.categoria === 'string') catName = s.categoria;
      else if (s.categoria_id || s.category_id) catName = catMap.get(String(s.categoria_id || s.category_id)) || '';
      if (!catName) catName = 'Outros';
      const preco = s.preco || s.valor || s.price || s.amount || 0;

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${escapeHtml(name)}</td>
        <td>${escapeHtml(date)}</td>
        <td>${escapeHtml(desc)}</td>
        <td>${escapeHtml(catName)}</td>
        <td>${formatMoney(preco)}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error(err);
  }
}

loadHistorico();
window.addEventListener('spending:created', loadHistorico);
