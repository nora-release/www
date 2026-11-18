# Goals

A goal is an objective the agent keeps pursuing across turns, instead of a prompt it answers once. After each turn it checks its progress, and it stops when the goal is met.

## Start a goal

Click **+ › Goal**, or type the command in the composer:

```text
/goal Make every test in packages/api pass
```

## Check on it or stop it

| Command | What it does |
| --- | --- |
| `/goal` or `/goal status` | Shows the objective and how far the agent has come. |
| `/goal clear` | Stops working toward the goal. |

A goal belongs to its conversation. You can still send messages while it runs; they steer the next turn.

## Good goals

- **Checkable**: "all tests in `packages/api` pass" beats "improve the API".
- **Bounded**: name the folder, service or files involved.
- **One at a time**: a conversation has one goal; start another conversation for a second.
