
document.addEventListener("DOMContentLoaded", () => {
  // =========================================
  //* 1. DATOS DEL USUARIO
  // =========================================
  const sidebarUserName = document.getElementById("sidebar-user-name");
  const pubUserName = document.getElementById("pub-user-name");
  const pubUserName2 = document.getElementById("pub-user-name-2");
  const modalUserName = document.getElementById("modal-user-name");

  const nombreGuardado = localStorage.getItem("nombreUsuario") || "Usuario";

  if (sidebarUserName) sidebarUserName.textContent = nombreGuardado;
  if (pubUserName) pubUserName.textContent = nombreGuardado;
  if (pubUserName2) pubUserName2.textContent = nombreGuardado;
  if (modalUserName) modalUserName.textContent = nombreGuardado;

  // =========================================
  //* 2. LÓGICA DEL MENÚ LATERAL
  // =========================================
  const sidebarLinks = document.querySelectorAll(".sidebar-link");
  sidebarLinks.forEach((link) => link.classList.remove("active"));

  sidebarLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      sidebarLinks.forEach((l) => l.classList.remove("active"));
      link.classList.add("active");
    });
  });

  // =========================================
  //* 3. FUNCIÓN: FORMATEAR TEXTO (Hashtags azules)
  // =========================================
  const formatearTexto = (texto) => {
    // Reemplaza #hashtag con un <span class="hashtag">
    return texto.replace(/#(\w+)/g, '<span class="hashtag">#$1</span>');
  };

  // =========================================
  //* 4. FUNCIÓN: VER MÁS / VER MENOS
  // =========================================
  const aplicarVerMas = (contenedor) => {
    // Buscamos el texto de la publicación
    const textoElemento = contenedor.querySelector(".publicacion-texto");
    if (!textoElemento) return;

    // Aplicamos el formateo de hashtags
    const textoOriginal = textoElemento.innerHTML;
    textoElemento.innerHTML = formatearTexto(textoOriginal);

    // Verificamos si el texto excede las 3 líneas
    // Necesitamos esperar un frame para que el navegador calcule el scrollHeight
    setTimeout(() => {
      if (textoElemento.scrollHeight > textoElemento.clientHeight + 10) {
        // El texto es largo, añadimos el botón "Ver más"
        const btnVerMas = document.createElement("button");
        btnVerMas.className = "btn-ver-mas";
        btnVerMas.textContent = "Ver más...";

        btnVerMas.addEventListener("click", () => {
          if (textoElemento.classList.contains("expandido")) {
            textoElemento.classList.remove("expandido");
            btnVerMas.textContent = "Ver más...";
          } else {
            textoElemento.classList.add("expandido");
            btnVerMas.textContent = "Ver menos";
          }
        });

        textoElemento.insertAdjacentElement("afterend", btnVerMas);
      }
    }, 10);
  };

  // Aplicamos "Ver más" a todas las publicaciones existentes al cargar
  document
    .querySelectorAll(".publicacion-card")
    .forEach((pub) => aplicarVerMas(pub));

  // =========================================
  //* 5. DELEGACIÓN DE EVENTOS PARA DROPDOWNS
  // =========================================
  const dashboardMain = document.querySelector(".dashboard-main-content");

  dashboardMain.addEventListener("click", (e) => {
    const btnOptions = e.target.closest(".btn-options");

    if (btnOptions) {
      e.stopPropagation();
      const dropdown = btnOptions.nextElementSibling;

      document.querySelectorAll(".publicacion-dropdown").forEach((d) => {
        if (d !== dropdown) d.classList.remove("show");
      });

      if (dropdown) dropdown.classList.toggle("show");
      return;
    }

    if (e.target.closest(".dropdown-item")) {
      document
        .querySelectorAll(".publicacion-dropdown")
        .forEach((d) => d.classList.remove("show"));
    }
  });

  document.addEventListener("click", (e) => {
    if (
      !e.target.closest(".btn-options") &&
      !e.target.closest(".publicacion-dropdown")
    ) {
      document
        .querySelectorAll(".publicacion-dropdown")
        .forEach((d) => d.classList.remove("show"));
    }
  });

  // =========================================
  //* 6. LÓGICA DEL MODAL DE CREACIÓN
  // =========================================
  const modal = document.getElementById("modalCrearPublicacion");
  const btnCrear = document.querySelector(".btn-crear-publicacion");
  const btnCerrarModal = document.getElementById("btnCerrarModal");
  const textoPublicacion = document.getElementById("textoPublicacion");
  const fileInput = document.getElementById("fileInput");
  const btnAddImage = document.getElementById("btnAddImage");
  const previewContainer = document.getElementById("previewContainer");
  const previewImage = document.getElementById("previewImage");
  const btnPublicar = document.getElementById("btnPublicar");
  const loaderPublicar = document.getElementById("loaderPublicar");

  let imagenSeleccionada = null;

  if (btnCrear) {
    btnCrear.addEventListener("click", () => {
      modal.classList.add("show");
      textoPublicacion.value = "";
      previewContainer.style.display = "none";
      previewImage.src = "";
      imagenSeleccionada = null;
    });
  }

  if (btnCerrarModal) {
    btnCerrarModal.addEventListener("click", () =>
      modal.classList.remove("show"),
    );
  }
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.remove("show");
  });

  if (btnAddImage) {
    btnAddImage.addEventListener("click", () => fileInput.click());
  }

  if (fileInput) {
    fileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          const MAX_WIDTH = 800;
          let width = img.width;
          let height = img.height;

          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);
          imagenSeleccionada = compressedBase64;

          previewImage.src = compressedBase64;
          previewContainer.style.display = "block";
        };
      };
    });
  }

  if (btnPublicar) {
    btnPublicar.addEventListener("click", () => {
      const texto = textoPublicacion.value.trim();

      if (!texto && !imagenSeleccionada) {
        const alertaHTML = `
          <div class="alerta-personalizada alert alert-danger alert-dismissible fade show" role="alert">
            <strong>¡Ups!</strong> Debes escribir algo o subir una imagen para publicar.
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>
        `;
        dashboardMain.insertAdjacentHTML("afterbegin", alertaHTML);
        setTimeout(() => {
          const alerta = document.querySelector(".alerta-personalizada");
          if (alerta) alerta.remove();
        }, 3000);
        return;
      }

      btnPublicar.disabled = true;
      btnPublicar.querySelector("span").style.display = "none";
      loaderPublicar.style.display = "block";

      setTimeout(() => {
        const nuevaPublicacion = document.createElement("article");
        nuevaPublicacion.className = "publicacion-card";

        const imgHTML = imagenSeleccionada
          ? `<img src="${imagenSeleccionada}" alt="Publicación" class="publicacion-img" style="margin-top: 1rem;">`
          : "";

        nuevaPublicacion.innerHTML = `
          <div class="publicacion-header">
            <div class="publicacion-user">
              <img src="../assets/img/icons/mode-clear/icon-img-profile.svg" alt="Perfil" class="publicacion-avatar">
              <div class="publicacion-user-info">
                <span class="publicacion-user-name">${nombreGuardado}</span>
                <span class="publicacion-fecha">Fecha: Hace un momento</span>
              </div>
            </div>
            <div class="publicacion-options-container">
              <button class="btn-options">
                <img src="../assets/img/publicacion/icon-publicacion-opcion.svg" alt="Opciones">
              </button>
              <div class="publicacion-dropdown">
                <button class="dropdown-item">
                  <img src="../assets/img/publicacion/icon-publicacion-no-interes.svg" alt="No me interesa">
                  <span>No me interesa</span>
                </button>
                <button class="dropdown-item">
                  <img src="../assets/img/publicacion/icon-publicacion-save.svg" alt="Guardar">
                  <span>Guardar</span>
                </button>
                <button class="dropdown-item">
                  <img src="../assets/img/publicacion/icon-publicacion-reportar.svg" alt="Reportar">
                  <span>Reportar</span>
                </button>
              </div>
            </div>
          </div>
          <div class="publicacion-content">
            <p class="publicacion-texto">${texto}</p>
            ${imgHTML}
          </div>
          <div class="publicacion-footer">
            <button class="btn-action-pub"><img src="../assets/img/publicacion/icon-publicacion-gustar.svg" alt="Me gusta"><span>Me gusta</span></button>
            <button class="btn-action-pub"><img src="../assets/img/publicacion/icon-publicacion-comentar.svg" alt="Comentar"><span>Comentar</span></button>
            <button class="btn-action-pub"><img src="../assets/img/publicacion/icon-publicacion-compartir.svg" alt="Compartir"><span>Compartir</span></button>
          </div>
        `;

        btnCrear.insertAdjacentElement("afterend", nuevaPublicacion);

        // Aplicamos "Ver más" a la nueva publicación
        aplicarVerMas(nuevaPublicacion);

        modal.classList.remove("show");
        btnPublicar.disabled = false;
        btnPublicar.querySelector("span").style.display = "block";
        loaderPublicar.style.display = "none";
        textoPublicacion.value = "";
        previewContainer.style.display = "none";
        previewImage.src = "";
        imagenSeleccionada = null;
      }, 1500);
    });
  }
});
