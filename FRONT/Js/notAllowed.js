document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token"); // Verifica se o token está armazenado

    if (!token) {
        // Se o token não existir, redireciona para a página de login após 0,5s
        setTimeout(() => {
            window.location.href = "login.html";
        }, 500);
        return;
    }

    try {
        // Decodifica o token para verificar sua validade (usando jwt-decode)
        const decoded = jwt_decode(token); // Certifique-se de incluir a biblioteca jwt-decode no projeto
        const currentTime = Date.now() / 1000; // Tempo atual em segundos

        if (decoded.exp < currentTime) {
            // Se o token estiver expirado, remove-o e redireciona para o login
            localStorage.removeItem("token");
            window.location.href = "login.html";
            return;
        }
    } catch (error) {
        // Se houver um erro ao decodificar o token, remove-o e redireciona para o login
        console.error("Erro ao verificar o token:", error);
        alert("Houve um problema com sua autenticação. Faça login novamente.");
        localStorage.removeItem("token");
        window.location.href = "login.html";
    }
});