// Pauses autoplaying videos while they are off screen and resumes them when
// they scroll back into view. Cuts decode/battery cost on media-heavy pages.
// Include on any page that has <video autoplay> elements.
(() => {
  if (!("IntersectionObserver" in window)) return;

  const init = () => {
    const videos = document.querySelectorAll("video[autoplay]");
    if (!videos.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (entry.isIntersecting) {
            // play() can reject (e.g. tab backgrounded) — ignore.
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { rootMargin: "100px" }
    );

    videos.forEach((v) => observer.observe(v));
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
