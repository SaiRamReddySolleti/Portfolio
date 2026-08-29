# solleti.dev

Personal site and project portfolio for Sai Ram Reddy Solleti — AI/ML engineer.

Live at **[solleti.dev](https://solleti.dev)**.

## Stack

None. One hand-written HTML file, no framework, no build step, no dependencies.
Fonts are Archivo and IBM Plex Sans/Mono, served from Google Fonts. Everything else —
layout, theming, the canvas waveform, scroll progress, section tracking, reveal
transitions and the animated counters — is hand-written CSS and vanilla JS in one file.

## Files

| File | Purpose |
|---|---|
| `index.html` | The entire site |
| `resume.pdf` | Résumé, linked from the nav |
| `favicon.svg` | Favicon |
| `CNAME` | Custom domain for GitHub Pages |
| `robots.txt`, `sitemap.xml` | Search indexing |
| `404.html` | Not-found page |
| `.nojekyll` | Skip Jekyll processing |

## Local preview

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Deploying

Pushed to `main`; GitHub Pages serves from the repository root.
