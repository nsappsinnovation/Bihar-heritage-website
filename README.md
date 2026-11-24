# Bihar Heritage Development Society — website

The public website of the Bihar Heritage Development Society. It is a **fully static site**:
React 19 + Vite, with all content bundled into the build. There is no backend, no database,
no login, and nothing is stored in visitors' browsers.

## Develop

```bash
npm ci
npm run dev        # http://localhost:5173
npm run lint
```

## Build and preview

```bash
npm run build      # outputs dist/ (with pre-compressed .br / .gz files)
npm run preview    # serves dist/ WITH the production security headers (CSP etc.)
```

Use `npm run preview` when checking changes: it applies the same Content-Security-Policy as the
live server, so a blocked resource shows up as a console error here before it reaches production.

## Updating content

There is no admin panel. Content lives in the repository and goes live with a new build:

| What | Where |
|---|---|
| Protected sites, excavations, news, events, publications, workshops, videos, team lists | `src/data/defaults/` |
| Heritage atlas, districts, circuits | `src/data/*.json` (see `HERITAGE_ATLAS.md`) |
| Blog articles | `src/pages/BlogPage/mockData.js` |
| Photos | `public/images/remote/` (downloaded originals, WebP) or `src/assets/` (imported by pages) |

To change content: edit the file, run `npm run build`, and deploy `dist/`.

## Deploying to the State Data Centre (nginx)

1. `npm ci && npm run build`
2. Copy `dist/` to the server (for example `/var/www/bihar-heritage/dist`).
3. Copy `deploy/security-headers.conf` to `/etc/nginx/snippets/bihar-heritage-security.conf`.
4. Use `deploy/nginx.conf.example` as the server block. Set the server name, the `root`, and
   the TLS certificate paths, then run `nginx -t` and reload.

The example already: redirects HTTP to HTTPS, allows TLS 1.2/1.3 only, hides the nginx version,
accepts only GET/HEAD, blocks dotfiles, serves the pre-compressed `.br`/`.gz` files, sets cache
headers, and sends the security headers on **every** response.

> nginx forgets inherited `add_header` lines as soon as a `location` defines its own. That is
> why the security snippet is `include`d inside each such location — keep it that way when
> editing the config.

## Security notes

- **No user data.** The site has no forms that send data, no accounts and no cookies. It uses
  neither `localStorage` nor `sessionStorage`. On start-up it deletes keys left by earlier
  versions (`src/utils/clearLegacyStorage.js`; keep it for at least one release).
- **Content-Security-Policy** (`deploy/security-headers.conf`, the source of truth) allows only
  the site's own origin, plus YouTube and Google Maps for embedded videos and the contact map.
  `deploy/security-headers.conf`, `vercel.json` and `vite.config.js` (`preview.headers`) must stay
  in sync.
  Known and accepted: `style-src` allows `'unsafe-inline'`, because the animation libraries set
  inline styles. Scripts are **not** allowed inline.
- **No third-party assets.** Photos and audio are served from this site. Only outbound links and
  the YouTube / Google Maps embeds go elsewhere.
- **Dependencies.** Run `npm audit` before each release.

## Image sources

`docs/image-sources.json` lists the original web address of every downloaded photo. Many came from
third-party sites, so **check the usage rights** of each image before relying on it, and replace
any you cannot document with licensed or own photographs.

`scripts/localize-assets.mjs` produced those files. It can be run again to download anything
still pending (`node scripts/localize-assets.mjs`; `--dry` only lists).
