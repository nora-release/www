# Interactive mode

Run `nora` in a folder to open a full-screen conversation, with plans, diffs and tool calls drawn for the terminal.

```sh
nora
nora "explain how requests reach the database"   # start with a message
```

## Display

| Option | Effect |
| --- | --- |
| `--fullscreen` | Use the alternate screen (default where supported). |
| `--minimal` | Keep the terminal's scrollback and draw only a small live prompt. |
| `--no-alt-screen` | Draw full-screen on the main terminal screen. |

## Commands

Type `/` for commands, or open the command palette:

| Command | What it does |
| --- | --- |
| `/new` | Start a new session. |
| `/resume` | Resume an earlier session. |
| `/rewind` | Go back to an earlier point in this session. |
| `/rename` | Rename the session. |
| `/delete` | Delete this session. |
| `/info` | Show session details. |
| `/compact` | Compact the history into a summary to free context. |
| `/context` | Show how much context is used. |
| `/tasks` | List background tasks. |
| `/model` | Switch model. |
| `/thinking` | Change the reasoning level. |
| `/theme` | Change the color theme. |
| `/help` | Help. |

<kbd>Ctrl</kbd> <kbd>X</kbd> lists keyboard shortcuts; <kbd>Ctrl</kbd> <kbd>Q</kbd> quits.

## Sessions

| Option | Effect |
| --- | --- |
| `-c, --continue` | Resume the latest session in this folder. |
| `-r, --resume [id-or-title]` | Resume a session by ID or title. |
| `--session <id>` | Resume a session shared with the app. |
| `--fork-session` | Resume a copy instead of the original. |

```sh
nora sessions list
nora sessions search "login test"
```
