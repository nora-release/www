# Choosing models

Each conversation uses one model, which you can change at any time. This page covers picking models and reasoning levels.

## Pick a model

Click the model button next to **Send** in the composer and choose a model. The choice applies to the conversation from the next message on.

## Reasoning level

Models that can think before answering offer reasoning levels. Higher levels take longer and use more tokens, and do better on hard, multi-step problems. Use a lower level for quick questions and small edits.

In the terminal, the levels are `off`, `minimal`, `low`, `medium` (default), `high`, `xhigh`, `max` and `ultra`:

```sh
nora --thinking high
```

## Show only the models you use

Providers can list dozens of models. In **Settings › AI Providers**, open a provider's models to turn each model on or off, or use **Turn All On** and **Turn All Off**. Turned-off models do not appear in the composer.

## Context and compaction

The ring next to the model button shows how full the model's context window is. When it gets close to full, Nora compacts older turns into a summary so the conversation can continue.

## List models in the terminal

```sh
nora models
nora -m <model-id> -p "…"
```
