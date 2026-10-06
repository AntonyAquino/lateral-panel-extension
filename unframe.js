// Corre dentro de web.whatsapp.com (también en el iframe) y hace que la página crea que es la ventana principal.
(() => {
  if (window.top === window) return;
  const def = (k, v) => { try { Object.defineProperty(window, k, { get: () => v, configurable: true }); } catch (e) {} };
  def("top", window);
  def("parent", window);
  def("frameElement", null);
})();
