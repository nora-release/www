# Local models

Run models on your own Mac with a local server and use them in Nora like any other provider. Nothing leaves your Mac.

## Ollama

1. Install [Ollama](https://ollama.com) and pull a model:
   ```sh
   ollama pull qwen3-coder
   ```
2. In **Settings › AI Providers**, click **Add Provider** and search the **Preset** tab for **Ollama**. If it is not listed, use the **Custom** tab:

   | Field | Value |
   | --- | --- |
   | API format | OpenAI Chat Completions |
   | Base URL | `http://localhost:11434/v1` |
   | API Key | Any text, for example `ollama` |

3. Click **Add Provider**. Your pulled models appear in the list.

## LM Studio and others

Any server that offers an OpenAI-compatible API works the same way. For LM Studio, start its local server and use the base URL `http://localhost:1234/v1`.

## Tips

- Agent work needs models that handle tool calls well. Prefer models made for coding and tool use.
- Long agent sessions use a lot of context. Give the model the largest context window your Mac can hold.
