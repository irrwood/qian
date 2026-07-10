(() => {
  const footer = document.querySelector(".case-footer, .site-footer");
  let status = document.querySelector(".london-status");

  if (!status && footer) {
    status = document.createElement("div");
    status.className = "london-status";
    status.setAttribute("aria-label", "Current weather and time in London");
    status.setAttribute("aria-live", "polite");
    status.innerHTML = '<span class="london-status__weather"><span class="london-status__icon" aria-hidden="true">○</span><span class="london-status__temperature">--°</span></span><time class="london-status__time">--:-- --</time><span class="london-status__place">in London</span>';
    footer.prepend(status);
  }

  if (!status) {
    return;
  }

  const time = status.querySelector(".london-status__time");
  const icon = status.querySelector(".london-status__icon");
  const temperature = status.querySelector(".london-status__temperature");
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const icons = {
    sun: '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3.5"/><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.66 6.34l1.41-1.41"/></svg>',
    cloud: '<svg viewBox="0 0 24 24" fill="none"><path d="M7 18h10a4 4 0 0 0 .48-7.97A6 6 0 0 0 6.2 9.1 4.5 4.5 0 0 0 7 18Z"/></svg>',
    rain: '<svg viewBox="0 0 24 24" fill="none"><path d="M7 15h10a4 4 0 0 0 .48-7.97A6 6 0 0 0 6.2 6.1 4.5 4.5 0 0 0 7 15Z"/><path d="m8 18-1 2M13 18l-1 2M18 18l-1 2"/></svg>',
    snow: '<svg viewBox="0 0 24 24" fill="none"><path d="M7 14h10a4 4 0 0 0 .48-7.97A6 6 0 0 0 6.2 5.1 4.5 4.5 0 0 0 7 14Z"/><path d="M8 18h.01M12 20h.01M16 18h.01" stroke-width="2"/></svg>',
    storm: '<svg viewBox="0 0 24 24" fill="none"><path d="M7 14h10a4 4 0 0 0 .48-7.97A6 6 0 0 0 6.2 5.1 4.5 4.5 0 0 0 7 14Z"/><path d="m13 15-3 5h3l-1 3 4-6h-3Z"/></svg>',
  };

  const getIcon = (code, isDay) => {
    if (code === 0 && isDay) return icons.sun;
    if (code >= 51 && code <= 67 || code >= 80 && code <= 82) return icons.rain;
    if (code >= 71 && code <= 77 || code >= 85 && code <= 86) return icons.snow;
    if (code >= 95) return icons.storm;
    return icons.cloud;
  };

  const updateTime = () => {
    const label = formatter.format(new Date()).replace("am", "AM").replace("pm", "PM");
    time.textContent = label;
    time.dateTime = new Date().toISOString();
  };

  const updateWeather = async () => {
    try {
      const response = await fetch("https://api.open-meteo.com/v1/forecast?latitude=51.5074&longitude=-0.1278&current=temperature_2m,weather_code,is_day&timezone=Europe%2FLondon", { cache: "no-store" });
      if (!response.ok) throw new Error("Weather unavailable");
      const data = await response.json();
      const current = data.current;
      temperature.textContent = `${Math.round(current.temperature_2m)}°`;
      icon.innerHTML = getIcon(current.weather_code, Boolean(current.is_day));
    } catch {
      temperature.textContent = "London weather";
      icon.innerHTML = icons.cloud;
    }
  };

  updateTime();
  updateWeather();
  window.setInterval(updateTime, 30000);
  window.setInterval(updateWeather, 15 * 60 * 1000);
})();
