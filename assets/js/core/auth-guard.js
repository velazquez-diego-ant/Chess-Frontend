// assets/js/core/auth-guard.js

/**
 * Función que verifica si el usuario tiene una sesión activa.
 * Si no está logueado, lo redirige a la página de login.
 * @returns {boolean} - Retorna true si está logueado, false si no (y redirige).
 */

// assets/js/core/auth-guard.js

export function protegerRuta() {
  const sesionActiva = localStorage.getItem("sesionActiva") === "true";
  const usuarioId = localStorage.getItem("usuarioId");

  if (!sesionActiva || !usuarioId) {
    // No está logueado: Redirigimos sin mostrar el body
    window.location.replace("./login.html");
    return false;
  }

  // Está logueado: Mostramos el body quitando la clase de ocultamiento
  document.addEventListener("DOMContentLoaded", () => {
    document.body.classList.remove("auth-pending");
  });

  // Si el DOMContentLoaded ya pasó (porque el script cargó tarde), quitamos la clase directamente
  if (
    document.readyState === "interactive" ||
    document.readyState === "complete"
  ) {
    document.body.classList.remove("auth-pending");
  }

  return true;
}
