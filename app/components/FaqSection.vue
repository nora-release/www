<script setup lang="ts">
import type { FaqItem } from '../data/home'

defineProps<{
  items: FaqItem[]
}>()
</script>

<template>
  <section id="faq" class="faq section-shell" aria-labelledby="faq-title">
    <div class="faq-copy">
      <p class="eyebrow">Common questions</p>
      <h2 id="faq-title">A few details before downloading.</h2>
    </div>

    <div class="faq-list">
      <details v-for="item in items" :key="item.question" class="faq-item">
        <summary>
          <span>{{ item.question }}</span>
          <span class="i-lucide-chevron-down size-5" aria-hidden="true" />
        </summary>
        <p>{{ item.answer }}</p>
      </details>
    </div>
  </section>
</template>
