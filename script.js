const mobileMenuButton = document.querySelector("#mobileMenuButton");
const mainNavigation = document.querySelector("#mainNavigation");
const dropdowns = document.querySelectorAll(".nav-dropdown");
const searchForm = document.querySelector("#searchForm");
const searchInput = document.querySelector("#condoSearch");
const sharedToast = document.querySelector("#toast");
const heroVisual = document.querySelector("#heroVisual");
const condoBrowser = document.querySelector("#condoBrowser");
const condoBrowserList = document.querySelector("#condoBrowserList");
const searchActionLinks = document.querySelectorAll("[data-search-action='true']");
const heroCarouselImage = document.querySelector("#heroCarouselImage");
const heroCondoCard = document.querySelector("#heroCondoCard");
const heroCondoScore = document.querySelector("#heroCondoScore");
const heroCondoStars = document.querySelector("#heroCondoStars");
const heroCondoName = document.querySelector("#heroCondoName");
const heroCondoReviews = document.querySelector("#heroCondoReviews");
const heroCondoMeta = document.querySelector("#heroCondoMeta");
const carouselPrev = document.querySelector("#carouselPrev");
const carouselNext = document.querySelector("#carouselNext");
const carouselDots = document.querySelector("#carouselDots");

const condominios = [
  {
    nome: "Residencial Parque das Flores",
    endereco: "São Paulo - SP",
    nota: "4,7",
    avaliacoes: 184,
    url: "condominio.html",
    imagem:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=85",
    estrelas: "★★★★★",
    destaques: ["Segurança bem avaliada", "Boa administração"]
  },
  {
    nome: "Residencial Vista do Lago",
    endereco: "Campinas - SP",
    nota: "4,5",
    avaliacoes: 127,
    url: "condominio-vista-do-lago.html",
    imagem:
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=85",
    estrelas: "★★★★★",
    destaques: ["Boa área de lazer", "Localização tranquila"]
  },
  {
    nome: "Condomínio Jardins do Bosque",
    endereco: "Sorocaba - SP",
    nota: "4,3",
    avaliacoes: 96,
    url: "condominio-jardins-do-bosque.html",
    imagem:
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=85",
    estrelas: "★★★★☆",
    destaques: ["Áreas verdes", "Bom custo-benefício"]
  }
];

let sharedToastTimer;
let searchModeActive = false;
let currentCarouselIndex = 0;
let carouselTimer;
let carouselTransitionTimer;
const carouselInterval = 5500;

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

function renderCarouselDots() {
  if (!carouselDots) return;

  carouselDots.innerHTML = condominios
    .map((condominio, index) => {
      const activeClass = index === currentCarouselIndex ? " is-active" : "";
      const pressed = index === currentCarouselIndex ? "true" : "false";

      return `
        <button
          class="carousel-dot${activeClass}"
          type="button"
          data-carousel-index="${index}"
          aria-label="Exibir ${condominio.nome}"
          aria-pressed="${pressed}"
        ></button>
      `;
    })
    .join("");
}

function updateCarouselContent(index, animate = true) {
  if (!heroVisual || !heroCarouselImage || !heroCondoCard) return;

  currentCarouselIndex =
    (index + condominios.length) % condominios.length;

  const condominio = condominios[currentCarouselIndex];

  const applyContent = () => {
    heroCarouselImage.src = condominio.imagem;
    heroCarouselImage.alt = `Área externa de ${condominio.nome}`;

    heroCondoCard.href = condominio.url;
    heroCondoCard.setAttribute(
      "aria-label",
      `Abrir perfil de ${condominio.nome}`
    );

    if (heroCondoScore) heroCondoScore.textContent = condominio.nota;

    if (heroCondoStars) {
      heroCondoStars.textContent = condominio.estrelas;
      heroCondoStars.setAttribute(
        "aria-label",
        `Avaliação de ${condominio.nota} de 5`
      );
    }

    if (heroCondoName) heroCondoName.textContent = condominio.nome;

    if (heroCondoReviews) {
      heroCondoReviews.textContent =
        `Nota baseada em ${condominio.avaliacoes} avaliações de moradores.`;
    }

    if (heroCondoMeta) {
      heroCondoMeta.innerHTML = condominio.destaques
        .map((destaque) => `<span>${destaque}</span>`)
        .join("");
    }

    renderCarouselDots();

    window.requestAnimationFrame(() => {
      heroVisual.classList.remove("is-carousel-changing");
    });
  };

  clearTimeout(carouselTransitionTimer);

  if (!animate) {
    applyContent();
    return;
  }

  heroVisual.classList.add("is-carousel-changing");
  carouselTransitionTimer = window.setTimeout(applyContent, 180);
}

function stopCarousel() {
  clearInterval(carouselTimer);
  carouselTimer = undefined;
}

function startCarousel() {
  if (!heroVisual || searchModeActive || condominios.length < 2) return;

  stopCarousel();

  carouselTimer = window.setInterval(() => {
    updateCarouselContent(currentCarouselIndex + 1);
  }, carouselInterval);
}

function goToCarousel(index) {
  updateCarouselContent(index);
  startCarousel();
}

function activateSearchMode() {
  if (!heroVisual || !condoBrowser) return;

  searchModeActive = true;
  stopCarousel();
  heroVisual.classList.add("is-search-mode");
  condoBrowser.setAttribute("aria-hidden", "false");
  renderCondoBrowser(searchInput?.value || "");
}

function deactivateSearchMode() {
  if (!heroVisual || !condoBrowser) return;

  searchModeActive = false;
  heroVisual.classList.remove("is-search-mode");
  condoBrowser.setAttribute("aria-hidden", "true");
  startCarousel();
}

function focusSearch() {
  if (!searchInput || !searchForm) return;

  searchForm.scrollIntoView({ behavior: "smooth", block: "center" });

  window.setTimeout(() => {
    searchInput.focus();
    activateSearchMode();
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
    activateSearchMode();
  });

  searchInput.addEventListener("click", () => {
    activateSearchMode();
  });

  searchInput.addEventListener("input", (event) => {
    activateSearchMode();
    renderCondoBrowser(event.target.value);
  });
}

if (condoBrowserList) {
  condoBrowserList.addEventListener("click", (event) => {
    const selectedCard = event.target.closest("[data-condominio-url]");

    if (!selectedCard) return;

    window.location.href = selectedCard.dataset.condominioUrl;
  });
}

carouselPrev?.addEventListener("click", (event) => {
  event.preventDefault();
  goToCarousel(currentCarouselIndex - 1);
});

carouselNext?.addEventListener("click", (event) => {
  event.preventDefault();
  goToCarousel(currentCarouselIndex + 1);
});

carouselDots?.addEventListener("click", (event) => {
  const dot = event.target.closest("[data-carousel-index]");

  if (!dot) return;

  goToCarousel(Number(dot.dataset.carouselIndex));
});

if (heroVisual) {
  heroVisual.addEventListener("mouseenter", stopCarousel);
  heroVisual.addEventListener("mouseleave", startCarousel);
  heroVisual.addEventListener("focusin", stopCarousel);
  heroVisual.addEventListener("focusout", (event) => {
    if (!heroVisual.contains(event.relatedTarget)) {
      startCarousel();
    }
  });
}

if (searchForm && searchInput) {
  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const query = searchInput.value.trim();

    activateSearchMode();

    if (!query) {
      renderCondoBrowser("");
      searchInput.focus();
      return;
    }

    const matches = getMatches(query);

    if (matches.length === 1) {
      window.location.href = matches[0].url;
      return;
    }

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
renderCarouselDots();
updateCarouselContent(0, false);
startCarousel();
