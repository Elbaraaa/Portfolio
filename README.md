# Elbaraa Abdalla — Portfolio

## Quick Start

Make sure you have **Node.js 16+** installed ([download here](https://nodejs.org)).

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm start
```

The site will open at **http://localhost:3000**.

## Build for Production

```bash
npm run build
```

This creates a `build/` folder you can deploy to any static hosting (Vercel, Netlify, GitHub Pages, etc.).

## Notes

- **AI Chat**: The bottom-right chat bubble calls the Anthropic API. It will only work if you're running through a proxy that injects your API key, or you modify `Portfolio.jsx` to add your key. For local testing you can ignore it — it'll just show a fallback error message.
- **Hire Me form**: Uses Formspree. Replace `YOUR_FORMSPREE_ID` in `Portfolio.jsx` with your actual Formspree endpoint to enable it.
- **Guestbook**: Uses `localStorage` locally (via the included polyfill). Data persists in your browser between sessions.
- **Secret terminal**: Type `elbaraa` on your keyboard anywhere on the page to open it.
- **Rubik's Cube**: On the Skills section, click and hold the 3D cube, then release to explode it and reveal skills.
