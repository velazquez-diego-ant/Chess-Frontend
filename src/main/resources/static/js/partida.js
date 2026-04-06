// Configuración inicial del tablero
const configuracionInicial = [
    ['torre-negra', 'caballo-negro', 'alfil-negro', 'dama-negra', 'rey-negro', 'alfil-negro', 'caballo-negro', 'torre-negra'],
    ['peon-negro', 'peon-negro', 'peon-negro', 'peon-negro', 'peon-negro', 'peon-negro', 'peon-negro', 'peon-negro'],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['peon-blanco', 'peon-blanco', 'peon-blanco', 'peon-blanco', 'peon-blanco', 'peon-blanco', 'peon-blanco', 'peon-blanco'],
    ['torre-blanca', 'caballo-blanco', 'alfil-blanco', 'dama-blanca', 'rey-blanco', 'alfil-blanco', 'caballo-blanco', 'torre-blanca']
];

// Variables globales
let tablero = [];
let turnoBlancas = true;
let piezaSeleccionada = null;
let posicionSeleccionada = null;
let historialJugadas = [];
let indiceHistorial = -1;

// Obtener configuración del bot desde el modelo (inyectado por Thymeleaf)
function obtenerConfiguracion() {
    if (window.botConfig) {
        return window.botConfig;
    }
    // Fallback para cuando no hay configuración
    return {
        bot: 'principiante',
        color: 'blanca',
        elo: '500',
        nombre: 'Ricardo'
    };
}

// Inicializar el tablero
function inicializarTablero() {
    tablero = JSON.parse(JSON.stringify(configuracionInicial));
    renderizarTablero();
}

// Renderizar el tablero en el DOM
function renderizarTablero() {
    const tableroDiv = document.getElementById('tableroAjedrez');
    tableroDiv.innerHTML = '';
    
    for (let fila = 0; fila < 8; fila++) {
        for (let col = 0; col < 8; col++) {
            const casilla = document.createElement('div');
            casilla.className = `casilla ${(fila + col) % 2 === 0 ? 'clara' : 'oscura'}`;
            casilla.dataset.fila = fila;
            casilla.dataset.columna = col;
            
            const pieza = tablero[fila][col];
            if (pieza) {
                const img = document.createElement('img');
                img.className = 'pieza';
                img.src = `/images/icons/piezas/icono-${pieza}.svg`;
                img.alt = pieza;
                casilla.appendChild(img);
            }
            
            casilla.addEventListener('click', () => manejarClickCasilla(fila, col));
            tableroDiv.appendChild(casilla);
        }
    }
}

// Manejar click en casilla
function manejarClickCasilla(fila, col) {
    const pieza = tablero[fila][col];
    
    if (piezaSeleccionada === null && pieza) {
        const esBlanca = pieza.includes('blanca');
        if (esBlanca === turnoBlancas) {
            seleccionarPieza(fila, col);
        }
    } 
    else if (piezaSeleccionada !== null) {
        intentarMover(fila, col);
    }
}

// Seleccionar pieza
function seleccionarPieza(fila, col) {
    limpiarSeleccion();
    
    piezaSeleccionada = tablero[fila][col];
    posicionSeleccionada = { fila, col };
    
    const casillas = document.querySelectorAll('.casilla');
    casillas.forEach(casilla => {
        const f = parseInt(casilla.dataset.fila);
        const c = parseInt(casilla.dataset.columna);
        if (f === fila && c === col) {
            casilla.classList.add('seleccionada');
        }
    });
    
    mostrarMovimientosPosibles(fila, col);
}

// Mostrar movimientos posibles (versión simplificada)
function mostrarMovimientosPosibles(fila, col) {
    const posiblesMovimientos = obtenerMovimientosPosibles(fila, col);
    
    const casillas = document.querySelectorAll('.casilla');
    casillas.forEach(casilla => {
        const f = parseInt(casilla.dataset.fila);
        const c = parseInt(casilla.dataset.columna);
        
        if (posiblesMovimientos.some(mov => mov.fila === f && mov.columna === c)) {
            casilla.classList.add('movimiento-posible');
            
            if (tablero[f][c]) {
                casilla.classList.add('captura');
            }
        }
    });
}

// Obtener movimientos posibles (simplificado)
function obtenerMovimientosPosibles(fila, col) {
    const movimientos = [];
    const pieza = piezaSeleccionada;
    
    for (let i = -2; i <= 2; i++) {
        for (let j = -2; j <= 2; j++) {
            const nuevaFila = fila + i;
            const nuevaCol = col + j;
            
            if (nuevaFila >= 0 && nuevaFila < 8 && nuevaCol >= 0 && nuevaCol < 8) {
                if (i === 0 && j === 0) continue;
                
                const piezaDestino = tablero[nuevaFila][nuevaCol];
                const esBlanca = pieza.includes('blanca');
                
                if (piezaDestino && piezaDestino.includes(esBlanca ? 'blanca' : 'negra')) {
                    continue;
                }
                
                if (Math.abs(i) <= 1 && Math.abs(j) <= 1) {
                    movimientos.push({ fila: nuevaFila, columna: nuevaCol });
                }
            }
        }
    }
    
    return movimientos;
}

// Intentar mover pieza
function intentarMover(filaDestino, colDestino) {
    const piezaDestino = tablero[filaDestino][colDestino];
    const movimientosPosibles = obtenerMovimientosPosibles(posicionSeleccionada.fila, posicionSeleccionada.col);
    const esMovimientoValido = movimientosPosibles.some(mov => mov.fila === filaDestino && mov.columna === colDestino);
    
    if (esMovimientoValido) {
        const jugada = {
            desde: { ...posicionSeleccionada },
            hasta: { fila: filaDestino, columna: colDestino },
            pieza: piezaSeleccionada,
            piezaCapturada: piezaDestino
        };
        
        tablero[filaDestino][colDestino] = piezaSeleccionada;
        tablero[posicionSeleccionada.fila][posicionSeleccionada.columna] = '';
        
        historialJugadas = historialJugadas.slice(0, indiceHistorial + 1);
        historialJugadas.push(jugada);
        indiceHistorial++;
        
        turnoBlancas = !turnoBlancas;
        
        renderizarTablero();
        verificarEstadoPartida();
    }
    
    limpiarSeleccion();
}

// Limpiar selección y resaltados
function limpiarSeleccion() {
    piezaSeleccionada = null;
    posicionSeleccionada = null;
    
    const casillas = document.querySelectorAll('.casilla');
    casillas.forEach(casilla => {
        casilla.classList.remove('seleccionada', 'movimiento-posible', 'captura');
    });
}

// Verificar estado de la partida (simplificado)
function verificarEstadoPartida() {
    let reyBlancoEncontrado = false;
    let reyNegroEncontrado = false;
    
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (tablero[i][j] === 'rey-blanco') reyBlancoEncontrado = true;
            if (tablero[i][j] === 'rey-negro') reyNegroEncontrado = true;
        }
    }
    
    if (!reyBlancoEncontrado) {
        setTimeout(() => {
            alert('¡Las negras han ganado la partida!');
        }, 100);
    } else if (!reyNegroEncontrado) {
        setTimeout(() => {
            alert('¡Las blancas han ganado la partida!');
        }, 100);
    }
}

// Retroceder jugada
function retrocederJugada() {
    if (indiceHistorial >= 0) {
        const jugada = historialJugadas[indiceHistorial];
        
        tablero[jugada.desde.fila][jugada.desde.columna] = jugada.pieza;
        tablero[jugada.hasta.fila][jugada.hasta.columna] = jugada.piezaCapturada || '';
        
        indiceHistorial--;
        turnoBlancas = !turnoBlancas;
        
        renderizarTablero();
        limpiarSeleccion();
    }
}

// Avanzar jugada
function avanzarJugada() {
    if (indiceHistorial + 1 < historialJugadas.length) {
        indiceHistorial++;
        const jugada = historialJugadas[indiceHistorial];
        
        tablero[jugada.hasta.fila][jugada.hasta.columna] = jugada.pieza;
        tablero[jugada.desde.fila][jugada.desde.columna] = '';
        
        turnoBlancas = !turnoBlancas;
        
        renderizarTablero();
        limpiarSeleccion();
    }
}

// Abandonar partida
function abandonarPartida() {
    const modal = document.getElementById('modalAbandonar');
    modal.classList.add('active');
}

// Configurar información del bot desde la configuración
function configurarInfoBot() {
    const config = obtenerConfiguracion();
    const avatarBot = document.getElementById('avatarBot');
    const nombreBot = document.getElementById('nombreBotPartida');
    const eloBot = document.getElementById('eloBotPartida');
    
    // Configurar según el bot seleccionado
    let avatarSrc = '/images/icons/icono-bot-principiante.svg';
    let nombre = config.nombre || 'Ricardo';
    let elo = config.elo || '500';
    
    switch(config.bot) {
        case 'intermedio':
            avatarSrc = '/images/icons/icono-bot-intermedio.svg';
            break;
        case 'avanzado':
            avatarSrc = '/images/icons/icono-bot-avanzado.svg';
            break;
        case 'maestro':
            avatarSrc = '/images/icons/icono-bot-maestro.svg';
            break;
        default:
            avatarSrc = '/images/icons/icono-bot-principiante.svg';
    }
    
    avatarBot.src = avatarSrc;
    nombreBot.textContent = nombre;
    eloBot.textContent = elo;
    
    // Configurar nombre del usuario
    document.getElementById('nombreUsuario').textContent = 'Diego A';
    document.getElementById('eloUsuario').textContent = '1350';
}

function configurarBarraEvaluacion() {
    const config = obtenerConfiguracion();
    const barraEvaluacion = document.getElementById('barraEvaluacion');
    
    if (config.color === 'negra') {
        barraEvaluacion.classList.add('jugador-negras');
        barraEvaluacion.classList.remove('jugador-blancas');
    } else {
        barraEvaluacion.classList.add('jugador-blancas');
        barraEvaluacion.classList.remove('jugador-negras');
    }
}

// Temporizador
let tiempoSegundos = 0;
let temporizadorInterval;

function iniciarTemporizador() {
    temporizadorInterval = setInterval(() => {
        tiempoSegundos++;
        const minutos = Math.floor(tiempoSegundos / 60);
        const segundos = tiempoSegundos % 60;
        const tiempoFormateado = `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
        document.getElementById('tiempoPartida').textContent = tiempoFormateado;
    }, 1000);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    inicializarTablero();
    configurarInfoBot();
    iniciarTemporizador();
    
    // Controles
    document.getElementById('btnRetroceder').addEventListener('click', retrocederJugada);
    document.getElementById('btnAvanzar').addEventListener('click', avanzarJugada);
    document.getElementById('btnAbandonar').addEventListener('click', abandonarPartida);
    
    // Modal
    const modal = document.getElementById('modalAbandonar');
    const cancelarBtn = document.querySelector('.btn-cancelar');
    const confirmarBtn = document.querySelector('.btn-confirmar');
    
    cancelarBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });
    
    confirmarBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        alert('Has abandonado la partida');
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
});
