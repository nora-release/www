import { randomBytes } from 'node:crypto'
import { and, asc, desc, eq, inArray, sql } from 'drizzle-orm'
import { db, schema } from '@nuxthub/db'
import { feedbackError } from './http'
import type {
  FeedbackAuthor,
  FeedbackCategory,
  FeedbackContributor,
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
  voteRows: Array<{
    feedbackId: string
    value: number
    githubId: number
  }>,
  currentUserId?: number,
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

  const votesByFeedbackId = new Map<string, { score: number; userVote: 1 | -1 | 0 }>()

  for (const vote of voteRows) {
    const existing = votesByFeedbackId.get(vote.feedbackId) ?? { score: 0, userVote: 0 }
    existing.score += vote.value
    if (currentUserId && vote.githubId === currentUserId) {
      existing.userVote = vote.value === 1 ? 1 : -1
    }
    votesByFeedbackId.set(vote.feedbackId, existing)
  }

  return itemRows.map((row) => {
    const voteState = votesByFeedbackId.get(row.item.id) ?? { score: 0, userVote: 0 }
    const category: FeedbackCategory = row.item.category === 'bug' ? 'bug' : 'feature'

    return {
      id: row.item.id,
      title: row.item.title,
      description: row.item.description,
      status: row.item.status === 'promoted' ? 'promoted' : 'open',
      category,
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
      voteScore: voteState.score,
      userVote: voteState.userVote,
    } satisfies FeedbackItem
  })
}

const loadFeedbackItems = async (
  filters: {
    id?: string
    category?: FeedbackCategory
    search?: string
    currentUserId?: number
  } = {},
) => {
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

  const conditions = []

  if (filters.id) {
    conditions.push(eq(schema.feedbackItems.id, filters.id))
  }

  if (filters.category) {
    conditions.push(eq(schema.feedbackItems.category, filters.category))
  }

  const itemRows = conditions.length
    ? await query.where(and(...conditions)).orderBy(desc(schema.feedbackItems.updatedAt))
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

  const voteRows = feedbackIds.length
    ? await db
        .select({
          feedbackId: schema.feedbackVotes.feedbackId,
          value: schema.feedbackVotes.value,
          githubId: schema.feedbackVotes.githubId,
        })
        .from(schema.feedbackVotes)
        .where(inArray(schema.feedbackVotes.feedbackId, feedbackIds))
    : []

  let items = itemRowsToFeedbackItems(itemRows, messageRows, voteRows, filters.currentUserId)

  if (filters.search) {
    const normalizedSearch = filters.search.trim().toLowerCase()
    items = items.filter((item) =>
      item.title.toLowerCase().includes(normalizedSearch)
      || item.description.toLowerCase().includes(normalizedSearch),
    )
  }

  return items
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

export const listFeedbackItems = async (
  _event: unknown,
  options: {
    category?: FeedbackCategory
    sort?: string
    search?: string
    user?: PublicFeedbackUser | null
  } = {},
) => {
  await bootstrapConfiguredAdmins()

  const items = await loadFeedbackItems({
    category: options.category,
    search: options.search,
    currentUserId: options.user?.id,
  })

  const sort = options.sort ?? 'new'

  if (sort === 'top') {
    items.sort((a, b) => {
      if (b.voteScore !== a.voteScore) {
        return b.voteScore - a.voteScore
      }
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    })
  } else if (sort === 'trending') {
    const now = Date.now()
    const score = (item: FeedbackItem) => {
      const hours = Math.max(1, (now - new Date(item.createdAt).getTime()) / 36e5)
      return item.voteScore / Math.pow(hours + 2, 1.5)
    }
    items.sort((a, b) => score(b) - score(a))
  }

  return items
}

export const getFeedbackItem = async (
  _event: unknown,
  id: string,
  user?: PublicFeedbackUser | null,
) => {
  const item = (await loadFeedbackItems({ id, currentUserId: user?.id }))[0]

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
  const rawCategory = normalizeText((input as { category?: unknown })?.category, 20)
  const category: FeedbackCategory = rawCategory === 'bug' ? 'bug' : 'feature'

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
    category,
    authorGithubId: user.id,
    createdAt: timestamp,
    updatedAt: timestamp,
  })

  return getFeedbackItem(event, id, user)
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

  await getFeedbackItem(event, id, user)
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

  return getFeedbackItem(event, id, user)
}

export const voteFeedbackItem = async (
  event: unknown,
  user: PublicFeedbackUser,
  id: string,
  input: unknown,
) => {
  const rawValue = (input as { value?: unknown })?.value
  const value = typeof rawValue === 'number' ? rawValue : Number(rawValue)

  if (![1, -1, 0].includes(value)) {
    throw feedbackError(400, 'Vote value must be 1, -1, or 0.')
  }

  await getFeedbackItem(event, id, user)
  await upsertUser(user)

  if (value === 0) {
    await db
      .delete(schema.feedbackVotes)
      .where(
        and(
          eq(schema.feedbackVotes.feedbackId, id),
          eq(schema.feedbackVotes.githubId, user.id),
        ),
      )
  } else {
    await db
      .insert(schema.feedbackVotes)
      .values({
        feedbackId: id,
        githubId: user.id,
        value,
        createdAt: now(),
      })
      .onConflictDoUpdate({
        target: [schema.feedbackVotes.feedbackId, schema.feedbackVotes.githubId],
        set: {
          value,
          createdAt: now(),
        },
      })
  }

  return getFeedbackItem(event, id, user)
}

export const listTopContributors = async (
  _event: unknown,
  limit = 8,
): Promise<FeedbackContributor[]> => {
  await bootstrapConfiguredAdmins()

  const scores = db
    .select({
      authorGithubId: schema.feedbackItems.authorGithubId,
      score: sql<number>`COALESCE(SUM(${schema.feedbackVotes.value}), 0)`.as('score'),
    })
    .from(schema.feedbackVotes)
    .innerJoin(
      schema.feedbackItems,
      eq(schema.feedbackVotes.feedbackId, schema.feedbackItems.id),
    )
    .groupBy(schema.feedbackItems.authorGithubId)
    .as('scores')

  const rows = await db
    .select({
      author: schema.feedbackUsers,
      score: scores.score,
    })
    .from(scores)
    .innerJoin(
      schema.feedbackUsers,
      eq(scores.authorGithubId, schema.feedbackUsers.githubId),
    )
    .orderBy(desc(scores.score))
    .limit(limit)

  return rows.map((row) => ({
    id: row.author.githubId,
    login: row.author.githubLogin,
    name: row.author.name,
    avatarUrl: row.author.avatarUrl,
    htmlUrl: row.author.htmlUrl,
    score: row.score,
  }))
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
