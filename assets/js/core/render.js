// assets/js/core/render.js

import { normalizeActualPageName, cerrarSesion } from "./utils.js";
import {
  header_index, footer_index,
  header_publicaciones, footer_publicaciones,
  header_comunidad, footer_comunidad,
  header_guia, footer_guia,
  header_contacto, footer_contacto,
  header_login,
  header_register,
} from "./plantillasLayout.js";

const body = document.querySelector("body");
const nombrePagina = normalizeActualPageName(window.location.pathname) || "index";

// Siempre quitamos la clase, sin importar si está logueado o no.
// La protección de ruta (redirección) la maneja init-guard.js aparte.
body.classList.remove("auth-pending");

// =========================================
//* PREFIJO PARA RUTAS
// =========================================
const esPaginaInterna = window.location.pathname.includes("/pages/");
const prefix = esPaginaInterna ? "../" : "./";

// =========================================
//* CONFIGURACIÓN POR PÁGINA
// =========================================
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

const layout = layouts[nombrePagina] ?? layouts.index;
renderHeader(layout);
renderFooter(layout);
renderAuthUI();

// =========================================
//* FUNCIONES
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
//* LÓGICA DE USUARIO LOGUEADO / INVITADO
// =========================================
function renderAuthUI() {
  const authContainer = document.getElementById("auth-container");
  if (!authContainer) return;

  const sesionActiva = localStorage.getItem("sesionActiva") === "true";
  const nombreUsuario = localStorage.getItem("nombreUsuario") || "Usuario";

  if (sesionActiva) {
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
    authContainer.innerHTML = `
      <a href="${prefix}pages/login.html" class="btn-iniciar">Iniciar sesión</a>
      <a href="${prefix}pages/register.html" class="btn-registrar">Registrarse</a>
    `;
  }
}

// =========================================
//* LOGOUT
// =========================================
document.addEventListener("click", (e) => {
  const enlace = e.target.closest("[data-cerrar-sesion]");
  if (!enlace) return;
  e.preventDefault();
  cerrarSesion();
});