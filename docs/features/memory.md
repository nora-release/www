# Memory

Nora remembers useful details from your conversations, such as your preferences, conventions a project follows and decisions you made, and includes them in later conversations when they are relevant. Memories are stored on your Mac.

## How it works

1. With **Automatic memory** on, Nora reviews a conversation once it goes idle and saves what is worth keeping.
2. When you start a new conversation, Nora includes the memories that are relevant to it.
3. You can review, edit, pause or delete any memory in **[Settings › Memory](../settings/memory.md)**.

## Kinds of memories

| Property | Values |
| --- | --- |
| Source | **Automatic** (saved by Nora) or **Manual** (added by you). |
| Duration | **Long-term**, or **Temporary**: forgotten after it expires. |
| State | **Enabled**, or paused: kept, but not used in conversations. |
| Tags | Free-form labels to group and find memories. |

## Add a memory yourself

1. Open **Settings › Memory** and click **Add Memory**.
2. Write it as a plain statement: "I prefer pnpm over npm." "The staging database is read-only."
3. Add tags if you like, mark it temporary if it should expire, and click **Save**.

You can also just tell the agent "remember that…" in a conversation.

## Turn memory off

Switch off **Automatic memory** in **Settings › Memory** to stop Nora saving new memories. To stop a single memory being used, turn off **Use in conversations** on it.

## Clear memories

**Settings › Memory › Clear All Memories** removes every memory and pending memory task. Conversation history is not deleted.

In the terminal:

```sh
nora memory clear --workspace   # memories for this folder
nora memory clear --global      # memories about you
nora memory clear --all
```

## Best practices

- Keep memories short and factual, one idea each.
- Put project rules that everyone should follow in the project's `AGENTS.md` instead; memory is for things about you and your way of working.
- Never store passwords or keys in a memory.

## Troubleshooting

### "Nora didn't remember something"

- Check that **Automatic memory** is on.
- Memories are saved after a conversation goes idle, not while it is running.
- Look for the memory in **Settings › Memory** and make sure it is not paused or expired.

### "A memory is wrong"

Edit or delete it in **Settings › Memory**. Nora uses the corrected version from the next conversation on.
