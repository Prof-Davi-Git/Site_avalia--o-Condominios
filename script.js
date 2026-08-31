const mobileMenuButton = document.querySelector("#mobileMenuButton");
const mainNavigation = document.querySelector("#mainNavigation");
const dropdowns = document.querySelectorAll(".nav-dropdown");
const searchForm = document.querySelector("#searchForm");
const searchInput = document.querySelector("#condoSearch");
const suggestionsBox = document.querySelector("#searchSuggestions");
const searchFeedback = document.querySelector("#searchFeedback");
const sharedToast = document.querySelector("#toast");

const condominios = [
  {
    nome: "Residencial Parque das Flores",
    endereco: "São Paulo - SP",
    url: "condominio.html"
  }
];

let sharedToastTimer;

function normalizeText(text) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function showSharedToast(message) {
  if (!sharedToast) return;

  clearTimeout(sharedToastTimer);
  sharedToast.textContent = message;
  sharedToast.classList.add("is-visible");

  sharedToastTimer = window.setTimeout(() => {
    sharedToast.classList.remove("is-visible");
  }, 3200);
}

if (mobileMenuButton && mainNavigation) {
  mobileMenuButton.addEventListener("click", () => {
    const isOpen = mainNavigation.classList.toggle("is-open");

    mobileMenuButton.setAttribute("aria-expanded", String(isOpen));
    mobileMenuButton.setAttribute(
      "aria-label",
      isOpen ? "Fechar menu" : "Abrir menu"
    );
  });
}

dropdowns.forEach((dropdown) => {
  const toggle = dropdown.querySelector(".dropdown-toggle");

  if (!toggle) return;

  toggle.addEventListener("click", () => {
    const willOpen = !dropdown.classList.contains("is-open");

    dropdowns.forEach((item) => {
      item.classList.remove("is-open");
      item
        .querySelector(".dropdown-toggle")
        ?.setAttribute("aria-expanded", "false");
    });

    if (willOpen) {
      dropdown.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
    }
  });
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".nav-dropdown")) {
    dropdowns.forEach((dropdown) => {
      dropdown.classList.remove("is-open");
      dropdown
        .querySelector(".dropdown-toggle")
        ?.setAttribute("aria-expanded", "false");
    });
  }

  if (searchForm && !searchForm.contains(event.target)) {
    closeSuggestions();
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 980 && mainNavigation && mobileMenuButton) {
    mainNavigation.classList.remove("is-open");
    mobileMenuButton.setAttribute("aria-expanded", "false");
    mobileMenuButton.setAttribute("aria-label", "Abrir menu");
  }
});

function closeSuggestions() {
  if (!suggestionsBox) return;

  suggestionsBox.classList.remove("is-visible");
  suggestionsBox.innerHTML = "";
}

function renderSuggestions(query) {
  if (!suggestionsBox) return;

  const normalizedQuery = normalizeText(query);

  if (normalizedQuery.length < 2) {
    closeSuggestions();
    return;
  }

  const matches = condominios.filter((condominio) => {
    const searchableText = normalizeText(
      `${condominio.nome} ${condominio.endereco}`
    );

    return searchableText.includes(normalizedQuery);
  });

  if (matches.length === 0) {
    suggestionsBox.innerHTML = `
      <div class="suggestion-item" role="option" aria-disabled="true">
        <span class="suggestion-pin">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"></path>
            <circle cx="12" cy="10" r="2.5"></circle>
          </svg>
        </span>
        <span class="suggestion-copy">
          <strong>Nenhum condomínio encontrado</strong>
          <small>Novos condomínios serão adicionados conforme a plataforma crescer.</small>
        </span>
      </div>
    `;
  } else {
    suggestionsBox.innerHTML = matches
      .map(
        (condominio) => `
          <button
            class="suggestion-item"
            type="button"
            role="option"
            data-condominio-url="${condominio.url}"
          >
            <span class="suggestion-pin">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"></path>
                <circle cx="12" cy="10" r="2.5"></circle>
              </svg>
            </span>
            <span class="suggestion-copy">
              <strong>${condominio.nome}</strong>
              <small>${condominio.endereco}</small>
            </span>
          </button>
        `
      )
      .join("");
  }

  suggestionsBox.classList.add("is-visible");
}

if (searchInput) {
  searchInput.addEventListener("input", (event) => {
    if (searchFeedback) searchFeedback.textContent = "";
    renderSuggestions(event.target.value);
  });
}

if (suggestionsBox) {
  suggestionsBox.addEventListener("click", (event) => {
    const selectedItem = event.target.closest("[data-condominio-url]");

    if (!selectedItem) return;

    window.location.href = selectedItem.dataset.condominioUrl;
  });
}

if (searchForm && searchInput) {
  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const query = searchInput.value.trim();

    if (query.length < 2) {
      if (searchFeedback) {
        searchFeedback.textContent =
          "Digite pelo menos 2 caracteres para realizar a busca.";
      }
      searchInput.focus();
      return;
    }

    const normalizedQuery = normalizeText(query);
    const match = condominios.find((condominio) => {
      const searchableText = normalizeText(
        `${condominio.nome} ${condominio.endereco}`
      );

      return searchableText.includes(normalizedQuery);
    });

    if (match) {
      window.location.href = match.url;
      return;
    }

    closeSuggestions();

    if (searchFeedback) {
      searchFeedback.textContent =
        "Ainda não encontramos esse condomínio na base de demonstração.";
    }

    showSharedToast(
      "Por enquanto, o Residencial Parque das Flores é o perfil disponível para demonstração."
    );
  });
}
