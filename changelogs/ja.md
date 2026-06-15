# v0.0.12

- Release build に同梱される Nora helper に署名を追加しました。
- Sandbox VM resources のパッケージングを安定させ、release assets が必要な runtime resources を正しく持てるようにしました。
- Release 用の Node、pnpm、cache、keychain fallback の流れを更新しました。

# v0.0.11

- Default provider usage の精度を改善しました。
- SQLite migration で workspace state が保持されるよう修正しました。
- Light theme preview と welcome logo の表示を修正しました。

# v0.0.10

- モデル設定を JSON files から SQLite-backed storage に移行しました。
- AppProviderStore を統合し、model provider 管理をより一貫した形にしました。
- xAI と Grok の OAuth model handling を修正しました。
- Safe workspace tools を connector 経由にし、Swift から macOS bridge tools を接続しました。
- Notarization の失敗が見えやすくなるようにし、release version script を改善しました。

# v0.0.9

- Release publishing を強化しました。
- Release workflows を Blacksmith runners に移行しました。

# v0.0.8

- Build scripts と Git panel の repository resolver を改善しました。
- PanelHoverIconButton を追加し、panel button の見た目と hover effect を統一しました。
- Build workflows で使う Go toolchain source handling を復元しました。

# v0.0.7

- Chat と upload 周りの SF Symbols を custom HugeIcons に置き換えました。
- xAI model support と OAuth integration を追加しました。
- Permission selector の localization と tests を改善しました。
- Diff preview components、layout options、Git panel commit preview を追加しました。

# v0.0.6

- Notarization process に secure timestamp verification を追加しました。

# v0.0.5

- `libNoraTerminal.dylib` の code signing を secure timestamp handling 付きで改善しました。

# v0.0.4

- Release workflow に Zig setup と terminal package testing を追加しました。

# v0.0.3

- Workspace panel tabs と lazy file loading を改善しました。
- Chat file previews を workspace panel 経由にしました。
- Custom AI provider support を追加し、provider settings UI を改善しました。
- Terminal capability environment と inline image protocol を改善しました。
- Windows ConPTY path を削除し、macOS terminal configuration を調整しました。

# v0.0.2

- Release asset naming、appcast release notes、public release publishing を改善しました。
- Terminal tabs、working directory controls、より整理された chat header controls を追加しました。
- Floating panel controls、local image attachment previews、window title layout を改善しました。

# v0.0.1

- Nora の最初の tagged release です。
- GitHub release workflow と publish scripts を追加しました。
- Local AI chat と agent workflows のための macOS desktop app の初期基盤を整えました。
