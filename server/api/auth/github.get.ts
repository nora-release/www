import {
  createFeedbackOAuthState,
  getGitHubOAuthConfig,
  getGitHubOAuthRedirectUrl,
  sanitizeReturnTo,
} from '../../utils/feedback/auth'
import {
  feedbackError,
  getQueryValue,
  redirectResponse,
  withApiResponse,
} from '../../utils/feedback/http'

export default (event: any) => withApiResponse(event, () => {
  const oauthConfig = getGitHubOAuthConfig(event)

  if (!oauthConfig.configured) {
    throw feedbackError(500, 'GitHub OAuth is not configured.')
  }

  const returnTo = sanitizeReturnTo(getQueryValue(event, 'next'))
  const state = createFeedbackOAuthState(event, returnTo)
  const authorizeUrl = new URL('https://github.com/login/oauth/authorize')

  authorizeUrl.searchParams.set('client_id', oauthConfig.clientId)
  authorizeUrl.searchParams.set('redirect_uri', getGitHubOAuthRedirectUrl(event))
  authorizeUrl.searchParams.set('scope', 'read:user')
  authorizeUrl.searchParams.set('state', state)

  return redirectResponse(authorizeUrl.toString(), 302)
})
