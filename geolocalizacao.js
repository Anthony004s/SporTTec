document.addEventListener('DOMContentLoaded', function() {
    let map;
    let userMarker;
    let eventMarkers = [];
    let userLocation = null;
    let todosEventos = []; 

    const locationStatus = document.getElementById('location-status');
    const searchStatus = document.getElementById('search-status');
    const eventsResults = document.getElementById('events-results');
    const radiusSelect = document.getElementById('radius-select');
    const sportSelect = document.getElementById('sport-select');

    const sportColors = {
        'Futebol': '#e74c3c',
        'Corrida': '#3498db',
        'Basquete': '#2ecc71',
        'Vôlei': '#9b59b6',
        'Natação': '#1abc9c',
        'Tênis': '#f39c12',
        'Ciclismo': '#8e44ad',
        'Outros': '#95a5a6'
    };

    const sportNames = {
        'Futebol': 'Futebol',
        'Corrida': 'Corrida',
        'Basquete': 'Basquete',
        'Vôlei': 'Vôlei',
        'Natação': 'Natação',
        'Tênis': 'Tênis',
        'Ciclismo': 'Ciclismo',
        'Outros': 'Outros'
    };

    function initMap(latitude, longitude) {
        map = L.map('map').setView([latitude, longitude], 13);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);
        
        userMarker = L.marker([latitude, longitude])
            .addTo(map)
            .bindPopup('<div class="popup-content"><i class="bi bi-geo-alt-fill"></i><strong>Sua localização atual</strong></div>')
            .openPopup();
        
        buscarEventosProximos(latitude, longitude);
    }
    
    function buscarEventosProximos(lat, lng) {
        userLocation = { lat, lng };
        const raio = parseInt(radiusSelect.value);
        const modalidade = sportSelect.value;
        
        searchStatus.textContent = `Buscando eventos em ${raio}km...`;
        
       
        fetch('../php/buscarEventosMapa.php')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    todosEventos = data.eventos;
                    filtrarEventos(lat, lng, raio, modalidade);
                } else {
                    searchStatus.textContent = 'Erro ao carregar eventos';
                }
            })
            .catch(error => {
                console.error('Erro:', error);
                searchStatus.textContent = 'Erro ao buscar eventos';
            });
    }
    
    function filtrarEventos(userLat, userLng, raio, modalidade) {
    console.log('Filtrando eventos:', { raio, modalidade, totalEventos: todosEventos.length });
    
    let eventosFiltrados = todosEventos.filter(evento => {
        
        if (!evento.latitude || !evento.longitude) {
            return false;
        }
        
        let lat, lng;
        try {
            lat = parseFloat(evento.latitude);
            lng = parseFloat(evento.longitude);
            
            if (isNaN(lat) || isNaN(lng)) {
                return false;
            }
        } catch (e) {
            return false;
        }
        
        const distancia = calcularDistancia(userLat, userLng, lat, lng);
        evento.distancia = distancia;
        
        const dentroDoRaio = distancia <= raio;
        
        let modalidadeCorreta;
        if (modalidade === 'all') {
            modalidadeCorreta = true;
        } else {
            
            const mapeamentoEsportes = {
                'futebol': 'Futebol',
                'basquete': 'Basquete',
                'volei': 'Vôlei', 
                'corrida': 'Corrida',
                'outros': 'Outros'
            };
            
            const esporteFiltro = mapeamentoEsportes[modalidade];
            const esporteEvento = evento.esporte ? evento.esporte.trim() : '';
            
            modalidadeCorreta = esporteEvento === esporteFiltro;
            
            console.log('Filtro:', {
                valorSelect: modalidade,
                valorMapeado: esporteFiltro,
                valorBanco: esporteEvento,
                match: modalidadeCorreta
            });
        }
        
        return dentroDoRaio && modalidadeCorreta;
    });
    
    
    eventosFiltrados.sort((a, b) => a.distancia - b.distancia);
    
    console.log('Eventos filtrados:', eventosFiltrados.length);
    mostrarResultados(eventosFiltrados);
    adicionarEventosNoMapa(eventosFiltrados);
}
    
    function calcularDistancia(lat1, lon1, lat2, lon2) {
        const R = 6371; 
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }
    
    function mostrarResultados(eventos) {
        if (eventos.length === 0) {
            eventsResults.innerHTML = `
                <div class="no-events">
                    <div class="no-events-icon">
                        <i class="bi bi-map"></i>
                    </div>
                    <h3>Nenhum evento encontrado</h3>
                    <p>Não há eventos no raio selecionado</p>
                </div>
            `;
        } else {
            eventsResults.innerHTML = `
                <div class="section-header">
                    <h2>${eventos.length} Evento(s) Encontrado(s)</h2>
                    <p>Baseado na sua localização atual</p>
                </div>
                <div class="eventos-grid">
                    ${eventos.map(evento => `
                        <div class="evento-card">
                            <div class="evento-imagem">
                                <span class="categoria ${evento.esporte.toLowerCase()}">${sportNames[evento.esporte] || evento.esporte}</span>
                            </div>
                            <div class="evento-info">
                                <h3>${evento.nome}</h3>
                                <p class="localizacao"><i class="bi bi-geo-alt"></i> ${evento.distancia.toFixed(1)} km de distância</p>
                                <p class="data"><i class="bi bi-calendar"></i> ${formatarData(evento.data)} - ${evento.horario || 'N/A'}</p>
                                <div class="evento-stats">
                                    <span class="participantes"><i class="bi bi-people"></i> ${evento.participantes || 'N/A'}/20</span>
                                    <span class="dificuldade ${evento.dificuldade || 'medio'}">${evento.dificuldade || 'Médio'}</span>
                                </div>
                                <form method="POST" action="../php/inscricaoGeolocalizacao.php" >
                            <button class="btn-inscrever" name="idevento" value="${evento.ideventos}" >Inscrever-se</button>
                            </form>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }
        
        searchStatus.textContent = `${eventos.length} evento(s) encontrado(s) em ${radiusSelect.value}km`;
    }
    
    function formatarData(dataString) {
        if (!dataString) return 'Data não definida';
        const data = new Date(dataString + 'T00:00:00');
        return data.toLocaleDateString('pt-BR');
    }
    
    function adicionarEventosNoMapa(eventos, userLat, userLng) {
        
        eventMarkers.forEach(marker => map.removeLayer(marker));
        eventMarkers = [];
        
        eventos.forEach(evento => {
            let lat, lng;
            
            if (evento.latitude && evento.longitude) {
                lat = parseFloat(evento.latitude);
                lng = parseFloat(evento.longitude);
            } else {
                return; 
            }
            
            const icone = L.divIcon({
                html: `<div style="background: ${sportColors[evento.esporte] || sportColors['Outros']}; width: 25px; height: 25px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-size: 12px; font-weight: bold;">${evento.participantes || '?'}</div>`,
                className: 'event-marker',
                iconSize: [25, 25]
            });
            
            const marker = L.marker([lat, lng], { icon: icone })
                .addTo(map)
                .bindPopup(`
                    <div class="popup-content">
                        <h4>${evento.nome}</h4>
                        <p><i class="bi bi-geo-alt"></i> ${evento.distancia.toFixed(1)}km</p>
                        <p><i class="bi bi-people"></i> ${evento.participantes || 'N/A'} participantes</p>
                        <p><i class="bi bi-clock"></i> ${evento.horario || 'N/A'}</p>
                        <p><i class="bi bi-calendar"></i> ${formatarData(evento.data)}</p>
                        <button class="btn-inscrever">Inscrever-se</button>
                    </div>
                `);
            
            eventMarkers.push(marker);
        });
    }
    
    
    radiusSelect.addEventListener('change', function() {
        if (userLocation) {
            buscarEventosProximos(userLocation.lat, userLocation.lng);
        }
    });
    
    sportSelect.addEventListener('change', function() {
        if (userLocation) {
            buscarEventosProximos(userLocation.lat, userLocation.lng);
        }
    });
    
    function iniciarGeolocalizacao() {
        locationStatus.textContent = 'Obtendo localização...';
        
        if (!navigator.geolocation) {
            locationStatus.textContent = 'Geolocalização não suportada';
            initMap(-23.5505, -46.6333);
            return;
        }
        
        const options = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        };
        
        navigator.geolocation.getCurrentPosition(
            function(position) {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                locationStatus.textContent = `Localização obtida com sucesso`;
                locationStatus.style.color = '#2ecc71';
                initMap(lat, lng);
            },
            function(error) {
                locationStatus.textContent = 'Localização padrão (São Paulo)';
                locationStatus.style.color = '#f39c12';
                initMap(-23.5505, -46.6333);
            },
            options
        );
    }
    
    iniciarGeolocalizacao();
});