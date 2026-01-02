document.addEventListener('DOMContentLoaded',
     function() {
    let todosEventos = [];
    const modalidadeSelect = document.getElementById('modalidade');
    const localizacaoSelect = document.getElementById('localizacao');
    const eventosGrid = document.querySelector('.eventos-grid');

    const mapeamentoEsportes = {
        'futebol': 'Futebol',
        'basquete': 'Basquete',
        'volei': 'Vôlei', 
        'corrida': 'Corrida',
        'tenis': 'Tênis',
        'natacao': 'Natação',
        'outros': 'Outros'
    };

    function carregarEventos() {
        fetch("../php/infoEvento.php")
            .then(res => res.json())
            .then(dados => {
                todosEventos = dados;
                aplicarFiltros();
            })
            .catch(error => {
                console.error("Erro:", error);
                eventosGrid.innerHTML = `
                    <div class="no-events">
                        <div class="no-events-icon">
                            <i class="bi bi-exclamation-triangle"></i>
                        </div>
                        <h3>Erro ao carregar eventos</h3>
                        <p>Tente recarregar a página</p>
                    </div>
                `;
            });
    }

    
    function aplicarFiltros() {
        const modalidadeFiltro = modalidadeSelect.value;
        const localizacaoFiltro = localizacaoSelect.value;

        eventosGrid.innerHTML = '';

        let eventosFiltrados = todosEventos.filter(evento => {
            
            let modalidadeCorreta;
            if (modalidadeFiltro === 'todos') {
                modalidadeCorreta = true;
            } else {
                const esporteFiltro = mapeamentoEsportes[modalidadeFiltro];
                const esporteEvento = evento.esporte ? evento.esporte.trim() : '';
                modalidadeCorreta = esporteEvento === esporteFiltro;
            }

            let localizacaoCorreta;
            if (localizacaoFiltro === 'todos') {
                localizacaoCorreta = true;
            } else {
                const localEvento = evento.local ? evento.local.toLowerCase() : '';
                localizacaoCorreta = localEvento.includes(localizacaoFiltro.toLowerCase());
            }

            return modalidadeCorreta && localizacaoCorreta;
        });

    
        if (eventosFiltrados.length === 0) {
            eventosGrid.innerHTML = `
                <div class="no-events">
                    <div class="no-events-icon">
                        <i class="bi bi-search"></i>
                    </div>
                    <h3>Nenhum evento encontrado</h3>
                    <p>Tente alterar os filtros</p>
                </div>
            `;
        } else {
            eventosFiltrados.forEach(element => {
                const card = document.createElement("div");
                card.classList.add("evento-card");

                card.innerHTML = `
                    <div class="evento-imagem">
                        <img src="../imgs/${element.esporte}.png" alt="${element.esporte}">
                        <span class="categoria ${element.categoria}">${element.categoria}</span>
                    </div>
                    <div class="evento-info">
                        <h3>${element.nome}</h3>
                        <p class="localizacao"><i class="bi bi-geo-alt"></i> ${element.local}</p>
                        <p class="data"><i class="bi bi-calendar"></i> ${element.data}</p>
                        <div class="evento-stats">
                            <span class="participantes"><i class="bi bi-people"></i> ${element.numeroVagas}/${element.numeroVagas}</span>
                            <span class="dificuldade ${element.dificuldade}">${element.dificuldade}</span>
                        </div>

                        <form method="POST" action="../php/inscricao.php" >
                        <button class="btn-inscrever" name="idevento" value="${element.ideventos}" >Inscrever-se</button>
                        </form>
                    </div>
                `;

                eventosGrid.appendChild(card);
            });
        }
    }

    function configurarFiltros() {
        modalidadeSelect.addEventListener('change', aplicarFiltros);
        localizacaoSelect.addEventListener('change', aplicarFiltros);
    }

    
    function inscrever(idEvento) {   
        fetch("../php/status_login.php")
        .then(res => res.json())
        .then(data => {
            if(!data.logado || data.tipo_user == "institution") {
                Swal.fire({
                    icon: 'error',
                    title: 'Inscrição',
                    text: 'Você não pode se inscrever! pode estar deslogado ou logado como instituição',
                    confirmButtonText: 'Ok'
                }).then((result) => {
                    if(result.isConfirmed){
                        window.location.href = "../html/index.html";
                    }
                });
            } else {
               
                Swal.fire({
                    icon: 'success',
                    title: 'Inscrição',
                    text: 'Inscrição realizada com sucesso!',
                    confirmButtonText: 'Ok'
                });
            }
        });
    }

    window.inscrever = inscrever;

    carregarEventos();
    configurarFiltros();
});