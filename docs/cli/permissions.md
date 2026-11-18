# Permissions

In the terminal you can decide exactly what the agent may do without asking, and limit what its commands can touch.

## Permission modes

```sh
nora --permission-mode <mode>
```

| Mode | Behavior |
| --- | --- |
| `default` | Ask before actions that change things. |
| `acceptEdits` | Make file edits without asking; ask for other actions. |
| `auto` | Decide automatically what needs asking. |
| `dontAsk` | Never ask; refuse what is not allowed by rules. |
| `plan` | Read and plan only; see [plan mode](../features/plan-mode.md). |
| `bypassPermissions` | Do everything without asking. Aliases: `--always-approve`, `--yolo`. |

## Allow and deny rules

Rules use the Claude Code format and can be repeated:

```sh
nora --allow "Bash(git status:*)" --allow "Bash(pnpm test:*)" --deny "Bash(rm:*)"
nora --allow "Edit" --allow "mcp__github__*"
```

| Rule | Matches |
| --- | --- |
| `Bash(git status:*)` | Shell commands starting with `git status`. |
| `Read`, `Edit`, `Write` | Reading, or changing, files. |
| `Grep`, `Glob` | Searching files. |
| `WebFetch`, `WebSearch` | Fetching pages and searching the web. |
| `mcp__server__tool` | One MCP tool; `mcp__server__*` for all of a server's tools. |
| `*` | Everything. |

## File-access sandbox

Limit what the agent's commands can read and write:

```sh
nora --sandbox <profile>
```

| Profile | Effect |
| --- | --- |
| `workspace` | Write only inside the project. |
| `read-only` | Read, never write. |
| `strict` | The tightest limits. |
| `off` | No limits. |

## Trust a project

Project instruction files and project hooks load only in projects you trust:

```sh
nora --trust
```
