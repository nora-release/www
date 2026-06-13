import { createFetch } from 'ofetch'
import { fetch as nodeFetch } from 'node-fetch-native/node'
import { defineNitroPlugin } from '../utils/nitro-imports-compat'

export default defineNitroPlugin(() => {
  globalThis.$fetch = createFetch({
    fetch: nodeFetch,
    Headers: globalThis.Headers,
    AbortController: globalThis.AbortController,
  })
})
