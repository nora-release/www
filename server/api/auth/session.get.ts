import {
  getGitHubOAuthConfig,
  resolveFeedbackSessionUser,
} from '../../utils/feedback/auth'
import { getIssuePromotionConfig } from '../../utils/feedback/github'
import { withApiResponse } from '../../utils/feedback/http'

export default (event: any) => withApiResponse(event, async () => {
  const user = await resolveFeedbackSessionUser(event)
  const oauthConfig = getGitHubOAuthConfig(event)
  const issueConfig = getIssuePromotionConfig(event)

  return {
    user,
    auth: {
      githubConfigured: oauthConfig.configured,
    },
    feedback: {
      issuePromotionConfigured: issueConfig.configured,
      issueRepo: issueConfig.repo,
    },
  }
})
