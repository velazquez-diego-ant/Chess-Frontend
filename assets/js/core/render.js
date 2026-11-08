// assets/js/core/render.js

import { normalizeActualPageName, cerrarSesion } from "./utils.js";

const body = document.querySelector("body");
const nombrePagina =
  normalizeActualPageName(window.location.pathname) || "index";

// Raíz del proyecto
const ROOT = new URL("../../../", import.meta.url);
const ruta = (path) => new URL(path, ROOT).href;

const paginas = {
  index: ruta("index.html"),
  publicaciones: ruta("pages/publicaciones.html"),
  comunidad: ruta("pages/comunidad.html"),
  guia: ruta("pages/guia.html"),
  contacto: ruta("pages/contacto.html"),
  login: ruta("pages/login.html"),
  registro: ruta("pages/register.html"),
};


// Función para saber si un enlace está activo
const isActive = (pagina) => (nombrePagina === pagina ? "active" : "");

// ================= PLANTILLA DEL HEADER =================
const headerTemplate = () => `
    <nav class="header-pawnshare">
        <div class="header-container">
            
            <!-- LOGO -->
            <a class="header-brand" href="${paginas.index}">
                <img src="${ruta("assets/img/icons/mode-clear/icon-pawnShare.svg")}" alt="PawnShare" class="header-logo">
            </a>

            <!-- BOTÓN HAMBURGUESA -->
            <button class="header-toggle" id="headerToggle" aria-label="Abrir menú">
                <span></span><span></span><span></span>
            </button>

            <!-- MENÚ -->
            <div class="header-menu" id="headerMenu">
                <ul class="header-nav">
                    <li><a class="header-link ${isActive("index")}" href="${paginas.index}">Inicio</a></li>
                    <li><a class="header-link ${isActive("publicaciones")}" href="${paginas.publicaciones}">Publicaciones</a></li>
                    <li><a class="header-link ${isActive("comunidad")}" href="${paginas.comunidad}">Comunidad</a></li>
                    <li><a class="header-link ${isActive("guia")}" href="${paginas.guia}">Guía</a></li>
                    <li><a class="header-link ${isActive("contacto")}" href="${paginas.contacto}">Contacto</a></li>
                </ul>

                <div class="header-actions">
                    <!-- Bandera -->
                    <a href="#" class="header-flag-link">
                        <img src="${ruta("assets/img/icons/icon-bandera.svg")}" alt="Bandera México" class="header-flag-icon">
                    </a>
                    <!-- Botón Iniciar Sesión -->
                    <a href="${paginas.login}" class="btn-header-login">Iniciar sesión</a>
                </div>
            </div>
        </div>
    </nav>
`;

// ================= INSERTAR HEADER =================
const insertarHeader = () => {
  body.insertAdjacentHTML("afterbegin", headerTemplate());

  const toggleBtn = document.getElementById("headerToggle");
  const menu = document.getElementById("headerMenu");

  if (toggleBtn && menu) {
    toggleBtn.addEventListener("click", () => {
      menu.classList.toggle("header-menu-active");
    });
  }
};

insertarHeader();
