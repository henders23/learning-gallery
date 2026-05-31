# Guidebook (Atlas magazine)

The visitor's-guide magazine shown in the `#intro` modal of `Learning Gallery.html`
(cover · editor's note · contents + floor plan · nine wing spreads · colophon).
It mounts as React and is opened/closed by `gallery/main.js` (press **G** in-world).

## Files

- `data.js` — magazine content → `window.GUIDE` (self-contained; does not depend
  on `gallery/data.js`).
- `patterns.jsx` / `atlas.jsx` / `mount.jsx` — **source**.
- `patterns.js` / `atlas.js` / `mount.js` — **generated**; these are what the HTML
  loads. React is loaded from CDN as a production build (no runtime Babel).

## Rebuilding after editing a `.jsx`

The `.js` files are precompiled so the page doesn't ship `@babel/standalone`.
After editing any `.jsx`, recompile with Babel's classic React preset:

```sh
npx babel patterns.jsx -o patterns.js --presets=@babel/preset-react
npx babel atlas.jsx    -o atlas.js    --presets=@babel/preset-react
npx babel mount.jsx    -o mount.js    --presets=@babel/preset-react
```

(Classic runtime — the components rely on the global `React` from the UMD build.)
