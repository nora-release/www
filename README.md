# Nora Website

Nora is a macOS-first local agent chat app. This repository contains the public website, localized pages, support/legal pages, and changelog for Nora.

## Links

- Website: https://nora.elonehoo.me
- Support: hi@elonehoo.me

## Tech Stack

- Astro 5
- React 19 islands
- Tailwind CSS 4
- Framer Motion
- Cloudflare adapter and Wrangler

## Local Development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build the site:

```bash
npm run build
```

Preview with Wrangler:

```bash
npm run preview
```

Deploy:

```bash
npm run deploy
```

## Project Structure

- `src/pages/`: Astro routes and API endpoints
- `src/components/`: page sections and interactive React components
- `src/lib/`: i18n, translations, downloads, and shared site config
- `changelogs/`: localized changelog markdown
- `public/`: static assets served by the site

## Notes

The site is built for Cloudflare. `npm run build` prerenders static routes and emits the Cloudflare output under `dist/`.

## License

Source code is available under the [MIT License](LICENSE).
