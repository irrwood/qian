(() => {
  const initShowcaseDrag = () => {
    const showcase = document.querySelector(".case-showcase");
    const viewport = showcase?.querySelector(".case-showcase__viewport");
    const track = showcase?.querySelector(".case-showcase__track");
    const firstSet = showcase?.querySelector(".case-showcase__set");

    if (!viewport || !track || !firstSet) {
      return;
    }

    let dragState = null;

    const getLoopDistance = () => {
      const styles = window.getComputedStyle(track);
      const gap = Number.parseFloat(styles.columnGap || styles.gap || "0") || 0;
      return firstSet.getBoundingClientRect().width + gap;
    };

    const getAnimationDuration = () => {
      const duration = window.getComputedStyle(track).animationDuration.split(",")[0]?.trim();

      if (!duration) {
        return 0;
      }

      if (duration.endsWith("ms")) {
        return Number.parseFloat(duration);
      }

      return Number.parseFloat(duration) * 1000;
    };

    const getTrackX = () => {
      const transform = window.getComputedStyle(track).transform;

      if (!transform || transform === "none") {
        return 0;
      }

      const matrix = transform.match(/^matrix\((.+)\)$/);

      if (matrix) {
        const values = matrix[1].split(",").map((value) => Number.parseFloat(value));
        return values[4] || 0;
      }

      const matrix3d = transform.match(/^matrix3d\((.+)\)$/);

      if (matrix3d) {
        const values = matrix3d[1].split(",").map((value) => Number.parseFloat(value));
        return values[12] || 0;
      }

      return 0;
    };

    const wrapOffset = (offset, distance) => {
      if (distance <= 0) {
        return offset;
      }

      const wrapped = (((-offset % distance) + distance) % distance) * -1;
      return Object.is(wrapped, -0) ? 0 : wrapped;
    };

    const getClientX = (event) => event.touches?.[0]?.clientX ?? event.clientX;

    const endDrag = (event) => {
      if (!dragState) {
        return;
      }

      if (event.pointerId != null && event.pointerId === dragState.pointerId) {
        viewport.releasePointerCapture?.(event.pointerId);
      }

      const progress = Math.min(Math.max((-dragState.currentOffset || 0) / dragState.distance, 0), 1);
      viewport.classList.remove("is-dragging");
      track.style.animation = "";
      track.style.animationDelay = `${progress * dragState.duration * -1}ms`;
      track.style.transform = "";
      dragState = null;
    };

    const startDrag = (event) => {
      if (event.type === "mousedown" && event.button !== 0) {
        return;
      }

      const duration = getAnimationDuration();
      const distance = getLoopDistance();
      const clientX = getClientX(event);

      if (!Number.isFinite(duration) || duration <= 0 || distance <= 0 || clientX == null) {
        return;
      }

      viewport.setPointerCapture?.(event.pointerId);
      viewport.classList.add("is-dragging");
      const startOffset = wrapOffset(getTrackX(), distance);
      track.style.animation = "none";
      track.style.transform = `translate3d(${startOffset}px, 0, 0)`;
      dragState = {
        distance,
        duration,
        pointerId: event.pointerId,
        currentOffset: startOffset,
        startOffset,
        startX: clientX,
      };
    };

    const moveDrag = (event) => {
      if (!dragState || (event.pointerId != null && event.pointerId !== dragState.pointerId)) {
        return;
      }

      const clientX = getClientX(event);

      if (clientX == null) {
        return;
      }

      const deltaX = clientX - dragState.startX;
      dragState.currentOffset = wrapOffset(dragState.startOffset + deltaX, dragState.distance);
      track.style.transform = `translate3d(${dragState.currentOffset}px, 0, 0)`;
    };

    if (window.PointerEvent) {
      viewport.addEventListener("pointerdown", startDrag);
      viewport.addEventListener("pointermove", moveDrag);
      viewport.addEventListener("pointerup", endDrag);
      viewport.addEventListener("pointercancel", endDrag);
    } else {
      viewport.addEventListener("mousedown", startDrag);
      window.addEventListener("mousemove", moveDrag);
      window.addEventListener("mouseup", endDrag);
      viewport.addEventListener("touchstart", startDrag, { passive: true });
      window.addEventListener("touchmove", moveDrag, { passive: true });
      window.addEventListener("touchend", endDrag);
      window.addEventListener("touchcancel", endDrag);
    }

    viewport.addEventListener("lostpointercapture", () => {
      if (!dragState) {
        return;
      }

      const progress = Math.min(Math.max((-dragState.currentOffset || 0) / dragState.distance, 0), 1);
      viewport.classList.remove("is-dragging");
      track.style.animation = "";
      track.style.animationDelay = `${progress * dragState.duration * -1}ms`;
      track.style.transform = "";
      dragState = null;
    });
  };

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
    document.addEventListener("DOMContentLoaded", () => {
      initShowcaseDrag();
      initCaseStudyMotion();
    }, { once: true });
  } else {
    initShowcaseDrag();
    initCaseStudyMotion();
  }
})();
