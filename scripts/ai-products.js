(() => {
  const heroItems = Array.from(document.querySelectorAll(".article-hero > *"));
  const sections = Array.from(document.querySelectorAll("[data-article-section]"));
  const sectionLinks = Array.from(document.querySelectorAll("[data-section-link]"));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const underlineTarget = document.querySelector("[data-hand-underline]");

  if (underlineTarget && window.RoughNotation?.annotate) {
    const underline = window.RoughNotation.annotate(underlineTarget, {
      type: "underline",
      color: window.getComputedStyle(underlineTarget).color,
      strokeWidth: 1.5,
      padding: [0, 1, 3, 1],
      iterations: 2,
      multiline: true,
      animate: !reduceMotion.matches,
      animationDuration: 720,
    });

    if (reduceMotion.matches || !("IntersectionObserver" in window)) {
      underline.show();
    } else {
      let hasDrawn = false;

      const underlineObserver = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;

          if (hasDrawn && underline.isShowing()) {
            underline.hide();
            window.requestAnimationFrame(() => underline.show());
          } else {
            underline.show();
          }

          hasDrawn = true;
        },
        { rootMargin: "-14% 0px -18%", threshold: 0.55 },
      );

      underlineObserver.observe(underlineTarget);
    }
  }

  if (!reduceMotion.matches) {
    heroItems.forEach((item, index) => {
      item.animate(
        [
          { opacity: 0, transform: "translate3d(0, 7px, 0)" },
          { opacity: 1, transform: "translate3d(0, 0, 0)" },
        ],
        {
          duration: 520,
          delay: 50 + index * 55,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          fill: "backwards",
        },
      );
    });

  }

  const setActiveSection = (sectionId) => {
    sectionLinks.forEach((link) => {
      const active = link.dataset.sectionLink === sectionId;
      link.classList.toggle("is-active", active);

      if (active) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  if (sections.length && sectionLinks.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visibleSections = entries
          .filter((entry) => entry.isIntersecting)
          .sort((first, second) => second.intersectionRatio - first.intersectionRatio);

        if (visibleSections[0]) {
          setActiveSection(visibleSections[0].target.id);
        }
      },
      { rootMargin: "-18% 0px -58%", threshold: [0.08, 0.2, 0.4] },
    );

    sections.forEach((section) => sectionObserver.observe(section));
  }

  const catfillSection = document.getElementById("catfill");
  const catfillPlayground = document.querySelector("[data-catfill-playground]");

  if (catfillSection && catfillPlayground) {
    const wideViewport = window.matchMedia("(min-width: 1120px)");
    const catfillStickers = Array.from(catfillPlayground.querySelectorAll("[data-catfill-sticker]"));
    let catfillIsVisible = false;

    const updatePlaygroundVisibility = () => {
      const visible = catfillIsVisible && wideViewport.matches;
      catfillPlayground.classList.toggle("is-visible", visible);
      catfillPlayground.setAttribute("aria-hidden", visible ? "false" : "true");
      catfillPlayground.inert = !visible;
    };

    const catfillObserver = new IntersectionObserver(
      ([entry]) => {
        catfillIsVisible = entry.isIntersecting;
        updatePlaygroundVisibility();
      },
      { rootMargin: "-12% 0px -12%", threshold: 0 },
    );

    catfillObserver.observe(catfillSection);
    wideViewport.addEventListener("change", updatePlaygroundVisibility);
    updatePlaygroundVisibility();

    catfillStickers.forEach((sticker) => {
      sticker.addEventListener("click", () => {
        if (reduceMotion.matches) return;

        const artwork = sticker.querySelector("img");
        const direction = Number(sticker.dataset.stickerDirection) || 1;
        const restingTransform = window.getComputedStyle(artwork).transform;

        artwork.getAnimations().forEach((animation) => animation.cancel());
        artwork.animate(
          [
            { transform: restingTransform },
            { transform: `translate3d(0, -14px, 0) rotate(${direction * 4}deg)`, offset: 0.38 },
            { transform: `translate3d(0, 2px, 0) rotate(${direction * -2}deg)`, offset: 0.72 },
            { transform: restingTransform },
          ],
          { duration: 440, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
        );
      });
    });
  }

  const carousels = Array.from(document.querySelectorAll("[data-article-carousel]"));

  carousels.forEach((carousel) => {
    const viewport = carousel.querySelector(".article-carousel__viewport");
    const track = carousel.querySelector("[data-carousel-track]");
    const slides = Array.from(carousel.querySelectorAll("[data-carousel-slide]"));
    const dots = Array.from(carousel.querySelectorAll("[data-carousel-dot]"));
    const count = carousel.querySelector("[data-carousel-count]");
    const previousButton = carousel.querySelector("[data-carousel-previous]");
    const nextButton = carousel.querySelector("[data-carousel-next]");
    let currentIndex = 0;
    let touchStartX = null;

    const showSlide = (nextIndex) => {
      currentIndex = (nextIndex + slides.length) % slides.length;
      track.style.transform = `translate3d(${-currentIndex * 100}%, 0, 0)`;

      slides.forEach((slide, index) => {
        const active = index === currentIndex;
        slide.classList.toggle("is-active", active);
        slide.setAttribute("aria-hidden", active ? "false" : "true");
        slide.inert = !active;
      });

      dots.forEach((dot, index) => {
        const active = index === currentIndex;
        dot.classList.toggle("is-active", active);
        dot.setAttribute("aria-selected", active ? "true" : "false");
        dot.tabIndex = active ? 0 : -1;
      });

      count.textContent = `${String(currentIndex + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
    };

    previousButton.addEventListener("click", () => showSlide(currentIndex - 1));
    nextButton.addEventListener("click", () => showSlide(currentIndex + 1));
    dots.forEach((dot, index) => dot.addEventListener("click", () => showSlide(index)));

    carousel.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

      event.preventDefault();
      const wasImageTrigger = event.target.matches("[data-lightbox-trigger]");
      const wasDot = event.target.matches("[data-carousel-dot]");
      showSlide(currentIndex + (event.key === "ArrowRight" ? 1 : -1));

      if (wasImageTrigger) {
        slides[currentIndex].querySelector("[data-lightbox-trigger]")?.focus({ preventScroll: true });
      }

      if (wasDot) {
        dots[currentIndex].focus({ preventScroll: true });
      }
    });

    viewport.addEventListener(
      "touchstart",
      (event) => {
        touchStartX = event.changedTouches[0]?.clientX ?? null;
      },
      { passive: true },
    );

    viewport.addEventListener(
      "touchend",
      (event) => {
        if (touchStartX === null) return;
        const endX = event.changedTouches[0]?.clientX ?? touchStartX;
        const distance = endX - touchStartX;
        touchStartX = null;

        if (Math.abs(distance) > 44) {
          showSlide(currentIndex + (distance < 0 ? 1 : -1));
        }
      },
      { passive: true },
    );

    showSlide(0);
  });

  const lightbox = document.querySelector(".article-lightbox");
  const lightboxTriggers = Array.from(document.querySelectorAll("[data-lightbox-trigger]"));

  if (lightbox && lightboxTriggers.length) {
    const lightboxImage = lightbox.querySelector("[data-lightbox-image]");
    const lightboxCaption = lightbox.querySelector("[data-lightbox-caption]");
    const lightboxCount = lightbox.querySelector("[data-lightbox-count]");
    const closeButton = lightbox.querySelector("[data-lightbox-close]");
    const previousButton = lightbox.querySelector("[data-lightbox-previous]");
    const nextButton = lightbox.querySelector("[data-lightbox-next]");
    const allItems = lightboxTriggers.map((trigger) => {
      const figure = trigger.closest("figure");
      const image = trigger.querySelector("img");

      return {
        trigger,
        group: trigger.dataset.lightboxGroup || "article",
        src: image.currentSrc || image.src,
        alt: image.alt,
        caption: figure?.querySelector("figcaption")?.textContent.trim() || image.alt,
      };
    });
    let items = allItems;
    let currentIndex = 0;
    let returnFocus = null;
    let closeTimer = null;

    const updateLightbox = (nextIndex, animate = true) => {
      currentIndex = (nextIndex + items.length) % items.length;
      const item = items[currentIndex];

      lightboxImage.src = item.src;
      lightboxImage.alt = item.alt;
      lightboxCaption.textContent = item.caption;
      lightboxCount.textContent = `${currentIndex + 1} / ${items.length}`;

      if (animate && !reduceMotion.matches) {
        lightboxImage.animate(
          [
            { opacity: 0, transform: "scale(0.985)" },
            { opacity: 1, transform: "scale(1)" },
          ],
          { duration: 180, easing: "ease-out" },
        );
      }
    };

    const finishClose = () => {
      window.clearTimeout(closeTimer);
      closeTimer = null;
      lightbox.classList.remove("is-closing");
      document.body.classList.remove("has-open-lightbox");

      if (lightbox.open) {
        lightbox.close();
      }
    };

    const closeLightbox = () => {
      if (!lightbox.open || lightbox.classList.contains("is-closing")) return;

      if (reduceMotion.matches) {
        finishClose();
        return;
      }

      lightbox.classList.add("is-closing");
      closeTimer = window.setTimeout(finishClose, 180);
    };

    const openLightbox = (selectedItem) => {
      window.clearTimeout(closeTimer);
      lightbox.classList.remove("is-closing");
      items = allItems.filter((item) => item.group === selectedItem.group);
      returnFocus = selectedItem.trigger;
      updateLightbox(items.indexOf(selectedItem), false);

      if (typeof lightbox.showModal === "function") {
        lightbox.showModal();
        document.body.classList.add("has-open-lightbox");
        closeButton.focus({ preventScroll: true });
      } else {
        window.open(selectedItem.src, "_blank", "noopener");
      }
    };

    allItems.forEach((item) => {
      item.trigger.addEventListener("click", () => openLightbox(item));
    });

    closeButton.addEventListener("click", closeLightbox);
    previousButton.addEventListener("click", () => updateLightbox(currentIndex - 1));
    nextButton.addEventListener("click", () => updateLightbox(currentIndex + 1));

    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) closeLightbox();
    });

    lightbox.addEventListener("cancel", (event) => {
      event.preventDefault();
      closeLightbox();
    });

    lightbox.addEventListener("close", () => {
      lightboxImage.removeAttribute("src");
      if (returnFocus?.isConnected) returnFocus.focus({ preventScroll: true });
    });

    document.addEventListener("keydown", (event) => {
      if (!lightbox.open || lightbox.classList.contains("is-closing")) return;

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        updateLightbox(currentIndex - 1);
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        updateLightbox(currentIndex + 1);
      }
    });
  }
})();
