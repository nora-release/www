# Projects and conversations

A project is a folder the agent works in. Each conversation belongs to a project, and the sidebar groups conversations under their project.

## Add a project

1. Open **[Settings › Projects](../settings/projects.md)**.
2. Click **Add Project** and choose a folder.
3. Click **Save**.

Removing a project from the list later does not delete its folder or its conversations.

## Start a conversation

- <kbd>⌘</kbd> <kbd>N</kbd> or **New Chat** at the top of the sidebar starts a conversation.
- Pick the project for it from the composer before you send the first message. The agent's working directory is that project's folder.

## Project instructions

If a project has an `AGENTS.md` or `CLAUDE.md` file, the agent follows the instructions in it. Use it for things every task in that project should know: how to run the tests, code style, folders to leave alone.

```md
# AGENTS.md

- Run tests with `pnpm test`.
- Use 2-space indentation in TypeScript.
- Never edit files under `generated/`.
```

## History

<kbd>⌘</kbd> <kbd>H</kbd> opens your history: every conversation, searchable. The sidebar shows the latest few per project; **Show More** lists the rest.

## Continue in the terminal

Conversations are saved on your Mac as sessions. Resume one in the terminal with its ID:

```sh
nora --session <id>
```

## Export

Export a conversation as Markdown from the terminal:

```sh
nora export <session-id> notes.md
nora export <session-id> --clipboard
```
