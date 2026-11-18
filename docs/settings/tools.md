# Tools

Extra tools for the agent: online search, media generation and MCP servers. See [tools and permissions](../features/tools.md) for the agent's built-in tools.

## Online Search

| Setting | What it does |
| --- | --- |
| Web search | Lets the agent search the web. |
| X search | Lets the agent search X. |

Search runs through the selected model's provider and may count toward that provider's usage. Each is available only when the model supports it.

## Generation

| Setting | What it does |
| --- | --- |
| Default Image Model | The model the image generation tool uses. |
| Default Video Model | The model the video generation tool uses. |

These appear only when one of your providers offers image or video models; otherwise the page shows **No generation tools available**.

## MCP Servers

| Action | How |
| --- | --- |
| Add | **Add MCP Server**, then choose **stdio** (command, arguments, environment) or **Streamable HTTP** (server URL, headers, OAuth). |
| Sign in | **Sign In** for servers that use OAuth, then **Save** to open the authorization page. |
| Grant tools | Set each tool to **Full Access**, **Read Only** or **Disabled**. New or changed tools stay disabled until you grant them. |
| Turn off | Switch the server off to stop it without removing it. |
| Remove | **Remove**, then **Save**. This disconnects it and deletes its stored secrets. |

Environment values, headers and tokens are stored in the macOS Keychain. Servers from plugins are listed here too, marked with the plugin's name. See [MCP servers](../features/mcp.md).
