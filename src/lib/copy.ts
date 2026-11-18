
export type RichTextSegment = string | { href: string; text: string };

export type HeaderCopy = {
  closeMenuAria: string;
  homeAria: string;
  login: string;
  logout: string;
  logoAlt: string;
  menuAria: string;
  nav: {
    changelog: string;
    docs: string;
    download: string;
    features: string;
    feedback: string;
    privacy: string;
    support: string;
    terminal: string;
    terms: string;
  };
  primaryNavigationAria: string;
  themeAria: string;
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
  legalLinks: {
    privacy: string;
    terms: string;
  };
  productLinks: {
    docs: string;
    download: string;
    faq: string;
  };
  resourceLinks: {
    changelog: string;
    feedback: string;
    support: string;
  };
  systemStatus: string;
};

/** A headline whose middle part is set as an inked italic. */
export type AccentTitle = [lead: string, accent: string, tail: string];

export type HomeCardCopy = {
  body: string;
  chips?: string[];
  glyph?: string;
  title: string;
};

export type HomeSectionCopy = {
  eyebrow: string;
  items: HomeCardCopy[];
  lede: string;
  link?: { href: string; text: string };
  title: AccentTitle;
};

export type HomeCopy = {
  announcement: { tag: string; text: string; href: string };
  app: HomeSectionCopy;
  download: {
    cliAction: string;
    cliDetail: string;
    cliTitle: string;
    command: string;
    lede: string;
    macAction: string;
    macDetail: string;
    macTitle: string;
    notes: string[];
    title: AccentTitle;
    versionLabel: string;
    versionLoading: string;
  };
  extend: HomeSectionCopy;
  faq: FAQCopy;
  hero: {
    docs: string;
    download: string;
    downloadMeta: string;
    figureAlt: string;
    lede: string;
    panelLabel: string;
    specs: string;
    title: AccentTitle;
  };
  structuredDataFeatureList: string[];
  terminal: HomeSectionCopy & { session: string[] };
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
    closed: string;
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

export type SiteCopy = {
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
  notFound: {
    description: string;
    docs: string;
    home: string;
    title: string;
  };
  footer: FooterCopy;
  feedback: FeedbackPageCopy;
  header: HeaderCopy;
  home: HomeCopy;
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

export { siteCopy } from "./copy/site";
