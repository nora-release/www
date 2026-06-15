import type { Locale } from "./i18n";
import { en } from "./translations/en";
import { ja } from "./translations/ja";
import { zhCn } from "./translations/zh-cn";

export type RichTextSegment = string | { href: string; text: string };

export type HeaderCopy = {
  appStore: string;
  backToMenuAria: string;
  closeMenuAria: string;
  homeAria: string;
  logoAlt: string;
  menuAria: string;
  nav: {
    changelog: string;
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
