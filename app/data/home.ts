export type NavItem = {
  label: string
  href: string
}

export type WorkMode = {
  title: string
  text: string
}

export type FeatureItem = {
  icon: string
  title: string
  text: string
}

export type FaqItem = {
  question: string
  answer: string
}

export const downloadHref = '/api/download?platform=macos'

export const navItems: NavItem[] = [
  { label: 'Features', href: '#features' },
  { label: 'Download', href: '#download' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Feedback', href: '/feedback' },
]

export const footerLinks: NavItem[] = [
  { label: 'Features', href: '#features' },
  { label: 'Download', href: '#download' },
  { label: 'Feedback', href: '/feedback' },
]

export const workModes: WorkMode[] = [
  {
    title: 'Track work without switching context.',
    text: 'Active, waiting, and finished runs stay visible.',
  },
  {
    title: 'Let agents operate the computer.',
    text: 'Only after you allow it.',
  },
  {
    title: 'Inspect changes first.',
    text: 'Accept selected files or discard the run.',
  },
]

export const features: FeatureItem[] = [
  {
    icon: 'i-lucide-message-circle',
    title: 'Local sessions',
    text: 'One conversation, one local agent loop.',
  },
  {
    icon: 'i-lucide-monitor-down',
    title: 'Computer use',
    text: 'Operate Mac apps only when you allow it.',
  },
  {
    icon: 'i-lucide-shield-check',
    title: 'Sandbox review',
    text: 'Accept only the changes you want.',
  },
]

export const faqs: FaqItem[] = [
  {
    question: 'What is Nora?',
    answer:
      'Nora is a macOS-first local agent chat app for running coding and productivity agents on your own machine.',
  },
  {
    question: 'Is Nora local-first?',
    answer:
      'Yes. Provider credentials, agent state, skills, schedules, and sandbox workflows are managed locally by the desktop app.',
  },
  {
    question: 'Which model providers does it support?',
    answer:
      'It works with OAuth, API-key, subscription, gateway, and OpenAI-compatible routes, including OpenAI, Anthropic, Google Gemini, Bedrock, Azure, Cloudflare, Cerebras, and custom endpoints.',
  },
  {
    question: 'How are file changes reviewed?',
    answer:
      'Agent edits happen in a sandbox first. You can inspect proposed changes, accept selected files, accept all, or discard the run before anything touches the host filesystem.',
  },
  {
    question: 'What are skills?',
    answer:
      'Skills are local capability packages with a SKILL.md entry point. Nora advertises active skills to the agent and loads the relevant instructions only when a task needs them.',
  },
]
