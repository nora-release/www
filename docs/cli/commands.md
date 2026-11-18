# Command reference

Run `nora --help` for the complete list on your version.

## Running the agent

| Command | What it does |
| --- | --- |
| `nora` | Open the interactive interface. |
| `nora <prompt>` | Open it and send a first message. |
| `nora -p <prompt>` | Run one prompt and print the reply. `nora -p` alone reads standard input. |
| `nora --prompt-file <path>` | Send a text file, or JSON content blocks, as the prompt. |
| `nora --prompt-json <json>` | Send ACP text and image content blocks. |

## Sessions

| Command | What it does |
| --- | --- |
| `nora sessions list` | This folder's conversations. `--all` for every folder. |
| `nora sessions search <query>` | Search conversations. |
| `nora sessions delete <id>` | Delete one. |
| `nora export <session-id> [path]` | Export as Markdown; `--clipboard` to copy. |
| `nora usage <session-id> [turn]` | Usage recorded for a session. |

## Providers and models

| Command | What it does |
| --- | --- |
| `nora models` | Models you can use. |
| `nora login` | Where each provider is signed in. |
| `nora gateway add <preset> <key>` | Add a provider by its API key. |
| `nora gateway status` | Whether the gateway is running. |

## Extending

| Command | What it does |
| --- | --- |
| `nora plugins …` | [Manage plugins](../plugins/manage.md): `list`, `marketplace`, `show`, `add`, `update`, `enable`, `disable`, `remove`, `reload`, `trust`, `untrust`. |
| `nora mcp …` | [Manage MCP servers](../features/mcp.md): `list`, `add`, `remove`, `enable`, `disable`, `doctor`. |
| `nora memory clear` | Clear memories: `--workspace`, `--global` or `--all`. |

## Servers

| Command | What it does |
| --- | --- |
| `nora agent stdio` | Serve ACP over standard input and output. |
| `nora agent serve` | Serve ACP over a WebSocket at `/ws` (`--bind`, `--secret`). |
| `nora leader list` / `info` / `kill` | See and stop local agent servers. |

## Worktrees

| Command | What it does |
| --- | --- |
| `nora worktree list` / `show <id>` | Worktrees Nora created. |
| `nora worktree apply <id>` | Bring changes back (`--mode merge` or `overwrite`, `--dry-run`). |
| `nora worktree rm <id>` / `gc` | Remove one, or old ones (`--max-age 7d`). |

## Housekeeping

| Command | What it does |
| --- | --- |
| `nora doctor` | What your terminal supports; `nora doctor fix` applies fixes. |
| `nora du` | Disk space used by the command's data. |
| `nora inspect` | Configuration discovered here. |
| `nora trace <session-id> --local` | Export diagnostics for a bug report. |
| `nora wrap <command>` | Run a command in a clipboard-aware terminal. |
| `nora completions <shell>` | Shell completions. |
| `nora version` | Version information. |

## Global options

| Option | Meaning |
| --- | --- |
| `-m, --model <id>` | Use this model. |
| `--thinking <level>` | `off`, `minimal`, `low`, `medium`, `high`, `xhigh`, `max`, `ultra`. Aliases: `--effort`, `--reasoning-effort`. |
| `--cwd <path>` | Work from this folder. |
| `--permission-mode <mode>` | See [permissions](./permissions.md). |
| `--allow <rule>`, `--deny <rule>` | Permission rules. Repeatable. |
| `--sandbox <profile>` | `workspace`, `read-only`, `strict` or `off`. |
| `-w, --worktree [name]` | Start in a managed Git worktree. |
| `--plugin-dir <path>` | Load a plugin folder for this run. Repeatable. |
| `--memory`, `--no-memory` | Turn memory on or off for this run. |
| `--subagents <list>`, `--no-subagents` | Choose built-in subagents: `general`, `Explore`, `Plan`, `all` or `none`. |
| `--disable-web-search` | Turn off web search and fetch. |
| `--no-plan` | Turn off the plan tools. |
| `--trust` | Trust this project and load its instruction files. |
| `--debug` | Write diagnostic events to `~/.nora/debug`. |
