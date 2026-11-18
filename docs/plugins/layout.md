# Plugin layout

An agent plugin is a folder of files. Nora uses the same layout as Claude Code and Codex plugins, so one plugin can work in all of them.

```text
my-plugin/
├── .nora-plugin/
│   └── plugin.json      # name, version, description
├── skills/
│   └── review/
│       └── SKILL.md
├── commands/
│   └── changelog.md
├── agents/
│   └── reviewer.md
├── hooks/
│   └── hooks.json
├── .mcp.json
└── README.md            # the plugin's page in Nora
```

Nora also reads `.claude-plugin/plugin.json`, `.codex-plugin/plugin.json` and `.grok-plugin/plugin.json`.

## plugin.json

| Field | Required | Meaning |
| --- | --- | --- |
| `name` | Yes | The plugin's identifier. |
| `version` | Yes | Its version, for example `1.2.0`. |
| `description` | Yes | One sentence shown in lists. |
| `skills`, `commands`, `agents` | No | Custom paths, when not in the default folders. |
| `hooks` | No | A path to a hooks file, or the hooks inline. |
| `mcpServers` | No | A path to an MCP config, or the servers inline. |

## What each part becomes

| Part | In Nora |
| --- | --- |
| `skills/` | [Skills](../features/skills.md) the agent can load. |
| `commands/` | Skills named `plugin:command`. |
| `agents/` | Subagents the main agent can hand work to. Their model, tools and permissions follow the agent definition, capped at the main agent's permissions. |
| `hooks/hooks.json` | [Hooks](./hooks.md) around tool calls and turns. |
| `.mcp.json` | [MCP servers](../features/mcp.md), listed in **Settings › Tools**. |
| `README.md` | The plugin's page on the Plugins page. Text, links and code are shown; images and scripts are not. |

Language servers (LSP) declared by a plugin run in the `nora` command only.

## Paths inside a plugin

Use `${CLAUDE_PLUGIN_ROOT}` (or `${NORA_PLUGIN_ROOT}`) in hooks and MCP commands to refer to the plugin's own folder, wherever it is installed.
