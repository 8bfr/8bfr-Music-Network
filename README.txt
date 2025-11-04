# 8BFR Music Network — Static Site Build
Date: 2025-11-04T20:40:11.542331

## How to deploy (GitHub Pages /docs)
1) Create or open your repo: 8bfr/8bfr-Music-Network
2) Copy the entire `docs/` folder from this zip into your repo root.
3) Commit and push. In repo settings → Pages, set Source = `main` branch, folder = `/docs`.
4) Visit: https://8bfr.github.io/8bfr-Music-Network/

## Notes
- Tailwind via CDN. No build step required.
- Floating circular menu (☰) bottom-right slides left of Carrie avatar.
- Supabase stub is at: `assets/js/supabase.js` (fill your URL + anon key).
- PayPal donate is wired to 8bfr.music@gmail.com in donate.html.
- Placeholder Carrie images are SVGs at `assets/img/` — replace with your PNGs if desired.
- All pages include shared header/footer via `assets/js/site-shell.js`.
