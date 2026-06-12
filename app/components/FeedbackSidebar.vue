<script setup lang="ts">
import type { FeedbackAuthor, FeedbackContributor } from '../../server/utils/feedback/types'

type UserWithAdmin = FeedbackAuthor & { isAdmin: boolean }

const props = defineProps<{
  user: UserWithAdmin | null
  contributors: FeedbackContributor[]
  currentCategory: string
  counts: {
    all: number
    feature: number
    bug: number
  }
  isSigningOut?: boolean
}>()

const emit = defineEmits<{
  (event: 'selectCategory', category: string): void
  (event: 'signOut'): void
}>()

const categories = [
  { value: 'all', label: 'View all posts', icon: 'i-lucide-messages-square' },
  { value: 'feature', label: 'Feature Request', icon: 'i-lucide-lightbulb' },
  { value: 'bug', label: 'Bug Reports', icon: 'i-lucide-bug' },
]

const boards = computed(() => {
  return categories.map((board) => ({
    ...board,
    count: props.counts[board.value as keyof typeof props.counts],
  }))
})
</script>

<template>
  <aside class="feedback-sidebar">
    <div v-if="user" class="sidebar-account">
      <img
        class="sidebar-account-avatar"
        :src="user.avatarUrl"
        alt=""
        width="36"
        height="36"
      >
      <div>
        <span>Signed in</span>
        <strong>@{{ user.login }}</strong>
      </div>
      <button
        class="sidebar-signout"
        type="button"
        aria-label="Sign out"
        :disabled="isSigningOut"
        @click="emit('signOut')"
      >
        <span class="i-lucide-log-out size-4" aria-hidden="true" />
      </button>
    </div>

    <div class="sidebar-section">
      <h3 class="sidebar-heading">Boards</h3>
      <nav aria-label="Feedback boards">
        <ul class="sidebar-boards">
          <li v-for="board in boards" :key="board.value">
            <button
              class="sidebar-board"
              :class="{ 'sidebar-board-active': currentCategory === board.value }"
              type="button"
              @click="emit('selectCategory', board.value)"
            >
              <span :class="`${board.icon} sidebar-board-icon`" aria-hidden="true" />
              <span>{{ board.label }}</span>
              <span class="sidebar-board-count">
                {{ board.count }}
              </span>
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
  gap: 1.25rem;
  border: 0;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
  padding: 0;
}

.sidebar-account {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 0.7rem;
  padding: 0.85rem;
  border: 1px solid var(--fb-border);
  border-radius: 1.15rem;
  background: var(--fb-panel);
  box-shadow: var(--fb-shadow);
}

.sidebar-account-avatar {
  width: 2.25rem;
  height: 2.25rem;
  border: 1px solid var(--fb-border);
  border-radius: 999px;
  object-fit: cover;
}

.sidebar-account span {
  display: block;
  color: var(--fb-muted);
  font-size: 0.78rem;
  font-weight: 800;
}

.sidebar-account strong {
  display: block;
  color: var(--fb-text);
  font-size: 0.9rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sidebar-signout {
  display: grid;
  width: 2.25rem;
  height: 2.25rem;
  place-items: center;
  border: 0;
  border-radius: 999px;
  background: rgba(93, 112, 82, 0.1);
  color: var(--primary);
}

.sidebar-signout:hover:not(:disabled) {
  background: rgba(93, 112, 82, 0.16);
}

.sidebar-section {
  display: grid;
  gap: 0.75rem;
  padding: 0;
}

.sidebar-heading {
  margin: 0;
  font-family: var(--font-heading);
  color: var(--fb-text);
  font-size: 1.04rem;
  font-weight: 760;
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
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 0.55rem;
  width: 100%;
  min-height: 2.35rem;
  padding: 0 0.7rem;
  border: 1px solid transparent;
  border-radius: 0.55rem;
  background: transparent;
  color: var(--fb-muted);
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
  border-color: var(--fb-border);
  background: var(--fb-panel);
  color: var(--primary);
  font-weight: 900;
}

.sidebar-board-icon {
  color: var(--fb-subtle);
}

.sidebar-board-active .sidebar-board-icon {
  color: var(--fb-accent);
}

.sidebar-board-count {
  color: var(--fb-subtle);
  font-size: 0.82rem;
}

.sidebar-contributor {
  display: grid;
  grid-template-columns: auto auto 1fr auto;
  align-items: center;
  gap: 0.55rem;
  min-height: 2.5rem;
  border-bottom: 1px solid var(--fb-border-soft);
  padding: 0.25rem 0;
}

.sidebar-rank {
  width: 1.25rem;
  color: var(--fb-subtle);
  font-size: 0.8rem;
  font-weight: 900;
  text-align: center;
}

.sidebar-contributor-avatar {
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 999px;
  object-fit: cover;
  border: 1px solid var(--fb-border);
}

.sidebar-contributor-name {
  color: var(--fb-muted);
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
  color: var(--fb-accent);
  font-size: 0.86rem;
  font-weight: 900;
}

.sidebar-empty {
  margin: 0;
  color: var(--fb-subtle);
  font-size: 0.9rem;
  line-height: 1.5;
  font-weight: 800;
}
</style>
