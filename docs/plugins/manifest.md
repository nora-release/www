# Manifest reference

Plugins that contribute tools written as programs, or model providers, describe themselves in `nora-plugin.json` at the plugin's root. (Plugins made only of skills, agents, hooks and MCP servers use the simpler [layout](./layout.md) instead.)

```json
{
  "apiVersion": 3,
  "id": "example.word-count",
  "name": "Word Count",
  "version": "1.0.0",
  "runtime": { "kind": "process", "entry": "bin/word-count", "callTimeoutMs": 600000 },
  "scope": "session",
  "inject": [],
  "provides": [],
  "contributes": {
    "agent.tools": [{ "name": "word_count", "schema": "schemas/word_count.json" }],
    "agent.skills": ["skills/counting"]
  },
  "permissions": ["network:api.example.com"]
}
```

## Fields

| Field | Meaning |
| --- | --- |
| `apiVersion` | `3`. |
| `id` | A unique, reverse-domain style identifier. |
| `name`, `version` | Shown on the Plugins page. |
| `runtime.kind` | `process` for a program, `none` for a plugin that is only data. |
| `runtime.entry` | The program to start, relative to the plugin folder. |
| `runtime.callTimeoutMs` | How long one tool call may take: 1 ms to 1 hour. Default 10 minutes. |
| `runtime.protocol` | `1` (default) or `2`, which adds streams. Provider plugins with code need `2`. |
| `scope` | `session` for tools and skills; `host` for providers. |
| `inject` | Services from other plugins this one needs. |
| `provides` | Services this plugin offers others. |
| `contributes` | What it adds: `agent.tools`, `agent.skills` or `ai.providers`. |
| `permissions` | What the plugin says it needs, such as network hosts. Shown at install. |

::: warning
`permissions` describe the plugin; they are not an operating-system limit. See [trust and updates](./trust.md).
:::

## Rules

- A field Nora cannot honor yet is rejected, not silently ignored, so a plugin never appears to work when it does not.
- The tools a process reports when it starts must match `agent.tools` exactly.
- A provider plugin has `scope: "host"` and contributes only `ai.providers`.
