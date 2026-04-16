
(function() {
      let dificultadSeleccionada = null;
      let fichaSeleccionada = null;
      let victorias = 0;
      
      let isDragging = false;
      let currentMin = 500;
      let currentMax = 1000;
      let currentStep = 100;
      let currentElo = 500;
      
      const botonesDificultad = document.querySelectorAll('.btn-dificultad');
      const botonesFicha = document.querySelectorAll('.btn-ficha');
      const btnJugar = document.getElementById('btnJugar');
      
      const avatarBotImg = document.getElementById('avatarBotImg');
      const nombreBot = document.getElementById('nombreBot');
      const eloBot = document.getElementById('eloBot');
      const marcadoresElo = document.getElementById('marcadoresElo');
      const indicadorElo = document.getElementById('indicadorElo');
      const coronaVictoria = document.getElementById('coronaVictoria');
      const barraElo = document.getElementById('barraElo');
      
      function calcularEloDesdePosicion(porcentaje, min, max, step) {
        const rawValue = min + (porcentaje / 100) * (max - min);
        const stepsCount = Math.round((rawValue - min) / step);
        const eloValue = min + (stepsCount * step);
        return Math.min(max, Math.max(min, eloValue));
      }
      
      function moverIndicador(porcentaje) {
        const porcentajeLimitado = Math.min(100, Math.max(0, porcentaje));
        indicadorElo.style.left = porcentajeLimitado + '%';
      }
      
      function actualizarElo(nuevoElo) {
        currentElo = nuevoElo;
        eloBot.textContent = currentElo;
        const porcentaje = ((currentElo - currentMin) / (currentMax - currentMin)) * 100;
        moverIndicador(porcentaje);
        actualizarCorona();
      }
      
      function actualizarCorona() {
        const maxVictorias = 5;
        const porcentajeVictoria = Math.min(victorias / maxVictorias, 1) * 100;
        coronaVictoria.style.left = porcentajeVictoria + '%';
        coronaVictoria.style.opacity = victorias > 0 ? '1' : '0.3';
      }
      
      function generarBarraElo(min, max, step, eloActual) {
        currentMin = min;
        currentMax = max;
        currentStep = step;
        currentElo = eloActual;
        
        marcadoresElo.innerHTML = '';
        const totalSteps = (max - min) / step;
      
        for (let i = 0; i <= totalSteps; i++) {
          const valor = min + (i * step);
          const marcador = document.createElement('div');
          marcador.className = 'marcador-elo';
          marcador.style.left = (i / totalSteps * 100) + '%';
          
          const linea = document.createElement('div');
          linea.className = 'linea-marcador';
          marcador.appendChild(linea);
        
          const numero = document.createElement('span');
          numero.className = 'numero-elo';
          numero.textContent = valor;
          marcador.appendChild(numero);
        
          marcadoresElo.appendChild(marcador);
        }
        
        const porcentaje = ((eloActual - min) / (max - min)) * 100;
        moverIndicador(porcentaje);
        actualizarCorona();
      }
      
      function handleDragStart(e) {
        e.preventDefault();
        isDragging = true;
      }
      
      function handleDragMove(e) {
        if (!isDragging) return;
        
        const rect = barraElo.getBoundingClientRect();
        let clientX;
        
        if (e.touches) {
          clientX = e.touches[0].clientX;
          e.preventDefault();
        } else {
          clientX = e.clientX;
        }
        
        let x = clientX - rect.left;
        let porcentaje = (x / rect.width) * 100;
        porcentaje = Math.min(100, Math.max(0, porcentaje));
        
        const nuevoElo = calcularEloDesdePosicion(porcentaje, currentMin, currentMax, currentStep);
        
        if (nuevoElo !== currentElo) {
          actualizarElo(nuevoElo);
          const btnSeleccionado = document.querySelector('.btn-dificultad.selected');
          if (btnSeleccionado) {
            btnSeleccionado.setAttribute('data-elo', nuevoElo);
          }
        }
      }
      
      function handleDragEnd() {
        isDragging = false;
      }
      
      function handleBarClick(e) {
        const rect = barraElo.getBoundingClientRect();
        let clientX;
        
        if (e.touches) {
          clientX = e.touches[0].clientX;
        } else {
          clientX = e.clientX;
        }
        
        let x = clientX - rect.left;
        let porcentaje = (x / rect.width) * 100;
        porcentaje = Math.min(100, Math.max(0, porcentaje));
        
        const nuevoElo = calcularEloDesdePosicion(porcentaje, currentMin, currentMax, currentStep);
        
        if (nuevoElo !== currentElo) {
          actualizarElo(nuevoElo);
          const btnSeleccionado = document.querySelector('.btn-dificultad.selected');
          if (btnSeleccionado) {
            btnSeleccionado.setAttribute('data-elo', nuevoElo);
          }
        }
      }
      
      indicadorElo.addEventListener('mousedown', handleDragStart);
      window.addEventListener('mousemove', handleDragMove);
      window.addEventListener('mouseup', handleDragEnd);
      indicadorElo.addEventListener('touchstart', handleDragStart);
      window.addEventListener('touchmove', handleDragMove);
      window.addEventListener('touchend', handleDragEnd);
      barraElo.addEventListener('click', handleBarClick);
      
      botonesDificultad.forEach(btn => {
        btn.addEventListener('click', function() {
          botonesDificultad.forEach(b => b.classList.remove('selected'));
          this.classList.add('selected');
          
          dificultadSeleccionada = this.getAttribute('data-dificultad');
          
          const nombre = this.getAttribute('data-nombre');
          const elo = parseInt(this.getAttribute('data-elo'));
          const min = parseInt(this.getAttribute('data-min'));
          const max = parseInt(this.getAttribute('data-max'));
          const step = parseInt(this.getAttribute('data-step'));
          const avatar = this.getAttribute('data-avatar');
          
          avatarBotImg.src = '/images/icons/' + avatar;
          nombreBot.textContent = nombre;
          eloBot.textContent = elo;
          
          generarBarraElo(min, max, step, elo);
          currentElo = elo;
          
          verificarActivacion();
        });
      });
      
      botonesFicha.forEach(btn => {
        btn.addEventListener('click', function() {
          botonesFicha.forEach(b => b.classList.remove('selected'));
          this.classList.add('selected');
          fichaSeleccionada = this.getAttribute('data-ficha');
          verificarActivacion();
        });
});
      
      function verificarActivacion() {
        if (dificultadSeleccionada && fichaSeleccionada) {
          btnJugar.classList.add('activo');
          btnJugar.disabled = false;
        } else {
          btnJugar.classList.remove('activo');
          btnJugar.disabled = true;
        }
      }
      
    btnJugar.addEventListener('click', function() {
    if (this.classList.contains('activo') && !this.disabled) {
        let url = `/partida/bots?bot=${dificultadSeleccionada}&color=${fichaSeleccionada}&elo=${currentElo}`;
        
        const btnSeleccionado = document.querySelector('.btn-dificultad.selected');
        if (btnSeleccionado) {
            const nombreBotSeleccionado = btnSeleccionado.getAttribute('data-nombre');
            url += `&nombre=${encodeURIComponent(nombreBotSeleccionado)}`;
        }
        
        console.log('Redirigiendo a:', url);
        window.location.href = url;
    }
});
      
      botonesDificultad[0].click();
    })();