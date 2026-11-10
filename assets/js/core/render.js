
import { normalizeActualPageName, cerrarSesion } from "./utils.js";
import {
  header_index,
  footer_index,
  header_publicaciones,
  footer_publicaciones,
  header_comunidad,
  footer_comunidad,
  header_guia,
  footer_guia,
  header_contacto,
  footer_contacto,
  header_login,
  header_register,
} from "./plantillasLayout.js";

const body = document.querySelector("body");
const nombrePagina =
  normalizeActualPageName(window.location.pathname) || "index";

//*  ================= CONFIGURACIÓN POR PÁGINA =================
const layouts = {
  index: { header: header_index, footer: footer_index },
  publicaciones: { header: header_publicaciones, footer: footer_publicaciones },
  comunidad: { header: header_comunidad, footer: footer_comunidad },
  guia: { header: header_guia, footer: footer_guia },
  contacto: { header: header_contacto, footer: footer_contacto },
  login: { header: header_login, footer: null },
  register: { header: header_register, footer: null },
  registro: { header: header_register, footer: null },
};

//*  ================= RENDER =================
const layout = layouts[nombrePagina] ?? layouts.index;
renderHeader(layout);
renderFooter(layout);

// ? Cualquier enlace con data-cerrar-sesion borra la sesión antes de salir
document.addEventListener("click", (e) => {
  const enlace = e.target.closest("[data-cerrar-sesion]");
  if (!enlace) return;
  e.preventDefault();
  cerrarSesion();
});

//*  ================= FUNCIONES =================

function renderHeader({ header }) {
  if (!header) return;
  body.insertAdjacentHTML("afterbegin", header);
}

function renderFooter({ footer }) {
  if (!footer) return;
  // ? Si la página tiene <script> al final del body, el footer se coloca antes de ellos
  const primerScript = body.querySelector(":scope > script");
  if (primerScript) {
    primerScript.insertAdjacentHTML("beforebegin", footer);
  } else {
    body.insertAdjacentHTML("beforeend", footer);
  }
}
