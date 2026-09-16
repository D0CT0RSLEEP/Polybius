# POLYBIUS // ARCHIVE-81

A polished static web project: a **fake ROM archive / urban-legend lore page** inspired by the Polybius arcade myth (1981 Portland cabinet, government rumors, men in black).

**Fiction and folklore only.** Clearly framed as myth. No authentic Polybius ROM is known to exist. Not gore; not real harm.

## What’s inside

- **Landing** — CRT title, disclaimer, Insert Coin
- **Lore dossier** — classification, summary, folklore notes
- **Cabinet description** — alleged hardware profile + operator accounts
- **Timeline of the legend** — 1981 → present
- **Fake ROM viewer** — hex/gibberish dump with story fragments, glitch, Access Denied
- **Boot sequence** — short terminal boot on load (skippable)

Aesthetic: dark green/amber phosphor, scanlines, restrained glitch — arcade CRT vibes.

## How to view

### Option A — open the file

Open `index.html` in a modern browser (Chrome, Firefox, Safari, Edge):

```bash
# from this folder
xdg-open index.html    # Linux
open index.html        # macOS
start index.html       # Windows
```

Or double-click `index.html` in your file manager.

### Option B — local static server (recommended)

Fonts load from Google Fonts; a tiny server avoids any odd `file://` quirks:

```bash
cd polybius
python3 -m http.server 8080
```

Then visit: <http://localhost:8080>

(Node alternative: `npx serve .`)

## Project layout

```
polybius/
├── index.html      # Main page (all sections)
├── css/styles.css  # CRT / arcade styles
├── js/main.js      # Boot, dump, coin, access-denied
├── assets/         # Reserved for optional media
└── README.md
```

No build step. No framework. No `node_modules`.

## Mobile

Layout is responsive (stacked cards, flexible nav, readable type). Tested for small screens via fluid CSS.

## License / intent

Entertainment folklore archive. Do not present as historical fact.
