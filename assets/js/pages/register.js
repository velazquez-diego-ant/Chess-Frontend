
//* ==========================================
//* LÓGICA PRINCIPAL DEL REGISTRO
//* ==========================================

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  if (!form) return;

  const usernameInput = document.getElementById("nombre");
  const emailInput = document.getElementById("correo");
  const passwordInput = document.getElementById("pass");
  const confirmPasswordInput = document.getElementById("confirm-pass");
  const alertContainer = document.getElementById("alert-container");

  //* ==========================================
  //* 1. INICIALIZACIÓN DEL CALENDARIO (FLATPICKR)
  //* ==========================================

  const fechaInput = document.getElementById("fecha");

  if (fechaInput && typeof flatpickr !== "undefined") {
    flatpickr(fechaInput, {
      locale: flatpickr.l10ns.es, // Usamos la global de flatpickr
      dateFormat: "d/m/Y",
      maxDate: "today",
      disableMobile: true,
      allowInput: true,
    });
  }

  //* ==========================================
  //* 2. VALIDACIÓN EN TIEMPO REAL DE REQUISITOS
  //* ==========================================

  const reqMayuscula = document.getElementById("req-mayuscula");
  const reqMinuscula = document.getElementById("req-minuscula");
  const reqNumero = document.getElementById("req-numero");
  const reqEspecial = document.getElementById("req-especial");

  if (passwordInput) {
    passwordInput.addEventListener("input", () => {
      const val = passwordInput.value;

      if (/[A-Z]/.test(val)) {
        reqMayuscula.classList.add("cumplido");
      } else {
        reqMayuscula.classList.remove("cumplido");
      }

      if (/[a-z]/.test(val)) {
        reqMinuscula.classList.add("cumplido");
      } else {
        reqMinuscula.classList.remove("cumplido");
      }

      if (/[0-9]/.test(val)) {
        reqNumero.classList.add("cumplido");
      } else {
        reqNumero.classList.remove("cumplido");
      }

      if (/[!@#$%&*]/.test(val)) {
        reqEspecial.classList.add("cumplido");
      } else {
        reqEspecial.classList.remove("cumplido");
      }
    });
  }

  //* ==========================================
  //* 3. FUNCIÓN AUXILIAR PARA MOSTRAR ALERTAS
  //* ==========================================
  
  function mostrarAlertaBootstrap(mensaje, tipo = "danger") {
    if (!alertContainer) {
      alert(mensaje);
      return;
    }
    alertContainer.innerHTML = `
      <div class="alert alert-${tipo} alert-dismissible fade show shadow-sm" role="alert">
        ${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    `;
    setTimeout(() => {
      const alerta = alertContainer.querySelector(".alert");
      if (alerta) {
        alerta.classList.remove("show");
        setTimeout(() => alerta.remove(), 300);
      }
    }, 4000);
  }

  //* ==========================================
  //* 4. ENVÍO DEL FORMULARIO
  //* ==========================================

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    const fechaNacimiento = document.getElementById("fecha").value;

    if (alertContainer) alertContainer.innerHTML = "";

    if (
      !username ||
      !email ||
      !password ||
      !confirmPassword ||
      !fechaNacimiento
    ) {
      mostrarAlertaBootstrap(
        "Por favor, complete todos los campos del formulario.",
        "danger",
      );
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      mostrarAlertaBootstrap(
        "Ingrese un correo electrónico válido.",
        "warning",
      );
      return;
    }

    if (password.length < 8) {
      mostrarAlertaBootstrap(
        "La contraseña debe tener al menos 8 caracteres.",
        "danger",
      );
      return;
    }

    const tieneMayuscula = /[A-Z]/.test(password);
    const tieneMinuscula = /[a-z]/.test(password);
    const tieneNumero = /[0-9]/.test(password);
    const tieneEspecial = /[!@#$%&*]/.test(password);

    if (!tieneMayuscula || !tieneMinuscula || !tieneNumero || !tieneEspecial) {
      mostrarAlertaBootstrap(
        "La contraseña no cumple con todos los requisitos de seguridad.",
        "danger",
      );
      return;
    }

    if (password !== confirmPassword) {
      mostrarAlertaBootstrap(
        "Las contraseñas ingresadas no coinciden.",
        "danger",
      );
      return;
    }

    //* ==========================================
    //* 5. SIMULACIÓN DE GUARDADO EN LOCALSTORAGE
    //* ==========================================

    try {
      const usuarioExistente = JSON.parse(
        localStorage.getItem("usuarioRegistrado"),
      );

      if (usuarioExistente && usuarioExistente.email === email) {
        mostrarAlertaBootstrap(
          "Este correo electrónico ya está registrado. Intenta iniciar sesión.",
          "warning",
        );
        return;
      }

      const nuevoUsuario = {
        id: Date.now(),
        name: username,
        email: email,
        password: password,
        fechaNacimiento: fechaNacimiento,
        role: "user",
      };

      localStorage.setItem("usuarioRegistrado", JSON.stringify(nuevoUsuario));

      mostrarAlertaBootstrap(
        "¡Registro exitoso! Redirigiendo al login...",
        "success",
      );

      form.reset();
      document
        .querySelectorAll(".lista-requisitos li")
        .forEach((li) => li.classList.remove("cumplido"));

      setTimeout(() => {
        window.location.href = "./login.html";
      }, 2000);
    } catch (error) {
      console.error("Register error técnico:", error);
      mostrarAlertaBootstrap(
        "Ocurrió un error inesperado. Inténtalo de nuevo.",
        "danger",
      );
    }
  });

  //* ==========================================
  //* 6. TOGGLE PASSWORD (MOSTRAR/OCULTAR)
  //* ==========================================

  const toggleButtons = document.querySelectorAll(".toggle-password");

  toggleButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const wrapper = button.closest(".input-wrapper");
      const input = wrapper.querySelector("input");
      const icon = wrapper.querySelector(".toggle-icon");

      if (input && icon) {
        const esPassword = input.type === "password";
        input.type = esPassword ? "text" : "password";

        icon.src = esPassword
          ? "../assets/img/icons/mode-clear/icon-eye.svg"
          : "../assets/img/icons/mode-clear/icon-eye-off.svg";

        icon.alt = esPassword ? "Ocultar contraseña" : "Mostrar contraseña";
      }
    });
  });
});
