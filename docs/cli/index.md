# CLI overview

`nora` runs Nora's agent in your terminal. It shares the app's agent runtime, provider accounts, sessions and plugins, so anything you set up in one works in the other.

## Ways to run it

| Mode | Command | For |
| --- | --- | --- |
| [Interactive](./interactive.md) | `nora` | A full-screen conversation in the terminal. |
| [One-shot](./one-shot.md) | `nora -p "…"` | Scripts, pipes and CI: answer once and exit. |
| [Editor agent](./acp.md) | `nora agent stdio` | Editors that speak the Agent Client Protocol. |

## Get started

1. [Install the command](./install.md) from **Settings › About**.
2. Run `nora` in a project folder.
3. Ask for something, just as in the app.

## Next steps

- [Permissions](./permissions.md): control what the agent may do without asking.
- [Worktrees](./worktrees.md): run tasks side by side in separate Git worktrees.
- [Command reference](./commands.md): every command and option.
