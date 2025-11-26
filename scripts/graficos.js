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