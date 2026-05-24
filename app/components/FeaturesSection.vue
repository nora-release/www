<script setup lang="ts">
import type { FeatureItem } from '../data/home'

defineProps<{
  features: FeatureItem[]
}>()
</script>

<template>
  <section id="features" class="features section-shell" aria-labelledby="features-title">
    <div class="section-heading">
      <p class="eyebrow">A calmer way to use AI</p>
      <h2 id="features-title">One beautiful app for all your models.</h2>
    </div>

    <div class="feature-grid">
      <article
        v-for="(feature, index) in features"
        :key="feature.title"
        class="feature-card"
        :class="`feature-shape-${index + 1}`"
      >
        <div class="icon-bloom">
          <span :class="[feature.icon, 'feature-icon']" aria-hidden="true" />
        </div>
        <h3>{{ feature.title }}</h3>
        <p>{{ feature.text }}</p>
      </article>
    </div>
  </section>
</template>
