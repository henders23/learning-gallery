// mount.jsx — mounts the Atlas magazine into the #intro modal.
// Compiled to mount.js (see README.md). Open/close + pointer-lock are owned by
// gallery/main.js; this exposes window.Guidebook so main.js can gate the
// magazine's ← → paging to when the modal is actually open.
(function () {
  const magWrap = document.getElementById('magWrap');
  function rescale() {
    const PAD = 80; // breathing room
    const RESERVED_BOTTOM = 120; // hud + CTA strip
    const w = window.innerWidth - PAD;
    const h = window.innerHeight - RESERVED_BOTTOM;
    const s = Math.min(w / 780, h / 1124, 1);
    magWrap.style.transform = 'scale(' + s + ')';
  }
  window.addEventListener('resize', rescale);
  rescale();
  let keyboardEnabled = true; // modal starts open on load
  const root = ReactDOM.createRoot(document.getElementById('magazine-root'));
  function renderMag() {
    root.render(/*#__PURE__*/React.createElement(AtlasMagazine, {
      keyboardEnabled: keyboardEnabled
    }));
  }
  renderMag();
  window.Guidebook = {
    setKeyboard(on) {
      keyboardEnabled = !!on;
      renderMag();
    },
    rescale
  };
})();
