# 🧩 Lateral Panel Extension

> Un panel lateral flotante para Google Chrome que te permite acceder a WhatsApp, Instagram, TikTok, Discord, ChatGPT y más — sin salir de la página que estás viendo. Inspirado en el Speed Dial de Opera.

![Chrome](https://img.shields.io/badge/Chrome-MV3-4285F4?logo=googlechrome&logoColor=white&style=flat-square)
![Version](https://img.shields.io/badge/version-1.6-7c3aed?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-22c55e?style=flat-square)

---

## ✨ Características

- **Panel lateral nativo** integrado en la Side Panel API de Chrome (igual que Opera)
- **Barra flotante en cualquier web** — pasa el cursor por el borde izquierdo para desplegarla
- **Iconos SVG vectoriales oficiales** de cada app (WhatsApp, Instagram, TikTok, Twitch, ChatGPT, Telegram, Discord, YouTube, Spotify, X, GitHub, Reddit…)
- **Sin emojis, sin imágenes**: todo en código vectorial puro, nítido a cualquier resolución
- **Animaciones GPU** a 60 / 120 FPS sin tirones, usando `transform` + `opacity` en compositor
- **Glassmorphism** — barra traslúcida con desenfoque de cristal
- **Dashboard de inicio** con accesos rápidos a todas tus apps
- **Gestión de apps** con presets populares para agregar de 1 clic
- **Anclado (Pin 📌)** — mantén la barra siempre visible y empuja el contenido de la página
- **Apps en ventana emergente** — para sitios que no se pueden embeber en iframe
- **Soporte para iframes** con reglas de cabecera declarativas (X-Frame-Options, CSP)
- **Atajo de teclado** `Alt + Shift + W` para cerrar el panel
- **Ligero**: solo ~66 KB en total, 0 dependencias externas

---

## 📸 Vista previa

| Panel Lateral | Barra Flotante | Gestión de Apps |
|:-:|:-:|:-:|
| Panel con apps tipo Opera | Barra que se despliega al hover | Modal para añadir y eliminar apps |

---

## 🚀 Instalación Manual (Chrome sin publicar)

> No requiere la Chrome Web Store. Solo necesitas Google Chrome actualizado.

1. **Descarga o clona** este repositorio:
   ```bash
   git clone https://github.com/Stevenn/lateral-panel-extension.git
   ```

2. Abre Chrome y ve a:
   ```
   chrome://extensions/
   ```

3. Activa el **Modo desarrollador** (esquina superior derecha)

4. Haz clic en **"Cargar descomprimida"** y selecciona la carpeta del proyecto

5. Haz clic en el icono de la extensión en la barra de herramientas para **abrir el panel lateral**

---

## 📂 Estructura del Proyecto

```
lateral-panel-extension/
├── manifest.json          # Configuración de la extensión (MV3)
├── panel.html             # UI del panel lateral (Side Panel)
├── panel.js               # Lógica del panel: tabs, gestión de apps, dashboard
├── apps.js                # Iconos SVG, DEFAULT_APPS, presets populares
├── content.js             # Barra flotante inyectada en todas las páginas web
├── background.js          # Service Worker: reglas de red, mensajes, popups
├── rules.json             # Reglas DNR: elimina X-Frame-Options en apps por defecto
├── rules2.json            # Reglas DNR adicionales (WhatsApp sec-fetch-*)
└── unframe.js             # Elimina bloqueos de frame en web.whatsapp.com
```

---

## 🎨 Apps incluidas por defecto

| App | Color | Abre como |
|-----|-------|-----------|
| WhatsApp | `#25d366` | iframe |
| Instagram | `#e1306c` | iframe |
| TikTok | `#010101` | iframe |
| Twitch | `#9146ff` | iframe |
| ChatGPT | `#10a37f` | iframe |
| Telegram | `#229ed9` | iframe |
| Discord | `#5865f2` | iframe |

Puedes agregar cualquier URL personalizada desde el panel (incluyendo Google Drive, Notion, YouTube, Spotify, etc.).

---

## 🛠️ Agregar una App Personalizada

1. Abre el panel lateral y haz clic en ⚙️
2. Escribe el nombre y la URL de la web
3. Elige un icono (código como `yt`, `sp` o un emoji) y un color
4. Si el sitio no carga en el iframe, activa **"Abrir en ventana emergente"**
5. Haz clic en **Agregar**

---

## ⚡ Rendimiento

| Métrica | Valor |
|---------|-------|
| Tamaño total de la extensión | ~66 KB |
| Dependencias externas | **0** |
| Frames por segundo (animaciones) | 60 / 120 FPS |
| Escaneo del DOM al activar el hover | **0 nodos** (panel flotante puro) |
| Escaneo al anclar (Pin) | ~20 candidatos |
| Tiempo de cambio entre apps | < 1 ms |

> Las transiciones usan exclusivamente `transform` y `opacity` procesadas por la GPU, sin layout recalculation ni paint del documento.

---

## 🔑 Permisos requeridos

| Permiso | Motivo |
|---------|--------|
| `sidePanel` | Abrir el panel lateral de Chrome |
| `storage` | Guardar tus apps y preferencias |
| `declarativeNetRequest` | Eliminar cabeceras que bloquean los iframes |
| `<all_urls>` | Inyectar la barra flotante y ajustar cabeceras en cualquier web |
| `tabs` | Abrir apps en nueva pestaña |
| `windows` | Crear ventanas emergentes para apps que no se pueden embeber |

---

## ⌨️ Atajos de Teclado

| Atajo | Acción |
|-------|--------|
| `Alt + Shift + W` | Cerrar el panel lateral |

---

## 🧰 Tecnologías

- **Chrome Extension Manifest V3**
- **Side Panel API** (Chrome 114+)
- **Declarative Net Request API** para reglas de headers
- **Shadow DOM** para aislar la barra flotante del CSS de cada página
- CSS **Glassmorphism** + **GPU Compositing**
- SVG brand icons (sin fuentes de iconos externas)
- Vanilla JS (sin frameworks)

---

## 📄 Licencia

MIT © 2026 [Stevenn](https://github.com/Stevenn)

---

## 🤝 Contribuciones

¡Son bienvenidas! Puedes abrir un Issue o PR para:
- Agregar iconos SVG de nuevas apps
- Mejorar la compatibilidad con sitios específicos
- Sugerir nuevas funciones

---

<div align="center">
  <sub>Hecho con ❤️ y sin dependencias externas</sub>
</div>
