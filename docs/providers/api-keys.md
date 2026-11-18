# API keys

Most providers give you an API key from their console. Add it once and Nora lists the models it can use.

## Add a provider by key

1. Open **Settings › AI Providers** and click **Add Provider**.
2. Choose the **Preset** tab and search for the provider, for example "Anthropic".
3. Paste your **API Key**.
4. Click **Add Provider**.

The provider appears with its models. Pick one from the model button in the composer.

## Where to get a key

| Provider | Console |
| --- | --- |
| OpenAI | [platform.openai.com/api-keys](https://platform.openai.com/api-keys) |
| Anthropic | [console.anthropic.com](https://console.anthropic.com/) |
| Google Gemini | [aistudio.google.com/apikey](https://aistudio.google.com/apikey) |
| DeepSeek | [platform.deepseek.com/api_keys](https://platform.deepseek.com/api_keys) |
| OpenRouter | [openrouter.ai/keys](https://openrouter.ai/keys) |

The presets cover many more providers; search the **Preset** tab.

## A provider that is not a preset

Any service that speaks one of the supported API formats works. In **Add Provider**, choose the **Custom** tab and fill in:

| Field | What to enter |
| --- | --- |
| Name | A label for the account. |
| API format | **OpenAI Chat Completions**, **OpenAI Responses** or **Anthropic Messages**: whichever the service's API follows. |
| Base URL | The API's address, for example `https://api.example.com/v1`. |
| API Key | The key from the service. |
| Models | Optional. Model IDs separated by commas. Left empty, Nora asks the service for its model list. |

## From the terminal

```sh
nora gateway add <preset> <key>
```

The `nora` command and the app share accounts, so a key added in one works in the other.

## Troubleshooting

### "Invalid API key"

Copy the key again from the provider's console; keys are usually shown only once. Check that billing is set up on the account.

### "No models listed"

Click **Refresh** on the AI Providers page. For a custom provider, check the base URL, or list the model IDs yourself.

### "Rate limited"

The provider is refusing requests for a while. Wait, pick another model, or raise your limits with the provider.
