# Siduduzo Ndlovu portfolio

A responsive portfolio built from Siduduzo's supplied CV. A fast full-screen 0–100% welcome opens into a burst-and-shutter reveal of the interactive project screen, followed by a prominent Durban University of Technology education chapter, factual project details, biography, toolkit and contact.

Install dependencies with `pnpm install`, run `pnpm dev` for local development, and use `pnpm build` to create the deployable `dist/` folder. The HTML content remains static, while Vite bundles the small React Spring hero component.

Motion uses locally bundled GSAP and ScrollTrigger for the skippable full-screen percentage reveal, blue burst, split-screen transition, hero entrance and scroll progression; React Spring for switching and tilting the foreground interface concepts; Three.js for the spatial projection planes behind them; Anime.js for project-selector feedback; and Trig.js for scroll-position-driven biography and contact artwork. The WebGL scene pauses offscreen or when the tab is hidden, caps pixel density, and becomes a still frame for visitors who prefer reduced motion. The intro can be skipped by button or Escape and does not run for reduced-motion visitors. The stage remains readable if WebGL is unavailable. Do not open `index.html` directly as a file: use the local Vite URL printed by `pnpm dev`.

The stage's project previews are illustrative concepts, not screenshots of the linked applications. Replace them with real screenshots if available. Edit contact and project details in `index.html`; styles are in `styles.css`; project switching and mobile navigation are in `script.js`; preview rendering is in `src/spring-hero.jsx`.
