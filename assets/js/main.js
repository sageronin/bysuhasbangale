(function () {
  const items = window.PORTFOLIO_ITEMS || [];
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let revealObserver;

  document.addEventListener("DOMContentLoaded", function () {
    markReady();
    setCurrentYear();
    initNavigation();
    initHeaderState();
    initRevealAnimations();
    renderFeaturedWorks();
    renderPortfolioExperience();
    initParallax();
    initCursor();
    initPageTransitions();
    initContactForm();
  });

  function markReady() {
    requestAnimationFrame(function () {
      document.body.classList.remove("preloading");
      document.body.classList.add("is-ready");
    });
  }

  function setCurrentYear() {
    document.querySelectorAll(".current-year").forEach(function (node) {
      node.textContent = String(new Date().getFullYear());
    });
  }

  function initNavigation() {
    const toggle = document.querySelector(".nav-toggle");
    const nav = document.querySelector(".site-nav");
    const body = document.body;

    highlightActiveLink();

    if (!toggle || !nav) {
      return;
    }

    toggle.addEventListener("click", function () {
      const isOpen = body.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        body.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  function highlightActiveLink() {
    const currentPage = document.body.dataset.page;
    const links = document.querySelectorAll(".site-nav a");

    links.forEach(function (link) {
      const href = link.getAttribute("href") || "";
      const targetPage = href.replace(".html", "").replace("index", "home");
      if (targetPage === currentPage) {
        link.classList.add("is-active");
      }
    });
  }

  function initHeaderState() {
    const header = document.getElementById("site-header");
    if (!header) {
      return;
    }

    const updateHeader = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 24);
    };

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
  }

  function initRevealAnimations() {
    if (prefersReducedMotion.matches || !("IntersectionObserver" in window)) {
      document.querySelectorAll(".reveal").forEach(function (element) {
        element.classList.add("is-visible");
      });
      return;
    }

    revealObserver = new IntersectionObserver(
      function (entries, currentObserver) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            currentObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.18,
        rootMargin: "0px 0px -8% 0px"
      }
    );

    observeRevealElements(document);
  }

  function observeRevealElements(scope) {
    const root = scope || document;
    root.querySelectorAll(".reveal").forEach(function (element) {
      if (element.dataset.revealBound === "true") {
        return;
      }

      element.dataset.revealBound = "true";

      if (prefersReducedMotion.matches || !revealObserver) {
        element.classList.add("is-visible");
      } else {
        revealObserver.observe(element);
      }
    });
  }

  function initParallax() {
    const layers = Array.from(document.querySelectorAll("[data-parallax]"));
    if (!layers.length || prefersReducedMotion.matches) {
      return;
    }

    const updateParallax = function () {
      const viewportHeight = window.innerHeight;
      layers.forEach(function (layer) {
        const speed = Number(layer.dataset.parallax) || 0.12;
        const rect = layer.getBoundingClientRect();
        const distanceFromCenter = rect.top + rect.height / 2 - viewportHeight / 2;
        layer.style.setProperty("--parallax-shift", `${distanceFromCenter * speed * -1}px`);
      });
      requestAnimationFrame(updateParallax);
    };

    requestAnimationFrame(updateParallax);
  }

  function initCursor() {
    const dot = document.querySelector(".cursor--dot");
    const ring = document.querySelector(".cursor--ring");
    const finePointer = window.matchMedia("(pointer: fine)").matches;

    if (!dot || !ring || !finePointer || prefersReducedMotion.matches) {
      return;
    }

    document.body.classList.add("has-custom-cursor");

    const state = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      ringX: window.innerWidth / 2,
      ringY: window.innerHeight / 2
    };

    const renderCursor = function () {
      state.ringX += (state.x - state.ringX) * 0.18;
      state.ringY += (state.y - state.ringY) * 0.18;
      dot.style.transform = `translate3d(${state.x}px, ${state.y}px, 0)`;
      ring.style.transform = `translate3d(${state.ringX}px, ${state.ringY}px, 0)`;
      requestAnimationFrame(renderCursor);
    };

    window.addEventListener(
      "mousemove",
      function (event) {
        state.x = event.clientX;
        state.y = event.clientY;
      },
      { passive: true }
    );

    document.addEventListener("mouseover", function (event) {
      if (event.target.closest("a, button, .work-card__action")) {
        ring.classList.add("is-active");
      }
    });

    document.addEventListener("mouseout", function (event) {
      if (event.target.closest("a, button, .work-card__action")) {
        ring.classList.remove("is-active");
      }
    });

    requestAnimationFrame(renderCursor);
  }

  function initPageTransitions() {
    document.addEventListener("click", function (event) {
      const link = event.target.closest("a[href]");
      if (!link) {
        return;
      }

      const href = link.getAttribute("href") || "";
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
        return;
      }

      if (
        event.defaultPrevented ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        link.target === "_blank" ||
        link.hasAttribute("download")
      ) {
        return;
      }

      if (window.location.protocol === "file:" && /^(https?:)?\/\//.test(href)) {
        return;
      }

      const nextUrl = new URL(link.href, window.location.href);
      const currentUrl = new URL(window.location.href);
      const sameDocument =
        nextUrl.pathname === currentUrl.pathname &&
        nextUrl.search === currentUrl.search &&
        nextUrl.hash &&
        nextUrl.hash !== "#";

      if (sameDocument) {
        return;
      }

      if (window.location.protocol !== "file:" && nextUrl.origin !== currentUrl.origin) {
        return;
      }

      event.preventDefault();
      document.body.classList.add("is-leaving");

      window.setTimeout(function () {
        window.location.href = nextUrl.href;
      }, 320);
    });
  }

  function renderFeaturedWorks() {
    const container = document.getElementById("featured-grid");
    if (!container || !items.length) {
      return;
    }

    const featuredItems = items.slice(0, 4);
    container.innerHTML = featuredItems
      .map(function (item) {
        return createCardMarkup(item, {
          context: "featured",
          actionTag: "a",
          actionAttributes: `href="portfolio.html?work=${encodeURIComponent(item.id)}"`,
          loading: "eager"
        });
      })
      .join("");

    observeRevealElements(container);
  }

  function renderPortfolioExperience() {
    const grid = document.getElementById("portfolio-grid");
    const filters = document.getElementById("category-filters");
    const lightbox = document.getElementById("lightbox");

    if (!grid || !filters || !lightbox || !items.length) {
      return;
    }

    const categories = ["All"].concat(
      Array.from(
        new Set(
          items.flatMap(function (item) {
            return item.categories;
          })
        )
      )
    );

    let activeCategory = "All";
    let visibleItems = items.slice();
    let activeIndex = -1;

    filters.innerHTML = categories
      .map(function (category) {
        return `
          <button class="filter-chip${category === "All" ? " is-active" : ""}" type="button" data-filter="${category}">
            ${category}
          </button>
        `;
      })
      .join("");

    const renderGrid = function () {
      visibleItems =
        activeCategory === "All"
          ? items.slice()
          : items.filter(function (item) {
              return item.categories.includes(activeCategory);
            });

      grid.innerHTML = visibleItems
        .map(function (item) {
          return createCardMarkup(item, {
            context: "portfolio",
            actionTag: "button",
            actionAttributes: `type="button" data-work-id="${item.id}" aria-label="Open ${item.title} preview"`,
            loading: "lazy"
          });
        })
        .join("");

      observeRevealElements(grid);
    };

    const updateFilters = function () {
      filters.querySelectorAll(".filter-chip").forEach(function (chip) {
        chip.classList.toggle("is-active", chip.dataset.filter === activeCategory);
      });
    };

    const openLightbox = function (workId) {
      activeIndex = visibleItems.findIndex(function (item) {
        return item.id === workId;
      });

      if (activeIndex < 0) {
        return;
      }

      const activeItem = visibleItems[activeIndex];
      document.getElementById("lightbox-image").src = activeItem.image;
      document.getElementById("lightbox-image").alt = activeItem.alt;
      document.getElementById("lightbox-title").textContent = activeItem.title;
      document.getElementById("lightbox-meta").textContent = `${activeItem.location} / ${activeItem.categories.join(" / ")}`;
      document.getElementById("lightbox-description").textContent = activeItem.description;

      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.classList.add("lightbox-open");
      document.getElementById("lightbox-close").focus();
    };

    const closeLightbox = function () {
      lightbox.classList.remove("is-open");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.classList.remove("lightbox-open");
    };

    const moveLightbox = function (direction) {
      if (!visibleItems.length) {
        return;
      }

      activeIndex = (activeIndex + direction + visibleItems.length) % visibleItems.length;
      openLightbox(visibleItems[activeIndex].id);
    };

    filters.addEventListener("click", function (event) {
      const chip = event.target.closest(".filter-chip");
      if (!chip) {
        return;
      }

      activeCategory = chip.dataset.filter || "All";
      updateFilters();
      renderGrid();
    });

    grid.addEventListener("click", function (event) {
      const trigger = event.target.closest("[data-work-id]");
      if (!trigger) {
        return;
      }

      openLightbox(trigger.dataset.workId);
    });

    document.getElementById("lightbox-close").addEventListener("click", closeLightbox);
    document.querySelector(".lightbox__backdrop").addEventListener("click", closeLightbox);
    document.getElementById("lightbox-prev").addEventListener("click", function () {
      moveLightbox(-1);
    });
    document.getElementById("lightbox-next").addEventListener("click", function () {
      moveLightbox(1);
    });

    document.addEventListener("keydown", function (event) {
      if (!lightbox.classList.contains("is-open")) {
        return;
      }

      if (event.key === "Escape") {
        closeLightbox();
      }

      if (event.key === "ArrowLeft") {
        moveLightbox(-1);
      }

      if (event.key === "ArrowRight") {
        moveLightbox(1);
      }
    });

    renderGrid();

    const queryWorkId = new URLSearchParams(window.location.search).get("work");
    if (queryWorkId) {
      openLightbox(queryWorkId);
    }
  }

  function initContactForm() {
    const form = document.getElementById("contact-form");
    const status = document.getElementById("form-status");

    if (!form || !status) {
      return;
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!form.reportValidity()) {
        return;
      }

      const formData = new FormData(form);
      const name = String(formData.get("name") || "").trim();
      const email = String(formData.get("email") || "").trim();
      const message = String(formData.get("message") || "").trim();
      const recipient = form.dataset.recipient || "hello@bysuhasbangale.com";

      const mailtoParams = new URLSearchParams({
        subject: `Project enquiry from ${name}`,
        body: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
      });

      window.location.href = `mailto:${recipient}?${mailtoParams.toString()}`;
      status.textContent = "Your email draft is ready. Update the destination address if you want to route messages elsewhere.";
      form.reset();
    });
  }

  function createCardMarkup(item, options) {
    const actionTag = options.actionTag || "button";
    const actionAttributes = options.actionAttributes || "";
    const loading = options.loading || "lazy";
    const featuredClass = options.context === "featured" ? " work-card--featured-context" : "";

    return `
      <article class="work-card work-card--${item.size}${featuredClass} reveal">
        <${actionTag} class="work-card__action" ${actionAttributes}>
          <div class="work-card__media">
            <img src="${item.image}" alt="${item.alt}" loading="${loading}" decoding="async" />
          </div>
          <div class="work-card__overlay"></div>
          <div class="work-card__content">
            <p class="work-card__eyebrow">${item.categories.join(" / ")}</p>
            <h3>${item.title}</h3>
            <p class="work-card__detail">${item.location}</p>
          </div>
        </${actionTag}>
      </article>
    `;
  }
})();

