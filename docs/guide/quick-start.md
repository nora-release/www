# Quick start

Go from a fresh install to a finished task in about five minutes.

## Step 1: Add a provider

1. Open **Settings** with <kbd>⌘</kbd> <kbd>,</kbd> and choose **AI Providers**.
2. Click **Add Provider**.
3. Either search the **Preset** tab and paste an API key, or use the **Accounts** tab to sign in with a subscription.

### Example: Anthropic with an API key

1. Create a key in the [Anthropic Console](https://console.anthropic.com/).
2. In **Add Provider › Preset**, search for **Anthropic** and paste the key.
3. Click **Add Provider**. Nora lists the models the key can use.

::: tip
Already pay for ChatGPT, GitHub Copilot or Grok? Install its provider plugin and sign in instead of using a key. See [subscription sign-ins](../providers/sign-ins.md).
:::

## Step 2: Add a project

A project is a folder the agent works in: a repository, a documents folder, anything.

1. Open **Settings › Projects**.
2. Click **Add Project** and choose the folder.
3. Click **Save**.

The project appears in the sidebar with its conversations under it.

## Step 3: Ask for something

Start a new chat with <kbd>⌘</kbd> <kbd>N</kbd> and describe the outcome you want:

```text
The login test fails about one run in ten. Find out why and fix it.
```

Nora shows each step as it happens: the files it reads, the commands it runs and the changes it makes, as diffs you can open.

## Step 4: Steer it

- **Add more** at any time. Messages you send while the agent works wait in a queue and go in when the current step ends.
- **Stop** a run from the composer.
- **Plan first**: choose **+ › Plan** to get a plan you approve before anything changes. See [plan mode](../features/plan-mode.md).
- **Keep going**: choose **+ › Goal** for work that should continue until it is done. See [goals](../features/goals.md).

## Step 5: Pick your model

Choose the model and how hard it should think from the button next to **Send**. Higher reasoning levels take longer and cost more, and do better on hard problems.

## Keyboard shortcuts to know

| Action | Shortcut |
| --- | --- |
| Open Nora from any app | <kbd>⌘</kbd> <kbd>D</kbd> |
| New chat | <kbd>⌘</kbd> <kbd>N</kbd> |
| History | <kbd>⌘</kbd> <kbd>H</kbd> |
| Search the conversation | <kbd>⌘</kbd> <kbd>F</kbd> |
| Voice input | <kbd>⌃</kbd> <kbd>M</kbd> |
| Settings | <kbd>⌘</kbd> <kbd>,</kbd> |

## Next steps

- [The chat window](./chat.md): everything in a conversation.
- [Tools and permissions](../features/tools.md): what the agent may do.
- [Memory](../features/memory.md): teach Nora about you once.
