function atualizarNavbar() {
    fetch("../php/status_login.php")
        .then(res => res.json())
        .then(data => {
            const loginNavbar = document.getElementById('loginNavbar');
            
            if (data.logado) {
                
                loginNavbar.innerHTML = `
                    <div class="user-dropdown">
                        <div class="user-avatar">
                            <i class="bi bi-person-circle"></i>
                        </div>
                        <div class="dropdown-menu">
                            <div class="user-info">
                                <strong>${data.email}</strong>
                                <span>${data.tipo_user === 'user' ? 'Atleta' : 'Instituição'}</span>
                            </div>
                            <div class="dropdown-divider"></div>
                            <a href="../php/logout.php" class="dropdown-item">
                                <i class="bi bi-box-arrow-right"></i>
                                Sair
                            </a>
                        </div>
                    </div>
                `;
            } else {
                
                loginNavbar.innerHTML = `<a href="login.html" class="login-btn">Entrar</a>`;
            }
        })
        .catch(err => console.error("Erro:", err));
}


document.addEventListener('DOMContentLoaded', function() {
    atualizarNavbar();
});
