# Plugins overview

Plugins extend what Nora and its agent can do. One plugin can bring any mix of skills, tools, hooks, subagents, MCP servers and model providers. The app and the `nora` command share the same plugins, installed once.

## What a plugin can add

| Contribution | What it adds |
| --- | --- |
| Skills and commands | Instructions the agent loads when a task calls for them. |
| Tools | Programs the agent can call, written in any language. |
| Hooks | Code that runs around the agent's work, for example to check a command and ask you before it runs. |
| Subagents | Specialised agents the main agent can hand work to. |
| MCP servers | Servers that show up in **Settings › Tools**. |
| Model providers | New providers for the model gateway. |

## Plugins from other tools work as they are

Nora reads the Claude Code, Codex and Grok plugin formats directly. A plugin built for one of them installs without changes: its skills, commands, agents, hooks and MCP servers all load.

## For users

- [Install and manage plugins](./manage.md)
- [Trust and updates](./trust.md): read this before you install a plugin that runs code.

## For developers

- [Quick start](./quick-start.md): a working plugin in five minutes.
- [Plugin layout](./layout.md): every folder and file a plugin can have.
- [Hooks](./hooks.md): run code before and after tool calls and turns.
- [Manifest reference](./manifest.md): `nora-plugin.json` for tool and provider plugins.
- [Process plugins](./process.md): tools written as programs.
- [Provider plugins](./providers.md): add a model provider.
- [Publishing](./publishing.md): share plugins through a marketplace.
