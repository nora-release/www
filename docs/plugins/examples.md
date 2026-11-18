# Plugin examples

Six complete plugins you can copy, each solving one real problem. Every one passes `nora plugin validate` and its scripts are tested against the input Nora actually sends.

| Example | What it shows |
| --- | --- |
| [protect-secrets](#protect-secrets) | Block a tool call with a `PreToolUse` hook. |
| [format-on-edit](#format-on-edit) | Act on a file after the agent changes it with `PostToolUse`. |
| [git-context](#git-context) | Add context to every message with `UserPromptSubmit`. |
| [tests-before-done](#tests-before-done) | Keep the agent working with a `Stop` hook. |
| [code-reviewer](#code-reviewer) | Ship a subagent and a command. |
| [sqlite-mcp](#sqlite-mcp) | Bundle an MCP server. |

To try one, save its files, make the scripts executable, and load the folder for a run:

```sh
chmod +x my-plugin/hooks/*.sh
nora plugin validate ./my-plugin
nora --plugin-dir ./my-plugin
```

The hook scripts use [`jq`](https://jqlang.org) to read their JSON input (`brew install jq`).

## protect-secrets

Stops the agent from reading `.env` files and private keys, whether it uses the read tool, the shell or search. Exit code `2` blocks the call, and the message on standard error tells the agent why.

```text
protect-secrets/
├── .nora-plugin/plugin.json
└── hooks/
    ├── hooks.json
    └── protect.sh
```

`protect-secrets/.nora-plugin/plugin.json`:

```json
{
  "name": "protect-secrets",
  "version": "1.0.0",
  "description": "Stops the agent from reading .env files and private keys."
}
```
`protect-secrets/hooks/hooks.json`:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Read|Bash|Grep",
        "hooks": [{ "type": "command", "command": "${CLAUDE_PLUGIN_ROOT}/hooks/protect.sh" }]
      }
    ]
  }
}
```
`protect-secrets/hooks/protect.sh`:

```sh
#!/bin/sh
# Blocks any tool call whose input mentions a secret file.
input=$(cat)
if printf '%s' "$input" | grep -Eq '\.env([."/ ]|$)|id_rsa|id_ed25519|\.pem"'; then
  echo "Reading secret files is blocked by the protect-secrets plugin." >&2
  exit 2
fi
```

## format-on-edit

Runs Prettier on every file the agent writes or edits, so its changes always match your formatting.

::: tip
Nora passes the file as `tool_input.path`; Claude Code calls it `tool_input.file_path`. Reading both keeps a hook working in both.
:::

`format-on-edit/.nora-plugin/plugin.json`:

```json
{
  "name": "format-on-edit",
  "version": "1.0.0",
  "description": "Runs Prettier on every file the agent writes or edits."
}
```
`format-on-edit/hooks/hooks.json`:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [{ "type": "command", "command": "${CLAUDE_PLUGIN_ROOT}/hooks/format.sh", "timeout": 30 }]
      }
    ]
  }
}
```
`format-on-edit/hooks/format.sh`:

```sh
#!/bin/sh
# Nora passes the file as tool_input.path; Claude Code uses tool_input.file_path.
file=$(jq -r '.tool_input.path // .tool_input.file_path // empty')
[ -n "$file" ] || exit 0
case "$file" in
  *.ts|*.tsx|*.js|*.jsx|*.json|*.css|*.md) npx --no-install prettier --write "$file" >/dev/null 2>&1 ;;
esac
exit 0
```

## git-context

Tells the agent which branch it is on and what is uncommitted, with every message you send. Anything a `UserPromptSubmit` hook returns as `additionalContext` is added to what the model sees.

`git-context/.nora-plugin/plugin.json`:

```json
{
  "name": "git-context",
  "version": "1.0.0",
  "description": "Tells the agent the current branch and uncommitted changes with every message."
}
```
`git-context/hooks/hooks.json`:

```json
{
  "hooks": {
    "UserPromptSubmit": [
      { "hooks": [{ "type": "command", "command": "${CLAUDE_PLUGIN_ROOT}/hooks/context.sh" }] }
    ]
  }
}
```
`git-context/hooks/context.sh`:

```sh
#!/bin/sh
cd "$(jq -r '.cwd')" 2>/dev/null || exit 0
git rev-parse --is-inside-work-tree >/dev/null 2>&1 || exit 0
branch=$(git branch --show-current)
changes=$(git status --short | head -20)
jq -n --arg context "Current Git branch: $branch
Uncommitted changes:
${changes:-none}" \
  '{hookSpecificOutput: {hookEventName: "UserPromptSubmit", additionalContext: $context}}'
```

## tests-before-done

When the agent is about to finish, this hook runs the tests. If they fail, it blocks the stop and hands the agent the failures to fix. On the second try in a row it lets the agent stop, so a test the agent cannot fix never loops forever.

`tests-before-done/.nora-plugin/plugin.json`:

```json
{
  "name": "tests-before-done",
  "version": "1.0.0",
  "description": "Keeps the agent working until the project's tests pass."
}
```
`tests-before-done/hooks/hooks.json`:

```json
{
  "hooks": {
    "Stop": [
      { "hooks": [{ "type": "command", "command": "${CLAUDE_PLUGIN_ROOT}/hooks/check.sh", "timeout": 600 }] }
    ]
  }
}
```
`tests-before-done/hooks/check.sh`:

```sh
#!/bin/sh
input=$(cat)
# Let the agent stop on the second try, so a test it cannot fix never loops forever.
if printf '%s' "$input" | jq -e '.stopHookActive // .stop_hook_active' >/dev/null; then
  exit 0
fi
cd "$(printf '%s' "$input" | jq -r '.cwd')" || exit 0
[ -f package.json ] || exit 0
if ! output=$(npm test --silent 2>&1); then
  jq -n --arg reason "The tests fail. Fix them before finishing:
$(printf '%s' "$output" | tail -40)" '{decision: "block", reason: $reason}'
fi
```

## code-reviewer

A read-only reviewer the main agent can hand work to, and a `review` command you can pick from the composer. The reviewer's `tools` list leaves out editing, so it can only look.

```text
code-reviewer/
├── .nora-plugin/plugin.json
├── agents/reviewer.md
└── commands/review.md
```

`code-reviewer/.nora-plugin/plugin.json`:

```json
{
  "name": "code-reviewer",
  "version": "1.0.0",
  "description": "A read-only reviewer agent and a /review command for the current changes."
}
```
`code-reviewer/agents/reviewer.md`:

```md
---
name: reviewer
description: Reviews code changes for bugs, risky patterns and missing tests. Use after making a change, before committing.
tools: Read, Grep, Glob, Bash
model: inherit
---

You are a careful code reviewer. You do not edit files.

1. Run `git diff` to see the changes.
2. Read the surrounding code for each change.
3. Report, most serious first:
   - bugs and edge cases the change misses;
   - security problems;
   - missing or weak tests.

Quote the file and line for each finding. If you find nothing serious, say so in one line.
```
`code-reviewer/commands/review.md`:

```md
---
description: Review the uncommitted changes in this repository.
---

Use the reviewer agent to review the uncommitted changes in this repository, then summarize its findings in a short list.
```

### Agent fields

| Field | Meaning |
| --- | --- |
| `name` | The agent's name. Defaults to the file name. |
| `description` | When the main agent should use it. |
| `tools` | Tools it may use, comma separated. Claude Code names work: `Read`, `Grep`, `Glob`, `Bash`, `Edit`, `Write`. |
| `disallowedTools` | Tools it may not use. |
| `model` | A model ID, or `inherit` (default) to use the conversation's model. |
| `effort` | Its reasoning level. |
| `maxTurns` | A limit on its turns. |

## sqlite-mcp

Bundles an MCP server, so installing the plugin gives the agent tools to query a SQLite database. The server appears in **Settings › Tools**, where you grant each of its tools.

`sqlite-mcp/.nora-plugin/plugin.json`:

```json
{
  "name": "sqlite-mcp",
  "version": "1.0.0",
  "description": "Lets the agent query a local SQLite database through an MCP server."
}
```
`sqlite-mcp/.mcp.json`:

```json
{
  "mcpServers": {
    "sqlite": {
      "command": "uvx",
      "args": ["mcp-server-sqlite", "--db-path", "./data/app.db"]
    }
  }
}
```

## Next steps

- [Hooks](./hooks.md): every event, its input and what it can decide.
- [Publishing](./publishing.md): share your plugin.
