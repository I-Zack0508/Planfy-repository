// Solicita permissão ao usuário para enviar notificações
if (Notification && Notification.permission !== "granted") {
    Notification.requestPermission();
}

// Função para buscar tarefas do backend
async function fetchTasksForNotification() {
    const token = localStorage.getItem("token");
    if (!token) return [];
    try {
        const response = await fetch("http://localhost:3000/api/tasks", {
            headers: { "Authorization": "Bearer " + token }
        });
        if (response.ok) {
            return await response.json();
        }
    } catch (e) {
        // Falha silenciosa
    }
    return [];
}

// Função para verificar e notificar tarefas no horário
async function checkAndNotifyTasks() {
    if (!("Notification" in window) || Notification.permission !== "granted") return;

    const tasks = await fetchTasksForNotification();
    const now = new Date();
    const nowDate = now.toISOString().split("T")[0];
    const nowTime = now.toTimeString().slice(0, 5);

    tasks.forEach(task => {
        const taskDate = task.date.split("T")[0];
        const taskId = `notified_${task._id || task.id || task.name}_${taskDate}_${task.time}`;
        const lastNotified = localStorage.getItem(taskId);

        // Só notifica se for hoje, no horário exato, não concluída e já passou 7 minutos desde a última notificação
        if (
            taskDate === nowDate &&
            task.time === nowTime &&
            !task.completed
        ) {
            const nowTimestamp = Date.now();
            if (!lastNotified || nowTimestamp - Number(lastNotified) > 7 * 60 * 1000) {
                new Notification(`Hora de realizar a tarefa "${task.name}"`);
                localStorage.setItem(taskId, nowTimestamp);
            }
        }
    });
}

// Checa a cada minuto
setInterval(checkAndNotifyTasks, 60000);
// Checa ao carregar a página também
checkAndNotifyTasks();