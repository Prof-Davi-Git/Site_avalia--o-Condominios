const mobileMenuButton = document.querySelector("#mobileMenuButton");
const mainNavigation = document.querySelector("#mainNavigation");
const dropdowns = document.querySelectorAll(".nav-dropdown");
const searchForm = document.querySelector("#searchForm");
const searchInput = document.querySelector("#condoSearch");
const suggestionsBox = document.querySelector("#searchSuggestions");
const searchFeedback = document.querySelector("#searchFeedback");
const sharedToast = document.querySelector("#toast");
const heroVisual = document.querySelector("#heroVisual");
const condoBrowser = document.querySelector("#condoBrowser");
const condoBrowserList = document.querySelector("#condoBrowserList");
const searchActionLinks = document.querySelectorAll("[data-search-action='true']");

const condominios = [
  {
    nome: "Residencial Parque das Flores",
    endereco: "São Paulo - SP",
    nota: "4,7",
    avaliacoes: 184,
    url: "condominio.html",
    imagem:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=900&q=85"
  }
];

let sharedToastTimer;
let searchModeActive = false;

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

function getMatches(query) {
  const normalizedQuery = normalizeText(query);

  if (!normalizedQuery) {
    return condominios;
  }

  return condominios.filter((condominio) => {
    const searchableText = normalizeText(
      `${condominio.nome} ${condominio.endereco}`
    );

    return searchableText.includes(normalizedQuery);
  });
}

function buildArrowIcon() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14"></path>
      <path d="m13 6 6 6-6 6"></path>
    </svg>
  `;
}

function buildPinIcon() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"></path>
      <circle cx="12" cy="10" r="2.5"></circle>
    </svg>
  `;
}

function renderCondoBrowser(query = "") {
  if (!condoBrowserList) return;

  const matches = getMatches(query);

  if (matches.length === 0) {
    condoBrowserList.innerHTML = `
      <div class="condo-browser-empty">
        <div>
          <strong>Nenhum condomínio encontrado</strong>
          <p>
            Tente pesquisar por outro nome ou localização. Novos perfis serão exibidos aqui conforme forem cadastrados.
          </p>
        </div>
      </div>
    `;
    return;
  }

  condoBrowserList.innerHTML = matches
    .map(
      (condominio) => `
        <button
          class="condo-browser-card"
          type="button"
          data-condominio-url="${condominio.url}"
          aria-label="Abrir perfil de ${condominio.nome}"
        >
          <span class="condo-browser-thumb">
            <img src="${condominio.imagem}" alt="Imagem de ${condominio.nome}" />
          </span>

          <span class="condo-browser-copy">
            <strong>${condominio.nome}</strong>
            <span class="condo-browser-address">${condominio.endereco}</span>
            <span class="condo-browser-meta">
              <span class="condo-browser-score">${condominio.nota} / 5</span>
              <span class="condo-browser-reviews">${condominio.avaliacoes} avaliações</span>
            </span>
          </span>

          <span class="condo-browser-arrow" aria-hidden="true">
            ${buildArrowIcon()}
          </span>
        </button>
      `
    )
    .join("");
}

function activateSearchMode() {
  if (!heroVisual || !condoBrowser) return;

  searchModeActive = true;
  heroVisual.classList.add("is-search-mode");
  condoBrowser.setAttribute("aria-hidden", "false");
  renderCondoBrowser(searchInput?.value || "");
}

function deactivateSearchMode() {
  if (!heroVisual || !condoBrowser) return;

  searchModeActive = false;
  heroVisual.classList.remove("is-search-mode");
  condoBrowser.setAttribute("aria-hidden", "true");
  closeSuggestions();
}

function closeSuggestions() {
  if (!suggestionsBox) return;

  suggestionsBox.classList.remove("is-visible");
  suggestionsBox.innerHTML = "";
}

function renderSuggestions(query = "") {
  if (!suggestionsBox) return;

  const matches = getMatches(query);

  if (matches.length === 0) {
    suggestionsBox.innerHTML = `
      <div class="suggestion-item" role="option" aria-disabled="true">
        <span class="suggestion-pin">
          ${buildPinIcon()}
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
              ${buildPinIcon()}
            </span>
            <span class="suggestion-copy">
              <strong>${condominio.nome}</strong>
              <small>${condominio.endereco} · ${condominio.nota} / 5</small>
            </span>
          </button>
        `
      )
      .join("");
  }

  suggestionsBox.classList.add("is-visible");
}

function focusSearch() {
  if (!searchInput || !searchForm) return;

  searchForm.scrollIntoView({ behavior: "smooth", block: "center" });

  window.setTimeout(() => {
    searchInput.focus();
    activateSearchMode();
    renderSuggestions(searchInput.value);
  }, 260);
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

searchActionLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    dropdowns.forEach((dropdown) => {
      dropdown.classList.remove("is-open");
      dropdown
        .querySelector(".dropdown-toggle")
        ?.setAttribute("aria-expanded", "false");
    });

    focusSearch();
  });
});

if (searchInput) {
  searchInput.addEventListener("focus", () => {
    if (searchFeedback) searchFeedback.textContent = "";
    activateSearchMode();
    renderSuggestions(searchInput.value);
  });

  searchInput.addEventListener("click", () => {
    activateSearchMode();
    renderSuggestions(searchInput.value);
  });

  searchInput.addEventListener("input", (event) => {
    if (searchFeedback) searchFeedback.textContent = "";

    activateSearchMode();
    renderSuggestions(event.target.value);
    renderCondoBrowser(event.target.value);
  });
}

if (suggestionsBox) {
  suggestionsBox.addEventListener("click", (event) => {
    const selectedItem = event.target.closest("[data-condominio-url]");

    if (!selectedItem) return;

    window.location.href = selectedItem.dataset.condominioUrl;
  });
}

if (condoBrowserList) {
  condoBrowserList.addEventListener("click", (event) => {
    const selectedCard = event.target.closest("[data-condominio-url]");

    if (!selectedCard) return;

    window.location.href = selectedCard.dataset.condominioUrl;
  });
}

if (searchForm && searchInput) {
  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const query = searchInput.value.trim();

    activateSearchMode();

    if (!query) {
      if (searchFeedback) {
        searchFeedback.textContent =
          "Selecione um dos condomínios disponíveis ou digite um nome para pesquisar.";
      }

      renderSuggestions("");
      renderCondoBrowser("");
      searchInput.focus();
      return;
    }

    const matches = getMatches(query);

    if (matches.length === 1) {
      window.location.href = matches[0].url;
      return;
    }

    if (matches.length === 0 && searchFeedback) {
      searchFeedback.textContent =
        "Ainda não encontramos esse condomínio entre os perfis cadastrados.";
    }

    renderSuggestions(query);
    renderCondoBrowser(query);
  });
}

document.addEventListener("click", (event) => {
  if (!event.target.closest(".nav-dropdown")) {
    dropdowns.forEach((dropdown) => {
      dropdown.classList.remove("is-open");
      dropdown
        .querySelector(".dropdown-toggle")
        ?.setAttribute("aria-expanded", "false");
    });
  }

  if (!searchModeActive) return;

  const clickedSearch = searchForm?.contains(event.target);
  const clickedBrowser = heroVisual?.contains(event.target);
  const clickedSearchAction = event.target.closest("[data-search-action='true']");

  if (!clickedSearch && !clickedBrowser && !clickedSearchAction) {
    deactivateSearchMode();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && searchModeActive) {
    deactivateSearchMode();
    searchInput?.blur();
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 980 && mainNavigation && mobileMenuButton) {
    mainNavigation.classList.remove("is-open");
    mobileMenuButton.setAttribute("aria-expanded", "false");
    mobileMenuButton.setAttribute("aria-label", "Abrir menu");
  }
});

renderCondoBrowser();
