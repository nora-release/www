import { createFetch } from 'ofetch'
import { defineNitroPlugin } from '../utils/nitro-imports-compat'

const isCloudflareWorkers = () => {
  return typeof caches !== 'undefined' && typeof (globalThis as any).WebSocketPair !== 'undefined'
}

export default defineNitroPlugin(async () => {
  // Cloudflare Workers already provides a correct global fetch; overriding it
  // with node-fetch-native breaks the runtime there.
  if (isCloudflareWorkers()) {
    console.log('[ofetch-global] running on Cloudflare Workers, skipping $fetch override')
    return
  }

  try {
    const { fetch: nodeFetch } = await import('node-fetch-native/node')

    globalThis.$fetch = createFetch({
      fetch: nodeFetch,
      Headers: globalThis.Headers,
      AbortController: globalThis.AbortController,
    })

    console.log('[ofetch-global] $fetch overridden with node-fetch-native')
  } catch (error) {
    console.warn('[ofetch-global] failed to load node-fetch-native, using global fetch:', error)
  }
})
