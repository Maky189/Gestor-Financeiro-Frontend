(async function(){
  const monthYearEl = document.getElementById('monthYear');
  const despesaEl = document.getElementById('despesaTotal');
  const orcamentoEl = document.getElementById('orcamentoRestante');

  function formatMoney(v){
    if (v === null || v === undefined) return '0 esc';
    const num = parseFloat(v) || 0;
    return num % 1 === 0 ? `${num} esc` : `${num.toFixed(2)} esc`;
  }

  function getMonthYearString(date){
    const d = date || new Date();
    const month = MONTH_LABELS[d.getMonth()];
    return `${month} ${d.getFullYear()}`;
  }

  async function fetchDataAndRender(){
    try {
      monthYearEl && (monthYearEl.textContent = getMonthYearString(new Date()));

      const [accRes, catRes, spRes] = await Promise.all([
        fetch(apiUrl('/api/account'), { credentials: 'include' }),
        fetch(apiUrl('/api/categories'), { credentials: 'include' }),
        fetch(apiUrl('/api/spendings'), { credentials: 'include' })
      ]);

      const account = accRes.ok ? await accRes.json() : null;
      const categories = catRes.ok ? await catRes.json() : [];
      const spendings = spRes.ok ? await spRes.json() : [];

      const saldo_atual = account ? (parseFloat(account.saldo_atual) || 0) : 0;
      orcamentoEl && (orcamentoEl.textContent = formatMoney(saldo_atual));

      let despesaTotal = 0;

      const categoryTotals = new Map();
      const categoryMonthly = new Map();
      categories.forEach((c) => {
        const name = (c.nome || c.name || c.title || '').toString();
        if (name) {
          categoryTotals.set(name, 0);
          categoryMonthly.set(name, Array.from({length:12}, () => 0));
        }
      });
      if (!categoryTotals.has('Outros')) {
        categoryTotals.set('Outros', 0);
        categoryMonthly.set('Outros', Array.from({length:12}, () => 0));
      }

      const monthTotals = Array.from({length:12}, () => 0);

      function findCategoryNameForSpending(s){
        let cname = '';
        if (s.categoria && String(s.categoria).trim() !== '') cname = String(s.categoria).trim();
        else if (s.category && typeof s.category === 'string' && s.category.trim() !== '') cname = s.category.trim();
        else if (s.category && typeof s.category === 'object' && (s.category.nome || s.category.name)) cname = (s.category.nome || s.category.name);

        if (!cname) {
          const id = s.category_id || s.categoria_id || s.categoryId || s.category_id;
          if (id && categories.length) {
            const c = categories.find(c => String(c.id) === String(id) || String(c.id) === String(s.categoria_id));
            if (c) cname = (c.nome || c.name || c.title || '');
          }
        }

        if (!cname && s.categoria && categories.length) {
          const found = categories.find(c => (c.nome || c.name || '').toLowerCase() === String(s.categoria).toLowerCase());
          if (found) cname = (found.nome || found.name);
        }

        if (!cname) cname = 'Outros';
        return cname;
      }

      spendings.forEach(s => {
        const amount = parseFloat(s.valor || s.preco || s.amount || s.value || s.price) || 0;
        const d = new Date(s.data || s.createdAt || s.date || s.created_at || Date.now());
        const m = (d.getMonth() + 12) % 12;

        monthTotals[m] += amount;
        despesaTotal += amount;

        const cname = findCategoryNameForSpending(s);

        if (!categoryTotals.has(cname)) {
          categoryTotals.set(cname, 0);
          categoryMonthly.set(cname, Array.from({length:12}, () => 0));
        }

        categoryTotals.set(cname, (categoryTotals.get(cname) || 0) + amount);
        categoryMonthly.get(cname)[m] += amount;
      });

      despesaEl && (despesaEl.textContent = formatMoney(despesaTotal));

      const catLabels = Array.from(categoryTotals.keys());
      const catValues = Array.from(categoryTotals.values());

      const pieCtx = document.getElementById('pieChart');
      if (pieCtx) {
        if (pieCtx._chart) pieCtx._chart.destroy();
        pieCtx._chart = createPieChart(pieCtx, catLabels, catValues);
      }

      const barCtx = document.getElementById('barChart');
      if (barCtx) {
        if (barCtx._chart) barCtx._chart.destroy();
        barCtx._chart = createBarChart(barCtx, MONTH_LABELS, monthTotals.map(v => Math.round(v*100)/100));
      }

      const lineCtx = document.getElementById('lineChart');
      if (lineCtx) {
        if (lineCtx._chart) lineCtx._chart.destroy();
        const datasets = [];
        let i=0;
        for (const [name, months] of categoryMonthly.entries()){
          function hexToRgba(hex, alpha){
          if (!hex) return `rgba(0,0,0,${alpha})`;
          const h = hex.replace('#','');
          if (h.length !== 6) return `rgba(0,0,0,${alpha})`;
          const r = parseInt(h.slice(0,2),16);
          const g = parseInt(h.slice(2,4),16);
          const b = parseInt(h.slice(4,6),16);
          return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        }

        datasets.push({
            label: name,
            data: months.map(v => Math.round(v*100)/100),
            borderColor: colorForCategory(i),
            backgroundColor: hexToRgba(colorForCategory(i), 0.1),
            tension: 0.4,
            fill: true
          });
          i++;
        }
        lineCtx._chart = createLineChart(lineCtx, MONTH_LABELS, datasets);
      }

    } catch (err) {
      console.error('dashboard error', err);
    }
  }

  await fetchDataAndRender();
  window.addEventListener('spending:created', fetchDataAndRender);
})();