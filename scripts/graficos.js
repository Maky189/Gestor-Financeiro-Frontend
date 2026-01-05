const MONTH_LABELS = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
const COLOR_PALETTE = ['#ff8c42', '#ff6363', '#36a2eb', '#8bc34a', '#8338ec', '#ffd166', '#06d6a0', '#118ab2', '#ef476f'];

function createPieChart(ctx, labels, values) {
  const bg = labels.map((_, i) => COLOR_PALETTE[i % COLOR_PALETTE.length]);
  return new Chart(ctx, {
    type: 'pie',
    data: { labels, datasets: [{ data: values, backgroundColor: bg }] },
    options: { responsive: true, maintainAspectRatio: true }
  });
}

function createBarChart(ctx, monthLabels, values) {
  return new Chart(ctx, {
    type: 'bar',
    data: { labels: monthLabels, datasets: [{ label: 'Gastos Totais', data: values, backgroundColor: '#ff8c42', borderColor: '#e67a2e', borderWidth: 2 }] },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        x: { ticks: { maxRotation: 0, minRotation: 0, autoSkip: false, padding: 6 }, grid: { display: false } },
        y: { beginAtZero: true, ticks: { callback: function(value){ return value + ' esc'; } } }
      },
      layout: { padding: { bottom: 12 } },
      plugins: { legend: { display: false }, tooltip: { callbacks: { label: function(context){ return 'Gasto: ' + context.parsed.y + ' esc'; } } } }
    }
  });
}

function createLineChart(ctx, monthLabels, datasets) {
  return new Chart(ctx, {
    type: 'line',
    data: { labels: monthLabels, datasets: datasets },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      scales: { y: { beginAtZero: true, ticks: { callback: function(v){ return v + ' esc'; } } } },
      plugins: { legend: { display: true, position: 'top' } }
    }
  });
}

function colorForCategory(index) {
  return COLOR_PALETTE[index % COLOR_PALETTE.length];
}