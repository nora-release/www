# Hooks

Hooks are commands a plugin runs at points in the agent's work: before a tool call, after it, when you send a prompt, when a turn ends. They can add context, block an action, or ask you to approve it.

Nora reads hooks in the Claude Code format, so existing hooks work unchanged.

## Configure hooks

Put them in `hooks/hooks.json` in your plugin:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash|Write|Edit",
        "hooks": [
          { "type": "command", "command": "${CLAUDE_PLUGIN_ROOT}/hooks/guard.sh", "timeout": 30 }
        ]
      }
    ]
  }
}
```

| Key | Meaning |
| --- | --- |
| Event name | When the hooks run; see the list below. |
| `matcher` | A regular expression for the tool name. Claude Code names such as `Bash`, `Read`, `Edit` and `Write` work. Ignored for prompt and stop events. |
| `type` | `command` runs a program; `http` posts to a URL. |
| `command` | The program to run. It gets the event as JSON on standard input. |
| `timeout` | Seconds before the hook is stopped. |

## Events

| Event | When it runs |
| --- | --- |
| `SessionStart` | A session starts. |
| `UserPromptSubmit` | You send a message, before the model sees it. |
| `PreToolUse` | Before a tool call. Can allow, block or ask. |
| `PostToolUse` | After a tool call succeeds. |
| `PostToolUseFailure` | After a tool call fails. |
| `SubagentStart`, `SubagentStop` | A subagent starts or finishes. |
| `Stop` | The agent is about to end its turn. Can make it continue. |
| `PreCompact`, `PostCompact` | Around compacting the conversation. |
| `Notification` | Nora sends a notification. |
| `SessionEnd` | A session ends. |

## Input

Each hook receives a JSON object on standard input. Common fields:

| Field | Meaning |
| --- | --- |
| `hook_event_name` | The event. |
| `session_id` | The session. |
| `cwd` | The working directory. |
| `tool_name`, `tool_input` | For tool events. |
| `tool_response` | For `PostToolUse`. |
| `prompt` | For `UserPromptSubmit`. |

## Decisions

A hook decides with its exit code or with JSON on standard output.

| Hook output | Effect |
| --- | --- |
| Exit code `0`, no output | Carry on. |
| Exit code `2` | Block. What the hook wrote to standard error is shown to the agent as the reason. |
| `"permissionDecision": "deny"` | Block the tool call. |
| `"permissionDecision": "ask"` | Ask you first. In the app this is a card in the conversation. |
| `"permissionDecision": "allow"` | Allow the call. |
| `"decision": "block"` | For `Stop` and prompt events: block with a reason. |
| `"additionalContext"` | Add text to what the model sees. |

`PreToolUse` decisions go inside `hookSpecificOutput`:

```json
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "ask",
    "permissionDecisionReason": "This deletes the build folder."
  }
}
```

If you stop a turn while an approval is waiting, the request is withdrawn and the tool does not run.

## In the app and in the terminal

In the app, only hooks from installed plugins run. The `nora` command can additionally run hooks you configure for yourself or for a project.
