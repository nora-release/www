import type { SiteCopy } from "../copy";
import { emailLink } from "./shared";

export const siteCopy = {
  notFound: {
    title: "Page not found",
    description: "This page doesn't exist, or it moved.",
    home: "Back home",
    docs: "Search the docs",
  },
  common: {
    skipToContent: "Skip to content",
  },
  header: {
    closeMenuAria: "Close menu",
    homeAria: "Nora home",
    login: "Log in",
    logout: "Log out",
    logoAlt: "Nora Logo",
    menuAria: "Open menu",
    nav: {
      changelog: "Changelog",
      feedback: "Feedback",
      privacy: "Privacy",
      support: "Support",
      terms: "Terms",
      docs: "Docs",
      download: "Download",
      features: "Features",
      terminal: "Terminal",
    },
    primaryNavigationAria: "Primary navigation",
    themeAria: "Switch between light and dark",
  },
  footer: {
    appStoreButton: "Download Nora",
    copyright: "All rights reserved.",
    ctaText: "Free for macOS 14 and later.",
    ctaTitle: "Your agents, at home on your Mac.",
    description: "A native macOS app and command-line agent.",
    groups: {
      legal: "Legal",
      product: "Product",
      resources: "Resources",
    },
    legalLinks: {
      privacy: "Privacy",
      terms: "Terms",
    },
    productLinks: {
      docs: "Docs",
      download: "Download",
      faq: "FAQ",
    },
    resourceLinks: {
      changelog: "Changelog",
      feedback: "Feedback",
      support: "Support",
    },
    systemStatus: "All systems operational",
  },
  meta: {
    changelog: {
      title: "Changelog - Nora",
      description: "Follow Nora release notes, product improvements, bug fixes, and update history.",
    },
    feedback: {
      title: "Feedback - Nora",
      description: "Share Nora feedback, vote on requests, and follow what the product team is considering next.",
    },
    home: {
      title: "Nora — your agents, at home on your Mac",
      description:
        "Nora is a native macOS app and command-line agent that works on your real files, plans before it changes things, and uses the models you already pay for.",
    },
    privacy: {
      title: "Privacy Policy - Nora",
      description:
        "Nora's privacy policy explains how the desktop app handles local data, credentials, permissions, optional analytics, and website data.",
    },
    support: {
      title: "Support - Nora",
      description: "Get help with Nora, including support contact, installation requirements, and troubleshooting.",
    },
    terms: {
      title: "Terms of Use - Nora",
      description: "Nora's terms of use explain the app license, usage responsibilities, and support contact information.",
    },
  },
  feedback: {
    activityTitle: "Activity",
    auth: {
      signInRequired: "Log in from the header to post feedback or vote.",
    },
    categories: {
      all: "All",
      closed: "Closed",
      bug: "Bug",
      feature: "Feature",
    },
    contributors: {
      empty: "Contributors will appear after feedback is posted.",
      title: "Contributors",
    },
    detail: {
      adminAdd: "Add admin",
      adminAddedBy: "Added by",
      adminAdding: "Adding...",
      adminHelp: "Admins can promote feedback and add other GitHub users as admins.",
      adminInputLabel: "GitHub username",
      adminInputPlaceholder: "octocat",
      adminListEmpty: "No admins yet.",
      adminsTitle: "Admins",
      attachments: "Attachments",
      back: "Back to feedback",
      commentLabel: "Comment",
      commentPlaceholder: "Add context, reproduction steps, links, or decisions.",
      commentSubmit: "Post comment",
      commentSubmitting: "Posting...",
      comments: "Comments",
      emptyComments: "No comments yet.",
      issueLink: "Open GitHub Issue",
      promote: "Promote to GitHub Issue",
      promoteComplete: "Promoted to GitHub Issue",
      promoteHint: "Admins can promote confirmed feedback to nora-release/nora.",
      promoting: "Promoting...",
    },
    empty: {
      description: "Start with the workflow, provider, or desktop behavior that most needs attention.",
      title: "No matching feedback yet.",
    },
    eyebrow: "feedback",
    form: {
      attachmentHelp: "Upload screenshots, logs, or short clips. Up to 5 files, 5 MB each.",
      attachmentsLabel: "Attachments",
      categoryLabel: "Type",
      close: "Close form",
      descriptionLabel: "Details",
      descriptionPlaceholder: "Optional: add context, expected behavior, screenshots, or links.",
      markdownHint: "Markdown supported",
      open: "Post feedback",
      removeAttachment: "Remove attachment",
      submit: "Post feedback",
      submitting: "Posting...",
      title: "Share feedback",
      titleLabel: "Title",
      titlePlaceholder: "A short request or bug title",
    },
    intro:
      "Tell us what Nora should do next. Post ideas and bugs, vote on what matters to you, and follow what gets picked up.",
    listTitle: "Feedback",
    loading: "Loading feedback...",
    searchPlaceholder: "Search feedback",
    signInPanel: {
      description: "Use GitHub to post requests and vote. Public feedback remains visible to everyone.",
      title: "Sign in to participate",
    },
    sort: {
      new: "Newest",
      top: "Top",
      trending: "Trending",
    },
    stats: {
      closed: "Closed",
      open: "Open",
      promoted: "Promoted",
      votes: "Votes",
    },
    status: {
      closed: "Closed",
      open: "Open",
      promoted: "Promoted",
    },
    title: "Feedback",
    voteDownAria: "Vote down",
    voteUpAria: "Vote up",
  },
  home: {
    structuredDataFeatureList: [
      "Native macOS agent app",
      "Works on your real files and terminal",
      "Plan mode and long-running goals",
      "OpenAI, Anthropic, Gemini, DeepSeek, OpenRouter, Ollama and more",
      "Sign in with ChatGPT, GitHub Copilot or Grok through provider plugins",
      "Skills, memory and MCP servers",
      "Plugins with hooks, subagents and MCP servers",
      "nora command-line agent",
    ],
    announcement: {
      tag: "new",
      text: "Plugins now run their hooks, agents and MCP servers in the app",
      href: "/docs/plugins/",
    },
    hero: {
      title: ["Your agents, ", "at home", " on your Mac."],
      lede:
        "Nora is a native macOS app for working with AI agents. It reads and edits your real files, runs your commands, plans before it changes things, and uses the models you already pay for, in a window or straight from your terminal.",
      download: "Download for macOS",
      downloadMeta: "Apple silicon",
      docs: "Read the docs",
      specs: "macOS 14+ · OpenAI · Anthropic · Gemini · DeepSeek · ChatGPT · Copilot · Grok · Ollama",
      panelLabel: "nora — mac",
      figureAlt: "The Nora window: projects in the sidebar, and a conversation where the agent finds why a login test is flaky, shows its fix as a diff and opens a pull request.",
    },
    app: {
      eyebrow: "the app",
      title: ["Agent work that ", "reads like", " a document."],
      lede:
        "Every turn lands in a native timeline. Tool calls fold into steps, changes show as diffs, and nothing important hides in a scrolling log.",
      link: { text: "Tour the app", href: "/docs/guide/chat.html" },
      items: [
        {
          glyph: "[≡]",
          title: "Drawn natively",
          body: "Markdown, code, Mermaid diagrams, math and Git diffs render as real Mac views, fast and selectable.",
        },
        {
          glyph: "?→",
          title: "Plans before it changes",
          body: "Plan mode lets the agent research and write a plan first. Approve, revise or decline before a single file moves.",
        },
        {
          glyph: "◎",
          title: "Goals it keeps working on",
          body: "Give it an objective instead of a prompt. It keeps going across turns and stops when the goal is met.",
        },
        {
          glyph: ">_",
          title: "Your whole Mac",
          body: "Files, shell and a built-in terminal, with computer use for the apps that have no command line.",
        },
      ],
    },
    terminal: {
      eyebrow: "the terminal",
      title: ["The same agent, ", "in your", " terminal."],
      lede:
        "The nora command shares the app's runtime, sessions and providers. Open its full-screen interface, pipe a one-shot prompt, or serve it to your editor.",
      link: { text: "Command-line guide", href: "/docs/cli/" },
      session: [
        "$ nora -p \"why does the login test flake?\"",
        "  read   tests/login.test.ts",
        "  bash   pnpm test login --repeat 20",
        "  ✓ 2 of 20 runs time out waiting for the session cookie.",
        "",
        "$ nora plugins add pdfs",
        "  installed pdfs · 1 skill",
        "",
        "$ nora agent stdio      # speak ACP to your editor",
      ],
      items: [
        { glyph: "01", title: "A full-screen interface", body: "Conversations, plans and diffs, drawn for the terminal." },
        { glyph: "02", title: "One-shot prompts", body: "nora -p answers once and exits, for scripts and pipes." },
        { glyph: "03", title: "Your editor's agent", body: "nora agent speaks ACP over stdio or a WebSocket." },
        { glyph: "04", title: "Parallel worktrees", body: "Let a task run in its own Git worktree, then apply it." },
      ],
    },
    extend: {
      eyebrow: "make it yours",
      title: ["Bring your models. ", "Teach it", " your tools."],
      lede: "Nora runs a model gateway on your Mac, remembers what matters, and grows with skills, MCP servers and plugins.",
      link: { text: "Write a plugin", href: "/docs/plugins/" },
      items: [
        {
          title: "Every model, one window",
          body: "API keys or a subscription sign-in, routed through the gateway that runs on your Mac.",
          chips: ["OpenAI", "Anthropic", "Gemini", "DeepSeek", "OpenRouter", "Ollama", "ChatGPT", "Copilot", "Grok"],
        },
        {
          title: "Memory you can read",
          body: "Short notes about you and your projects that you can review, edit, turn off or delete in Settings.",
        },
        {
          title: "Skills",
          body: "Install skills from the marketplace or your own folder. Nora picks the right one for the task.",
        },
        {
          title: "MCP servers",
          body: "Connect stdio or HTTP servers and turn each one on or off from Settings.",
        },
        {
          title: "Plugins",
          body: "Hooks that can ask before a tool runs, extra agents, MCP servers and tools. Official plugins keep themselves up to date.",
        },
        {
          title: "Local first",
          body: "Conversations and settings live on your Mac. Prompts go only to the model provider you choose.",
        },
      ],
    },
    faq: {
      eyebrow: "questions",
      title: "Questions, answered.",
      items: [
        {
          question: "What does Nora need?",
          answer: "A Mac with Apple silicon running macOS 14 or later, and an account with a model provider: an API key, or a subscription you sign in to.",
        },
        {
          question: "Is Nora free?",
          answer: "Yes. Nora is free to download. You pay your model provider for what you use, as you would anywhere else.",
        },
        {
          question: "Where does the agent run, and what can it touch?",
          answer:
            "On your Mac, with access to the files and commands you point it at. Plan mode keeps it to reading and planning until you approve. Conversations stay on your Mac; prompts go to the provider you pick.",
        },
        {
          question: "Which models can I use?",
          answer:
            "Any provider the built-in gateway supports, including OpenAI, Anthropic, Gemini, DeepSeek, OpenRouter and Ollama, plus provider plugins that sign in with ChatGPT, GitHub Copilot or Grok.",
        },
        {
          question: "Is there a command-line version?",
          answer: "Yes. Install the nora command from Settings › About. It shares the app's runtime, providers and plugins.",
        },
        {
          question: "Are plugins safe to install?",
          answer:
            "A plugin that runs code acts with your full permissions, so install only plugins you trust. Nora shows what a plugin can do before you install it, and official plugins update themselves.",
        },
      ],
    },
    download: {
      command: "nora --version",
      title: ["Get ", "Nora", "."],
      lede: "One download for the app; the command line comes with it.",
      versionLabel: "latest",
      versionLoading: "checking…",
      macTitle: "macOS",
      macDetail: "Apple silicon · macOS 14+ · .dmg",
      macAction: "Download",
      cliTitle: "nora command",
      cliDetail: "Bundled with the app · Settings › About › Install nora Command",
      cliAction: "How to install",
      notes: ["Updates arrive inside the app.", "Release notes live in the changelog."],
    },
  },
  legal: {
    privacy: {
      eyebrow: "privacy",
      title: "Privacy Policy",
      updated: "Last updated: November 18, 2026",
      sections: [
        {
          title: "Overview",
          paragraphs: [
            [
              "Nora is a macOS app and command-line agent that runs on your Mac. Your conversations, settings, memories and provider accounts are stored on your Mac. Nora sends data over the network only to do what you ask: to reach the model provider you chose, to use a service you connected, to check for updates, and to run the feedback board on this website.",
            ],
          ],
        },
        {
          title: "Data stored on your Mac",
          paragraphs: [
            [
              "Conversations, agent activity, settings, memories, skills, schedules, projects and provider accounts are stored in ~/Library/Application Support/Nora. The nora command keeps its own data in ~/.nora. Secrets for MCP servers, such as environment values, headers and OAuth tokens, are stored in the macOS Keychain. Nora does not upload this data to our servers.",
            ],
          ],
        },
        {
          title: "Model providers",
          paragraphs: [
            [
              "When you send a message, Nora sends it, together with the conversation so far, relevant memories and the files and command output the agent reads, to the model provider you chose for that conversation. If you turn on web or X search, searches run through that provider. Providers process this data under their own terms and privacy policies. Nora does not send your data to providers you did not choose.",
            ],
          ],
        },
        {
          title: "MCP servers and plugins",
          paragraphs: [
            [
              "MCP servers you connect receive the requests the agent makes to them. Plugins you install run as programs on your Mac with your permissions, and can access what you can. Install plugins and connect servers only from sources you trust.",
            ],
          ],
        },
        {
          title: "macOS permissions",
          paragraphs: [
            [
              "Nora may ask macOS for Accessibility, Screen Recording, Microphone and Full Disk Access. They are used only for the features that need them: computer use, voice input and working with files in protected locations. You can review or revoke them at any time in System Settings › Privacy & Security.",
            ],
          ],
        },
        {
          title: "Updates",
          paragraphs: [
            [
              "To check for updates, Nora downloads the release feed from GitHub. If Update plugins automatically is on, Nora also checks the official plugin sources. These requests include standard information such as your IP address and app version.",
            ],
          ],
        },
        {
          title: "Feedback board",
          paragraphs: [
            [
              "To post on the feedback board you sign in with GitHub. We store your GitHub name, email address and avatar to identify your account. The feedback, comments and votes you post are public on this website. Files you attach are stored temporarily with our hosting provider and then kept in a GitHub repository, where they are publicly accessible. If a request is promoted, its content and attachments are copied to a public GitHub issue.",
            ],
            [
              "Do not post private information, credentials or files you do not want to be public. To have your feedback or account removed, contact us.",
            ],
          ],
        },
        {
          title: "Website",
          paragraphs: [
            [
              "Our hosting provider may process standard server log data, such as IP address, browser user agent, requested page and time, for security and to deliver the website. The website uses a cookie only to keep you signed in; your light or dark choice is kept in your browser's local storage. It does not use advertising or tracking cookies.",
            ],
          ],
        },
        {
          title: "Support requests",
          paragraphs: [
            [
              "If you contact us, you decide what to share. Please remove API keys, tokens and private files from logs and screenshots before sending them.",
            ],
          ],
        },
        {
          title: "Changes and contact",
          paragraphs: [
            ["We may update this policy as Nora changes; the date above shows the latest version. If you have questions, contact us at ", emailLink, "."],
          ],
        },
      ],
    },
    support: {
      eyebrow: "support",
      title: "Support",
      updated: "Help for Nora on macOS.",
      sections: [
        {
          title: "Start with the docs",
          paragraphs: [
            [
              "Most questions are answered in the ",
              { href: "/docs/", text: "documentation" },
              ", including installation, providers, plugins and every Settings page. Ideas and bug reports that others can vote on belong on the ",
              { href: "/feedback", text: "feedback board" },
              ".",
            ],
          ],
        },
        {
          title: "Contact",
          paragraphs: [["Email ", emailLink, " for anything else: product support, bugs, setup questions and privacy requests."]],
        },
        {
          title: "What to include",
          paragraphs: [
            [
              "Your macOS version, your Nora version (Settings › About), your Mac model, the provider and model you were using, what you asked the agent to do, and what happened instead. Copy the exact error text if there is one. Screenshots or a short video help with anything visual.",
            ],
          ],
        },
        {
          title: "Logs",
          paragraphs: [
            [
              "Settings › About › Log Viewer shows Nora's logs. In the terminal, nora trace <session-id> --local exports diagnostics for one session. Remove API keys, tokens and private file contents before you send them.",
            ],
          ],
        },
        {
          title: "Installation and updates",
          paragraphs: [
            [
              "Nora is distributed as a DMG for Macs with Apple silicon on macOS 14 or later. If Nora does not open, install or update, include the DMG version and any message macOS showed.",
            ],
          ],
        },
        {
          title: "Providers and models",
          paragraphs: [
            [
              "For connection problems, include the provider, the model, and whether the account uses an API key, a subscription sign-in or a local server. Never send the key itself.",
            ],
          ],
        },
        {
          title: "Plugins, skills and MCP servers",
          paragraphs: [
            [
              "Include the plugin, skill or server name, where it came from, and whether it is turned on. For MCP servers, the status shown in Settings › Tools helps.",
            ],
          ],
        },
      ],
    },
    terms: {
      eyebrow: "terms",
      title: "Terms of Use",
      updated: "Last updated: November 18, 2026",
      sections: [
        {
          title: "Using Nora",
          paragraphs: [
            [
              "Nora is a macOS app and command-line agent for working with AI models on your own computer. You may install and use it on devices you control, in line with applicable laws, the terms of the providers you connect, and these terms.",
            ],
          ],
        },
        {
          title: "Your providers and accounts",
          paragraphs: [
            [
              "Nora connects to model providers through accounts that you own. You are responsible for those accounts, their credentials, their usage and billing, and for following each provider's terms, including any terms about how a subscription may be used.",
            ],
          ],
        },
        {
          title: "Agent actions",
          paragraphs: [
            [
              "The agent acts on your Mac with your permissions: it can read and change files, run commands and operate apps. You are responsible for what you ask it to do and for checking its work. Use plan mode, version control and backups for anything you cannot afford to lose.",
            ],
          ],
        },
        {
          title: "Plugins and MCP servers",
          paragraphs: [
            [
              "Plugins and MCP servers are software from their authors, not from us, unless we say otherwise. They run with your permissions. You decide which ones to install and trust.",
            ],
          ],
        },
        {
          title: "Acceptable use",
          paragraphs: [
            [
              "Do not use Nora to break the law, get around access controls, abuse other services, interfere with systems you are not authorized to use, or process content you have no right to use. On the feedback board, be respectful and do not post others' private information.",
            ],
          ],
        },
        {
          title: "No warranty",
          paragraphs: [
            [
              "Nora is provided as is, without warranties of any kind. AI output can be wrong. To the extent the law allows, we are not liable for damage resulting from the use of Nora, including lost data or the actions of the agent, plugins or providers.",
            ],
          ],
        },
        {
          title: "Privacy",
          paragraphs: [["How Nora handles data is described in the ", { href: "/privacy", text: "Privacy Policy" }, "."]],
        },
        {
          title: "Contact",
          paragraphs: [["Questions about these terms: ", emailLink, "."]],
        },
      ],
    },
  },
  changelog: {
    description: "What changed in each version of Nora.",
    eyebrow: "changelog",
    intro: "What changed in each version of Nora. Updates arrive inside the app.",
    linkVersionLabel: "Link to version",
    title: "Changelog",
  },
} satisfies SiteCopy;
