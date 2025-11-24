document.getElementById("formCadastro").addEventListener("submit", function(e){
    e.preventDefault();

    let senha = document.getElementById("senha").value;
    let confirmar = document.getElementById("confirmarSenha").value;
    let msg = document.getElementById("mensagem");

    if (senha !== confirmar) {
        msg.style.color = "red";
        msg.textContent = "As senhas não coincidem!";
        return;
    }

    msg.style.color = "green";
    msg.textContent = "Conta criada com sucesso!";

    // Aqui vocês futuramente vão conectar ao backend
});
