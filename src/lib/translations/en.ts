import type { LocaleTranslation } from "../translations";
import { emailLink } from "./shared";

export const en = {
  common: {
    skipToContent: "Skip to content",
  },
  header: {
    backToMenuAria: "Back to menu",
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
    },
    primaryNavigationAria: "Primary navigation",
  },
  footer: {
    appStoreButton: "Download Nora",
    copyright: "All rights reserved.",
    ctaText: "Get Nora from the DMG.",
    ctaTitle: "Ready to personal agentic AI better?",
    description: "A beautiful desktop application that unifies your AI experience.",
    groups: {
      legal: "Legal",
      product: "Product",
      resources: "Resources",
    },
    language: "Language",
    legalLinks: {
      privacy: "Privacy",
      terms: "Terms",
    },
    productLinks: {
      faq: "FAQ",
    },
    resourceLinks: {
      changelog: "Changelog",
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
      title: "Nora - Unified AI experience for macOS",
      description:
        "Nora is a macOS-first local agent chat app for running coding and productivity agents on your own machine.",
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
    eyebrow: "Feedback",
    form: {
      attachmentHelp: "Upload screenshots, logs, or short clips. Up to 5 files, 5 MB each.",
      attachmentsLabel: "Attachments",
      categoryLabel: "Type",
      close: "Close form",
      descriptionLabel: "Details",
      descriptionPlaceholder: "Describe the workflow, what you expected, and what would make Nora better.",
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
      "Tell us what Nora should improve next. Vote on requests, report rough edges, and help shape a better local agent app.",
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
    title: "Nora Feedback",
    voteDownAria: "Vote down",
    voteUpAria: "Vote up",
  },
  home: {
    structuredDataFeatureList: [
      "macOS-first AI chat",
      "Local agent workflows",
      "Sandboxed file changes",
      "OpenAI-compatible model routes",
      "OAuth and API-key provider setup",
      "Skills and schedules",
      "Desktop automation permissions",
      "Local workspace review",
      "Provider usage snapshots",
      "Japanese, Chinese, and English interface",
    ],
    hero: {
      appStoreButton: "Download Nora",
      builtWithLabel: "Built with",
      builtWithValue: "100% Native",
      systemLabel: "System",
      systemValue: "macOS 14.0+",
      tagline: "A beautiful desktop application for OpenAI, Anthropic, Google Gemini, and custom providers. Switch models without breaking your flow.",
      titleLines: [
        ["Nora", "unifies"],
        ["your AI","experience."]
      ],
    },
    featureCards: {
      eyebrow: "More Features",
      title: "Small details, ready for real workflows.",
      subtitle:
        "From engineers to artists, designers to farmers -\nNora connects people to the tools they already use.",
      items: [
        {
          title: "Calendar",
          caption: "Coordinate schedules, briefs, and follow-ups from one agent workspace.",
        },
        {
          title: "Files",
          caption: "Review, compare, and organize local files with controlled agent actions.",
        },
        {
          title: "Browser",
          caption: "Let Nora read pages, summarize context, and help with browser-based work.",
        },
      ],
    },
    faq: {
      eyebrow: "FAQ",
      title: "Frequently Asked Questions",
      items: [
        {
          question: "What is Nora?",
          answer:
            "Nora is a macOS-first local agent chat app for running coding and productivity agents on your own machine.",
        },
        {
          question: "Is Nora local-first?",
          answer:
            "Yes. Provider credentials, agent state, skills, schedules, and sandbox workflows are managed locally by the desktop app.",
        },
        {
          question: "Which model providers does it support?",
          answer:
            "It works with OAuth, API-key, subscription, gateway, and OpenAI-compatible routes, including OpenAI, Anthropic, Google Gemini, Bedrock, Azure, Cloudflare, Cerebras, and custom endpoints.",
        },
        {
          question: "How are file changes reviewed?",
          answer:
            "Agent edits happen in a sandbox first. You can inspect proposed changes, accept selected files, accept all, or discard the run before anything touches the host filesystem.",
        },
        {
          question: "What are skills?",
          answer:
            "Skills are local capability packages with a SKILL.md entry point. Nora advertises active skills to the agent and loads the relevant instructions only when a task needs them.",
        },
      ],
    },
  },
  legal: {
    privacy: {
      eyebrow: "Privacy",
      title: "Privacy Policy",
      updated: "Last updated: June 15, 2026",
      sections: [
        {
          title: "Overview",
          paragraphs: [
            [
              "Nora is a macOS-first local agent chat app. It is designed to manage provider credentials, agent state, skills, schedules, sandbox workflows, and workspace files locally on your Mac. Nora makes network requests when you connect a model provider, download or update the app, check provider usage, or ask an agent to use an external service.",
            ],
          ],
        },
        {
          title: "Local app data",
          paragraphs: [
            [
              "Chat history, agent events, provider settings, credentials, tokens, usage snapshots, skills, schedules, sandbox state, workspace files, and local files you select stay on your Mac or in locations you choose. Nora does not upload this content to Nora servers unless you choose to send it to an external service or include it in a support request.",
            ],
          ],
        },
        {
          title: "Model providers and external services",
          paragraphs: [
            [
              "When you use OpenAI, Anthropic, Google Gemini, Bedrock, Azure, Cloudflare, Cerebras, a gateway, or an OpenAI-compatible endpoint, Nora sends the prompt, selected context, and any files or content you allow the agent to use to that provider. Those providers process requests under their own terms and privacy policies.",
            ],
            [
              "Do not send raw API keys, access tokens, session cookies, or other secrets in support messages. Provider credentials are meant to stay in the app and on your Mac.",
            ],
          ],
        },
        {
          title: "Agents, sandboxes, and skills",
          paragraphs: [
            [
              "Agent work can read files, run tools, and propose file changes only through the workflows you start or approve. Coding changes are reviewed through the sandbox flow before they touch the host filesystem, so you can accept selected files, accept all changes, or discard the run.",
            ],
            [
              "Skills are local capability packages with instructions that Nora may show to the agent when a task needs them. Imported, synced, pinned, and enabled skills are managed locally by the desktop app.",
            ],
          ],
        },
        {
          title: "macOS permissions",
          paragraphs: [
            [
              "Nora may ask macOS for permissions such as file access, Accessibility, screen access, automation, and notifications. These permissions are used only for the local agent, desktop automation, file review, sandbox workflow, and notification features you choose to use. You can manage them in System Settings.",
            ],
          ],
        },
        {
          title: "Diagnostics and support",
          paragraphs: [
            [
              "Nora may store local logs, run status, provider usage snapshots, and error details on your Mac to help the app work and to make troubleshooting possible. If you contact support, you choose what information to share. Please remove credentials, tokens, private files, and unrelated personal information before sending diagnostics.",
            ],
          ],
        },
        {
          title: "Website",
          paragraphs: [
            [
              "When you visit this website, our hosting and infrastructure providers may process standard server log data such as IP address, browser user agent, request URL, and request time for security, diagnostics, and delivery of the website. The website does not use advertising trackers.",
            ],
          ],
        },
        {
          title: "Changes and contact",
          paragraphs: [
            ["We may update this policy as Nora changes. If you have privacy questions, contact us at ", emailLink, "."],
          ],
        },
      ],
    },
    support: {
      eyebrow: "Support",
      title: "Nora Support",
      updated: "Help for Nora for macOS.",
      sections: [
        {
          title: "Contact",
          paragraphs: [
            [
              "Email ",
              emailLink,
              " for product support, bug reports, setup questions, and feedback.",
            ],
          ],
        },
        {
          title: "Include these details",
          paragraphs: [
            [
              "When reporting an issue, include your macOS version, Nora version, Mac model, selected model provider, auth method, the task you were running, and a short description of what happened. Screenshots or short videos are useful when the issue is visual.",
            ],
          ],
        },
        {
          title: "Installation and updates",
          paragraphs: [
            [
              "Nora is distributed as a DMG. If download, installation, launch, or update fails, include the DMG version, the app version shown in macOS, and any Gatekeeper or crash message.",
            ],
          ],
        },
        {
          title: "Models and credentials",
          paragraphs: [
            [
              "For model connection issues, include the provider, model name, route type, and whether you are using OAuth, an API key, a subscription, a gateway, or an OpenAI-compatible endpoint. Do not send raw API keys or access tokens.",
            ],
          ],
        },
        {
          title: "Local agent and sandbox runs",
          paragraphs: [
            [
              "For coding or file-change issues, include the workspace path, whether the run used the sandbox, and whether you accepted selected files, accepted all changes, or discarded the run. If the agent stopped with an error, copy the visible error text.",
            ],
          ],
        },
        {
          title: "Skills and schedules",
          paragraphs: [
            [
              "For skill issues, include the skill name, where it came from, and whether it is enabled, pinned, imported, or synced from a folder. For scheduled tasks, include the schedule name, timing, and the last run result.",
            ],
          ],
        },
        {
          title: "macOS permissions",
          paragraphs: [
            [
              "Some agent workflows need macOS permissions such as Accessibility, file access, or screen access. If Nora cannot inspect or control an app, check System Settings and include the affected app name in your report.",
            ],
          ],
        },
        {
          title: "Privacy",
          paragraphs: [
            [
              "Provider credentials, agent state, skills, schedules, sandbox runs, and workspace files are managed locally by the desktop app. Read the ",
              { href: "/privacy", text: "Privacy Policy" },
              " for more detail.",
            ],
          ],
        },
      ],
    },
    terms: {
      eyebrow: "Terms",
      title: "Terms of Use",
      updated: "Last updated: June 15, 2026",
      sections: [
        {
          title: "App license",
          paragraphs: [
            [
              "Nora is provided as a macOS desktop application for local AI chat, coding agents, productivity agents, and desktop workflows. You may install and use Nora on devices you control, as long as you follow applicable laws, provider terms, and these terms.",
            ],
          ],
        },
        {
          title: "Model providers and external services",
          paragraphs: [
            [
              "Nora can connect to OpenAI, Anthropic, Google Gemini, Bedrock, Azure, Cloudflare, Cerebras, gateways, and OpenAI-compatible endpoints. You are responsible for the accounts, credentials, usage, billing, and policies of the providers you connect.",
            ],
            [
              "Do not share provider credentials, API keys, tokens, session cookies, or other secrets with us in support messages.",
            ],
          ],
        },
        {
          title: "Agent work",
          paragraphs: [
            [
              "You are responsible for the prompts, files, code, commands, automations, and outputs you ask Nora or connected agents to handle. Review proposed file changes and agent actions before accepting them.",
            ],
            [
              "Sandbox workflows, skills, schedules, and desktop automation features are tools for your own workflows. You are responsible for deciding what Nora may read, run, modify, or send to external providers.",
            ],
          ],
        },
        {
          title: "Acceptable use",
          paragraphs: [
            [
              "Do not use Nora to violate laws, bypass access controls, abuse external services, interfere with other systems, or process content you do not have permission to use.",
            ],
          ],
        },
        {
          title: "Privacy",
          paragraphs: [
            ["Nora's privacy practices are described in the ", { href: "/privacy", text: "Privacy Policy" }, "."],
          ],
        },
        {
          title: "Contact",
          paragraphs: [
            ["If you have questions about these terms, contact us at ", emailLink, "."],
          ],
        },
      ],
    },
  },
  changelog: {
    description: "Product updates, fixes, and release notes.",
    eyebrow: "Changelog",
    intro: "Product updates, fixes, and release notes.",
    linkVersionLabel: "Link to version",
    title: "Nora Changelog",
  },
} satisfies LocaleTranslation;
