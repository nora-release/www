# Publishing

Share a plugin by putting it in a Git repository, then let people install it directly or through a marketplace.

## Install straight from GitHub

Anyone can install a plugin from its repository:

```sh
nora plugins add owner/repo
nora plugins add owner/repo@v1.2.0          # a tag or branch
nora plugins add owner/repo#plugins/my-tool # a plugin in a subfolder
```

Tag releases so users can pin a version.

## Make a marketplace

A marketplace is a repository with an index of plugins. Nora reads `.nora-plugin/marketplace.json`, and also `.claude-plugin/marketplace.json`, so a Claude Code marketplace works as it is.

```json
{
  "name": "acme-plugins",
  "owner": { "name": "Acme" },
  "plugins": [
    { "name": "safe-git", "source": "./plugins/safe-git", "description": "Asks before force-pushing." },
    { "name": "release-notes", "source": "./plugins/release-notes", "description": "Writes release notes." }
  ]
}
```

Users add it once and install by name:

```sh
nora plugins marketplace add acme/plugins
nora plugins add safe-git
```

## Checklist

- `nora plugin validate` passes.
- A `README.md` that says what the plugin does and what it runs.
- A clear `description` in the manifest.
- Only the `permissions` you need, listed honestly.
- Hooks that fail safe: when unsure, ask rather than allow.
