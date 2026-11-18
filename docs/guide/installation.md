# Installation

Nora ships as a single download for macOS. The `nora` command comes inside the app.

## Download

1. Download the latest `.dmg` from [nora.elonehoo.me](https://nora.elonehoo.me/#download).
2. Open it and drag **Nora** into **Applications**.
3. Open Nora from Applications, Launchpad or Spotlight.

Nora needs a Mac with Apple silicon and macOS 14 or later.

## Updates

Nora checks for updates on its own while **Auto check for updates** is on in **Settings › About**, and you can click **Check for Updates** there or in the menu bar menu at any time. Every release is described in the [changelog](https://nora.elonehoo.me/changelog).

## Install the command line

1. Open **Settings › About**.
2. Click **Install nora Command**.

Nora links `nora` into `~/.local/bin`. If your shell does not search that folder yet, add this line to `~/.zshrc`:

```sh
export PATH="$HOME/.local/bin:$PATH"
```

Open a new terminal and check:

```sh
nora --version
```

See the [CLI overview](../cli/) for what it can do.

## Permissions

macOS asks for some permissions the first time a feature needs them. You can grant most of them in **[Settings › Access](../settings/access.md)** and review all of them in **System Settings › Privacy & Security**.

| Permission | Needed for |
| --- | --- |
| Accessibility | [Computer use](../features/computer-use.md): reading and operating other apps. |
| Screen Recording | Letting the agent see other apps' windows during computer use. |
| Microphone | Voice input in the composer. |
| Full Disk Access | Working with files in protected places, such as Mail or Safari data. |

## Uninstall

1. Quit Nora.
2. Move **Nora** from Applications to the Trash.
3. To remove your data too, delete `~/Library/Application Support/Nora`.
4. If you installed the command, delete `~/.local/bin/nora` and the command's own data in `~/.nora`.

::: warning
Deleting `~/Library/Application Support/Nora` removes your conversations, memories and provider accounts. It cannot be undone.
:::
