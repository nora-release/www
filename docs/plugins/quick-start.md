# Plugin quick start

Build a plugin with a skill and a safety hook, and try it, in about five minutes.

## Step 1: Create the folder

```text
safe-git/
├── .nora-plugin/
│   └── plugin.json
├── skills/
│   └── commit/
│       └── SKILL.md
└── hooks/
    ├── hooks.json
    └── check-push.sh
```

## Step 2: Describe the plugin

`.nora-plugin/plugin.json`:

```json
{
  "name": "safe-git",
  "version": "0.1.0",
  "description": "Writes good commit messages and asks before force-pushing."
}
```

## Step 3: Add a skill

`skills/commit/SKILL.md`:

```md
---
name: commit
description: Commit staged changes with a conventional commit message.
---

1. Run `git diff --staged` and read the change.
2. Write a subject line under 72 characters: `type(scope): summary`.
3. Commit with `git commit -m`.
```

## Step 4: Add a hook

`hooks/hooks.json` asks for approval before any force push:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [{ "type": "command", "command": "${CLAUDE_PLUGIN_ROOT}/hooks/check-push.sh" }]
      }
    ]
  }
}
```

`hooks/check-push.sh`:

```sh
#!/bin/sh
input=$(cat)
case "$input" in
  *"push --force"*|*"push -f"*)
    echo '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"ask","permissionDecisionReason":"This force-pushes and can overwrite others'\'' work."}}'
    ;;
esac
```

```sh
chmod +x safe-git/hooks/check-push.sh
```

## Step 5: Try it

Load the folder for one run without installing it:

```sh
nora --plugin-dir ./safe-git
```

Ask the agent to force-push a branch: it stops and asks you first. When you are happy, install it for good:

```sh
nora plugins add ./safe-git
```

It now works in the app too; the approval shows up as a card in the conversation.

## Next steps

- [Plugin layout](./layout.md): agents, commands and MCP servers.
- [Hooks](./hooks.md): every event and decision.
- [Publishing](./publishing.md): share it.
