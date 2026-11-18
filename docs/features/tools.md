# Tools and permissions

The agent gets work done by calling tools. This page lists what it can do out of the box and how you control it.

## Built-in tools

| Tool | What it does |
| --- | --- |
| Read, list, find and grep | Read files, list folders, find files by name and search their contents. |
| Write and edit | Create files and change existing ones. Every change shows up as a diff in the timeline. |
| Shell | Run commands in your project's folder, including long-running ones in the background. |
| Terminal sessions | Keep an interactive terminal open across steps, for servers, REPLs and watch tasks. |
| Questions | Ask you something mid-task, with options to choose from. |
| Plans and to-dos | Write a plan for you to approve and keep a visible task list. |
| Subagents | Hand a self-contained piece of work to a helper agent and continue with its result. |
| Memory | Save and recall [memories](./memory.md). |
| Schedules | Create [scheduled tasks](./scheduled-tasks.md). |
| Computer use | Operate other apps; see [computer use](./computer-use.md). |
| Search and media | Search the web and generate images or video; see [search, images and video](./search-and-media.md). |

[MCP servers](./mcp.md), [skills](./skills.md) and [plugins](../plugins/) add more.

## How much access the agent has

The agent works directly on your Mac with **your** permissions: there is no sandbox and no staging area. It can read and change what you can, and its commands run as you.

That makes it fast and useful, so it is worth knowing the ways to keep it in check:

- **[Plan mode](./plan-mode.md)** limits it to reading and planning until you approve.
- **Project choice** decides its working directory. Start conversations in the project you mean.
- **MCP tools** are off until you grant them, one tool at a time. See [MCP servers](./mcp.md).
- **Plugin hooks** can stop a tool call and ask you first. See [hooks](../plugins/hooks.md).
- **Stop** ends a run immediately from the composer.

::: tip
Keep important work in Git. Every change the agent makes is then easy to review with `git diff` and easy to undo.
:::

## Permissions in the terminal

The `nora` command adds finer controls: permission modes, allow and deny rules, and a file-access sandbox for the agent's commands. See [CLI permissions](../cli/permissions.md).
