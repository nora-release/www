import { definePlugin } from 'nitro'
import { createError } from 'nitro/h3'
import { useRuntimeConfig } from 'nitro/runtime-config'

export const defineNitroPlugin = definePlugin
export { createError, useRuntimeConfig }
