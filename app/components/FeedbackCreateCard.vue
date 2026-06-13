<script setup lang="ts">
import type { FeedbackCategory } from '../../server/utils/feedback/types'

defineProps<{
  canPost: boolean
  githubConfigured: boolean
}>()

const emit = defineEmits<{
  (event: 'submit', payload: { title: string; description: string; category: FeedbackCategory }): void
}>()

const isExpanded = ref(false)
const title = ref('')
const description = ref('')
const category = ref<FeedbackCategory>('feature')
const isSubmitting = ref(false)

const loginHref = computed(() => {
  return `/auth/github?next=${encodeURIComponent('/feedback')}`
})

const canSubmit = computed(() => {
  return title.value.trim().length > 0 && description.value.trim().length > 0
})

const handleSubmit = () => {
  if (!canSubmit.value || isSubmitting.value) {
    return
  }

  isSubmitting.value = true
  emit('submit', {
    title: title.value.trim(),
    description: description.value.trim(),
    category: category.value,
  })
}

const resetForm = () => {
  title.value = ''
  description.value = ''
  category.value = 'feature'
  isExpanded.value = false
  isSubmitting.value = false
}

defineExpose({
  resetForm,
  isSubmitting,
})
</script>

<template>
  <div class="create-card">
    <a
      v-if="!canPost && githubConfigured"
      class="create-prompt"
      :href="loginHref"
    >
      <span class="i-lucide-pen-line size-5" aria-hidden="true" />
      <span>Have something to say?</span>
      <span class="create-prompt-hint">Sign in with GitHub to create a post or reply.</span>
    </a>

    <div
      v-else-if="!canPost"
      class="create-prompt create-prompt-disabled"
    >
      <span class="i-lucide-circle-alert size-5" aria-hidden="true" />
      <span>GitHub OAuth is not configured.</span>
      <span class="create-prompt-hint">Posting is unavailable until login is configured.</span>
    </div>

    <button
      v-else-if="!isExpanded"
      class="create-prompt"
      type="button"
      @click="isExpanded = true"
    >
      <span class="i-lucide-pen-line size-5" aria-hidden="true" />
      <span>Have something to say?</span>
      <span class="create-prompt-hint">Tell us how we could make the product more useful to you.</span>
    </button>

    <form v-else class="create-form" @submit.prevent="handleSubmit">
      <div class="create-form-header">
        <span class="create-form-title">Create a new post</span>
        <button
          class="create-close"
          type="button"
          aria-label="Close form"
          @click="isExpanded = false"
        >
          <span class="i-lucide-x size-5" aria-hidden="true" />
        </button>
      </div>

      <label class="create-field">
        <span>Title</span>
        <input
          v-model="title"
          name="title"
          maxlength="140"
          autocomplete="off"
          placeholder="Short summary"
        >
      </label>

      <label class="create-field">
        <span>Category</span>
        <select v-model="category" name="category">
          <option value="feature">Feature Request</option>
          <option value="bug">Bug Reports</option>
        </select>
      </label>

      <label class="create-field">
        <span>Details</span>
        <textarea
          v-model="description"
          name="description"
          rows="4"
          maxlength="4000"
          placeholder="What should change?"
        />
      </label>

      <div class="create-actions">
        <button
          class="button button-primary"
          type="submit"
          :disabled="!canSubmit || isSubmitting"
        >
          Add feedback
          <span class="i-lucide-plus size-5" aria-hidden="true" />
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.create-card {
  border: 1px solid var(--fb-border);
  border-radius: 1.6rem 2rem 1.8rem 1.5rem;
  background: var(--fb-panel-strong);
  box-shadow: var(--fb-shadow);
  overflow: hidden;
}

.create-prompt {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 0.55rem 0.85rem;
  width: 100%;
  padding: 1.05rem 1rem;
  border: 0;
  background: transparent;
  color: var(--fb-text);
  text-align: left;
  cursor: pointer;
  text-decoration: none;
  transition: background 220ms ease;
}

.create-prompt:hover {
  background: rgba(93, 112, 82, 0.06);
}

.create-prompt > span:first-of-type {
  color: var(--primary);
}

.create-prompt > span:nth-of-type(2) {
  font-weight: 900;
  font-size: 1.05rem;
}

.create-prompt-hint {
  grid-column: 2;
  color: var(--fb-muted);
  font-size: 0.92rem;
  font-weight: 800;
}

.create-prompt-disabled {
  cursor: not-allowed;
}

.create-form {
  display: grid;
  gap: 0.85rem;
  padding: 1.1rem;
}

.create-form-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.create-form-title {
  font-size: 1.25rem;
  font-weight: 850;
  color: var(--fb-text);
}

.create-close {
  display: grid;
  width: 2.4rem;
  height: 2.4rem;
  place-items: center;
  border: 0;
  border-radius: 999px;
  background: rgba(93, 112, 82, 0.1);
  color: var(--primary);
  cursor: pointer;
  transition: background 220ms ease, transform 220ms ease;
}

.create-close:hover {
  background: rgba(93, 112, 82, 0.16);
}

.create-close:active {
  transform: scale(0.96);
}

.create-field {
  display: grid;
  gap: 0.4rem;
  color: var(--fb-muted);
  font-weight: 900;
}

.create-field input,
.create-field textarea,
.create-field select {
  width: 100%;
  border: 1px solid var(--fb-border);
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.72);
  color: var(--fb-text);
  line-height: 1.5;
  outline: 0;
  transition:
    border-color 200ms ease,
    box-shadow 200ms ease,
    background 200ms ease;
}

.create-field input,
.create-field select {
  min-height: 2.85rem;
  padding: 0 0.85rem;
}

.create-field textarea {
  min-height: 6.5rem;
  resize: vertical;
  padding: 0.75rem 0.85rem;
}

.create-field input:focus,
.create-field textarea:focus,
.create-field select:focus {
  border-color: rgba(93, 112, 82, 0.72);
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 0 0 3px rgba(93, 112, 82, 0.16);
}

.create-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding-top: 0.25rem;
}

@media (max-width: 520px) {
  .create-actions .button {
    width: 100%;
  }
}
</style>
