(() => {
  if (window.top !== window || document.getElementById("pla-host")) return;
  const W = 54;
  const host = document.createElement("div");
  host.id = "pla-host";
  host.style.cssText = "all:initial;position:fixed;top:0;left:0;height:100vh;z-index:2147483647;pointer-events:none;";
  const root = host.attachShadow({ mode: "closed" });

  root.innerHTML = `
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    :host {
      contain: layout style paint;
    }
    .zone {
      position: fixed;
      top: 0;
      left: 0;
      width: 10px;
      height: 100vh;
      z-index: 10;
      pointer-events: auto;
    }
    .bar {
      position: fixed;
      top: 0;
      left: 0;
      height: 100vh;
      width: ${W}px;
      box-sizing: border-box;
      padding: 14px 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      background: rgba(18, 14, 28, 0.94);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      border-right: 1px solid rgba(255, 255, 255, 0.08);
      box-shadow: 4px 0 24px rgba(0, 0, 0, 0.38);
      transform: translate3d(-100%, 0, 0);
      will-change: transform;
      backface-visibility: hidden;
      transition: transform 0.24s cubic-bezier(0.16, 1, 0.3, 1);
      user-select: none;
      z-index: 20;
      pointer-events: auto;
      contain: content;
    }
    .bar.show {
      transform: translate3d(0, 0, 0);
    }
    .app-btn {
      width: 38px;
      height: 38px;
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 12px;
      cursor: pointer;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      background-clip: padding-box;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.28);
      transform: translateZ(0);
      transition: transform 0.18s cubic-bezier(0.16, 1, 0.3, 1),
                  box-shadow 0.18s ease,
                  border-color 0.18s ease;
      contain: layout style;
    }
    .app-btn svg, .app-btn .emoji-icon {
      filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.35));
      transition: transform 0.18s cubic-bezier(0.16, 1, 0.3, 1);
      pointer-events: none;
    }
    .app-btn:hover {
      transform: translateY(-2px) scale(1.08) translateZ(0);
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.4), 0 0 14px rgba(124, 58, 237, 0.45);
      border-color: rgba(255, 255, 255, 0.35);
    }
    .app-btn:hover svg {
      transform: scale(1.1);
    }
    .app-btn:active {
      transform: translateY(1px) scale(0.93) translateZ(0);
      transition-duration: 0.06s;
    }

    .divider {
      width: 24px;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.16), transparent);
      margin: 3px 0;
      flex-shrink: 0;
    }

    .tool-btn {
      width: 36px;
      height: 36px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 11px;
      cursor: pointer;
      color: rgba(255, 255, 255, 0.85);
      background: rgba(255, 255, 255, 0.05);
      display: flex;
      align-items: center;
      justify-content: center;
      transform: translateZ(0);
      transition: transform 0.18s cubic-bezier(0.16, 1, 0.3, 1),
                  background 0.18s ease,
                  color 0.18s ease,
                  border-color 0.18s ease,
                  box-shadow 0.18s ease;
      position: relative;
    }
    .tool-btn:hover {
      background: rgba(255, 255, 255, 0.14);
      color: #fff;
      border-color: rgba(255, 255, 255, 0.2);
      transform: translateY(-1px) scale(1.05) translateZ(0);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.28);
    }
    .tool-btn:active {
      transform: scale(0.92) translateZ(0);
      transition-duration: 0.06s;
    }
    .tool-btn.add:hover {
      background: rgba(124, 58, 237, 0.22);
      border-color: rgba(168, 85, 247, 0.45);
      color: #c4b5fd;
      box-shadow: 0 0 12px rgba(124, 58, 237, 0.35);
    }
    .tool-btn.pin.on {
      background: rgba(124, 58, 237, 0.28);
      border-color: #a855f7;
      color: #e9d5ff;
      box-shadow: 0 0 14px rgba(124, 58, 237, 0.55);
      transform: scale(1.04) translateZ(0);
    }
    .tool-btn.pin.on::after {
      content: '';
      position: absolute;
      bottom: 3px;
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: #c084fc;
      box-shadow: 0 0 5px #c084fc;
    }
    .tool-btn.close:hover {
      background: rgba(239, 68, 68, 0.18);
      border-color: rgba(239, 68, 68, 0.4);
      color: #fca5a5;
      box-shadow: 0 0 12px rgba(239, 68, 68, 0.3);
    }

    .tip {
      position: fixed;
      left: ${W + 8}px;
      padding: 5px 11px;
      border-radius: 8px;
      background: rgba(18, 14, 28, 0.96);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      color: #f1f5f9;
      font: 500 12px/1.3 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      border: 1px solid rgba(255, 255, 255, 0.12);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
      pointer-events: none;
      opacity: 0;
      transform: translate3d(-6px, 0, 0) scale(0.96);
      transition: opacity 0.15s cubic-bezier(0.16, 1, 0.3, 1),
                  transform 0.15s cubic-bezier(0.16, 1, 0.3, 1);
      white-space: nowrap;
      max-width: 280px;
      z-index: 2147483647;
      will-change: opacity, transform;
    }
    .tip.show {
      opacity: 1;
      transform: translate3d(0, 0, 0) scale(1);
    }
    .tip.err {
      background: rgba(127, 29, 29, 0.96);
      border-color: rgba(239, 68, 68, 0.4);
      color: #fecaca;
    }
  </style>
  <div class="zone"></div>
  <div class="bar"></div>
  <div class="tip"></div>`;

  const zone = root.querySelector(".zone");
  const bar = root.querySelector(".bar");
  const tip = root.querySelector(".tip");

  // Estilo de desplazamiento del documento (sólo se aplica cuando está anclada/fijada)
  let pushStyle = null;
  const ensurePushStyle = () => {
    if (!pushStyle) {
      pushStyle = document.createElement("style");
      pushStyle.textContent = `html.pla-pinned { margin-left: ${W}px !important; }`;
      document.documentElement.appendChild(pushStyle);
    }
  };

  // Optimización de desplazamiento de elementos fixed (sólo escanea candidatos principales, no todo el DOM)
  const moved = new Map();
  function shiftFixed(on) {
    if (on) {
      if (moved.size || !document.body) return;
      // En vez de querySelectorAll("*") (10,000 elementos), sólo revisamos hijos directos y cabeceras
      const candidates = document.querySelectorAll("header, nav, [class*='fixed'], [class*='sticky'], [class*='header'], [class*='navbar'], [id*='header'], [id*='navbar'], body > *");
      for (let i = 0; i < candidates.length; i++) {
        const el = candidates[i];
        if (el === host) continue;
        const cs = getComputedStyle(el);
        if (cs.position !== "fixed") continue;
        const left = parseFloat(cs.left);
        if (!(left >= -1 && left <= 1)) continue;
        moved.set(el, { left: el.style.getPropertyValue("left"), width: el.style.getPropertyValue("width") });
        el.style.setProperty("left", W + "px", "important");
        if (parseFloat(cs.width) >= innerWidth - 2) {
          el.style.setProperty("width", `calc(100% - ${W}px)`, "important");
        }
      }
    } else {
      if (!moved.size) return;
      for (const [el, o] of moved) {
        o.left ? el.style.setProperty("left", o.left) : el.style.removeProperty("left");
        o.width ? el.style.setProperty("width", o.width) : el.style.removeProperty("width");
      }
      moved.clear();
    }
  }

  let pinned = false;
  let hoverTimer = null;
  let closeTimer = null;

  const setOpen = (on) => {
    bar.classList.toggle("show", on);
    if (!on) tip.classList.remove("show");
  };

  const applyPinState = (isPinned) => {
    ensurePushStyle();
    document.documentElement.classList.toggle("pla-pinned", isPinned);
    requestAnimationFrame(() => shiftFixed(isPinned));
  };

  // Pequeña tolerancia de 40ms para evitar falsos disparos por roces accidentales
  const onMouseEnter = () => {
    clearTimeout(closeTimer);
    if (hoverTimer) return;
    hoverTimer = setTimeout(() => {
      setOpen(true);
      hoverTimer = null;
    }, 40);
  };

  const onMouseLeave = () => {
    clearTimeout(hoverTimer);
    hoverTimer = null;
    if (pinned) return;
    clearTimeout(closeTimer);
    closeTimer = setTimeout(() => setOpen(false), 240);
  };

  const say = (text, err) => {
    tip.textContent = text;
    tip.classList.toggle("err", !!err);
    tip.classList.add("show");
    if (err) setTimeout(() => tip.classList.remove("show", "err"), 4000);
  };

  const send = (msg) => new Promise((res) => {
    try {
      chrome.runtime.sendMessage(msg, (r) => {
        const e = chrome.runtime.lastError;
        res(e ? { error: e.message } : (r || {}));
      });
    } catch (e) {
      res({ error: "Recarga esta página: la extensión se actualizó." });
    }
  });

  const hint = (btn, text) => {
    btn.addEventListener("mouseenter", () => {
      say(text);
      const rect = btn.getBoundingClientRect();
      tip.style.top = (rect.top + (rect.height / 2) - 13) + "px";
    }, { passive: true });
    btn.addEventListener("mouseleave", () => tip.classList.remove("show"), { passive: true });
  };

  const list = document.createElement("div");
  list.style.cssText = "display:flex;flex-direction:column;gap:8px;align-items:center;overflow-y:auto;overflow-x:hidden;max-height:calc(100vh - 170px);scrollbar-width:none;width:100%;padding:2px 0;";
  bar.appendChild(list);

  function render(apps) {
    list.textContent = "";
    for (const a of apps) {
      const b = document.createElement("button");
      b.className = "app-btn";
      b.style.background = a.color || "#7c3aed";
      b.innerHTML = getAppIconHtml(a, 20);
      hint(b, a.name);
      b.onclick = async () => {
        const r = await send({ type: "open", app: a });
        if (r.error) {
          const rect = b.getBoundingClientRect();
          tip.style.top = (rect.top + (rect.height / 2) - 13) + "px";
          say("No se pudo abrir: " + r.error, true);
        }
      };
      list.appendChild(b);
    }
  }

  loadApps().then(render);
  try {
    chrome.storage.onChanged.addListener((ch, area) => {
      if (area === "local" && ch.apps) render(ch.apps.newValue || []);
    });
  } catch (e) {}

  const d1 = document.createElement("div");
  d1.className = "divider";
  bar.appendChild(d1);

  const add = document.createElement("button");
  add.className = "tool-btn add";
  add.innerHTML = UI_ICONS.plus(18);
  hint(add, "Gestionar aplicaciones");
  add.onclick = async () => {
    const r = await send({ type: "manage" });
    if (r.error) {
      const rect = add.getBoundingClientRect();
      tip.style.top = (rect.top + (rect.height / 2) - 13) + "px";
      say("No se pudo abrir: " + r.error, true);
    }
  };
  bar.appendChild(add);

  const sp = document.createElement("div");
  sp.style.flex = "1";
  bar.appendChild(sp);

  const d2 = document.createElement("div");
  d2.className = "divider";
  bar.appendChild(d2);

  const pin = document.createElement("button");
  pin.className = "tool-btn pin";
  pin.innerHTML = UI_ICONS.pin(17);
  hint(pin, "Mantener barra fijada");
  pin.onclick = () => {
    pinned = !pinned;
    pin.classList.toggle("on", pinned);
    try { chrome.storage.local.set({ pinned }); } catch (e) {}
    applyPinState(pinned);
    setOpen(pinned);
  };
  bar.appendChild(pin);

  const x = document.createElement("button");
  x.className = "tool-btn close";
  x.innerHTML = UI_ICONS.close(16);
  hint(x, "Cerrar panel lateral");
  x.onclick = () => send({ type: "close" });
  bar.appendChild(x);

  zone.addEventListener("mouseenter", onMouseEnter, { passive: true });
  bar.addEventListener("mouseenter", onMouseEnter, { passive: true });
  bar.addEventListener("mouseleave", onMouseLeave, { passive: true });
  zone.addEventListener("mouseleave", onMouseLeave, { passive: true });
  document.documentElement.appendChild(host);

  try {
    chrome.storage.local.get("pinned").then(({ pinned: p }) => {
      if (p) {
        pinned = true;
        pin.classList.add("on");
        applyPinState(true);
        setOpen(true);
      }
    });
  } catch (e) {}
})();
