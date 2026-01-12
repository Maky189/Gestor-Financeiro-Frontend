const addExpenseBtn = document.getElementById('addExpenseBtn'); 
const modalOverlay = document.getElementById('modalOverlay'); 
const cancelBtn = document.getElementById('cancelBtn'); 
const saveBtn = document.getElementById('saveBtn'); 
const categoryBtn = document.getElementById('categoryBtn'); 
const dropdownContent = document.getElementById('dropdownContent'); 
const gastoInput = document.getElementById('gastoInput'); 
const valorInput = document.getElementById('valorInput'); 

addExpenseBtn.addEventListener('click', async () => {
  await loadModalCategories();
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

// delegate clicks on dropdown to handle dynamic content
dropdownContent.addEventListener('click', (e) => {
  const a = e.target.closest('a');
  if (!a) return;
  e.preventDefault();
  categoryBtn.textContent = a.textContent.trim();
  dropdownContent.classList.remove('active');
});

// populate dropdown with categories from backend (fallback to defaults)
async function loadModalCategories(){
  try{
    const res = await fetch(apiUrl('/api/categories'), { credentials: 'include' });
    let categories = [];
    if (res.ok) categories = await res.json();

    // if none, use defaults
    if (!categories || categories.length === 0){
      const defaults = ['Alimentação','Saúde','Lazer'];
      dropdownContent.innerHTML = defaults.map(d => `<a href="#" data-value="${d}">${d}</a>`).join('');
      return;
    }

    dropdownContent.innerHTML = categories.map(c => `<a href="#" data-value="${c.nome || c.name || c.title}">${c.nome || c.name || c.title}</a>`).join('');
  }catch(err){
    console.warn('Could not load categories', err);
    const defaults = ['Alimentação','Saúde','Lazer'];
    dropdownContent.innerHTML = defaults.map(d => `<a href="#" data-value="${d}">${d}</a>`).join('');
  }
}

document.addEventListener('click', (e) => {
  if (!categoryBtn.contains(e.target) && !dropdownContent.contains(e.target)) {
    dropdownContent.classList.remove('active');
  }
});

saveBtn.addEventListener('click', async () => {
  const titulo = gastoInput.value.trim();
  const descricao = (document.getElementById('descricaoInput') || {}).value || '';
  const categoria = categoryBtn.textContent.trim();
  const valor = valorInput.value;

  if (!titulo || categoria === 'Selecionar categoria' || !valor) {
    alert('Por favor, preencha todos os campos!');
    return;
  }

  async function ensureCategory(name){
    try{
      // get existing categories
      const res = await fetch(apiUrl('/api/categories'), { credentials: 'include' });
      if (!res.ok) {
        // can't fetch categories; try to create directly
        console.warn('Could not fetch categories, attempting to create');
      } else {
        const cats = await res.json();
        const found = cats.find(c => (c.nome || c.name || '').toLowerCase() === name.toLowerCase());
        if (found) return found;
      }

      // try to create category on backend
      const createRes = await fetch(apiUrl('/api/categories'), {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: name })
      });

      const createBody = await createRes.json().catch(() => ({}));
      if (!createRes.ok) {
        // if backend returned something, show the message
        console.error('create category failed', createRes.status, createBody);
        return { error: createBody.error || ('Create category failed: ' + createRes.status) };
      }

      // success
      window.dispatchEvent(new CustomEvent('category:created', { detail: createBody }));
      await loadModalCategories();
      return createBody;
    }catch(err){
      console.error('ensureCategory', err);
      return { error: 'Network error' };
    }
  }

  try {
    // make sure category exists (if user selected a default one)
    const categoryObj = await ensureCategory(categoria);
    if (!categoryObj) {
      alert('Não foi possível criar ou encontrar a categoria.');
      return;
    }
    if (categoryObj.error) {
      alert('Erro ao criar categoria: ' + categoryObj.error);
      return;
    }

    // build payload matching backend expectations
    const precoStr = Number(parseFloat(valor) || 0).toFixed(2);
    const payload = {
      nome: titulo,
      descricao: descricao,
      categoria: categoria,
      preco: precoStr
    };
    // include category id if available (some backends accept it)
    if (categoryObj && (categoryObj.id || categoryObj._id)) payload.categoria_id = categoryObj.id || categoryObj._id;

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

    // notify dashboard and other pages
    window.dispatchEvent(new Event('spending:created'));

  } catch (err) {
    console.error(err);
    alert('Erro ao conectar com o servidor');
  }
});

function limparFormulario() {
  gastoInput.value = '';
  (document.getElementById('descricaoInput') || {}).value = '';
  valorInput.value = '';
  categoryBtn.textContent = 'Selecionar categoria';
}