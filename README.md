<div align="center">
  <img src="./public/default/icon_128x128@2x.png" />
</div>

<h1 align="center">Nora</h1>

<p align="center">
A beautiful desktop application that unifies your AI experience. 
Seamlessly switch between OpenAI, Anthropic, Google Gemini, and custom providers.
</p>

## Feedback

The `/feedback` page shows a public feedback community. GitHub OAuth login is
required to create feedback, reply, manage admins, or promote feedback to issues.

Configure these environment variables before enabling it:

| Variable | Purpose |
| --- | --- |
| `NORA_SITE_URL` | Public site origin used for the GitHub OAuth callback. |
| `NORA_SESSION_SECRET` | Long random string used to sign login cookies. |
| `GITHUB_CLIENT_ID` | GitHub OAuth app client id. |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth app client secret. |
| `DATABASE_URL` | PostgreSQL connection string used by NuxtHub DB. |
| `NORA_FEEDBACK_ADMINS` | Initial comma-separated GitHub usernames seeded into the admin table. |
| `NORA_FEEDBACK_GITHUB_REPO` | Private repo in `owner/repo` format for promoted issues. |
| `NORA_FEEDBACK_GITHUB_TOKEN` | GitHub token with issue write access to that repo. |

Admins can add more admins from the feedback page after signing in.
