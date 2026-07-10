(() => {
  const supportsHover = window.matchMedia("(hover: hover) and (pointer: fine)");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (!supportsHover.matches || reduceMotion.matches) {
    return;
  }

  document.querySelectorAll(".portfolio-nav__inner, .topbar__inner").forEach((nav) => {
    nav.addEventListener("pointerenter", () => {
      if (document.body.classList.contains("best-nav-experiment") && !document.body.classList.contains("nav-condensed")) return;
      nav.style.transform = "translate3d(0, 0, 0) scale(1.02)";
    });

    nav.addEventListener("pointermove", (event) => {
      if (document.body.classList.contains("best-nav-experiment") && !document.body.classList.contains("nav-condensed")) return;
      const rect = nav.getBoundingClientRect();
      const x = (event.clientX - rect.left - rect.width / 2) * 0.05;
      const y = (event.clientY - rect.top - rect.height / 2) * 0.08;
      nav.style.transform = `translate3d(${x}px, ${y}px, 0) scale(1.02)`;
    });

    nav.addEventListener("pointerleave", () => {
      nav.style.transform = "translate3d(0, 0, 0) scale(1)";
    });
  });

  document.querySelectorAll(".portfolio-nav__link, .topbar__links a").forEach((link) => {
    link.addEventListener("pointermove", (event) => {
      const rect = link.getBoundingClientRect();
      const x = (event.clientX - rect.left - rect.width / 2) * 0.16;
      const y = (event.clientY - rect.top - rect.height / 2) * 0.2;
      link.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    });

    link.addEventListener("pointerleave", () => {
      link.style.transform = "translate3d(0, 0, 0)";
    });
  });
})();
