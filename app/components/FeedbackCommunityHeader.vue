<script setup lang="ts">
import type { FeedbackAuthor } from '../../server/utils/feedback/types'

type UserWithAdmin = FeedbackAuthor & { isAdmin: boolean }

defineProps<{
  user: UserWithAdmin | null
  githubConfigured: boolean
  isSigningOut?: boolean
}>()

const emit = defineEmits<{
  (event: 'signOut'): void
}>()

const route = useRoute()

const loginHref = computed(() => {
  return `/api/auth/github?next=${encodeURIComponent(route.fullPath || '/feedback')}`
})
</script>

<template>
  <header class="community-header">
    <div class="community-header-inner">
      <div class="community-header-top">
        <NuxtLink class="community-brand" to="/">
          <span class="community-brand-mark" aria-hidden="true">
            <img src="/default/icon_128x128.png" alt="" width="28" height="28">
          </span>
          <span>Nora</span>
        </NuxtLink>

        <div class="community-auth">
          <div v-if="user" class="community-user">
            <img
              class="community-user-avatar"
              :src="user.avatarUrl"
              alt=""
              width="24"
              height="24"
            >
            <span>@{{ user.login }}</span>
            <button
              type="button"
              :disabled="isSigningOut"
              @click="emit('signOut')"
            >
              Sign out
            </button>
          </div>
          <a
            v-else-if="githubConfigured"
            class="community-login"
            :href="loginHref"
          >
            Sign in / Sign up
          </a>
          <span v-else class="community-login-disabled">
            GitHub OAuth missing
          </span>
        </div>
      </div>

      <nav class="community-tabs" aria-label="Feedback sections">
        <NuxtLink class="community-tab community-tab-active" to="/feedback">
          <span class="i-lucide-inbox size-4" aria-hidden="true" />
          Feedback
        </NuxtLink>
        <span class="community-tab community-tab-muted">
          <span class="i-lucide-map size-4" aria-hidden="true" />
          Roadmap
        </span>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.community-header {
  border-bottom: 1px solid var(--fb-border-soft);
  background: rgba(16, 18, 24, 0.92);
}

.community-header-inner {
  width: min(100% - 2rem, 64rem);
  margin: 0 auto;
}

.community-header-top {
  display: flex;
  min-height: 4.25rem;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.community-brand {
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  color: var(--fb-text);
  font-size: 1.18rem;
  font-weight: 850;
  text-decoration: none;
}

.community-brand-mark {
  display: grid;
  width: 2rem;
  height: 2rem;
  place-items: center;
  overflow: hidden;
  border: 1px solid var(--fb-border);
  border-radius: 0.55rem;
  background: var(--fb-text);
}

.community-brand-mark img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.community-auth {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  min-width: 0;
}

.community-login,
.community-login-disabled,
.community-user {
  display: inline-flex;
  min-height: 2.35rem;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid var(--fb-border);
  border-radius: 999px;
  background: var(--fb-panel);
  color: var(--fb-muted);
  padding: 0 0.85rem;
  font-size: 0.88rem;
  font-weight: 800;
  text-decoration: none;
}

.community-login:hover {
  border-color: rgba(145, 166, 113, 0.45);
  color: var(--fb-text);
}

.community-login-disabled {
  color: var(--fb-danger);
}

.community-user {
  padding-left: 0.45rem;
}

.community-user-avatar {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 999px;
  object-fit: cover;
}

.community-user button {
  min-height: 1.8rem;
  border: 0;
  border-left: 1px solid var(--fb-border);
  background: transparent;
  color: var(--fb-muted);
  padding: 0 0 0 0.55rem;
  font-weight: 800;
}

.community-user button:hover:not(:disabled) {
  color: var(--fb-text);
}

.community-tabs {
  display: flex;
  align-items: flex-end;
  gap: 0.8rem;
  min-height: 2.65rem;
}

.community-tab {
  display: inline-flex;
  min-height: 2.65rem;
  align-items: center;
  gap: 0.45rem;
  border: 1px solid transparent;
  border-bottom: 0;
  border-radius: 0.75rem 0.75rem 0 0;
  color: var(--fb-muted);
  padding: 0 0.85rem;
  font-size: 0.94rem;
  font-weight: 850;
  text-decoration: none;
}

.community-tab-active {
  border-color: var(--fb-border-soft);
  background: var(--fb-bg);
  color: var(--fb-text);
}

.community-tab-muted {
  opacity: 0.72;
}

@media (max-width: 520px) {
  .community-header-inner {
    width: min(100% - 1rem, 64rem);
  }

  .community-header-top {
    min-height: 3.75rem;
  }

  .community-brand {
    font-size: 1.05rem;
  }

  .community-user span {
    display: none;
  }
}
</style>
