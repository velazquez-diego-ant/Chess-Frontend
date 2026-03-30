// UI helpers (no chess logic). Safe if elements are missing.
(() => {
  "use strict";

  const ready = (fn) => {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else {
      fn();
    }
  };

  ready(() => {
    // 1) Mobile sidebar toggle
    const sidebarToggle = document.getElementById("sidebarToggle");
    if (sidebarToggle) {
      sidebarToggle.addEventListener("click", (e) => {
        e.preventDefault();
        document.body.classList.toggle("sidebar-open");
      });
    }

    // 2) Navegación - Cambiar estado activo al hacer click (excluyendo logout)
    const navLinks = document.querySelectorAll('.nav-link:not(.logout)');
    
    navLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        // Remover active de todos (excepto logout)
        navLinks.forEach(l => l.classList.remove('active'));
        // Agregar active al clickeado
        this.classList.add('active');
        
        // Guardar en localStorage el último activo
        const navId = this.getAttribute('data-nav');
        if (navId) {
          localStorage.setItem('lastActiveNav', navId);
        }
      });
    });

    // 3) Restaurar estado activo desde localStorage al cargar
    const lastActive = localStorage.getItem('lastActiveNav');
    if (lastActive && lastActive !== 'cerrar') {
      const activeLink = document.querySelector(`[data-nav="${lastActive}"]`);
      if (activeLink && !activeLink.classList.contains('logout')) {
        navLinks.forEach(l => l.classList.remove('active'));
        activeLink.classList.add('active');
      }
    }

    // 4) Difficulty selection on /jugar/bots
    const levelCards = Array.from(document.querySelectorAll("[data-level]"));
    if (levelCards.length) {
      const playButton =
        document.querySelector("#playButton") ||
        document.querySelector("#btnPlay") ||
        document.querySelector("[data-role='play']") ||
        document.querySelector("button[type='submit'].btn-primary") ||
        document.querySelector("a.btn-primary");

      const setPlayEnabled = (enabled) => {
        if (!playButton) return;
        if ("disabled" in playButton) playButton.disabled = !enabled;
        playButton.classList.toggle("disabled", !enabled);
        playButton.setAttribute("aria-disabled", String(!enabled));
      };

      const selectCard = (card) => {
        levelCards.forEach((c) => c.classList.remove("selected"));
        card.classList.add("selected");
        setPlayEnabled(true);
      };

      const preselected = levelCards.find((c) => c.classList.contains("selected"));
      setPlayEnabled(Boolean(preselected));

      levelCards.forEach((card) => {
        card.addEventListener("click", () => selectCard(card));
        card.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            selectCard(card);
          }
        });

        if (!card.hasAttribute("tabindex")) card.setAttribute("tabindex", "0");
      });
    }
  });
})();