import { $fetch } from 'ofetch'
import { definePlugin } from 'nitro'

export default definePlugin(() => {
  globalThis.$fetch = $fetch
})
