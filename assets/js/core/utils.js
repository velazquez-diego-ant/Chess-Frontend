// assets/js/core/utils.js

/**
 * Normaliza el nombre de la página actual a partir de la URL.
 *
 * @description
 * Toma una URL y devuelve el nombre de la página sin la extensión.
 * Si la URL termina en "/", devuelve "index" por defecto.
 *
 * @param {string} url - La URL completa de la página actual.
 * @returns {string} - El nombre de la página actual sin la extensión.
 *
 * @example
 * const pageName = normalizeActualPageName("http://example.com/pages/feed.html");
 * console.log(pageName); // Output: "feed"
 */
export function normalizeActualPageName(url) {
  const splittedUrl = url.split("/");
  const pageNameAndExtension = splittedUrl.at(-1);

  // Si la URL termina en "/" (ej: la raíz del proyecto), devolvemos "index"
  if (!pageNameAndExtension) return "index";

  const splitNameAndExtension = pageNameAndExtension.split(".");
  const pageName = splitNameAndExtension[0];
  return pageName || "index";
}

/**
 * Verifica que el usuario tenga una sesión activa.
 * Si no está logueado, lo redirige a la página de login.
 *
 * @param {string|number} userId - El ID del usuario obtenido del localStorage o sesión.
 * @returns {number|null} - Retorna el ID numérico si está logueado, o null si no.
 */
export function ensureLoggedIn(userId) {
  if (userId != null && userId !== "") {
    return Number(userId);
  }
  // Redirigimos al login usando la ruta correcta de PawnShare
  window.location.href = "/pages/login.html";
  return null;
}

// Claves que guarda login.js al iniciar sesión en PawnShare
const CLAVES_SESION = [
  "sesionActiva",
  "usuarioId",
  "usuarioActivo",
  "nombreUsuario",
  "usuarioRol",
];

/**
 * Borra la sesión del localStorage y manda al inicio (index.html).
 * Las preferencias (tema, vista) se conservan porque no son de la sesión.
 */
export function cerrarSesion() {
  CLAVES_SESION.forEach((clave) => localStorage.removeItem(clave));
  // Redirigimos al index de PawnShare
  window.location.replace("/index.html");
}
