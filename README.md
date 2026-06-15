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

## Auth

The header login button starts GitHub OAuth through Better Auth at `/api/auth/*`.

Required environment variables:

- `DATABASE_URL`
- `GITHUB_OAUTH_CLIENT_ID`
- `GITHUB_OAUTH_CLIENT_SECRET`
- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL`

Compatible fallback variable names:

- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`
- `NORA_SESSION_SECRET`
- `NORA_SITE_URL`

## Feedback

The feedback board stores requests, votes, comments, and promoted GitHub Issues in PostgreSQL through Drizzle.

Optional environment variables:

- `FEEDBACK_ADMIN_GITHUB_IDS`: comma-separated GitHub account ids that can promote feedback to GitHub Issues.
- `FEEDBACK_ADMIN_GITHUB_LOGINS`: comma-separated GitHub usernames that can promote feedback to GitHub Issues.
- `FEEDBACK_GITHUB_REPO`: target repo for promoted issues, defaults to `nora-release/nora`.
- `FEEDBACK_GITHUB_TOKEN`: token used to create GitHub Issues and imported feedback comments.
- `FEEDBACK_GITHUB_WEBHOOK_SECRET`: secret used to verify GitHub Issue webhooks.

Configure the GitHub repository webhook URL as `/api/github/webhook` and subscribe to Issues events. Closing a linked GitHub Issue marks the feedback as closed; reopening it marks the feedback as promoted again.

## Notes

The site is built for Cloudflare. `npm run build` prerenders static routes and emits the Cloudflare output under `dist/`.

## License

Source code is available under the [MIT License](LICENSE).
