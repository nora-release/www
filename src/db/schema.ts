import { relations } from "drizzle-orm";
import {
  bigint,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";

export const authUsers = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  emailVerified: boolean("emailVerified").notNull(),
  image: text("image"),
  createdAt: timestamp("createdAt", { mode: "date", withTimezone: true }).notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", withTimezone: true }).notNull(),
});

export const authAccounts = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => authUsers.id),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt", {
    mode: "date",
    withTimezone: true,
  }),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt", {
    mode: "date",
    withTimezone: true,
  }),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("createdAt", { mode: "date", withTimezone: true }).notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", withTimezone: true }).notNull(),
});

export const feedbackUsers = pgTable("feedback_users", {
  githubId: bigint("github_id", { mode: "string" }).primaryKey(),
  githubLogin: text("github_login").notNull().unique(),
  name: text("name").notNull(),
  avatarUrl: text("avatar_url").notNull(),
  htmlUrl: text("html_url").notNull(),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true }).notNull(),
  updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true }).notNull(),
});

export const adminUsers = pgTable("admin_users", {
  githubLogin: text("github_login").primaryKey(),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true }).notNull(),
  createdByLogin: text("created_by_login"),
});

export const feedbackItems = pgTable("feedback_items", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull(),
  category: text("category").notNull(),
  authorGithubId: bigint("author_github_id", { mode: "string" })
    .notNull()
    .references(() => feedbackUsers.githubId),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true }).notNull(),
  updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true }).notNull(),
});

export const feedbackMessages = pgTable("feedback_messages", {
  id: text("id").primaryKey(),
  feedbackId: text("feedback_id")
    .notNull()
    .references(() => feedbackItems.id, { onDelete: "cascade" }),
  authorGithubId: bigint("author_github_id", { mode: "string" })
    .notNull()
    .references(() => feedbackUsers.githubId),
  body: text("body").notNull(),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true }).notNull(),
});

export const feedbackAttachments = pgTable("feedback_attachments", {
  id: text("id").primaryKey(),
  feedbackId: text("feedback_id")
    .notNull()
    .references(() => feedbackItems.id, { onDelete: "cascade" }),
  uploaderGithubId: bigint("uploader_github_id", { mode: "string" })
    .notNull()
    .references(() => feedbackUsers.githubId),
  fileName: text("file_name").notNull(),
  contentType: text("content_type").notNull(),
  sizeBytes: integer("size_bytes").notNull(),
  dataBase64: text("data_base64"),
  storageProvider: text("storage_provider").notNull().default("database"),
  storageRepo: text("storage_repo"),
  storageBranch: text("storage_branch"),
  storagePath: text("storage_path"),
  storageUrl: text("storage_url"),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true }).notNull(),
});

export const feedbackVotes = pgTable(
  "feedback_votes",
  {
    feedbackId: text("feedback_id")
      .notNull()
      .references(() => feedbackItems.id, { onDelete: "cascade" }),
    githubId: bigint("github_id", { mode: "string" })
      .notNull()
      .references(() => feedbackUsers.githubId, { onDelete: "cascade" }),
    value: integer("value").notNull(),
    createdAt: timestamp("created_at", { mode: "date", withTimezone: true }).notNull(),
  },
  (table) => [primaryKey({ columns: [table.feedbackId, table.githubId] })],
);

export const githubIssues = pgTable("github_issues", {
  feedbackId: text("feedback_id")
    .primaryKey()
    .references(() => feedbackItems.id, { onDelete: "cascade" }),
  repo: text("repo").notNull(),
  issueNumber: integer("issue_number").notNull(),
  url: text("url").notNull(),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true }).notNull(),
});

export const authAccountRelations = relations(authAccounts, ({ one }) => ({
  user: one(authUsers, {
    fields: [authAccounts.userId],
    references: [authUsers.id],
  }),
}));

export const feedbackItemRelations = relations(feedbackItems, ({ one, many }) => ({
  attachments: many(feedbackAttachments),
  author: one(feedbackUsers, {
    fields: [feedbackItems.authorGithubId],
    references: [feedbackUsers.githubId],
  }),
  githubIssue: one(githubIssues, {
    fields: [feedbackItems.id],
    references: [githubIssues.feedbackId],
  }),
  messages: many(feedbackMessages),
  votes: many(feedbackVotes),
}));

export const feedbackUserRelations = relations(feedbackUsers, ({ many }) => ({
  attachments: many(feedbackAttachments),
  feedbackItems: many(feedbackItems),
  votes: many(feedbackVotes),
}));

export const feedbackAttachmentRelations = relations(feedbackAttachments, ({ one }) => ({
  feedbackItem: one(feedbackItems, {
    fields: [feedbackAttachments.feedbackId],
    references: [feedbackItems.id],
  }),
  uploader: one(feedbackUsers, {
    fields: [feedbackAttachments.uploaderGithubId],
    references: [feedbackUsers.githubId],
  }),
}));

export const feedbackMessageRelations = relations(feedbackMessages, ({ one }) => ({
  author: one(feedbackUsers, {
    fields: [feedbackMessages.authorGithubId],
    references: [feedbackUsers.githubId],
  }),
  feedbackItem: one(feedbackItems, {
    fields: [feedbackMessages.feedbackId],
    references: [feedbackItems.id],
  }),
}));

export const feedbackVoteRelations = relations(feedbackVotes, ({ one }) => ({
  feedbackItem: one(feedbackItems, {
    fields: [feedbackVotes.feedbackId],
    references: [feedbackItems.id],
  }),
  user: one(feedbackUsers, {
    fields: [feedbackVotes.githubId],
    references: [feedbackUsers.githubId],
  }),
}));

export const githubIssueRelations = relations(githubIssues, ({ one }) => ({
  feedbackItem: one(feedbackItems, {
    fields: [githubIssues.feedbackId],
    references: [feedbackItems.id],
  }),
}));
