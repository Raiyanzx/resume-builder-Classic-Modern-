# Resume Builder

A resume/CV builder web app. Fill in a form, see your resume update live, switch
between two layouts (Classic and Modern), upload a photo, and export to PDF.

## What's inside

- `src/App.jsx` — the whole app: the form, the two resume templates, and the
  live preview logic
- `src/main.jsx` — React entry point
- `src/index.css` — Tailwind CSS setup
- Vite for the dev server / build, Tailwind for styling, `lucide-react` for icons

## Run it locally

You need [Node.js](https://nodejs.org) (v18 or newer) installed. Then, in this folder:

```bash
npm install
npm run dev
```

This starts a local dev server (usually at `http://localhost:5173`). Open that
in your browser — the app hot-reloads as you edit code.

## Build for production

```bash
npm run build
```

This creates a `dist/` folder with the finished, optimized app — plain HTML/CSS/JS
that you can host anywhere.

To double-check the production build locally:

```bash
npm run preview
```

## Deploy it (so it's live on the internet)

The easiest options, all free for a project like this:

### Option A: Vercel
1. Push this folder to a GitHub repo.
2. Go to [vercel.com](https://vercel.com), sign in with GitHub, click "New Project," pick your repo.
3. Vercel auto-detects Vite — just click Deploy.

### Option B: Netlify
1. Push this folder to a GitHub repo (or drag-and-drop the `dist/` folder after running `npm run build` at [app.netlify.com/drop](https://app.netlify.com/drop)).
2. If using GitHub: build command `npm run build`, publish directory `dist`.

### Option C: GitHub Pages
1. `npm run build`
2. Push the contents of `dist/` to a `gh-pages` branch (or use the `gh-pages` npm package to automate this).
3. Enable GitHub Pages on that branch in your repo settings.

## Customizing

- **Templates**: `ClassicTemplate` and `ModernTemplate` in `src/App.jsx` control
  what the two resume layouts look like. Edit the JSX/Tailwind classes there.
- **Form fields**: The form panel (left side) is built from `Section`, `Field`,
  `TextAreaField`, and `RepeatingBlock` components — add a new `Field` inside
  a `Section` to add a new input.
- **Default/sample data**: `initialData` at the top of `App.jsx` is what the
  form is pre-filled with. Set fields to empty strings if you want a blank
  starting form instead.
- **Colors/fonts**: Tailwind utility classes throughout — swap `bg-slate-700`,
  `font-serif`, etc. to restyle.

## Notes

- Photos are stored as base64 in the browser's memory (not saved to disk or a
  server) — nothing is uploaded anywhere; it's all client-side.
- "Download / Print" opens a print-formatted version in a new tab; use your
  browser's "Save as PDF" option in the print dialog to get a PDF file.
- There's no backend/database — all your data lives only in the browser tab
  and is lost on refresh. If you want to add persistence (e.g. save/load a
  resume later), that would need `localStorage` or a small backend added.
