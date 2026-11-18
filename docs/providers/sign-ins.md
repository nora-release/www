# Subscription sign-ins

If you already pay for a plan such as ChatGPT, GitHub Copilot or Grok, you can sign in to it instead of using an API key. Sign-ins come from provider plugins.

## Sign in

1. Open the **Plugins** page and install the provider's plugin, for example **chatgpt**.
2. Open **Settings › AI Providers**, click **Add Provider** and choose the **Accounts** tab.
3. Find the provider and click **Sign In with Browser**. Nora opens the provider's sign-in page, and may show a code to enter there.
4. When you finish, the account appears in AI Providers with its models.

To add a second account for the same provider, click **Add Account**. Some providers also accept a key; use **Add Key** for those.

Nora keeps the credentials in its local database and refreshes them when they expire.

## Official provider plugins

| Plugin | Adds |
| --- | --- |
| `chatgpt` | Sign in with a ChatGPT plan. |
| `copilot` | Sign in with GitHub Copilot. |
| `grok` | Sign in with Grok. |
| `kimi-coding` | Kimi's coding plan. |
| `kiro` | Kiro. |
| `moonshotai`, `moonshotai-cn` | Moonshot AI, international and China. |
| `cerebras` | Cerebras. |
| `huggingface` | Hugging Face inference providers. |
| `opencode` | OpenCode. |
| `siliconflow-global` | SiliconFlow. |
| `vercel-ai-gateway` | Vercel AI Gateway. |
| `workbuddy` | WorkBuddy. |

Official plugins update themselves when **Update plugins automatically** is on in **Settings › About**.

## Usage and limits

For plans with usage limits, the account card in AI Providers shows how much you have used in the current window. Usage is read from the provider; Nora does not add limits of its own.

## Troubleshooting

### "The sign-in page doesn't open"

Check your default browser, then click **Sign In with Browser** again. If the provider shows a code, make sure you entered it on the page Nora opened.

### "The account signed out"

Some plans end sessions after a while. Sign in again from AI Providers; your conversations are unaffected.
