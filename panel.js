const barApps = document.getElementById("bar-apps");
const stage = document.getElementById("stage");
const hint = document.getElementById("hint");
const manage = document.getElementById("manage");

const btnManage = document.getElementById("btn-manage");
const btnExternal = document.getElementById("btn-external");
const btnClose = document.getElementById("btn-close");

let APPS_NOW = [];
let current = null;
const frames = {};
const buttons = {};

// Inicializar iconos de la barra de acciones (una sola vez)
if (btnManage) btnManage.innerHTML = UI_ICONS.settings(17);
if (btnExternal) btnExternal.innerHTML = UI_ICONS.external(16);
if (btnClose) btnClose.innerHTML = UI_ICONS.close(16);

btnManage.onclick = () => showManage();
btnExternal.onclick = () => {
  const app = APPS_NOW.find(a => a.id === current) || APPS_NOW[0];
  if (app) chrome.tabs.create({ url: app.url });
};
btnClose.onclick = async () => {
  try {
    const w = await chrome.windows.getCurrent();
    await chrome.sidePanel.close({ windowId: w.id });
  } catch (e) {
    window.close();
  }
};

// Renderizar pantalla de bienvenida y dashboard con DocumentFragment para 0 reflow
function renderWelcome() {
  if (!hint) return;
  hint.innerHTML = `
    <div class="welcome-badge">
      ${UI_ICONS.sparkles(14)}
      <span>Panel Lateral Apps</span>
    </div>
    <h1 class="welcome-title">¿Qué deseas abrir hoy?</h1>
    <p class="welcome-desc">Accede a tus aplicaciones y mensajería en cualquier momento sin cambiar de pestaña.</p>
    
    <div class="quick-grid-title">Tus Aplicaciones</div>
    <div class="quick-grid" id="quick-grid"></div>

    <div class="tips-box">
      <div>💡 <b>Consejo:</b> Pasa el cursor por el borde izquierdo en cualquier sitio web para desplegar la barra lateral flotante.</div>
      <div style="margin-top: 6px;">⌨️ <b>Atajo de teclado:</b> Presiona <kbd>Alt</kbd> + <kbd>Shift</kbd> + <kbd>W</kbd> para cerrar el panel.</div>
    </div>
  `;

  const grid = hint.querySelector("#quick-grid");
  if (grid) {
    const frag = document.createDocumentFragment();
    for (const a of APPS_NOW) {
      const card = document.createElement("div");
      card.className = "quick-card";
      let domain = a.url;
      try { domain = new URL(a.url).hostname.replace(/^www\./, ""); } catch (e) {}
      card.innerHTML = `
        <div class="quick-icon" style="background:${a.color || '#7c3aed'}">
          ${getAppIconHtml(a, 18)}
        </div>
        <div class="quick-info">
          <b>${a.name}</b>
          <small>${domain}</small>
        </div>
      `;
      card.onclick = () => show(a.id);
      frag.appendChild(card);
    }
    grid.appendChild(frag);
  }
}

// Mostrar una aplicación en el panel (activación ultra-rápida por GPU)
function show(id) {
  const app = APPS_NOW.find(a => a.id === id);
  if (!app) return;
  hideManage();

  if (hint && hint.style.display !== "none") {
    hint.style.display = "none";
  }

  if (app.popup) {
    chrome.runtime.sendMessage({ type: "popup", app });
    return;
  }

  if (!frames[id]) {
    const f = document.createElement("iframe");
    f.referrerPolicy = "no-referrer";
    f.src = app.url;
    f.loading = "lazy";
    f.allow = "clipboard-write; microphone; camera; autoplay; notifications; picture-in-picture";
    stage.insertBefore(f, manage);
    frames[id] = f;
  }

  current = id;
  for (const k in frames) {
    const isOn = k === id;
    frames[k].classList.toggle("on", isOn);
    buttons[k]?.classList.toggle("on", isOn);
  }
  chrome.storage.local.set({ last: id });
}

// Renderizar pestañas de aplicaciones en la barra superior con DocumentFragment
function renderBar() {
  barApps.textContent = "";
  for (const k in buttons) delete buttons[k];

  const frag = document.createDocumentFragment();
  for (const a of APPS_NOW) {
    const b = document.createElement("button");
    b.className = "app-tab" + (a.id === current ? " on" : "");
    b.innerHTML = getAppIconHtml(a, 20);
    b.title = a.name;
    b.onclick = () => show(a.id);
    frag.appendChild(b);
    buttons[a.id] = b;
  }
  barApps.appendChild(frag);
}

// ---------- Gestionar Apps ----------
const saveApps = (apps) => chrome.storage.local.set({ apps });
const hideManage = () => { manage.style.display = "none"; };
function showManage() {
  manage.style.display = "block";
  renderManage();
}

function renderManage(msg = "") {
  manage.textContent = "";

  // Cabecera del modal
  const header = document.createElement("div");
  header.className = "manage-header";
  header.innerHTML = `
    <h2>${UI_ICONS.settings(20)} Gestionar Aplicaciones</h2>
    <button class="manage-close" id="mc-close" title="Cerrar">${UI_ICONS.close(16)}</button>
  `;
  header.querySelector("#mc-close").onclick = hideManage;
  manage.appendChild(header);

  // Lista de apps activas
  const title1 = document.createElement("div");
  title1.className = "sec-title";
  title1.textContent = "Apps Instaladas (" + APPS_NOW.length + ")";
  manage.appendChild(title1);

  const list = document.createElement("div");
  list.className = "apps-list";

  const frag = document.createDocumentFragment();
  for (const a of APPS_NOW) {
    const r = document.createElement("div");
    r.className = "row";
    let domain = a.url;
    try { domain = new URL(a.url).hostname.replace(/^www\./, ""); } catch (e) {}

    r.innerHTML = `
      <div class="ic" style="background:${a.color || '#7c3aed'}">
        ${getAppIconHtml(a, 18)}
      </div>
      <div class="nm">
        <b>
          ${a.name}
          ${a.popup ? '<span class="popup-badge">Ventana</span>' : ''}
        </b>
        <small>${domain}</small>
      </div>
      <button class="del-btn" title="Quitar app">${UI_ICONS.trash(15)}</button>
    `;

    r.querySelector(".del-btn").onclick = () => {
      saveApps(APPS_NOW.filter(x => x.id !== a.id));
    };
    frag.appendChild(r);
  }
  list.appendChild(frag);
  manage.appendChild(list);

  // Sección Agregar App
  const title2 = document.createElement("div");
  title2.className = "sec-title";
  title2.textContent = "Agregar Nueva App";
  manage.appendChild(title2);

  // Presets sugeridos
  const presetsBox = document.createElement("div");
  presetsBox.innerHTML = `
    <div class="presets-label">Sugerencias populares (1 clic para rellenar):</div>
    <div class="presets-row" id="p-row"></div>
  `;
  const pRow = presetsBox.querySelector("#p-row");
  const pFrag = document.createDocumentFragment();
  for (const p of POPULAR_PRESETS) {
    const pill = document.createElement("button");
    pill.type = "button";
    pill.className = "preset-pill";
    pill.innerHTML = `${getAppIconHtml(p, 14)} <span>${p.name}</span>`;
    pill.onclick = () => {
      const form = manage.querySelector("form");
      if (!form) return;
      form.querySelector("#n").value = p.name;
      form.querySelector("#u").value = p.url;
      form.querySelector("#i").value = p.icon;
      form.querySelector("#c").value = p.color;
      form.querySelector("#n").focus();
    };
    pFrag.appendChild(pill);
  }
  pRow.appendChild(pFrag);
  manage.appendChild(presetsBox);

  // Formulario de agregar
  const f = document.createElement("form");
  f.innerHTML = `
    <div class="input-group">
      <span class="input-label">Nombre</span>
      <input type="text" id="n" placeholder="Ej. WhatsApp, YouTube, ChatGPT" required>
    </div>

    <div class="input-group">
      <span class="input-label">Dirección Web (URL)</span>
      <input type="text" id="u" placeholder="Ej. https://web.whatsapp.com/" required>
    </div>

    <div class="r2">
      <div class="input-group">
        <span class="input-label">Icono (código/emoji)</span>
        <input type="text" id="i" placeholder="wa, 🌐, etc." maxlength="10">
      </div>
      <div class="input-group">
        <span class="input-label">Color de marca</span>
        <div class="color-picker-wrap">
          <input type="color" id="c" value="#7c3aed">
          <span style="font-size:11px;color:var(--text-muted)">Color del botón</span>
        </div>
      </div>
    </div>

    <label class="switch-row">
      <div class="switch">
        <input type="checkbox" id="p">
        <span class="slider"></span>
      </div>
      <span>Abrir en ventana emergente (si el sitio bloquea visualización en panel)</span>
    </label>

    <div id="msg">${msg}</div>
    <button class="btn-submit" type="submit">
      ${UI_ICONS.plus(16)}
      <span>Agregar a mis apps</span>
    </button>
  `;

  f.onsubmit = (e) => {
    e.preventDefault();
    const name = f.querySelector("#n").value.trim();
    let url = f.querySelector("#u").value.trim();
    if (!/^https?:\/\//i.test(url)) url = "https://" + url;

    try {
      new URL(url);
    } catch (err) {
      return renderManage("La dirección URL introducida no es válida.");
    }

    saveApps([...APPS_NOW, {
      id: "u" + Date.now(),
      name,
      url,
      icon: f.querySelector("#i").value.trim() || "globe",
      color: f.querySelector("#c").value,
      popup: f.querySelector("#p").checked
    }]);
  };
  manage.appendChild(f);

  // Botones de pie
  const actions = document.createElement("div");
  actions.className = "manage-actions";
  actions.innerHTML = `
    <button class="ghost-btn" id="m-reset">${UI_ICONS.refresh(15)} Restaurar originales</button>
    <button class="ghost-btn primary" id="m-done">${UI_ICONS.check(15)} Listo</button>
  `;
  actions.querySelector("#m-reset").onclick = () => saveApps(DEFAULT_APPS);
  actions.querySelector("#m-done").onclick = hideManage;
  manage.appendChild(actions);
}

// ---------- Arranque y sincronización ----------
function applyApps(apps) {
  APPS_NOW = apps;
  for (const id in frames) {
    if (!APPS_NOW.some(a => a.id === id)) {
      frames[id].remove();
      delete frames[id];
      if (current === id) current = null;
    }
  }
  renderBar();
  renderWelcome();
  if (manage.style.display === "block") renderManage();
}

chrome.storage.onChanged.addListener((c, area) => {
  if (area !== "local") return;
  if (c.apps) applyApps(c.apps.newValue || []);
  if (c.manage) showManage();
  if (c.last && c.last.newValue && c.last.newValue !== current) show(c.last.newValue);
});

(async () => {
  const apps = await loadApps();
  applyApps(apps);

  const { last, manage: m } = await chrome.storage.local.get(["last", "manage"]);
  const a = APPS_NOW.find(x => x.id === last);
  if (a && !a.popup) {
    show(last);
  } else {
    if (hint) hint.style.display = "flex";
  }

  if (m && Date.now() - m < 3000) {
    showManage();
  }
})();
