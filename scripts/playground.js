(() => {
  const canvas = document.querySelector("[data-infinite-canvas]");
  const world = document.querySelector("[data-canvas-world]");
  const grid = document.querySelector(".playground__grid");

  if (!canvas || !world || !grid) {
    return;
  }

  const camera = { x: 0, y: 0, scale: 1 };
  const pointers = new Map();
  const minScale = 0.42;
  const maxScale = 2.5;
  const baseDotSize = 40.32;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let lastPoint = null;
  let pinch = null;
  let velocityX = 0;
  let velocityY = 0;
  let animationFrame = 0;
  let didDrag = false;
  let suppressClick = false;
  let cardDrag = null;
  let cardMotion = null;
  let cardAnimationFrame = 0;

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const render = () => {
    world.style.transform = `translate3d(${camera.x}px, ${camera.y}px, 0) scale(${camera.scale})`;

    const dotSize = baseDotSize * camera.scale;
    grid.style.backgroundSize = `${dotSize}px ${dotSize}px`;
    grid.style.backgroundPosition = `${camera.x % dotSize}px ${camera.y % dotSize}px`;
  };

  const stopAnimation = () => {
    window.cancelAnimationFrame(animationFrame);
    animationFrame = 0;
  };

  const zoomAt = (nextScale, clientX, clientY) => {
    const scale = clamp(nextScale, minScale, maxScale);
    const worldX = (clientX - camera.x) / camera.scale;
    const worldY = (clientY - camera.y) / camera.scale;

    camera.scale = scale;
    camera.x = clientX - worldX * scale;
    camera.y = clientY - worldY * scale;
    render();
  };

  const animateReset = () => {
    stopAnimation();

    if (reducedMotion) {
      camera.x = 0;
      camera.y = 0;
      camera.scale = 1;
      render();
      return;
    }

    const start = { ...camera };
    const startedAt = performance.now();
    const duration = 420;

    const tick = (now) => {
      const progress = clamp((now - startedAt) / duration, 0, 1);
      const eased = 1 - Math.pow(1 - progress, 4);

      camera.x = start.x * (1 - eased);
      camera.y = start.y * (1 - eased);
      camera.scale = start.scale + (1 - start.scale) * eased;
      render();

      if (progress < 1) {
        animationFrame = window.requestAnimationFrame(tick);
      }
    };

    animationFrame = window.requestAnimationFrame(tick);
  };

  const startInertia = () => {
    stopAnimation();

    if (reducedMotion || Math.hypot(velocityX, velocityY) < 0.8) {
      return;
    }

    const tick = () => {
      camera.x += velocityX;
      camera.y += velocityY;
      velocityX *= 0.91;
      velocityY *= 0.91;
      render();

      if (Math.hypot(velocityX, velocityY) >= 0.1) {
        animationFrame = window.requestAnimationFrame(tick);
      }
    };

    animationFrame = window.requestAnimationFrame(tick);
  };

  const stopCardInertia = (card = null) => {
    if (!cardMotion || (card && cardMotion.card !== card)) {
      return;
    }

    window.cancelAnimationFrame(cardAnimationFrame);
    cardMotion.card.dataset.dragX = String(cardMotion.x);
    cardMotion.card.dataset.dragY = String(cardMotion.y);
    cardMotion.card.classList.remove("is-card-gliding");
    cardAnimationFrame = 0;
    cardMotion = null;
  };

  const startCardInertia = (card, x, y, velocityX, velocityY) => {
    stopCardInertia();

    const speed = Math.hypot(velocityX, velocityY);

    if (reducedMotion || speed < 0.45) {
      return;
    }

    const maxSpeed = 12;
    const speedScale = Math.min(1, maxSpeed / speed);
    cardMotion = {
      card,
      x,
      y,
      velocityX: velocityX * speedScale,
      velocityY: velocityY * speedScale,
    };
    card.classList.add("is-card-gliding");

    const tick = () => {
      if (!cardMotion) {
        return;
      }

      cardMotion.x += cardMotion.velocityX;
      cardMotion.y += cardMotion.velocityY;
      cardMotion.velocityX *= 0.82;
      cardMotion.velocityY *= 0.82;
      card.style.translate = `${cardMotion.x}px ${cardMotion.y}px`;

      if (Math.hypot(cardMotion.velocityX, cardMotion.velocityY) >= 0.08) {
        cardAnimationFrame = window.requestAnimationFrame(tick);
      } else {
        stopCardInertia();
      }
    };

    cardAnimationFrame = window.requestAnimationFrame(tick);
  };

  const getPinchSnapshot = () => {
    const [first, second] = Array.from(pointers.values());
    const midpoint = {
      x: (first.x + second.x) / 2,
      y: (first.y + second.y) / 2,
    };

    return {
      distance: Math.hypot(second.x - first.x, second.y - first.y),
      scale: camera.scale,
      worldX: (midpoint.x - camera.x) / camera.scale,
      worldY: (midpoint.y - camera.y) / camera.scale,
    };
  };

  canvas.addEventListener("pointerdown", (event) => {
    if (event.button !== 0 || event.target.closest(".playground__back") || cardDrag) {
      return;
    }

    stopAnimation();
    canvas.focus({ preventScroll: true });
    const card = event.target.closest(".playground__card");
    (card || canvas).setPointerCapture(event.pointerId);

    if (card) {
      stopCardInertia(card);
      const startX = Number.parseFloat(card.dataset.dragX || "0");
      const startY = Number.parseFloat(card.dataset.dragY || "0");
      const now = performance.now();

      cardDrag = {
        card,
        pointerId: event.pointerId,
        originClientX: event.clientX,
        originClientY: event.clientY,
        startX,
        startY,
        currentX: startX,
        currentY: startY,
        lastClientX: event.clientX,
        lastClientY: event.clientY,
        lastMoveTime: now,
        velocityX: 0,
        velocityY: 0,
        moved: false,
      };

      card.classList.add("is-card-dragging");
      canvas.classList.add("is-dragging");
      return;
    }

    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    canvas.classList.add("is-dragging");

    if (pointers.size === 1) {
      lastPoint = { x: event.clientX, y: event.clientY, time: performance.now() };
      velocityX = 0;
      velocityY = 0;
      didDrag = false;
    } else if (pointers.size === 2) {
      pinch = getPinchSnapshot();
      didDrag = true;
    }
  });

  canvas.addEventListener("pointermove", (event) => {
    if (cardDrag?.pointerId === event.pointerId) {
      const now = performance.now();
      const elapsed = Math.max(now - cardDrag.lastMoveTime, 8);
      const deltaX = (event.clientX - cardDrag.originClientX) / camera.scale;
      const deltaY = (event.clientY - cardDrag.originClientY) / camera.scale;
      const stepX = (event.clientX - cardDrag.lastClientX) / camera.scale;
      const stepY = (event.clientY - cardDrag.lastClientY) / camera.scale;

      cardDrag.currentX = cardDrag.startX + deltaX;
      cardDrag.currentY = cardDrag.startY + deltaY;
      cardDrag.velocityX = (stepX / elapsed) * 16.67;
      cardDrag.velocityY = (stepY / elapsed) * 16.67;
      cardDrag.lastClientX = event.clientX;
      cardDrag.lastClientY = event.clientY;
      cardDrag.lastMoveTime = now;
      cardDrag.moved ||= Math.hypot(deltaX, deltaY) > 4;
      cardDrag.card.style.translate = `${cardDrag.currentX}px ${cardDrag.currentY}px`;
      return;
    }

    if (!pointers.has(event.pointerId)) {
      return;
    }

    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (pointers.size === 2 && pinch) {
      const [first, second] = Array.from(pointers.values());
      const midpoint = {
        x: (first.x + second.x) / 2,
        y: (first.y + second.y) / 2,
      };
      const distance = Math.hypot(second.x - first.x, second.y - first.y);
      const scale = clamp(pinch.scale * (distance / Math.max(pinch.distance, 1)), minScale, maxScale);

      camera.scale = scale;
      camera.x = midpoint.x - pinch.worldX * scale;
      camera.y = midpoint.y - pinch.worldY * scale;
      didDrag = true;
      render();
      return;
    }

    if (pointers.size === 1 && lastPoint) {
      const now = performance.now();
      const elapsed = Math.max(now - lastPoint.time, 8);
      const deltaX = event.clientX - lastPoint.x;
      const deltaY = event.clientY - lastPoint.y;

      if (Math.hypot(deltaX, deltaY) > 2) {
        didDrag = true;
      }

      camera.x += deltaX;
      camera.y += deltaY;
      velocityX = (deltaX / elapsed) * 16.67;
      velocityY = (deltaY / elapsed) * 16.67;
      lastPoint = { x: event.clientX, y: event.clientY, time: now };
      render();
    }
  });

  const releasePointer = (event) => {
    if (cardDrag?.pointerId === event.pointerId) {
      const { card, currentX, currentY, moved, lastMoveTime } = cardDrag;
      const freshness = clamp(1 - (performance.now() - lastMoveTime) / 100, 0, 1);
      const releaseVelocityX = cardDrag.velocityX * freshness;
      const releaseVelocityY = cardDrag.velocityY * freshness;

      card.dataset.dragX = String(currentX);
      card.dataset.dragY = String(currentY);
      card.classList.remove("is-card-dragging");
      canvas.classList.remove("is-dragging");
      suppressClick = moved;
      window.setTimeout(() => {
        suppressClick = false;
      }, 0);
      cardDrag = null;

      if (moved && event.type === "pointerup") {
        startCardInertia(card, currentX, currentY, releaseVelocityX, releaseVelocityY);
      }
      return;
    }

    pointers.delete(event.pointerId);

    if (pointers.size === 1) {
      const remaining = Array.from(pointers.values())[0];
      lastPoint = { ...remaining, time: performance.now() };
      pinch = null;
      velocityX = 0;
      velocityY = 0;
      return;
    }

    if (pointers.size === 0) {
      canvas.classList.remove("is-dragging");
      lastPoint = null;
      pinch = null;
      suppressClick = didDrag;
      window.setTimeout(() => {
        suppressClick = false;
      }, 0);
      startInertia();
    }
  };

  canvas.addEventListener("pointerup", releasePointer);
  canvas.addEventListener("pointercancel", releasePointer);

  canvas.addEventListener("dragstart", (event) => {
    if (event.target.closest(".playground__card")) {
      event.preventDefault();
    }
  });

  canvas.addEventListener("click", (event) => {
    if (suppressClick && event.target.closest(".playground__card--linked")) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, true);

  canvas.addEventListener("wheel", (event) => {
    event.preventDefault();
    stopAnimation();

    const unit = event.deltaMode === WheelEvent.DOM_DELTA_LINE
      ? 16
      : event.deltaMode === WheelEvent.DOM_DELTA_PAGE
        ? window.innerHeight
        : 1;

    if (event.ctrlKey || event.metaKey) {
      const factor = Math.exp(-event.deltaY * unit * 0.002);
      zoomAt(camera.scale * factor, event.clientX, event.clientY);
      return;
    }

    camera.x -= event.deltaX * unit;
    camera.y -= event.deltaY * unit;
    render();
  }, { passive: false });

  canvas.addEventListener("dblclick", (event) => {
    if (!event.target.closest(".playground__back")) {
      animateReset();
    }
  });

  canvas.addEventListener("keydown", (event) => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    if (event.key === "0") {
      event.preventDefault();
      animateReset();
    } else if (event.key === "+" || event.key === "=") {
      event.preventDefault();
      zoomAt(camera.scale * 1.15, centerX, centerY);
    } else if (event.key === "-" || event.key === "_") {
      event.preventDefault();
      zoomAt(camera.scale / 1.15, centerX, centerY);
    } else if (event.key.startsWith("Arrow")) {
      event.preventDefault();
      const amount = 72;
      camera.x += event.key === "ArrowRight" ? -amount : event.key === "ArrowLeft" ? amount : 0;
      camera.y += event.key === "ArrowDown" ? -amount : event.key === "ArrowUp" ? amount : 0;
      render();
    }
  });

  render();
})();
