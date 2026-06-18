"use client";

import {
  ArrowUpDown,
  Bug,
  Lightbulb,
  Loader2,
  MessageSquare,
  Paperclip,
  Plus,
  Search,
  ThumbsDown,
  ThumbsUp,
  UserPlus,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import { authClient } from "../lib/auth-client";
import type { Locale } from "../lib/i18n";
import { localizedPath } from "../lib/i18n";
import type { FeedbackPageCopy } from "../lib/translations";
import { MarkdownContent } from "./markdown-content";

type FeedbackCategory = "feature" | "bug";
type FeedbackStatus = "open" | "promoted" | "closed";
type CategoryFilter = FeedbackCategory | "all" | "closed";
type SortMode = "new" | "top" | "trending";

type FeedbackAuthor = {
  avatarUrl: string;
  githubId: string;
  htmlUrl: string;
  login: string;
  name: string;
};

type FeedbackItem = {
  attachmentCount: number;
  author: FeedbackAuthor;
  category: FeedbackCategory;
  createdAt: string;
  description: string;
  downvotes: number;
  id: string;
  messageCount: number;
  score: number;
  status: FeedbackStatus;
  title: string;
  updatedAt: string;
  upvotes: number;
  userVote: -1 | 0 | 1;
};

type FeedbackContributor = FeedbackAuthor & {
  feedbackCount: number;
  voteCount: number;
};

type FeedbackAdmin = {
  createdAt: string;
  createdByLogin: string | null;
  githubLogin: string;
};

type SessionUser = {
  email?: string | null;
  image?: string | null;
  name?: string | null;
};

type FeedbackBoardProps = {
  copy: FeedbackPageCopy;
  locale: Locale;
};

function getDisplayLocale(locale: Locale) {
  return locale === "zh-Hans" ? "zh-CN" : locale;
}

function formatDate(value: string, locale: Locale) {
  return new Intl.DateTimeFormat(getDisplayLocale(locale), {
    day: "numeric",
    month: "short",
  }).format(new Date(value));
}

function getAuthorName(author: FeedbackAuthor) {
  return author.name || author.login;
}

function formatFileSize(sizeBytes: number) {
  if (sizeBytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(sizeBytes / 1024))} KB`;
  }

  return `${(sizeBytes / 1024 / 1024).toFixed(1)} MB`;
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  const chunkSize = 0x8000;

  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize));
  }

  return btoa(binary);
}

async function fileToPayload(file: File) {
  return {
    contentType: file.type || "application/octet-stream",
    dataBase64: bytesToBase64(new Uint8Array(await file.arrayBuffer())),
    fileName: file.name || "attachment",
    sizeBytes: file.size,
  };
}

function isFile(value: FormDataEntryValue): value is File {
  return (
    typeof value === "object" &&
    value !== null &&
    "arrayBuffer" in value &&
    "name" in value &&
    "size" in value
  );
}

async function readJsonResponse(response: Response) {
  const text = await response.text();

  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch {
    return {
      error: text,
    };
  }
}

export function FeedbackBoard({ copy, locale }: FeedbackBoardProps) {
  const attachmentInputRef = useRef<HTMLInputElement | null>(null);
  const [items, setItems] = useState<FeedbackItem[]>([]);
  const [contributors, setContributors] = useState<FeedbackContributor[]>([]);
  const [adminLogin, setAdminLogin] = useState("");
  const [admins, setAdmins] = useState<FeedbackAdmin[]>([]);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [sort, setSort] = useState<SortMode>("trending");
  const [search, setSearch] = useState("");
  const [sessionUser, setSessionUser] = useState<SessionUser | null>(null);
  const [canManageAdmins, setCanManageAdmins] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isAdminSubmitting, setIsAdminSubmitting] = useState(false);
  const [isFeedbackLoading, setIsFeedbackLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingVoteId, setPendingVoteId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    category: "feature" as FeedbackCategory,
    description: "",
    title: "",
  });

  const loadFeedback = async () => {
    setIsFeedbackLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/feedback", {
        headers: {
          Accept: "application/json",
        },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to load feedback.");
      }

      setItems(data.items ?? []);
      setContributors(data.contributors ?? []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load feedback.");
    } finally {
      setIsFeedbackLoading(false);
    }
  };

  const loadAdmins = async () => {
    try {
      const response = await fetch("/api/feedback/admins", {
        headers: {
          Accept: "application/json",
        },
      });
      const data = await response.json().catch(() => ({}));

      if (response.status === 403) {
        setAdmins([]);
        setCanManageAdmins(false);
        return;
      }

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to load admins.");
      }

      setAdmins(data.admins ?? []);
      setCanManageAdmins(true);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load admins.");
    }
  };

  useEffect(() => {
    let isDisposed = false;

    const loadSession = async () => {
      const result = await authClient.getSession().catch(() => null);

      if (isDisposed) return;

      setSessionUser((result as { data?: { user?: SessionUser | null } } | null)?.data?.user ?? null);
      setIsAuthLoading(false);
    };

    const handleAuthChange = () => {
      void loadSession();
      void loadFeedback();
      void loadAdmins();
    };

    window.addEventListener("nora-auth-change", handleAuthChange);

    void loadSession();
    void loadFeedback();
    void loadAdmins();

    return () => {
      isDisposed = true;
      window.removeEventListener("nora-auth-change", handleAuthChange);
    };
  }, []);

  const stats = useMemo(() => {
    return {
      closed: items.filter((item) => item.status === "closed").length,
      open: items.filter((item) => item.status === "open").length,
      promoted: items.filter((item) => item.status === "promoted").length,
      votes: items.reduce((total, item) => total + item.upvotes + item.downvotes, 0),
    };
  }, [items]);

  const visibleItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    return items
      .filter((item) => {
        const matchesStatus = category === "closed" ? item.status === "closed" : item.status !== "closed";
        const matchesCategory = category === "all" || category === "closed" || item.category === category;
        const matchesSearch =
          !query ||
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.author.login.toLowerCase().includes(query);

        return matchesStatus && matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sort === "top") {
          return b.score - a.score || new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        }

        if (sort === "new") {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }

        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
  }, [category, items, search, sort]);

  const submitFeedback = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!sessionUser) {
      setError(copy.auth.signInRequired);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const submittedFiles =
        attachments.length > 0
          ? attachments
          : new FormData(event.currentTarget)
              .getAll("attachments")
              .filter((entry): entry is File => isFile(entry) && entry.size > 0);
      const attachmentPayloads = await Promise.all(submittedFiles.map(fileToPayload));

      const response = await fetch("/api/feedback", {
        body: JSON.stringify({
          attachments: attachmentPayloads,
          category: form.category,
          description: form.description,
          title: form.title,
        }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
      });
      const data = await readJsonResponse(response);

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to post feedback.");
      }

      setItems((currentItems) => [data.item, ...currentItems]);
      setContributors(data.contributors ?? contributors);
      setForm({
        category: "feature",
        description: "",
        title: "",
      });
      setAttachments([]);
      if (attachmentInputRef.current) {
        attachmentInputRef.current.value = "";
      }
      setCategory("all");
      setSort("trending");
      setIsFormOpen(false);

      if (attachmentPayloads.length > 0 && data.item?.id) {
        window.location.assign(localizedPath(locale, `/feedback/${data.item.id}`));
      }
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Failed to post feedback.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const addAttachments = (files: FileList | null) => {
    if (!files) {
      return;
    }

    setAttachments((currentAttachments) => [...currentAttachments, ...Array.from(files)].slice(0, 5));
  };

  const addAdmin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const githubLogin = adminLogin.trim();

    if (!githubLogin || !canManageAdmins) {
      return;
    }

    setIsAdminSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/feedback/admins", {
        body: JSON.stringify({ githubLogin }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to add admin.");
      }

      setAdmins(data.admins ?? []);
      setCanManageAdmins(true);
      setAdminLogin("");
    } catch (adminError) {
      setError(adminError instanceof Error ? adminError.message : "Failed to add admin.");
    } finally {
      setIsAdminSubmitting(false);
    }
  };

  const vote = async (item: FeedbackItem, nextValue: -1 | 1) => {
    if (!sessionUser) {
      setError(copy.auth.signInRequired);
      return;
    }

    setPendingVoteId(item.id);
    setError(null);

    const value = item.userVote === nextValue ? 0 : nextValue;

    try {
      const response = await fetch(`/api/feedback/${item.id}/vote`, {
        body: JSON.stringify({ value }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to vote.");
      }

      setItems((currentItems) =>
        currentItems.map((currentItem) => (currentItem.id === item.id ? data.item : currentItem)),
      );
      setContributors(data.contributors ?? contributors);
    } catch (voteError) {
      setError(voteError instanceof Error ? voteError.message : "Failed to vote.");
    } finally {
      setPendingVoteId(null);
    }
  };

  const isSignedIn = Boolean(sessionUser);

  return (
    <div className="mx-auto w-full max-w-7xl px-6 pb-24 pt-32 md:px-12">
      <header className="border-b border-border/60 pb-12">
        <div>
          <p className="mb-5 text-xs font-medium uppercase tracking-[0.28em] text-muted-foreground">
            {copy.eyebrow}
          </p>
          <h1 className="max-w-4xl text-[clamp(3rem,8vw,7rem)] font-bold leading-[0.88] tracking-tight text-foreground">
            {copy.title}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
            {copy.intro}
          </p>
        </div>
      </header>

      <section className="grid gap-6 py-8 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label={copy.stats.open} value={stats.open} />
        <Stat label={copy.stats.promoted} value={stats.promoted} />
        <Stat label={copy.stats.closed} value={stats.closed} />
        <Stat label={copy.stats.votes} value={stats.votes} />
      </section>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-6">
          <section className="border border-border/70 bg-card/25">
            <div className="flex flex-col gap-4 border-b border-border/70 p-5 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-foreground">{copy.listTitle}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {visibleItems.length} / {items.length}
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(true)}
                  className="inline-flex h-10 items-center justify-center gap-2 bg-foreground px-4 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  {copy.form.open}
                </button>

                <label className="relative block">
                  <Search
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder={copy.searchPlaceholder}
                    className="h-10 w-full border border-border/70 bg-background/70 pl-9 pr-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-foreground/50 sm:w-56"
                  />
                </label>

                <div className="flex border border-border/70">
                  {(["trending", "top", "new"] as SortMode[]).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setSort(mode)}
                      className={`h-10 px-3 text-sm transition-colors ${
                        sort === mode ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {copy.sort[mode]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 border-b border-border/70 p-5">
              {(["all", "feature", "bug", "closed"] as CategoryFilter[]).map((nextCategory) => (
                <button
                  key={nextCategory}
                  type="button"
                  onClick={() => setCategory(nextCategory)}
                  className={`inline-flex h-9 items-center gap-2 border px-3 text-sm transition-colors ${
                    category === nextCategory
                      ? "border-foreground bg-foreground text-background"
                      : "border-border/70 text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                  }`}
                >
                  {nextCategory !== "all" && (
                    nextCategory === "feature" ? (
                      <Lightbulb className="h-4 w-4" aria-hidden="true" />
                    ) : nextCategory === "bug" ? (
                      <Bug className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <X className="h-4 w-4" aria-hidden="true" />
                    )
                  )}
                  {copy.categories[nextCategory]}
                </button>
              ))}
            </div>

            {error && (
              <div className="border-b border-border/70 bg-destructive/10 px-5 py-4 text-sm text-destructive-foreground">
                {error}
              </div>
            )}

            {isFeedbackLoading ? (
              <div className="flex min-h-64 items-center justify-center gap-3 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                {copy.loading}
              </div>
            ) : visibleItems.length === 0 ? (
              <div className="min-h-64 p-8">
                <div className="max-w-md">
                  <h3 className="text-lg font-medium text-foreground">{copy.empty.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{copy.empty.description}</p>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-border/70">
                {visibleItems.map((item) => (
                  <FeedbackListItem
                    copy={copy}
                    item={item}
                    key={item.id}
                    locale={locale}
                    onVote={vote}
                    pendingVoteId={pendingVoteId}
                  />
                ))}
              </div>
            )}
          </section>
        </div>

        <aside className="space-y-6">
          {canManageAdmins && (
            <div className="border border-border/70 bg-card/30 p-5">
              <h2 className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.22em] text-muted-foreground">
                <UserPlus className="h-4 w-4" aria-hidden="true" />
                {copy.detail.adminsTitle}
              </h2>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">{copy.detail.adminHelp}</p>

              <form onSubmit={addAdmin} className="mt-4 grid gap-3">
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-foreground">{copy.detail.adminInputLabel}</span>
                  <input
                    value={adminLogin}
                    onChange={(event) => setAdminLogin(event.target.value)}
                    placeholder={copy.detail.adminInputPlaceholder}
                    disabled={isAdminSubmitting}
                    className="h-10 border border-border/70 bg-background/70 px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-foreground/50 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </label>
                <button
                  type="submit"
                  disabled={isAdminSubmitting || !adminLogin.trim()}
                  className="inline-flex h-10 items-center justify-center gap-2 bg-foreground px-4 text-sm font-medium text-background transition-colors hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isAdminSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <UserPlus className="h-4 w-4" aria-hidden="true" />
                  )}
                  {isAdminSubmitting ? copy.detail.adminAdding : copy.detail.adminAdd}
                </button>
              </form>

              {admins.length === 0 ? (
                <p className="mt-5 text-sm leading-6 text-muted-foreground">{copy.detail.adminListEmpty}</p>
              ) : (
                <div className="mt-5 grid gap-2">
                  {admins.map((admin) => (
                    <div key={admin.githubLogin} className="border border-border/70 bg-background/50 px-3 py-2 text-sm">
                      <a
                        href={`https://github.com/${admin.githubLogin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-foreground transition-colors hover:text-muted-foreground"
                      >
                        @{admin.githubLogin}
                      </a>
                      {admin.createdByLogin && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          {copy.detail.adminAddedBy} @{admin.createdByLogin}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="border border-border/70 bg-card/30 p-5">
            <h2 className="text-sm font-medium uppercase tracking-[0.22em] text-muted-foreground">
              {copy.contributors.title}
            </h2>

            {contributors.length === 0 ? (
              <p className="mt-5 text-sm leading-6 text-muted-foreground">{copy.contributors.empty}</p>
            ) : (
              <div className="mt-5 space-y-4">
                {contributors.map((contributor) => (
                  <a
                    key={contributor.githubId}
                    href={contributor.htmlUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm transition-colors hover:text-foreground"
                  >
                    {contributor.avatarUrl ? (
                      <img
                        src={contributor.avatarUrl}
                        alt=""
                        className="h-9 w-9 border border-border/70 bg-secondary object-cover"
                      />
                    ) : (
                      <span className="flex h-9 w-9 items-center justify-center border border-border/70 bg-secondary text-xs text-foreground">
                        {contributor.login.slice(0, 2).toUpperCase()}
                      </span>
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-foreground">{getAuthorName(contributor)}</span>
                      <span className="block truncate text-muted-foreground">@{contributor.login}</span>
                    </span>
                    <span className="text-muted-foreground">{contributor.feedbackCount}</span>
                  </a>
                ))}
              </div>
            )}
          </div>

          <div className="border border-border/70 bg-card/30 p-5">
            <h2 className="text-sm font-medium uppercase tracking-[0.22em] text-muted-foreground">
              {copy.activityTitle}
            </h2>
            <div className="mt-5 space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2">
                  <ArrowUpDown className="h-4 w-4" aria-hidden="true" />
                  {copy.sort.trending}
                </span>
                <span>{items.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" aria-hidden="true" />
                  {copy.stats.votes}
                </span>
                <span>{stats.votes}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-[120] flex items-start justify-center overflow-y-auto bg-black/70 px-4 py-20 backdrop-blur-sm">
          <button
            type="button"
            className="absolute inset-0"
            aria-label={copy.form.close}
            onClick={() => setIsFormOpen(false)}
          />

          <form
            onSubmit={submitFeedback}
            className="relative z-10 w-full max-w-2xl border border-border/70 bg-background p-5 shadow-[0_24px_90px_rgba(0,0,0,0.55)] md:p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-foreground">{copy.form.title}</h2>
                {!isSignedIn && (
                  <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                    {copy.auth.signInRequired}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="flex h-9 w-9 shrink-0 items-center justify-center border border-border/70 text-muted-foreground transition-colors hover:border-foreground/50 hover:text-foreground"
                aria-label={copy.form.close}
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-5 flex w-fit border border-border/70">
              {(["feature", "bug"] as FeedbackCategory[]).map((nextCategory) => {
                const Icon = nextCategory === "feature" ? Lightbulb : Bug;
                const isSelected = form.category === nextCategory;

                return (
                  <button
                    key={nextCategory}
                    type="button"
                    onClick={() => setForm((currentForm) => ({ ...currentForm, category: nextCategory }))}
                    className={`inline-flex h-10 items-center gap-2 px-3 text-sm transition-colors ${
                      isSelected ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    {copy.categories[nextCategory]}
                  </button>
                );
              })}
            </div>

            <div className="mt-5 grid gap-4">
              <label className="grid gap-2">
                <span className="text-sm font-medium text-foreground">{copy.form.titleLabel}</span>
                <input
                  value={form.title}
                  onChange={(event) => setForm((currentForm) => ({ ...currentForm, title: event.target.value }))}
                  placeholder={copy.form.titlePlaceholder}
                  disabled={!isSignedIn || isSubmitting}
                  className="h-12 border border-border/70 bg-background/70 px-4 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-foreground/50 disabled:cursor-not-allowed disabled:opacity-60"
                  maxLength={120}
                  required
                />
              </label>

              <label className="grid gap-2">
                <span className="flex flex-wrap items-center justify-between gap-2 text-sm font-medium text-foreground">
                  <span>{copy.form.descriptionLabel}</span>
                  <span className="font-normal text-muted-foreground">{copy.form.markdownHint}</span>
                </span>
                <textarea
                  value={form.description}
                  onChange={(event) =>
                    setForm((currentForm) => ({ ...currentForm, description: event.target.value }))
                  }
                  placeholder={copy.form.descriptionPlaceholder}
                  disabled={!isSignedIn || isSubmitting}
                  className="min-h-36 resize-y border border-border/70 bg-background/70 px-4 py-3 text-base leading-7 text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-foreground/50 disabled:cursor-not-allowed disabled:opacity-60"
                  maxLength={2000}
                />
              </label>

              <div className="grid gap-2">
                <span className="text-sm font-medium text-foreground">{copy.form.attachmentsLabel}</span>
                <label
                  className={`flex min-h-20 cursor-pointer flex-col justify-center gap-2 border border-dashed border-border/80 bg-background/50 px-4 py-3 text-sm text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground ${
                    !isSignedIn || isSubmitting ? "pointer-events-none opacity-60" : ""
                  }`}
                >
                  <span className="inline-flex items-center gap-2">
                    <Paperclip className="h-4 w-4" aria-hidden="true" />
                    {copy.form.attachmentHelp}
                  </span>
                  <input
                    ref={attachmentInputRef}
                    type="file"
                    name="attachments"
                    multiple
                    disabled={!isSignedIn || isSubmitting}
                    onChange={(event) => {
                      addAttachments(event.currentTarget.files);
                    }}
                    className="sr-only"
                  />
                </label>

                {attachments.length > 0 && (
                  <div className="grid gap-2">
                    {attachments.map((attachment, attachmentIndex) => (
                      <div
                        key={`${attachment.name}-${attachment.size}-${attachmentIndex}`}
                        className="flex items-center justify-between gap-3 border border-border/70 bg-card/30 px-3 py-2 text-sm"
                      >
                        <span className="min-w-0">
                          <span className="block truncate text-foreground">{attachment.name}</span>
                          <span className="block text-xs text-muted-foreground">{formatFileSize(attachment.size)}</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            if (attachmentInputRef.current) {
                              attachmentInputRef.current.value = "";
                            }
                            setAttachments((currentAttachments) =>
                              currentAttachments.filter((_, index) => index !== attachmentIndex),
                            );
                          }}
                          disabled={isSubmitting}
                          className="inline-flex h-8 w-8 shrink-0 items-center justify-center border border-border/70 text-muted-foreground transition-colors hover:border-foreground/50 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60"
                          aria-label={copy.form.removeAttachment}
                        >
                          <X className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {error && (
                <div className="border border-border/70 bg-destructive/10 px-4 py-3 text-sm text-destructive-foreground">
                  {error}
                </div>
              )}

              <div className="flex items-center justify-between gap-4">
                <p className="text-sm text-muted-foreground">
                  {isSignedIn ? sessionUser?.name || sessionUser?.email : copy.signInPanel.title}
                </p>
                <button
                  type="submit"
                  disabled={!isSignedIn || isAuthLoading || isSubmitting}
                  className="inline-flex h-11 items-center gap-2 bg-foreground px-5 text-sm font-medium text-background transition-colors hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                  {isSubmitting ? copy.form.submitting : copy.form.submit}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-border/70 bg-card/30 p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-foreground">{value}</p>
    </div>
  );
}

function FeedbackListItem({
  copy,
  item,
  locale,
  onVote,
  pendingVoteId,
}: {
  copy: FeedbackPageCopy;
  item: FeedbackItem;
  locale: Locale;
  onVote: (item: FeedbackItem, nextValue: -1 | 1) => Promise<void>;
  pendingVoteId: string | null;
}) {
  const Icon = item.category === "feature" ? Lightbulb : Bug;
  const isVotePending = pendingVoteId === item.id;
  const detailHref = localizedPath(locale, `/feedback/${item.id}`);

  return (
    <article className="grid gap-5 p-5 md:grid-cols-[4rem_minmax(0,1fr)]">
      <div className="flex items-center gap-2 md:flex-col">
        <button
          type="button"
          aria-label={copy.voteUpAria}
          onClick={() => onVote(item, 1)}
          disabled={isVotePending}
          className={`flex h-9 w-9 items-center justify-center border transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
            item.userVote === 1
              ? "border-foreground bg-foreground text-background"
              : "border-border/70 text-muted-foreground hover:border-foreground/40 hover:text-foreground"
          }`}
        >
          <ThumbsUp className="h-4 w-4" aria-hidden="true" />
        </button>
        <span className="min-w-8 text-center text-base font-semibold text-foreground">{item.score}</span>
        <button
          type="button"
          aria-label={copy.voteDownAria}
          onClick={() => onVote(item, -1)}
          disabled={isVotePending}
          className={`flex h-9 w-9 items-center justify-center border transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
            item.userVote === -1
              ? "border-foreground bg-foreground text-background"
              : "border-border/70 text-muted-foreground hover:border-foreground/40 hover:text-foreground"
          }`}
        >
          <ThumbsDown className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex h-7 items-center gap-2 border border-border/70 px-2 text-xs text-muted-foreground">
            <Icon className="h-3.5 w-3.5" aria-hidden="true" />
            {copy.categories[item.category]}
          </span>
          <span className="inline-flex h-7 items-center border border-border/70 px-2 text-xs text-muted-foreground">
            {copy.status[item.status]}
          </span>
          <span className="text-xs text-muted-foreground">{formatDate(item.updatedAt, locale)}</span>
        </div>

        <h3 className="mt-4 text-xl font-semibold leading-tight text-foreground">
          <a href={detailHref} className="transition-colors hover:text-muted-foreground">
            {item.title}
          </a>
        </h3>
        <div className="mt-3 max-h-28 max-w-3xl overflow-hidden">
          <MarkdownContent value={item.description} compact />
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-muted-foreground">
          <a
            href={item.author.htmlUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 transition-colors hover:text-foreground"
          >
            {item.author.avatarUrl ? (
              <img
                src={item.author.avatarUrl}
                alt=""
                className="h-6 w-6 border border-border/70 bg-secondary object-cover"
              />
            ) : (
              <span className="flex h-6 w-6 items-center justify-center border border-border/70 bg-secondary text-[10px] text-foreground">
                {item.author.login.slice(0, 2).toUpperCase()}
              </span>
            )}
            @{item.author.login}
          </a>

          <span>
            {item.upvotes} / {item.downvotes}
          </span>

          {item.messageCount > 0 && (
            <a href={detailHref} className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground">
              <MessageSquare className="h-4 w-4" aria-hidden="true" />
              {item.messageCount}
            </a>
          )}

          {item.attachmentCount > 0 && (
            <a href={detailHref} className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground">
              <Paperclip className="h-4 w-4" aria-hidden="true" />
              {item.attachmentCount}
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
