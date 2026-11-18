# Introduction

Nora is a macOS app for getting real work done with AI agents. You describe the outcome you want; the agent reads your files, runs commands, edits code and documents, and reports back in a conversation you can follow step by step.

## Why Nora?

### Native on the Mac

Nora is built with AppKit, not a web view. The conversation timeline draws Markdown, code, Git diffs, tables, math and Mermaid diagrams as real Mac views, so long conversations stay fast and everything is selectable.

### Works on your real files

There is no virtual machine and no staging area. The agent works in the folder you choose, with the files, shell and tools you already have. When you want to look before it acts, [plan mode](../features/plan-mode.md) keeps it to reading and planning until you approve.

### Your models

Nora has no model of its own. Connect the providers you already pay for with an API key, sign in with a subscription such as ChatGPT or GitHub Copilot, or run models locally. A model gateway on your Mac talks to each provider in its own protocol.

### One agent, two places

The `nora` command runs the same agent runtime in your terminal. Providers, sessions and plugins are shared, so you can start a task in the app and pick it up in the terminal.

### Grows with you

[Memory](../features/memory.md) keeps what matters about you and your projects. [Skills](../features/skills.md) teach repeatable workflows. [MCP servers](../features/mcp.md) and [plugins](../plugins/) add tools, hooks and whole new providers.

## How it fits together

| Part | What it does |
| --- | --- |
| The app | Windows, the conversation timeline, Settings, permissions and confirmations. |
| The agent runtime | The agent loop and its tools. It runs in a helper process, so a crash in a run never takes the window down. |
| The model gateway | `nora-gateway` keeps provider accounts, lists models and sends requests. It runs on your Mac. |
| The `nora` command | The same runtime in a terminal interface, for scripts and for editors. |

## System requirements

- A Mac with Apple silicon.
- macOS 14 Sonoma or later.
- An account with at least one model provider, or a local model server.

## Next steps

1. [Install Nora](./installation.md).
2. Follow the [quick start](./quick-start.md).
3. Read how [tools and permissions](../features/tools.md) work.
