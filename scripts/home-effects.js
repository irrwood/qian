(() => {
  const initPendingCards = () => {
    const pendingCards = Array.from(document.querySelectorAll(".project-card--pending"));

    if (!pendingCards.length) {
      return;
    }

    let statusTimer;

    const hideStatus = (exceptCard = null) => {
      pendingCards.forEach((card) => {
        if (card !== exceptCard) {
          card.classList.remove("is-status-visible");
        }
      });
    };

    const showStatus = (card) => {
      hideStatus(card);
      card.classList.add("is-status-visible");
      window.clearTimeout(statusTimer);
      statusTimer = window.setTimeout(() => {
        card.classList.remove("is-status-visible");
      }, 2200);
    };

    pendingCards.forEach((card) => {
      card.addEventListener("click", (event) => {
        event.stopPropagation();
        showStatus(card);
      });

      card.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") {
          return;
        }

        event.preventDefault();
        showStatus(card);
      });
    });

    document.addEventListener("click", () => hideStatus());
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        hideStatus();
      }
    });
  };

  const initHomeMotion = () => {
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    const root = document.documentElement;

    if (!gsap) {
      root.classList.remove("home-motion-pending");
      return;
    }

    if (ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
    }

    gsap.defaults({
      duration: 0.72,
      ease: "power3.out",
    });

    const mm = gsap.matchMedia();
    const heroLinks = document.querySelector(".hero__links");

    const updateTopbar = () => {
      if (!heroLinks) {
        return;
      }

      const rect = heroLinks.getBoundingClientRect();
      document.body.classList.toggle("topbar-condensed", rect.bottom <= 18);
    };

    updateTopbar();
    window.addEventListener("scroll", updateTopbar, { passive: true });
    window.addEventListener("resize", updateTopbar);

    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(".hero > *, .home-section-title, .project-card, .creative-showcase, .feature-link, .site-footer > *", { clearProps: "all" });
      root.classList.remove("home-motion-pending");
    });

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const startsScrolled = window.scrollY > 24;
      const heroItems = ".hero > *";

      gsap.set(heroItems, startsScrolled ? { autoAlpha: 1, y: 0 } : { autoAlpha: 0, y: 18 });

      if (!startsScrolled) {
        gsap.to(heroItems, {
          y: 0,
          autoAlpha: 1,
          duration: 0.74,
          stagger: 0.08,
          clearProps: "transform,visibility,opacity",
        });
      }

      const hasFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

      if (hasFinePointer) {
        const bindMagnet = (el, options = {}) => {
          const strength = options.strength ?? 0.045;
          const maxMove = options.maxMove ?? 10;
          const hoverScale = options.scale ?? 1.012;
          const moveDuration = options.moveDuration ?? 0.34;
          const scaleInDuration = options.scaleInDuration ?? 0.3;
          const scaleOutDuration = options.scaleOutDuration ?? 0.26;
          const moveEase = options.moveEase ?? "power3.out";
          const scaleInEase = options.scaleInEase ?? "power3.out";
          const scaleOutEase = options.scaleOutEase ?? "power2.out";
          const xTo = gsap.quickTo(el, "x", { duration: moveDuration, ease: moveEase });
          const yTo = gsap.quickTo(el, "y", { duration: moveDuration, ease: moveEase });
          const clampMove = gsap.utils.clamp(-maxMove, maxMove);

          el.addEventListener("mouseenter", () => {
            if (hoverScale !== null) {
              gsap.to(el, {
                scaleX: hoverScale,
                scaleY: hoverScale,
                duration: scaleInDuration,
                ease: scaleInEase,
                overwrite: "auto",
              });
            }
          });

          el.addEventListener("mousemove", (event) => {
            const rect = el.getBoundingClientRect();
            const dx = event.clientX - (rect.left + rect.width / 2);
            const dy = event.clientY - (rect.top + rect.height / 2);
            xTo(clampMove(dx * strength));
            yTo(clampMove(dy * strength));
          });

          el.addEventListener("mouseleave", () => {
            xTo(0);
            yTo(0);
            if (hoverScale !== null) {
              gsap.to(el, {
                scaleX: 1,
                scaleY: 1,
                duration: scaleOutDuration,
                ease: scaleOutEase,
                overwrite: "auto",
              });
            }
          });
        };

        gsap.utils.toArray(".pill").forEach((el) => {
          bindMagnet(el, {
            strength: 0.22,
            maxMove: 8,
            scale: 1.035,
            moveDuration: 0.18,
            scaleInDuration: 0.14,
            scaleOutDuration: 0.16,
          });
        });

        gsap.utils.toArray(".site-footer__social a, .site-footer__brand").forEach((el) => {
          bindMagnet(el, { strength: 0.22, maxMove: 8, scale: 1.035 });
        });

        gsap.utils.toArray(".project-card:not(.project-card--compact) > .project-card__media, .feature-link img").forEach((el) => {
          bindMagnet(el, {
            strength: 0.018,
            maxMove: 6,
            scale: 1.016,
            moveDuration: 0.14,
            moveEase: "power2.out",
            scaleInDuration: 0.22,
            scaleInEase: "expo.out",
            scaleOutDuration: 0.2,
            scaleOutEase: "power2.out",
          });
        });

        gsap.utils.toArray(".project-card--compact").forEach((el) => {
          bindMagnet(el, {
            strength: 0.018,
            maxMove: 6,
            scale: 1.016,
            moveDuration: 0.14,
            moveEase: "power2.out",
            scaleInDuration: 0.22,
            scaleInEase: "expo.out",
            scaleOutDuration: 0.2,
            scaleOutEase: "power2.out",
          });
        });
      }

      if (!ScrollTrigger) {
        root.classList.remove("home-motion-pending");
        return;
      }

      gsap.set(".home-section-title, .project-card:not(.creative-card), .creative-showcase, .feature-link", { y: 20, autoAlpha: 0, force3D: true });
      gsap.set(".site-footer > *", { y: 12, autoAlpha: 0 });

      ScrollTrigger.batch(".project-card:not(.creative-card)", {
        start: "top bottom-=80",
        once: true,
        onEnter: (batch) => {
          gsap.to(batch, {
            y: 0,
            autoAlpha: 1,
            duration: 0.82,
            stagger: 0.055,
            force3D: true,
            overwrite: "auto",
          });
        },
      });

      ScrollTrigger.batch(".home-section-title, .creative-showcase, .feature-link, .site-footer > *", {
        start: "top bottom-=60",
        once: true,
        onEnter: (batch) => {
          gsap.to(batch, {
            y: 0,
            autoAlpha: 1,
            duration: 0.78,
            stagger: 0.06,
            overwrite: "auto",
          });
        },
      });

      root.classList.remove("home-motion-pending");
      ScrollTrigger.refresh();

      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener("load", () => {
        setTimeout(() => {
          refresh();
          updateTopbar();
        }, 120);
      }, { once: true });
      document.fonts?.ready.then(() => {
        refresh();
        updateTopbar();
      }).catch(() => {});
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      initPendingCards();
      initHomeMotion();
    }, { once: true });
  } else {
    initPendingCards();
    initHomeMotion();
  }
})();
