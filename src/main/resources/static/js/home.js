    (function() {
      const panel = document.getElementById('panelOpciones');
      if (!panel) return;
      
      const botones = panel.querySelectorAll('.btn-opcion');
      
      botones.forEach(boton => {
        boton.addEventListener('mouseenter', function() {
          botones.forEach(b => {
            if (b === this) {
              b.style.background = 'rgba(89, 78, 72, 1)';
            } else {
              b.style.background = 'rgba(89, 78, 72, 0.5)';
            }
          });
        });
        
        boton.addEventListener('mouseleave', function() {
          botones.forEach(b => {
            b.style.background = 'rgba(89, 78, 72, 0.5)';
          });
        });
      });
    })();
