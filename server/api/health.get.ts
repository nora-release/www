import { useRuntimeConfig } from '../utils/nitro-imports-compat'
import { isCloudflareWorkers, withApiResponse } from '../utils/feedback/http'

export default (event: any) => withApiResponse(event, () => {
  const config = useRuntimeConfig()
  const runtime = isCloudflareWorkers() ? 'cloudflare-workers' : 'node'
  const sessionConfigured = Boolean(
    config.session?.password
    || process.env.NUXT_SESSION_PASSWORD
    || process.env.NORA_SESSION_SECRET,
  )
  const oauthConfigured = Boolean(
    config.oauth?.github?.clientId && config.oauth?.github?.clientSecret,
  )

  return {
    ok: true,
    runtime,
    sessionConfigured,
    oauthConfigured,
  }
})
