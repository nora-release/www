# One-shot mode

`nora -p` runs one prompt, prints the reply and exits. Use it in scripts, Git hooks and CI.

```sh
nora -p "summarize the changes on this branch"
git diff | nora -p "review this diff"
nora -p < prompt.txt
```

## Output formats

| Format | Use |
| --- | --- |
| `plain` | The reply as text (default). |
| `json` | One JSON object with the reply and metadata. |
| `streaming-json` | Events as JSON lines while the agent works. |
| `streaming-messages-json` | Message-level events; add `--include-partial-messages` for incremental text. |

```sh
nora -p "list the public API" --output-format json
```

### Structured output

Make the reply match a JSON Schema:

```sh
nora -p "extract the version and release date from CHANGELOG.md" \
  --json-schema '{"type":"object","properties":{"version":{"type":"string"},"date":{"type":"string"}},"required":["version","date"]}'
```

## Limits and tools

| Option | Effect |
| --- | --- |
| `--max-turns <n>` | Stop after this many model turns. |
| `--tools <names>` | Allow only these tools. |
| `--disallowed-tools <names>` | Remove these tools. |
| `--no-wait-for-background` | Exit after the first turn instead of waiting for background tasks. |
| `--background-wait-timeout <s>` | Wait at most this long for background tasks (default 600). |

## Prompt files and images

```sh
nora --prompt-file task.md
```

`--prompt-json` takes an array of [ACP](https://agentclientprotocol.com) content blocks: `text` blocks, and `image` blocks with base64 `data` and a `mimeType`.

```sh
nora --prompt-json "[{\"type\":\"text\",\"text\":\"What is in this screenshot?\"},{\"type\":\"image\",\"mimeType\":\"image/png\",\"data\":\"$(base64 -i shot.png)\"}]"
```

## Instructions

| Option | Effect |
| --- | --- |
| `--rules <text>` | Append extra rules. Repeatable. |
| `--system-prompt-override <text>` | Replace the system prompt. |
| `--agent <name-or-path>` | Use an agent definition. |
