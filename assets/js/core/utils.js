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
export function normalizeActualPageName(url) {
  const splittedUrl = url.split("/");
  const pageNameAndExtension = splittedUrl.at(-1);

  if (!pageNameAndExtension) return "index";

  const splitNameAndExtension = pageNameAndExtension.split(".");
  const pageName = splitNameAndExtension[0];
  return pageName || "index";
}

/**
 * Verifica que el usuario tenga una sesión activa.
 */
export function ensureLoggedIn(userId) {
  if (userId != null && userId !== "") {
    return Number(userId);
  }
  // Redirigir al login (ruta relativa)
  window.location.href = "login.html";
  return null;
}

// Claves que guarda login.js al iniciar sesión
const CLAVES_SESION = [
  "sesionActiva",
  "usuarioId",
  "usuarioActivo",
  "nombreUsuario",
  "usuarioRol",
];

/**
 * Borra la sesión del localStorage y manda al inicio.
 * CORREGIDO: Detecta si estamos en /pages/ o en la raíz para redirigir correctamente.
 */
export function cerrarSesion() {
  CLAVES_SESION.forEach((clave) => localStorage.removeItem(clave));

  // Detectar si estamos en la carpeta /pages/ o en la raíz
  const esPaginaInterna = window.location.pathname.includes("/pages/");
  
  // Si estamos en /pages/, subir un nivel (../index.html)
  // Si estamos en la raíz, ir directo (./index.html)
  const rutaIndex = esPaginaInterna ? "../index.html" : "./index.html";

  window.location.replace(rutaIndex);
}