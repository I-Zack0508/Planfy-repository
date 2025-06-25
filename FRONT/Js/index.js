// Abertura de Menu
const menuToggle = document.querySelector('.menu-toggle');
const navHeader = document.querySelector('.nav-header');


function toggleMenu() {
    navHeader.classList.toggle('active');
}

menuToggle.onclick = toggleMenu;

// Modal
document.addEventListener("DOMContentLoaded", function () {
    const taskModal = document.getElementById("task-modal");
    const saveTaskBtn = document.getElementById("save-task-btn");
    const cancelTaskBtn = document.getElementById("cancel-task-btn");
    const creationButton = document.querySelector(".creation");
    const taskText = document.getElementById("task-text");
    const taskCategory = document.getElementById("task-category");
    const recurrenceDisplay = document.getElementById("task-recurrence-display");
    const recurrenceCheckboxes = document.querySelectorAll("#task-recurrence-options input[type='checkbox']");
    const taskTime = document.getElementById("task-time");

    let isPageReloaded = false;

    // Abrir modal ao clicar no botão de criação
    creationButton.addEventListener("click", function () {
        document.getElementById("modal-title").textContent = "Nova Tarefa";
        taskModal.style.display = "flex";
    });

    // Fechar modal ao clicar no botão de cancelar
    cancelTaskBtn.addEventListener("click", function () {
        taskModal.style.display = "none";
    });

    // Bloquear checkboxes de dias da semana se for "Diária"
    function updateCheckboxes() {
        const isDiaria = taskCategory.value === "diaria";

        recurrenceCheckboxes.forEach(checkbox => {
            checkbox.disabled = isDiaria;
            if (isDiaria) {
                checkbox.checked = false;
            }
        });

        if (recurrenceDisplay) {
            recurrenceDisplay.value = isDiaria ? "" : "Selecione os dias";
        }
    }

    updateCheckboxes();

    taskCategory.addEventListener("change", updateCheckboxes);

    // Validação antes de salvar a tarefa
    saveTaskBtn.addEventListener("click", function () {
        const taskValue = taskText.value.trim();
        const selectedCheckboxes = Array.from(recurrenceCheckboxes).filter(checkbox => checkbox.checked);
        const isDiaria = taskCategory.value === "diaria";
        const taskTimeValue = taskTime.value.trim();

        // Verifica se o campo de texto está vazio
        if (!taskValue) {
            alert("Por favor, preencha o nome da tarefa.");
            return;
        }

        // Verifica se o seletor de hora está vazio
        if (!taskTimeValue) {
            alert("Por favor, selecione uma hora.");
            return;
        }

        // Se não for "Diária", verificar se ao menos um dia foi selecionado
        if (!isDiaria && selectedCheckboxes.length === 0) {
            alert("Por favor, selecione pelo menos um dia da semana.");
            return;
        }

        // Se todas as verificações passaram
        alert(`Tarefa criada com sucesso!`);

        taskModal.style.display = "none";

        // Limpar os campos após salvar
        taskText.value = "";
        taskCategory.value = "semanal";
        recurrenceCheckboxes.forEach(checkbox => (checkbox.checked = false));
        taskTime.value = "";

        if (recurrenceDisplay) {
            recurrenceDisplay.value = "Selecione os dias";
        }

        if (!isPageReloaded) {
            isPageReloaded = true;
            location.reload();
        }

    });
});

// Sistema d ancoragem
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            smoothScrollTo(targetElement);
        }
    });
});

function smoothScrollTo(element) {
    const startPosition = window.scrollY;
    const targetPosition = element.offsetTop;
    const distance = targetPosition - startPosition;
    const duration = 200;
    let startTime = null;

    function animation(currentTime) {
        if (!startTime) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        window.scrollTo(0, startPosition + distance * progress);

        if (timeElapsed < duration) {
            requestAnimationFrame(animation);
        }
    }

    requestAnimationFrame(animation);
}