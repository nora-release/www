# Providers overview

Nora has no model of its own. You connect the providers you already use, and Nora's model gateway, `nora-gateway`, talks to them for you.

## Three ways to connect

| Way | Best for | Page |
| --- | --- | --- |
| API key | Pay-as-you-go accounts: OpenAI, Anthropic, Gemini, DeepSeek, OpenRouter and many more. | [API keys](./api-keys.md) |
| Subscription sign-in | Plans you already pay for, such as ChatGPT, GitHub Copilot or Grok, through a provider plugin. | [Subscription sign-ins](./sign-ins.md) |
| Local server | Models running on your Mac with Ollama, LM Studio or similar. | [Local models](./local-models.md) |

You can connect as many as you like and choose a different model for each conversation.

## The gateway

The gateway runs on your Mac, started by the app or by the `nora` command. It:

- keeps your provider accounts in Nora's local database;
- lists the models each account offers;
- sends each request in the model's own protocol (OpenAI Chat Completions or Responses, Anthropic Messages, Gemini), so reasoning, tool calls and images work the way each provider intends;
- tracks usage for each account.

## Where to manage providers

Everything is in **[Settings › AI Providers](../settings/ai-providers.md)**: add accounts, sign in, see usage, choose which models to show. Provider plugins are installed on the Plugins page.

## Next steps

- [Add your first API key](./api-keys.md)
- [Choose models and reasoning levels](./models.md)
