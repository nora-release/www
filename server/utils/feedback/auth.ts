import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto'
import {
  clearCookieValue,
  feedbackError,
  getCookieValue,
  getRequestUrl,
  setCookieValue,
} from './http'
import type { FeedbackAuthor, PublicFeedbackUser } from './types'

const SESSION_COOKIE = 'nora_feedback_session'
const OAUTH_STATE_COOKIE = 'nora_feedback_oauth_state'
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30
const OAUTH_STATE_TTL_SECONDS = 60 * 10

type SessionCookiePayload = {
  version: 1
  user: FeedbackAuthor
  issuedAt: number
  expiresAt: number
}

type OAuthStatePayload = {
  version: 1
  state: string
  returnTo: string
  createdAt: number
}

type FeedbackRuntimeConfig = {
  siteUrl?: string
  sessionSecret?: string
  githubOAuth?: {
    clientId?: string
    clientSecret?: string
  }
}

type GitHubOAuthUser = {
  id?: number
  login?: string
  name?: string | null
  avatar_url?: string
  html_url?: string
}

const getFeedbackConfig = (_event: unknown): FeedbackRuntimeConfig => {
  return {
    siteUrl: process.env.NORA_SITE_URL || '',
    sessionSecret: process.env.NORA_SESSION_SECRET || '',
    githubOAuth: {
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    },
  }
}

const getSessionSecret = (event: unknown) => {
  const config = getFeedbackConfig(event)

  return (
    config.sessionSecret ||
    config.githubOAuth?.clientSecret ||
    'nora-www-local-session-secret'
  )
}

const encodeBase64Url = (value: string) => {
  return Buffer.from(value).toString('base64url')
}

const decodeBase64Url = (value: string) => {
  return Buffer.from(value, 'base64url').toString('utf8')
}

const signPayload = (payload: unknown, secret: string) => {
  const encodedPayload = encodeBase64Url(JSON.stringify(payload))
  const signature = createHmac('sha256', secret)
    .update(encodedPayload)
    .digest('base64url')

  return `${encodedPayload}.${signature}`
}

const verifySignedPayload = <T>(token: string | undefined, secret: string) => {
  if (!token) {
    return null
  }

  const [encodedPayload, signature] = token.split('.')

  if (!encodedPayload || !signature) {
    return null
  }

  const expectedSignature = createHmac('sha256', secret)
    .update(encodedPayload)
    .digest('base64url')
  const actualBuffer = Buffer.from(signature)
  const expectedBuffer = Buffer.from(expectedSignature)

  if (
    actualBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(actualBuffer, expectedBuffer)
  ) {
    return null
  }

  try {
    return JSON.parse(decodeBase64Url(encodedPayload)) as T
  } catch {
    return null
  }
}

const isSecureRequest = (event: any) => {
  const requestUrl = getRequestUrl(event)

  return requestUrl.protocol === 'https:'
}

const getCookieOptions = (event: unknown) => {
  return {
    httpOnly: true,
    maxAge: SESSION_TTL_SECONDS,
    path: '/',
    sameSite: 'lax' as const,
    secure: isSecureRequest(event),
  }
}

const toAuthor = (user: GitHubOAuthUser): FeedbackAuthor => {
  if (!user.id || !user.login) {
    throw feedbackError(500, 'GitHub user profile is incomplete.')
  }

  return {
    id: user.id,
    login: user.login,
    name: user.name || user.login,
    avatarUrl: user.avatar_url || '',
    htmlUrl: user.html_url || `https://github.com/${user.login}`,
  }
}

const withAdminState = (
  user: FeedbackAuthor,
): PublicFeedbackUser => {
  return {
    ...user,
    isAdmin: false,
  }
}

const resolveStoredFeedbackUser = async (
  event: unknown,
  author: FeedbackAuthor,
) => {
  const store = await import('./store')

  return store.resolveFeedbackUser(event, author)
}

export const getGitHubOAuthConfig = (event: unknown) => {
  const config = getFeedbackConfig(event)

  return {
    clientId: config.githubOAuth?.clientId ?? '',
    clientSecret: config.githubOAuth?.clientSecret ?? '',
    configured: Boolean(
      config.githubOAuth?.clientId && config.githubOAuth?.clientSecret,
    ),
  }
}

export const getGitHubOAuthRedirectUrl = (event: unknown) => {
  const config = getFeedbackConfig(event)
  const requestUrl = getRequestUrl(event)
  const origin =
    config.siteUrl?.replace(/\/+$/, '') ||
    `${requestUrl.protocol}//${requestUrl.host}`

  return `${origin}/api/auth/github/callback`
}

export const sanitizeReturnTo = (value: unknown, fallback = '/feedback') => {
  if (typeof value !== 'string') {
    return fallback
  }

  const trimmedValue = value.trim()

  if (
    trimmedValue.startsWith('/') &&
    !trimmedValue.startsWith('//') &&
    !trimmedValue.includes('\\')
  ) {
    return trimmedValue
  }

  return fallback
}

export const createFeedbackOAuthState = (
  event: unknown,
  returnTo: string,
) => {
  const state = randomBytes(24).toString('base64url')
  const payload: OAuthStatePayload = {
    version: 1,
    state,
    returnTo,
    createdAt: Date.now(),
  }

  setCookieValue(
    event,
    OAUTH_STATE_COOKIE,
    signPayload(payload, getSessionSecret(event)),
    {
      ...getCookieOptions(event),
      maxAge: OAUTH_STATE_TTL_SECONDS,
    },
  )

  return state
}

export const consumeFeedbackOAuthState = (
  event: unknown,
  state: string,
) => {
  const payload = verifySignedPayload<OAuthStatePayload>(
    getCookieValue(event, OAUTH_STATE_COOKIE),
    getSessionSecret(event),
  )

  clearCookieValue(event, OAUTH_STATE_COOKIE, {
    path: '/',
  })

  if (
    !payload ||
    payload.version !== 1 ||
    payload.state !== state ||
    Date.now() - payload.createdAt > OAUTH_STATE_TTL_SECONDS * 1000
  ) {
    throw feedbackError(400, 'Invalid GitHub OAuth state.')
  }

  return {
    returnTo: sanitizeReturnTo(payload.returnTo),
  }
}

export const setFeedbackSession = (
  event: unknown,
  githubUser: GitHubOAuthUser,
) => {
  const issuedAt = Date.now()
  const payload: SessionCookiePayload = {
    version: 1,
    user: toAuthor(githubUser),
    issuedAt,
    expiresAt: issuedAt + SESSION_TTL_SECONDS * 1000,
  }

  setCookieValue(
    event,
    SESSION_COOKIE,
    signPayload(payload, getSessionSecret(event)),
    {
      ...getCookieOptions(event),
      maxAge: SESSION_TTL_SECONDS,
    },
  )

  return withAdminState(payload.user)
}

export const clearFeedbackSession = (event: unknown) => {
  clearCookieValue(event, SESSION_COOKIE, {
    path: '/',
  })
}

export const getFeedbackSession = (event: unknown) => {
  const payload = verifySignedPayload<SessionCookiePayload>(
    getCookieValue(event, SESSION_COOKIE),
    getSessionSecret(event),
  )

  if (!payload || payload.version !== 1 || payload.expiresAt < Date.now()) {
    return null
  }

  return {
    user: payload.user,
    expiresAt: payload.expiresAt,
  }
}

export const requireFeedbackUser = async (event: unknown) => {
  const session = getFeedbackSession(event)

  if (!session) {
    throw feedbackError(401, 'GitHub login is required.')
  }

  return resolveStoredFeedbackUser(event, session.user)
}

export const resolveFeedbackSessionUser = async (event: unknown) => {
  const session = getFeedbackSession(event)

  if (!session) {
    return null
  }

  return resolveStoredFeedbackUser(event, session.user)
}
