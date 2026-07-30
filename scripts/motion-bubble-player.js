(() => {
  const bubble = document.querySelector("[data-motion-bubble]");
  const shell = bubble?.querySelector(".motion-bubble__shell");
  const player = bubble?.querySelector("[data-motion-player]");
  const closeButtons = bubble?.querySelectorAll("[data-motion-close]");
  const playButtons = document.querySelectorAll("[data-motion-play]");

  if (!bubble || !shell || !player || !closeButtons?.length || !playButtons.length) {
    return;
  }

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let activeTrigger = null;
  let closeTimer = null;

  const clearPlayer = () => {
    player.replaceChildren();
    bubble.hidden = true;
    bubble.removeAttribute("aria-labelledby");
    document.body.classList.remove("motion-bubble-open");
    shell.style.removeProperty("--motion-from-x");
    shell.style.removeProperty("--motion-from-y");
    activeTrigger?.focus({ preventScroll: true });
    activeTrigger = null;
  };

  const closePlayer = () => {
    if (bubble.hidden) {
      return;
    }

    window.clearTimeout(closeTimer);
    bubble.classList.remove("is-open");
    closeTimer = window.setTimeout(clearPlayer, reduceMotion.matches ? 150 : 220);
  };

  const openPlayer = (trigger) => {
    window.clearTimeout(closeTimer);
    activeTrigger = trigger;

    const videoId = trigger.dataset.youtubeId;
    const videoTitle = trigger.dataset.videoTitle || "Motion design video";
    const iframe = document.createElement("iframe");

    iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?autoplay=1&rel=0`;
    iframe.title = videoTitle;
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    iframe.allowFullscreen = true;

    player.replaceChildren(iframe);
    bubble.hidden = false;
    document.body.classList.add("motion-bubble-open");

    const triggerRect = trigger.getBoundingClientRect();
    const shellRect = shell.getBoundingClientRect();
    const triggerCenterX = triggerRect.left + triggerRect.width / 2;
    const triggerCenterY = triggerRect.top + triggerRect.height / 2;
    const shellCenterX = shellRect.left + shellRect.width / 2;
    const shellCenterY = shellRect.top + shellRect.height / 2;
    const travelFactor = reduceMotion.matches ? 0 : 0.16;

    shell.style.setProperty("--motion-from-x", `${(triggerCenterX - shellCenterX) * travelFactor}px`);
    shell.style.setProperty("--motion-from-y", `${(triggerCenterY - shellCenterY) * travelFactor}px`);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        bubble.classList.add("is-open");
        closeButtons[0].focus({ preventScroll: true });
      });
    });
  };

  playButtons.forEach((button) => {
    button.addEventListener("click", () => openPlayer(button));
  });

  closeButtons.forEach((button) => {
    button.addEventListener("click", closePlayer);
  });

  bubble.addEventListener("click", (event) => {
    if (event.target === bubble) {
      closePlayer();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !bubble.hidden) {
      closePlayer();
    }
  });
})();
