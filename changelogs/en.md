# v0.0.12

- Signed the bundled Nora helper used by release builds.
- Stabilized sandbox VM resource packaging so release assets can carry the required runtime resources.
- Updated release Node and pnpm tooling, cache handling, and keychain fallback behavior.

# v0.0.11

- Improved default provider usage accuracy.
- Fixed SQLite migration behavior so workspace state is preserved.
- Fixed light theme preview details and the welcome logo.

# v0.0.10

- Moved model configuration from JSON files into SQLite-backed storage.
- Integrated AppProviderStore for more consistent model provider management.
- Fixed xAI and Grok OAuth model handling.
- Routed safe workspace tools through the connector and wired macOS bridge tools from Swift.
- Improved notarization visibility and release version scripting.

# v0.0.9

- Hardened release publishing.
- Migrated release workflows to Blacksmith runners.

# v0.0.8

- Refined build scripts and Git panel behavior with repository resolution.
- Added a shared PanelHoverIconButton for consistent panel button styling and hover effects.
- Restored Go toolchain source handling used by build workflows.

# v0.0.7

- Replaced SF Symbols usage with custom HugeIcons across chat and upload surfaces.
- Added xAI model support and OAuth integration.
- Improved permission selector localization and tests.
- Added diff preview components, layout options, and Git panel commit preview support.

# v0.0.6

- Added secure timestamp verification to the notarization process.

# v0.0.5

- Improved code signing for `libNoraTerminal.dylib` with secure timestamp handling.

# v0.0.4

- Added Zig setup and terminal package testing to the release workflow.

# v0.0.3

- Improved workspace panel tabs and lazy file loading.
- Routed chat file previews through the workspace panel.
- Added custom AI provider support and improved provider settings UI.
- Improved terminal capability environment handling and inline image protocol support.
- Removed the Windows ConPTY path and tightened the macOS terminal configuration.

# v0.0.2

- Improved release asset naming, appcast release notes, and public release publishing.
- Added terminal tabs, working directory controls, and cleaner chat header controls.
- Improved floating panel controls, local image attachment previews, and window title layout.

# v0.0.1

- First tagged Nora release.
- Added the GitHub release workflow and publish scripts.
- Established the early macOS desktop app foundation for local AI chat and agent workflows.
