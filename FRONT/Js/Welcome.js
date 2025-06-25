window.addEventListener('DOMContentLoaded', function () {
    const userStr = localStorage.getItem('user');
    if (userStr) {
        try {
            const user = JSON.parse(userStr);
            // Troque 'name' por 'nome'
            if (user.nome) {
                const firstName = user.nome.split(' ')[0];
                const banner = document.getElementById('banner-ola');
                if (banner) {
                    banner.textContent = `Olá ${firstName}`;
                }
            }
        } catch (e) {
            // Se der erro, não faz nada
        }
    }
});