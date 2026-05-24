<script setup lang="ts">
defineProps<{
  downloadHref: string
}>()
</script>

<template>
  <section class="hero section-shell" aria-labelledby="hero-title">
    <div class="ambient ambient-moss" aria-hidden="true" />
    <div class="ambient ambient-clay" aria-hidden="true" />

    <div class="hero-grid">
      <div class="hero-copy">
        <p class="eyebrow">
          <span class="i-lucide-feather size-[1.125rem]" aria-hidden="true" />
          One desktop home for every AI provider
        </p>

        <h1 id="hero-title">Nora unifies your AI experience.</h1>

        <p class="hero-text">
          A beautiful desktop application for OpenAI, Anthropic, Google
          Gemini, and custom providers. Switch models without breaking your
          flow.
        </p>

        <div class="hero-actions" aria-label="Hero actions">
          <a class="button button-primary" :href="downloadHref">
            Download Nora
            <span class="i-lucide-download size-5" aria-hidden="true" />
          </a>
          <a class="button button-outline" href="#features">See features</a>
        </div>
      </div>

      <div class="hero-visual" aria-label="Nora AI desktop workspace preview">
        <div class="release-board">
          <div class="board-header">
            <span class="board-kicker">AI workspace</span>
            <span class="board-status">Desktop</span>
          </div>

          <div class="release-title">
            <span class="i-lucide-sparkles size-6" aria-hidden="true" />
            <span>One conversation, every model</span>
          </div>

          <div class="source-row">
            <span>OpenAI</span>
            <span>Anthropic</span>
            <span>Gemini</span>
            <span>Custom</span>
          </div>

          <div class="story-card story-card-primary">
            <span class="story-label">Active provider</span>
            <p>
              Compare answers across providers, keep the same context, and
              continue from one focused desktop workspace.
            </p>
          </div>

          <div class="story-grid">
            <div class="mini-note">
              <span class="i-lucide-check size-[1.125rem]" aria-hidden="true" />
              Local history
            </div>
            <div class="mini-note mini-note-clay">
              <span class="i-lucide-check size-[1.125rem]" aria-hidden="true" />
              Custom keys
            </div>
          </div>
        </div>

        <div class="floating-note floating-note-right">
          <span class="i-lucide-message-circle size-[1.1875rem]" aria-hidden="true" />
          Model switch
        </div>
      </div>
    </div>
  </section>
</template>
