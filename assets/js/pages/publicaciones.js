// assets/js/pages/publicaciones.js

document.addEventListener("DOMContentLoaded", () => {
  // =========================================
  // 1. DATOS DEL USUARIO (Nombre dinámico)
  // =========================================
  const sidebarUserName = document.getElementById("sidebar-user-name");
  const pubUserName = document.getElementById("pub-user-name");
  const pubUserName2 = document.getElementById("pub-user-name-2"); // Segunda publicación

  const nombreGuardado = localStorage.getItem("nombreUsuario") || "Usuario";

  if (sidebarUserName) sidebarUserName.textContent = nombreGuardado;
  if (pubUserName) pubUserName.textContent = nombreGuardado;
  if (pubUserName2) pubUserName2.textContent = nombreGuardado; // Asignar a la segunda

  // =========================================
  // 2. LÓGICA DEL MENÚ LATERAL
  // =========================================
  const sidebarLinks = document.querySelectorAll(".sidebar-link");
  sidebarLinks.forEach((link) => link.classList.remove("active")); // Limpiar por defecto

  sidebarLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      sidebarLinks.forEach((l) => l.classList.remove("active"));
      link.classList.add("active");
    });
  });

  // =========================================
  // 3. MENÚ DE OPCIONES DE LAS PUBLICACIONES (3 puntos)
  // =========================================
  const setupDropdown = (btnId, dropdownId) => {
    const btn = document.getElementById(btnId);
    const dropdown = document.getElementById(dropdownId);

    if (btn && dropdown) {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        // Cerrar otros dropdowns abiertos
        document.querySelectorAll(".publicacion-dropdown").forEach((d) => {
          if (d !== dropdown) d.classList.remove("show");
        });
        dropdown.classList.toggle("show");
      });
    }
  };

  // Configurar ambos dropdowns
  setupDropdown("btn-options-1", "dropdown-1");
  setupDropdown("btn-options-2", "dropdown-2");

  // Cerrar dropdowns al hacer clic fuera
  document.addEventListener("click", (e) => {
    document.querySelectorAll(".publicacion-dropdown").forEach((d) => {
      const btn = d.previousElementSibling;
      if (btn && !btn.contains(e.target) && !d.contains(e.target)) {
        d.classList.remove("show");
      }
    });
  });
});
