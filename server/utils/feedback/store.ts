import { randomBytes } from 'node:crypto'
import { asc, desc, eq, inArray } from 'drizzle-orm'
import { db, schema } from '@nuxthub/db'
import { feedbackError } from './http'
import type {
  FeedbackAuthor,
  FeedbackItem,
  FeedbackMessage,
  GitHubIssueLink,
  PublicFeedbackUser,
} from './types'

type AdminUser = {
  login: string
  createdAt: string
  createdByLogin: string | null
}

let bootstrappedAdminLogins = ''

const splitLogins = (value: string) => {
  return value
    .split(/[,\s]+/)
    .map((login) => normalizeLogin(login))
    .filter(Boolean)
}

const normalizeLogin = (value: unknown) => {
  if (typeof value !== 'string') {
    return ''
  }

  return value.trim().replace(/^@/, '').toLowerCase()
}

const createId = () => {
  return randomBytes(12).toString('hex')
}

const now = () => {
  return new Date()
}

const toIso = (value: Date | string) => {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString()
}

const normalizeText = (value: unknown, maxLength: number) => {
  if (typeof value !== 'string') {
    return ''
  }

  return value.trim().replace(/\r\n/g, '\n').slice(0, maxLength)
}

const bootstrapConfiguredAdmins = async () => {
  const configured = process.env.NORA_FEEDBACK_ADMINS || ''

  if (configured === bootstrappedAdminLogins) {
    return
  }

  const timestamp = now()

  for (const login of splitLogins(configured)) {
    await db
      .insert(schema.adminUsers)
      .values({
        githubLogin: login,
        createdAt: timestamp,
        createdByLogin: null,
      })
      .onConflictDoNothing()
  }

  bootstrappedAdminLogins = configured
}

const upsertUser = async (user: FeedbackAuthor) => {
  const timestamp = now()

  await db
    .insert(schema.feedbackUsers)
    .values({
      githubId: user.id,
      githubLogin: user.login,
      name: user.name,
      avatarUrl: user.avatarUrl,
      htmlUrl: user.htmlUrl,
      createdAt: timestamp,
      updatedAt: timestamp,
    })
    .onConflictDoUpdate({
      target: schema.feedbackUsers.githubId,
      set: {
        githubLogin: user.login,
        name: user.name,
        avatarUrl: user.avatarUrl,
        htmlUrl: user.htmlUrl,
        updatedAt: timestamp,
      },
    })
}

const isAdminLogin = async (login: string) => {
  await bootstrapConfiguredAdmins()

  const rows = await db
    .select({ githubLogin: schema.adminUsers.githubLogin })
    .from(schema.adminUsers)
    .where(eq(schema.adminUsers.githubLogin, normalizeLogin(login)))
    .limit(1)

  return rows.length > 0
}

const itemRowsToFeedbackItems = (
  itemRows: Array<{
    item: typeof schema.feedbackItems.$inferSelect
    author: typeof schema.feedbackUsers.$inferSelect
    issue: typeof schema.githubIssues.$inferSelect | null
  }>,
  messageRows: Array<{
    message: typeof schema.feedbackMessages.$inferSelect
    author: typeof schema.feedbackUsers.$inferSelect
  }>,
) => {
  const messagesByFeedbackId = new Map<string, FeedbackMessage[]>()

  for (const row of messageRows) {
    const feedbackId = row.message.feedbackId
    const messages = messagesByFeedbackId.get(feedbackId) ?? []

    messages.push({
      id: row.message.id,
      body: row.message.body,
      createdAt: toIso(row.message.createdAt),
      author: {
        id: row.author.githubId,
        login: row.author.githubLogin,
        name: row.author.name,
        avatarUrl: row.author.avatarUrl,
        htmlUrl: row.author.htmlUrl,
      },
    })
    messagesByFeedbackId.set(feedbackId, messages)
  }

  return itemRows.map((row) => {
    return {
      id: row.item.id,
      title: row.item.title,
      description: row.item.description,
      status: row.item.status === 'promoted' ? 'promoted' : 'open',
      createdAt: toIso(row.item.createdAt),
      updatedAt: toIso(row.item.updatedAt),
      author: {
        id: row.author.githubId,
        login: row.author.githubLogin,
        name: row.author.name,
        avatarUrl: row.author.avatarUrl,
        htmlUrl: row.author.htmlUrl,
      },
      messages: messagesByFeedbackId.get(row.item.id) ?? [],
      issue: row.issue
        ? {
            repo: row.issue.repo,
            number: row.issue.issueNumber,
            url: row.issue.url,
            createdAt: toIso(row.issue.createdAt),
          }
        : null,
    } satisfies FeedbackItem
  })
}

const loadFeedbackItems = async (id?: string) => {
  const query = db
    .select({
      item: schema.feedbackItems,
      author: schema.feedbackUsers,
      issue: schema.githubIssues,
    })
    .from(schema.feedbackItems)
    .innerJoin(
      schema.feedbackUsers,
      eq(schema.feedbackItems.authorGithubId, schema.feedbackUsers.githubId),
    )
    .leftJoin(
      schema.githubIssues,
      eq(schema.feedbackItems.id, schema.githubIssues.feedbackId),
    )

  const itemRows = id
    ? await query
        .where(eq(schema.feedbackItems.id, id))
        .orderBy(desc(schema.feedbackItems.updatedAt))
    : await query.orderBy(desc(schema.feedbackItems.updatedAt))
  const feedbackIds = itemRows.map((row) => row.item.id)
  const messageRows = feedbackIds.length
    ? await db
        .select({
          message: schema.feedbackMessages,
          author: schema.feedbackUsers,
        })
        .from(schema.feedbackMessages)
        .innerJoin(
          schema.feedbackUsers,
          eq(
            schema.feedbackMessages.authorGithubId,
            schema.feedbackUsers.githubId,
          ),
        )
        .where(inArray(schema.feedbackMessages.feedbackId, feedbackIds))
        .orderBy(asc(schema.feedbackMessages.createdAt))
    : []

  return itemRowsToFeedbackItems(itemRows, messageRows)
}

export const resolveFeedbackUser = async (
  _event: unknown,
  author: FeedbackAuthor,
): Promise<PublicFeedbackUser> => {
  await upsertUser(author)

  return {
    ...author,
    isAdmin: await isAdminLogin(author.login),
  }
}

export const listKnownFeedbackUsers = async (_event: unknown) => {
  const rows = await db
    .select()
    .from(schema.feedbackUsers)
    .orderBy(desc(schema.feedbackUsers.updatedAt))

  return rows.map((row) => ({
    id: row.githubId,
    login: row.githubLogin,
    name: row.name,
    avatarUrl: row.avatarUrl,
    htmlUrl: row.htmlUrl,
  }))
}

export const listAdminUsers = async (_event: unknown): Promise<AdminUser[]> => {
  await bootstrapConfiguredAdmins()

  const rows = await db
    .select()
    .from(schema.adminUsers)
    .orderBy(asc(schema.adminUsers.createdAt))

  return rows.map((row) => ({
    login: row.githubLogin,
    createdAt: toIso(row.createdAt),
    createdByLogin: row.createdByLogin,
  }))
}

export const addAdminUser = async (
  event: unknown,
  currentUser: PublicFeedbackUser,
  input: unknown,
) => {
  if (!currentUser.isAdmin) {
    throw feedbackError(403, 'Only feedback admins can add admins.')
  }

  const login = normalizeLogin((input as { login?: unknown })?.login)

  if (!login) {
    throw feedbackError(400, 'GitHub username is required.')
  }

  await db
    .insert(schema.adminUsers)
    .values({
      githubLogin: login,
      createdAt: now(),
      createdByLogin: currentUser.login,
    })
    .onConflictDoUpdate({
      target: schema.adminUsers.githubLogin,
      set: {
        createdByLogin: currentUser.login,
      },
    })

  return listAdminUsers(event)
}

export const listFeedbackItems = async (_event: unknown) => {
  await bootstrapConfiguredAdmins()

  return loadFeedbackItems()
}

export const getFeedbackItem = async (_event: unknown, id: string) => {
  const item = (await loadFeedbackItems(id))[0]

  if (!item) {
    throw feedbackError(404, 'Feedback was not found.')
  }

  return item
}

export const createFeedbackItem = async (
  event: unknown,
  user: PublicFeedbackUser,
  input: unknown,
) => {
  const title = normalizeText((input as { title?: unknown })?.title, 140)
  const description = normalizeText(
    (input as { description?: unknown })?.description,
    4000,
  )

  if (!title || !description) {
    throw feedbackError(400, 'Title and description are required.')
  }

  const id = createId()
  const timestamp = now()

  await upsertUser(user)
  await db.insert(schema.feedbackItems).values({
    id,
    title,
    description,
    status: 'open',
    authorGithubId: user.id,
    createdAt: timestamp,
    updatedAt: timestamp,
  })

  return getFeedbackItem(event, id)
}

export const addFeedbackMessage = async (
  event: unknown,
  id: string,
  user: PublicFeedbackUser,
  input: unknown,
) => {
  const body = normalizeText((input as { body?: unknown })?.body, 4000)

  if (!body) {
    throw feedbackError(400, 'Message is required.')
  }

  await getFeedbackItem(event, id)
  await upsertUser(user)

  const timestamp = now()

  await db.insert(schema.feedbackMessages).values({
    id: createId(),
    feedbackId: id,
    authorGithubId: user.id,
    body,
    createdAt: timestamp,
  })
  await db
    .update(schema.feedbackItems)
    .set({ updatedAt: timestamp })
    .where(eq(schema.feedbackItems.id, id))

  return getFeedbackItem(event, id)
}

export const markFeedbackPromoted = async (
  event: unknown,
  id: string,
  issue: GitHubIssueLink,
) => {
  await getFeedbackItem(event, id)

  await db
    .insert(schema.githubIssues)
    .values({
      feedbackId: id,
      repo: issue.repo,
      issueNumber: issue.number,
      url: issue.url,
      createdAt: new Date(issue.createdAt),
    })
    .onConflictDoUpdate({
      target: schema.githubIssues.feedbackId,
      set: {
        repo: issue.repo,
        issueNumber: issue.number,
        url: issue.url,
        createdAt: new Date(issue.createdAt),
      },
    })
  await db
    .update(schema.feedbackItems)
    .set({
      status: 'promoted',
      updatedAt: now(),
    })
    .where(eq(schema.feedbackItems.id, id))

  return getFeedbackItem(event, id)
}
