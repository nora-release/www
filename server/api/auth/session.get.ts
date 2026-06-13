import {
  getGitHubOAuthConfig,
  resolveFeedbackSessionUser,
} from '../../utils/feedback/auth'
import { getIssuePromotionConfig } from '../../utils/feedback/github'
import { withApiResponse } from '../../utils/feedback/http'

export default (event: any) => withApiResponse(event, async () => {
  const runtime = typeof caches !== 'undefined' && typeof (globalThis as any).WebSocketPair !== 'undefined'
    ? 'cloudflare-workers'
    : 'node'

  console.log('[Auth Session] request', {
    runtime,
    hasSessionPassword: Boolean(
      process.env.NUXT_SESSION_PASSWORD || process.env.NORA_SESSION_SECRET,
    ),
  })

  const user = await resolveFeedbackSessionUser(event)
  const oauthConfig = getGitHubOAuthConfig(event)
  const issueConfig = getIssuePromotionConfig(event)

  console.log('[Auth Session] resolved user:', user?.login ?? null)

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
