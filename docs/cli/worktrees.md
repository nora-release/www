# Worktrees

A worktree gives a task its own copy of your repository on a separate branch. The agent can work without touching your checkout, and several tasks can run side by side.

## Start a task in a worktree

```sh
nora -w                    # a new worktree with a generated name
nora -w fix-login          # a named one
nora -w --ref main         # based on a particular branch or commit
```

## Review and bring changes back

```sh
nora worktree list
nora worktree show fix-login
nora worktree apply fix-login --dry-run   # preview
nora worktree apply fix-login             # merge the changes into your checkout
```

`--mode overwrite` replaces files instead of merging.

## Clean up

```sh
nora worktree rm fix-login
nora worktree gc --max-age 7d
```
