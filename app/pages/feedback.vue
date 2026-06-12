<script setup lang="ts">
import { downloadHref, type NavItem } from '../data/home'

type FeedbackUser = {
  id: number
  login: string
  name: string
  avatarUrl: string
  htmlUrl: string
  isAdmin: boolean
}

type FeedbackAuthor = Omit<FeedbackUser, 'isAdmin'>

type FeedbackMessage = {
  id: string
  body: string
  createdAt: string
  author: FeedbackAuthor
}

type FeedbackItem = {
  id: string
  title: string
  description: string
  status: 'open' | 'promoted'
  createdAt: string
  updatedAt: string
  author: FeedbackAuthor
  messages: FeedbackMessage[]
  issue: {
    repo: string
    number: number
    url: string
    createdAt: string
  } | null
}

type FeedbackAdmin = {
  login: string
  createdAt: string
  createdByLogin: string | null
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

type AdminStateResponse = {
  admins: FeedbackAdmin[]
  users: FeedbackAuthor[]
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
const admins = ref<FeedbackAdmin[]>([])
const knownUsers = ref<FeedbackAuthor[]>([])
const selectedId = ref<string | null>(null)
const isLoadingSession = ref(true)
const isLoadingFeedback = ref(false)
const isLoadingAdmins = ref(false)
const isCreating = ref(false)
const isReplying = ref(false)
const isAddingAdmin = ref(false)
const isLoggingOut = ref(false)
const promotingId = ref<string | null>(null)
const formError = ref('')
const replyError = ref('')
const adminError = ref('')
const pageError = ref('')
const actionMessage = ref('')

const newFeedback = reactive({
  title: '',
  description: '',
})
const replyDraft = ref('')
const adminLoginDraft = ref('')

const loginHref = computed(() => {
  return `/api/auth/github?next=${encodeURIComponent('/feedback')}`
})
const user = computed(() => session.value?.user ?? null)
const selectedFeedback = computed(() => {
  return items.value.find((item) => item.id === selectedId.value) ?? null
})
const adminLoginSet = computed(() => {
  return new Set(admins.value.map((admin) => admin.login.toLowerCase()))
})
const availableAdminUsers = computed(() => {
  return knownUsers.value.filter((knownUser) => {
    return !adminLoginSet.value.has(knownUser.login.toLowerCase())
  })
})

const formatDate = (value: string) => {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

const sortFeedbackItems = () => {
  items.value = [...items.value].sort((firstItem, secondItem) => {
    return (
      new Date(secondItem.updatedAt).getTime() -
      new Date(firstItem.updatedAt).getTime()
    )
  })
}

const normalizeLogin = (value: string) => {
  return value.trim().replace(/^@/, '').toLowerCase()
}

const syncSelectedFeedback = () => {
  if (selectedId.value && items.value.some((item) => item.id === selectedId.value)) {
    return
  }

  selectedId.value = items.value[0]?.id ?? null
}

const getErrorMessage = (error: unknown, fallback: string) => {
  const fetchError = error as {
    data?: { statusMessage?: string; message?: string }
    statusMessage?: string
    message?: string
  }

  return (
    fetchError.data?.statusMessage ||
    fetchError.data?.message ||
    fetchError.statusMessage ||
    fetchError.message ||
    fallback
  )
}

const replaceFeedbackItem = (item: FeedbackItem) => {
  const index = items.value.findIndex((feedbackItem) => feedbackItem.id === item.id)

  if (index === -1) {
    items.value.unshift(item)
  } else {
    items.value.splice(index, 1, item)
  }

  sortFeedbackItems()
  syncSelectedFeedback()
}

const loadFeedback = async () => {
  isLoadingFeedback.value = true
  pageError.value = ''

  try {
    const response = await $fetch<{ items: FeedbackItem[] }>('/api/feedback')

    items.value = response.items
    sortFeedbackItems()
    syncSelectedFeedback()
  } catch (error) {
    pageError.value = getErrorMessage(error, 'Feedback could not be loaded.')
  } finally {
    isLoadingFeedback.value = false
  }
}

const loadAdmins = async () => {
  if (!user.value?.isAdmin) {
    admins.value = []
    knownUsers.value = []
    return
  }

  isLoadingAdmins.value = true
  adminError.value = ''

  try {
    const response = await $fetch<AdminStateResponse>('/api/feedback/admins')

    admins.value = response.admins
    knownUsers.value = response.users
  } catch (error) {
    adminError.value = getErrorMessage(error, 'Admins could not be loaded.')
  } finally {
    isLoadingAdmins.value = false
  }
}

const loadSession = async () => {
  isLoadingSession.value = true
  pageError.value = ''

  try {
    session.value = await $fetch<SessionResponse>('/api/auth/session')
  } catch (error) {
    session.value = null
    pageError.value = getErrorMessage(error, 'Session could not be loaded.')
  }

  await loadFeedback()

  try {
    if (session.value?.user?.isAdmin) {
      await loadAdmins()
    } else {
      admins.value = []
      knownUsers.value = []
    }
  } catch (error) {
    adminError.value = getErrorMessage(error, 'Admins could not be loaded.')
  } finally {
    isLoadingSession.value = false
  }
}

const createFeedback = async () => {
  if (isCreating.value) {
    return
  }

  formError.value = ''
  actionMessage.value = ''

  if (!user.value) {
    formError.value = 'Sign in with GitHub to add feedback.'
    return
  }

  isCreating.value = true

  try {
    const response = await $fetch<{ item: FeedbackItem }>('/api/feedback', {
      method: 'POST',
      body: {
        title: newFeedback.title,
        description: newFeedback.description,
      },
    })

    newFeedback.title = ''
    newFeedback.description = ''
    replaceFeedbackItem(response.item)
    selectedId.value = response.item.id
    actionMessage.value = 'Feedback added.'
  } catch (error) {
    formError.value = getErrorMessage(error, 'Feedback could not be added.')
  } finally {
    isCreating.value = false
  }
}

const addAdmin = async () => {
  if (isAddingAdmin.value) {
    return
  }

  const login = normalizeLogin(adminLoginDraft.value)

  adminError.value = ''
  actionMessage.value = ''

  if (!login) {
    adminError.value = 'GitHub username is required.'
    return
  }

  isAddingAdmin.value = true

  try {
    const response = await $fetch<{ admins: FeedbackAdmin[] }>(
      '/api/feedback/admins',
      {
        method: 'POST',
        body: {
          login,
        },
      },
    )

    admins.value = response.admins
    adminLoginDraft.value = ''
    actionMessage.value = `@${login} is now an admin.`
  } catch (error) {
    adminError.value = getErrorMessage(error, 'Admin could not be added.')
  } finally {
    isAddingAdmin.value = false
  }
}

const addReply = async () => {
  if (!selectedFeedback.value || isReplying.value) {
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
      `/api/feedback/${encodeURIComponent(selectedFeedback.value.id)}/messages`,
      {
        method: 'POST',
        body: {
          body: replyDraft.value,
        },
      },
    )

    replyDraft.value = ''
    replaceFeedbackItem(response.item)
    selectedId.value = response.item.id
    actionMessage.value = 'Reply added.'
  } catch (error) {
    replyError.value = getErrorMessage(error, 'Reply could not be added.')
  } finally {
    isReplying.value = false
  }
}

const promoteFeedback = async (item: FeedbackItem) => {
  if (promotingId.value) {
    return
  }

  actionMessage.value = ''
  pageError.value = ''
  promotingId.value = item.id

  try {
    const response = await $fetch<{
      item: FeedbackItem
      issue: NonNullable<FeedbackItem['issue']>
    }>(`/api/feedback/${encodeURIComponent(item.id)}/promote`, {
      method: 'POST',
    })

    replaceFeedbackItem(response.item)
    selectedId.value = response.item.id
    actionMessage.value = `Issue #${response.issue.number} created in ${response.issue.repo}.`
  } catch (error) {
    pageError.value = getErrorMessage(error, 'Feedback could not be promoted.')
  } finally {
    promotingId.value = null
  }
}

const logout = async () => {
  if (isLoggingOut.value) {
    return
  }

  isLoggingOut.value = true

  try {
    await $fetch('/api/auth/logout', {
      method: 'POST',
    })
    await loadSession()
  } finally {
    isLoggingOut.value = false
  }
}

useHead({
  title: 'Feedback - Nora',
  meta: [
    {
      name: 'description',
      content: 'Share Nora feedback and discuss requests with the team.',
    },
  ],
})

onMounted(loadSession)
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
        <aside class="feedback-sidebar" aria-label="Feedback list and new feedback">
          <div v-if="user" class="feedback-account">
            <img
              class="feedback-avatar"
              :src="user.avatarUrl"
              alt=""
              width="44"
              height="44"
            >
            <div>
              <span>Signed in</span>
              <strong>@{{ user.login }}</strong>
            </div>
            <button
              class="feedback-icon-button"
              type="button"
              aria-label="Sign out"
              :disabled="isLoggingOut"
              @click="logout"
            >
              <span class="i-lucide-log-out size-5" aria-hidden="true" />
            </button>
          </div>

          <div v-else class="feedback-community-card">
            <span class="feedback-community-icon i-lucide-github" aria-hidden="true" />
            <div>
              <strong>Join the discussion</strong>
              <p>Sign in to add feedback or reply.</p>
            </div>
            <a
              v-if="session?.auth.githubConfigured"
              class="button button-primary"
              :href="loginHref"
            >
              Sign in
              <span class="i-lucide-github size-5" aria-hidden="true" />
            </a>
            <p v-else class="feedback-alert">
              <span class="i-lucide-circle-alert size-5" aria-hidden="true" />
              GitHub OAuth is not configured.
            </p>
          </div>

          <form v-if="user" class="feedback-form" @submit.prevent="createFeedback">
            <label class="feedback-field">
              <span>Title</span>
              <input
                v-model="newFeedback.title"
                name="title"
                maxlength="140"
                autocomplete="off"
                placeholder="Short summary"
              >
            </label>
            <label class="feedback-field">
              <span>Details</span>
              <textarea
                v-model="newFeedback.description"
                name="description"
                rows="5"
                maxlength="4000"
                placeholder="What should change?"
              />
            </label>
            <p v-if="formError" class="feedback-inline-error">
              {{ formError }}
            </p>
            <button
              class="button button-primary feedback-submit"
              type="submit"
              :disabled="isCreating || !newFeedback.title.trim() || !newFeedback.description.trim()"
            >
              Add feedback
              <span class="i-lucide-plus size-5" aria-hidden="true" />
            </button>
          </form>

          <div v-else class="feedback-locked-panel">
            <span class="i-lucide-lock-keyhole size-5" aria-hidden="true" />
            <p>Sign in with GitHub to start a new feedback thread.</p>
          </div>

          <div v-if="user?.isAdmin" class="feedback-admin-panel">
            <div class="feedback-list-head">
              <span>Admins</span>
              <button
                class="feedback-icon-button"
                type="button"
                aria-label="Refresh admins"
                :disabled="isLoadingAdmins"
                @click="loadAdmins"
              >
                <span class="i-lucide-refresh-cw size-5" aria-hidden="true" />
              </button>
            </div>

            <form class="feedback-admin-form" @submit.prevent="addAdmin">
              <label class="feedback-field feedback-admin-input">
                <span>GitHub username</span>
                <input
                  v-model="adminLoginDraft"
                  name="admin-login"
                  list="feedback-known-users"
                  maxlength="39"
                  autocomplete="off"
                  placeholder="github-login"
                >
              </label>
              <datalist id="feedback-known-users">
                <option
                  v-for="knownUser in availableAdminUsers"
                  :key="knownUser.id"
                  :value="knownUser.login"
                >
                  @{{ knownUser.login }}
                </option>
              </datalist>
              <button
                class="button button-outline feedback-admin-add"
                type="submit"
                :disabled="isAddingAdmin || !adminLoginDraft.trim()"
              >
                Add
                <span class="i-lucide-user-plus size-5" aria-hidden="true" />
              </button>
            </form>

            <p v-if="adminError" class="feedback-inline-error">
              {{ adminError }}
            </p>

            <div v-if="admins.length" class="feedback-admin-list">
              <span
                v-for="admin in admins"
                :key="admin.login"
              >
                @{{ admin.login }}
              </span>
            </div>
            <p v-else class="feedback-empty">
              No admins yet.
            </p>
          </div>

          <div class="feedback-list-head">
            <span>{{ items.length }} feedback</span>
            <button
              class="feedback-icon-button"
              type="button"
              aria-label="Refresh feedback"
              :disabled="isLoadingFeedback"
              @click="loadFeedback"
            >
              <span class="i-lucide-refresh-cw size-5" aria-hidden="true" />
            </button>
          </div>

          <p v-if="pageError" class="feedback-inline-error">
            {{ pageError }}
          </p>

          <p v-if="isLoadingFeedback && !items.length" class="feedback-empty">
            Loading feedback...
          </p>

          <div v-else-if="items.length" class="feedback-list">
            <button
              v-for="item in items"
              :key="item.id"
              class="feedback-list-item"
              :class="{ 'feedback-list-item-active': selectedId === item.id }"
              type="button"
              @click="selectedId = item.id"
            >
              <span class="feedback-list-item-header">
                <span class="feedback-list-title">{{ item.title }}</span>
                <span
                  class="feedback-status"
                  :class="`feedback-status-${item.status}`"
                >
                  {{ item.status === 'promoted' ? 'Issue' : 'Open' }}
                </span>
              </span>
              <span class="feedback-list-meta">
                @{{ item.author.login }} · {{ item.messages.length }} replies ·
                {{ formatDate(item.updatedAt) }}
              </span>
            </button>
          </div>

          <p v-else class="feedback-empty">
            No feedback yet.
          </p>
        </aside>

        <section class="feedback-detail" aria-live="polite">
          <div v-if="selectedFeedback" class="feedback-thread">
            <header class="feedback-thread-header">
              <div>
                <span
                  class="feedback-status"
                  :class="`feedback-status-${selectedFeedback.status}`"
                >
                  {{ selectedFeedback.status === 'promoted' ? 'Promoted' : 'Open' }}
                </span>
                <h2>{{ selectedFeedback.title }}</h2>
                <p>
                  @{{ selectedFeedback.author.login }} ·
                  {{ formatDate(selectedFeedback.createdAt) }}
                </p>
              </div>
              <a
                v-if="selectedFeedback.issue"
                class="feedback-issue-link"
                :href="selectedFeedback.issue.url"
                target="_blank"
                rel="noreferrer"
              >
                #{{ selectedFeedback.issue.number }}
                <span class="i-lucide-external-link size-4" aria-hidden="true" />
              </a>
            </header>

            <p class="feedback-description">
              {{ selectedFeedback.description }}
            </p>

            <div v-if="selectedFeedback.messages.length" class="feedback-message-list">
              <article
                v-for="message in selectedFeedback.messages"
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
            <p v-else class="feedback-empty">
              No replies yet.
            </p>

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

            <div v-else class="feedback-locked-panel feedback-thread-login">
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
                <span>
                  {{ session?.feedback.issueRepo || 'GitHub issue sync' }}
                </span>
              </div>
              <button
                v-if="!selectedFeedback.issue"
                class="button button-outline"
                type="button"
                :disabled="promotingId === selectedFeedback.id || !session?.feedback.issuePromotionConfigured"
                @click="promoteFeedback(selectedFeedback)"
              >
                Promote to issue
                <span class="i-lucide-external-link size-5" aria-hidden="true" />
              </button>
              <a
                v-else
                class="button button-outline"
                :href="selectedFeedback.issue.url"
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
          </div>

          <div v-else class="feedback-detail-empty">
            <span class="i-lucide-user-circle size-10" aria-hidden="true" />
            <p>Select feedback to read the discussion.</p>
          </div>
        </section>
      </section>
    </main>

    <SiteFooter :links="feedbackFooterLinks" />
  </div>
</template>
