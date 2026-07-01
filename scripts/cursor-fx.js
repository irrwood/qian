(() => {
  // Pointer-following dot field + cursor-attracting glow + ripple distortion.
  // Disabled for reduced-motion users and devices without a fine pointer.
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const noHover = window.matchMedia("(hover: none)").matches;
  if (reduce || noHover) return;

  const parseAccent = () => {
    const raw = document.body?.dataset.cursorFx;
    if (!raw) return [255, 255, 255];
    const rgb = raw.split(",").map((value) => Number(value.trim()));
    return rgb.length === 3 && rgb.every((value) => Number.isFinite(value))
      ? rgb.map((value) => Math.max(0, Math.min(255, value)))
      : [255, 255, 255];
  };

  const ACCENT = parseAccent();
  const SPACING = 14; // grid pitch (px)
  const FIELD_R = 170; // radius of the dot field around the cursor
  const LENS_R = 148; // radius of the cursor pull
  const LENS_MAX = 15; // max attraction displacement (px)
  const RIPPLE_LIFE = 620; // ms a ripple lives
  const RIPPLE_SPEED = 0.18; // px / ms (expansion)
  const RIPPLE_WIDTH = 10; // crest half-width (px)
  const RIPPLE_MAX = 1.4; // max ripple displacement (px)

  const canvas = document.createElement("canvas");
  canvas.className = "cursor-fx";
  canvas.setAttribute("aria-hidden", "true");
  const ctx = canvas.getContext("2d");

  let W = 0;
  let H = 0;
  let dpr = 1;

  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const mouse = { x: -9999, y: -9999 };
  const cur = { x: -9999, y: -9999 };
  let active = false;

  const ripples = [];
  let lastRipplePos = null;
  let lastRippleAt = 0;

  const onMove = (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    if (!active) {
      cur.x = mouse.x;
      cur.y = mouse.y;
      active = true;
    }
    const now = performance.now();
    if (!lastRipplePos) lastRipplePos = { x: e.clientX, y: e.clientY };
    const dx = e.clientX - lastRipplePos.x;
    const dy = e.clientY - lastRipplePos.y;
    if (dx * dx + dy * dy > 28 * 28 && now - lastRippleAt > 55) {
      ripples.push({ x: e.clientX, y: e.clientY, t: now });
      if (ripples.length > 9) ripples.shift();
      lastRippleAt = now;
      lastRipplePos = { x: e.clientX, y: e.clientY };
    }
    start();
  };

  const smooth = (t) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));

  let running = false;
  const start = () => {
    if (!running) {
      running = true;
      requestAnimationFrame(frame);
    }
  };

  const frame = () => {
    ctx.clearRect(0, 0, W, H);
    if (!active) {
      running = false; // park; canvas already cleared
      return;
    }

    const now = performance.now();
    cur.x += (mouse.x - cur.x) * 0.2;
    cur.y += (mouse.y - cur.y) * 0.2;

    for (let i = ripples.length - 1; i >= 0; i--) {
      if (now - ripples[i].t > RIPPLE_LIFE) ripples.splice(i, 1);
    }

    // Dot field.
    const x0 = Math.floor((cur.x - FIELD_R) / SPACING) * SPACING;
    const y0 = Math.floor((cur.y - FIELD_R) / SPACING) * SPACING;
    const x1 = cur.x + FIELD_R;
    const y1 = cur.y + FIELD_R;

    for (let gx = x0; gx <= x1; gx += SPACING) {
      for (let gy = y0; gy <= y1; gy += SPACING) {
        const ddx = gx - cur.x;
        const ddy = gy - cur.y;
        const dist = Math.hypot(ddx, ddy);
        if (dist > FIELD_R) continue;

        const nx = dist ? ddx / dist : 0;
        const ny = dist ? ddy / dist : 0;
        const lf = 1 - dist / FIELD_R; // 1 at centre, 0 at edge

        let px = gx;
        let py = gy;

        // Cursor attraction: pull dots inward, strongest mid-radius.
        const lens = Math.sin(Math.min(dist, LENS_R) / LENS_R * Math.PI) * LENS_MAX;
        px -= nx * lens;
        py -= ny * lens;

        // Ripple wake: each ring shoves nearby dots radially.
        let wave = 0;
        for (let r = 0; r < ripples.length; r++) {
          const rp = ripples[r];
          const age = now - rp.t;
          const rad = age * RIPPLE_SPEED;
          const rdx = gx - rp.x;
          const rdy = gy - rp.y;
          const rd = Math.hypot(rdx, rdy);
          const off = rd - rad;
          if (Math.abs(off) < RIPPLE_WIDTH) {
            const fall = 1 - age / RIPPLE_LIFE;
            const w = Math.cos((off / RIPPLE_WIDTH) * (Math.PI / 2)) * RIPPLE_MAX * fall;
            px += (rd ? rdx / rd : 0) * w;
            py += (rd ? rdy / rd : 0) * w;
            wave += Math.abs(w);
          }
        }

        const edgeFade = smooth(lf);
        const boost = edgeFade * 0.78 + Math.min(wave / RIPPLE_MAX, 1) * 0.1;
        const alpha = Math.min(0.1 + boost * 0.62, 0.78) * edgeFade;
        // Smallest right at the cursor, easing slightly larger toward the edge.
        const radius =
          0.55 + (1 - edgeFade) * 0.62 + Math.min(wave / RIPPLE_MAX, 1) * 0.06;

        ctx.fillStyle = `rgba(${ACCENT[0]},${ACCENT[1]},${ACCENT[2]},${alpha})`;
        ctx.beginPath();
        ctx.arc(px, py, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    requestAnimationFrame(frame);
  };

  resize();
  document.body.appendChild(canvas);
  window.addEventListener("resize", resize);
  window.addEventListener("mousemove", onMove, { passive: true });
  window.addEventListener("mouseleave", () => {
    active = false;
  });
})();
