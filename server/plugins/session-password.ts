import { defineNitroPlugin } from '../utils/nitro-imports-compat'

export default defineNitroPlugin(() => {
  if (!process.env.NUXT_SESSION_PASSWORD && process.env.NORA_SESSION_SECRET) {
    process.env.NUXT_SESSION_PASSWORD = process.env.NORA_SESSION_SECRET
  }
})
