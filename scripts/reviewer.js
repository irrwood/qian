// Scales the fixed-width (1280px) preview iframe so the design fits the
// responsive preview panel. Mirrors the ResizeObserver logic from the original
// React component. No build step required.
(function () {
  var SOURCE_WIDTH = 1280;
  var HIDDEN_SCROLLBAR_GUTTER = 24;
  var shell = document.querySelector(".iframe-shell");
  var iframe = shell && shell.querySelector("iframe");

  if (shell && iframe) {
    function update() {
      var rect = shell.getBoundingClientRect();
      var scale = Math.min(1, rect.width / SOURCE_WIDTH);
      var sourceHeight = Math.max(1, Math.ceil(rect.height / scale));
      iframe.style.width = SOURCE_WIDTH + Math.ceil(HIDDEN_SCROLLBAR_GUTTER / scale) + "px";
      iframe.style.height = sourceHeight + "px";
      iframe.style.transform = "scale(" + scale + ")";
    }

    update();

    if (typeof ResizeObserver !== "undefined") {
      new ResizeObserver(update).observe(shell);
    } else {
      window.addEventListener("resize", update);
    }
  }

  var description = document.querySelector(".project-description");
  if (!description) return;

  if (!description.id) {
    description.id = "project-description";
  }

  var toggle = document.createElement("button");
  toggle.className = "project-description-toggle";
  toggle.type = "button";
  toggle.setAttribute("aria-controls", description.id);
  toggle.setAttribute("aria-expanded", "false");
  toggle.textContent = "Read more";

  toggle.addEventListener("click", function () {
    var isExpanded = description.classList.toggle("is-expanded");
    toggle.setAttribute("aria-expanded", String(isExpanded));
    toggle.textContent = isExpanded ? "Show less" : "Read more";
  });

  description.insertAdjacentElement("afterend", toggle);
})();
