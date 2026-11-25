# linklasso.fodylabs.com

Landing page for the **LinkLasso** Chrome extension, built on **Astro** (same stack as chat.fodylabs.com).

## Structure

- `src/pages/index.astro` — landing page (hero, features, how it works, screenshots, pricing, FAQ).
- `src/pages/privacy.astro` — privacy policy (the URL you paste into the Chrome Web Store).
- `src/components/SiteMenu.astro` / `SiteHead.astro` — the shared header menu (theme + 7 languages), vendored from the fodylabs sites.
- `src/lib/ui/*.ts` — shared menu / priority-nav / autohide (vendored).
- `src/styles/global.css` — LinkLasso palette (`--accent: #16a34a`) + landing styles.
- `public/i18n.js` — client-side i18n (7 languages: en, de, es, fr, it, ru, uk).

## Commands

```bash
npm install
npm run dev       # local dev server (hot reload)
npm run build     # static build → dist/
npm run preview   # preview the build
```

## Deploy

Static site on Cloudflare Pages (`linklasso.fodylabs.com`). GitHub Actions (`.github/workflows/deploy.yml`) runs `npm run build` → `dist/` and `wrangler pages deploy` on every push to `main`.

Required in the GitHub repo settings:

- **Secrets** — `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`.
- **Variable** — `CLOUDFLARE_PAGES_PROJECT`: the Cloudflare Pages project name.

The store / OAuth consent screen URLs:

```
https://linklasso.fodylabs.com/privacy
https://linklasso.fodylabs.com/terms
```

## Before publishing

- Replace the placeholder `href="#"` on the **Install** / **Start free trial** buttons with the real Chrome Web Store link.
- Replace the screenshot placeholders in `public/screenshots/` with real screenshots.

## Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-org>/linklasso.fodylabs.com.git
git push -u origin main
```

