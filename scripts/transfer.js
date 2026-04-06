// scripts/transfer.js



// Use postJSON helper if available, else define it
if (typeof postJSON !== 'function') {
    window.postJSON = async function(url, body) {
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(body)
        });
        const data = await res.json().catch(() => ({}));
        return { ok: res.ok, status: res.status, data };
    };
}

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('transfer-form');
    const resultDiv = document.getElementById('transfer-result');

    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        resultDiv.textContent = '';

        const to_username = document.getElementById('to_username').value;
        const amount = parseFloat(document.getElementById('amount').value);

        try {
            const { ok, data } = await postJSON(apiUrl('/api/account/transfer'), { to_username, amount });
            if (ok && data.success) {
                resultDiv.innerHTML = `<p>Transferência realizada com sucesso!</p>
                    <p>Seu saldo: <strong>${data.saldo_sender}</strong></p>`;
            } else {
                resultDiv.innerHTML = `<p style=\"color:red;\">Erro na transferência.</p>`;
            }
        } catch (err) {
            resultDiv.innerHTML = `<p style=\"color:red;\">Erro ao conectar ao servidor.</p>`;
        }
    });
});
