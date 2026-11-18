# The chat window

Every conversation is a timeline: your message, the agent's work as a list of steps, and its answer. This page walks through each part of the window.

## The timeline

| Part | What it shows |
| --- | --- |
| Your messages | What you asked, with any files or images you attached. |
| Steps | Each tool call: reading a file, searching, running a command, editing. Finished steps fold into a line such as **Ran 14 steps**; click it to see each step's input and output. |
| File changes | Every file the agent edits, shown as a Git diff with line numbers. Choose unified or split diffs in **[Settings › General](../settings/general.md)**. |
| Cards | Questions the agent asks you, plans to approve, and approvals a plugin hook asks for. Answer them right in the timeline. |
| Errors | Problems fold into one row; expand it for the details. |
| The answer | Markdown, code, tables, math and Mermaid diagrams, drawn natively. HTML an answer produces runs in an isolated web view. |

Under each answer, Nora shows the model that wrote it and how many tokens the turn used.

## The composer

| Control | What it does |
| --- | --- |
| **+** | Start [plan mode](../features/plan-mode.md) or a [goal](../features/goals.md), open your [scheduled tasks](../features/scheduled-tasks.md), or pick a [skill](../features/skills.md) for this message. |
| Attachments | Drop or paste files and images into the composer. |
| Context indicator | How full the model's context window is. When it gets close, Nora compacts older turns into a summary automatically. |
| Model button | Choose the model and its reasoning level for this conversation. |
| Send | Sends the message, or queues it if the agent is still working. |

### Queued messages

Messages you send while the agent works wait in a tray above the composer. They go in when the current step ends, so you can steer a long task without stopping it.

### Voice input

Press <kbd>⌃</kbd> <kbd>M</kbd> to dictate. Change the shortcut in **[Settings › Shortcuts](../settings/shortcuts.md)**. Voice input needs the Microphone permission.

## Slash commands

Type these at the start of a message:

| Command | What it does |
| --- | --- |
| `/goal <objective>` | Starts a [goal](../features/goals.md). |
| `/goal` or `/goal status` | Shows the current goal and its progress. |
| `/goal clear` | Stops working toward the goal. |

## The side panels

The toolbar on the right edge opens panels beside the conversation: a terminal, the project's files, Git, and a browser. See [side panels](../features/side-panels.md).

## Search

<kbd>⌘</kbd> <kbd>F</kbd> searches the open conversation. <kbd>⌘</kbd> <kbd>H</kbd> opens your history.

## Next steps

- [Projects and conversations](./projects.md)
- [Tools and permissions](../features/tools.md)
