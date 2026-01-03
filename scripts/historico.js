(async function(){
  try {
    const res = await fetch(apiUrl('/api/spendings'), { credentials: 'include' });
    if (!res.ok) {
      console.warn('Unable to fetch spendings');
      return;
    }
    const spendings = await res.json();
    const tbody = document.querySelector('table tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    spendings.forEach(s => {
      const date = s.data || s.createdAt || s.date || '';
      const desc = s.descricao || s.description || s.description || '';
      const cat = s.categoria || s.category || '';
      const value = s.valor || s.value || s.amount || '';
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${date}</td><td>${desc}</td><td>${cat}</td><td>${value}</td>`;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error(err);
  }
})();
