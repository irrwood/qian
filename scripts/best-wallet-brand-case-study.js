(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const initReveals = () => {
    const items = [...document.querySelectorAll(".reveal")];

    if (reduceMotion.matches || !("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -9%", threshold: 0.08 },
    );

    items.forEach((item) => observer.observe(item));
  };

  const initScrollEffects = () => {
    const media = document.querySelector(".hero-media");
    const visual = media?.querySelector("video, img");
    let ticking = false;

    const update = () => {
      if (media && visual && !reduceMotion.matches && window.innerWidth > 720) {
        const rect = media.getBoundingClientRect();
        const local = Math.max(-1, Math.min(1, -rect.top / Math.max(window.innerHeight, 1)));
        visual.style.setProperty("--media-y", `${local * 22}px`);
      }

      ticking = false;
    };

    const requestUpdate = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
  };

  const initChapters = () => {
    const chapters = document.querySelector("[data-chapters]");
    const toggle = chapters?.querySelector(".chapters__toggle");
    const panel = chapters?.querySelector(".chapters__panel");
    const links = [...(chapters?.querySelectorAll(".chapters__panel a") || [])];

    if (!chapters || !toggle) return;

    const setOpen = (open) => {
      chapters.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      panel?.setAttribute("aria-hidden", String(!open));
      if (panel) panel.inert = !open;
    };

    setOpen(false);

    toggle.addEventListener("click", () => setOpen(!chapters.classList.contains("is-open")));
    links.forEach((link) => link.addEventListener("click", () => setOpen(false)));

    document.addEventListener("click", (event) => {
      if (!chapters.contains(event.target)) setOpen(false);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setOpen(false);
    });

    if (!("IntersectionObserver" in window)) return;

    const targets = links
      .map((link) => document.querySelector(link.hash))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        const current = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!current) return;

        links.forEach((link) => {
          const active = link.hash === `#${current.target.id}`;
          link.classList.toggle("is-active", active);
          if (active) link.setAttribute("aria-current", "true");
          else link.removeAttribute("aria-current");
        });
      },
      { rootMargin: "-15% 0px -60%", threshold: [0.05, 0.3] },
    );

    targets.forEach((target) => observer.observe(target));
  };

  initReveals();
  initScrollEffects();
  initChapters();
})();
