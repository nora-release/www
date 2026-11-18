# Privacy and data

Nora is local first. This page lists what it stores, where, and what leaves your Mac.

## What stays on your Mac

| Data | Where |
| --- | --- |
| Conversations, settings and memories | `~/Library/Application Support/Nora` |
| Provider accounts and credentials | The same local database, kept by the model gateway |
| MCP server secrets and OAuth tokens | macOS Keychain |
| The `nora` command's own data | `~/.nora` |

## What leaves your Mac

- **Your prompts, and the files and output the agent reads,** go to the model provider you chose for the conversation, and only to it, to produce a reply.
- **Web searches** run through the selected model's provider when you use [online search](../features/search-and-media.md).
- **MCP servers and plugins** receive what you or the agent send them. Remote MCP servers are run by their own operators.
- **Update checks** contact Nora's release server.

## Plugins run as you

A plugin that runs code can do anything you can on this Mac. Read [trust and updates](../plugins/trust.md) before you install one.

## Delete your data

- Delete one memory, or all of them, in **[Settings › Memory](../settings/memory.md)**.
- **Settings › About › Reset Settings and Memory** resets settings and long-term memory and keeps your conversations.
- To remove everything, quit Nora and delete `~/Library/Application Support/Nora`.

See the full [privacy policy](https://nora.elonehoo.me/privacy).
