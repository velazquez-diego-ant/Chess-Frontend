
//* ==========================================
//* LOGIN - LÓGICA PRINCIPAL
//* ==========================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const emailError = document.getElementById("emailError");
    const passwordError = document.getElementById("passwordError");
    const alertContainer = document.getElementById("alert-container");

    // Limpiar estados previos
    if (emailError) emailError.textContent = "";
    if (passwordError) passwordError.textContent = "";
    if (alertContainer) alertContainer.innerHTML = "";
    if (emailInput) emailInput.classList.remove("input-error");
    if (passwordInput) passwordInput.classList.remove("input-error");

    //* ==========================================
    //* FUNCIÓN AUXILIAR PARA MOSTRAR ALERTAS BOOTSTRAP
    //* ==========================================

    function mostrarAlertaBootstrap(mensaje, tipo = "danger") {
      if (!alertContainer) {
        alert(mensaje); // Respaldo de emergencia
        return;
      }

      alertContainer.innerHTML = `
        <div class="alert alert-${tipo} alert-dismissible fade show shadow-sm" role="alert">
          ${mensaje}
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      `;

      // Auto-cerrar después de 4 segundos
      setTimeout(() => {
        const alerta = alertContainer.querySelector(".alert");
        if (alerta) {
          alerta.classList.remove("show");
          setTimeout(() => alerta.remove(), 300);
        }
      }, 4000);
    }

    //* ==========================================
    //* VALIDACIONES LOCALES (Frontend)
    //* ==========================================

    const emailVacio = email === "";
    const passwordVacio = password === "";

    //* Caso 1: ambos vacíos
    if (emailVacio && passwordVacio) {
      mostrarAlertaBootstrap(
        "Por favor, ingresa tu correo y contraseña.",
        "danger",
      );
      emailInput.classList.add("input-error");
      passwordInput.classList.add("input-error");
      return;
    }

    //* Caso 2: solo correo vacío
    if (emailVacio && !passwordVacio) {
      emailError.textContent = "El correo electrónico es obligatorio.";
      emailInput.classList.add("input-error");
      return;
    }

    //* Caso 3: solo contraseña vacía
    if (!emailVacio && passwordVacio) {
      passwordError.textContent = "La contraseña es obligatoria.";
      passwordInput.classList.add("input-error");
      return;
    }

    // Caso 4: formato de email inválido
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      emailError.textContent = "Ingresa un correo electrónico válido.";
      emailInput.classList.add("input-error");
      return;
    }

    //* ==========================================
    //* SIMULACIÓN DE LOGIN CON LOCALSTORAGE
    //* ==========================================
    
    try {
      // Simulamos un tiempo de carga de 1 segundo
      mostrarAlertaBootstrap("Verificando credenciales...", "info");

      setTimeout(() => {
        //* 1. Buscamos si hay un usuario registrado en el localStorage
        const usuarioGuardado = JSON.parse(localStorage.getItem("usuarioRegistrado"));

        //* 2. Verificamos si existe y si las credenciales coinciden
        if (
          !usuarioGuardado ||
          usuarioGuardado.email !== email ||
          usuarioGuardado.password !== password
        ) {
          //* Si no hay usuario o no coinciden, error
          mostrarAlertaBootstrap(
            "El correo electrónico o la contraseña son incorrectos.",
            "danger",
          );
          if (emailInput) emailInput.classList.add("input-error");
          if (passwordInput) passwordInput.classList.add("input-error");
          return;
        }

        // TODO: 3. LOGIN CORRECTO: Guardamos la sesión activa
        localStorage.setItem("sesionActiva", "true");
        localStorage.setItem("usuarioId", usuarioGuardado.id);
        localStorage.setItem("usuarioActivo", usuarioGuardado.name);
        localStorage.setItem("nombreUsuario", usuarioGuardado.name);
        localStorage.setItem("usuarioEmail", usuarioGuardado.email);
        localStorage.setItem("usuarioRol", usuarioGuardado.role);

        loginForm.reset();
        mostrarAlertaBootstrap(
          "¡Inicio de sesión exitoso! Redirigiendo...",
          "success",
        );

        // Redirigir al index después de 1.5 segundos
        setTimeout(() => {
          window.location.href = "../index.html";
        }, 1500);

      }, 1000);

    } catch (error) {
      console.error("Login error:", error);
      mostrarAlertaBootstrap(
        "Ocurrió un error inesperado. Inténtalo de nuevo.",
        "danger",
      );
    }
  });
}

//* ==========================================
//* TOGGLE PASSWORD (MOSTRAR/OCULTAR)
//* ==========================================
document.addEventListener("DOMContentLoaded", () => {
  const togglePassword = document.getElementById("togglePassword");
  const toggleIcon = document.getElementById("toggleIcon");
  const passwordInput = document.getElementById("password");

  if (togglePassword && toggleIcon && passwordInput) {
    togglePassword.addEventListener("click", () => {
      const esPassword = passwordInput.type === "password";
      passwordInput.type = esPassword ? "text" : "password";
      
      // Cambiamos el icono usando las rutas de PawnShare
      toggleIcon.src = esPassword
        ? "../assets/img/icons/mode-clear/icon-eye.svg" // Ojo abierto (visible)
        : "../assets/img/icons/mode-clear/icon-eye-off.svg"; // Ojo cerrado (oculto)
        
      toggleIcon.alt = esPassword ? "Ocultar contraseña" : "Mostrar contraseña";
    });
  }
});

//* ==========================================
//* QUITAR BORDE ROJO Y LIMPIAR ERRORES AL ESCRIBIR
//* ==========================================
document.addEventListener("DOMContentLoaded", () => {
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  if (emailInput) {
    emailInput.addEventListener("input", () => {
      emailInput.classList.remove("input-error");
      const emailError = document.getElementById("emailError");
      if (emailError) emailError.textContent = "";
    });
  }

  if (passwordInput) {
    passwordInput.addEventListener("input", () => {
      passwordInput.classList.remove("input-error");
      const passwordError = document.getElementById("passwordError");
      if (passwordError) passwordError.textContent = "";
    });
  }
});

//* ==========================================
//* REDIRECCIÓN AL REGISTRO
//* ==========================================
document.addEventListener("DOMContentLoaded", () => {
  const registerLink = document.getElementById("registerLink");
  if (registerLink) {
    registerLink.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "./register.html";
    });
  }
});