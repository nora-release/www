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
  error?: string
  error_description?: string
}

export default (event: any) => withApiResponse(event, async () => {
  const oauthConfig = getGitHubOAuthConfig(event)

  if (!oauthConfig.configured) {
    throw feedbackError(500, 'GitHub OAuth is not configured.')
  }

  const code = getQueryValue(event, 'code') ?? ''
  const state = getQueryValue(event, 'state') ?? ''

  if (!code || !state) {
    throw feedbackError(400, 'GitHub OAuth callback is missing code or state.')
  }

  const oauthState = consumeFeedbackOAuthState(event, state)
  const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'User-Agent': 'nora-www-feedback',
    },
    body: JSON.stringify({
      client_id: oauthConfig.clientId,
      client_secret: oauthConfig.clientSecret,
      code,
      redirect_uri: getGitHubOAuthRedirectUrl(event),
    }),
  })
  const tokenBody = (await tokenResponse.json()) as GitHubTokenResponse

  if (!tokenResponse.ok || !tokenBody.access_token || tokenBody.error) {
    throw feedbackError(
      502,
      tokenBody.error_description || 'GitHub OAuth token exchange failed.',
    )
  }

  const userResponse = await fetch('https://api.github.com/user', {
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${tokenBody.access_token}`,
      'User-Agent': 'nora-www-feedback',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  })
  const githubUser = await userResponse.json()

  if (!userResponse.ok) {
    throw feedbackError(502, 'GitHub user lookup failed.', githubUser)
  }

  setFeedbackSession(event, githubUser)

  return redirectResponse(sanitizeReturnTo(oauthState.returnTo), 302)
})
