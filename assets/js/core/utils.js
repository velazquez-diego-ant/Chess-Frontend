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
// assets/js/core/utils.js

export function normalizeActualPageName(url) {
  const splittedUrl = url.split("/");
  const pageNameAndExtension = splittedUrl.at(-1);
  if (!pageNameAndExtension) return "index";
  const splitNameAndExtension = pageNameAndExtension.split(".");
  return splitNameAndExtension[0] || "index";
}

export function ensureLoggedIn(userId) {
  if (userId != null && userId !== "") {
    return Number(userId);
  }
  window.location.href = "login.html";
  return null;
}

const CLAVES_SESION = [
  "sesionActiva",
  "usuarioId",
  "usuarioActivo",
  "nombreUsuario",
  "usuarioRol",
];

export function cerrarSesion() {
  CLAVES_SESION.forEach((clave) => localStorage.removeItem(clave));

  // Detectar si estamos en /pages/ o en la raíz para redirigir correctamente
  const esPaginaInterna = window.location.pathname.includes("/pages/");
  const rutaIndex = esPaginaInterna ? "../index.html" : "./index.html";

  window.location.replace(rutaIndex);
}
