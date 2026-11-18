# Scheduled tasks

Ask the agent to do something later, once or on a repeat: check a deploy in ten minutes, summarize new issues every morning, watch a build until it finishes.

## Create one

Ask in plain words:

```text
Every 30 minutes, check whether the nightly import has finished and tell me when it has.
```

The agent creates the schedule. Each run happens in its own helper agent, which does the task, reports briefly and stops.

## Rules

| Rule | Value |
| --- | --- |
| Shortest interval | 1 minute |
| Kinds | Repeating, or once after a delay |
| Expiry | 7 days |
| Maximum | 50 tasks at a time |

Tasks run while their conversation's session is open. A task can be made durable so it survives restarting and resuming the session.

## See and remove them

Click **+ › Schedule** in the composer to list scheduled tasks and delete them. Turn on **Show scheduled task notifications** in **[Settings › Notifications](../settings/notifications.md)** to be told when one runs.
