const addExpenseBtn = document.getElementById('addExpenseBtn'); 
const modalOverlay = document.getElementById('modalOverlay'); 
const cancelBtn = document.getElementById('cancelBtn'); 
const saveBtn = document.getElementById('saveBtn'); 
const categoryBtn = document.getElementById('categoryBtn'); 
const dropdownContent = document.getElementById('dropdownContent'); 
const gastoInput = document.getElementById('gastoInput'); 
const valorInput = document.getElementById('valorInput'); 

addExpenseBtn.addEventListener('click', () => {
  modalOverlay.classList.add('active');
});

cancelBtn.addEventListener('click', () => {
  modalOverlay.classList.remove('active');
  limparFormulario(); 
});

modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) {
    modalOverlay.classList.remove('active');
    limparFormulario();
  }
});

categoryBtn.addEventListener('click', () => {
  dropdownContent.classList.toggle('active');
});

const categoryOptions = dropdownContent.querySelectorAll('a');
categoryOptions.forEach(option => {
  option.addEventListener('click', (e) => {
    e.preventDefault();
    categoryBtn.textContent = e.target.textContent; 
    dropdownContent.classList.remove('active'); 
  });
});

document.addEventListener('click', (e) => {
  if (!categoryBtn.contains(e.target) && !dropdownContent.contains(e.target)) {
    dropdownContent.classList.remove('active');
  }
});

saveBtn.addEventListener('click', async () => {
  const gasto = gastoInput.value.trim();
  const categoria = categoryBtn.textContent.trim();
  const valor = valorInput.value;
  
  if (!gasto || categoria === 'Selecionar categoria' || !valor) {
    alert('Por favor, preencha todos os campos!');
    return;
  }

  // send to backend
  try {
    const payload = {
      descricao: gasto,
      categoria: categoria,
      valor: parseFloat(valor)
    };

    const res = await fetch(apiUrl('/api/spendings'), {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      alert(err.error || 'Erro ao salvar despesa');
      return;
    }

    modalOverlay.classList.remove('active');
    limparFormulario();
    alert('Despesa salva com sucesso!');

    window.dispatchEvent(new Event('spending:created'));

  } catch (err) {
    console.error(err);
    alert('Erro ao conectar com o servidor');
  }
});

function limparFormulario() {
  gastoInput.value = '';
  valorInput.value = '';
  categoryBtn.textContent = 'Selecionar categoria';
}