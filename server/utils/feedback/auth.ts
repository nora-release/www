import { useSession } from 'nitro/h3'
import {
  clearCookieValue,
  feedbackError,
  getCookieValue,
  getRequestUrl,
  setCookieValue,
} from './http'
import type { FeedbackAuthor, PublicFeedbackUser } from './types'

const RETURN_TO_COOKIE = 'nora_feedback_return_to'
const RETURN_TO_TTL_SECONDS = 60 * 10
const SESSION_NAME = 'nuxt-session'

const getSessionPassword = () => {
  return (
    process.env.NUXT_SESSION_PASSWORD
    || process.env.NORA_SESSION_SECRET
    || ''
  )
}

const getSessionConfig = () => {
  return {
    name: SESSION_NAME,
    password: getSessionPassword(),
    cookie: {
      sameSite: 'lax' as const,
    },
  }
}

type FeedbackRuntimeConfig = {
  siteUrl?: string
  github?: {
    clientId?: string
    clientSecret?: string
    redirectURL?: string
  }
}

type GitHubOAuthUser = {
  id?: number
  login?: string
  name?: string | null
  avatar_url?: string
  html_url?: string
}

const asSessionEvent = (event: unknown) => {
  if (event && typeof event === 'object') {
    // Nuxt 5 nightly currently passes a session-capable event without h3's marker.
    Object.defineProperty(event, '__is_event__', {
      configurable: true,
      value: true,
    })
  }

  return event as any
}

const normalizeEnvValue = (value: string | undefined) => {
  const trimmedValue = (value || '').trim()

  if (
    (trimmedValue.startsWith('"') && trimmedValue.endsWith('"')) ||
    (trimmedValue.startsWith("'") && trimmedValue.endsWith("'"))
  ) {
    return trimmedValue.slice(1, -1).trim()
  }

  return trimmedValue
}

const getFeedbackConfig = (_event: unknown): FeedbackRuntimeConfig => {
  return {
    siteUrl: normalizeEnvValue(process.env.NORA_SITE_URL),
    github: {
      clientId: normalizeEnvValue(
        process.env.NUXT_OAUTH_GITHUB_CLIENT_ID || process.env.GITHUB_CLIENT_ID,
      ),
      clientSecret: normalizeEnvValue(
        process.env.NUXT_OAUTH_GITHUB_CLIENT_SECRET || process.env.GITHUB_CLIENT_SECRET,
      ),
      redirectURL: normalizeEnvValue(process.env.NUXT_OAUTH_GITHUB_REDIRECT_URL),
    },
  }
}

const isSecureRequest = (event: any) => {
  const requestUrl = getRequestUrl(event)

  return requestUrl.protocol === 'https:'
}

const getCookieOptions = (event: unknown) => {
  return {
    httpOnly: true,
    maxAge: RETURN_TO_TTL_SECONDS,
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
    clientId: config.github?.clientId ?? '',
    clientSecret: config.github?.clientSecret ?? '',
    configured: Boolean(
      config.github?.clientId && config.github?.clientSecret,
    ),
  }
}

export const getGitHubOAuthRedirectUrl = (event: unknown) => {
  const config = getFeedbackConfig(event)
  const requestUrl = getRequestUrl(event)
  const configuredRedirectURL = config.github?.redirectURL

  if (configuredRedirectURL) {
    return configuredRedirectURL
  }

  const origin =
    config.siteUrl?.replace(/\/+$/, '') ||
    `${requestUrl.protocol}//${requestUrl.host}`

  return `${origin}/auth/github`
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

export const setFeedbackOAuthReturnTo = (
  event: unknown,
  returnTo: string,
) => {
  setCookieValue(
    event,
    RETURN_TO_COOKIE,
    sanitizeReturnTo(returnTo),
    {
      ...getCookieOptions(event),
      maxAge: RETURN_TO_TTL_SECONDS,
    },
  )
}

export const consumeFeedbackOAuthReturnTo = (
  event: unknown,
) => {
  const returnTo = sanitizeReturnTo(getCookieValue(event, RETURN_TO_COOKIE))

  clearCookieValue(event, RETURN_TO_COOKIE, {
    path: '/',
  })

  return returnTo
}

export const setFeedbackSession = async (
  event: unknown,
  githubUser: GitHubOAuthUser,
) => {
  const user = await resolveStoredFeedbackUser(event, toAuthor(githubUser))
  const session = await useSession(asSessionEvent(event), getSessionConfig())

  await session.update({
    user,
    loggedInAt: new Date().toISOString(),
  })

  const eventRes = (event as any).res
  const eventHeaders = eventRes?.headers
  const setCookies = eventHeaders
    ? typeof eventHeaders.getSetCookie === 'function'
      ? eventHeaders.getSetCookie()
      : eventHeaders.get('set-cookie')
        ? [eventHeaders.get('set-cookie')]
        : []
    : []

  console.log('[setFeedbackSession] user set, cookies:', setCookies)

  return user
}

export const clearFeedbackSession = async (event: unknown) => {
  const session = await useSession(asSessionEvent(event), getSessionConfig())
  await session.clear()
}

export const getFeedbackSession = async (event: unknown) => {
  const session = await useSession(asSessionEvent(event), getSessionConfig())
  const user = session.data.user as PublicFeedbackUser | undefined

  if (!user?.id || !user.login) {
    return null
  }

  return {
    user: {
      id: Number(user.id),
      login: user.login,
      name: user.name || user.login,
      avatarUrl: user.avatarUrl || '',
      htmlUrl: user.htmlUrl || `https://github.com/${user.login}`,
    },
    expiresAt: null,
  }
}

export const requireFeedbackUser = async (event: unknown) => {
  const session = await getFeedbackSession(event)

  if (!session) {
    throw feedbackError(401, 'GitHub login is required.')
  }

  return resolveStoredFeedbackUser(event, session.user)
}

export const resolveFeedbackSessionUser = async (event: unknown) => {
  const session = await getFeedbackSession(event)

  if (!session) {
    return null
  }

  return resolveStoredFeedbackUser(event, session.user)
}
