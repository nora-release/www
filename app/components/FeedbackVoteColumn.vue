<script setup lang="ts">
const props = defineProps<{
  score: number
  userVote: 1 | -1 | 0
  disabled?: boolean
}>()

const emit = defineEmits<{
  (event: 'vote', value: 1 | -1): void
}>()

const handleVote = (value: 1 | -1) => {
  if (props.disabled) {
    return
  }
  emit('vote', value)
}
</script>

<template>
  <div class="vote-column">
    <button
      class="vote-button"
      :class="{ 'vote-active': userVote === 1 }"
      type="button"
      aria-label="Upvote"
      :disabled="disabled"
      @click="handleVote(1)"
    >
      <span class="i-lucide-chevron-up size-5" aria-hidden="true" />
    </button>
    <span class="vote-score" :class="{ 'vote-score-active': userVote !== 0 }">
      {{ score }}
    </span>
    <button
      class="vote-button"
      :class="{ 'vote-active-down': userVote === -1 }"
      type="button"
      aria-label="Downvote"
      :disabled="disabled"
      @click="handleVote(-1)"
    >
      <span class="i-lucide-chevron-down size-5" aria-hidden="true" />
    </button>
  </div>
</template>

<style scoped>
.vote-column {
  display: grid;
  align-items: center;
  justify-items: center;
  gap: 0.1rem;
  padding: 0.45rem 0.35rem;
  border: 1px solid rgba(222, 216, 207, 0.85);
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.72);
  min-width: 3rem;
}

.vote-button {
  display: grid;
  width: 1.8rem;
  height: 1.6rem;
  place-items: center;
  border: 0;
  border-radius: 0.6rem;
  background: transparent;
  color: var(--muted-foreground);
  cursor: pointer;
  transition:
    color 200ms ease,
    background 200ms ease,
    transform 200ms ease;
}

.vote-button:hover:not(:disabled) {
  background: rgba(93, 112, 82, 0.1);
  color: var(--primary);
}

.vote-button:active:not(:disabled) {
  transform: scale(0.92);
}

.vote-button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.vote-active {
  color: var(--primary) !important;
  background: rgba(93, 112, 82, 0.14) !important;
}

.vote-active-down {
  color: var(--destructive) !important;
  background: rgba(168, 84, 72, 0.12) !important;
}

.vote-score {
  min-width: 1.5rem;
  text-align: center;
  font-size: 0.95rem;
  font-weight: 900;
  color: var(--foreground);
}

.vote-score-active {
  color: var(--primary);
}
</style>
