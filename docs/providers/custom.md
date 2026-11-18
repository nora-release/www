# Custom providers

There are two ways to add a provider Nora does not know yet.

## For yourself: a custom account

If the service speaks the OpenAI Chat Completions, OpenAI Responses or Anthropic Messages API, add it on the **Custom** tab of **Settings › AI Providers › Add Provider** with its base URL and key. See [API keys](./api-keys.md#a-provider-that-is-not-a-preset).

## For everyone: a provider plugin

A provider plugin teaches every Nora user a new provider: its name, icon, API format, models and how to sign in. Simple providers need only a manifest; providers with browser sign-ins or private protocols include a small program.

See [provider plugins](../plugins/providers.md) to build one.
