// Busca o elemento canvas no HTML pelo ID 'pieChart'
const ctx = document.getElementById('pieChart');

if (ctx) {
    new Chart(ctx, {
        
        type: 'pie',
        
        data: {
            labels: ['Restaurante', 'Entretenimento', 'Saúde', 'Comida'],
            
            datasets: [{
                data: [171, 149, 68, 58],
                backgroundColor: ['#ff8c42', '#ff6363', '#36a2eb', '#8bc34a']
            }]
        },
        
        options: {
            responsive: true,
            
            maintainAspectRatio: true
        }
    });
}

//Gráfico de Barras - Comparação Mensal de Gastos
const barCtx = document.getElementById('barChart');

if (barCtx) {
    new Chart(barCtx, {
        type: 'bar', 
        
        data: {
            labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'], 
            
            datasets: [{
                label: 'Gastos Totais', 
                data: [310, 355, 393, 398, 425, 423, 442, 447, 441, 446, 415, 485], 
                backgroundColor: '#ff8c42',
                borderColor: '#e67a2e', 
                borderWidth: 2 
            }]
        },
        
        options: {
            responsive: true, 
            maintainAspectRatio: true, 
            scales: {
                y: {
                    beginAtZero: true, 
                    ticks: {
                        callback: function(value) {
                            return value + ' esc'; 
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false 
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    padding: 12,
                    cornerRadius: 8,
                    displayColors: false,
                    callbacks: {
                        title: function(context) {
                            return context[0].label;
                        },
                        label: function(context) {
                            return 'Gasto: ' + context.parsed.y + ' esc';
                        }
                    }
                }
            }
        }
    });
}

//Gráfico de Linhas - Evolução de Despesas ao Longo do Tempo
const lineCtx = document.getElementById('lineChart');

if (lineCtx) {
    new Chart(lineCtx, {
        type: 'line', 
        
        data: {
            labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'], 
            
            datasets: [
                {
                    label: 'Restaurante', 
                    data: [120, 145, 160, 155, 171, 165, 180, 175, 168, 171, 135, 190], 
                    borderColor: '#ff8c42', 
                    backgroundColor: 'rgba(255, 140, 66, 0.1)', 
                    tension: 0.4, 
                    fill: true 
                },
                {
                    label: 'Entretenimento', 
                    data: [100, 110, 125, 135, 140, 138, 145, 150, 148, 149, 155, 170], 
                    borderColor: '#ff6363', 
                    backgroundColor: 'rgba(255, 99, 99, 0.1)', 
                    tension: 0.4, 
                    fill: true 
                },
                {
                    label: 'Saúde', 
                    data: [50, 55, 60, 58, 62, 65, 63, 66, 68, 68, 70, 65], 
                    borderColor: '#36a2eb', 
                    backgroundColor: 'rgba(54, 162, 235, 0.1)', 
                    tension: 0.4, 
                    fill: true 
                },
                {
                    label: 'Comida', 
                    data: [40, 45, 48, 50, 52, 55, 54, 56, 57, 58, 55, 60], 
                    borderColor: '#8bc34a', 
                    backgroundColor: 'rgba(139, 195, 74, 0.1)', 
                    tension: 0.4, 
                    fill: true 
                }
            ]
        },
        
        options: {
            responsive: true, 
            maintainAspectRatio: true, 
            scales: {
                y: {
                    beginAtZero: true, 
                    ticks: {
                        callback: function(value) {
                            return value + ' esc'; 
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: true, 
                    position: 'top' 
                }
            }
        }
    });
}