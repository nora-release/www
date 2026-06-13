import { useSession } from 'nitro/h3'
import { withApiResponse } from '../utils/feedback/http'

export default (event: any) => withApiResponse(event, async () => {
  const session = await useSession(event, {
    name: 'nuxt-session',
    password: process.env.NUXT_SESSION_PASSWORD
      || process.env.NORA_SESSION_SECRET
      || '',
    cookie: {
      sameSite: 'lax',
    },
  })

  console.log('[Test Session] before update:', {
    data: session.data,
    hasRes: Boolean(event.res),
    hasHeaders: Boolean(event.res?.headers),
  })

  await session.update({
    user: { id: 1, login: 'test' },
    loggedInAt: new Date().toISOString(),
  })

  const eventRes = event.res
  const eventHeaders = eventRes?.headers
  const setCookies = eventHeaders
    ? typeof eventHeaders.getSetCookie === 'function'
      ? eventHeaders.getSetCookie()
      : eventHeaders.get('set-cookie')
        ? [eventHeaders.get('set-cookie')]
        : []
    : []

  console.log('[Test Session] after update, cookies:', setCookies)

  return {
    ok: true,
    hadSessionData: Object.keys(session.data).length > 0,
    setCookies,
  }
})
