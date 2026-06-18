# Kaggle Focus Mode

A Chrome extension that toggles a distraction-free focus mode on [Kaggle](https://www.kaggle.com) pages. One keyboard shortcut hides the navigation, banners, tab bars, and sidebars so the main content fills the entire screen — then press it again to restore the normal layout.

Works across competitions, notebooks, datasets, and discussion pages.

## Features

- **One-key focus toggle**: hide all surrounding chrome and expand the content to the full viewport, then toggle back.
- **Hides the distractions**: left icon sidebar, top navigation bar, competition banner, tab bar (Overview, Data, Code, etc.), right info sidebar, and footer.
- **Reclaims the layout**: collapses multi-column grids to a single full-width column so content like notebooks and discussions use the whole window.
- **Survives Kaggle deploys**: elements are located by stable selectors and computed grid styles rather than hashed class names, so the extension keeps working across site updates.
- **Scroll-preserving**: your scroll position is restored when you exit focus mode.

## Shortcuts

| Shortcut (macOS) | Shortcut (Windows/Linux) | Action |
|---|---|---|
| `⌘ ;` | `Ctrl ;` | Toggle focus mode on/off |

## Installation

1. Clone or download this repository
2. Open `chrome://extensions` in Chrome
3. Enable **Developer mode** (toggle in the top right)
4. Click **Load unpacked** and select the repository folder
5. Open any [Kaggle](https://www.kaggle.com) page and press `⌘ ;` (or `Ctrl ;`)

## Project structure

```
├── manifest.json   # Manifest V3
├── content.js      # Shortcut handling, element finders, focus toggle logic
├── styles.css      # Hide rules and full-viewport layout reclaim
└── icons/          # Static extension icons (16/48/128px)
```

## How it works

A content script listens for the keyboard shortcut and toggles a CSS class on `<html>`. The fixed navigation is hidden by ID (`#site-content`, `#root > nav`, `#nav-footer`), and the page's content wrapper is found by walking down from `#site-content` to the tall content area. Surrounding chrome (banner, tab bar) and any narrow right-side grid column are tagged with `data-kaggle-focus` attributes so the stylesheet can hide them and expand the remaining content to full width.

## Privacy policy

Kaggle Focus Mode does not collect, transmit, sell, or share any user data.

- The extension runs only on `www.kaggle.com` pages and makes no network requests of any kind.
- It does not read, store, or transmit any page content. It only adds and removes CSS classes and `data-*` attributes to show or hide page elements.
- There are no analytics, no tracking, no third-party services, and no remote code.

If you have a privacy question, please open an issue on this repository.

## Caveats

This is an unofficial project, not affiliated with Kaggle or Google. It depends on Kaggle's DOM structure, which changes without notice. If focus mode stops working after a site redesign, the element selectors in `content.js` likely need updating.

## Credits

Developed by Ian Kahn, using [Claude Code](https://claude.com/claude-code).

## License

[MIT](LICENSE)
