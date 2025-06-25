document.getElementById("signup-form").addEventListener("submit", async function (event) {
    event.preventDefault(); // Evita que a página recarregue

    const name = document.getElementById("username").value.trim(); // Pega o nome digitado
    const email = document.getElementById("email").value.trim(); // Pega o email digitado
    const password = document.getElementById("password").value.trim(); // Pega a senha digitada
    const birthDateInput = document.getElementById("birthDate").value.trim(); // Pega a data de nascimento digitada
    const birthDate = new Date(birthDateInput).toISOString().split("T")[0]; // Converte para YYYY-MM-DD

    console.log("Data de nascimento enviada:", birthDate); // Verifica o formato da data

    // Verifica se todos os campos estão preenchidos
    if (!name || !email || !password || !birthDate) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    try {
        // Envia os dados para o backend
        const response = await fetch("http://localhost:3000/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, email, password, birthDate }),
        });

        if (!response.ok) {
            const error = await response.json();
            console.log("Erro retornado pelo backend:", error);
            alert(error.error || "Erro ao criar conta");
            return;
        }

        // Se deu certo, exibe uma mensagem e redireciona para o login
        alert("Conta criada com sucesso! Faça login para continuar.");
        window.location.href = "login.html"; // Redireciona para a página de login
    } catch (error) {
        console.error("Erro ao criar conta:", error);
        alert("Erro ao conectar ao servidor.");
    }
});

// Alterna a visibilidade da senha
function togglePassword() {
    const passwordField = document.getElementById("password");
    passwordField.type = passwordField.type === "password" ? "text" : "password";
}