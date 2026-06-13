import { $fetch } from 'ofetch'
import { definePlugin } from 'nitro'

export default definePlugin(() => {
  if (!globalThis.$fetch) {
    globalThis.$fetch = $fetch
  }
})
