import {
  getGitHubOAuthConfig,
  getGitHubOAuthRedirectUrl,
  sanitizeReturnTo,
  setFeedbackOAuthReturnTo,
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
  setFeedbackOAuthReturnTo(event, returnTo)

  return redirectResponse(getGitHubOAuthRedirectUrl(event), 302)
})
