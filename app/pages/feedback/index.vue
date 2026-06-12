<script setup lang="ts">
import type { FeedbackCategory, FeedbackContributor, FeedbackItem } from '../../server/utils/feedback/types'

type FeedbackUser = {
  id: number
  login: string
  name: string
  avatarUrl: string
  htmlUrl: string
  isAdmin: boolean
}

type SessionResponse = {
  user: FeedbackUser | null
  auth: {
    githubConfigured: boolean
  }
  feedback: {
    issuePromotionConfigured: boolean
    issueRepo: string
  }
}

const session = ref<SessionResponse | null>(null)
const items = ref<FeedbackItem[]>([])
const contributors = ref<FeedbackContributor[]>([])
const category = ref<'all' | FeedbackCategory>('all')
const sort = ref<'new' | 'top' | 'trending'>('new')
const search = ref('')
const isLoadingSession = ref(true)
const isLoadingItems = ref(false)
const isLoadingContributors = ref(false)
const isCreating = ref(false)
const isLoggingOut = ref(false)
const votingIds = ref<Set<string>>(new Set())
const pageError = ref('')
const actionMessage = ref('')

const createCardRef = ref<InstanceType<typeof FeedbackCreateCard> | null>(null)

const user = computed(() => session.value?.user ?? null)
const boardCounts = computed(() => {
  return {
    all: items.value.length,
    feature: items.value.filter((item) => item.category === 'feature').length,
    bug: items.value.filter((item) => item.category === 'bug').length,
  }
})

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

const loadSession = async () => {
  isLoadingSession.value = true
  pageError.value = ''

  try {
    session.value = await $fetch<SessionResponse>('/api/auth/session')
  } catch (error) {
    session.value = null
    pageError.value = getErrorMessage(error, 'Session could not be loaded.')
  } finally {
    isLoadingSession.value = false
  }
}

const loadItems = async () => {
  isLoadingItems.value = true
  pageError.value = ''

  try {
    const response = await $fetch<{ items: FeedbackItem[] }>('/api/feedback')
    items.value = response.items
  } catch (error) {
    pageError.value = getErrorMessage(error, 'Feedback could not be loaded.')
  } finally {
    isLoadingItems.value = false
  }
}

const loadContributors = async () => {
  isLoadingContributors.value = true

  try {
    const response = await $fetch<{ contributors: FeedbackContributor[] }>('/api/feedback/contributors')
    contributors.value = response.contributors
  } catch (error) {
    console.error(getErrorMessage(error, 'Contributors could not be loaded.'))
  } finally {
    isLoadingContributors.value = false
  }
}

const replaceItem = (item: FeedbackItem) => {
  const index = items.value.findIndex((existing) => existing.id === item.id)

  if (index === -1) {
    items.value.unshift(item)
  } else {
    items.value.splice(index, 1, item)
  }
}

const handleCreate = async (payload: {
  title: string
  description: string
  category: FeedbackCategory
}) => {
  if (isCreating.value) {
    return
  }

  pageError.value = ''
  actionMessage.value = ''

  if (!user.value) {
    pageError.value = 'Sign in with GitHub to add feedback.'
    return
  }

  isCreating.value = true

  try {
    const response = await $fetch<{ item: FeedbackItem }>('/api/feedback', {
      method: 'POST',
      body: payload,
    })

    replaceItem(response.item)
    createCardRef.value?.resetForm()
    actionMessage.value = 'Feedback added.'
    await navigateTo(`/feedback/${response.item.id}`)
  } catch (error) {
    pageError.value = getErrorMessage(error, 'Feedback could not be added.')
  } finally {
    isCreating.value = false
  }
}

const handleVote = async (item: FeedbackItem, value: 1 | -1) => {
  if (!user.value) {
    pageError.value = 'Sign in with GitHub to vote.'
    return
  }

  if (votingIds.value.has(item.id)) {
    return
  }

  votingIds.value.add(item.id)
  pageError.value = ''
  actionMessage.value = ''

  const nextValue = item.userVote === value ? 0 : value

  try {
    const response = await $fetch<{ item: FeedbackItem }>(
      `/api/feedback/${encodeURIComponent(item.id)}/vote`,
      {
        method: 'POST',
        body: { value: nextValue },
      },
    )

    replaceItem(response.item)
  } catch (error) {
    pageError.value = getErrorMessage(error, 'Vote could not be saved.')
  } finally {
    votingIds.value.delete(item.id)
  }
}

const handleSignOut = async () => {
  if (isLoggingOut.value) {
    return
  }

  isLoggingOut.value = true

  try {
    await $fetch('/api/auth/logout', { method: 'POST' })
    await loadSession()
    await loadItems()
  } finally {
    isLoggingOut.value = false
  }
}

const filteredItems = computed(() => {
  let result = [...items.value]

  if (category.value !== 'all') {
    result = result.filter((item) => item.category === category.value)
  }

  const query = search.value.trim().toLowerCase()
  if (query) {
    result = result.filter(
      (item) =>
        item.title.toLowerCase().includes(query)
        || item.description.toLowerCase().includes(query),
    )
  }

  if (sort.value === 'top') {
    result.sort((a, b) => {
      if (b.voteScore !== a.voteScore) {
        return b.voteScore - a.voteScore
      }
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    })
  } else if (sort.value === 'trending') {
    const now = Date.now()
    const score = (item: FeedbackItem) => {
      const hours = Math.max(1, (now - new Date(item.createdAt).getTime()) / 36e5)
      return item.voteScore / Math.pow(hours + 2, 1.5)
    }
    result.sort((a, b) => score(b) - score(a))
  } else {
    result.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
  }

  return result
})

useHead({
  title: 'Feedback - Nora',
  meta: [
    {
      name: 'description',
      content: 'Share Nora feedback and discuss requests with the team.',
    },
  ],
})

onMounted(async () => {
  await loadSession()
  await Promise.all([loadItems(), loadContributors()])
})
</script>

<template>
  <div id="top" class="feedback-page">
    <FeedbackCommunityHeader
      :user="user"
      :github-configured="session?.auth.githubConfigured ?? false"
      :is-signing-out="isLoggingOut"
      @sign-out="handleSignOut"
    />

    <main class="feedback-shell">
      <section v-if="isLoadingSession" class="feedback-state" aria-live="polite">
        Loading feedback...
      </section>

      <section v-else class="feedback-workspace">
        <div class="feedback-main">
          <FeedbackCreateCard
            ref="createCardRef"
            :can-post="Boolean(user)"
            :github-configured="session?.auth.githubConfigured ?? false"
            @submit="handleCreate"
          />

          <div class="feedback-toolbar">
            <div class="feedback-tabs" role="tablist" aria-label="Sort feedback">
              <button
                v-for="tab in [
                  { value: 'new', label: 'New', icon: 'i-lucide-clock-3' },
                  { value: 'top', label: 'Top', icon: 'i-lucide-arrow-up-right' },
                  { value: 'trending', label: 'Trending', icon: 'i-lucide-flame' },
                ]"
                :key="tab.value"
                class="feedback-tab"
                :class="{ 'feedback-tab-active': sort === tab.value }"
                type="button"
                role="tab"
                :aria-selected="sort === tab.value"
                @click="sort = tab.value as typeof sort"
              >
                <span :class="`${tab.icon} size-4`" aria-hidden="true" />
                {{ tab.label }}
              </button>
            </div>

            <label class="feedback-search">
              <span class="i-lucide-search size-4" aria-hidden="true" />
              <input
                v-model="search"
                type="search"
                placeholder="Search feedback..."
                autocomplete="off"
              >
            </label>
          </div>

          <p v-if="pageError" class="feedback-inline-error">
            {{ pageError }}
          </p>

          <p v-if="actionMessage" class="feedback-action-message">
            {{ actionMessage }}
          </p>

          <div v-if="isLoadingItems && !items.length" class="feedback-empty">
            Loading feedback...
          </div>

          <div v-else-if="filteredItems.length" class="feedback-list">
            <FeedbackListItem
              v-for="item in filteredItems"
              :key="item.id"
              :item="item"
              :disabled-vote="votingIds.has(item.id) || !user"
              @vote="handleVote"
            />
          </div>

          <p v-else-if="items.length" class="feedback-empty">
            No feedback matches your filters.
          </p>

          <p v-else class="feedback-empty">
            No feedback yet.
          </p>
        </div>

        <FeedbackSidebar
          :contributors="contributors"
          :current-category="category"
          :counts="boardCounts"
          @select-category="category = $event as typeof category"
        />
      </section>
    </main>
  </div>
</template>

<style>
.feedback-page {
  --fb-bg: #101218;
  --fb-panel: #1a1d26;
  --fb-panel-soft: #151820;
  --fb-panel-strong: #20242f;
  --fb-border: #2b303d;
  --fb-border-soft: #202531;
  --fb-text: #f1f3f8;
  --fb-muted: #a7adba;
  --fb-subtle: #747c8c;
  --fb-accent: #a8bd79;
  --fb-accent-strong: #d2e59b;
  --fb-feature: #d1b15f;
  --fb-danger: #eb756d;
  --fb-shadow: 0 22px 70px rgba(0, 0, 0, 0.34);
  min-height: 100vh;
  overflow-x: hidden;
  background: var(--fb-bg);
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
  min-height: 2.4rem;
  border-radius: 0.65rem;
  padding: 0 0.85rem;
  font-size: 0.9rem;
}

.feedback-page .button-primary {
  background: var(--fb-text);
  color: var(--fb-bg);
  box-shadow: none;
}

.feedback-page .button-primary:hover {
  box-shadow: none;
  transform: none;
}

.feedback-page .button-outline {
  border: 1px solid var(--fb-border);
  background: var(--fb-panel-strong);
  color: var(--fb-text);
}

.feedback-shell {
  width: min(100% - 2rem, 64rem);
  margin: 0 auto;
  padding: 2rem 0 4rem;
}

.feedback-state {
  display: grid;
  align-items: center;
  gap: 1.1rem;
  padding: 1.4rem;
  border: 1px solid var(--fb-border);
  border-radius: 0.85rem;
  background: var(--fb-panel);
  color: var(--fb-muted);
}

.feedback-workspace {
  display: grid;
  gap: 1.5rem;
  align-items: start;
}

.feedback-main {
  display: grid;
  gap: 0.85rem;
  min-width: 0;
}

.feedback-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0;
}

.feedback-tabs {
  display: inline-flex;
  gap: 0.45rem;
}

.feedback-tab {
  display: inline-flex;
  min-height: 2.55rem;
  align-items: center;
  gap: 0.4rem;
  border: 1px solid var(--fb-border);
  border-radius: 0.65rem;
  background: var(--fb-panel-soft);
  color: var(--fb-muted);
  padding: 0 0.8rem;
  font-size: 0.92rem;
  font-weight: 850;
  transition: border-color 200ms ease, background 200ms ease, color 200ms ease;
}

.feedback-tab:hover {
  border-color: rgba(168, 189, 121, 0.38);
  color: var(--fb-text);
}

.feedback-tab-active {
  border-color: rgba(168, 189, 121, 0.45);
  background: var(--fb-panel-strong);
  color: var(--fb-text);
  font-weight: 900;
}

.feedback-search {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  min-height: 2.55rem;
  min-width: 14rem;
  border: 1px solid var(--fb-border);
  border-radius: 0.65rem;
  background: var(--fb-panel-soft);
  color: var(--fb-subtle);
  padding: 0 0.8rem;
  transition: border-color 200ms ease, background 200ms ease;
}

.feedback-search input {
  flex: 1;
  min-width: 0;
  border: 0;
  background: transparent;
  color: var(--fb-text);
  font-size: 0.94rem;
  outline: 0;
}

.feedback-search input::placeholder {
  color: var(--fb-subtle);
}

.feedback-search:focus-within {
  border-color: rgba(168, 189, 121, 0.42);
  background: var(--fb-panel);
}

.feedback-list {
  display: grid;
  overflow: hidden;
  border: 1px solid var(--fb-border);
  border-radius: 0.75rem;
  background: var(--fb-panel);
  box-shadow: var(--fb-shadow);
}

.feedback-empty,
.feedback-inline-error,
.feedback-action-message {
  margin: 0;
  padding: 1rem;
  border-radius: 0.75rem;
  line-height: 1.6;
}

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
  border: 1px solid rgba(235, 117, 109, 0.28);
  background: rgba(235, 117, 109, 0.1);
  color: var(--fb-danger);
  font-weight: 850;
}

.feedback-action-message {
  border: 1px solid rgba(168, 189, 121, 0.28);
  background: rgba(168, 189, 121, 0.1);
  color: var(--fb-accent-strong);
  font-weight: 900;
}

@media (min-width: 900px) {
  .feedback-workspace {
    grid-template-columns: minmax(0, 1fr) 17.5rem;
  }
}

@media (max-width: 520px) {
  .feedback-shell {
    width: min(100% - 1rem, 64rem);
    padding-top: 1rem;
  }

  .feedback-toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .feedback-tabs {
    width: 100%;
  }

  .feedback-tab {
    flex: 1 1 0;
  }

  .feedback-search {
    width: 100%;
    min-width: 0;
  }
}
</style>
