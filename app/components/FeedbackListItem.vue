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
            <span
              class="feedback-card-category"
              :class="`feedback-card-category-${item.category}`"
            >
              {{ categoryLabel }}
            </span>
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
  gap: 0.9rem;
  align-items: start;
  border-bottom: 1px solid var(--fb-border-soft);
  background: var(--fb-panel);
  padding: 1rem 0.95rem;
  transition:
    background 220ms ease,
    border-color 220ms ease;
}

.feedback-card:last-child {
  border-bottom: 0;
}

.feedback-card:hover {
  background: var(--fb-panel-strong);
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
  font-size: 1.02rem;
  font-weight: 850;
  line-height: 1.22;
  color: var(--fb-text);
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
  padding: 0.18rem 0.5rem;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 850;
}

.feedback-card-category {
  border: 1px solid rgba(209, 177, 95, 0.16);
  background: rgba(209, 177, 95, 0.08);
  color: var(--fb-feature);
}

.feedback-card-category-bug {
  border-color: rgba(235, 117, 109, 0.18);
  background: rgba(235, 117, 109, 0.08);
  color: var(--fb-danger);
}

.feedback-card-status {
  border: 1px solid rgba(168, 189, 121, 0.16);
  background: rgba(168, 189, 121, 0.08);
  color: var(--fb-accent);
}

.feedback-card-status-promoted {
  border-color: rgba(155, 183, 255, 0.18);
  background: rgba(155, 183, 255, 0.08);
  color: #9bb7ff;
}

.feedback-card-excerpt {
  margin: 0;
  color: var(--fb-muted);
  font-size: 0.93rem;
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
  color: var(--fb-subtle);
  font-size: 0.84rem;
  font-weight: 800;
}

.feedback-card-avatar {
  width: 1.375rem;
  height: 1.375rem;
  border-radius: 999px;
  object-fit: cover;
  border: 1px solid var(--fb-border);
}

.feedback-card-author {
  color: var(--fb-muted);
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
