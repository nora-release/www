# Install

The `nora` command ships inside the app.

1. Open **Settings › About**.
2. Click **Install nora Command**.

Nora links `nora` into `~/.local/bin`. If your shell does not search that folder, add it to `~/.zshrc`:

```sh
export PATH="$HOME/.local/bin:$PATH"
```

Check it:

```sh
nora --version
nora doctor        # what your terminal supports
```

## Sign-ins are shared

`nora` reads provider accounts from the app, so there is nothing to sign in to again. `nora login` shows where each provider is signed in.

## Shell completions

```sh
nora completions zsh > ~/.zfunc/_nora
```

Also available for `bash`, `fish`, `powershell` and `elvish`.

## Updates

The command is part of the app and updates with it.
