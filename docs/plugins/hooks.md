# Hooks

Hooks are programs a plugin runs at points in the agent's work: before a tool call, after it, when you send a message, when the agent is about to finish. A hook can add context for the model, block an action, ask you to approve it, or make the agent keep going.

Nora reads hooks in the Claude Code format, so existing hooks work, with a few [differences](#differences-from-claude-code) worth knowing.

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
| Event name | When the hooks run. One of the [events](#events) below. |
| `matcher` | A regular expression for the tool name, for tool events. Claude Code names (`Bash`, `Read`, `Edit`, `Write`, `Grep`, `Glob`) and Nora's own names (`bash`, `read`, `edit`, `write`) both work. Leave it out to match every tool. |
| `type` | `command` runs a program. `http` posts the input to a URL. |
| `command` | The program to run. `${CLAUDE_PLUGIN_ROOT}` (or `${NORA_PLUGIN_ROOT}`) is the plugin's folder. |
| `timeout` | Seconds before the hook is stopped. |

## How a hook talks to Nora

1. Nora starts the program and writes the event as one JSON object to its **standard input**.
2. The program decides with its **exit code** and, optionally, **JSON on standard output**.

| The hook… | Effect |
| --- | --- |
| exits `0` with no output | Nothing changes; the work carries on. |
| exits `2` | Blocks the action. What it wrote to standard error is shown to the agent as the reason. |
| exits `0` and prints JSON | Nora reads the decision from the JSON, as described for each event. |
| exits with another code | The hook failed. Nora shows the error and carries on. |

Every event's input includes:

| Field | Meaning |
| --- | --- |
| `hook_event_name` | The event, for example `PreToolUse`. |
| `session_id` | The conversation's session. |
| `cwd` | The agent's working directory. |
| `workspaceRoot` | The project's root folder. |
| `permissionMode` | The current permission mode. |
| `timestamp` | When the event happened. |

## Events

| Event | When | Can it change anything? |
| --- | --- | --- |
| [`SessionStart`](#sessionstart) | A session starts. | No |
| [`UserPromptSubmit`](#userpromptsubmit) | You send a message. | Add context, or block the message |
| [`PreToolUse`](#pretooluse) | Before a tool call. | Allow, block or ask you |
| [`PostToolUse`](#posttooluse) | After a tool call succeeds. | Add context, or flag a problem |
| [`PostToolUseFailure`](#posttoolusefailure) | After a tool call fails. | Add context |
| [`Stop`](#stop) | The agent is about to finish its turn. | Make it keep going |
| [`SubagentStart`, `SubagentStop`](#subagentstart-and-subagentstop) | A subagent starts or finishes. | `SubagentStop` can make it keep going |
| [`PreCompact`, `PostCompact`](#precompact-and-postcompact) | Around compacting the conversation. | No |
| [`Notification`](#notification) | Nora notifies you. | No |
| [`SessionEnd`](#sessionend) | A session ends. | No |

### SessionStart

Runs when a session starts. Use it to prepare something, such as warming a cache or starting a helper.

| Input | Meaning |
| --- | --- |
| `source` | How the session started. |

### UserPromptSubmit

Runs when you send a message, before the model sees it. Has no `matcher`.

| Input | Meaning |
| --- | --- |
| `prompt` | The message you sent. |

| Output | Effect |
| --- | --- |
| `hookSpecificOutput.additionalContext` | Text added to what the model sees with your message. |
| `"decision": "block"` with a `reason` | The message is not sent; the reason is shown. |

Example: add the current branch to every message. See [git-context](./examples.md#git-context).

```json
{
  "hookSpecificOutput": {
    "hookEventName": "UserPromptSubmit",
    "additionalContext": "Current Git branch: fix/login"
  }
}
```

### PreToolUse

Runs before a tool call. The most useful hook for safety rules.

| Input | Meaning |
| --- | --- |
| `tool_name` | Nora's tool name, such as `bash`, `read`, `edit` or `write`. |
| `tool_input` | The call's arguments, for example `command` for `bash` and `path` for file tools. |
| `tool_use_id` | The call's ID. |

| Output | Effect |
| --- | --- |
| exit code `2` | Block the call. |
| `permissionDecision: "deny"` | Block the call; `permissionDecisionReason` tells the agent why. |
| `permissionDecision: "ask"` | Ask you first. In the app, a card with the reason appears in the conversation; the call runs only if you approve. |
| `permissionDecision: "allow"` | Allow the call. |
| `permissionDecision: "defer"` | Leave it to Nora's normal permissions. |

```json
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "ask",
    "permissionDecisionReason": "This deletes the build folder."
  }
}
```

If you stop the turn while an approval is waiting, the request is withdrawn and the call does not run. See [protect-secrets](./examples.md#protect-secrets) for a blocking hook.

### PostToolUse

Runs after a tool call succeeds.

| Input | Meaning |
| --- | --- |
| `tool_name`, `tool_input`, `tool_use_id` | As for `PreToolUse`. |
| `tool_response` | What the tool returned. |

| Output | Effect |
| --- | --- |
| `hookSpecificOutput.additionalContext` | Text added for the model, for example lint results. |
| exit code `2` or `"decision": "block"` | Tells the agent something is wrong with the result, with the reason. |

See [format-on-edit](./examples.md#format-on-edit).

### PostToolUseFailure

Runs after a tool call fails. Its input adds the `error`. It can return `additionalContext`, for example a hint about the usual cause.

### Stop

Runs when the agent is about to end its turn. Has no `matcher`.

| Input | Meaning |
| --- | --- |
| `stopHookActive` | `true` when the agent is already continuing because a `Stop` hook blocked it before. |
| `lastAssistantMessage` | The start of the agent's final answer. |

| Output | Effect |
| --- | --- |
| `"decision": "block"` with a `reason` | The agent keeps working, with the reason as its next instruction. |

::: warning
Check `stopHookActive` and let the agent stop when it is `true`, or a goal the agent cannot reach will loop forever. See [tests-before-done](./examples.md#tests-before-done).
:::

### SubagentStart and SubagentStop

Run when a subagent starts and finishes. Their input adds `subagentType` and `agentId`. `SubagentStop` can block like `Stop` to make the subagent keep going.

### PreCompact and PostCompact

Run before and after Nora compacts the conversation to free context. Their input adds `trigger`, what caused the compaction.

### Notification

Runs when Nora notifies you. Its input adds `notificationType`, such as `permission_prompt` when approval is needed or `idle_prompt` when a turn ends, and a `message`. Use it to forward notifications elsewhere.

### SessionEnd

Runs when a session ends. Its input adds the `reason`. Use it to clean up.

## Differences from Claude Code

| | Claude Code | Nora |
| --- | --- | --- |
| Tool names in `tool_name` | `Bash`, `Read`, `Edit` | `bash`, `read`, `edit` (matchers accept both) |
| File path in `tool_input` | `file_path` | `path` |
| Stop loop flag | `stop_hook_active` | `stopHookActive` |

Read both spellings, for example `jq -r '.tool_input.path // .tool_input.file_path'`, and one hook works in both.

## Where hooks run

In the app, only hooks from installed plugins run. The `nora` command can also run hooks you configure for yourself or for a project.

## Test a hook

Run the script by hand with a sample input:

```sh
echo '{"tool_name":"read","tool_input":{"path":"config/.env"}}' | ./hooks/protect.sh
echo $?   # 2 means blocked
```

Then load the plugin for a run with `nora --plugin-dir ./my-plugin`.
