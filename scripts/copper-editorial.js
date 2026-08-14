(() => {
  const initComparison = () => {
    document.querySelectorAll("[data-compare]").forEach((compare) => {
      const range = compare.querySelector(".platform-compare__range");
      if (!range) return;

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      let targetValue = Number(range.value);
      let currentValue = targetValue;
      let frame = null;

      const render = (value) => {
        compare.style.setProperty("--compare-position", `${value}%`);
        compare.style.setProperty("--compare-position-number", value);
        range.setAttribute("aria-valuetext", `New design ${Math.round(value)}%, legacy design ${Math.round(100 - value)}%`);
      };

      const animate = () => {
        currentValue += (targetValue - currentValue) * 0.18;

        if (Math.abs(targetValue - currentValue) < 0.08) {
          currentValue = targetValue;
          frame = null;
          render(currentValue);
          return;
        }

        render(currentValue);
        frame = requestAnimationFrame(animate);
      };

      const update = () => {
        targetValue = Number(range.value);

        if (reduceMotion) {
          currentValue = targetValue;
          render(currentValue);
          return;
        }

        if (!frame) frame = requestAnimationFrame(animate);
      };

      render(currentValue);
      range.addEventListener("input", update);
    });
  };

  const initRail = () => {
    const links = [...document.querySelectorAll(".copper-rail nav a")];
    const sections = links.map((link) => document.querySelector(link.hash)).filter(Boolean);
    if (!("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(() => {
      const current = sections.filter((section) => {
        const rect = section.getBoundingClientRect();
        return rect.top <= innerHeight * 0.38 && rect.bottom > innerHeight * 0.18;
      }).at(-1);
      if (!current) return;
      links.forEach((link) => link.classList.toggle("is-active", link.hash === `#${current.id}`));
    }, { rootMargin: "-10% 0px -60% 0px" });
    sections.forEach((section) => observer.observe(section));
  };

  const init = () => { initComparison(); initRail(); };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
