(() => {
  const initCaseStudyMotion = () => {
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

    gsap.defaults({
      duration: 0.75,
      ease: "power3.out",
    });

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(
        "[data-gsap-reveal], .case-hero__intro > *, .case-hero__media",
        { clearProps: "all" }
      );
      root.classList.remove("case-motion-pending");
    });

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const heroItems = [".case-hero__intro > *", ".case-hero__media"];
      const startsScrolled = window.scrollY > 24;
      gsap.set(heroItems, startsScrolled ? { autoAlpha: 1, y: 0 } : { autoAlpha: 0 });

      const heroTimeline = gsap.timeline({ paused: startsScrolled });
      if (!startsScrolled) {
        heroTimeline
          .fromTo(
            ".case-hero__intro > *",
            { y: 22, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.68, stagger: 0.08 },
          )
          .fromTo(
            ".case-hero__media",
            { y: 28, autoAlpha: 0, force3D: true },
            { y: 0, autoAlpha: 1, duration: 0.78, ease: "power3.out", force3D: true },
            "-=0.46"
          );
      }

      // Magnetic pull: clickable text drifts toward the cursor, springs back on leave.
      if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        const magnets = document.querySelectorAll(
          ".portfolio-nav__brand, .portfolio-nav__link, .case-footer__brand, .case-footer__links a"
        );
        magnets.forEach((el) => {
          const xTo = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3.out" });
          const yTo = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3.out" });
          el.addEventListener("mousemove", (e) => {
            const r = el.getBoundingClientRect();
            xTo((e.clientX - (r.left + r.width / 2)) * 0.35);
            yTo((e.clientY - (r.top + r.height / 2)) * 0.35);
          });
          el.addEventListener("mouseleave", () => {
            xTo(0);
            yTo(0);
          });
        });

        const bindMediaMagnet = (el, options = {}) => {
          const strength = options.strength ?? 0.035;
          const maxMove = options.maxMove ?? 8;
          const hoverScale = options.scale ?? 1.018;
          const xTo = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3.out" });
          const yTo = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3.out" });
          const scaleTo =
            hoverScale === null
              ? null
              : gsap.quickTo(el, "scale", { duration: 0.45, ease: "power3.out" });
          const clampMove = gsap.utils.clamp(-maxMove, maxMove);

          el.addEventListener("mouseenter", () => {
            scaleTo?.(hoverScale);
          });
          el.addEventListener("mousemove", (e) => {
            const r = el.getBoundingClientRect();
            xTo(clampMove((e.clientX - (r.left + r.width / 2)) * strength));
            yTo(clampMove((e.clientY - (r.top + r.height / 2)) * strength));
          });
          el.addEventListener("mouseleave", () => {
            xTo(0);
            yTo(0);
            scaleTo?.(1);
          });
        };

        gsap.utils.toArray(".case-hero__media").forEach((el) => {
          bindMediaMagnet(el, { scale: null, strength: 0.014, maxMove: 5 });
        });

        gsap.utils.toArray(".case-media-card").forEach((el) => {
          bindMediaMagnet(el, { scale: 1.035, strength: 0.03, maxMove: 8 });
        });

        gsap.utils.toArray(".case-showcase__item").forEach((el) => {
          bindMediaMagnet(el, { scale: 1.04, strength: 0.028, maxMove: 7 });
        });
      }

      if (!ScrollTrigger) {
        root.classList.remove("case-motion-pending");
        return;
      }

      document.documentElement.classList.add("case-gsap-motion-ready");

      const revealItems = gsap.utils.toArray("[data-gsap-reveal]");
      const textRevealItems = gsap.utils.toArray(".case-copy__body [data-gsap-reveal]");
      const featureRevealItems = revealItems.filter((item) => !textRevealItems.includes(item));
      gsap.set(featureRevealItems, { y: 18, autoAlpha: 0, force3D: true });
      gsap.set(textRevealItems, { y: 14, autoAlpha: 0 });

      ScrollTrigger.batch(featureRevealItems, {
        start: "top bottom-=60",
        once: true,
        onEnter: (batch) => {
          gsap.to(batch, {
            y: 0,
            autoAlpha: 1,
            duration: 0.92,
            ease: "power2.out",
            force3D: true,
            stagger: 0.06,
            overwrite: "auto",
          });
        },
      });

      ScrollTrigger.batch(textRevealItems, {
        start: "top bottom-=72",
        once: true,
        onEnter: (batch) => {
          gsap.to(batch, {
            y: 0,
            autoAlpha: 1,
            duration: 0.96,
            ease: "power2.out",
            stagger: 0.05,
            overwrite: "auto",
          });
        },
      });

      let heroScrollScaleCreated = false;
      const createHeroScrollScale = () => {
        if (heroScrollScaleCreated) {
          return null;
        }

        heroScrollScaleCreated = true;
        return gsap.fromTo(
          ".case-hero__media",
          { scale: 1, force3D: true },
          {
            scale: 1.045,
            force3D: true,
            ease: "none",
            scrollTrigger: {
              trigger: ".case-hero",
              start: "top top",
              end: "+=360",
              scrub: 0.8,
            },
          }
        );
      };

      const heroScaleTween = createHeroScrollScale();
      ScrollTrigger.refresh();
      ScrollTrigger.update();
      if (startsScrolled && heroScaleTween?.scrollTrigger) {
        heroScaleTween.progress(heroScaleTween.scrollTrigger.progress);
      }
      root.classList.remove("case-motion-pending");
      if (!startsScrolled) {
        heroTimeline.play(0);
      }

      const refreshScrollTriggers = () => ScrollTrigger.refresh();
      window.addEventListener(
        "load",
        () => {
          refreshScrollTriggers();
          // Settle once more after late-arriving media/layout shifts.
          setTimeout(refreshScrollTriggers, 300);
        },
        { once: true }
      );
      document.fonts?.ready.then(refreshScrollTriggers).catch(() => {});

      // Recompute trigger positions once each video reports its dimensions.
      gsap.utils.toArray(".case-video").forEach((video) => {
        video.addEventListener("loadeddata", refreshScrollTriggers, { once: true });
      });
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCaseStudyMotion, { once: true });
  } else {
    initCaseStudyMotion();
  }
})();
