# Computer use

Some work happens in apps without a command line. With computer use, the agent reads an app's interface through macOS Accessibility and operates it: clicking buttons, choosing menu items and typing into fields.

## Turn it on

Computer use needs the **Accessibility** permission, and **Screen Recording** to see other apps' windows. Nora asks for them the first time the agent wants to operate an app. Screen Recording can also be granted in **[Settings › Access](../settings/access.md)**, and both in **System Settings › Privacy & Security**.

Before the agent starts operating apps, Nora asks you to approve it.

## How it works

The agent works from a structured snapshot of the app's interface, its buttons, fields and menus by name, rather than guessing from pixels. It can act in apps in the background while you keep working.

## Tips

- Name the app and describe the result: "In Numbers, add a total row to the Budget sheet" works better than "update my budget".
- Prefer a command-line tool or MCP server when one exists; it is faster and more reliable.
