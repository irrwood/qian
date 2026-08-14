(() => {
  const showcase = document.querySelector(".case-showcase");
  const viewport = showcase?.querySelector(".case-showcase__viewport");
  const track = showcase?.querySelector(".case-showcase__track");
  const firstSet = showcase?.querySelector(".case-showcase__set");

  if (!viewport || !track || !firstSet) return;

  let dragState = null;
  let inertiaFrame = 0;
  const hasInertia = document.body.classList.contains("best-nav-experiment");

  const getLoopDistance = () => {
    const styles = window.getComputedStyle(track);
    const gap = Number.parseFloat(styles.columnGap || styles.gap || "0") || 0;
    return firstSet.getBoundingClientRect().width + gap;
  };

  const getAnimationDuration = () => {
    const duration = window.getComputedStyle(track).animationDuration.split(",")[0]?.trim();
    if (!duration) return 0;
    if (duration.endsWith("ms")) return Number.parseFloat(duration);
    return Number.parseFloat(duration) * 1000;
  };

  const getTrackX = () => {
    const transform = window.getComputedStyle(track).transform;
    if (!transform || transform === "none") return 0;

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
    if (distance <= 0) return offset;
    const wrapped = (((-offset % distance) + distance) % distance) * -1;
    return Object.is(wrapped, -0) ? 0 : wrapped;
  };

  const getClientX = (event) => event.touches?.[0]?.clientX ?? event.clientX;

  const resumeAnimation = ({ currentOffset, distance, duration }) => {
    const progress = Math.min(Math.max((-currentOffset || 0) / distance, 0), 1);
    viewport.classList.remove("is-dragging");
    track.style.animation = "";
    track.style.animationDelay = `${progress * duration * -1}ms`;
    track.style.transform = "";
  };

  const startInertia = (state) => {
    let velocity = Math.max(-1.8, Math.min(1.8, state.velocity));
    let offset = state.currentOffset;
    let previousTime = performance.now();

    const tick = (time) => {
      const deltaTime = Math.min(time - previousTime, 32);
      previousTime = time;
      offset = wrapOffset(offset + velocity * deltaTime, state.distance);
      velocity *= Math.pow(0.92, deltaTime / 16.67);
      track.style.transform = `translate3d(${offset}px, 0, 0)`;

      if (Math.abs(velocity) > 0.018) {
        inertiaFrame = requestAnimationFrame(tick);
        return;
      }

      inertiaFrame = 0;
      resumeAnimation({ ...state, currentOffset: offset });
    };

    viewport.classList.remove("is-dragging");
    inertiaFrame = requestAnimationFrame(tick);
  };

  const endDrag = (event) => {
    if (!dragState) return;

    if (event.pointerId != null && event.pointerId === dragState.pointerId) {
      viewport.releasePointerCapture?.(event.pointerId);
    }

    const completedDrag = dragState;
    dragState = null;

    if (hasInertia && Math.abs(completedDrag.velocity) > 0.04) {
      startInertia(completedDrag);
    } else {
      resumeAnimation(completedDrag);
    }
  };

  const startDrag = (event) => {
    if (event.type === "mousedown" && event.button !== 0) return;

    const duration = getAnimationDuration();
    const distance = getLoopDistance();
    const clientX = getClientX(event);

    if (!Number.isFinite(duration) || duration <= 0 || distance <= 0 || clientX == null) return;

    if (inertiaFrame) {
      cancelAnimationFrame(inertiaFrame);
      inertiaFrame = 0;
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
      lastTime: performance.now(),
      lastX: clientX,
      startOffset,
      startX: clientX,
      velocity: 0,
    };
  };

  const moveDrag = (event) => {
    if (!dragState || (event.pointerId != null && event.pointerId !== dragState.pointerId)) return;

    const clientX = getClientX(event);
    if (clientX == null) return;

    const deltaX = clientX - dragState.startX;
    const now = performance.now();
    const deltaTime = Math.max(now - dragState.lastTime, 1);
    const instantVelocity = (clientX - dragState.lastX) / deltaTime;
    dragState.velocity = dragState.velocity * 0.65 + instantVelocity * 0.35;
    dragState.lastX = clientX;
    dragState.lastTime = now;
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
    if (!dragState) return;
    resumeAnimation(dragState);
    dragState = null;
  });
})();
