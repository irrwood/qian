(() => {
  const page = document.body;
  const expandedNav = document.querySelector(".portfolio-nav:not(.best-nav-capsule)");

  if (!expandedNav) {
    return;
  }

  page.classList.add("best-nav-experiment");
  expandedNav.classList.add("best-nav-expanded");
  const brand = expandedNav.querySelector(".portfolio-nav__brand");
  if (brand) brand.textContent = "Qian";

  if (!document.querySelector(".best-nav-capsule")) {
    const capsule = expandedNav.cloneNode(true);
    capsule.classList.remove("best-nav-expanded");
    capsule.classList.add("best-nav-capsule");
    capsule.querySelector(".portfolio-nav__blur")?.remove();
    capsule.querySelector(".portfolio-nav__brand")?.remove();
    capsule.querySelector(".portfolio-nav__links")?.setAttribute("aria-label", "Condensed navigation");
    expandedNav.insertAdjacentElement("afterend", capsule);
  }

  const updateNav = () => {
    page.classList.toggle("nav-condensed", window.scrollY > 72);
  };

  updateNav();
  window.addEventListener("scroll", updateNav, { passive: true });
})();
