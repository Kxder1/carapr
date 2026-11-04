# carapr.org

Free car loan calculators for 13 countries, live at [carapr.org](https://carapr.org). A [KlauderLabs](https://klauderlabs.com) site.

**Calculators:** car APR (the home page), pay off early, refinance, negative equity, down payment savings, and gig driver profit.

Every calculator switches currency, example figures and loan rules by country: United States, China, Japan, India, Germany, France, Brazil, United Kingdom, Canada, South Korea, Mexico, Nigeria, and other euro countries. There is also a landing page per country so each one can rank in local search.

## How the site is built

The published site is plain HTML in `dist/`. Each page has its styles and scripts inlined, so there are no separate CSS or JS files to forget when uploading.

Edit the files in `src/`, then rebuild:

```
python3 build.py
```

The build needs Python 3 and Node. It rewrites everything in `dist/`.

| Path | What it is |
|---|---|
| `src/pages/` | One file per page: head, article text and footer |
| `src/parts/` | The calculator form and script for each calculator page |
| `src/countries.js` | Each country's loan rules, currency, example figures and sources |
| `src/engine.js` | Country picker, currency formatting, loan math, analytics events |
| `src/landing.py` | Text for the country landing pages, including local-language sections |
| `src/guides.py` | The car loan guides. Every worked example was calculated with the site's formulas |
| `src/trust.py` | How we calculate, editorial policy, and the extra About page text |
| `src/style.css`, `src/site.js` | Shared styles and the Calculators menu |
| `build.py` | Puts it all together into `dist/` and writes `sitemap.xml` |

## Deploying

`wrangler.jsonc` tells Cloudflare to serve `dist/` as static files. With the repository connected to the carapr.org Worker in Cloudflare, every push to `main` deploys automatically. Otherwise, upload the files in `dist/` by hand.

Country rules were checked in October 2026. Rates, caps and tax figures change, so review `src/countries.js` at least once a year (the IRS mileage rate changes every January).

Contact: contact@carapr.org

Pushes to `main` deploy to carapr.org automatically through Cloudflare Workers Builds.
