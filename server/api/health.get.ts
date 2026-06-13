import { useRuntimeConfig } from '../utils/nitro-imports-compat'
import { withApiResponse } from '../utils/feedback/http'

const isCloudflareWorkers = () => {
  return typeof caches !== 'undefined' && typeof (globalThis as any).WebSocketPair !== 'undefined'
}

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

  console.log('[Health Probe]', {
    timestamp: new Date().toISOString(),
    runtime,
    sessionConfigured,
    oauthConfigured,
    nodeEnv: process.env.NODE_ENV,
  })

  return {
    ok: true,
    runtime,
    sessionConfigured,
    oauthConfigured,
  }
})
