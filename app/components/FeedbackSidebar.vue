<script setup lang="ts">
import type { FeedbackAuthor, FeedbackContributor } from '../../server/utils/feedback/types'

type UserWithAdmin = FeedbackAuthor & { isAdmin: boolean }

const props = defineProps<{
  user: UserWithAdmin | null
  contributors: FeedbackContributor[]
  currentCategory: string
  githubConfigured: boolean
}>()

const emit = defineEmits<{
  (event: 'selectCategory', category: string): void
  (event: 'signOut'): void
}>()

const isLoggingOut = ref(false)

const loginHref = computed(() => {
  return `/api/auth/github?next=${encodeURIComponent('/feedback')}`
})

const categories = [
  { value: 'all', label: 'View all posts' },
  { value: 'feature', label: 'Feature Request' },
  { value: 'bug', label: 'Bug Reports' },
]

const handleSignOut = () => {
  isLoggingOut.value = true
  emit('signOut')
}
</script>

<template>
  <aside class="feedback-sidebar">
    <div v-if="user" class="sidebar-account">
      <img
        class="sidebar-avatar"
        :src="user.avatarUrl"
        alt=""
        width="44"
        height="44"
      >
      <div class="sidebar-account-info">
        <span class="sidebar-account-label">Signed in</span>
        <strong>@{{ user.login }}</strong>
      </div>
      <button
        class="sidebar-icon-button"
        type="button"
        aria-label="Sign out"
        :disabled="isLoggingOut"
        @click="handleSignOut"
      >
        <span class="i-lucide-log-out size-5" aria-hidden="true" />
      </button>
    </div>

    <div v-else class="sidebar-signin">
      <span class="sidebar-signin-icon i-lucide-github" aria-hidden="true" />
      <div>
        <strong>Join the discussion</strong>
        <p>Sign in to add feedback or reply.</p>
      </div>
      <a
        v-if="githubConfigured"
        class="button button-primary sidebar-signin-button"
        :href="loginHref"
      >
        Sign in
        <span class="i-lucide-github size-5" aria-hidden="true" />
      </a>
      <p v-else class="sidebar-alert">
        <span class="i-lucide-circle-alert size-5" aria-hidden="true" />
        GitHub OAuth is not configured.
      </p>
    </div>

    <div class="sidebar-section">
      <h3 class="sidebar-heading">Boards</h3>
      <nav aria-label="Feedback boards">
        <ul class="sidebar-boards">
          <li v-for="board in categories" :key="board.value">
            <button
              class="sidebar-board"
              :class="{ 'sidebar-board-active': currentCategory === board.value }"
              type="button"
              @click="emit('selectCategory', board.value)"
            >
              <span
                class="sidebar-board-dot"
                :class="`sidebar-board-dot-${board.value}`"
                aria-hidden="true"
              />
              {{ board.label }}
            </button>
          </li>
        </ul>
      </nav>
    </div>

    <div class="sidebar-section">
      <h3 class="sidebar-heading">Most helpful</h3>
      <ul v-if="contributors.length" class="sidebar-leaderboard">
        <li
          v-for="(contributor, index) in contributors"
          :key="contributor.id"
          class="sidebar-contributor"
        >
          <span class="sidebar-rank">{{ index + 1 }}</span>
          <img
            class="sidebar-contributor-avatar"
            :src="contributor.avatarUrl"
            alt=""
            width="28"
            height="28"
          >
          <span class="sidebar-contributor-name">@{{ contributor.login }}</span>
          <span class="sidebar-contributor-score">
            <span class="i-lucide-zap size-3.5" aria-hidden="true" />
            {{ contributor.score }}
          </span>
        </li>
      </ul>
      <p v-else class="sidebar-empty">No votes yet.</p>
    </div>
  </aside>
</template>

<style scoped>
.feedback-sidebar {
  display: grid;
  gap: 1rem;
}

.sidebar-account,
.sidebar-signin {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 0.75rem;
  padding: 0.9rem;
  border: 1px solid rgba(222, 216, 207, 0.74);
  border-radius: 1.25rem;
  background: rgba(254, 254, 250, 0.78);
}

.sidebar-signin {
  grid-template-columns: auto minmax(0, 1fr);
}

.sidebar-signin .button,
.sidebar-signin .sidebar-alert {
  grid-column: 1 / -1;
}

.sidebar-avatar {
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 999px;
  object-fit: cover;
  border: 1px solid rgba(222, 216, 207, 0.82);
}

.sidebar-account-info {
  display: grid;
  gap: 0.1rem;
}

.sidebar-account-label {
  color: var(--muted-foreground);
  font-size: 0.84rem;
  font-weight: 800;
}

.sidebar-account strong,
.sidebar-signin strong {
  color: var(--foreground);
  font-weight: 900;
}

.sidebar-signin-icon {
  display: grid;
  width: 2.75rem;
  height: 2.75rem;
  place-items: center;
  border-radius: 999px;
  background: var(--foreground);
  color: var(--primary-foreground);
  font-size: 1.35rem;
}

.sidebar-signin p,
.sidebar-empty {
  margin: 0;
  color: var(--muted-foreground);
  font-size: 0.9rem;
  line-height: 1.5;
  font-weight: 800;
}

.sidebar-icon-button {
  display: grid;
  width: 2.6rem;
  height: 2.6rem;
  place-items: center;
  border: 0;
  border-radius: 999px;
  background: rgba(93, 112, 82, 0.1);
  color: var(--primary);
  cursor: pointer;
  transition: background 220ms ease, transform 220ms ease;
}

.sidebar-icon-button:hover {
  background: rgba(93, 112, 82, 0.16);
}

.sidebar-icon-button:active {
  transform: scale(0.96);
}

.sidebar-icon-button:disabled {
  opacity: 0.58;
  cursor: not-allowed;
}

.sidebar-section {
  display: grid;
  gap: 0.75rem;
  padding: 0.9rem;
  border: 1px solid rgba(222, 216, 207, 0.74);
  border-radius: 1.25rem;
  background: rgba(254, 254, 250, 0.78);
}

.sidebar-heading {
  margin: 0;
  font-family: var(--font-heading);
  font-size: 1.05rem;
  font-weight: 760;
  color: var(--foreground);
}

.sidebar-boards,
.sidebar-leaderboard {
  display: grid;
  gap: 0.35rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.sidebar-board {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  width: 100%;
  padding: 0.6rem 0.55rem;
  border: 0;
  border-radius: 0.85rem;
  background: transparent;
  color: var(--accent-foreground);
  font-size: 0.94rem;
  font-weight: 800;
  text-align: left;
  cursor: pointer;
  transition: background 200ms ease, color 200ms ease;
}

.sidebar-board:hover {
  background: rgba(93, 112, 82, 0.08);
  color: var(--primary);
}

.sidebar-board-active {
  background: rgba(93, 112, 82, 0.12);
  color: var(--primary);
  font-weight: 900;
}

.sidebar-board-dot {
  width: 0.55rem;
  height: 0.55rem;
  border-radius: 999px;
  background: var(--muted-foreground);
}

.sidebar-board-dot-feature {
  background: var(--primary);
}

.sidebar-board-dot-bug {
  background: var(--destructive);
}

.sidebar-board-dot-all {
  background: var(--secondary);
}

.sidebar-contributor {
  display: grid;
  grid-template-columns: auto auto 1fr auto;
  align-items: center;
  gap: 0.55rem;
  padding: 0.35rem 0;
}

.sidebar-rank {
  width: 1.25rem;
  color: var(--muted-foreground);
  font-size: 0.8rem;
  font-weight: 900;
  text-align: center;
}

.sidebar-contributor-avatar {
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 999px;
  object-fit: cover;
  border: 1px solid rgba(222, 216, 207, 0.82);
}

.sidebar-contributor-name {
  color: var(--accent-foreground);
  font-size: 0.9rem;
  font-weight: 800;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sidebar-contributor-score {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  color: var(--secondary);
  font-size: 0.86rem;
  font-weight: 900;
}

.sidebar-alert {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  margin: 0;
  color: var(--destructive);
  font-weight: 850;
}

.sidebar-signin-button {
  min-height: 2.75rem;
  padding: 0 1rem;
  font-size: 0.95rem;
}
</style>
