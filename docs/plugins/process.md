# Process plugins

A process plugin is a program, in any language, that Nora starts and talks to over standard input and output. It is how a plugin adds tools the agent can call.

## Protocol

Messages are JSON-RPC 2.0, one per line. Nora initializes the plugin, asks for its tools, calls them, and can cancel a call or shut the plugin down. Frames are at most 1 MiB, and up to 32 requests can be in flight at once.

The full protocol, and SDKs for **Rust**, **Go** and **Swift** with runnable echo examples, are in [nora-release/plugin-kit](https://github.com/nora-release/plugin-kit).

## Lifecycle

| Moment | What happens |
| --- | --- |
| First message | The plugin starts with the first message of a conversation that can use it, and stays up for the whole conversation. |
| Working directory | Its own data folder, which survives updates. The installed files are never written to. |
| Crash | Nora restarts it before the next turn, up to three times in a row with growing delays. A plugin that then runs for a minute counts as healthy again. |
| Idle | When a conversation goes idle, its plugins shut down after finishing work in progress. |

## Tools

Declare each tool in the [manifest](./manifest.md) with a JSON Schema for its input. The tools the program reports must match the manifest exactly, or Nora refuses to publish them, so the agent never sees a tool you did not declare.

## Test locally

```sh
nora --plugin-dir ./my-plugin
```
