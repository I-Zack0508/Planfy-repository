// Script de carregamento de foto de usuário
async function carregarFotoUsuario() {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
        const response = await fetch('http://localhost:3000/api/user/profile', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) return;

        const userData = await response.json();
        if (userData.profilePic) {
            // Atualiza a foto do perfil principal
            const imgPerfil = document.getElementById('profile-image');
            if (imgPerfil) imgPerfil.src = 'http://localhost:3000' + userData.profilePic;

            // Atualiza a foto do header (adicione id="header-profile-image" na tag <img> do header)
            const imgHeader = document.getElementById('header-profile-image');
            if (imgHeader) imgHeader.src = 'http://localhost:3000' + userData.profilePic;
        }
    } catch (error) {
        console.error('Erro ao carregar foto do usuário:', error);
    }
}

// Chame essa função ao carregar a página:
document.addEventListener('DOMContentLoaded', carregarFotoUsuario);