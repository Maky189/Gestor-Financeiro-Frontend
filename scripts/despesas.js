async function loadAccountInfo() {
  try {
    const res = await fetch(apiUrl('/api/account'), { credentials: 'include' });
    if (!res.ok) {
      console.error('Failed to fetch account info');
      return;
    }
    const account = await res.json();
    document.getElementById('account-number').textContent = account.numero_conta || '--';
    document.getElementById('account-balance').textContent = (account.saldo_atual || 0).toFixed(2);
  } catch (err) {
    console.error('Error loading account info:', err);
  }
}

async function addBalance() {
  const amount = parseFloat(document.getElementById('add-amount').value);
  if (isNaN(amount) || amount <= 0) {
    alert('Por favor, insira um valor válido maior que 0.');
    return;
  }

  try {
    const res = await fetch(apiUrl('/api/account/saldo'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ amount })
    });

    if (!res.ok) {
      const error = await res.json();
      alert('Erro ao adicionar saldo: ' + (error.error || 'Erro desconhecido'));
      return;
    }

    const data = await res.json();
    document.getElementById('account-balance').textContent = (data.saldo_atual || 0).toFixed(2);
    document.getElementById('add-amount').value = '';
    document.getElementById('add-message').textContent = 'Saldo adicionado com sucesso!';
    setTimeout(() => document.getElementById('add-message').textContent = '', 3000);
  } catch (err) {
    console.error('Error adding balance:', err);
    alert('Erro ao adicionar saldo.');
  }
}

loadAccountInfo();

document.getElementById('add-balance-btn').addEventListener('click', addBalance);