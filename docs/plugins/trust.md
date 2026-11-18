# Trust and updates

## Plugins are trusted code

A plugin that runs programs (tools, hooks, MCP servers, provider programs) runs them as you. It can read and write the files you can, use the network, and read your credentials. Nora does not sandbox plugins; you decide whether to trust one when you install it.

::: warning
Trusting a plugin means letting it do anything you could do on this Mac. Install plugins that run code only from sources you trust.
:::

## What needs your approval

| Plugin | What happens |
| --- | --- |
| Only skills, prompts and settings | Works as soon as it is installed. |
| Runs a program | Asks you to trust it before its code runs the first time. |
| Native app plugin | Runs in the App Sandbox. From Nora's official catalog it is checked against the reviewed checksum; from anywhere else it must be signed with a Developer ID and notarized by Apple. |

Trust is tied to the exact content you approved. If an update turns a plugin that only had skills into one that runs code, Nora asks again.

The `permissions` a plugin lists, such as network hosts, describe what it says it needs. They are shown when you install it, but they are not enforced by macOS.

## Hooks that ask first

A plugin hook can ask for your approval before a tool runs, for example before a command that deletes files. The request appears as a card in the conversation with the hook's reason. The tool runs only if you approve. If you stop the turn, the request is withdrawn and the tool does not run. See [hooks](./hooks.md).

## Updates

With **Update plugins automatically** on in **[Settings › About](../settings/about.md)**, plugins from Nora's official sources update themselves. Other plugins update when you ask, from the Plugins page or with:

```sh
nora plugins update <name>
```

An update keeps the trust rules of the source it came from, and every download is checked against its SHA-256 digest before it is installed.

## Change trust later

```sh
nora plugins trust <name>
nora plugins untrust <name>
```
