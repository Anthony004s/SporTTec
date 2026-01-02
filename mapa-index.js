document.addEventListener('DOMContentLoaded', function() {
    let map;
    let userMarker;
    let eventMarkers = [];

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

    function initMap(latitude, longitude) {
        map = L.map('map').setView([latitude, longitude], 13);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);
        
        userMarker = L.marker([latitude, longitude])
            .addTo(map)
            .bindPopup('<div class="popup-content"><i class="bi bi-geo-alt-fill"></i><strong>Sua localização</strong></div>')
            .openPopup();
        
        
        buscarEventosReais(latitude, longitude);
    }
    
    function buscarEventosReais(userLat, userLng) {
        fetch('../php/buscarEventosMapa.php')
            .then(response => response.json())
            .then(data => {
                if (data.success && data.eventos.length > 0) {
                    adicionarEventosNoMapa(data.eventos, userLat, userLng);
                } else {
                    
                    adicionarEventosSimulados(userLat, userLng);
                }
            })
            .catch(error => {
                console.error('Erro ao buscar eventos:', error);
                adicionarEventosSimulados(userLat, userLng);
            });
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
                
                const offsetLat = (Math.random() - 0.5) * 0.02;
                const offsetLng = (Math.random() - 0.5) * 0.02;
                lat = userLat + offsetLat;
                lng = userLng + offsetLng;
            }
            
           
            const distancia = calcularDistancia(userLat, userLng, lat, lng);
            
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
                        <p><i class="bi bi-geo-alt"></i> ${distancia.toFixed(1)}km de distância</p>
                        <p><i class="bi bi-people"></i> ${evento.participantes || 'N/A'} participantes</p>
                        <p><i class="bi bi-clock"></i> ${evento.horario || 'N/A'}</p>
                        <p><i class="bi bi-calendar"></i> ${evento.data || 'N/A'}</p>
                        <button class="btn-inscrever" onclick="window.location.href='geolocalizacao.html'">Ver Detalhes</button>
                    </div>
                `);
            
            eventMarkers.push(marker);
        });
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
    
    
    function adicionarEventosSimulados(userLat, userLng) {
        const eventos = [
            {
                nome: "Torneio de Futebol Society",
                lat: userLat + 0.005,
                lng: userLng + 0.005,
                tipo: "Futebol",
                participantes: 12,
                distancia: "2.3km",
                horario: "14:00"
            },
            
        ];
        
        eventos.forEach(evento => {
            const icone = L.divIcon({
                html: `<div style="background: ${sportColors[evento.tipo]}; width: 25px; height: 25px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-size: 12px; font-weight: bold;">${evento.participantes}</div>`,
                className: 'event-marker',
                iconSize: [25, 25]
            });
            
            const marker = L.marker([evento.lat, evento.lng], { icon: icone })
                .addTo(map)
                .bindPopup(`
                    <div class="popup-content">
                        <h4>${evento.nome}</h4>
                        <p><i class="bi bi-geo-alt"></i> ${evento.distancia}</p>
                        <p><i class="bi bi-people"></i> ${evento.participantes} participantes</p>
                        <p><i class="bi bi-clock"></i> ${evento.horario}</p>
                        <button class="btn-inscrever" onclick="window.location.href='geolocalizacao.html'">Ver Detalhes</button>
                    </div>
                `);
            
            eventMarkers.push(marker);
        });
    }
    
    function iniciarGeolocalizacao() {
        if (!navigator.geolocation) {
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
                initMap(lat, lng);
            },
            function(error) {
                initMap(-23.5505, -46.6333);
            },
            options
        );
    }
    
    iniciarGeolocalizacao();
});