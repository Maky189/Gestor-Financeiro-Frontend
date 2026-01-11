const modalOverlay = document.getElementById('modalOverlay');
        const categoryBtn = document.getElementById('categoryBtn');
        const dropdownContent = document.getElementById('dropdownContent');
        const cancelBtn = document.getElementById('cancelBtn');

        // bruno: Função para abrir a modal automaticamente ao carregar a página
        window.onload = function() {
            modalOverlay.classList.add('active'); //
        };

        // Lógica do Dropdown
        categoryBtn.addEventListener('click', () => {
            dropdownContent.classList.toggle('active');
        });

        dropdownContent.addEventListener('click', (e) => {
            const a = e.target.closest('a');
            if (!a) return;
            e.preventDefault();
            categoryBtn.textContent = a.textContent.trim();
            dropdownContent.classList.remove('active');
        });

        // Fechar modal
        cancelBtn.addEventListener('click', () => {
            modalOverlay.classList.remove('active');
        });

        // bruno: Fechar se clicar fora da modal (mantendo funcionalidade do modal.js)
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                modalOverlay.classList.remove('active'); //
            }
        });