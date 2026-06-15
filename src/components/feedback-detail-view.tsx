"use client";

import {
  ArrowLeft,
  Bug,
  Download,
  ExternalLink,
  Lightbulb,
  Loader2,
  MessageSquare,
  Paperclip,
  ShieldCheck,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { authClient } from "../lib/auth-client";
import type { Locale } from "../lib/i18n";
import { localizedPath } from "../lib/i18n";
import type { FeedbackPageCopy } from "../lib/translations";
import { MarkdownContent } from "./markdown-content";

type FeedbackCategory = "feature" | "bug";
type FeedbackStatus = "open" | "promoted";

type FeedbackAuthor = {
  avatarUrl: string;
  githubId: string;
  htmlUrl: string;
  login: string;
  name: string;
};

type FeedbackIssue = {
  issueNumber: number;
  repo: string;
  url: string;
};

type FeedbackItem = {
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

type FeedbackMessage = {
  author: FeedbackAuthor;
  body: string;
  createdAt: string;
  id: string;
};

type FeedbackAttachment = {
  contentType: string;
  createdAt: string;
  fileName: string;
  id: string;
  sizeBytes: number;
  url: string;
};

type FeedbackDetail = {
  attachments: FeedbackAttachment[];
  issue: FeedbackIssue | null;
  item: FeedbackItem;
  messages: FeedbackMessage[];
  permissions: {
    canPromote: boolean;
  };
};

type SessionUser = {
  email?: string | null;
  image?: string | null;
  name?: string | null;
};

type FeedbackDetailViewProps = {
  copy: FeedbackPageCopy;
  feedbackId: string;
  locale: Locale;
};

function getDisplayLocale(locale: Locale) {
  return locale === "zh-Hans" ? "zh-CN" : locale;
}

function formatDate(value: string, locale: Locale) {
  return new Intl.DateTimeFormat(getDisplayLocale(locale), {
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
    year: "numeric",
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

export function FeedbackDetailView({ copy, feedbackId, locale }: FeedbackDetailViewProps) {
  const [commentBody, setCommentBody] = useState("");
  const [detail, setDetail] = useState<FeedbackDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isCommentSubmitting, setIsCommentSubmitting] = useState(false);
  const [isDetailLoading, setIsDetailLoading] = useState(true);
  const [isPromoting, setIsPromoting] = useState(false);
  const [pendingVoteId, setPendingVoteId] = useState<string | null>(null);
  const [sessionUser, setSessionUser] = useState<SessionUser | null>(null);

  const loadDetail = async () => {
    setIsDetailLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/feedback/${feedbackId}`, {
        headers: {
          Accept: "application/json",
        },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to load feedback.");
      }

      setDetail(data.detail ?? null);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load feedback.");
    } finally {
      setIsDetailLoading(false);
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
      void loadDetail();
    };

    window.addEventListener("nora-auth-change", handleAuthChange);

    void loadSession();
    void loadDetail();

    return () => {
      isDisposed = true;
      window.removeEventListener("nora-auth-change", handleAuthChange);
    };
  }, [feedbackId]);

  const submitComment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!sessionUser) {
      setError(copy.auth.signInRequired);
      return;
    }

    const body = commentBody.trim();

    if (!body) {
      return;
    }

    setIsCommentSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/feedback/${feedbackId}/comments`, {
        body: JSON.stringify({ body }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to post comment.");
      }

      setDetail(data.detail ?? null);
      setCommentBody("");
    } catch (commentError) {
      setError(commentError instanceof Error ? commentError.message : "Failed to post comment.");
    } finally {
      setIsCommentSubmitting(false);
    }
  };

  const vote = async (nextValue: -1 | 1) => {
    if (!detail) return;

    if (!sessionUser) {
      setError(copy.auth.signInRequired);
      return;
    }

    setPendingVoteId(detail.item.id);
    setError(null);

    const value = detail.item.userVote === nextValue ? 0 : nextValue;

    try {
      const response = await fetch(`/api/feedback/${detail.item.id}/vote`, {
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

      setDetail((currentDetail) => currentDetail ? { ...currentDetail, item: data.item } : currentDetail);
    } catch (voteError) {
      setError(voteError instanceof Error ? voteError.message : "Failed to vote.");
    } finally {
      setPendingVoteId(null);
    }
  };

  const promote = async () => {
    if (!detail?.permissions.canPromote || detail.issue) {
      return;
    }

    setIsPromoting(true);
    setError(null);

    try {
      const response = await fetch(`/api/feedback/${feedbackId}/promote`, {
        method: "POST",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to promote feedback.");
      }

      setDetail(data.detail ?? null);
    } catch (promoteError) {
      setError(promoteError instanceof Error ? promoteError.message : "Failed to promote feedback.");
    } finally {
      setIsPromoting(false);
    }
  };

  const isSignedIn = Boolean(sessionUser);
  const item = detail?.item;
  const Icon = item?.category === "bug" ? Bug : Lightbulb;
  const isVotePending = item ? pendingVoteId === item.id : false;

  return (
    <div className="mx-auto w-full max-w-6xl px-6 pb-24 pt-32 md:px-12">
      <a
        href={localizedPath(locale, "/feedback")}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        {copy.detail.back}
      </a>

      {isDetailLoading ? (
        <div className="mt-12 flex min-h-64 items-center justify-center gap-3 border border-border/70 bg-card/20 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          {copy.loading}
        </div>
      ) : !detail || !item ? (
        <div className="mt-12 border border-border/70 bg-card/20 p-8">
          <h1 className="text-2xl font-semibold text-foreground">{copy.empty.title}</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{error ?? copy.empty.description}</p>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <main className="space-y-6">
            <article className="border border-border/70 bg-card/25 p-5 md:p-7">
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

              <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight text-foreground md:text-6xl">
                {item.title}
              </h1>

              <div className="mt-6">
                <MarkdownContent value={item.description} />
              </div>

              {detail.attachments.length > 0 && (
                <div className="mt-7 border border-border/70 bg-background/50 p-4">
                  <h2 className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
                    <Paperclip className="h-4 w-4" aria-hidden="true" />
                    {copy.detail.attachments}
                  </h2>
                  <div className="mt-4 grid gap-2">
                    {detail.attachments.map((attachment) => (
                      <a
                        key={attachment.id}
                        href={attachment.url}
                        className="flex items-center justify-between gap-3 border border-border/70 bg-card/30 px-3 py-2 text-sm transition-colors hover:border-foreground/40 hover:text-foreground"
                      >
                        <span className="min-w-0">
                          <span className="block truncate text-foreground">{attachment.fileName}</span>
                          <span className="block text-xs text-muted-foreground">
                            {attachment.contentType} · {formatFileSize(attachment.sizeBytes)}
                          </span>
                        </span>
                        <Download className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-7 flex flex-wrap items-center gap-3">
                {detail.issue ? (
                  <a
                    href={detail.issue.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-11 items-center gap-2 bg-foreground px-4 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
                  >
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                    {copy.detail.issueLink} #{detail.issue.issueNumber}
                  </a>
                ) : detail.permissions.canPromote ? (
                  <button
                    type="button"
                    onClick={promote}
                    disabled={isPromoting}
                    className="inline-flex h-11 items-center gap-2 bg-foreground px-4 text-sm font-medium text-background transition-colors hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isPromoting ? (
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    ) : (
                      <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                    )}
                    {isPromoting ? copy.detail.promoting : copy.detail.promote}
                  </button>
                ) : null}

                {detail.issue && (
                  <span className="inline-flex h-11 items-center gap-2 border border-border/70 px-4 text-sm text-muted-foreground">
                    <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                    {copy.detail.promoteComplete}
                  </span>
                )}
              </div>
            </article>

            <section className="border border-border/70 bg-card/25">
              <div className="flex items-center justify-between border-b border-border/70 p-5">
                <h2 className="inline-flex items-center gap-2 text-xl font-semibold text-foreground">
                  <MessageSquare className="h-5 w-5" aria-hidden="true" />
                  {copy.detail.comments}
                </h2>
                <span className="text-sm text-muted-foreground">{detail.messages.length}</span>
              </div>

              {detail.messages.length === 0 ? (
                <p className="p-5 text-sm text-muted-foreground">{copy.detail.emptyComments}</p>
              ) : (
                <div className="divide-y divide-border/70">
                  {detail.messages.map((message) => (
                    <article key={message.id} className="p-5">
                      <div className="flex items-center gap-3">
                        {message.author.avatarUrl ? (
                          <img
                            src={message.author.avatarUrl}
                            alt=""
                            className="h-8 w-8 border border-border/70 bg-secondary object-cover"
                          />
                        ) : (
                          <span className="flex h-8 w-8 items-center justify-center border border-border/70 bg-secondary text-[10px] text-foreground">
                            {message.author.login.slice(0, 2).toUpperCase()}
                          </span>
                        )}
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-foreground">
                            {getAuthorName(message.author)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            @{message.author.login} · {formatDate(message.createdAt, locale)}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <MarkdownContent value={message.body} compact />
                      </div>
                    </article>
                  ))}
                </div>
              )}

              <form onSubmit={submitComment} className="border-t border-border/70 p-5">
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-foreground">{copy.detail.commentLabel}</span>
                  <textarea
                    value={commentBody}
                    onChange={(event) => setCommentBody(event.target.value)}
                    placeholder={copy.detail.commentPlaceholder}
                    disabled={!isSignedIn || isCommentSubmitting}
                    className="min-h-32 resize-y border border-border/70 bg-background/70 px-4 py-3 text-sm leading-7 text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-foreground/50 disabled:cursor-not-allowed disabled:opacity-60"
                    maxLength={2000}
                  />
                </label>

                {!isSignedIn && (
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{copy.auth.signInRequired}</p>
                )}

                {error && (
                  <div className="mt-4 border border-border/70 bg-destructive/10 px-4 py-3 text-sm text-destructive-foreground">
                    {error}
                  </div>
                )}

                <div className="mt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={!isSignedIn || isAuthLoading || isCommentSubmitting || !commentBody.trim()}
                    className="inline-flex h-11 items-center gap-2 bg-foreground px-5 text-sm font-medium text-background transition-colors hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isCommentSubmitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                    {isCommentSubmitting ? copy.detail.commentSubmitting : copy.detail.commentSubmit}
                  </button>
                </div>
              </form>
            </section>
          </main>

          <aside className="space-y-6">
            <div className="border border-border/70 bg-card/30 p-5">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label={copy.voteUpAria}
                  onClick={() => vote(1)}
                  disabled={isVotePending}
                  className={`flex h-9 w-9 items-center justify-center border transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
                    item.userVote === 1
                      ? "border-foreground bg-foreground text-background"
                      : "border-border/70 text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                  }`}
                >
                  <ThumbsUp className="h-4 w-4" aria-hidden="true" />
                </button>
                <span className="min-w-10 text-center text-lg font-semibold text-foreground">{item.score}</span>
                <button
                  type="button"
                  aria-label={copy.voteDownAria}
                  onClick={() => vote(-1)}
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

              <dl className="mt-5 grid gap-3 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">{copy.stats.votes}</dt>
                  <dd className="text-foreground">
                    {item.upvotes} / {item.downvotes}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">{copy.detail.comments}</dt>
                  <dd className="text-foreground">{detail.messages.length}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">{copy.detail.attachments}</dt>
                  <dd className="text-foreground">{detail.attachments.length}</dd>
                </div>
              </dl>
            </div>

            <div className="border border-border/70 bg-card/30 p-5">
              <h2 className="text-sm font-medium uppercase tracking-[0.22em] text-muted-foreground">
                {copy.contributors.title}
              </h2>
              <a
                href={item.author.htmlUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 flex items-center gap-3 text-sm transition-colors hover:text-foreground"
              >
                {item.author.avatarUrl ? (
                  <img
                    src={item.author.avatarUrl}
                    alt=""
                    className="h-10 w-10 border border-border/70 bg-secondary object-cover"
                  />
                ) : (
                  <span className="flex h-10 w-10 items-center justify-center border border-border/70 bg-secondary text-xs text-foreground">
                    {item.author.login.slice(0, 2).toUpperCase()}
                  </span>
                )}
                <span className="min-w-0">
                  <span className="block truncate text-foreground">{getAuthorName(item.author)}</span>
                  <span className="block truncate text-muted-foreground">@{item.author.login}</span>
                </span>
              </a>
            </div>

            <div className="border border-border/70 bg-card/30 p-5">
              <h2 className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.22em] text-muted-foreground">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                GitHub
              </h2>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">{copy.detail.promoteHint}</p>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
