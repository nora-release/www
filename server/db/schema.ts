import {
  bigint,
  index,
  integer,
  pgTable,
  text,
  timestamp,
} from 'drizzle-orm/pg-core'

export const feedbackUsers = pgTable('feedback_users', {
  githubId: bigint('github_id', { mode: 'number' }).primaryKey(),
  githubLogin: text('github_login').notNull().unique(),
  name: text('name').notNull(),
  avatarUrl: text('avatar_url').notNull(),
  htmlUrl: text('html_url').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull(),
})

export const adminUsers = pgTable('admin_users', {
  githubLogin: text('github_login').primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
  createdByLogin: text('created_by_login'),
})

export const feedbackItems = pgTable(
  'feedback_items',
  {
    id: text('id').primaryKey(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    status: text('status').notNull(),
    authorGithubId: bigint('author_github_id', { mode: 'number' })
      .notNull()
      .references(() => feedbackUsers.githubId),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull(),
  },
  (table) => [
    index('feedback_items_updated_at_idx').on(table.updatedAt),
  ],
)

export const feedbackMessages = pgTable(
  'feedback_messages',
  {
    id: text('id').primaryKey(),
    feedbackId: text('feedback_id')
      .notNull()
      .references(() => feedbackItems.id, { onDelete: 'cascade' }),
    authorGithubId: bigint('author_github_id', { mode: 'number' })
      .notNull()
      .references(() => feedbackUsers.githubId),
    body: text('body').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
  },
  (table) => [
    index('feedback_messages_feedback_id_idx').on(table.feedbackId),
  ],
)

export const githubIssues = pgTable('github_issues', {
  feedbackId: text('feedback_id')
    .primaryKey()
    .references(() => feedbackItems.id, { onDelete: 'cascade' }),
  repo: text('repo').notNull(),
  issueNumber: integer('issue_number').notNull(),
  url: text('url').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
})
