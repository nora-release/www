import { defineConfig } from "vitepress";

const site = "https://nora.elonehoo.me";

export default defineConfig({
  base: "/docs/",
  outDir: "../public/docs",
  lang: "en-US",
  title: "Nora Docs",
  description: "Guides and reference for Nora, the native macOS app and command-line agent.",
  cleanUrls: false,
  lastUpdated: false,
  appearance: true,
  head: [
    ["link", { rel: "icon", href: "/favicon.png", type: "image/png" }],
    ["link", { rel: "preconnect", href: "https://fonts.googleapis.com" }],
    ["link", { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" }],
    [
      "link",
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500;600&display=swap",
      },
    ],
  ],
  sitemap: { hostname: `${site}/docs/` },
  themeConfig: {
    logo: { src: "/icon-192.png", alt: "Nora" },
    siteTitle: "nora.docs",
    nav: [
      { text: "Guide", link: "/guide/", activeMatch: "/guide/" },
      { text: "Features", link: "/features/", activeMatch: "/features/" },
      { text: "Providers", link: "/providers/", activeMatch: "/providers/" },
      { text: "Plugins", link: "/plugins/", activeMatch: "/plugins/" },
      { text: "Settings", link: "/settings/", activeMatch: "/settings/" },
      { text: "CLI", link: "/cli/", activeMatch: "/cli/" },
      { text: "Home", link: `${site}/` },
    ],
    socialLinks: [{ icon: "github", link: "https://github.com/nora-release/release" }],
    sidebar: {
      "/guide/": [
        {
          text: "Getting started",
          items: [
            { text: "Introduction", link: "/guide/" },
            { text: "Installation", link: "/guide/installation" },
            { text: "Quick start", link: "/guide/quick-start" },
          ],
        },
        {
          text: "Basics",
          items: [
            { text: "The chat window", link: "/guide/chat" },
            { text: "Projects and conversations", link: "/guide/projects" },
            { text: "Keyboard shortcuts", link: "/guide/shortcuts" },
            { text: "Privacy and data", link: "/guide/privacy" },
          ],
        },
      ],
      "/features/": [
        {
          text: "Core features",
          items: [
            { text: "Overview", link: "/features/" },
            { text: "Tools and permissions", link: "/features/tools" },
            { text: "Plan mode", link: "/features/plan-mode" },
            { text: "Goals", link: "/features/goals" },
            { text: "Memory", link: "/features/memory" },
            { text: "Side panels", link: "/features/side-panels" },
          ],
        },
        {
          text: "Advanced features",
          items: [
            { text: "Skills", link: "/features/skills" },
            { text: "MCP servers", link: "/features/mcp" },
            { text: "Scheduled tasks", link: "/features/scheduled-tasks" },
            { text: "Computer use", link: "/features/computer-use" },
            { text: "Search, images and video", link: "/features/search-and-media" },
            { text: "Notch and menu bar", link: "/features/notch" },
          ],
        },
      ],
      "/providers/": [
        {
          text: "AI providers",
          items: [
            { text: "Overview", link: "/providers/" },
            { text: "API keys", link: "/providers/api-keys" },
            { text: "Subscription sign-ins", link: "/providers/sign-ins" },
            { text: "Local models", link: "/providers/local-models" },
            { text: "Choosing models", link: "/providers/models" },
            { text: "Custom providers", link: "/providers/custom" },
          ],
        },
      ],
      "/plugins/": [
        {
          text: "Using plugins",
          items: [
            { text: "Overview", link: "/plugins/" },
            { text: "Install and manage", link: "/plugins/manage" },
            { text: "Trust and updates", link: "/plugins/trust" },
          ],
        },
        {
          text: "Building plugins",
          items: [
            { text: "Quick start", link: "/plugins/quick-start" },
            { text: "Examples", link: "/plugins/examples" },
            { text: "Plugin layout", link: "/plugins/layout" },
            { text: "Hooks", link: "/plugins/hooks" },
            { text: "Manifest reference", link: "/plugins/manifest" },
            { text: "Process plugins", link: "/plugins/process" },
            { text: "Provider plugins", link: "/plugins/providers" },
            { text: "Publishing", link: "/plugins/publishing" },
          ],
        },
      ],
      "/settings/": [
        {
          text: "Settings",
          items: [
            { text: "Overview", link: "/settings/" },
            { text: "General", link: "/settings/general" },
            { text: "AI Providers", link: "/settings/ai-providers" },
            { text: "Memory", link: "/settings/memory" },
            { text: "Tools", link: "/settings/tools" },
            { text: "Projects", link: "/settings/projects" },
            { text: "Skills", link: "/settings/skills" },
            { text: "Shortcuts", link: "/settings/shortcuts" },
            { text: "Access", link: "/settings/access" },
            { text: "Notifications and sounds", link: "/settings/notifications" },
            { text: "About", link: "/settings/about" },
          ],
        },
      ],
      "/cli/": [
        {
          text: "Command line",
          items: [
            { text: "Overview", link: "/cli/" },
            { text: "Install", link: "/cli/install" },
            { text: "Interactive mode", link: "/cli/interactive" },
            { text: "One-shot mode", link: "/cli/one-shot" },
            { text: "Permissions", link: "/cli/permissions" },
            { text: "Worktrees", link: "/cli/worktrees" },
            { text: "Editors and ACP", link: "/cli/acp" },
            { text: "Command reference", link: "/cli/commands" },
          ],
        },
      ],
    },
    outline: { level: [2, 3], label: "On this page" },
    search: { provider: "local" },
    docFooter: { prev: "Previous", next: "Next" },
    footer: {
      message: "Nora for macOS 14 and later.",
      copyright: `© ${new Date().getFullYear()} Nora`,
    },
  },
});
