# Editors and ACP

`nora` speaks the [Agent Client Protocol](https://agentclientprotocol.com) (ACP), so editors and other programs that support ACP can use Nora as their agent.

## Over standard input and output

Most editors start the agent themselves. Point the editor's agent command at:

```sh
nora agent stdio
```

## Over a WebSocket

Run the agent as a long-lived local server:

```sh
nora agent serve --bind 127.0.0.1:7878 --secret "$NORA_SECRET"
```

Clients connect to `/ws`. Use `--secret` whenever the address is reachable by anything but you.

## Manage running servers

```sh
nora leader list
nora leader info --pid <pid>
nora leader kill
```
