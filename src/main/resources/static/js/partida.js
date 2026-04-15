// partida.js - Barra de evaluación FIJA: BLANCO arriba, NEGRO abajo SIEMPRE

(function() {
    'use strict';
    
    // ========== CONFIGURACIÓN INICIAL ==========
    const config = window.botConfig || { 
        bot: 'principiante', 
        color: 'blanca', 
        elo: '500', 
        nombre: 'Ricardo' 
    };
    
    // Determinar color si es aleatorio
    const colorJugador = config.color === 'aleatoria' 
        ? (Math.random() < 0.5 ? 'blanca' : 'negra') 
        : config.color;
    const colorBot = colorJugador === 'blanca' ? 'negra' : 'blanca';
    
    console.log('Color jugador:', colorJugador);
    console.log('Color bot:', colorBot);
    
    // ========== MAPEO DE ICONOS DE PIEZAS ==========
    const ICONOS_PIEZAS = {
        // Piezas blancas
        'peon-blanco': '/images/icons/piezas/icono-peon-blanco.svg',
        'torre-blanca': '/images/icons/piezas/icono-torre-blanca.svg',
        'caballo-blanco': '/images/icons/piezas/icono-caballo-blanco.svg',
        'alfil-blanco': '/images/icons/piezas/icono-alfil-blanco.svg',
        'reina-blanca': '/images/icons/piezas/icono-dama-blanca.svg',
        'rey-blanco': '/images/icons/piezas/icono-rey-blanco.svg',
        // Piezas negras
        'peon-negro': '/images/icons/piezas/icono-peon-negro.svg',
        'torre-negra': '/images/icons/piezas/icono-torre-negra.svg',
        'caballo-negro': '/images/icons/piezas/icono-caballo-negro.svg',
        'alfil-negro': '/images/icons/piezas/icono-alfil-negro.svg',
        'reina-negra': '/images/icons/piezas/icono-dama-negra.svg',
        'rey-negro': '/images/icons/piezas/icono-rey-negro.svg'
    };
    
    // ========== MAPEO DE AVATARES DE BOTS ==========
    const AVATARES_BOTS = {
        'principiante': '/images/icons/icono-bot-principiante.svg',
        'intermedio': '/images/icons/icono-bot-intermedio.svg',
        'avanzado': '/images/icons/icono-bot-avanzado.svg',
        'maestro': '/images/icons/icono-bot-maestro.svg'
    };
    
    // ========== AVATAR DE USUARIO ==========
    const AVATAR_USUARIO = '/images/icons/icono-usuario.svg';
    
    // ========== INICIALIZACIÓN DEL TABLERO (SOLO VISUAL) ==========
    function inicializarTablero() {
        const tableroElement = document.getElementById('tableroAjedrez');
        if (!tableroElement) {
            console.error('No se encontró el elemento tableroAjedrez');
            return;
        }
        
        tableroElement.innerHTML = '';
        
        // Configurar orientación según color del jugador
        const filas = colorJugador === 'blanca' 
            ? [8, 7, 6, 5, 4, 3, 2, 1]  // Blancas abajo, negras arriba
            : [1, 2, 3, 4, 5, 6, 7, 8]; // Negras abajo, blancas arriba
        
        const columnas = colorJugador === 'blanca' 
            ? ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
            : ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a'];
        
        // Posición inicial de piezas
        const posicionInicial = {
            'a8': 'torre-negra', 'b8': 'caballo-negro', 'c8': 'alfil-negro', 'd8': 'reina-negra',
            'e8': 'rey-negro', 'f8': 'alfil-negro', 'g8': 'caballo-negro', 'h8': 'torre-negra',
            'a7': 'peon-negro', 'b7': 'peon-negro', 'c7': 'peon-negro', 'd7': 'peon-negro',
            'e7': 'peon-negro', 'f7': 'peon-negro', 'g7': 'peon-negro', 'h7': 'peon-negro',
            'a2': 'peon-blanco', 'b2': 'peon-blanco', 'c2': 'peon-blanco', 'd2': 'peon-blanco',
            'e2': 'peon-blanco', 'f2': 'peon-blanco', 'g2': 'peon-blanco', 'h2': 'peon-blanco',
            'a1': 'torre-blanca', 'b1': 'caballo-blanco', 'c1': 'alfil-blanco', 'd1': 'reina-blanca',
            'e1': 'rey-blanco', 'f1': 'alfil-blanco', 'g1': 'caballo-blanco', 'h1': 'torre-blanca'
        };
        
        for (let f = 0; f < 8; f++) {
            for (let c = 0; c < 8; c++) {
                const fila = filas[f];
                const columna = columnas[c];
                const idCasilla = `${columna}${fila}`;
                const esClara = (f + c) % 2 === 0;
                
                const casilla = document.createElement('div');
                casilla.className = `casilla ${esClara ? 'clara' : 'oscura'}`;
                casilla.dataset.posicion = idCasilla;
                casilla.dataset.fila = fila;
                casilla.dataset.columna = columna;
                
                const piezaNombre = posicionInicial[idCasilla];
                if (piezaNombre) {
                    const img = document.createElement('img');
                    img.src = ICONOS_PIEZAS[piezaNombre];
                    img.alt = piezaNombre;
                    img.className = 'pieza';
                    img.dataset.pieza = piezaNombre;
                    img.dataset.color = piezaNombre.includes('blanca') || piezaNombre.includes('blanco') ? 'blanca' : 'negra';
                    img.draggable = false;
                    img.style.pointerEvents = 'none';
                    casilla.appendChild(img);
                }
                
                tableroElement.appendChild(casilla);
            }
        }
        
        // Configurar barra de evaluación (FIJA: blanco arriba, negro abajo)
        configurarBarraEvaluacion();
        
        // Actualizar información de jugadores
        actualizarInfoJugadores();
        
        // Actualizar coordenadas
        actualizarCoordenadas();
    }
    
    // ========== ACTUALIZAR COORDENADAS ==========
    function actualizarCoordenadas() {
        const letrasFilas = document.querySelectorAll('.letras-fila span');
        const letrasNormales = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
        const letrasInvertidas = ['H', 'G', 'F', 'E', 'D', 'C', 'B', 'A'];
        const letrasUsar = colorJugador === 'blanca' ? letrasNormales : letrasInvertidas;
        
        letrasFilas.forEach((span, index) => {
            if (index < 8) span.textContent = letrasUsar[index];
            else if (index < 16) span.textContent = letrasUsar[index - 8];
        });
        
        const numerosIzquierda = document.querySelectorAll('.numeros-columna.izquierda span');
        const numerosDerecha = document.querySelectorAll('.numeros-columna.derecha span');
        const numerosNormales = ['8', '7', '6', '5', '4', '3', '2', '1'];
        const numerosInvertidos = ['1', '2', '3', '4', '5', '6', '7', '8'];
        const numerosUsar = colorJugador === 'blanca' ? numerosNormales : numerosInvertidos;
        
        numerosIzquierda.forEach((span, index) => { if (index < 8) span.textContent = numerosUsar[index]; });
        numerosDerecha.forEach((span, index) => { if (index < 8) span.textContent = numerosUsar[index]; });
    }
    
function configurarBarraEvaluacion() {
    const barraVertical = document.querySelector('.barra-vertical');
    const numeroSuperior = document.querySelector('.numero-superior');
    const numeroInferior = document.querySelector('.numero-inferior');
    const indicador = document.querySelector('.indicador-posicion');

    if (!barraVertical) {
        console.error('No se encontró la barra de evaluación');
        return;
    }

    // Limpiar clases anteriores
    barraVertical.classList.remove('blancas-abajo', 'negras-abajo');

    if (colorJugador === 'blanca') {
        // JUGADOR BLANCAS: barra blanca ABAJO, negra ARRIBA
        barraVertical.classList.add('blancas-abajo');
        
        if (numeroSuperior) {
            numeroSuperior.textContent = '-0.0';  // Negro arriba
            numeroSuperior.style.color = '#000000';
        }
        
        if (numeroInferior) {
            numeroInferior.textContent = '+0.0';  // Blanco abajo
            numeroInferior.style.color = '#ffffff';
        }
        
    } else {
        // JUGADOR NEGRAS: barra negra ABAJO, blanca ARRIBA
        barraVertical.classList.add('negras-abajo');
        
        if (numeroSuperior) {
            numeroSuperior.textContent = '+0.0';  // Blanco arriba
            numeroSuperior.style.color = '#ffffff';
        }
        
        if (numeroInferior) {
            numeroInferior.textContent = '-0.0';  // Negro abajo
            numeroInferior.style.color = '#000000';
        }
    }
    
    if (indicador) {
        indicador.style.top = '50%';
    }
    
    console.log('✅ Barra configurada para:', colorJugador);
} 
    // ========== ACTUALIZAR INFO DE JUGADORES ==========
    function actualizarInfoJugadores() {
        const nombreUsuario = document.getElementById('nombreUsuario');
        const eloUsuario = document.getElementById('eloUsuario');
        const nombreBotElem = document.getElementById('nombreBotPartida');
        const eloBotElem = document.getElementById('eloBotPartida');
        
        if (nombreUsuario) nombreUsuario.textContent = 'Diego A';
        if (eloUsuario) eloUsuario.textContent = '1350';
        if (nombreBotElem) nombreBotElem.textContent = config.nombre || 'Ricardo';
        if (eloBotElem) eloBotElem.textContent = config.elo || '500';
        
        const avatarUsuario = document.getElementById('avatarUsuario');
        const avatarBot = document.getElementById('avatarBot');
        
        if (avatarUsuario) {
            avatarUsuario.src = AVATAR_USUARIO;
            avatarUsuario.alt = 'Usuario';
        }
        
        if (avatarBot) {
            const avatarBotSrc = AVATARES_BOTS[config.bot] || AVATARES_BOTS['principiante'];
            avatarBot.src = avatarBotSrc;
            avatarBot.alt = config.nombre || 'Bot';
        }
        
        const perfilUsuario = document.querySelector('.perfil-usuario');
        const perfilBot = document.querySelector('.perfil-bot');
        
        if (perfilUsuario) {
            perfilUsuario.style.borderLeft = colorJugador === 'blanca' ? '4px solid #FFF1EA' : '4px solid #007968';
        }
        
        if (perfilBot) {
            perfilBot.style.borderLeft = colorBot === 'blanca' ? '4px solid #FFF1EA' : '4px solid #007968';
        }
    }
    
    // ========== MODAL DE ABANDONO ==========
    function inicializarModalAbandono() {
        const btnAbandonar = document.getElementById('btnAbandonar');
        const modal = document.getElementById('modalAbandonar');
        const btnCancelar = modal?.querySelector('.btn-cancelar');
        
        if (!btnAbandonar || !modal) return;
        
        btnAbandonar.addEventListener('click', () => modal.classList.add('active'));
        if (btnCancelar) btnCancelar.addEventListener('click', () => modal.classList.remove('active'));
        modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('active'); });
    }
    
    // ========== CONTROLES (SOLO VISUAL) ==========
    function inicializarControles() {
        document.getElementById('btnRetroceder')?.addEventListener('click', () => console.log('Retroceder'));
        document.getElementById('btnAvanzar')?.addEventListener('click', () => console.log('Avanzar'));
    }
    
    // ========== INICIALIZACIÓN PRINCIPAL ==========
    document.addEventListener('DOMContentLoaded', () => {
        console.log('Inicializando partida...');
        inicializarTablero();
        inicializarModalAbandono();
        inicializarControles();
    });
    
})();