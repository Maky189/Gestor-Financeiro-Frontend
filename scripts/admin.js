// admin.js

function fetchUsers() {
    fetch(apiUrl('/api/users'), { credentials: 'include' })
    .then(res => {
        if (!res.ok) throw new Error('Erro ao buscar usuários');
        return res.json();
    })
    .then(users => renderUsers(users))
    .catch(err => alert('Erro ao buscar usuários: ' + err));
}

function renderUsers(users) {
    const tbody = document.querySelector('#users-table tbody');
    tbody.innerHTML = '';
    users.forEach(user => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${user.id}</td>
            <td>${user.nome || ''}</td>
            <td>${user.apelido || ''}</td>
            <td>${user.username || ''}</td>
            <td>${user.morada || ''}</td>
            <td>${user.email || ''}</td>
            <td>${user.telefone || ''}</td>
            <td>${user.hora_de_registo ? new Date(user.hora_de_registo).toLocaleString() : ''}</td>
            <td>
                <button onclick="editUser(${user.id})">Editar</button>
                <button onclick="deleteUser(${user.id})">Deletar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

window.editUser = function(id) {
    const name = prompt('Novo nome:');
    const admin = confirm('Tornar admin?');
    fetch(apiUrl(`/api/users/${id}`), {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, admin })
    })
    .then(res => {
        if (!res.ok) throw new Error('Erro ao editar usuário');
        fetchUsers();
    })
    .catch(err => alert(err));
}

window.deleteUser = function(id) {
    if (!confirm('Deseja realmente deletar este usuário?')) return;
    fetch(apiUrl(`/api/users/${id}`), { method: 'DELETE', credentials: 'include' })
    .then(res => {
        if (!res.ok) throw new Error('Erro ao deletar usuário');
        fetchUsers();
    })
    .catch(err => alert(err));
}

fetchUsers();
