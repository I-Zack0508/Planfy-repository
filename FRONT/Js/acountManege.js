// Função para fazer logout
function logout() {
    localStorage.removeItem("token"); // Remove o token do localStorage
    alert("Você foi desconectado com sucesso!");
    window.location.href = "login.html"; // Redireciona para a página de login
}

// Adiciona o evento de clique ao botão de logout
document.querySelector(".logOut").addEventListener("click", logout);

