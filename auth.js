const authPage = document.body.dataset.authPage;

function setFieldError(input, message) {
  if (!input) return;

  const wrap = input.closest(".auth-input-wrap");
  const error = document.querySelector(`[data-error-for="${input.id}"]`);

  wrap?.classList.toggle("has-error", Boolean(message));

  if (error) {
    error.textContent = message || "";
  }
}

function clearFieldError(input) {
  setFieldError(input, "");
}

function validateRequiredInput(input) {
  if (!input) return true;

  const value = input.value.trim();

  if (!value) {
    setFieldError(input, "Preencha este campo.");
    return false;
  }

  if (input.type === "email" && !input.validity.valid) {
    setFieldError(input, "Informe um e-mail válido.");
    return false;
  }

  if (input.minLength > 0 && value.length < input.minLength) {
    setFieldError(
      input,
      `Use pelo menos ${input.minLength} caracteres.`
    );
    return false;
  }

  clearFieldError(input);
  return true;
}

function showStatus(element, message, type = "success") {
  if (!element) return;

  element.textContent = message;
  element.classList.add("is-visible");
  element.classList.toggle("is-error", type === "error");
}

document.querySelectorAll("[data-password-toggle]").forEach((button) => {
  button.addEventListener("click", () => {
    const inputId = button.dataset.passwordToggle;
    const input = document.getElementById(inputId);

    if (!input) return;

    const showing = input.type === "text";
    input.type = showing ? "password" : "text";
    button.classList.toggle("is-visible", !showing);
    button.setAttribute("aria-label", showing ? "Mostrar senha" : "Ocultar senha");
  });
});

document.querySelectorAll(".auth-input-wrap input").forEach((input) => {
  input.addEventListener("input", () => {
    if (input.value.trim()) {
      clearFieldError(input);
    }
  });
});

if (authPage === "login") {
  const loginForm = document.querySelector("#loginForm");
  const email = document.querySelector("#loginEmail");
  const password = document.querySelector("#loginPassword");
  const status = document.querySelector("#loginStatus");
  const forgotPasswordLink = document.querySelector("#forgotPasswordLink");

  loginForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    const emailValid = validateRequiredInput(email);
    const passwordValid = validateRequiredInput(password);

    if (!emailValid || !passwordValid) {
      showStatus(
        status,
        "Revise os campos indicados antes de continuar.",
        "error"
      );
      return;
    }

    showStatus(
      status,
      "Interface de login pronta. A autenticação segura com servidor será conectada na etapa de backend."
    );
  });

  forgotPasswordLink?.addEventListener("click", (event) => {
    event.preventDefault();

    showStatus(
      status,
      "A recuperação de senha será disponibilizada quando conectarmos o sistema de autenticação."
    );
  });
}

if (authPage === "cadastro") {
  const registerForm = document.querySelector("#registerForm");
  const name = document.querySelector("#registerName");
  const email = document.querySelector("#registerEmail");
  const password = document.querySelector("#registerPassword");
  const passwordConfirm = document.querySelector("#registerPasswordConfirm");
  const acceptTerms = document.querySelector("#acceptTerms");
  const representativeFields = document.querySelector("#representativeFields");
  const condoName = document.querySelector("#condoName");
  const representativeRole = document.querySelector("#representativeRole");
  const status = document.querySelector("#registerStatus");
  const strength = document.querySelector("#passwordStrength");

  const updateRepresentativeFields = () => {
    const selected = document.querySelector(
      'input[name="accountType"]:checked'
    )?.value;
    const isRepresentative = selected === "representante";

    if (representativeFields) {
      representativeFields.hidden = !isRepresentative;
    }

    if (condoName) {
      condoName.required = isRepresentative;
      if (!isRepresentative) clearFieldError(condoName);
    }

    if (representativeRole) {
      representativeRole.required = isRepresentative;
      if (!isRepresentative) clearFieldError(representativeRole);
    }
  };

  document.querySelectorAll('input[name="accountType"]').forEach((radio) => {
    radio.addEventListener("change", updateRepresentativeFields);
  });

  updateRepresentativeFields();

  const updatePasswordStrength = () => {
    if (!password || !strength) return;

    const value = password.value;
    let score = 0;

    if (value.length >= 8) score += 1;
    if (/[A-Za-z]/.test(value) && /\d/.test(value)) score += 1;
    if (/[^A-Za-z0-9]/.test(value) && value.length >= 10) score += 1;

    strength.removeAttribute("data-strength");

    if (!value) {
      strength.querySelector("small").textContent =
        "Use pelo menos 8 caracteres, com letras e números.";
      return;
    }

    if (score <= 1) {
      strength.dataset.strength = "weak";
      strength.querySelector("small").textContent =
        "Senha fraca. Combine letras e números.";
    } else if (score === 2) {
      strength.dataset.strength = "medium";
      strength.querySelector("small").textContent =
        "Senha média. Um caractere especial pode deixá-la mais forte.";
    } else {
      strength.dataset.strength = "strong";
      strength.querySelector("small").textContent = "Senha forte.";
    }
  };

  password?.addEventListener("input", updatePasswordStrength);

  passwordConfirm?.addEventListener("input", () => {
    if (
      passwordConfirm.value &&
      password &&
      passwordConfirm.value === password.value
    ) {
      clearFieldError(passwordConfirm);
    }
  });

  registerForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    const selectedType = document.querySelector(
      'input[name="accountType"]:checked'
    )?.value;

    let valid = true;

    [name, email, password, passwordConfirm].forEach((input) => {
      valid = validateRequiredInput(input) && valid;
    });

    if (
      password &&
      passwordConfirm &&
      passwordConfirm.value &&
      password.value !== passwordConfirm.value
    ) {
      setFieldError(passwordConfirm, "As senhas não coincidem.");
      valid = false;
    }

    if (selectedType === "representante") {
      valid = validateRequiredInput(condoName) && valid;
      valid = validateRequiredInput(representativeRole) && valid;
    }

    const termsError = document.querySelector(
      '[data-error-for="acceptTerms"]'
    );

    if (!acceptTerms?.checked) {
      if (termsError) {
        termsError.textContent = "É necessário aceitar os termos para continuar.";
      }
      valid = false;
    } else if (termsError) {
      termsError.textContent = "";
    }

    if (!valid) {
      showStatus(
        status,
        "Revise os campos indicados antes de criar a conta.",
        "error"
      );
      return;
    }

    showStatus(
      status,
      "Interface de cadastro pronta. O armazenamento seguro dos dados será conectado na etapa de backend."
    );
  });

  acceptTerms?.addEventListener("change", () => {
    const termsError = document.querySelector(
      '[data-error-for="acceptTerms"]'
    );

    if (acceptTerms.checked && termsError) {
      termsError.textContent = "";
    }
  });
}
