# Provider plugins

A provider plugin adds a model provider to Nora's gateway. Users install it like any other plugin, and its accounts appear in **Settings › AI Providers**.

## Without code

If the provider speaks the OpenAI, Anthropic or Gemini API, a manifest is enough:

```json
{
  "apiVersion": 3,
  "id": "example.acme",
  "name": "Acme",
  "version": "1.0.0",
  "runtime": { "kind": "none" },
  "scope": "host",
  "contributes": {
    "ai.providers": [
      {
        "id": "acme",
        "name": "Acme",
        "api": "openai-chat",
        "baseURL": "https://api.acme.example/v1",
        "models": ["acme-large", "acme-small"],
        "keysUrl": "https://acme.example/keys"
      }
    ]
  }
}
```

| Field | Meaning |
| --- | --- |
| `api` | `openai-chat`, `openai-responses`, `anthropic` or `gemini`. |
| `baseURL` | Where requests go. |
| `models` | Optional. When left out, the gateway asks the provider's `/models`. |
| `keysUrl` | Where users get a key. |
| `auth` | Optional. Where the key goes when it differs from the API's default: `bearer`, `x-api-key` or `x-goog-api-key`. |
| `headers` | Optional fixed headers, such as a required `User-Agent`. The key header, `Host` and `Content-Type` are set by the gateway and not allowed. |

## With code

Providers that need a browser sign-in, request signing or a private API include a program. The manifest declares it:

```json
{
  "runtime": { "kind": "process", "entry": "bin/acme", "protocol": 2 },
  "scope": "host",
  "provides": ["ai.provider"],
  "contributes": {
    "ai.providers": [
      {
        "id": "acme",
        "name": "Acme",
        "icon": "icons/acme.svg",
        "api": "anthropic",
        "baseURL": "https://api.acme.example",
        "signIn": ["browser", "key"],
        "sendsRequests": true,
        "usage": true
      }
    ]
  }
}
```

The program answers the gateway's questions: how to sign in, whether sign-in has finished, how to refresh credentials, which models exist, how much has been used, and, with `sendsRequests`, how to send each request. The gateway stores the credentials and hands them back with every question, so the plugin keeps nothing itself.

See [plugin-kit](https://github.com/nora-release/plugin-kit) for the protocol and SDKs, and the [official provider plugins](https://github.com/nora-release/plugins) for working examples.
