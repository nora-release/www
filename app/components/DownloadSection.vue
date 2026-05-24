<script setup lang="ts">
import { Download as DownloadIcon } from '@lucide/vue'

defineProps<{
  downloadHref: string
}>()
</script>

<template>
  <section id="download" class="final-cta section-shell" aria-labelledby="download-title">
    <div class="ambient ambient-cta" aria-hidden="true" />
    <p class="eyebrow">Download the desktop app</p>
    <h2 id="download-title">Bring every AI provider into one calm workspace.</h2>
    <p>
      Install Nora when you want OpenAI, Anthropic, Google Gemini, and
      custom providers in a single desktop experience.
    </p>
    <a class="button button-primary button-light" :href="downloadHref">
      Download app
      <DownloadIcon :size="20" aria-hidden="true" />
    </a>
  </section>
</template>
