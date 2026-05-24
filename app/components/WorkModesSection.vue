<script setup lang="ts">
import type { WorkMode } from '../data/home'

defineProps<{
  modes: WorkMode[]
}>()
</script>

<template>
  <section class="work-section" aria-label="Nora work controls">
    <div class="work-grid">
      <article v-for="mode in modes" :key="mode.title" class="work-card">
        <h2>{{ mode.title }}</h2>
        <p>{{ mode.text }}</p>
      </article>
    </div>
  </section>
</template>
