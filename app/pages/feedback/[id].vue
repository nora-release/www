<script setup lang="ts">
import { footerLinks } from '../../data/home'
import type { FeedbackItem } from '../../server/utils/feedback/types'

const route = useRoute()
const id = computed(() => route.params.id as string)

const {
  session,
  user,
  isLoadingSession,
  sessionError,
  loadSession,
} = useFeedbackSession()
const item = ref<FeedbackItem | null>(null)
const isLoadingItem = ref(false)
const isReplying = ref(false)
const isPromoting = ref(false)
const isVoting = ref(false)
const replyDraft = ref('')
const replyError = ref('')
const pageError = ref('')
const actionMessage = ref('')

const categoryLabel = computed(() => {
  return item.value?.category === 'bug' ? 'Bug Reports' : 'Feature Request'
})

const loginHref = computed(() => {
  return `/api/auth/github?next=${encodeURIComponent(`/feedback/${id.value}`)}`
})

const formatDate = (value: string) => {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

const getErrorMessage = (error: unknown, fallback: string) => {
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

const loadItem = async () => {
  isLoadingItem.value = true
  pageError.value = ''

  try {
    const response = await $fetch<{ item: FeedbackItem }>(`/api/feedback/${encodeURIComponent(id.value)}`)
    item.value = response.item
  } catch (error) {
    pageError.value = getErrorMessage(error, 'Feedback could not be loaded.')
  } finally {
    isLoadingItem.value = false
  }
}

const handleVote = async (value: 1 | -1) => {
  if (!user.value || !item.value || isVoting.value) {
    if (!user.value) {
      pageError.value = 'Sign in with GitHub to vote.'
    }
    return
  }

  isVoting.value = true
  pageError.value = ''
  actionMessage.value = ''

  const nextValue = item.value.userVote === value ? 0 : value

  try {
    const response = await $fetch<{ item: FeedbackItem }>(
      `/api/feedback/${encodeURIComponent(id.value)}/vote`,
      {
        method: 'POST',
        body: { value: nextValue },
      },
    )

    item.value = response.item
  } catch (error) {
    pageError.value = getErrorMessage(error, 'Vote could not be saved.')
  } finally {
    isVoting.value = false
  }
}

const addReply = async () => {
  if (!item.value || isReplying.value) {
    return
  }

  replyError.value = ''
  actionMessage.value = ''

  if (!user.value) {
    replyError.value = 'Sign in with GitHub to reply.'
    return
  }

  isReplying.value = true

  try {
    const response = await $fetch<{ item: FeedbackItem }>(
      `/api/feedback/${encodeURIComponent(id.value)}/messages`,
      {
        method: 'POST',
        body: { body: replyDraft.value },
      },
    )

    replyDraft.value = ''
    item.value = response.item
    actionMessage.value = 'Reply added.'
  } catch (error) {
    replyError.value = getErrorMessage(error, 'Reply could not be added.')
  } finally {
    isReplying.value = false
  }
}

const promoteFeedback = async () => {
  if (!item.value || isPromoting.value) {
    return
  }

  pageError.value = ''
  actionMessage.value = ''
  isPromoting.value = true

  try {
    const response = await $fetch<{
      item: FeedbackItem
      issue: NonNullable<FeedbackItem['issue']>
    }>(`/api/feedback/${encodeURIComponent(id.value)}/promote`, {
      method: 'POST',
    })

    item.value = response.item
    actionMessage.value = `Issue #${response.issue.number} created in ${response.issue.repo}.`
  } catch (error) {
    pageError.value = getErrorMessage(error, 'Feedback could not be promoted.')
  } finally {
    isPromoting.value = false
  }
}

useHead(() => ({
  title: item.value ? `${item.value.title} - Feedback - Nora` : 'Feedback - Nora',
  meta: [
    {
      name: 'description',
      content: item.value
        ? `Feedback discussion: ${item.value.title}`
        : 'Share Nora feedback and discuss requests with the team.',
    },
  ],
}))

onMounted(async () => {
  await loadSession({ force: true })
  if (sessionError.value) {
    pageError.value = sessionError.value
  }
  await loadItem()
})
</script>

<template>
  <div id="top" class="feedback-page">
    <main class="feedback-shell">
      <section class="feedback-detail" aria-live="polite">
        <NuxtLink class="feedback-back" to="/feedback">
          <span class="i-lucide-arrow-left size-4" aria-hidden="true" />
          Back to feedback
        </NuxtLink>

        <div v-if="isLoadingItem || isLoadingSession" class="feedback-state">
          Loading feedback...
        </div>

        <div v-else-if="pageError" class="feedback-inline-error">
          {{ pageError }}
        </div>

        <article v-else-if="item" class="feedback-thread">
          <header class="feedback-thread-header">
            <div class="feedback-thread-meta">
              <div class="feedback-thread-pills">
                <span
                  class="feedback-thread-category"
                  :class="`feedback-thread-category-${item.category}`"
                >
                  {{ categoryLabel }}
                </span>
                <span
                  class="feedback-thread-status"
                  :class="`feedback-thread-status-${item.status}`"
                >
                  {{ item.status === 'promoted' ? 'Promoted' : 'Open' }}
                </span>
              </div>
              <h1>{{ item.title }}</h1>
              <p>
                <img
                  class="feedback-thread-avatar"
                  :src="item.author.avatarUrl"
                  alt=""
                  width="20"
                  height="20"
                >
                @{{ item.author.login }} · {{ formatDate(item.createdAt) }}
              </p>
            </div>

            <FeedbackVoteColumn
              :score="item.voteScore"
              :user-vote="item.userVote"
              :disabled="isVoting || !user"
              @vote="handleVote"
            />
          </header>

          <p class="feedback-description">{{ item.description }}</p>

          <div v-if="item.messages.length" class="feedback-message-list">
            <article
              v-for="message in item.messages"
              :key="message.id"
              class="feedback-message"
            >
              <div class="feedback-message-author">
                <img
                  class="feedback-message-avatar"
                  :src="message.author.avatarUrl"
                  alt=""
                  width="32"
                  height="32"
                >
                <div>
                  <strong>@{{ message.author.login }}</strong>
                  <span>{{ formatDate(message.createdAt) }}</span>
                </div>
              </div>
              <p>{{ message.body }}</p>
            </article>
          </div>

          <p v-else class="feedback-empty">No replies yet.</p>

          <form
            v-if="user"
            class="feedback-reply-form"
            @submit.prevent="addReply"
          >
            <label class="feedback-field">
              <span>Reply</span>
              <textarea
                v-model="replyDraft"
                rows="4"
                maxlength="4000"
                placeholder="Add to the conversation"
              />
            </label>
            <p v-if="replyError" class="feedback-inline-error">
              {{ replyError }}
            </p>
            <div class="feedback-actions">
              <button
                class="button button-primary"
                type="submit"
                :disabled="isReplying || !replyDraft.trim()"
              >
                Send reply
                <span class="i-lucide-send size-5" aria-hidden="true" />
              </button>
            </div>
          </form>

          <div v-else class="feedback-locked-panel">
            <span class="i-lucide-lock-keyhole size-5" aria-hidden="true" />
            <p>Sign in with GitHub to join this conversation.</p>
            <a
              v-if="session?.auth.githubConfigured"
              class="button button-outline"
              :href="loginHref"
            >
              Sign in
              <span class="i-lucide-github size-5" aria-hidden="true" />
            </a>
          </div>

          <div v-if="user?.isAdmin" class="feedback-admin-bar">
            <div>
              <strong>Admin</strong>
              <span>{{ session?.feedback.issueRepo || 'GitHub issue sync' }}</span>
            </div>
            <button
              v-if="!item.issue"
              class="button button-outline"
              type="button"
              :disabled="isPromoting || !session?.feedback.issuePromotionConfigured"
              @click="promoteFeedback"
            >
              Promote to issue
              <span class="i-lucide-external-link size-5" aria-hidden="true" />
            </button>
            <a
              v-else
              class="button button-outline"
              :href="item.issue.url"
              target="_blank"
              rel="noreferrer"
            >
              Open issue
              <span class="i-lucide-external-link size-5" aria-hidden="true" />
            </a>
          </div>

          <p v-if="actionMessage" class="feedback-action-message">
            {{ actionMessage }}
          </p>
        </article>

        <div v-else class="feedback-state">
          Feedback not found.
        </div>
      </section>
    </main>

    <SiteFooter :links="footerLinks" />
  </div>
</template>

<style>
.feedback-page {
  --fb-bg: var(--background);
  --fb-panel: rgba(254, 254, 250, 0.84);
  --fb-panel-soft: rgba(240, 235, 229, 0.62);
  --fb-panel-strong: rgba(254, 254, 250, 0.92);
  --fb-border: rgba(222, 216, 207, 0.78);
  --fb-border-soft: rgba(222, 216, 207, 0.58);
  --fb-text: var(--foreground);
  --fb-muted: var(--muted-foreground);
  --fb-subtle: #918b7f;
  --fb-accent: var(--primary);
  --fb-accent-strong: #46573d;
  --fb-feature: var(--secondary);
  --fb-danger: var(--destructive);
  --fb-shadow: var(--soft-shadow);
  min-height: 100vh;
  overflow-x: hidden;
  background:
    radial-gradient(circle at 12% 7%, rgba(230, 220, 205, 0.78), transparent 26rem),
    radial-gradient(circle at 88% 12%, rgba(193, 140, 93, 0.16), transparent 22rem),
    var(--fb-bg);
  color: var(--fb-text);
}

.feedback-page button {
  cursor: pointer;
}

.feedback-page button:disabled,
.feedback-page .button[aria-disabled='true'] {
  cursor: not-allowed;
  opacity: 0.58;
  transform: none;
}

.feedback-page .button {
  min-height: 3rem;
  border-radius: 999px;
  padding: 0 0.85rem;
  font-size: 0.9rem;
}

.feedback-page .button-primary {
  background: var(--primary);
  color: var(--primary-foreground);
  box-shadow: var(--soft-shadow);
}

.feedback-page .button-primary:hover {
  box-shadow: 0 12px 28px -12px rgba(93, 112, 82, 0.5);
  transform: scale(1.045);
}

.feedback-page .button-outline {
  border: 1px solid rgba(93, 112, 82, 0.2);
  background: rgba(93, 112, 82, 0.08);
  color: var(--primary);
}

.feedback-shell {
  width: min(calc(100% - 2rem), 50rem);
  margin: 0 auto;
  padding: 7.5rem 0 4rem;
}

.feedback-detail {
  padding: 0;
}

.feedback-back {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  margin-bottom: 1rem;
  color: var(--fb-muted);
  font-size: 0.92rem;
  font-weight: 850;
  transition: color 200ms ease;
}

.feedback-back:hover {
  color: var(--fb-text);
}

.feedback-thread {
  display: grid;
  gap: 1.1rem;
  padding: 1.15rem;
  border: 1px solid var(--fb-border);
  border-radius: 1.65rem;
  background: var(--fb-panel);
  box-shadow: var(--fb-shadow);
}

.feedback-thread-header {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: start;
  gap: 1rem;
}

.feedback-thread-meta {
  min-width: 0;
}

.feedback-thread-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  margin-bottom: 0.75rem;
}

.feedback-thread-category,
.feedback-thread-status {
  display: inline-flex;
  align-items: center;
  min-height: 1.7rem;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 850;
}

.feedback-thread-category {
  border: 1px solid rgba(209, 177, 95, 0.16);
  background: rgba(209, 177, 95, 0.08);
  color: var(--fb-feature);
}

.feedback-thread-category-bug {
  border-color: rgba(235, 117, 109, 0.18);
  background: rgba(235, 117, 109, 0.08);
  color: var(--fb-danger);
}

.feedback-thread-status {
  border: 1px solid rgba(93, 112, 82, 0.16);
  background: rgba(93, 112, 82, 0.08);
  color: var(--fb-accent);
}

.feedback-thread-status-promoted {
  border-color: rgba(193, 140, 93, 0.18);
  background: rgba(193, 140, 93, 0.1);
  color: var(--secondary);
}

.feedback-thread h1 {
  margin: 0 0 0.5rem;
  font-family: var(--font-heading);
  color: var(--fb-text);
  font-size: 1.9rem;
  font-weight: 760;
  line-height: 1.12;
  overflow-wrap: anywhere;
}

.feedback-thread-meta > p {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  margin: 0;
  color: var(--fb-muted);
  font-size: 0.9rem;
  font-weight: 800;
}

.feedback-thread-avatar {
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 999px;
  object-fit: cover;
  border: 1px solid var(--fb-border);
}

.feedback-description {
  margin: 0;
  padding: 1.1rem;
  border: 1px solid var(--fb-border-soft);
  border-radius: 1.15rem;
  background: var(--fb-panel-soft);
  color: var(--fb-muted);
  line-height: 1.7;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.feedback-message-list {
  display: grid;
  gap: 0.85rem;
}

.feedback-message {
  display: grid;
  gap: 0.7rem;
  padding: 1rem;
  border: 1px solid var(--fb-border-soft);
  border-radius: 1.15rem;
  background: var(--fb-panel-soft);
}

.feedback-message p {
  margin: 0;
  line-height: 1.7;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.feedback-message-author {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

.feedback-message-author strong {
  display: block;
  color: var(--fb-text);
}

.feedback-message-author span {
  color: var(--fb-subtle);
  font-size: 0.84rem;
  font-weight: 800;
}

.feedback-message-avatar {
  width: 2rem;
  height: 2rem;
  border-radius: 999px;
  object-fit: cover;
  border: 1px solid var(--fb-border);
}

.feedback-reply-form {
  display: grid;
  gap: 0.8rem;
}

.feedback-field {
  display: grid;
  gap: 0.45rem;
  color: var(--fb-muted);
  font-weight: 900;
}

.feedback-field textarea {
  width: 100%;
  min-height: 6.5rem;
  resize: vertical;
  padding: 0.85rem 0.95rem;
  border: 1px solid var(--fb-border);
  border-radius: 1.1rem;
  background: rgba(255, 255, 255, 0.72);
  color: var(--fb-text);
  line-height: 1.5;
  outline: 0;
  transition: border-color 200ms ease, box-shadow 200ms ease, background 200ms ease;
}

.feedback-field textarea:focus {
  border-color: rgba(93, 112, 82, 0.72);
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 0 0 3px rgba(93, 112, 82, 0.16);
}

.feedback-actions,
.feedback-admin-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.feedback-admin-bar {
  border-top: 1px solid var(--fb-border-soft);
  padding-top: 1rem;
}

.feedback-admin-bar strong {
  display: block;
  color: var(--fb-text);
}

.feedback-admin-bar span {
  color: var(--fb-muted);
  font-size: 0.86rem;
  font-weight: 800;
}

.feedback-locked-panel {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border: 1px solid var(--fb-border-soft);
  border-radius: 1.15rem;
  background: var(--fb-panel-soft);
  color: var(--fb-accent);
}

.feedback-locked-panel p {
  margin: 0;
  color: var(--fb-muted);
  line-height: 1.55;
  font-weight: 800;
}

.feedback-state,
.feedback-empty,
.feedback-inline-error,
.feedback-action-message {
  margin: 0;
  padding: 1.2rem;
  border-radius: 1.15rem;
  line-height: 1.6;
}

.feedback-state,
.feedback-empty {
  border: 1px solid var(--fb-border);
  background: var(--fb-panel);
  color: var(--fb-muted);
  font-weight: 800;
}

.feedback-inline-error {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  border: 1px solid rgba(168, 84, 72, 0.2);
  background: rgba(168, 84, 72, 0.08);
  color: var(--fb-danger);
  font-weight: 850;
}

.feedback-action-message {
  border: 1px solid rgba(93, 112, 82, 0.2);
  background: rgba(93, 112, 82, 0.1);
  color: var(--primary);
  font-weight: 900;
}

@media (max-width: 760px) {
  .feedback-thread-header {
    grid-template-columns: 1fr;
  }

  .feedback-locked-panel {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 520px) {
  .feedback-shell {
    width: min(calc(100% - 2rem), 50rem);
    padding-top: 6.25rem;
  }

  .feedback-detail {
    padding-top: 0;
  }

  .feedback-thread {
    padding: 1rem;
  }

  .feedback-thread h1 {
    font-size: 1.75rem;
  }

  .feedback-actions .button,
  .feedback-admin-bar .button {
    width: 100%;
  }
}
</style>
