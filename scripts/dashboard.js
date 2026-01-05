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

      const monthTotals = Array.from({length:12}, () => 0);

      spendings.forEach(s => {
        const amount = parseFloat(s.valor || s.preco || s.amount || s.value || s.price) || 0;
        const d = new Date(s.data || s.createdAt || s.date || s.created_at || Date.now());
        const m = (d.getMonth() + 12) % 12;
        monthTotals[m] += amount;
        despesaTotal += amount;

        let cname = s.categoria || s.category || s.categoryName || '';
        if (!cname && s.category_id && categories.length){
          const c = categories.find(c => c.id === s.category_id || c.id === s.categoria_id);
          cname = c ? (c.nome || c.name) : 'Outros';
        }
        if (!cname) cname = 'Outros';

        categoryTotals.set(cname, (categoryTotals.get(cname) || 0) + amount);

        if (!categoryMonthly.has(cname)) categoryMonthly.set(cname, Array.from({length:12}, () => 0));
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
          datasets.push({
            label: name,
            data: months.map(v => Math.round(v*100)/100),
            borderColor: colorForCategory(i),
            backgroundColor: colorForCategory(i).replace('#','') ? `rgba(${parseInt(colorForCategory(i).slice(1,3),16)}, ${parseInt(colorForCategory(i).slice(3,5),16)}, ${parseInt(colorForCategory(i).slice(5,7),16)}, 0.1)` : 'rgba(0,0,0,0.1)',
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