// assets/js/core/render.js

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

// =========================================
// DETECTAR LA PROFUNDIDAD DE LA PÁGINA ACTUAL
// =========================================
// Si estamos en /pages/ (publicaciones, comunidad, etc.) el prefijo es "../"
// Si estamos en la raíz (index.html) el prefijo es "./"
const esPaginaInterna = window.location.pathname.includes("/pages/");
const prefix = esPaginaInterna ? "../" : "./";

// =========================================
// FUNCIÓN AUXILIAR PARA REEMPLAZAR RUTAS
// =========================================
// Reemplaza las rutas de las plantillas que empiezan con "./" por el prefijo correcto
// Esto hace que las imágenes del header funcionen en ambos contextos
function procesarRutas(html) {
  if (!html) return "";
  // Reemplaza src="./ por src="PREFIX y src="../ por src="PREFIX
  return html
    .replace(/src="\.\//g, `src="${prefix}`)
    .replace(/src="\.\.\//g, `src="${prefix}`)
    .replace(/href="\.\//g, `href="${prefix}`)
    .replace(/href="\.\.\//g, `href="${prefix}`);
}

// =========================================
// CONFIGURACIÓN POR PÁGINA (Con procesamiento)
// =========================================
const layouts = {
  index: {
    header: procesarRutas(header_index),
    footer: procesarRutas(footer_index),
  },
  publicaciones: {
    header: procesarRutas(header_publicaciones),
    footer: procesarRutas(footer_publicaciones),
  },
  comunidad: {
    header: procesarRutas(header_comunidad),
    footer: procesarRutas(footer_comunidad),
  },
  guia: {
    header: procesarRutas(header_guia),
    footer: procesarRutas(footer_guia),
  },
  contacto: {
    header: procesarRutas(header_contacto),
    footer: procesarRutas(footer_contacto),
  },
  login: {
    header: procesarRutas(header_login),
    footer: null,
  },
  register: {
    header: procesarRutas(header_register),
    footer: null,
  },
  registro: {
    header: procesarRutas(header_register),
    footer: null,
  },
};

// =========================================
// RENDER
// =========================================
const layout = layouts[nombrePagina] ?? layouts.index;
renderHeader(layout);
renderFooter(layout);
renderAuthUI();

// =========================================
// FUNCIONES
// =========================================

function renderHeader({ header }) {
  if (!header) return;
  body.insertAdjacentHTML("afterbegin", header);
}

function renderFooter({ footer }) {
  if (!footer) return;
  const primerScript = body.querySelector(":scope > script");
  if (primerScript) {
    primerScript.insertAdjacentHTML("beforebegin", footer);
  } else {
    body.insertAdjacentHTML("beforeend", footer);
  }
}

// =========================================
// LÓGICA DE USUARIO LOGUEADO / INVITADO
// =========================================
function renderAuthUI() {
  const authContainer = document.getElementById("auth-container");

  if (!authContainer) return;

  const sesionActiva = localStorage.getItem("sesionActiva") === "true";
  const nombreUsuario = localStorage.getItem("nombreUsuario") || "Usuario";

  if (sesionActiva) {
    // HTML DEL PERFIL LOGUEADO
    authContainer.innerHTML = `
      <a class="header-flag-link" aria-label="Cambiar idioma">
        <img src="${prefix}assets/img/icons/icon-bandera.svg" alt="Bandera México" class="header-flag-icon">
      </a>
      <div class="profile-dropdown-container">
        <button class="profile-btn" id="profileBtn">
          <span class="profile-name">${nombreUsuario}</span>
          <img src="${prefix}assets/img/icons/mode-clear/icon-img-profile.svg" alt="Perfil" class="profile-avatar">
          <img src="${prefix}assets/img/icons/mode-clear/icon-arrow-between.svg" alt="Menú" class="profile-arrow">
        </button>
        
        <div class="profile-menu" id="profileMenu">
          <a href="#" class="profile-menu-item"><span>Perfil</span></a>
          <a href="#" class="profile-menu-item"><span>Configuración</span></a>
          <a href="#" class="profile-menu-item" data-cerrar-sesion><span>Cerrar sesión</span></a>
        </div>
      </div>
    `;

    // Lógica para abrir/cerrar el menú desplegable
    const profileBtn = document.getElementById("profileBtn");
    const profileMenu = document.getElementById("profileMenu");

    if (profileBtn && profileMenu) {
      profileBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        profileMenu.classList.toggle("show");
      });

      document.addEventListener("click", (e) => {
        if (!profileBtn.contains(e.target) && !profileMenu.contains(e.target)) {
          profileMenu.classList.remove("show");
        }
      });
    }
  } else {
    // HTML DE INVITADO
    authContainer.innerHTML = `
      <a href="${prefix}pages/login.html" class="btn-iniciar">Iniciar sesión</a>
      <a href="${prefix}pages/register.html" class="btn-registrar">Registrarse</a>
    `;
  }
}

// =========================================
// LOGOUT
// =========================================
document.addEventListener("click", (e) => {
  const enlace = e.target.closest("[data-cerrar-sesion]");
  if (!enlace) return;
  e.preventDefault();
  cerrarSesion();
});