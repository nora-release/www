<script setup lang="ts">
import type { FeedbackItem } from '../../server/utils/feedback/types'

const props = defineProps<{
  item: FeedbackItem
  disabledVote?: boolean
}>()

const emit = defineEmits<{
  (event: 'vote', item: FeedbackItem, value: 1 | -1): void
}>()

const formatDate = (value: string) => {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
  }).format(new Date(value))
}

const excerpt = computed(() => {
  const maxLength = 140
  const text = props.item.description.replace(/\s+/g, ' ').trim()
  return text.length > maxLength ? `${text.slice(0, maxLength).trim()}…` : text
})

const categoryLabel = computed(() => {
  return props.item.category === 'bug' ? 'Bug Reports' : 'Feature Request'
})

const handleVote = (value: 1 | -1) => {
  emit('vote', props.item, value)
}
</script>

<template>
  <article class="feedback-card">
    <NuxtLink class="feedback-card-main" :to="`/feedback/${item.id}`">
      <div class="feedback-card-content">
        <div class="feedback-card-header">
          <h3 class="feedback-card-title">{{ item.title }}</h3>
          <div class="feedback-card-pills">
            <span class="feedback-card-category">{{ categoryLabel }}</span>
            <span
              class="feedback-card-status"
              :class="`feedback-card-status-${item.status}`"
            >
              {{ item.status === 'promoted' ? 'Issue' : 'Open' }}
            </span>
          </div>
        </div>
        <p class="feedback-card-excerpt">{{ excerpt }}</p>

        <div class="feedback-card-meta">
          <img
            class="feedback-card-avatar"
            :src="item.author.avatarUrl"
            alt=""
            width="22"
            height="22"
          >
          <span class="feedback-card-author">@{{ item.author.login }}</span>
          <span aria-hidden="true">·</span>
          <span>{{ formatDate(item.createdAt) }}</span>
          <span aria-hidden="true">·</span>
          <span class="feedback-card-replies">
            <span class="i-lucide-message-square size-3.5" aria-hidden="true" />
            {{ item.messages.length }}
          </span>
        </div>
      </div>
    </NuxtLink>

    <FeedbackVoteColumn
      class="feedback-card-vote"
      :score="item.voteScore"
      :user-vote="item.userVote"
      :disabled="disabledVote"
      @vote="handleVote"
    />
  </article>
</template>

<style scoped>
.feedback-card {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 0.75rem;
  align-items: start;
  border: 1px solid rgba(222, 216, 207, 0.74);
  border-radius: 1.4rem 1.8rem 1.6rem 1.3rem;
  background: rgba(255, 255, 255, 0.68);
  padding: 1rem;
  transition:
    border-color 220ms ease,
    background 220ms ease,
    transform 220ms ease,
    box-shadow 220ms ease;
}

.feedback-card:hover {
  border-color: rgba(93, 112, 82, 0.38);
  background: rgba(255, 255, 255, 0.88);
  transform: translateY(-0.08rem);
  box-shadow: var(--soft-shadow);
}

.feedback-card-main {
  color: inherit;
  text-decoration: none;
  min-width: 0;
}

.feedback-card-content {
  display: grid;
  gap: 0.55rem;
  min-width: 0;
}

.feedback-card-header {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.6rem;
}

.feedback-card-title {
  margin: 0;
  font-family: var(--font-heading);
  font-size: 1.15rem;
  font-weight: 760;
  line-height: 1.22;
  color: var(--foreground);
  overflow-wrap: anywhere;
}

.feedback-card-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  flex-shrink: 0;
}

.feedback-card-category,
.feedback-card-status {
  display: inline-flex;
  align-items: center;
  min-height: 1.6rem;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 950;
  text-transform: uppercase;
  letter-spacing: 0;
}

.feedback-card-category {
  background: rgba(230, 220, 205, 0.72);
  color: var(--accent-foreground);
}

.feedback-card-status {
  background: rgba(93, 112, 82, 0.12);
  color: var(--primary);
}

.feedback-card-status-promoted {
  background: rgba(193, 140, 93, 0.16);
  color: var(--secondary);
}

.feedback-card-excerpt {
  margin: 0;
  color: var(--muted-foreground);
  font-size: 0.95rem;
  line-height: 1.55;
  overflow-wrap: anywhere;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.feedback-card-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.45rem;
  color: var(--muted-foreground);
  font-size: 0.84rem;
  font-weight: 800;
}

.feedback-card-avatar {
  width: 1.375rem;
  height: 1.375rem;
  border-radius: 999px;
  object-fit: cover;
  border: 1px solid rgba(222, 216, 207, 0.82);
}

.feedback-card-author {
  color: var(--accent-foreground);
}

.feedback-card-replies {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

.feedback-card-vote {
  align-self: center;
}

@media (max-width: 520px) {
  .feedback-card {
    grid-template-columns: 1fr;
    gap: 0.85rem;
  }

  .feedback-card-vote {
    justify-self: start;
  }
}
</style>
