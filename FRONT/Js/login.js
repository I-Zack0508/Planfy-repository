async function validateForm(event) {
    event.preventDefault(); // Evita que a página recarregue

    const email = document.getElementById("email").value; // Pega o email digitado
    const password = document.getElementById("password").value; // Pega a senha digitada

    try {
        // Envia os dados para o backend
        const response = await fetch("http://localhost:3000/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            // Se algo deu errado, mostra o erro
            const error = await response.json();
            alert(error.error || "Erro ao fazer login");
            return;
        }

        // Se deu certo, pega o token
        const data = await response.json();
        localStorage.setItem("token", data.token); // Guarda o token no navegador

        // Salva o usuário no localStorage (se o backend retornar o usuário)
        if (data.user) {
            localStorage.setItem("user", JSON.stringify(data.user));
        }

        // Aguarda 1 segundo antes de redirecionar
        setTimeout(() => {
            window.location.href = "index.html";
        }, 1000);
    } catch (error) {
        console.error("Erro ao fazer login:", error);
        alert("Erro ao conectar ao servidor.");
    }
}

function togglePassword() {
    const passwordField = document.getElementById("password");
    passwordField.type = passwordField.type === "password" ? "text" : "password";
}