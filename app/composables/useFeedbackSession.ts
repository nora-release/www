import type { FeedbackAuthor } from '../../server/utils/feedback/types'

type FeedbackUser = FeedbackAuthor & {
  isAdmin: boolean
}

type FeedbackSessionResponse = {
  user: FeedbackUser | null
  auth: {
    githubConfigured: boolean
  }
  feedback: {
    issuePromotionConfigured: boolean
    issueRepo: string
  }
}

const getSessionErrorMessage = (error: unknown, fallback: string) => {
  const fetchError = error as {
    data?: { statusMessage?: string; message?: string }
    statusMessage?: string
    message?: string
  }

  return (
    fetchError.data?.statusMessage
    || fetchError.data?.message
    || fetchError.statusMessage
    || fetchError.message
    || fallback
  )
}

export const useFeedbackSession = () => {
  const session = useState<FeedbackSessionResponse | null>(
    'feedback-session',
    () => null,
  )
  const isLoadingSession = useState('feedback-session-loading', () => false)
  const sessionError = useState('feedback-session-error', () => '')
  const hasLoadedSession = useState('feedback-session-loaded', () => false)

  const user = computed(() => session.value?.user ?? null)

  const loadSession = async (options: { force?: boolean } = {}) => {
    if (isLoadingSession.value) {
      return session.value
    }

    if (hasLoadedSession.value && !options.force) {
      return session.value
    }

    isLoadingSession.value = true
    sessionError.value = ''

    try {
      session.value = await $fetch<FeedbackSessionResponse>('/api/auth/session')
      hasLoadedSession.value = true

      return session.value
    } catch (error) {
      session.value = null
      hasLoadedSession.value = true
      sessionError.value = getSessionErrorMessage(
        error,
        'Session could not be loaded.',
      )
      console.error('[FeedbackSession] loadSession failed:', error)

      return null
    } finally {
      isLoadingSession.value = false
    }
  }

  const logout = async () => {
    await $fetch('/api/auth/logout', { method: 'POST' })
    session.value = null
    hasLoadedSession.value = true
    sessionError.value = ''
  }

  return {
    session,
    user,
    isLoadingSession,
    sessionError,
    loadSession,
    logout,
  }
}
