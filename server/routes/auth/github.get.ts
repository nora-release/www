import { defineOAuthGitHubEventHandler } from '#imports'
import { getQuery, sendRedirect } from 'nitro/h3'
import {
  consumeFeedbackOAuthReturnTo,
  getGitHubOAuthConfig,
  getGitHubOAuthRedirectUrl,
  sanitizeReturnTo,
  setFeedbackOAuthReturnTo,
  setFeedbackSession,
} from '../../utils/feedback/auth'
import { mergeEventHeaders } from '../../utils/feedback/http'

const GITHUB_AUTHORIZATION_URL = 'https://github.com/login/oauth/authorize'
const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token'
const GITHUB_API_URL = 'https://api.github.com'

const isCloudflareWorkers = () => {
  return typeof caches !== 'undefined' && typeof (globalThis as any).WebSocketPair !== 'undefined'
}

const toErrorMessage = (error: unknown) => {
  const oauthError = error as {
    message?: unknown
    statusMessage?: unknown
    statusCode?: unknown
    data?: unknown
  }

  const statusMessage =
    typeof oauthError.statusMessage === 'string'
      ? oauthError.statusMessage
      : typeof oauthError.message === 'string'
        ? oauthError.message
        : 'GitHub OAuth login failed.'

  return {
    status: typeof oauthError.statusCode === 'number' ? oauthError.statusCode : 401,
    statusMessage: statusMessage.replace(/^Github /, 'GitHub '),
    data: oauthError.data,
  }
}

const oauthErrorResponse = (
  error: unknown,
  redirectUri: string,
) => {
  const response = toErrorMessage(error)

  return Response.json(
    {
      error: true,
      status: response.status,
      statusMessage: response.statusMessage,
      data: {
        ...(
          response.data && typeof response.data === 'object'
            ? response.data
            : {}
        ),
        redirectUri,
      },
    },
    {
      status: response.status,
    },
  )
}

export default async (event: any) => {
  const query = getQuery(event)
  const oauthConfig = getGitHubOAuthConfig(event)
  const redirectURL = getGitHubOAuthRedirectUrl(event)
  const runtime = isCloudflareWorkers() ? 'cloudflare-workers' : 'node'

  console.log('[GitHub OAuth] request', {
    runtime,
    method: event.method,
    url: event.path,
    hasCode: Boolean(query.code),
    hasError: Boolean(query.error),
    redirectURL,
    configured: oauthConfig.configured,
    hasSessionPassword: Boolean(
      process.env.NUXT_SESSION_PASSWORD || process.env.NORA_SESSION_SECRET,
    ),
  })

  if (!query.code && !query.error) {
    setFeedbackOAuthReturnTo(
      event,
      sanitizeReturnTo(typeof query.next === 'string' ? query.next : undefined),
    )
  }

  const handler = defineOAuthGitHubEventHandler({
    config: {
      clientId: oauthConfig.clientId,
      clientSecret: oauthConfig.clientSecret,
      redirectURL,
      authorizationURL: GITHUB_AUTHORIZATION_URL,
      tokenURL: GITHUB_TOKEN_URL,
      apiURL: GITHUB_API_URL,
      scope: ['read:user'],
      authorizationParams: {
        allow_signup: 'true',
      },
    },
    async onSuccess(event, { user }) {
      console.log('[GitHub OAuth] onSuccess', { login: user?.login, id: user?.id })
      const sessionUser = await setFeedbackSession(event, user)
      const returnTo = consumeFeedbackOAuthReturnTo(event)
      console.log('[GitHub OAuth] session set, redirecting to', returnTo)

      // h3 v2 sendRedirect ignores event.res headers, so merge cookies manually.
      const redirectResponse = sendRedirect(event, returnTo, 302)
      return mergeEventHeaders(event, redirectResponse)
    },
    onError(_event, error) {
      console.error('[GitHub OAuth] handler error:', error)
      return oauthErrorResponse(error, redirectURL)
    },
  })

  try {
    return await handler(event)
  } catch (error) {
    console.error('[GitHub OAuth] unexpected error:', error)
    return oauthErrorResponse(error, redirectURL)
  }
}
