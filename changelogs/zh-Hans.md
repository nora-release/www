# v0.0.12

- 为 release build 中随包分发的 Nora helper 增加签名。
- 稳定 sandbox VM resources 的打包方式，让 release assets 能正确携带运行所需资源。
- 更新 release 使用的 Node、pnpm、cache 和 keychain fallback 流程。

# v0.0.11

- 提高 default provider usage 的统计准确性。
- 修复 SQLite migration 中 workspace state 被保留的问题。
- 修复 light theme preview 和 welcome logo 的显示细节。

# v0.0.10

- 将模型配置从 JSON 文件迁移到 SQLite 存储。
- 接入 AppProviderStore，让模型提供商管理更一致。
- 修复 xAI 和 Grok OAuth 模型处理。
- 将 safe workspace tools 通过 connector 路由，并从 Swift 连接 macOS bridge tools。
- 改进 notarization 错误可见性和 release version 脚本。

# v0.0.9

- 加固 release publishing 流程。
- 将 release workflows 迁移到 Blacksmith runners。

# v0.0.8

- 改进 build scripts 和 Git panel 的 repository resolver。
- 增加统一的 PanelHoverIconButton，让 panel 按钮样式和 hover 效果更一致。
- 恢复 build workflows 使用的 Go toolchain source 处理。

# v0.0.7

- 将 chat 和 upload 相关界面的 SF Symbols 替换为自定义 HugeIcons。
- 增加 xAI 模型支持和 OAuth 集成。
- 改进 permission selector 的本地化和测试。
- 增加 diff preview 组件、布局选项和 Git panel commit preview。

# v0.0.6

- 为 notarization 流程增加 secure timestamp verification。

# v0.0.5

- 改进 `libNoraTerminal.dylib` 的 code signing，并加入 secure timestamp handling。

# v0.0.4

- 在 release workflow 中加入 Zig setup 和 terminal package testing。

# v0.0.3

- 改进 workspace panel tabs 和 lazy file loading。
- 将 chat file previews 路由到 workspace panel。
- 增加 custom AI provider 支持，并改进 provider settings UI。
- 改进 terminal capability environment 和 inline image protocol。
- 移除 Windows ConPTY 路径，并收紧 macOS terminal configuration。

# v0.0.2

- 改进 release asset 命名、appcast release notes 和 public release publishing。
- 增加 terminal tabs、working directory controls 和更清晰的 chat header controls。
- 改进 floating panel controls、本地图片附件预览和 window title layout。

# v0.0.1

- Nora 的第一个 tagged release。
- 增加 GitHub release workflow 和 publish scripts。
- 建立 macOS desktop app 的早期基础，用于本地 AI 聊天和 agent workflows。
