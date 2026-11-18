# MCP servers

The [Model Context Protocol](https://modelcontextprotocol.io) lets the agent use tools from other programs and services: a database, an issue tracker, a design tool. Nora connects to MCP servers over **stdio** (a local command) or **Streamable HTTP**.

## Add a server

1. Open **[Settings › Tools](../settings/tools.md)** and click **Add MCP Server**.
2. Choose the transport:
   - **stdio**: enter the **Command**, its arguments and any **Environment** variables.
   - **Streamable HTTP**: enter the **Server URL** and any **HTTP Headers**.
3. Click **Save**. Nora connects and lists the server's tools.

Environment values, headers and tokens are stored in the macOS Keychain and passed only to that server.

## Sign in with OAuth

For HTTP servers that use OAuth, choose **Sign In** on the Tools page and click **Save**; Nora opens the authorization page. A static bearer token, if you set one, takes precedence over OAuth.

## Grant access to tools

New tools are **disabled** until you allow them. For each tool, choose:

| Access | Meaning |
| --- | --- |
| Full Access | The agent may call the tool when it is allowed to make changes. |
| Read Only | The tool counts as read-only, so the agent may also call it while it is limited to reading, for example in plan mode. Choose this only for tools that really do not change anything. |
| Disabled | The agent cannot call the tool. |

When a server changes a tool, the changed tool goes back to disabled until you grant it again.

::: warning
Only connect to MCP servers you trust. A local stdio server runs as a program on your Mac with your permissions.
:::

## Servers from plugins

Plugins can bring MCP servers. They appear on the Tools page marked with the plugin's name. You can turn them on or off and set tool access; their command and address change only when the plugin updates.

## In the terminal

```sh
nora mcp add files npx -y @modelcontextprotocol/server-filesystem ~/Projects
nora mcp add tracker https://mcp.example.com/mcp --header "Authorization: Bearer $TOKEN"
nora mcp list
nora mcp doctor
```

| Option | Meaning |
| --- | --- |
| `-t, --transport` | `stdio`, `http` or `sse`. Guessed from the source when left out. |
| `-s, --scope` | `user` (default) or `project`. |
| `-e, --env KEY=value` | Environment variable for a stdio server. |
| `-H, --header "Name: value"` | Header for an HTTP server. |

## Troubleshooting

### "Cached · reconnect to run"

Nora shows the tools it saw last time, but the server is not connected. Click **Retry** on the Tools page, or check the command or URL.

### "The agent doesn't use my server"

Check that the server is enabled and that its tools are set to **Full Access** or **Read Only**.
