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
    session: {
      password: process.env.NUXT_SESSION_PASSWORD || process.env.NORA_SESSION_SECRET || '',
    },
    oauth: {
      github: {
        clientId: process.env.GITHUB_CLIENT_ID || '',
        clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
        redirectURL: process.env.NUXT_OAUTH_GITHUB_REDIRECT_URL || '',
      },
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
    alias: {
      'nitropack/runtime': nitroImportsCompatPath,
    },
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
    'nuxt-auth-utils',
    '@vueuse/nuxt',
    '@unocss/nuxt',
  ]
})
