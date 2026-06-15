import type { LocaleTranslation } from "../translations";
import { emailLink } from "./shared";

export const zhCn = {
  common: {
    skipToContent: "跳到正文",
  },
  header: {
    backToMenuAria: "返回菜单",
    closeMenuAria: "关闭菜单",
    homeAria: "Nora 首页",
    login: "登录",
    logout: "退出",
    logoAlt: "Nora 标志",
    menuAria: "打开菜单",
    nav: {
      changelog: "更新日志",
      feedback: "反馈",
      privacy: "隐私",
      support: "支持",
      terms: "条款",
    },
    primaryNavigationAria: "主导航",
  },
  footer: {
    appStoreButton: "Download Nora",
    copyright: "保留所有权利。",
    ctaText: "下载 Nora 的 DMG 安装包。",
    ctaTitle: "准备好拥有更个人化的 AI 代理了吗？",
    description: "一款漂亮的桌面应用，把你的 AI 体验统一到一起。",
    groups: {
      legal: "法律",
      product: "产品",
      resources: "资源",
    },
    language: "语言",
    legalLinks: {
      privacy: "隐私",
      terms: "条款",
    },
    productLinks: {
      faq: "FAQ",
    },
    resourceLinks: {
      changelog: "更新日志",
      support: "支持",
    },
    systemStatus: "所有系统运行正常",
  },
  meta: {
    changelog: {
      title: "更新日志 - Nora",
      description: "查看 Nora 的版本说明、产品改进、问题修复和更新历史。",
    },
    feedback: {
      title: "反馈 - Nora",
      description: "提交 Nora 反馈、为需求投票，并了解产品接下来会优先考虑什么。",
    },
    home: {
      title: "Nora - 统一你的 AI 体验",
      description:
        "Nora 是一款 macOS 优先的本地代理聊天应用，帮助你在自己的电脑上运行编码和效率代理。",
    },
    privacy: {
      title: "隐私政策 - Nora",
      description:
        "Nora 的隐私政策说明桌面应用如何处理本地数据、凭据、权限、可选分析和网站数据。",
    },
    support: {
      title: "支持 - Nora",
      description: "获取 Nora 帮助，包括支持联系方式、安装要求和故障排查。",
    },
    terms: {
      title: "使用条款 - Nora",
      description: "Nora 使用条款说明应用授权、使用责任和支持联系方式。",
    },
  },
  feedback: {
    activityTitle: "动态",
    auth: {
      signInRequired: "请从 Header 登录后再提交反馈或投票。",
    },
    categories: {
      all: "全部",
      closed: "已关闭",
      bug: "问题",
      feature: "功能",
    },
    contributors: {
      empty: "发布反馈后，这里会显示参与者。",
      title: "参与者",
    },
    detail: {
      adminAdd: "添加管理员",
      adminAddedBy: "添加人",
      adminAdding: "添加中...",
      adminHelp: "管理员可以提升反馈，也可以把其他 GitHub 用户设为管理员。",
      adminInputLabel: "GitHub 用户名",
      adminInputPlaceholder: "elonehoo",
      adminListEmpty: "还没有管理员。",
      adminsTitle: "管理员",
      attachments: "附件",
      back: "返回反馈列表",
      commentLabel: "评论",
      commentPlaceholder: "补充背景、复现步骤、相关链接或处理结论。",
      commentSubmit: "发表评论",
      commentSubmitting: "发布中...",
      comments: "评论",
      emptyComments: "还没有评论。",
      issueLink: "打开 GitHub Issue",
      promote: "提升为 GitHub Issue",
      promoteComplete: "已提升为 GitHub Issue",
      promoteHint: "管理员可以把确认需要处理的反馈提升到 nora-release/nora。",
      promoting: "提升中...",
    },
    empty: {
      description: "可以从最影响你的工作流、模型提供商或桌面体验开始。",
      title: "还没有匹配的反馈。",
    },
    eyebrow: "反馈",
    form: {
      attachmentHelp: "可以上传截图、日志或短视频。最多 5 个文件，每个不超过 5 MB。",
      attachmentsLabel: "附件",
      categoryLabel: "类型",
      close: "关闭表单",
      descriptionLabel: "详情",
      descriptionPlaceholder: "描述你的工作流、预期结果，以及怎样能让 Nora 变得更好。",
      markdownHint: "支持 Markdown",
      open: "提交反馈",
      removeAttachment: "移除附件",
      submit: "提交反馈",
      submitting: "提交中...",
      title: "分享反馈",
      titleLabel: "标题",
      titlePlaceholder: "用一句话描述需求或问题",
    },
    intro: "告诉我们 Nora 接下来应该改进什么。你可以提交需求、反馈问题，也可以为已有反馈投票。",
    listTitle: "反馈列表",
    loading: "正在加载反馈...",
    searchPlaceholder: "搜索反馈",
    signInPanel: {
      description: "使用 GitHub 登录后可以提交反馈和投票。公开反馈会对所有人可见。",
      title: "登录后参与",
    },
    sort: {
      new: "最新",
      top: "最高票",
      trending: "最近活跃",
    },
    stats: {
      closed: "已关闭",
      open: "进行中",
      promoted: "已采纳",
      votes: "投票",
    },
    status: {
      closed: "已关闭",
      open: "进行中",
      promoted: "已采纳",
    },
    title: "Nora 反馈",
    voteDownAria: "反对",
    voteUpAria: "赞成",
  },
  home: {
    structuredDataFeatureList: ["macOS 优先的本地代理聊天", "多模型提供商支持", "沙盒文件变更审核", "本地技能与工作流"],
    hero: {
      appStoreButton: "Download Nora",
      builtWithLabel: "构建方式",
      builtWithValue: "100% 原生",
      systemLabel: "系统",
      systemValue: "macOS 14.0+",
      tagline: "为 OpenAI、Anthropic、Google Gemini 和自定义提供商打造的漂亮桌面应用。切换模型时，不打断你的工作流。",
      titleLines: [
        ["Nora", "统一"],
        ["你的 AI", "体验。"],
      ],
    },
    featureCards: {
      eyebrow: "更多特色",
      title: "为真实工作流准备的细节。",
      subtitle: "从工程师到艺术家，从设计师到农场主 -\nNora 把人和他们已经在使用的工具连接起来。",
      items: [
        {
          title: "日历",
          caption: "在同一个代理工作区里处理日程、会议简报和后续跟进。",
        },
        {
          title: "文件",
          caption: "在可控的代理流程中审阅、对比和整理本地文件。",
        },
        {
          title: "浏览器",
          caption: "让 Nora 读取网页、总结上下文，并协助完成浏览器里的工作。",
        },
      ],
    },
    faq: {
      eyebrow: "FAQ",
      title: "常见问题",
      items: [
        {
          question: "Nora 是什么？",
          answer:
            "Nora 是一款 macOS 优先的本地代理聊天应用，用来在你自己的电脑上运行编码代理和效率代理。",
        },
        {
          question: "Nora 是 local-first 吗？",
          answer: "是的。模型凭据、代理状态、技能、计划任务和沙盒工作流都由桌面应用在本地管理。",
        },
        {
          question: "它支持哪些模型提供商？",
          answer:
            "Nora 支持 OAuth、API Key、订阅、网关和 OpenAI 兼容接口，包括 OpenAI、Anthropic、Google Gemini、Bedrock、Azure、Cloudflare、Cerebras 和自定义端点。",
        },
        {
          question: "文件变更如何审核？",
          answer:
            "代理会先在沙盒中完成修改。你可以检查建议的变更，选择接受部分文件、接受全部文件，或在触碰主机文件系统前丢弃本次运行。",
        },
        {
          question: "技能是什么？",
          answer:
            "技能是带有 SKILL.md 入口的本地能力包。Nora 会把启用的技能提供给代理，并只在任务需要时加载相关说明。",
        },
      ],
    },
  },
  legal: {
    privacy: {
      eyebrow: "隐私",
      title: "隐私政策",
      updated: "最后更新：2026 年 6 月 15 日",
      sections: [
        {
          title: "概览",
          paragraphs: [
            [
              "Nora 是一款 macOS 优先的本地代理聊天应用。它的设计目标是在你的 Mac 本地管理模型凭据、agent 状态、技能、计划任务、沙盒工作流和工作区文件。Nora 会在你连接模型提供商、下载或更新应用、检查 provider 用量，或要求 agent 使用外部服务时发起网络请求。",
            ],
          ],
        },
        {
          title: "本地应用数据",
          paragraphs: [
            [
              "聊天记录、agent 事件、provider 设置、凭据、token、用量快照、技能、计划任务、沙盒状态、工作区文件和你选择的本地文件，会保留在你的 Mac 或你选择的位置。除非你主动发送到外部服务，或在支持请求中附上这些内容，Nora 不会把它们上传到 Nora 服务器。",
            ],
          ],
        },
        {
          title: "模型提供商和外部服务",
          paragraphs: [
            [
              "当你使用 OpenAI、Anthropic、Google Gemini、Bedrock、Azure、Cloudflare、Cerebras、网关或 OpenAI 兼容端点时，Nora 会把 prompt、你选择的上下文，以及你允许 agent 使用的文件或内容发送给对应提供商。相关请求由这些提供商按照它们自己的条款和隐私政策处理。",
            ],
            [
              "不要在支持邮件中发送原始 API Key、access token、session cookie 或其他密钥。Provider 凭据应保留在应用内和你的 Mac 上。",
            ],
          ],
        },
        {
          title: "Agent、沙盒和技能",
          paragraphs: [
            [
              "Agent 工作可以读取文件、运行工具并提出文件变更，但前提是这些流程由你启动或批准。编码变更会先进入沙盒审核流程，在触碰主机文件系统前，你可以接受部分文件、接受全部变更或丢弃本次运行。",
            ],
            [
              "技能是带有说明的本地能力包。任务需要时，Nora 可能会把相关技能说明提供给 agent。导入、同步、置顶和启用的技能都由桌面应用在本地管理。",
            ],
          ],
        },
        {
          title: "macOS 权限",
          paragraphs: [
            [
              "Nora 可能会请求文件访问、辅助功能、屏幕访问、自动化、通知等 macOS 权限。这些权限只用于你选择使用的本地 agent、桌面自动化、文件审核、沙盒工作流和通知功能。你可以在系统设置中管理这些权限。",
            ],
          ],
        },
        {
          title: "诊断和支持",
          paragraphs: [
            [
              "Nora 可能会在你的 Mac 本地保存日志、运行状态、provider 用量快照和错误详情，用于应用运行和问题排查。如果你联系支持，由你决定分享哪些信息。发送诊断信息前，请移除凭据、token、私密文件和无关个人信息。",
            ],
          ],
        },
        {
          title: "网站",
          paragraphs: [
            [
              "当你访问本网站时，我们的托管和基础设施提供商可能会处理标准服务器日志数据，例如 IP 地址、浏览器 user agent、请求 URL 和请求时间，用于安全、诊断和网站交付。本网站不使用广告追踪器。",
            ],
          ],
        },
        {
          title: "变更和联系",
          paragraphs: [["随着 Nora 变化，我们可能会更新本政策。如果你有隐私问题，请通过 ", emailLink, " 联系我们。"]],
        },
      ],
    },
    support: {
      eyebrow: "支持",
      title: "Nora 支持",
      updated: "获取 Nora macOS 版帮助。",
      sections: [
        {
          title: "联系",
          paragraphs: [["如需产品支持、问题报告、安装设置问题或反馈，请发送邮件至 ", emailLink, "。"]],
        },
        {
          title: "请包含这些信息",
          paragraphs: [
            [
              "报告问题时，请包含 macOS 版本、Nora 版本、Mac 型号、选择的模型提供商、认证方式、当时正在执行的任务，以及简短的问题描述。如果是界面问题，截图或短视频会很有帮助。",
            ],
          ],
        },
        {
          title: "安装和更新",
          paragraphs: [
            [
              "Nora 通过 DMG 安装包分发。下载、安装或更新遇到问题时，请附上系统版本、应用版本和错误截图。",
            ],
          ],
        },
        {
          title: "模型和凭据",
          paragraphs: [
            [
              "模型连接出问题时，请提供提供商、模型名称、路由类型，以及你使用的是 OAuth、API Key、订阅、网关还是 OpenAI 兼容端点。不要发送原始 API Key 或 access token。",
            ],
          ],
        },
        {
          title: "本地 agent 和沙盒运行",
          paragraphs: [
            [
              "编码或文件变更相关问题，请提供工作区路径、是否使用沙盒、你是接受了部分文件、接受全部变更，还是丢弃了本次运行。如果 agent 停在错误状态，请复制界面上可见的错误文本。",
            ],
          ],
        },
        {
          title: "技能和计划任务",
          paragraphs: [
            [
              "技能相关问题，请提供技能名称、来源，以及它当前是启用、置顶、导入，还是从文件夹同步。计划任务相关问题，请提供任务名称、触发时间和最近一次运行结果。",
            ],
          ],
        },
        {
          title: "macOS 权限",
          paragraphs: [
            [
              "部分 agent 工作流需要 macOS 权限，例如辅助功能、文件访问或屏幕访问。如果 Nora 无法读取或控制某个 app，请先检查系统设置，并在报告中写明受影响的 app 名称。",
            ],
          ],
        },
        {
          title: "隐私",
          paragraphs: [["模型凭据、agent 状态、技能、计划任务、沙盒运行结果和工作区文件都由桌面应用在本地管理。更多详情请阅读 ", { href: "/privacy", text: "隐私政策" }, "。"]],
        },
      ],
    },
    terms: {
      eyebrow: "条款",
      title: "使用条款",
      updated: "最后更新：2026 年 6 月 15 日",
      sections: [
        {
          title: "App 授权",
          paragraphs: [
            [
              "Nora 是面向 macOS 的桌面应用，用于本地 AI 聊天、coding agent、productivity agent 和桌面工作流。你可以在自己控制的设备上安装和使用 Nora，但需要遵守适用法律、模型提供商条款以及本条款。",
            ],
          ],
        },
        {
          title: "模型提供商和外部服务",
          paragraphs: [
            [
              "Nora 可以连接 OpenAI、Anthropic、Google Gemini、Bedrock、Azure、Cloudflare、Cerebras、gateway 和 OpenAI-compatible endpoint。你需要自行负责所连接账号、凭据、使用量、费用和对应提供商政策。",
            ],
            [
              "不要在支持邮件里发送 provider credentials、API keys、tokens、session cookies 或其他 secret。",
            ],
          ],
        },
        {
          title: "Agent 工作",
          paragraphs: [
            [
              "你需要对交给 Nora 或已连接 agent 处理的 prompts、files、code、commands、automations 和 outputs 负责。接受文件改动或 agent 操作前，请先审查。",
            ],
            [
              "Sandbox workflows、skills、schedules 和 desktop automation 功能只是服务于你工作流的工具。你需要决定 Nora 可以读取、运行、修改什么，以及哪些内容可以发送给外部提供商。",
            ],
          ],
        },
        {
          title: "可接受使用",
          paragraphs: [
            [
              "不要使用 Nora 违反法律、绕过访问控制、滥用外部服务、干扰其他系统，或处理你无权使用的内容。",
            ],
          ],
        },
        {
          title: "隐私",
          paragraphs: [["Nora 的隐私实践见 ", { href: "/privacy", text: "隐私政策" }, "。"]],
        },
        {
          title: "联系",
          paragraphs: [["如果你对这些条款有疑问，请通过 ", emailLink, " 联系我们。"]],
        },
      ],
    },
  },
  changelog: {
    description: "产品更新、修复和版本说明。",
    eyebrow: "更新日志",
    intro: "产品更新、修复和版本说明。",
    linkVersionLabel: "链接到版本",
    title: "Nora 更新日志",
  },
} satisfies LocaleTranslation;
