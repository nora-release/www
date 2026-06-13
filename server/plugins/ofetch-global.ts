import { createFetch } from 'ofetch'
import { isCloudflareWorkers } from '../utils/feedback/http'
import { defineNitroPlugin } from '../utils/nitro-imports-compat'

export default defineNitroPlugin(async () => {
  // Cloudflare Workers already provides a correct global fetch; overriding it
  // with node-fetch-native breaks the runtime there.
  if (isCloudflareWorkers()) {
    return
  }

  try {
    const { fetch: nodeFetch } = await import('node-fetch-native/node')

    globalThis.$fetch = createFetch({
      fetch: nodeFetch,
      Headers: globalThis.Headers,
      AbortController: globalThis.AbortController,
    })
  } catch (error) {
    console.warn('[ofetch-global] failed to load node-fetch-native:', error)
  }
})
