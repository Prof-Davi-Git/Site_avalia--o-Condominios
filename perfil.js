const accountTabs = document.querySelectorAll("[data-account-tab]");
const accountSections = document.querySelectorAll(".account-section");
const accountToast = document.querySelector("#accountToast");
let accountToastTimer;

function showAccountToast(message) {
  if (!accountToast) return;

  clearTimeout(accountToastTimer);
  accountToast.textContent = message;
  accountToast.classList.add("is-visible");

  accountToastTimer = window.setTimeout(() => {
    accountToast.classList.remove("is-visible");
  }, 2800);
}

function openAccountSection(sectionId) {
  accountTabs.forEach((tab) => {
    const active = tab.dataset.accountTab === sectionId;
    tab.classList.toggle("is-active", active);
    tab.setAttribute("aria-selected", String(active));
  });

  accountSections.forEach((section) => {
    section.classList.toggle("is-active", section.id === sectionId);
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
}

accountTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    openAccountSection(tab.dataset.accountTab);
  });
});

document.querySelectorAll("[data-open-section]").forEach((button) => {
  button.addEventListener("click", () => {
    openAccountSection(button.dataset.openSection);
  });
});

document.querySelectorAll("[data-edit-form]").forEach((button) => {
  button.addEventListener("click", () => {
    const form = document.querySelector(button.dataset.editForm);
    if (!form) return;

    const fields = form.querySelectorAll("input, textarea, select");
    const editing = button.dataset.editing === "true";

    fields.forEach((field) => {
      field.disabled = editing;
    });

    button.dataset.editing = String(!editing);
    button.textContent = editing ? "Editar dados" : "Cancelar edição";

    const saveButton = form.querySelector("[data-save-form]");
    if (saveButton) saveButton.hidden = editing;
  });
});

document.querySelectorAll("[data-save-form]").forEach((button) => {
  button.addEventListener("click", () => {
    const form = button.closest("form");
    if (!form) return;

    form.querySelectorAll("input, textarea, select").forEach((field) => {
      field.disabled = true;
    });

    const editButton = document.querySelector('[data-edit-form="#' + form.id + '"]');
    if (editButton) {
      editButton.dataset.editing = "false";
      editButton.textContent = "Editar dados";
    }

    button.hidden = true;
    showAccountToast("Alterações salvas nesta demonstração.");
  });
});

document.querySelectorAll("[data-remove-saved]").forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.closest(".saved-condo");
    if (item) item.remove();
    showAccountToast("Condomínio removido dos salvos.");
  });
});

document.querySelectorAll("[data-edit-review]").forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.closest(".review-item");
    const editor = item ? item.querySelector(".inline-editor") : null;
    if (editor) editor.classList.toggle("is-open");
  });
});

document.querySelectorAll("[data-save-review]").forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.closest(".review-item");
    const editor = button.closest(".inline-editor");
    const textarea = editor ? editor.querySelector("textarea") : null;
    const text = item ? item.querySelector("[data-review-text]") : null;

    if (textarea && text && textarea.value.trim()) {
      text.textContent = textarea.value.trim();
    }

    if (editor) editor.classList.remove("is-open");
    showAccountToast("Avaliação atualizada nesta demonstração.");
  });
});

document.querySelectorAll("[data-delete-review]").forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.closest(".review-item");
    if (item) item.remove();
    showAccountToast("Avaliação removida nesta demonstração.");
  });
});

document.querySelectorAll("[data-reply-review]").forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.closest(".management-item");
    const editor = item ? item.querySelector(".inline-editor") : null;
    if (editor) editor.classList.toggle("is-open");
  });
});

document.querySelectorAll("[data-send-reply]").forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.closest(".management-item");
    const editor = button.closest(".inline-editor");
    const textarea = editor ? editor.querySelector("textarea") : null;
    const status = item ? item.querySelector("[data-response-status]") : null;

    if (!textarea || !textarea.value.trim()) {
      showAccountToast("Digite uma resposta antes de enviar.");
      return;
    }

    if (status) {
      status.textContent = "Respondida";
      status.classList.remove("pending");
    }

    editor.classList.remove("is-open");
    showAccountToast("Resposta publicada nesta demonstração.");
  });
});

document.querySelectorAll("[data-photo-remove]").forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.closest(".photo-management-item");
    if (item) item.remove();
    showAccountToast("Foto removida nesta demonstração.");
  });
});

const photoInput = document.querySelector("#profilePhotoUpload");
const photoGrid = document.querySelector("#profilePhotoGrid");

if (photoInput) {
  photoInput.addEventListener("change", () => {
    const file = photoInput.files && photoInput.files[0];
    if (!file || !photoGrid) return;

    const item = document.createElement("div");
    item.className = "photo-management-item";

    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);
    img.alt = "Nova foto selecionada";

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "photo-remove";
    remove.textContent = "Remover";
    remove.addEventListener("click", () => {
      item.remove();
      showAccountToast("Foto removida nesta demonstração.");
    });

    item.append(img, remove);

    const upload = photoGrid.querySelector(".photo-upload");
    photoGrid.insertBefore(item, upload);
    photoInput.value = "";
    showAccountToast("Foto adicionada à prévia do perfil.");
  });
}

const inviteForm = document.querySelector("#inviteTeamForm");

if (inviteForm) {
  inviteForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = inviteForm.querySelector('input[type="email"]');
    const list = document.querySelector("#teamList");

    if (!email || !email.value.trim() || !list) return;

    const item = document.createElement("div");
    item.className = "team-item";
    item.innerHTML =
      "<strong>" + email.value.trim() + "</strong>" +
      "<p>Convite pendente para acesso ao perfil do condomínio.</p>" +
      '<span class="status-pill pending">Convite enviado</span>';

    list.appendChild(item);
    email.value = "";
    showAccountToast("Convite adicionado nesta demonstração.");
  });
}

document.querySelectorAll(".toggle input").forEach((input) => {
  input.addEventListener("change", () => {
    showAccountToast("Preferência atualizada nesta demonstração.");
  });
});

document.querySelectorAll("[data-demo-action]").forEach((button) => {
  button.addEventListener("click", () => {
    showAccountToast(button.dataset.demoAction);
  });
});
