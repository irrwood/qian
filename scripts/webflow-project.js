(() => {
  const initLegacyProjectMotion = () => {
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    const root = document.documentElement;

    if (!gsap) {
      root.classList.remove("case-motion-pending");
      return;
    }

    if (ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const revealItems = gsap.utils.toArray("[data-gsap-reveal]");

    if (reduceMotion) {
      gsap.set(revealItems, { clearProps: "all" });
      root.classList.remove("case-motion-pending");
      return;
    }

    const hero = document.querySelector(".legacy-hero, .about-hero");
    const heroMedia = document.querySelector(".legacy-hero__media img, .about-hero__media img");
    const heroItems = hero ? gsap.utils.toArray("[data-gsap-reveal]", hero) : [];
    const belowFoldItems = revealItems.filter((item) => !heroItems.includes(item));

    gsap.set(heroItems, { y: 20, autoAlpha: 0, force3D: true });
    gsap.to(heroItems, {
      y: 0,
      autoAlpha: 1,
      duration: 0.78,
      ease: "power3.out",
      stagger: 0.07,
      onStart: () => root.classList.remove("case-motion-pending"),
    });

    if (!ScrollTrigger) {
      gsap.set(belowFoldItems, { autoAlpha: 1, y: 0 });
      root.classList.remove("case-motion-pending");
      return;
    }

    gsap.set(belowFoldItems, { y: 18, autoAlpha: 0, force3D: true });
    ScrollTrigger.batch(belowFoldItems, {
      start: "top bottom-=72",
      once: true,
      onEnter: (batch) => {
        gsap.to(batch, {
          y: 0,
          autoAlpha: 1,
          duration: 0.9,
          ease: "power2.out",
          stagger: 0.05,
          overwrite: "auto",
        });
      },
    });

    if (hero && heroMedia) {
      gsap.to(heroMedia, {
        yPercent: -4,
        ease: "none",
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: 0.8,
        },
      });
    }

    window.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });
    document.fonts?.ready.then(() => ScrollTrigger.refresh()).catch(() => {});
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initLegacyProjectMotion, { once: true });
  } else {
    initLegacyProjectMotion();
  }
})();
