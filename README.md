# Family Feud — Present-style React App

Lightweight Family Feud / survey game implemented in React and Vite.

## Prerequisites

- Node.js (v16+ recommended; v18+ preferred)
- npm (bundled with Node) or `pnpm`/`yarn` if you prefer

## Install

From the project root (where `package.json` lives) run:

```bash
npm install
```

# Family Feud — Present-style React App

This repository contains a lightweight, present-style Family Feud / survey game built with React and Vite. The app supports selection and editing of surveys, reveal-style answers, strike handling, Fast Money rounds, and persistence of game state to the browser.

This README explains how to set up a development environment, run the app locally, build a production bundle, and troubleshoot common issues you may encounter while editing the code.

## Prerequisites

- Node.js (v16 or newer recommended; v18+ preferred). Verify your Node version with `node -v`.
- npm (bundled with Node). You can also use `yarn` or `pnpm` if you prefer — replace `npm` commands accordingly.

## Install dependencies

From the project root (where `package.json` lives) run:

```bash
npm install
```

This installs all dependencies required to run the dev server, build, and test scripts.

## Run the app (development)

Start the Vite dev server with:

```bash
npm run dev
```

When the server starts it prints a local URL (commonly `http://localhost:5173`) — open that in your browser to run the app. The dev server supports hot module replacement (HMR), so most UI changes will be reflected immediately.

If the server exits with an error (for example `Exit Code: 1`), copy the full terminal output and paste it here and I will help diagnose the specific cause.

## Build for production

Create an optimized production bundle:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Project layout (quick reference)

- `index.html` — app entry HTML for Vite
- `src/main.jsx` — React entry file
- `src/App.jsx` — main application state and routing
- `src/MainGame.jsx` — primary gameplay UI
- `src/SurveySelection.jsx` — survey selection UI
- `src/SurveysEditor.jsx` — in-app JSON editor for surveys
- `src/data/surveys.js` — default surveys shipped with the app
- `src/App.css` — global styles
- `public/` — static assets (images, sounds)

## Persistence and data

- The app persists game state (including edited surveys) to `localStorage` using the key `family-feud-game-v1`.
- To manually clear saved state, open your browser DevTools → Application → Local Storage and delete the `family-feud-game-v1` entry, or use the in-app reset control (Reset Game).

## Common development tasks & commands

- Install: `npm install`
- Dev server: `npm run dev`
- Build: `npm run build`
- Preview build: `npm run preview`

Optional helpful commands (if you have tooling configured):

- Run ESLint (if available): `npm run lint` or `npx eslint src --fix` — only run `--fix` when you are ready for automated style changes.
- Format code (Prettier): `npx prettier --write "src/**/*.{js,jsx,css}"` — only run if Prettier is installed/configured in the project.

If those scripts are not present in `package.json`, use Hints below.

## Troubleshooting — common errors and fixes

- Vite parse errors (e.g. `Unexpected token` or JSX parse errors):
	- These typically mean there is malformed JavaScript or JSX in a file (missing closing tag, stray backtick, or similar). The stack trace printed by Vite includes the file path and line number — open that file and carefully inspect the surrounding JSX.
	- A very common culprit is an unclosed JSX element or a stray JS expression in a component render. Fix the syntax and restart the dev server.

- Linter warnings like `Do not use empty rulesets` (CSS):
	- These occur when a CSS selector has an empty `{}` block. Open the CSS file (e.g. `src/App.css`) and remove or consolidate the empty rules.

- App runtime errors in the browser console:
	- Open DevTools → Console and read the error; it often includes the component and stack. Share the error message if you want help debugging.

Tips for debugging compiles locally:

1. Run `npm run dev` and let the server fail; copy the full terminal output.
2. Inspect the file/line referenced by the error. If it's a JSX parse error, look for unclosed tags or accidental stray characters.
3. Fix the file and save — Vite will typically recompile automatically.

If you want, I can also scan the repository for known patterns that cause these errors and propose or apply minimal fixes.

## Deployment suggestions

This app builds to static assets that can be served from most static file hosts. Common options:

- GitHub Pages: build with `npm run build`, then push the `dist` output to the `gh-pages` branch or use `gh-pages` deploy scripts.
- Netlify: connect the Git repository, set the build command to `npm run build` and the publish directory to `dist`.
- Vercel: Vercel detects Vite projects; set the build command to `npm run build` and output to `dist`.

If you tell me which host you plan to use I can provide step-by-step deploy instructions.

## Contributing & code style

- If you plan to modify the project, consider adding or using linting and formatting tools (ESLint + Prettier). This repository does not require those tools by default, but they help keep code consistent.
- Branching workflow suggestion: create feature branches and open PRs for larger changes. Keep small, focused commits.

## Useful troubleshooting snippets

Run the dev server and capture output (Windows PowerShell example):

```powershell
npm run dev > dev.log 2>&1; Get-Content dev.log -Tail 200
```

Quickly search for empty CSS rules that could trigger linter errors:

```bash
grep -n "{}" -R src | grep .css || true
```

Search for unclosed JSX by looking for common markers (missing `</`):

```bash
grep -n "<[^/][^>]*$" -R src || true
```
