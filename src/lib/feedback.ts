import { and, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import {
  adminUsers,
  authAccounts,
  authUsers,
  feedbackAttachments,
  feedbackItems,
  feedbackMessages,
  feedbackUsers,
  feedbackVotes,
  githubIssues,
} from "../db/schema";
import * as schema from "../db/schema";

type RuntimeEnv = Record<string, string | undefined>;
type RuntimeLocals = {
  runtime?: {
    env?: RuntimeEnv;
  };
};

type AuthUser = {
  email?: string | null;
  id: string;
  image?: string | null;
  name?: string | null;
};

type GitHubAccountRow = {
  accountId: string;
  accessToken: string | null;
  email: string | null;
  image: string | null;
  name: string | null;
};

type GitHubProfile = {
  avatar_url?: string | null;
  html_url?: string | null;
  login?: string | null;
  name?: string | null;
};

type GitHubIssueResponse = {
  html_url?: string;
  number?: number;
};

type FeedbackDatabase = NodePgDatabase<typeof schema>;

export type FeedbackCategory = "feature" | "bug";
export type FeedbackStatus = "open" | "promoted";

export type FeedbackAuthor = {
  avatarUrl: string;
  githubId: string;
  htmlUrl: string;
  login: string;
  name: string;
};

export type FeedbackItem = {
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

export type FeedbackContributor = FeedbackAuthor & {
  feedbackCount: number;
  voteCount: number;
};

export type FeedbackAdmin = {
  createdAt: string;
  createdByLogin: string | null;
  githubLogin: string;
};

export type FeedbackIssue = {
  issueNumber: number;
  repo: string;
  url: string;
};

export type FeedbackMessage = {
  author: FeedbackAuthor;
  body: string;
  createdAt: string;
  id: string;
};

export type FeedbackAttachment = {
  contentType: string;
  createdAt: string;
  fileName: string;
  id: string;
  sizeBytes: number;
  url: string;
};

export type FeedbackDetail = {
  attachments: FeedbackAttachment[];
  issue: FeedbackIssue | null;
  item: FeedbackItem;
  messages: FeedbackMessage[];
  permissions: {
    canManageAdmins: boolean;
    canPromote: boolean;
  };
};

export type FeedbackUpload = {
  contentType: string;
  dataBase64: string;
  fileName: string;
  sizeBytes: number;
};

export type FeedbackAttachmentDownload = {
  contentBase64: string;
  contentType: string;
  fileName: string;
  sizeBytes: number;
};

const poolCache = new Map<string, Pool>();
const dbCache = new WeakMap<Pool, FeedbackDatabase>();
const maxFeedbackAttachments = 5;
const maxFeedbackAttachmentSizeBytes = 5 * 1024 * 1024;
const maxFeedbackAttachmentTotalBytes = 15 * 1024 * 1024;

function normalizeEnvValue(value: string | undefined): string {
  const trimmed = (value ?? "").trim();

  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1).trim();
  }

  return trimmed;
}

function getRuntimeEnv(locals?: unknown): RuntimeEnv {
  const runtimeEnv = (locals as RuntimeLocals | undefined)?.runtime?.env ?? {};
  const buildEnv = import.meta.env as RuntimeEnv;

  return {
    ...buildEnv,
    ...runtimeEnv,
  };
}

function getDatabaseUrl(locals?: unknown): string {
  const env = getRuntimeEnv(locals);
  const databaseUrl = normalizeEnvValue(env.DATABASE_URL) || normalizeEnvValue(env.POSTGRES_URL);

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required for feedback.");
  }

  return databaseUrl;
}

function getFeedbackPool(locals?: unknown): Pool {
  const databaseUrl = getDatabaseUrl(locals);
  const cached = poolCache.get(databaseUrl);

  if (cached) {
    return cached;
  }

  const pool = new Pool({
    connectionString: databaseUrl,
    max: 5,
  });

  poolCache.set(databaseUrl, pool);

  return pool;
}

function getFeedbackDb(locals?: unknown): FeedbackDatabase {
  const pool = getFeedbackPool(locals);
  const cached = dbCache.get(pool);

  if (cached) {
    return cached;
  }

  const db = drizzle(pool, { schema });

  dbCache.set(pool, db);

  return db;
}

function createFeedbackId(): string {
  return `fb_${crypto.randomUUID().replace(/-/gu, "").slice(0, 20)}`;
}

function createFeedbackMessageId(): string {
  return `msg_${crypto.randomUUID().replace(/-/gu, "").slice(0, 20)}`;
}

function createFeedbackAttachmentId(): string {
  return `att_${crypto.randomUUID().replace(/-/gu, "").slice(0, 20)}`;
}

function normalizeLogin(value: string | null | undefined, fallback: string): string {
  const normalized = (value ?? "")
    .trim()
    .replace(/^@/u, "")
    .replace(/\s+/gu, "-")
    .replace(/[^\w-]/gu, "")
    .toLowerCase();

  return normalized || fallback;
}

function normalizeTitle(value: unknown): string {
  return typeof value === "string" ? value.trim().replace(/\s+/gu, " ") : "";
}

function normalizeDescription(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeCommentBody(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeCategory(value: unknown): FeedbackCategory {
  return value === "bug" ? "bug" : "feature";
}

function normalizeStatus(value: string): FeedbackStatus {
  return value === "promoted" ? "promoted" : "open";
}

function toIsoString(value: Date | string): string {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function getFirstEnvValue(env: RuntimeEnv, names: string[]): string {
  for (const name of names) {
    const value = normalizeEnvValue(env[name]);

    if (value) {
      return value;
    }
  }

  return "";
}

function getEnvList(env: RuntimeEnv, names: string[]): string[] {
  return getFirstEnvValue(env, names)
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

function getIssueRepo(locals?: unknown): string {
  const env = getRuntimeEnv(locals);

  return getFirstEnvValue(env, ["FEEDBACK_GITHUB_REPO", "NORA_FEEDBACK_GITHUB_REPO", "GITHUB_ISSUE_REPO"]) || "nora-release/nora";
}

function getIssueToken(locals: unknown, fallbackToken: string | null | undefined): string {
  const env = getRuntimeEnv(locals);

  return getFirstEnvValue(env, ["FEEDBACK_GITHUB_TOKEN", "NORA_FEEDBACK_GITHUB_TOKEN", "GITHUB_ISSUE_TOKEN", "GITHUB_TOKEN"]) || fallbackToken || "";
}

function getBootstrapAdminLogins(locals?: unknown): string[] {
  const env = getRuntimeEnv(locals);

  return getEnvList(env, [
    "FEEDBACK_BOOTSTRAP_ADMIN_GITHUB_LOGINS",
    "NORA_FEEDBACK_BOOTSTRAP_ADMINS",
    "NORA_FEEDBACK_ADMINS",
    "NORA_ADMIN_GITHUB_LOGINS",
  ])
    .map((login) => normalizeLogin(login, ""))
    .filter(Boolean);
}

function getBootstrapAdminIds(locals?: unknown): string[] {
  const env = getRuntimeEnv(locals);

  return getEnvList(env, ["FEEDBACK_BOOTSTRAP_ADMIN_GITHUB_IDS", "NORA_ADMIN_GITHUB_IDS"]);
}

async function getGitHubAccount(db: FeedbackDatabase, authUser: AuthUser): Promise<GitHubAccountRow | null> {
  const rows = await db
    .select({
      accountId: authAccounts.accountId,
      accessToken: authAccounts.accessToken,
      email: authUsers.email,
      image: authUsers.image,
      name: authUsers.name,
    })
    .from(authAccounts)
    .innerJoin(authUsers, eq(authUsers.id, authAccounts.userId))
    .where(and(eq(authAccounts.userId, authUser.id), eq(authAccounts.providerId, "github")))
    .limit(1);

  return rows[0] ?? null;
}

async function getGitHubProfile(accessToken: string | null): Promise<GitHubProfile | null> {
  if (!accessToken) {
    return null;
  }

  const response = await fetch("https://api.github.com/user", {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${accessToken}`,
      "User-Agent": "Nora Feedback",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  }).catch(() => null);

  if (!response?.ok) {
    return null;
  }

  return response.json() as Promise<GitHubProfile>;
}

async function getCurrentGithubId(db: FeedbackDatabase, authUser: AuthUser | null | undefined) {
  if (!authUser) {
    return null;
  }

  const account = await getGitHubAccount(db, authUser);

  return account?.accountId ?? null;
}

async function ensureBootstrapAdmins(
  db: FeedbackDatabase,
  locals: unknown,
  currentAdmin?: {
    githubId: string;
    login: string;
  },
) {
  const now = new Date();
  const bootstrapLogins = new Set(getBootstrapAdminLogins(locals));
  const bootstrapIds = getBootstrapAdminIds(locals);

  if (currentAdmin && bootstrapIds.includes(currentAdmin.githubId)) {
    bootstrapLogins.add(currentAdmin.login);
  }

  if (bootstrapLogins.size === 0) {
    return;
  }

  await db
    .insert(adminUsers)
    .values(
      Array.from(bootstrapLogins).map((githubLogin) => ({
        createdAt: now,
        createdByLogin: "bootstrap",
        githubLogin,
      })),
    )
    .onConflictDoNothing();
}

function mapFeedbackAdmin(admin: typeof adminUsers.$inferSelect): FeedbackAdmin {
  return {
    createdAt: toIsoString(admin.createdAt),
    createdByLogin: admin.createdByLogin,
    githubLogin: admin.githubLogin,
  };
}

async function getFeedbackAdminState(
  db: FeedbackDatabase,
  locals: unknown,
  authUser: AuthUser | null | undefined,
): Promise<{
  accessToken: string | null;
  canPromote: boolean;
  githubId: string | null;
  login: string | null;
}> {
  await ensureBootstrapAdmins(db, locals);

  if (!authUser) {
    return {
      accessToken: null,
      canPromote: false,
      githubId: null,
      login: null,
    };
  }

  const account = await getGitHubAccount(db, authUser);

  if (!account?.accountId) {
    return {
      accessToken: null,
      canPromote: false,
      githubId: null,
      login: null,
    };
  }

  const profile = await getGitHubProfile(account.accessToken);
  const login = normalizeLogin(profile?.login ?? account.name ?? authUser.name ?? authUser.email, "");

  await ensureBootstrapAdmins(db, locals, {
    githubId: account.accountId,
    login,
  });

  const admin = login
    ? await db.query.adminUsers.findFirst({
        where: eq(adminUsers.githubLogin, login),
      })
    : null;

  return {
    accessToken: account.accessToken,
    canPromote: Boolean(admin),
    githubId: account.accountId,
    login,
  };
}

async function resolveFeedbackAuthor(
  db: FeedbackDatabase,
  authUser: AuthUser | null | undefined,
): Promise<FeedbackAuthor> {
  if (!authUser) {
    throw new Response("Authentication required.", { status: 401 });
  }

  const account = await getGitHubAccount(db, authUser);

  if (!account?.accountId) {
    throw new Response("GitHub account is required.", { status: 401 });
  }

  const githubId = account.accountId;
  const profile = await getGitHubProfile(account.accessToken);
  const fallbackLogin = `github-${githubId}`;
  const login = normalizeLogin(profile?.login ?? account.name ?? authUser.name ?? authUser.email, fallbackLogin);
  const name = profile?.name?.trim() || account.name?.trim() || authUser.name?.trim() || login;
  const avatarUrl = profile?.avatar_url || account.image || authUser.image || "";
  const htmlUrl = profile?.html_url || `https://github.com/${login}`;
  const now = new Date();

  await db
    .insert(feedbackUsers)
    .values({
      avatarUrl,
      createdAt: now,
      githubId,
      githubLogin: login,
      htmlUrl,
      name,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      set: {
        avatarUrl,
        githubLogin: login,
        htmlUrl,
        name,
        updatedAt: now,
      },
      target: feedbackUsers.githubId,
    });

  return {
    avatarUrl,
    githubId,
    htmlUrl,
    login,
    name,
  };
}

function mapFeedbackItem(
  item: Awaited<ReturnType<FeedbackDatabase["query"]["feedbackItems"]["findMany"]>>[number],
  currentGithubId: string | null,
): FeedbackItem {
  const upvotes = item.votes.filter((vote) => vote.value === 1).length;
  const downvotes = item.votes.filter((vote) => vote.value === -1).length;
  const userVote = currentGithubId
    ? (item.votes.find((vote) => String(vote.githubId) === currentGithubId)?.value ?? 0)
    : 0;

  return {
    author: {
      avatarUrl: item.author.avatarUrl,
      githubId: String(item.author.githubId),
      htmlUrl: item.author.htmlUrl,
      login: item.author.githubLogin,
      name: item.author.name,
    },
    category: normalizeCategory(item.category),
    createdAt: toIsoString(item.createdAt),
    description: item.description,
    downvotes,
    id: item.id,
    messageCount: item.messages.length,
    score: upvotes - downvotes,
    status: normalizeStatus(item.status),
    title: item.title,
    updatedAt: toIsoString(item.updatedAt),
    upvotes,
    userVote: (userVote === 1 || userVote === -1 ? userVote : 0) as -1 | 0 | 1,
  };
}

function mapFeedbackMessage(message: {
  author: {
    avatarUrl: string;
    githubId: string;
    githubLogin: string;
    htmlUrl: string;
    name: string;
  };
  body: string;
  createdAt: Date | string;
  id: string;
}): FeedbackMessage {
  return {
    author: {
      avatarUrl: message.author.avatarUrl,
      githubId: String(message.author.githubId),
      htmlUrl: message.author.htmlUrl,
      login: message.author.githubLogin,
      name: message.author.name,
    },
    body: message.body,
    createdAt: toIsoString(message.createdAt),
    id: message.id,
  };
}

function mapFeedbackIssue(issue: typeof githubIssues.$inferSelect | undefined): FeedbackIssue | null {
  if (!issue) {
    return null;
  }

  return {
    issueNumber: issue.issueNumber,
    repo: issue.repo,
    url: issue.url,
  };
}

function mapFeedbackAttachment(attachment: typeof feedbackAttachments.$inferSelect): FeedbackAttachment {
  return {
    contentType: attachment.contentType,
    createdAt: toIsoString(attachment.createdAt),
    fileName: attachment.fileName,
    id: attachment.id,
    sizeBytes: attachment.sizeBytes,
    url: `/api/feedback/${attachment.feedbackId}/attachments/${attachment.id}`,
  };
}

function normalizeFeedbackUploads(value: unknown): FeedbackUpload[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const uploads = value.filter((upload): upload is FeedbackUpload => {
    if (!upload || typeof upload !== "object") {
      return false;
    }

    const candidate = upload as Partial<FeedbackUpload>;

    return (
      typeof candidate.contentType === "string" &&
      typeof candidate.dataBase64 === "string" &&
      typeof candidate.fileName === "string" &&
      typeof candidate.sizeBytes === "number"
    );
  });

  if (uploads.length > maxFeedbackAttachments) {
    throw new Response(`You can upload up to ${maxFeedbackAttachments} files.`, { status: 400 });
  }

  const totalBytes = uploads.reduce((total, upload) => total + upload.sizeBytes, 0);

  if (totalBytes > maxFeedbackAttachmentTotalBytes) {
    throw new Response("Uploaded files are too large.", { status: 400 });
  }

  for (const upload of uploads) {
    const fileName = upload.fileName.trim();
    const contentType = upload.contentType.trim() || "application/octet-stream";

    if (!fileName || fileName.length > 180) {
      throw new Response("Attachment file name is invalid.", { status: 400 });
    }

    if (upload.sizeBytes <= 0 || upload.sizeBytes > maxFeedbackAttachmentSizeBytes) {
      throw new Response("Each attachment must be 1 byte to 5 MB.", { status: 400 });
    }

    if (!/^[A-Za-z0-9+/=]+$/u.test(upload.dataBase64)) {
      throw new Response("Attachment content is invalid.", { status: 400 });
    }

    upload.fileName = fileName;
    upload.contentType = contentType;
  }

  return uploads;
}

async function getGithubIssueForFeedback(db: FeedbackDatabase, feedbackId: string): Promise<FeedbackIssue | null> {
  const issue = await db.query.githubIssues.findFirst({
    where: eq(githubIssues.feedbackId, feedbackId),
  });

  return mapFeedbackIssue(issue);
}

export async function listFeedbackItems(
  locals?: unknown,
  authUser?: AuthUser | null,
): Promise<FeedbackItem[]> {
  const db = getFeedbackDb(locals);
  const currentGithubId = await getCurrentGithubId(db, authUser);
  const items = await db.query.feedbackItems.findMany({
    orderBy: [desc(feedbackItems.updatedAt)],
    with: {
      author: true,
      messages: true,
      votes: true,
    },
  });

  return items.map((item) => mapFeedbackItem(item, currentGithubId));
}

export async function getFeedbackDetail(
  locals: unknown,
  authUser: AuthUser | null | undefined,
  feedbackId: string,
): Promise<FeedbackDetail> {
  const db = getFeedbackDb(locals);
  const [currentGithubId, adminState, item, issue] = await Promise.all([
    getCurrentGithubId(db, authUser),
    getFeedbackAdminState(db, locals, authUser),
    db.query.feedbackItems.findFirst({
      orderBy: [desc(feedbackItems.updatedAt)],
      where: eq(feedbackItems.id, feedbackId),
      with: {
        author: true,
        attachments: true,
        messages: {
          orderBy: [desc(feedbackMessages.createdAt)],
          with: {
            author: true,
          },
        },
        votes: true,
      },
    }),
    getGithubIssueForFeedback(db, feedbackId),
  ]);

  if (!item) {
    throw new Response("Feedback item not found.", { status: 404 });
  }

  return {
    attachments: item.attachments.map(mapFeedbackAttachment),
    issue,
    item: mapFeedbackItem(item, currentGithubId),
    messages: item.messages.map(mapFeedbackMessage),
    permissions: {
      canManageAdmins: adminState.canPromote,
      canPromote: adminState.canPromote,
    },
  };
}

export async function listFeedbackContributors(locals?: unknown): Promise<FeedbackContributor[]> {
  const db = getFeedbackDb(locals);
  const contributors = await db.query.feedbackUsers.findMany({
    with: {
      feedbackItems: true,
      votes: true,
    },
  });

  return contributors
    .map((contributor) => ({
      avatarUrl: contributor.avatarUrl,
      feedbackCount: contributor.feedbackItems.length,
      githubId: String(contributor.githubId),
      htmlUrl: contributor.htmlUrl,
      login: contributor.githubLogin,
      name: contributor.name,
      voteCount: contributor.votes.length,
    }))
    .sort(
      (a, b) =>
        b.feedbackCount - a.feedbackCount ||
        b.voteCount - a.voteCount ||
        a.login.localeCompare(b.login),
    )
    .slice(0, 8);
}

export async function listFeedbackAdmins(
  locals: unknown,
  authUser: AuthUser | null | undefined,
): Promise<FeedbackAdmin[]> {
  const db = getFeedbackDb(locals);
  const adminState = await getFeedbackAdminState(db, locals, authUser);

  if (!adminState.canPromote) {
    throw new Response("Only feedback admins can manage admins.", { status: 403 });
  }

  const admins = await db.query.adminUsers.findMany({
    orderBy: [desc(adminUsers.createdAt)],
  });

  return admins.map(mapFeedbackAdmin);
}

export async function addFeedbackAdmin(
  locals: unknown,
  authUser: AuthUser | null | undefined,
  payload: unknown,
): Promise<FeedbackAdmin[]> {
  const body = (payload ?? {}) as Record<string, unknown>;
  const githubLogin = normalizeLogin(typeof body.githubLogin === "string" ? body.githubLogin : "", "");

  if (!githubLogin || githubLogin.length > 39) {
    throw new Response("GitHub username is invalid.", { status: 400 });
  }

  const db = getFeedbackDb(locals);
  const adminState = await getFeedbackAdminState(db, locals, authUser);

  if (!adminState.canPromote || !adminState.login) {
    throw new Response("Only feedback admins can manage admins.", { status: 403 });
  }

  await db
    .insert(adminUsers)
    .values({
      createdAt: new Date(),
      createdByLogin: adminState.login,
      githubLogin,
    })
    .onConflictDoNothing();

  return listFeedbackAdmins(locals, authUser);
}

export async function createFeedbackItem(
  locals: unknown,
  authUser: AuthUser | null | undefined,
  payload: unknown,
): Promise<FeedbackItem> {
  const body = (payload ?? {}) as Record<string, unknown>;
  const title = normalizeTitle(body.title);
  const description = normalizeDescription(body.description);
  const category = normalizeCategory(body.category);
  const attachments = normalizeFeedbackUploads(body.attachments);

  if (title.length < 4 || title.length > 120) {
    throw new Response("Title must be 4-120 characters.", { status: 400 });
  }

  if (description.length < 8 || description.length > 2000) {
    throw new Response("Description must be 8-2000 characters.", { status: 400 });
  }

  const db = getFeedbackDb(locals);
  const author = await resolveFeedbackAuthor(db, authUser);
  const id = createFeedbackId();
  const now = new Date();

  await db.insert(feedbackItems).values({
    authorGithubId: author.githubId,
    category,
    createdAt: now,
    description,
    id,
    status: "open",
    title,
    updatedAt: now,
  });

  if (attachments.length > 0) {
    await db.insert(feedbackAttachments).values(
      attachments.map((attachment) => ({
        contentType: attachment.contentType,
        createdAt: now,
        dataBase64: attachment.dataBase64,
        feedbackId: id,
        fileName: attachment.fileName,
        id: createFeedbackAttachmentId(),
        sizeBytes: attachment.sizeBytes,
        uploaderGithubId: author.githubId,
      })),
    );
  }

  const items = await listFeedbackItems(locals, authUser);
  const item = items.find((entry) => entry.id === id);

  if (!item) {
    throw new Response("Feedback item was not created.", { status: 500 });
  }

  return item;
}

export async function createFeedbackMessage(
  locals: unknown,
  authUser: AuthUser | null | undefined,
  feedbackId: string,
  payload: unknown,
): Promise<FeedbackDetail> {
  const body = (payload ?? {}) as Record<string, unknown>;
  const commentBody = normalizeCommentBody(body.body);

  if (commentBody.length < 2 || commentBody.length > 2000) {
    throw new Response("Comment must be 2-2000 characters.", { status: 400 });
  }

  const db = getFeedbackDb(locals);
  const author = await resolveFeedbackAuthor(db, authUser);
  const item = await db.query.feedbackItems.findFirst({
    columns: {
      id: true,
    },
    where: eq(feedbackItems.id, feedbackId),
  });

  if (!item) {
    throw new Response("Feedback item not found.", { status: 404 });
  }

  const now = new Date();

  await db.insert(feedbackMessages).values({
    authorGithubId: author.githubId,
    body: commentBody,
    createdAt: now,
    feedbackId,
    id: createFeedbackMessageId(),
  });

  await db
    .update(feedbackItems)
    .set({
      updatedAt: now,
    })
    .where(eq(feedbackItems.id, feedbackId));

  return getFeedbackDetail(locals, authUser, feedbackId);
}

export async function getFeedbackAttachmentDownload(
  locals: unknown,
  feedbackId: string,
  attachmentId: string,
): Promise<FeedbackAttachmentDownload> {
  const db = getFeedbackDb(locals);
  const attachment = await db.query.feedbackAttachments.findFirst({
    where: and(eq(feedbackAttachments.id, attachmentId), eq(feedbackAttachments.feedbackId, feedbackId)),
  });

  if (!attachment) {
    throw new Response("Attachment not found.", { status: 404 });
  }

  return {
    contentBase64: attachment.dataBase64,
    contentType: attachment.contentType,
    fileName: attachment.fileName,
    sizeBytes: attachment.sizeBytes,
  };
}

export async function voteFeedbackItem(
  locals: unknown,
  authUser: AuthUser | null | undefined,
  feedbackId: string,
  value: unknown,
): Promise<FeedbackItem> {
  const voteValue = value === -1 || value === 1 ? value : 0;
  const db = getFeedbackDb(locals);
  const author = await resolveFeedbackAuthor(db, authUser);
  const item = await db.query.feedbackItems.findFirst({
    columns: {
      id: true,
    },
    where: eq(feedbackItems.id, feedbackId),
  });

  if (!item) {
    throw new Response("Feedback item not found.", { status: 404 });
  }

  if (voteValue === 0) {
    await db
      .delete(feedbackVotes)
      .where(and(eq(feedbackVotes.feedbackId, feedbackId), eq(feedbackVotes.githubId, author.githubId)));
  } else {
    await db
      .insert(feedbackVotes)
      .values({
        createdAt: new Date(),
        feedbackId,
        githubId: author.githubId,
        value: voteValue,
      })
      .onConflictDoUpdate({
        set: {
          createdAt: new Date(),
          value: voteValue,
        },
        target: [feedbackVotes.feedbackId, feedbackVotes.githubId],
      });
  }

  await db
    .update(feedbackItems)
    .set({
      updatedAt: new Date(),
    })
    .where(eq(feedbackItems.id, feedbackId));

  const items = await listFeedbackItems(locals, authUser);
  const updatedItem = items.find((entry) => entry.id === feedbackId);

  if (!updatedItem) {
    throw new Response("Feedback item not found.", { status: 404 });
  }

  return updatedItem;
}

function buildIssueBody(
  item: FeedbackItem,
  messages: FeedbackMessage[],
  issue: FeedbackIssue | null,
  attachments: FeedbackAttachment[],
): string {
  const comments = messages
    .slice()
    .reverse()
    .map((message) => `### @${message.author.login}\n\n${message.body}`)
    .join("\n\n---\n\n");

  return [
    `Original feedback: ${item.id}`,
    "",
    `Category: ${item.category}`,
    `Score: ${item.score} (${item.upvotes} up / ${item.downvotes} down)`,
    issue ? `Existing issue: ${issue.url}` : "",
    "",
    "## Request",
    "",
    item.description,
    attachments.length > 0 ? "\n## Attachments\n" : "",
    attachments.map((attachment) => `- [${attachment.fileName}](${attachment.url})`).join("\n"),
    comments ? "\n## Comments\n" : "",
    comments,
  ]
    .filter(Boolean)
    .join("\n");
}

async function createGitHubIssue(
  repo: string,
  token: string,
  item: FeedbackItem,
  messages: FeedbackMessage[],
  issue: FeedbackIssue | null,
  attachments: FeedbackAttachment[],
) {
  const response = await fetch(`https://api.github.com/repos/${repo}/issues`, {
    body: JSON.stringify({
      body: buildIssueBody(item, messages, issue, attachments),
      labels: ["feedback", item.category],
      title: `[Feedback] ${item.title}`,
    }),
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "Nora Feedback",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    method: "POST",
  });

  const data = await response.json().catch(() => ({})) as GitHubIssueResponse & { message?: string };

  if (!response.ok || !data.number || !data.html_url) {
    throw new Response(data.message || "GitHub issue could not be created.", { status: response.status || 502 });
  }

  return {
    issueNumber: data.number,
    url: data.html_url,
  };
}

export async function promoteFeedbackToGitHubIssue(
  locals: unknown,
  authUser: AuthUser | null | undefined,
  feedbackId: string,
): Promise<FeedbackDetail> {
  const db = getFeedbackDb(locals);
  const adminState = await getFeedbackAdminState(db, locals, authUser);

  if (!adminState.canPromote) {
    throw new Response("Only feedback admins can promote issues.", { status: 403 });
  }

  const detail = await getFeedbackDetail(locals, authUser, feedbackId);
  const existingIssue = detail.issue;

  if (existingIssue) {
    await db
      .update(feedbackItems)
      .set({
        status: "promoted",
        updatedAt: new Date(),
      })
      .where(eq(feedbackItems.id, feedbackId));

    return getFeedbackDetail(locals, authUser, feedbackId);
  }

  const repo = getIssueRepo(locals);
  const token = getIssueToken(locals, adminState.accessToken);

  if (!token) {
    throw new Response("GitHub issue token is required.", { status: 500 });
  }

  const issue = await createGitHubIssue(repo, token, detail.item, detail.messages, detail.issue, detail.attachments);
  const now = new Date();

  await db.insert(githubIssues).values({
    createdAt: now,
    feedbackId,
    issueNumber: issue.issueNumber,
    repo,
    url: issue.url,
  });

  await db
    .update(feedbackItems)
    .set({
      status: "promoted",
      updatedAt: now,
    })
    .where(eq(feedbackItems.id, feedbackId));

  return getFeedbackDetail(locals, authUser, feedbackId);
}
