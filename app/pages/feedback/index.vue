<script setup lang="ts">
import { downloadHref, type NavItem } from '../../data/home'
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

const feedbackNavItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Features', href: '/#features' },
  { label: 'Download', href: '/#download' },
  { label: 'FAQ', href: '/#faq' },
]

const feedbackFooterLinks: NavItem[] = [
  { label: 'Features', href: '/#features' },
  { label: 'Download', href: '/#download' },
  { label: 'FAQ', href: '/#faq' },
]

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
    <AppHeader
      :nav-items="feedbackNavItems"
      :download-href="downloadHref"
      brand-href="/"
    />

    <main class="feedback-shell">
      <section class="feedback-hero section-shell" aria-labelledby="feedback-title">
        <div class="feedback-hero-copy">
          <p class="eyebrow">
            <span class="i-lucide-message-square size-[1.125rem]" aria-hidden="true" />
            Feedback community
          </p>
          <h1 id="feedback-title">Talk about Nora together.</h1>
          <p>
            Read every request, add your own context, and help the team decide
            what should become a tracked issue.
          </p>
        </div>

        <div class="feedback-hero-meta" aria-label="Feedback requirements">
          <div class="feedback-stat">
            <span class="i-lucide-messages-square size-5" aria-hidden="true" />
            Public discussion
          </div>
          <div class="feedback-stat">
            <span class="i-lucide-github size-5" aria-hidden="true" />
            GitHub login to post
          </div>
          <div class="feedback-stat">
            <span class="i-lucide-shield-check size-5" aria-hidden="true" />
            Admin issue sync
          </div>
        </div>
      </section>

      <section
        v-if="isLoadingSession"
        class="feedback-state section-shell"
        aria-live="polite"
      >
        Loading feedback...
      </section>

      <section v-else class="feedback-workspace section-shell">
        <div class="feedback-main">
          <FeedbackCreateCard
            ref="createCardRef"
            :github-configured="session?.auth.githubConfigured ?? false"
            @submit="handleCreate"
          />

          <div class="feedback-toolbar">
            <div class="feedback-tabs" role="tablist" aria-label="Sort feedback">
              <button
                v-for="tab in [
                  { value: 'new', label: 'New' },
                  { value: 'top', label: 'Top' },
                  { value: 'trending', label: 'Trending' },
                ]"
                :key="tab.value"
                class="feedback-tab"
                :class="{ 'feedback-tab-active': sort === tab.value }"
                type="button"
                role="tab"
                :aria-selected="sort === tab.value"
                @click="sort = tab.value as typeof sort"
              >
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
          :user="user"
          :contributors="contributors"
          :current-category="category"
          :github-configured="session?.auth.githubConfigured ?? false"
          @select-category="category = $event as typeof category"
          @sign-out="handleSignOut"
        />
      </section>
    </main>

    <SiteFooter :links="feedbackFooterLinks" />
  </div>
</template>

<style>
.feedback-page {
  min-height: 100vh;
  overflow-x: hidden;
  background:
    linear-gradient(180deg, rgba(240, 235, 229, 0.86), rgba(253, 252, 248, 0) 26rem),
    var(--background);
  color: var(--foreground);
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

.feedback-shell {
  padding-bottom: 3rem;
}

.feedback-hero {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 2rem;
  padding: 3rem 0 1.5rem;
}

.feedback-hero-copy {
  max-width: 42rem;
}

.feedback-hero h1 {
  max-width: 18ch;
  margin-bottom: 0.85rem;
  font-size: 2.8rem;
}

.feedback-hero p:not(.eyebrow) {
  margin-bottom: 0;
  color: var(--muted-foreground);
  font-size: 1.06rem;
  line-height: 1.72;
}

.feedback-hero-meta {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.7rem;
}

.feedback-stat {
  display: inline-flex;
  min-height: 3rem;
  align-items: center;
  gap: 0.55rem;
  padding: 0.72rem 0.95rem;
  border: 1px solid rgba(222, 216, 207, 0.78);
  border-radius: 999px;
  background: rgba(254, 254, 250, 0.78);
  color: var(--accent-foreground);
  font-weight: 900;
  box-shadow: var(--soft-shadow);
}

.feedback-state {
  display: grid;
  align-items: center;
  gap: 1.1rem;
  margin-top: 1rem;
  padding: 1.4rem;
  border: 1px solid rgba(222, 216, 207, 0.74);
  border-radius: 2.1rem;
  background: rgba(254, 254, 250, 0.86);
  box-shadow: var(--soft-shadow);
}

.feedback-workspace {
  display: grid;
  gap: 1.25rem;
  align-items: start;
  padding: 1rem 0 4rem;
}

.feedback-main {
  display: grid;
  gap: 1rem;
  min-width: 0;
}

.feedback-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0 0.1rem;
}

.feedback-tabs {
  display: inline-flex;
  gap: 0.25rem;
  padding: 0.25rem;
  border: 1px solid rgba(222, 216, 207, 0.78);
  border-radius: 999px;
  background: rgba(254, 254, 250, 0.78);
}

.feedback-tab {
  min-height: 2.4rem;
  padding: 0 1rem;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: var(--accent-foreground);
  font-size: 0.92rem;
  font-weight: 850;
  transition: background 200ms ease, color 200ms ease;
}

.feedback-tab:hover {
  background: rgba(93, 112, 82, 0.08);
  color: var(--primary);
}

.feedback-tab-active {
  background: rgba(93, 112, 82, 0.14);
  color: var(--primary);
  font-weight: 900;
}

.feedback-search {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0 0.9rem;
  border: 1px solid rgba(222, 216, 207, 0.9);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.72);
  color: var(--muted-foreground);
  min-height: 2.6rem;
  min-width: 14rem;
  transition: border-color 200ms ease, box-shadow 200ms ease;
}

.feedback-search input {
  flex: 1;
  min-width: 0;
  border: 0;
  background: transparent;
  color: var(--foreground);
  font-size: 0.94rem;
  outline: 0;
}

.feedback-search:focus-within {
  border-color: rgba(93, 112, 82, 0.72);
  box-shadow: 0 0 0 3px rgba(93, 112, 82, 0.16);
}

.feedback-list {
  display: grid;
  gap: 0.75rem;
}

.feedback-empty,
.feedback-inline-error,
.feedback-action-message {
  margin: 0;
  padding: 1rem;
  border-radius: 1.15rem;
  line-height: 1.6;
}

.feedback-empty {
  color: var(--muted-foreground);
  font-weight: 800;
  background: rgba(254, 254, 250, 0.78);
  border: 1px solid rgba(222, 216, 207, 0.74);
}

.feedback-inline-error {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  color: var(--destructive);
  font-weight: 850;
  background: rgba(168, 84, 72, 0.08);
}

.feedback-action-message {
  color: var(--primary);
  font-weight: 900;
  background: rgba(93, 112, 82, 0.1);
}

@media (min-width: 900px) {
  .feedback-workspace {
    grid-template-columns: minmax(0, 1fr) 20rem;
  }
}

@media (max-width: 760px) {
  .feedback-hero {
    display: grid;
    align-items: stretch;
    grid-template-columns: 1fr;
  }

  .feedback-hero-meta {
    justify-content: flex-start;
  }
}

@media (max-width: 520px) {
  .feedback-hero {
    padding-top: 2.35rem;
  }

  .feedback-hero h1 {
    font-size: 2.25rem;
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
