const condoToast = document.querySelector("#toast");
const saveCondoButton = document.querySelector("#saveCondoButton");
const reviewFilters = document.querySelectorAll(".review-filter");
const reviewCards = document.querySelectorAll(".review-card");
const helpfulButtons = document.querySelectorAll(".helpful-button");
const loadMoreReviews = document.querySelector("#loadMoreReviews");
const startReviewButton = document.querySelector("#startReviewButton");
const claimProfileButton = document.querySelector("#claimProfileButton");
const profileTabs = document.querySelectorAll(".profile-tab");
const galleryModal = document.querySelector("#galleryModal");
const galleryModalImage = document.querySelector("#galleryModalImage");
const galleryModalClose = document.querySelector("#galleryModalClose");
const galleryPrev = document.querySelector("#galleryPrev");
const galleryNext = document.querySelector("#galleryNext");
const galleryTriggers = document.querySelectorAll("[data-gallery-index]");
const openGalleryButton = document.querySelector("#openGalleryButton");

const galleryImages = [
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1600&q=90",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=90",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=90"
];

let currentGalleryIndex = 0;
let condoToastTimer;

function showCondoToast(message) {
  if (!condoToast) return;

  clearTimeout(condoToastTimer);
  condoToast.textContent = message;
  condoToast.classList.add("is-visible");

  condoToastTimer = window.setTimeout(() => {
    condoToast.classList.remove("is-visible");
  }, 3200);
}

if (saveCondoButton) {
  saveCondoButton.addEventListener("click", () => {
    const isSaved = saveCondoButton.classList.toggle("is-saved");
    saveCondoButton.setAttribute("aria-pressed", String(isSaved));

    const label = saveCondoButton.querySelector("span");
    if (label) {
      label.textContent = isSaved ? "Condomínio salvo" : "Salvar condomínio";
    }

    showCondoToast(
      isSaved
        ? "Residencial Parque das Flores salvo na sua lista."
        : "Residencial Parque das Flores removido da sua lista."
    );
  });
}

reviewFilters.forEach((filterButton) => {
  filterButton.addEventListener("click", () => {
    const selectedFilter = filterButton.dataset.reviewFilter;

    reviewFilters.forEach((button) => button.classList.remove("is-active"));
    filterButton.classList.add("is-active");

    reviewCards.forEach((card) => {
      const matchesFilter =
        selectedFilter === "all" || card.dataset.reviewRating === selectedFilter;

      card.hidden = !matchesFilter;
    });
  });
});

helpfulButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const isMarked = button.classList.toggle("is-marked");
    const countElement = button.querySelector("span");
    const initialCount = Number(button.dataset.helpfulCount || 0);

    if (countElement) {
      countElement.textContent = String(isMarked ? initialCount + 1 : initialCount);
    }

    showCondoToast(
      isMarked
        ? "Obrigado. Sua marcação de utilidade foi registrada neste protótipo."
        : "Sua marcação de utilidade foi removida."
    );
  });
});

if (loadMoreReviews) {
  loadMoreReviews.addEventListener("click", () => {
    showCondoToast(
      "Neste protótipo exibimos três avaliações. As demais serão carregadas do banco de dados futuramente."
    );
  });
}

if (startReviewButton) {
  startReviewButton.addEventListener("click", () => {
    showCondoToast(
      "O próximo passo será conectar login e formulário de avaliação dos moradores."
    );
  });
}

if (claimProfileButton) {
  claimProfileButton.addEventListener("click", () => {
    showCondoToast(
      "A solicitação de gestão do perfil será conectada à área institucional em uma próxima etapa."
    );
  });
}

profileTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    profileTabs.forEach((item) => item.classList.remove("is-active"));
    tab.classList.add("is-active");
  });
});

const observedSections = [...profileTabs]
  .map((tab) => document.querySelector(tab.getAttribute("href")))
  .filter(Boolean);

if (observedSections.length > 0 && "IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visibleEntry = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visibleEntry) return;

      profileTabs.forEach((tab) => {
        const isCurrent = tab.getAttribute("href") === `#${visibleEntry.target.id}`;
        tab.classList.toggle("is-active", isCurrent);
      });
    },
    {
      rootMargin: "-25% 0px -60% 0px",
      threshold: [0.05, 0.2, 0.4]
    }
  );

  observedSections.forEach((section) => sectionObserver.observe(section));
}

function openGallery(index) {
  if (!galleryModal || !galleryModalImage) return;

  currentGalleryIndex = index;
  galleryModalImage.src = galleryImages[currentGalleryIndex];
  galleryModal.classList.add("is-open");
  galleryModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeGallery() {
  if (!galleryModal) return;

  galleryModal.classList.remove("is-open");
  galleryModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function changeGalleryImage(direction) {
  currentGalleryIndex =
    (currentGalleryIndex + direction + galleryImages.length) % galleryImages.length;

  if (galleryModalImage) {
    galleryModalImage.src = galleryImages[currentGalleryIndex];
  }
}

galleryTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    openGallery(Number(trigger.dataset.galleryIndex || 0));
  });
});

if (openGalleryButton) {
  openGalleryButton.addEventListener("click", () => openGallery(0));
}

if (galleryModalClose) {
  galleryModalClose.addEventListener("click", closeGallery);
}

if (galleryPrev) {
  galleryPrev.addEventListener("click", () => changeGalleryImage(-1));
}

if (galleryNext) {
  galleryNext.addEventListener("click", () => changeGalleryImage(1));
}

if (galleryModal) {
  galleryModal.addEventListener("click", (event) => {
    if (event.target === galleryModal) {
      closeGallery();
    }
  });
}

document.addEventListener("keydown", (event) => {
  if (!galleryModal?.classList.contains("is-open")) return;

  if (event.key === "Escape") closeGallery();
  if (event.key === "ArrowLeft") changeGalleryImage(-1);
  if (event.key === "ArrowRight") changeGalleryImage(1);
});
