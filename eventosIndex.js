//Pegando no banco de dados os eventos
fetch("../php/infoEvento.php")
    .then(res => res.json())
    .then(info => {
        let count = 1;

        info.forEach(element => {
            // quebrar o laço para no máximo mostrar 3
            if(count == 4)
            {
                return false;
            }
             // Criar elemento principal
                const card = document.createElement("div");
                card.classList.add("evento-card");

                // Inserir o HTML interno com template string, colocando os valores conseguidos do banco
                card.innerHTML = `
                    <div class="evento-imagem">
                        <img src="../imgs/${element.esporte}" alt="${element.esporte}">
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
                        <form method="POST" action="../php/inscricaoIndex.php" >
                        <button class="btn-inscrever" name="idevento" value="${element.ideventos}" >Inscrever-se</button>
                        </form>
                    </div>
                `;

                // Adicionar o card ao container principal no HTML
                let eventoCard = document.querySelector('.eventos-grid');
                try{
                    eventoCard.appendChild(card);

                }
                catch(error)
                {
                    alert("houve o erro -> " + error)
                }
                count += 1;
        });
    })
    .catch(error)
    {
        alert("Error!");
    }
