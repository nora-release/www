import {
  consumeFeedbackOAuthState,
  getGitHubOAuthConfig,
  getGitHubOAuthRedirectUrl,
  sanitizeReturnTo,
  setFeedbackSession,
} from '../../../utils/feedback/auth'
import {
  feedbackError,
  getQueryValue,
  redirectResponse,
  withApiResponse,
} from '../../../utils/feedback/http'

type GitHubTokenResponse = {
  access_token?: string
  error?: unknown
  error_description?: unknown
  error_uri?: unknown
  message?: unknown
  documentation_url?: unknown
}

const toMessage = (value: unknown) => {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined
}

const maskClientId = (clientId: string) => {
  if (clientId.length <= 10) {
    return clientId ? `${clientId.slice(0, 2)}...` : ''
  }

  return `${clientId.slice(0, 6)}...${clientId.slice(-4)}`
}

export default (event: any) => withApiResponse(event, async () => {
  const oauthConfig = getGitHubOAuthConfig(event)

  if (!oauthConfig.configured) {
    throw feedbackError(500, 'GitHub OAuth is not configured.')
  }

  const code = getQueryValue(event, 'code') ?? ''
  const state = getQueryValue(event, 'state') ?? ''
  const callbackError = getQueryValue(event, 'error')
  const callbackErrorDescription = getQueryValue(event, 'error_description')

  if (callbackError) {
    throw feedbackError(
      401,
      callbackErrorDescription || `GitHub OAuth failed: ${callbackError}`,
      {
        providerError: callbackError,
        providerDescription: callbackErrorDescription,
      },
    )
  }

  if (!code || !state) {
    throw feedbackError(400, 'GitHub OAuth callback is missing code or state.')
  }

  const oauthState = consumeFeedbackOAuthState(event, state)
  const redirectUri = getGitHubOAuthRedirectUrl(event)
  const tokenRequestBody = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: oauthConfig.clientId,
    client_secret: oauthConfig.clientSecret,
    redirect_uri: redirectUri,
    code,
  })
  const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'nora-www-feedback',
    },
    body: tokenRequestBody.toString(),
  })
  const tokenBody = (await tokenResponse.json().catch(() => ({}))) as GitHubTokenResponse
  const providerError =
    toMessage(tokenBody.error) ||
    toMessage(tokenBody.message)
  const providerDescription = toMessage(tokenBody.error_description)
  const providerErrorUri =
    toMessage(tokenBody.error_uri) ||
    toMessage(tokenBody.documentation_url)
  const isMissingOAuthApp =
    tokenResponse.status === 404 ||
    providerError?.toLowerCase() === 'not found'

  if (!tokenResponse.ok || !tokenBody.access_token || tokenBody.error) {
    throw feedbackError(
      401,
      isMissingOAuthApp
        ? 'GitHub OAuth App was not found. Check GITHUB_CLIENT_ID in Zeabur.'
        : providerDescription ||
          providerError ||
          'GitHub OAuth token exchange failed.',
      {
        providerStatus: tokenResponse.status,
        providerError,
        providerDescription,
        providerErrorUri,
        redirectUri,
        clientId: maskClientId(oauthConfig.clientId),
      },
    )
  }

  const userResponse = await fetch('https://api.github.com/user', {
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `token ${tokenBody.access_token}`,
      'User-Agent': 'nora-www-feedback',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  })
  const githubUser = await userResponse.json()

  if (!userResponse.ok) {
    throw feedbackError(401, 'GitHub user lookup failed.', githubUser)
  }

  setFeedbackSession(event, githubUser)

  return redirectResponse(sanitizeReturnTo(oauthState.returnTo), 302)
})
