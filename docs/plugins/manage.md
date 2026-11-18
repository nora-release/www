# Install and manage

Install plugins from the Plugins page in the app or with `nora plugins` in the terminal. Both manage the same installed plugins.

## In the app

1. Open the **Plugins** page.
2. Browse the catalog and open a plugin to read about it.
3. Click install. Nora shows what the plugin contains and what it will be able to run.
4. If the plugin runs code, confirm that you trust it.

Installed plugins can be turned off, updated or removed from the same page. Changes take effect without restarting Nora.

What a plugin contributes is configured where it belongs: its MCP servers in **[Settings › Tools](../settings/tools.md)**, its provider accounts in **[Settings › AI Providers](../settings/ai-providers.md)**.

## From the terminal

```sh
nora plugins list                  # installed plugins
nora plugins show <name>           # details and contributions
nora plugins add <source>          # install
nora plugins add <source> --trust  # install and trust its code
nora plugins update <name>
nora plugins enable <name>
nora plugins disable <name>
nora plugins remove <name>
nora plugins reload
```

## Plugin sources

| Source | Example |
| --- | --- |
| A name from a marketplace you added | `pdfs`, or `pdfs@nora-plugins` when two marketplaces share a name |
| A GitHub repository | `owner/repo`, `owner/repo@v1.2.0`, `owner/repo#plugins/pdfs` |
| A Git URL | `https://git.example.com/team/plugin.git` |
| A local folder | `./my-plugin`, `~/plugins/my-plugin` |

## Marketplaces

A marketplace is a catalog of plugins in a Git repository.

```sh
nora plugins marketplace add nora-release/plugins
nora plugins marketplace list
nora plugins marketplace update
nora plugins marketplace remove <source>
```

## Troubleshooting

### "A plugin's tools don't appear"

- Check the plugin is enabled.
- A plugin that runs code needs your trust before it starts.
- Two plugins offering a tool with the same name block each other's tool updates. Turn one of them off.

### "A plugin says it has no approved provider"

The plugin asks for a service no other plugin and no part of Nora provides. It cannot start until something provides it.
