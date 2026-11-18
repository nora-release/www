# Skills

A skill is a folder of instructions, and optionally scripts and reference files, that teaches the agent how to do one kind of task: working with PDFs, writing release notes, following your team's review checklist.

The agent sees each skill's name and description and loads the full skill only when a task calls for it, so having many skills does not crowd its context.

## Use a skill

- **Automatically**: describe the task; the agent picks a matching skill.
- **By hand**: click **+** in the composer and pick a skill under **Skills** to use it for that message.

## Where skills come from

| Kind | Where | Managed in |
| --- | --- | --- |
| Built-in | Ship with Nora. | **Settings › Built-in Skills** |
| Custom | Skills you import or write. | **Settings › My Skills** |
| Synced | Folders you choose, such as a shared team folder. Nora links their skills in and leaves the source files alone. | **Settings › Synced Skills** |
| Plugin | Skills inside an installed [plugin](../plugins/). | The Plugins page |

See [Settings › Skills](../settings/skills.md) for each page.

## Write a skill

A skill is a folder with a `SKILL.md` file:

```text
release-notes/
├── SKILL.md
└── template.md
```

```md
---
name: release-notes
description: Write release notes from pull requests merged since the last tag, in this repository's style.
---

# Release notes

1. List pull requests merged since the last tag with `gh pr list --state merged`.
2. Group them into Added, Changed and Fixed.
3. Write one plain sentence per change, in the past tense.
4. Fill in `template.md` and save it as `RELEASE_NOTES.md`.
```

| Field | Purpose |
| --- | --- |
| `name` | A short, unique identifier. |
| `description` | When the skill applies. The agent decides from this, so be specific. |

Put the skill folder in **My Skills** (use **Open Skills Folder** or **Import**), in a synced folder, or in a plugin.

## Tips

- One skill, one job. Split big workflows into several skills.
- Reference supporting files by relative path; the agent reads them when it needs them.
- Skills written for Claude Code use the same format and work as they are.
