# Plan mode

In plan mode the agent researches and writes a plan before it changes anything. It can read files, search and ask you questions, but it does not edit files or run commands that change your project until you approve the plan.

## Use plan mode

1. Click **+** in the composer and choose **Plan**.
2. Describe the task and send it.
3. The agent explores the project and presents its plan as a card in the timeline.
4. Approve the plan to let it start, or reply with what to change and it revises the plan.

You can also pick plan mode before the conversation starts; the new chat begins in it.

## When to use it

- Changes that touch many files or several parts of a system.
- A codebase the agent has not worked in yet.
- Anything where a wrong first step is expensive to undo: migrations, deletions, releases.

## Write good plan requests

Say what done looks like and what must not change:

```text
Plan: move session storage from cookies to the database.
Keep the login API the same. Existing sessions must keep working.
```

## In the terminal

```sh
nora --permission-mode plan
```

`--no-plan` turns the plan tools off for a run.
