document.addEventListener("DOMContentLoaded", () => {
    /* ==== INFORMAÇÕES DO USUÁRIO ==== */
    const nome = localStorage.getItem("nome");
    const email = localStorage.getItem("email");
    const senha = localStorage.getItem("senha");
    const dataCriacao = localStorage.getItem("dataCriacao");

    if (nome && email && senha) {
        const nameEl = document.getElementById("name");
        const emailEl = document.getElementById("email");
        const passwordEl = document.getElementById("password");
        const dateEl = document.getElementById("date");

        if (nameEl) nameEl.textContent = nome;
        if (emailEl) emailEl.textContent = email;
        if (passwordEl) passwordEl.textContent = "*".repeat(senha.length);
        if (dateEl) dateEl.textContent = dataCriacao || "Data não disponível";
    }

    /* ==== MODAL DE EDIÇÃO DE PERFIL ==== */
    const editProfileModal = document.getElementById("edit-profile-modal");
    const editButton = document.querySelector(".edition");
    const saveProfileBtn = document.getElementById("save-profile-btn");
    const cancelProfileBtn = document.getElementById("cancel-profile-btn");

    if (editButton) {
        editButton.addEventListener("click", () => {
            document.getElementById("edit-name").value = document.getElementById("name").textContent;
            document.getElementById("edit-email").value = document.getElementById("email").textContent;
            document.getElementById("edit-password").value = "";
            editProfileModal.style.display = "flex";
        });
    }

    if (cancelProfileBtn) {
        cancelProfileBtn.addEventListener("click", () => {
            editProfileModal.style.display = "none";
        });
    }

    if (saveProfileBtn) {
        saveProfileBtn.addEventListener("click", () => {
            const name = document.getElementById("edit-name").value.trim();
            const email = document.getElementById("edit-email").value.trim();
            const currentPassword = document.getElementById("current-password").value.trim();
            const newPassword = document.getElementById("edit-password").value.trim();

            if (!name || !email || !currentPassword || !newPassword) {
                alert("Preencha todos os campos.");
                return;
            }

            if (name.length < 5 || name.length > 56) {
                alert("O nome deve ter entre 5 e 56 caracteres.");
                return;
            }

            if (email.length < 6 || email.length > 56) {
                alert("O e-mail deve ter entre 6 e 56 caracteres.");
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const validDomains = ["hotmail.com", "yahoo.com", "gmail.com", "outlook.com", "icloud.com"];
            const domain = email.split("@")[1];

            if (!emailRegex.test(email) || !validDomains.includes(domain)) {
                alert("E-mail incorreto. Use um domínio válido como gmail.com.");
                return;
            }

            if (/\s/.test(newPassword)) {
                alert("A senha não pode conter espaços.");
                return;
            }

            const senhaRegex = /^(?=(?:.*\d){2}).{4,16}$/;
            if (!senhaRegex.test(newPassword)) {
                alert("A senha precisa ter entre 4 e 16 caracteres e pelo menos dois números.");
                return;
            }

            // Atualiza os dados no perfil visível
            document.getElementById("name").textContent = name;
            document.getElementById("email").textContent = email;
            document.getElementById("password").textContent = "*".repeat(newPassword.length);

            // Salva no localStorage
            localStorage.setItem("nome", name);
            localStorage.setItem("email", email);
            localStorage.setItem("senha", newPassword);

            // Atualiza também a div .name-user
            const nomeUserEl = document.querySelector(".name-user");
            if (nomeUserEl) nomeUserEl.textContent = name;

            // Fecha o modal
            editProfileModal.style.display = "none";
            // alert("Perfil atualizado com sucesso!");
        });
    }

    /* ==== MODAL DE CRIAÇÃO DE TAREFA ==== */
    const taskModal = document.getElementById("task-modal");
    const creationButton = document.querySelector(".creation");
    const saveTaskBtn = document.getElementById("save-task-btn");
    const cancelTaskBtn = document.getElementById("cancel-task-btn");
    const taskText = document.getElementById("task-text");
    const taskCategory = document.getElementById("task-category");
    const recurrenceDisplay = document.getElementById("task-recurrence-display");
    const recurrenceCheckboxes = document.querySelectorAll("#task-recurrence-options input[type='checkbox']");
    const taskTime = document.getElementById("task-time");

    if (creationButton && taskModal) {
        creationButton.addEventListener("click", () => {
            document.getElementById("modal-title").textContent = "Nova Tarefa";
            taskModal.style.display = "flex";
        });
    }

    if (cancelTaskBtn) {
        cancelTaskBtn.addEventListener("click", () => {
            taskModal.style.display = "none";
        });
    }

    function updateCheckboxes() {
        const isDiaria = taskCategory.value === "diaria";

        recurrenceCheckboxes.forEach(checkbox => {
            checkbox.disabled = isDiaria;
            if (isDiaria) checkbox.checked = false;
        });

        if (recurrenceDisplay) {
            recurrenceDisplay.value = isDiaria ? "" : "Selecione os dias";
        }
    }

    if (taskCategory) {
        taskCategory.addEventListener("change", updateCheckboxes);
        updateCheckboxes();
    }

    if (saveTaskBtn) {
        saveTaskBtn.addEventListener("click", () => {
            const taskValue = taskText.value.trim();
            const taskTimeValue = taskTime.value.trim();
            const isDiaria = taskCategory.value === "diaria";
            const selectedDays = Array.from(recurrenceCheckboxes).filter(cb => cb.checked);

            if (!taskValue) {
                alert("Por favor, preencha o nome da tarefa.");
                return;
            }

            if (!taskTimeValue) {
                alert("Por favor, selecione uma hora.");
                return;
            }

            if (!isDiaria && selectedDays.length === 0) {
                alert("Por favor, selecione pelo menos um dia da semana.");
                return;
            }

            alert("Tarefa criada com sucesso!");
            taskModal.style.display = "none";

            taskText.value = "";
            taskTime.value = "";
            taskCategory.value = "semanal";
            recurrenceCheckboxes.forEach(cb => (cb.checked = false));
            if (recurrenceDisplay) recurrenceDisplay.value = "Selecione os dias";
        });
    }

    /* ==== TROCA DE IMAGEM DE PERFIL ==== */
    const profileEditBtn = document.getElementById("edit-button");
    const imageInput = document.getElementById("image-input");
    const profileImage = document.getElementById("profile-image");

    if (profileEditBtn && imageInput && profileImage) {
        profileEditBtn.addEventListener("click", () => {
            imageInput.click();
        });

        imageInput.addEventListener("change", function () {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    profileImage.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    /* ==== ROLAGEM SUAVE EM ÂNCORAS ==== */
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener("click", function (e) {
            e.preventDefault();
            const targetId = this.getAttribute("href");
            const target = document.querySelector(targetId);
            if (target) {
                const offsetTop = target.offsetTop;
                window.scrollTo({ top: offsetTop, behavior: "smooth" });
            }
        });
    });
});

/* ==== SALVAMENTO DO NOME DE USUARIO ==== */
document.addEventListener("DOMContentLoaded", function () {
    const nomeUsuario = localStorage.getItem("nome");
    const nomeDiv = document.querySelector(".name-user");

    if (nomeUsuario && nomeDiv) {
        nomeDiv.textContent = nomeUsuario;
    }
});