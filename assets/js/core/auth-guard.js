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
    window.location.replace("../pages/login.html");
    return false;
  }
  return true;
}
