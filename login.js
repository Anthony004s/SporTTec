// Alternância entre login e cadastro
const loginToggle = document.getElementById('loginToggle');
const registerToggle = document.getElementById('registerToggle');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

loginToggle.addEventListener('click', () => {
    loginToggle.classList.add('active');
    registerToggle.classList.remove('active');
    loginForm.classList.add('active');
    registerForm.classList.remove('active');
});

registerToggle.addEventListener('click', () => {
    registerToggle.classList.add('active');
    loginToggle.classList.remove('active');
    registerForm.classList.add('active');
    loginForm.classList.remove('active');
});

// Alternância entre tipo de usuário (Atleta/Instituição)
const userTypeButtons = document.querySelectorAll('.user-type-btn');
const userForms = document.querySelectorAll('.user-form');
const loginUserType = document.getElementById('loginUserType');

userTypeButtons.forEach(button => {
    button.addEventListener('click', () => {
        const type = button.getAttribute('data-type');
        
        userTypeButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        if (loginUserType) {
            loginUserType.value = type;
        }

        userForms.forEach(form => {
            if (form.id === `register${type.charAt(0).toUpperCase() + type.slice(1)}Form`) {
                form.classList.add('active');
            } else {
                form.classList.remove('active');
            }
        });
    });
});

// Alternar visibilidade da senha
const toggleButtons = document.querySelectorAll('.toggle-password');

toggleButtons.forEach(button => {
    button.addEventListener('click', () => {
        const input = button.previousElementSibling;
        const icon = button.querySelector('i');
        
        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.remove('bi-eye');
            icon.classList.add('bi-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.remove('bi-eye-slash');
            icon.classList.add('bi-eye');
        }
    });
});

// Validação de formulários
document.getElementById('loginUserForm').addEventListener('submit', function(e) {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        e.preventDefault();
        alert('Por favor, preencha todos os campos!');
        return;
    }
});

document.getElementById('registerUserForm').addEventListener('submit', function(e) {
    const password = document.getElementById('userPassword').value;
    const confirmPassword = document.getElementById('userConfirmPassword').value;
    
    if (password !== confirmPassword) {
        e.preventDefault();
        alert('As senhas não coincidem!');
        return;
    }
    
    if (password.length < 6) {
        e.preventDefault();
        alert('A senha deve ter pelo menos 6 caracteres!');
        return;
    }
});

document.getElementById('registerInstitutionForm').addEventListener('submit', function(e) {
    const password = document.getElementById('institutionPassword').value;
    const confirmPassword = document.getElementById('institutionConfirmPassword').value;
    
    if (password !== confirmPassword) {
        e.preventDefault();
        alert('As senhas não coincidem!');
        return;
    }
    
    if (password.length < 6) {
        e.preventDefault();
        alert('A senha deve ter pelo menos 6 caracteres!');
        return;
    }
});

// Recuperação de senha
document.getElementById('forgotPassword').addEventListener('click', function(e) {
    e.preventDefault();
    const email = prompt('Digite seu e-mail para recuperação de senha:');
    if (email) {
        alert(`Um link de recuperação foi enviado para: ${email}`);
    }
});

// Formatação de CPF
document.getElementById('userCPF')?.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length <= 11) {
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    
    e.target.value = value;
});

// Formatação de CNPJ
document.getElementById('institutionCNPJ')?.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length <= 14) {
        value = value.replace(/^(\d{2})(\d)/, '$1.$2');
        value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
        value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
        value = value.replace(/(\d{4})(\d)/, '$1-$2');
    }
    
    e.target.value = value;
});

// Formatação de telefone
const phoneInputs = document.querySelectorAll('input[type="tel"]');
phoneInputs.forEach(input => {
    input.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length <= 11) {
            value = value.replace(/^(\d{2})(\d)/, '($1) $2');
            value = value.replace(/(\d{5})(\d)/, '$1-$2');
        }
        
        e.target.value = value;
    });
});