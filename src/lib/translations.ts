import type { Locale } from "./i18n";
import { en } from "./translations/en";
import { ja } from "./translations/ja";
import { zhCn } from "./translations/zh-cn";

export type RichTextSegment = string | { href: string; text: string };

export type HeaderCopy = {
  backToMenuAria: string;
  closeMenuAria: string;
  homeAria: string;
  login: string;
  logout: string;
  logoAlt: string;
  menuAria: string;
  nav: {
    changelog: string;
    feedback: string;
    privacy: string;
    support: string;
    terms: string;
  };
  primaryNavigationAria: string;
};

export type FooterCopy = {
  appStoreButton: string;
  copyright: string;
  ctaText: string;
  ctaTitle: string;
  description: string;
  groups: {
    legal: string;
    product: string;
    resources: string;
  };
  language: string;
  legalLinks: {
    privacy: string;
    terms: string;
  };
  productLinks: {
    faq: string;
  };
  resourceLinks: {
    changelog: string;
    support: string;
  };
  systemStatus: string;
};

export type HeroCopy = {
  appStoreButton: string;
  builtWithLabel: string;
  builtWithValue: string;
  systemLabel: string;
  systemValue: string;
  tagline: string;
  titleLines: Array<[string, string]>;
};

export type FeatureCardsCopy = {
  eyebrow: string;
  items: Array<{
    caption: string;
    title: string;
  }>;
  subtitle: string;
  title: string;
};

export type FAQCopy = {
  eyebrow: string;
  items: Array<{
    answer: string;
    question: string;
  }>;
  title: string;
};

export type FeedbackPageCopy = {
  activityTitle: string;
  auth: {
    signInRequired: string;
  };
  categories: {
    all: string;
    bug: string;
    feature: string;
  };
  contributors: {
    empty: string;
    title: string;
  };
  detail: {
    adminAdd: string;
    adminAddedBy: string;
    adminAdding: string;
    adminHelp: string;
    adminInputLabel: string;
    adminInputPlaceholder: string;
    adminListEmpty: string;
    adminsTitle: string;
    attachments: string;
    back: string;
    commentLabel: string;
    commentPlaceholder: string;
    commentSubmit: string;
    commentSubmitting: string;
    comments: string;
    emptyComments: string;
    issueLink: string;
    promote: string;
    promoteComplete: string;
    promoteHint: string;
    promoting: string;
  };
  empty: {
    description: string;
    title: string;
  };
  eyebrow: string;
  form: {
    attachmentHelp: string;
    attachmentsLabel: string;
    categoryLabel: string;
    close: string;
    descriptionLabel: string;
    descriptionPlaceholder: string;
    markdownHint: string;
    open: string;
    removeAttachment: string;
    submit: string;
    submitting: string;
    title: string;
    titleLabel: string;
    titlePlaceholder: string;
  };
  intro: string;
  listTitle: string;
  loading: string;
  searchPlaceholder: string;
  signInPanel: {
    description: string;
    title: string;
  };
  sort: {
    new: string;
    top: string;
    trending: string;
  };
  stats: {
    closed: string;
    open: string;
    promoted: string;
    votes: string;
  };
  status: {
    closed: string;
    open: string;
    promoted: string;
  };
  title: string;
  voteDownAria: string;
  voteUpAria: string;
};

export type LegalPageCopy = {
  eyebrow: string;
  title: string;
  updated: string;
  sections: Array<{
    paragraphs: RichTextSegment[][];
    title: string;
  }>;
};

type PageMeta = {
  description: string;
  title: string;
};

export type LocaleTranslation = {
  changelog: {
    description: string;
    eyebrow: string;
    intro: string;
    linkVersionLabel: string;
    title: string;
  };
  common: {
    skipToContent: string;
  };
  footer: FooterCopy;
  feedback: FeedbackPageCopy;
  header: HeaderCopy;
  home: {
    featureCards: FeatureCardsCopy;
    faq: FAQCopy;
    hero: HeroCopy;
    structuredDataFeatureList: string[];
  };
  legal: {
    privacy: LegalPageCopy;
    support: LegalPageCopy;
    terms: LegalPageCopy;
  };
  meta: {
    changelog: PageMeta;
    feedback: PageMeta;
    home: PageMeta;
    privacy: PageMeta;
    support: PageMeta;
    terms: PageMeta;
  };
};

export const translations: Record<Locale, LocaleTranslation> = {
  en,
  "zh-Hans": zhCn,
  ja,
};

export function getTranslation(locale: Locale): LocaleTranslation {
  return translations[locale];
}
