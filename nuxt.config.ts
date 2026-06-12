import { fileURLToPath } from 'node:url'

const nitroImportsCompatPath = fileURLToPath(
  new URL('./server/utils/nitro-imports-compat.ts', import.meta.url),
)

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { 
    enabled: true 
  },
  runtimeConfig: {
    siteUrl: process.env.NORA_SITE_URL || '',
    sessionSecret: process.env.NORA_SESSION_SECRET || '',
    githubOAuth: {
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    },
    feedback: {
      githubRepo: process.env.NORA_FEEDBACK_GITHUB_REPO || '',
      githubToken: process.env.NORA_FEEDBACK_GITHUB_TOKEN || '',
    },
  },
  hub: {
    db: 'postgresql',
  },
  nitro: {
    imports: {
      imports: [
        {
          from: nitroImportsCompatPath,
          name: 'defineNitroPlugin',
        },
        {
          from: nitroImportsCompatPath,
          name: 'useRuntimeConfig',
        },
      ],
    },
  },
  modules: [
    '@nuxthub/core',
    '@vueuse/nuxt',
    '@unocss/nuxt',
  ]
})
