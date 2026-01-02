//saber qual usuário está logado
fetch("../php/status_login.php")
        .then(res => res.json())
        .then(data => {
            if(data.tipo_user === "user" || !data.logado)
            {
                Swal.fire({
                icon: 'error',
                title: 'Criação de evento',
                text: 'Você está logado com atleta ou não está logado! Não é possível criar um evento',
                confirmButtonText: 'Ok'

                }).then((result) => {
                    if(result.isConfirmed){
                        window.location.href = "../html/index.html";
                    }

                });
            }

        })
        .catch(err => console.error("Erro:", err));


document.getElementById('organizadorTelefone')?.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length <= 11) {
        value = value.replace(/^(\d{2})(\d)/, '($1) $2');
        value = value.replace(/(\d{5})(\d)/, '$1-$2');
    }
    
    e.target.value = value;
});

document.getElementById('organizadorWhatsapp')?.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length <= 11) {
        value = value.replace(/^(\d{2})(\d)/, '($1) $2');
        value = value.replace(/(\d{5})(\d)/, '$1-$2');
    }
    
    e.target.value = value;
});


document.getElementById('formCriarEvento').addEventListener('submit', function(e) {
    const nome = document.getElementById('eventoNome').value;
    const data = document.getElementById('eventoData').value;
    const vagas = document.getElementById('eventoVagas').value;
    
   
    if (!nome || !data || !vagas) {
        e.preventDefault();
        alert('Por favor, preencha todos os campos obrigatórios!');
        return;
    }
    
  
    const hoje = new Date().toISOString().split('T')[0];
    if (data < hoje) {
        e.preventDefault();
        alert('A data do evento não pode ser no passado!');
        return;
    }
    
   
    if (vagas < 1) {
        e.preventDefault();
        alert('O número de vagas deve ser pelo menos 1!');
        return;
    }
    
    
    alert('Evento criado com sucesso! Em breve estará disponível para inscrições.');
});


document.getElementById('usarGeolocalizacao').addEventListener('change', function(e) {
    if (this.checked) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    
                    
                    alert('Localização capturada! Latitude: ' + lat + ', Longitude: ' + lng);
                    
                    
                    document.getElementById('eventoCidade').value = 'São Paulo';
                },
                function(error) {
                    alert('Não foi possível obter sua localização. Preencha o endereço manualmente.');
                    document.getElementById('usarGeolocalizacao').checked = false;
                }
            );
        } else {
            alert('Geolocalização não suportada pelo navegador.');
            document.getElementById('usarGeolocalizacao').checked = false;
        }
    }
});


document.addEventListener('DOMContentLoaded', function() {
    const hoje = new Date().toISOString().split('T')[0];
    document.getElementById('eventoData').min = hoje;
    
   
    const usuarioLogado = sessionStorage.getItem('user_name');
    const usuarioEmail = sessionStorage.getItem('user_email');
    
    if (usuarioLogado) {
        document.getElementById('organizadorNome').value = usuarioLogado;
    }
    if (usuarioEmail) {
        document.getElementById('organizadorEmail').value = usuarioEmail;
    }
});