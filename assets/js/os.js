const bootScreen = document.querySelector("[data-boot]");
const bootStatus = document.querySelector("[data-boot-status]");
const bootBar = document.querySelector("[data-boot-bar]");
const shell = document.querySelector("[data-shell]");
const loginScreen = document.querySelector("[data-login]");
const loginDots = document.querySelectorAll("[data-login-dot]");
const loginStatus = document.querySelector("[data-login-status]");
const openButtons = document.querySelectorAll("[data-open]");
const closeButtons = document.querySelectorAll("[data-close]");
const taskButtons = document.querySelectorAll("[data-task]");
const blogButtons = document.querySelectorAll("[data-blog-target]");
const blogViewer = document.querySelector("[data-blog-viewer]");
const clockTimes = document.querySelectorAll("[data-clock-time]");
const clockDates = document.querySelectorAll("[data-clock-date]");
const weatherTemps = document.querySelectorAll("[data-weather-temp]");
const weatherStatuses = document.querySelectorAll("[data-weather-status]");
const weatherUpdated = document.querySelectorAll("[data-weather-updated]");
const taskbar = document.querySelector(".os-taskbar");
const fullscreenToggle = document.querySelector("[data-fullscreen-toggle]");
const thoughtsJson = document.querySelector("[data-thoughts-json]");
const calendarRoot = document.querySelector("[data-calendar]");
const calendarGrid = document.querySelector("[data-calendar-grid]");
const calendarMonth = document.querySelector("[data-calendar-month]");
const calendarSelected = document.querySelector("[data-calendar-selected]");
const calendarThoughts = document.querySelector("[data-calendar-thoughts]");
const calendarPrev = document.querySelector("[data-calendar-prev]");
const calendarNext = document.querySelector("[data-calendar-next]");
const startToggle = document.querySelector("[data-start-toggle]");
const startMenu = document.querySelector("[data-start-menu]");
const startSearch = document.querySelector("[data-start-search]");
const startList = document.querySelector("[data-start-list]");
const startEmpty = document.querySelector("[data-start-empty]");
const bodyEl = document.body;
const photoList = document.querySelector("[data-photo-list]");
const photoPreview = document.querySelector("[data-photo-preview]");
const photoTitle = document.querySelector("[data-photo-title]");
const photoDate = document.querySelector("[data-photo-date]");
const photoFullscreen = document.querySelector("[data-photo-fullscreen]");
const photoOverlay = document.querySelector("[data-photo-overlay]");
const photoOverlayImg = document.querySelector("[data-photo-overlay-img]");
const photoOverlayClose = document.querySelector("[data-photo-close]");

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const canAnimate = !prefersReducedMotion && typeof window.anime === "function";

const bootSteps = [
  "Starting system...",
  "Loading modules...",
  "Mounting drives...",
  "Calibrating icons...",
  "Launching desktop..."
];

let bootComplete = false;

const setBootStep = (index) => {
  if (!bootStatus || !bootBar) return;
  bootStatus.textContent = bootSteps[index] || bootSteps[bootSteps.length - 1];
  const nextWidth = `${Math.min(100, (index + 1) * (100 / bootSteps.length))}%`;
  if (canAnimate) {
    window.anime({
      targets: bootBar,
      width: nextWidth,
      duration: 260,
      easing: "easeOutCubic"
    });
  } else {
    bootBar.style.width = nextWidth;
  }
};

const finishBoot = () => {
  if (bootComplete) return;
  bootComplete = true;
  if (canAnimate && bootScreen && shell) {
    window.anime({
      targets: bootScreen,
      opacity: [1, 0],
      duration: 500,
      easing: "easeOutQuad",
      complete: () => {
        bootScreen.classList.add("is-hidden");
      }
    });
    shell.classList.add("is-ready");
    const icons = document.querySelectorAll(".os-icons .os-icon");
    if (icons.length) {
      window.anime({
        targets: icons,
        opacity: [0, 1],
        translateY: [12, 0],
        delay: window.anime.stagger(80),
        duration: 420,
        easing: "easeOutCubic"
      });
    }
  } else {
    bootScreen?.classList.add("is-hidden");
    shell?.classList.add("is-ready");
  }
};

const runBoot = () => {
  if (canAnimate) {
    const title = document.querySelector(".boot-title");
    if (title) {
      window.anime({
        targets: title,
        opacity: [0.6, 1],
        duration: 360,
        direction: "alternate",
        loop: 3,
        easing: "easeInOutSine"
      });
    }
  }
  bootSteps.forEach((_, index) => {
    setTimeout(() => setBootStep(index), 360 * index);
  });
  setTimeout(finishBoot, 360 * bootSteps.length + 280);
};

const runLogin = () => {
  if (!loginScreen) {
    runBoot();
    return;
  }
  let dotIndex = 0;
  const revealDot = () => {
    if (dotIndex >= loginDots.length) {
      if (loginStatus) loginStatus.textContent = "Welcome";
      if (canAnimate) {
        window.anime({
          targets: loginScreen,
          opacity: [1, 0],
          duration: 240,
          easing: "easeInQuad",
          complete: () => {
            loginScreen.classList.add("is-hidden");
            runBoot();
          }
        });
      } else {
        loginScreen.classList.add("is-hidden");
        runBoot();
      }
      return;
    }
    const dot = loginDots[dotIndex];
    if (dot) {
      if (canAnimate) {
        window.anime({
          targets: dot,
          opacity: [0.2, 1],
          duration: 140,
          easing: "linear"
        });
      } else {
        dot.style.opacity = "1";
      }
    }
    dotIndex += 1;
    setTimeout(revealDot, 120);
  };

  const skipLogin = () => {
    loginScreen.classList.add("is-hidden");
    runBoot();
  };

  document.addEventListener("keydown", skipLogin, { once: true });
  document.addEventListener("click", skipLogin, { once: true });

  if (canAnimate) {
    window.anime({
      targets: loginScreen,
      opacity: [0, 1],
      duration: 240,
      easing: "easeOutQuad",
      begin: () => {
        loginScreen.style.opacity = "0";
      }
    });
  }
  setTimeout(revealDot, 280);
};

const skipBoot = () => {
  setBootStep(bootSteps.length - 1);
  finishBoot();
};

const openWindow = (name) => {
  const windowEl = document.querySelector(`[data-window="${name}"]`);
  if (!windowEl) return;
  windowEl.classList.add("is-open");
  windowEl.setAttribute("aria-hidden", "false");
  const isPhotos = Boolean(windowEl.querySelector(".os-photos"));
  if (canAnimate && !isPhotos) {
    window.anime({
      targets: windowEl,
      opacity: [0, 1],
      scale: [0.98, 1],
      translateY: [10, 0],
      duration: 190,
      easing: "easeOutBack"
    });
  }
  windowEl.style.zIndex = String(Number(windowEl.style.zIndex || 10) + 1);
  taskButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.task === name);
  });
  setActiveWindow(windowEl);
};

const closeWindow = (name) => {
  const windowEl = document.querySelector(`[data-window="${name}"]`);
  if (!windowEl) return;
  const isPhotos = Boolean(windowEl.querySelector(".os-photos"));
  if (canAnimate && !isPhotos) {
    window.anime({
      targets: windowEl,
      opacity: [1, 0],
      scale: [1, 0.97],
      duration: 140,
      easing: "easeInQuad",
      complete: () => {
        windowEl.classList.remove("is-open");
        windowEl.setAttribute("aria-hidden", "true");
      }
    });
  } else {
    windowEl.classList.remove("is-open");
    windowEl.setAttribute("aria-hidden", "true");
  }
  taskButtons.forEach((button) => {
    if (button.dataset.task === name) {
      button.classList.remove("is-active");
    }
  });
  if (activeWindow === windowEl) {
    activeWindow = null;
  }
};

openButtons.forEach((button) => {
  button.addEventListener("click", () => {
    openWindow(button.dataset.open);
  });
});

closeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    closeWindow(button.dataset.close);
  });
});

taskButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const name = button.dataset.task;
    const windowEl = document.querySelector(`[data-window="${name}"]`);
    if (!windowEl) return;
    const isOpen = windowEl.classList.contains("is-open");
    if (isOpen) {
      closeWindow(name);
    } else {
      openWindow(name);
    }
  });
});

const updateClock = () => {
  const now = new Date();
  const time = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  });
  const date = now.toLocaleDateString([], {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });
  clockTimes.forEach((node) => {
    node.textContent = time;
  });
  clockDates.forEach((node) => {
    node.textContent = date;
  });
  if (canAnimate) {
    const seconds = time.split(":")[2];
    if (seconds && Number(seconds) % 2 === 0) {
      window.anime({
        targets: clockTimes,
        opacity: [0.6, 1],
        duration: 140,
        easing: "linear"
      });
    }
  }
};

const updateWeather = async () => {
  const url = "https://api.open-meteo.com/v1/forecast?latitude=22.5726&longitude=88.3639&current=temperature_2m,weather_code&timezone=Asia%2FKolkata";
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Weather request failed");
    const data = await response.json();
    const temp = Math.round(data.current?.temperature_2m);
    const code = data.current?.weather_code;
    const status = weatherCodeToLabel(code);
    weatherTemps.forEach((node) => {
      node.textContent = Number.isFinite(temp) ? `${temp}°C` : "--°C";
    });
    weatherStatuses.forEach((node) => {
      node.textContent = status;
    });
    const updated = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    });
    weatherUpdated.forEach((node) => {
      node.textContent = `Updated ${updated}`;
    });
    if (canAnimate) {
      window.anime({
        targets: [...weatherTemps, ...weatherStatuses],
        scale: [0.96, 1],
        duration: 180,
        easing: "easeOutCubic"
      });
    }
  } catch (error) {
    weatherTemps.forEach((node) => {
      node.textContent = "--°C";
    });
    weatherStatuses.forEach((node) => {
      node.textContent = "Unavailable";
    });
  }
};

const weatherCodeToLabel = (code) => {
  const mapping = {
    0: "Clear",
    1: "Mostly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Rime fog",
    51: "Light drizzle",
    53: "Drizzle",
    55: "Heavy drizzle",
    61: "Light rain",
    63: "Rain",
    65: "Heavy rain",
    71: "Light snow",
    73: "Snow",
    75: "Heavy snow",
    80: "Rain showers",
    81: "Showers",
    82: "Heavy showers",
    95: "Thunderstorm",
    96: "Storm + hail",
    99: "Heavy hail"
  };
  if (code === undefined || code === null) return "Unknown";
  return mapping[code] || "Mixed";
};

const initTaskbar = () => {
  if (!taskbar) return;
  taskbar.classList.add("is-visible");
};

let activeWindow = null;

const setActiveWindow = (windowEl) => {
  activeWindow = windowEl;
};

const initWindows = () => {
  const windows = document.querySelectorAll("[data-window]");
  const resizeHandles = document.querySelectorAll("[data-resize]");
  const maximizeButtons = document.querySelectorAll("[data-maximize]");
  let zIndex = 10;

  const bringToFront = (windowEl) => {
    zIndex += 1;
    windowEl.style.zIndex = String(zIndex);
  };

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  windows.forEach((windowEl) => {
    const startX = Number(windowEl.dataset.startX || 260);
    const startY = Number(windowEl.dataset.startY || 60);
    windowEl.style.left = `${startX}px`;
    windowEl.style.top = `${startY}px`;
  windowEl.style.width = windowEl.style.width || "560px";
  windowEl.style.height = windowEl.style.height || "520px";
    windowEl.dataset.restore = JSON.stringify({
      left: startX,
      top: startY,
      width: windowEl.offsetWidth,
      height: windowEl.offsetHeight
    });
    windowEl.addEventListener("pointerdown", () => {
      bringToFront(windowEl);
      setActiveWindow(windowEl);
    });

    const handle = windowEl.querySelector("[data-drag-handle]");
    if (!handle) return;

    handle.addEventListener("pointerdown", (event) => {
      if (window.matchMedia("(max-width: 900px)").matches) return;
      if (windowEl.classList.contains("is-maximized")) return;
      const target = event.target;
      if (target && target.closest("[data-close]")) return;
      bodyEl?.classList.add("os-no-select");

      bringToFront(windowEl);
      const startLeft = windowEl.offsetLeft;
      const startTop = windowEl.offsetTop;
      const originX = event.clientX;
      const originY = event.clientY;
      const maxLeft = window.innerWidth - windowEl.offsetWidth - 12;
      const maxTop = window.innerHeight - windowEl.offsetHeight - 72;

      const move = (moveEvent) => {
        const nextLeft = startLeft + (moveEvent.clientX - originX);
        const nextTop = startTop + (moveEvent.clientY - originY);
        windowEl.style.left = `${clamp(nextLeft, 12, Math.max(12, maxLeft))}px`;
        windowEl.style.top = `${clamp(nextTop, 12, Math.max(12, maxTop))}px`;
      };

      const stop = () => {
        bodyEl?.classList.remove("os-no-select");
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", stop);
        if (canAnimate) {
          window.anime({
            targets: windowEl,
            translateX: [0, 2, 0],
            translateY: [0, -2, 0],
            duration: 140,
            easing: "easeOutCubic"
          });
        }
      };

      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", stop, { once: true });
    });
  });

  resizeHandles.forEach((handle) => {
    handle.addEventListener("pointerdown", (event) => {
      const name = handle.dataset.resize;
      const windowEl = document.querySelector(`[data-window="${name}"]`);
      if (!windowEl || windowEl.classList.contains("is-maximized")) return;
      if (window.matchMedia("(max-width: 900px)").matches) return;
      event.preventDefault();
      bringToFront(windowEl);
      const startWidth = windowEl.offsetWidth;
      const startHeight = windowEl.offsetHeight;
      const originX = event.clientX;
      const originY = event.clientY;

      const move = (moveEvent) => {
        const nextWidth = Math.max(260, startWidth + (moveEvent.clientX - originX));
        const nextHeight = Math.max(180, startHeight + (moveEvent.clientY - originY));
        windowEl.style.width = `${nextWidth}px`;
        windowEl.style.height = `${nextHeight}px`;
      };

      const stop = () => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", stop);
      };

      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", stop, { once: true });
    });
  });

  maximizeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const name = button.dataset.maximize;
      const windowEl = document.querySelector(`[data-window="${name}"]`);
      if (!windowEl) return;
      bringToFront(windowEl);
      if (windowEl.classList.contains("is-maximized")) {
        const restore = JSON.parse(windowEl.dataset.restore || "{}") || {};
        windowEl.classList.remove("is-maximized");
        if (restore.left !== undefined) windowEl.style.left = `${restore.left}px`;
        if (restore.top !== undefined) windowEl.style.top = `${restore.top}px`;
        if (restore.width) windowEl.style.width = `${restore.width}px`;
        if (restore.height) windowEl.style.height = `${restore.height}px`;
      } else {
        windowEl.dataset.restore = JSON.stringify({
          left: windowEl.offsetLeft,
          top: windowEl.offsetTop,
          width: windowEl.offsetWidth,
          height: windowEl.offsetHeight
        });
        windowEl.classList.add("is-maximized");
      }
      setActiveWindow(windowEl);
    });
  });
};

const initStartMenu = () => {
  if (!startToggle || !startMenu || !startList) return;
  const openMenu = () => {
    startMenu.hidden = false;
    startToggle.setAttribute("aria-expanded", "true");
    startSearch?.focus();
    if (canAnimate) {
      window.anime({
        targets: startMenu,
        opacity: [0, 1],
        translateY: [12, 0],
        duration: 180,
        easing: "easeOutCubic"
      });
    }
  };
  const closeMenu = () => {
    if (canAnimate) {
      window.anime({
        targets: startMenu,
        opacity: [1, 0],
        translateY: [0, 10],
        duration: 140,
        easing: "easeInQuad",
        complete: () => {
          startMenu.hidden = true;
        }
      });
    } else {
      startMenu.hidden = true;
    }
    startToggle.setAttribute("aria-expanded", "false");
  };
  const toggleMenu = () => {
    if (startMenu.hidden) {
      openMenu();
    } else {
      closeMenu();
    }
  };

  startToggle.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleMenu();
  });

  document.addEventListener("click", (event) => {
    if (!startMenu.hidden && !startMenu.contains(event.target) && event.target !== startToggle) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  startSearch?.addEventListener("input", () => {
    const query = (startSearch.value || "").toLowerCase();
    let visibleCount = 0;
    startList.querySelectorAll(".os-start-app").forEach((button) => {
      const label = button.textContent.toLowerCase();
      const match = label.includes(query);
      button.hidden = !match;
      if (match) visibleCount += 1;
    });
    if (startEmpty) startEmpty.hidden = visibleCount > 0;
  });

  startList.querySelectorAll(".os-start-app").forEach((button) => {
    button.addEventListener("click", () => {
      closeMenu();
      openWindow(button.dataset.open);
    });
  });
};

const initPhotos = () => {
  if (!photoList || !photoPreview) return;
  photoList.querySelectorAll("[data-photo-button]").forEach((button) => {
    button.addEventListener("click", () => {
      const full = button.dataset.photoFull;
      const title = button.dataset.photoTitle || "Photo";
      const date = button.dataset.photoDate || "";
      if (full) {
        photoPreview.src = full;
      }
      if (photoTitle) photoTitle.textContent = title;
      if (photoDate) photoDate.textContent = date;
    });
  });

  photoFullscreen?.addEventListener("click", () => {
    if (!photoOverlay || !photoOverlayImg || !photoPreview) return;
    photoOverlayImg.src = photoPreview.src;
    photoOverlay.hidden = false;
    document.body.classList.add("os-modal-open");
  });

  const closeOverlay = () => {
    if (!photoOverlay || !photoOverlayImg) return;
    photoOverlay.hidden = true;
    photoOverlayImg.src = "";
    document.body.classList.remove("os-modal-open");
  };

  photoOverlayClose?.addEventListener("click", closeOverlay);
  photoOverlay?.addEventListener("click", (event) => {
    if (event.target === photoOverlay) {
      closeOverlay();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeOverlay();
    }
  });
};

const initScrollGlow = () => {
  if (!canAnimate) return;
  const scrollers = document.querySelectorAll(".os-window-body-scroll, .os-blog-listing, .os-blog-viewer, .os-calendar-panel");
  scrollers.forEach((scroller) => {
    const wrapper = scroller.parentElement;
    if (!wrapper || wrapper.querySelector(".os-scroll-glow")) return;
    wrapper.style.position = "relative";
    const topGlow = document.createElement("div");
    topGlow.className = "os-scroll-glow top";
    const bottomGlow = document.createElement("div");
    bottomGlow.className = "os-scroll-glow bottom";
    wrapper.appendChild(topGlow);
    wrapper.appendChild(bottomGlow);

    const updateGlow = () => {
      const maxScroll = scroller.scrollHeight - scroller.clientHeight;
      const current = scroller.scrollTop;
      topGlow.style.opacity = current > 4 ? "1" : "0";
      bottomGlow.style.opacity = current < maxScroll - 4 ? "1" : "0";
    };

    scroller.addEventListener("scroll", updateGlow);
    updateGlow();
  });
};

const initBlogViewer = () => {
  if (!blogViewer || blogButtons.length === 0) return;
  blogButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.blogTarget;
      const content = document.querySelector(`[data-blog-content="${target}"]`);
      if (!content) return;
      blogViewer.innerHTML = content.innerHTML;
    });
  });
};

document.addEventListener("keydown", () => {
  if (!bootComplete) {
    skipBoot();
  }
});

document.addEventListener("click", (event) => {
  if (!bootComplete) {
    const target = event.target;
    if (target && bootScreen && bootScreen.contains(target)) {
      skipBoot();
    }
  }
});

const initFullscreen = () => {
  if (!fullscreenToggle) return;
  const updateIcon = () => {
    const icon = fullscreenToggle.querySelector("svg");
    const isFull = Boolean(document.fullscreenElement);
    if (icon) {
      icon.replaceWith(window.lucide.createElement(isFull ? "minimize-2" : "maximize-2"));
    }
    fullscreenToggle.dataset.tooltip = isFull ? "Exit Fullscreen" : "Fullscreen";
  };

  fullscreenToggle.addEventListener("click", async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await document.documentElement.requestFullscreen();
    }
    updateIcon();
  });

  document.addEventListener("fullscreenchange", updateIcon);
};

const parseThoughts = () => {
  if (!thoughtsJson) return [];
  try {
    return JSON.parse(thoughtsJson.textContent || "[]");
  } catch (_) {
    return [];
  }
};

const initCalendar = () => {
  if (!calendarRoot || !calendarGrid || !calendarMonth) return;
  const thoughts = parseThoughts();
  const thoughtsByDate = thoughts.reduce((acc, entry) => {
    if (!acc[entry.date]) acc[entry.date] = [];
    acc[entry.date].push(entry);
    return acc;
  }, {});

  const today = new Date();
  let viewDate = new Date();
  const stored = localStorage.getItem("osCalendarSelected");
  let selectedDate = stored ? new Date(stored) : null;

  const formatKey = (date) => date.toISOString().slice(0, 10);

  const renderThoughts = (dateKey) => {
    if (!calendarThoughts || !calendarSelected) return;
    calendarSelected.textContent = dateKey ? `Thoughts for ${dateKey}` : "Select a date to view thoughts.";
    const entries = dateKey ? (thoughtsByDate[dateKey] || []) : [];
    if (entries.length === 0) {
      calendarThoughts.innerHTML = "<p>No thoughts for this date.</p>";
      return;
    }
    calendarThoughts.innerHTML = entries
      .map((entry) => `
        <article class="os-thought">
          <h3>${entry.title || "Thought"}</h3>
          ${entry.content}
        </article>
      `)
      .join("");
  };

  const renderCalendar = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDay = firstDay.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const monthLabel = firstDay.toLocaleDateString([], { month: "long", year: "numeric" });
    calendarMonth.textContent = monthLabel;

    const weekdayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const cells = weekdayNames.map((day) => `<div class="os-calendar-weekday">${day}</div>`);

    for (let i = 0; i < startDay; i += 1) {
      cells.push("<div class=\"os-calendar-cell is-empty\"></div>");
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = new Date(year, month, day);
      const key = formatKey(date);
      const isToday = key === formatKey(today);
      const isSelected = selectedDate && key === formatKey(selectedDate);
      const hasThoughts = Boolean(thoughtsByDate[key]);
      cells.push(`
        <button class="os-calendar-cell${isToday ? " is-today" : ""}${isSelected ? " is-selected" : ""}${hasThoughts ? " has-thoughts" : ""}" type="button" data-date="${key}">
          ${day}
        </button>
      `);
    }

    calendarGrid.innerHTML = cells.join("");
  };

  const selectDate = (key) => {
    selectedDate = key ? new Date(`${key}T00:00:00`) : null;
    if (key) {
      localStorage.setItem("osCalendarSelected", key);
    }
    renderCalendar();
    renderThoughts(key);
  };

  calendarGrid.addEventListener("click", (event) => {
    const target = event.target.closest("[data-date]");
    if (!target) return;
    selectDate(target.dataset.date);
    if (canAnimate) {
      window.anime({
        targets: target,
        scale: [0.9, 1],
        duration: 140,
        easing: "easeOutBack"
      });
    }
  });

  calendarPrev?.addEventListener("click", () => {
    viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1);
    if (canAnimate) {
      window.anime({
        targets: calendarGrid,
        opacity: [1, 0],
        translateX: [0, 20],
        duration: 120,
        easing: "easeInQuad",
        complete: () => {
          renderCalendar();
          window.anime({
            targets: calendarGrid,
            opacity: [0, 1],
            translateX: [-20, 0],
            duration: 160,
            easing: "easeOutCubic"
          });
        }
      });
    } else {
      renderCalendar();
    }
  });

  calendarNext?.addEventListener("click", () => {
    viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1);
    if (canAnimate) {
      window.anime({
        targets: calendarGrid,
        opacity: [1, 0],
        translateX: [0, -20],
        duration: 120,
        easing: "easeInQuad",
        complete: () => {
          renderCalendar();
          window.anime({
            targets: calendarGrid,
            opacity: [0, 1],
            translateX: [20, 0],
            duration: 160,
            easing: "easeOutCubic"
          });
        }
      });
    } else {
      renderCalendar();
    }
  });

  renderCalendar();
  if (selectedDate) {
    const key = formatKey(selectedDate);
    renderThoughts(key);
  }
};

updateClock();
setInterval(updateClock, 1000);
updateWeather();
setInterval(updateWeather, 1000 * 60 * 15);
runLogin();
initWindows();
initTaskbar();
initBlogViewer();
initFullscreen();
initCalendar();
initStartMenu();
initPhotos();
initScrollGlow();

if (canAnimate) {
  document.querySelectorAll(".taskbar-app").forEach((button) => {
    button.addEventListener("mouseenter", () => {
      window.anime({
        targets: button,
        scale: 1.08,
        duration: 140,
        easing: "easeOutCubic"
      });
    });
    button.addEventListener("mouseleave", () => {
      window.anime({
        targets: button,
        scale: 1,
        duration: 140,
        easing: "easeOutCubic"
      });
    });
  });
}
