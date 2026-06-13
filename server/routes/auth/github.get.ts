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

const GITHUB_AUTHORIZATION_URL = 'https://github.com/login/oauth/authorize'
const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token'
const GITHUB_API_URL = 'https://api.github.com'

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
      await setFeedbackSession(event, user)

      return sendRedirect(event, consumeFeedbackOAuthReturnTo(event), 302)
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
