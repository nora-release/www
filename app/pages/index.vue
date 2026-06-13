<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { downloadHref } from '../data/home'

useHead({
  title: 'Nora - Local agent workspace for macOS',
  meta: [
    {
      name: 'description',
      content:
        'Nora is a macOS-first local agent app for running coding and productivity agents with reviewable changes.',
    },
    {
      property: 'og:title',
      content: 'Nora - Local agent workspace for macOS',
    },
    {
      property: 'og:description',
      content:
        'Run local agents, inspect every change, and keep provider workflows in one desktop workspace.',
    },
  ],
})

const isMenuOpen = ref(false)
const heroLines = ['Run agents.', 'Control the work.']
const titleGlyphs = computed(() => heroLines.map((line) => Array.from(line)))

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Workflow', href: '#workflow' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Feedback', href: '/feedback' },
]

const heroStats = [
  { label: 'Built for', value: 'macOS' },
  { label: 'Review mode', value: 'Local first' },
]

const zoomFeatures = [
  {
    title: 'Follow every run',
    text: 'Active, waiting, and finished tasks stay visible without switching context.',
  },
  {
    title: 'Inspect before apply',
    text: 'Review changed files first, then accept selected work or discard the run.',
  },
  {
    title: 'Use your providers',
    text: 'Work with OpenAI, Anthropic, Gemini, gateways, and custom endpoints.',
  },
]

const toolbarItems = [
  { label: 'Display', file: 'display' },
  { label: 'Window', file: 'macwindow' },
  { label: 'Workspace', file: 'folder' },
  { label: 'Keyboard', file: 'keyboard' },
  { label: 'Settings', file: 'gear' },
]

const performanceRows = [
  { metric: 'Provider routes', nora: '8+', others: 'separate apps' },
  { metric: 'Review flow', nora: 'per file', others: 'manual diff' },
  { metric: 'Workspace', nora: 'local', others: 'cloud first' },
  { metric: 'Skills', nora: 'on demand', others: 'always loaded' },
]

const featureCards = [
  {
    title: 'One conversation, many models',
    caption:
      'Switch providers while preserving the task, files, and local context.',
    visual: 'providers',
  },
  {
    title: 'Computer actions stay gated',
    caption:
      'Agents can operate apps only after you allow the action path.',
    visual: 'gate',
  },
  {
    title: 'Skills load when needed',
    caption:
      'Capability packages stay local and appear only for matching tasks.',
    visual: 'skills',
  },
]

const faqs = [
  {
    question: 'What is Nora?',
    answer:
      'Nora is a macOS desktop app for running local coding and productivity agents from one focused workspace.',
  },
  {
    question: 'Can I review file changes first?',
    answer:
      'Yes. Agent edits stay reviewable before they touch the host workspace.',
  },
  {
    question: 'Which providers does it support?',
    answer:
      'Nora supports OpenAI, Anthropic, Google Gemini, Azure, Bedrock, Cloudflare, Cerebras, and OpenAI-compatible routes.',
  },
  {
    question: 'Is it local-first?',
    answer:
      'Provider credentials, skills, sessions, schedules, and review workflows are managed by the desktop app.',
  },
]

let revealObserver: IntersectionObserver | undefined

onMounted(() => {
  const revealNodes = document.querySelectorAll<HTMLElement>('.screen-home .reveal')

  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
        }
      })
    },
    {
      rootMargin: '0px 0px -12% 0px',
      threshold: 0.18,
    },
  )

  revealNodes.forEach((node) => revealObserver?.observe(node))
})

onBeforeUnmount(() => {
  revealObserver?.disconnect()
})
</script>

<template>
  <div class="screen-home">
    <a class="skip-link" href="#main">Skip to content</a>

    <section class="screen-hero" aria-labelledby="hero-title">
      <ShaderBackground />
      <div class="header-mask" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <header class="screen-header">
        <NuxtLink class="screen-brand" to="/" aria-label="Nora home">
          <img src="/default/icon_128x128.png" alt="" width="36" height="36">
          <span>Nora</span>
        </NuxtLink>

        <nav class="screen-nav" aria-label="Primary navigation">
          <a v-for="item in navLinks" :key="item.href" :href="item.href">
            {{ item.label }}
          </a>
        </nav>

        <a class="header-download" :href="downloadHref">
          Download
          <span class="i-lucide-arrow-right size-4" aria-hidden="true" />
        </a>

        <button
          class="mobile-menu-button"
          type="button"
          aria-label="Toggle navigation"
          :aria-expanded="isMenuOpen"
          @click="isMenuOpen = !isMenuOpen"
        >
          <span v-if="isMenuOpen" class="i-lucide-x size-5" aria-hidden="true" />
          <span v-else class="i-lucide-menu size-5" aria-hidden="true" />
        </button>

        <Transition name="mobile-panel">
          <div v-if="isMenuOpen" class="mobile-panel">
            <a
              v-for="item in navLinks"
              :key="item.href"
              :href="item.href"
              @click="isMenuOpen = false"
            >
              {{ item.label }}
            </a>
            <a :href="downloadHref" @click="isMenuOpen = false">Download Nora</a>
          </div>
        </Transition>
      </header>

      <main id="main" class="hero-stage">
        <div class="hero-title-wrap">
          <h1 id="hero-title" class="hero-title">
            <span
              v-for="(line, lineIndex) in titleGlyphs"
              :key="heroLines[lineIndex]"
              class="hero-title-line"
            >
              <span
                v-for="(glyph, glyphIndex) in line"
                :key="`${lineIndex}-${glyphIndex}`"
                class="motion-glyph"
                :style="{ '--glyph-delay': `${lineIndex * 260 + glyphIndex * 16}ms` }"
              >
                {{ glyph === ' ' ? '\u00A0' : glyph }}
              </span>
            </span>
          </h1>
        </div>

        <div class="hero-bottom hero-reveal">
          <div class="hero-copy">
            <p>
              Nora is a macOS-first local agent app for running coding and productivity agents, inspecting changes, and keeping every model workflow in one place.
            </p>
            <div class="hero-actions">
              <a class="liquid-button" :href="downloadHref">
                <svg aria-hidden="true" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                <span>Download for Mac</span>
                <span class="i-lucide-arrow-right size-4" aria-hidden="true" />
              </a>
              <a class="text-link" href="#features">See features</a>
            </div>
          </div>

          <dl class="hero-stats">
            <div v-for="stat in heroStats" :key="stat.label">
              <dt>{{ stat.label }}</dt>
              <dd>{{ stat.value }}</dd>
            </div>
          </dl>
        </div>
      </main>

      <div class="scan-lines" aria-hidden="true" />
    </section>

    <section id="features" class="feature-section zoom-section">
      <div class="section-copy reveal">
        <h2>
          Zoom into the run.
          <span>Review before it changes your files.</span>
        </h2>
      </div>

      <div class="zoom-demo reveal" aria-label="Animated Nora review workflow preview">
        <div class="demo-menubar">
          <span />
          <span />
          <span />
          <strong>Nora workspace</strong>
        </div>
        <div class="demo-surface">
          <div class="agent-panel">
            <div class="agent-title">Active run</div>
            <div class="agent-line is-long" />
            <div class="agent-line" />
            <div class="agent-line is-short" />
            <div class="provider-strip">
              <span>OpenAI</span>
              <span>Anthropic</span>
              <span>Gemini</span>
            </div>
          </div>
          <div class="diff-panel">
            <div class="diff-row add">+ add guarded file review</div>
            <div class="diff-row add">+ keep changes in sandbox</div>
            <div class="diff-row remove">- apply without preview</div>
            <div class="diff-row add">+ accept selected files</div>
          </div>
          <div class="zoom-frame" />
          <div class="demo-cursor" />
        </div>
        <div class="timeline">
          <div class="timeline-track recording">
            <span />
          </div>
          <div class="timeline-track review">
            <span />
          </div>
          <div class="timeline-playhead" />
        </div>
      </div>

      <div class="feature-list reveal">
        <article v-for="(feature, index) in zoomFeatures" :key="feature.title">
          <span>{{ String(index + 1).padStart(2, '0') }}</span>
          <div>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.text }}</p>
          </div>
        </article>
      </div>
    </section>

    <section id="workflow" class="mockup-section">
      <div class="mockup-copy reveal">
        <p>Desktop workspace</p>
        <h2>Designed around the work, not the chat window.</h2>
        <span>
          Runs, approvals, provider routes, skills, and file review stay in a single macOS-native flow.
        </span>
      </div>

      <div class="device-stage reveal">
        <div class="desktop-device">
          <div class="device-screen">
            <img src="/screen-style/macos26-wallpaper.jpg" alt="macOS-style wallpaper preview">
            <div class="nora-window">
              <div class="window-sidebar">
                <span />
                <span />
                <span />
              </div>
              <div class="window-main">
                <div class="prompt-card">Review changed files</div>
                <div class="run-stack">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="phone-device">
          <img src="/screen-style/beauty-wallpaper.webp" alt="Colorful wallpaper preview">
          <div class="phone-pill">Queued</div>
        </div>
      </div>
    </section>

    <section class="controls-section">
      <div class="controls-shell reveal">
        <div class="controls-copy">
          <p>Custom controls</p>
          <h2>
            Keep permission, context, and provider control close to the cursor.
          </h2>
        </div>

        <div class="glass-toolbar" aria-label="Nora toolbar preview">
          <button v-for="item in toolbarItems" :key="item.file" type="button" :aria-label="item.label">
            <img :src="`/screen-style/toolbar-symbols/${item.file}.png`" alt="">
          </button>
        </div>

        <div class="control-board">
          <div class="control-card">
            <span>Provider route</span>
            <strong>OpenAI compatible</strong>
            <div class="slider-row">
              <i />
            </div>
          </div>
          <div class="control-card">
            <span>Computer use</span>
            <strong>Ask every time</strong>
            <div class="toggle is-on" />
          </div>
          <div class="control-card">
            <span>Apply changes</span>
            <strong>Selected files</strong>
            <div class="mini-progress">
              <i />
              <i />
              <i />
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="performance-section">
      <div class="performance-copy reveal">
        <h2>Fast local review without spreading work across tools.</h2>
        <a :href="downloadHref">
          Download Nora
          <span class="i-lucide-arrow-right size-4" aria-hidden="true" />
        </a>
      </div>

      <div class="comparison-table reveal">
        <div class="table-row table-head">
          <span>Metric</span>
          <span>Nora</span>
          <span>Others</span>
        </div>
        <div v-for="row in performanceRows" :key="row.metric" class="table-row">
          <span>{{ row.metric }}</span>
          <strong>{{ row.nora }}</strong>
          <span>{{ row.others }}</span>
        </div>
      </div>
    </section>

    <section class="cards-section">
      <div class="cards-heading reveal">
        <p>Everything stays inspectable</p>
        <h2>Familiar agent workflows, shaped like a desktop app.</h2>
      </div>

      <div class="cards-grid">
        <article
          v-for="card in featureCards"
          :key="card.title"
          class="feature-card reveal"
          :class="`is-${card.visual}`"
        >
          <div class="card-visual" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <h3>{{ card.title }}</h3>
          <p>{{ card.caption }}</p>
        </article>
      </div>
    </section>

    <section id="faq" class="faq-section">
      <div class="faq-heading reveal">
        <p>FAQ</p>
        <h2>Answers before installing.</h2>
      </div>

      <div class="faq-list reveal">
        <details v-for="item in faqs" :key="item.question">
          <summary>
            {{ item.question }}
            <span class="i-lucide-chevron-down size-5" aria-hidden="true" />
          </summary>
          <p>{{ item.answer }}</p>
        </details>
      </div>
    </section>

    <footer class="screen-footer">
      <div>
        <NuxtLink class="footer-brand" to="/">
          <img src="/default/icon_128x128.png" alt="" width="34" height="34">
          <span>Nora</span>
        </NuxtLink>
        <p>Local agent workspace for macOS.</p>
      </div>
      <nav aria-label="Footer navigation">
        <a href="#features">Features</a>
        <a href="#workflow">Workflow</a>
        <a href="/feedback">Feedback</a>
        <a :href="downloadHref">Download</a>
      </nav>
    </footer>
  </div>
</template>

<style scoped>
:global(body:has(.screen-home)) {
  background: #050505;
}

.screen-home {
  --screen-bg: #050505;
  --screen-fg: rgba(255, 255, 255, 0.96);
  --screen-muted: rgba(255, 255, 255, 0.58);
  --screen-border: rgba(255, 255, 255, 0.16);
  --screen-soft: rgba(255, 255, 255, 0.05);
  --screen-accent: #d1885f;
  min-height: 100vh;
  overflow-x: hidden;
  background: var(--screen-bg);
  color: var(--screen-fg);
  font-family: Geist, Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

.screen-home *,
.screen-home *::before,
.screen-home *::after {
  box-sizing: border-box;
}

.screen-home a {
  color: inherit;
  text-decoration: none;
}

.skip-link {
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 200;
  transform: translateY(-160%);
  background: white;
  color: black;
  padding: 0.65rem 0.85rem;
  font-size: 0.9rem;
  transition: transform 180ms ease;
}

.skip-link:focus {
  transform: translateY(0);
}

.screen-hero {
  position: relative;
  min-height: 100svh;
  overflow: hidden;
  background:
    radial-gradient(circle at 72% 28%, rgba(209, 136, 95, 0.08), transparent 31rem),
    var(--screen-bg);
}

.screen-hero::before {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  content: "";
  opacity: 0.16;
  background-image: url("/noise.svg");
  mix-blend-mode: screen;
}

.header-mask {
  position: fixed;
  top: -30px;
  left: 0;
  z-index: 80;
  width: 100%;
  height: 132px;
  pointer-events: none;
}

.header-mask::after,
.header-mask span {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.header-mask::after {
  content: "";
  background: linear-gradient(180deg, rgba(5, 5, 5, 0.86) 0%, rgba(5, 5, 5, 0.44) 54%, rgba(5, 5, 5, 0) 100%);
}

.header-mask span {
  background: rgba(5, 5, 5, 0.01);
  -webkit-backdrop-filter: blur(var(--mask-blur));
  backdrop-filter: blur(var(--mask-blur));
  -webkit-mask-image: linear-gradient(to bottom, #000 0%, #000 var(--mask-stop), transparent 100%);
  mask-image: linear-gradient(to bottom, #000 0%, #000 var(--mask-stop), transparent 100%);
}

.header-mask span:nth-child(1) {
  --mask-blur: 1px;
  --mask-stop: 70%;
}

.header-mask span:nth-child(2) {
  --mask-blur: 3px;
  --mask-stop: 50%;
}

.header-mask span:nth-child(3) {
  --mask-blur: 6px;
  --mask-stop: 30%;
}

.screen-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 90;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 80rem;
  margin: 0 auto;
  padding: 1.5rem 3rem;
}

.screen-brand,
.footer-brand {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.95rem;
  font-weight: 650;
  letter-spacing: 0;
  font-family: Geist, Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

.screen-brand {
  transition: transform 220ms cubic-bezier(0.16, 1, 0.3, 1), opacity 220ms ease;
}

.screen-brand:hover {
  transform: scale(1.05);
  opacity: 0.84;
}

.screen-brand img,
.footer-brand img {
  border-radius: 0.55rem;
}

.screen-nav {
  position: absolute;
  left: 50%;
  display: flex;
  align-items: center;
  gap: 2rem;
  color: var(--screen-muted);
  font-size: 0.9rem;
  transform: translateX(-50%);
}

.screen-nav a,
.header-download {
  position: relative;
  transition: color 240ms ease;
}

.screen-nav a::after {
  position: absolute;
  left: 0;
  bottom: -0.32rem;
  width: 100%;
  height: 1px;
  content: "";
  background: currentColor;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 260ms cubic-bezier(0.16, 1, 0.3, 1);
}

.screen-nav a:hover,
.header-download:hover {
  color: var(--screen-fg);
}

.screen-nav a:hover::after {
  transform: scaleX(1);
}

.header-download {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--screen-fg);
  font-size: 0.9rem;
}

.header-download span,
.liquid-button span:last-child,
.performance-copy a span {
  transition: transform 220ms ease;
}

.header-download:hover span,
.liquid-button:hover span:last-child,
.performance-copy a:hover span {
  transform: translateX(0.18rem);
}

.mobile-menu-button,
.mobile-panel {
  display: none;
}

.hero-stage {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 100svh;
  width: 100%;
  max-width: 80rem;
  margin: 0 auto;
  padding: 7rem 3rem 2rem;
}

.hero-title-wrap {
  width: 100%;
  transform: translateY(calc(clamp(1.8rem, 8.64vw, 8.64rem) * -1));
}

.hero-title {
  max-width: calc(100vw - 6rem);
  margin: 0;
  color: var(--screen-fg);
  font-size: clamp(3.4rem, 12vw, 12rem);
  font-family: Geist, Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-weight: 760;
  letter-spacing: 0;
  line-height: 0.9;
}

.hero-title-line {
  display: block;
  white-space: nowrap;
}

.motion-glyph {
  display: inline-block;
  transform-origin: 50% 100%;
  opacity: 0;
  filter: blur(18px);
  animation: heroGlyphReveal 940ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
  animation-delay: calc(0.18s + var(--glyph-delay));
}

@keyframes heroGlyphReveal {
  0% {
    opacity: 0;
    filter: blur(22px);
    transform: translate3d(0, 0.26em, 0) scaleY(0.86);
  }
  72% {
    opacity: 1;
    filter: blur(2px);
  }
  100% {
    opacity: 1;
    filter: blur(0);
    transform: translate3d(0, 0, 0) scaleY(1);
  }
}

.hero-bottom {
  position: absolute;
  left: 3rem;
  right: 3rem;
  bottom: 3rem;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 3rem;
}

.hero-reveal {
  opacity: 1;
  transform: translateY(0);
}

.hero-copy {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 57rem;
}

.hero-copy p {
  max-width: 56rem;
  margin: 0;
  color: var(--screen-muted);
  font-size: 0.93rem;
  line-height: 1.75;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
}

.liquid-button {
  position: relative;
  isolation: isolate;
  display: inline-flex;
  align-items: center;
  gap: 0.7rem;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 999px;
  padding: 0.78rem 1.15rem;
  color: rgba(255, 255, 255, 0.9);
  background:
    radial-gradient(circle at 28% 12%, rgba(255, 255, 255, 0.13), transparent 34%),
    linear-gradient(135deg, rgba(255, 255, 255, 0.075), rgba(255, 255, 255, 0.026) 48%, rgba(255, 255, 255, 0.055));
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.38),
    inset 0 -1px 0 rgba(255, 255, 255, 0.12),
    0 18px 45px rgba(0, 0, 0, 0.28),
    0 0 0 1px rgba(255, 255, 255, 0.035);
  font-size: 0.9rem;
  font-weight: 650;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.26);
  -webkit-backdrop-filter: blur(18px) saturate(1.55) contrast(1.08);
  backdrop-filter: blur(18px) saturate(1.55) contrast(1.08);
  transition:
    border-color 180ms ease,
    box-shadow 180ms ease,
    color 180ms ease,
    transform 220ms cubic-bezier(0.16, 1, 0.3, 1);
}

.liquid-button::before {
  position: absolute;
  inset: 1px;
  z-index: -1;
  content: "";
  border-radius: inherit;
  background:
    linear-gradient(120deg, rgba(255, 255, 255, 0.28), transparent 36%),
    radial-gradient(circle at 72% 15%, rgba(255, 255, 255, 0.1), transparent 28%);
  opacity: 0.86;
}

.liquid-button:hover {
  border-color: rgba(255, 255, 255, 0.34);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.5),
    inset 0 -1px 0 rgba(255, 255, 255, 0.16),
    0 24px 55px rgba(0, 0, 0, 0.34),
    0 0 0 1px rgba(255, 255, 255, 0.055);
  transform: translateY(-1px) scale(1.015);
}

.liquid-button:active {
  transform: translateY(1px) scale(0.985);
}

.liquid-button svg {
  width: 1.22rem;
  height: 1.22rem;
  fill: currentColor;
}

.text-link {
  color: var(--screen-muted);
  font-size: 0.9rem;
  transition: color 180ms ease;
}

.text-link:hover {
  color: var(--screen-fg);
}

.hero-stats {
  display: flex;
  gap: 3rem;
  margin: 0;
}

.hero-stats div {
  display: flex;
  flex-direction: column;
  gap: 0.28rem;
}

.hero-stats dt {
  color: var(--screen-muted);
  font-size: 0.72rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.hero-stats dd {
  margin: 0;
  color: var(--screen-fg);
  font-size: 0.9rem;
  font-weight: 650;
}

.scan-lines {
  position: absolute;
  inset: 0;
  z-index: 20;
  pointer-events: none;
  background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255, 255, 255, 0.012) 2px, rgba(255, 255, 255, 0.012) 4px);
}

.feature-section,
.mockup-section,
.controls-section,
.performance-section,
.cards-section,
.faq-section {
  position: relative;
  background: var(--screen-bg);
  padding: 8rem 3rem;
}

.feature-section,
.mockup-section,
.performance-section,
.cards-section,
.faq-section {
  max-width: 80rem;
  margin: 0 auto;
}

.section-copy,
.cards-heading,
.faq-heading {
  margin-bottom: 5rem;
}

.section-copy h2,
.mockup-copy h2,
.controls-copy h2,
.performance-copy h2,
.cards-heading h2,
.faq-heading h2 {
  max-width: 48rem;
  margin: 0;
  color: var(--screen-fg);
  font-size: clamp(2.25rem, 5vw, 4.2rem);
  font-weight: 760;
  letter-spacing: 0;
  line-height: 1.06;
  text-wrap: balance;
}

.section-copy h2 span,
.cards-heading h2,
.faq-heading h2 {
  color: var(--screen-muted);
}

.zoom-demo {
  overflow: hidden;
  border: 1px solid var(--screen-border);
  background:
    radial-gradient(circle at 70% 30%, rgba(209, 136, 95, 0.14), transparent 28rem),
    rgba(255, 255, 255, 0.035);
  box-shadow: 0 30px 90px rgba(0, 0, 0, 0.36);
}

.demo-menubar {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  height: 3.2rem;
  padding: 0 1.1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  color: var(--screen-muted);
  font-size: 0.78rem;
}

.demo-menubar span {
  width: 0.65rem;
  height: 0.65rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.22);
}

.demo-menubar strong {
  margin-left: 0.5rem;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 520;
}

.demo-surface {
  position: relative;
  display: grid;
  grid-template-columns: 0.9fr 1.1fr;
  gap: 1.2rem;
  min-height: 31rem;
  padding: 1.2rem;
  background:
    linear-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.035) 1px, transparent 1px);
  background-size: 38px 38px;
}

.agent-panel,
.diff-panel {
  position: relative;
  z-index: 1;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(0, 0, 0, 0.38);
  padding: 1.25rem;
  -webkit-backdrop-filter: blur(16px);
  backdrop-filter: blur(16px);
}

.agent-title {
  margin-bottom: 1.4rem;
  color: rgba(255, 255, 255, 0.86);
  font-weight: 680;
}

.agent-line {
  height: 0.72rem;
  width: 72%;
  margin-bottom: 0.85rem;
  background: rgba(255, 255, 255, 0.13);
}

.agent-line.is-long {
  width: 92%;
}

.agent-line.is-short {
  width: 48%;
}

.provider-strip {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 2rem;
}

.provider-strip span {
  border: 1px solid rgba(255, 255, 255, 0.14);
  padding: 0.5rem 0.62rem;
  color: rgba(255, 255, 255, 0.62);
  font-size: 0.78rem;
}

.diff-panel {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.85rem;
}

.diff-row {
  border-left: 2px solid rgba(255, 255, 255, 0.2);
  padding: 0.7rem 0.8rem;
  background: rgba(255, 255, 255, 0.045);
  color: rgba(255, 255, 255, 0.68);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.86rem;
}

.diff-row.add {
  border-color: rgba(123, 197, 126, 0.72);
}

.diff-row.remove {
  border-color: rgba(229, 111, 104, 0.72);
  color: rgba(255, 255, 255, 0.42);
}

.zoom-frame {
  position: absolute;
  z-index: 2;
  width: 15rem;
  height: 9rem;
  border: 1px solid rgba(255, 255, 255, 0.55);
  box-shadow:
    0 0 0 999px rgba(0, 0, 0, 0.18),
    0 0 42px rgba(255, 255, 255, 0.12);
  animation: zoomFrameTour 7s cubic-bezier(0.16, 1, 0.3, 1) infinite;
}

.demo-cursor {
  position: absolute;
  z-index: 3;
  width: 1.35rem;
  height: 1.35rem;
  clip-path: polygon(0 0, 100% 48%, 58% 58%, 42% 100%);
  background: white;
  filter: drop-shadow(0 8px 18px rgba(0, 0, 0, 0.36));
  animation: cursorTour 7s cubic-bezier(0.16, 1, 0.3, 1) infinite;
}

@keyframes zoomFrameTour {
  0%, 12%, 100% {
    transform: translate(28%, 46%) scale(1);
  }
  24%, 36% {
    transform: translate(12%, 20%) scale(1.08);
  }
  48%, 60% {
    transform: translate(58%, 26%) scale(1.08);
  }
  72%, 84% {
    transform: translate(40%, 58%) scale(1.08);
  }
}

@keyframes cursorTour {
  0%, 12%, 100% {
    transform: translate(48vw, 16rem);
  }
  24%, 36% {
    transform: translate(18vw, 8rem);
  }
  48%, 60% {
    transform: translate(53vw, 10rem);
  }
  72%, 84% {
    transform: translate(38vw, 20rem);
  }
}

.timeline {
  position: relative;
  display: grid;
  gap: 0.65rem;
  padding: 1rem 1.2rem 1.2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
}

.timeline-track {
  position: relative;
  height: 1.2rem;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.07);
}

.timeline-track span {
  position: absolute;
  inset-block: 0.22rem;
  border-radius: 999px;
}

.timeline-track.recording span {
  left: 7%;
  right: 13%;
  background: rgba(198, 198, 198, 0.36);
}

.timeline-track.review span {
  left: 29%;
  right: 24%;
  background: rgba(209, 136, 95, 0.68);
}

.timeline-playhead {
  position: absolute;
  top: 0.8rem;
  bottom: 0.95rem;
  width: 1px;
  background: white;
  animation: playhead 7s linear infinite;
}

@keyframes playhead {
  from {
    left: 1.2rem;
  }
  to {
    left: calc(100% - 1.2rem);
  }
}

.feature-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-top: 5rem;
}

.feature-list article {
  display: flex;
  gap: 1rem;
}

.feature-list span {
  color: rgba(255, 255, 255, 0.28);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.86rem;
}

.feature-list h3 {
  margin: 0 0 0.55rem;
  font-size: 1rem;
  font-weight: 650;
}

.feature-list p,
.mockup-copy span,
.feature-card p,
.faq-list p,
.screen-footer p {
  margin: 0;
  color: var(--screen-muted);
  font-size: 0.92rem;
  line-height: 1.75;
}

.mockup-section {
  display: grid;
  grid-template-columns: 0.72fr 1.28fr;
  gap: 4rem;
  align-items: center;
  min-height: 52rem;
}

.mockup-copy p,
.controls-copy p,
.cards-heading p,
.faq-heading p {
  margin: 0 0 1rem;
  color: var(--screen-muted);
  font-size: 0.74rem;
  font-weight: 680;
  letter-spacing: 0.22em;
  text-transform: uppercase;
}

.mockup-copy span {
  display: block;
  max-width: 34rem;
  margin-top: 1.5rem;
}

.device-stage {
  position: relative;
  min-height: 32rem;
}

.desktop-device {
  position: absolute;
  inset: 2rem 0 auto;
  padding: 0.65rem;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 1.7rem;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.16), rgba(255, 255, 255, 0.035));
  box-shadow: 0 38px 95px rgba(0, 0, 0, 0.42);
}

.device-screen {
  position: relative;
  overflow: hidden;
  aspect-ratio: 16 / 10;
  border-radius: 1.18rem;
  background: #111;
}

.device-screen > img,
.phone-device > img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.nora-window {
  position: absolute;
  inset: 13% 10%;
  display: grid;
  grid-template-columns: 5.5rem 1fr;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(10, 10, 10, 0.7);
  -webkit-backdrop-filter: blur(16px);
  backdrop-filter: blur(16px);
}

.window-sidebar {
  display: grid;
  align-content: start;
  gap: 0.65rem;
  padding: 1rem;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.window-sidebar span {
  height: 2.1rem;
  background: rgba(255, 255, 255, 0.11);
}

.window-main {
  display: grid;
  align-content: center;
  gap: 1rem;
  padding: 1.2rem;
}

.prompt-card {
  padding: 1rem;
  background: rgba(255, 255, 255, 0.11);
  font-size: 0.86rem;
  font-weight: 650;
}

.run-stack {
  display: grid;
  gap: 0.55rem;
}

.run-stack span {
  height: 0.65rem;
  background: rgba(255, 255, 255, 0.12);
}

.run-stack span:nth-child(2) {
  width: 78%;
}

.run-stack span:nth-child(3) {
  width: 54%;
}

.phone-device {
  position: absolute;
  right: -1rem;
  bottom: 0;
  width: min(38%, 13rem);
  aspect-ratio: 9 / 18;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 2rem;
  background: #111;
  box-shadow: 0 26px 70px rgba(0, 0, 0, 0.44);
  animation: floatDevice 5.6s ease-in-out infinite;
}

@keyframes floatDevice {
  0%, 100% {
    transform: translateY(0) rotate(2deg);
  }
  50% {
    transform: translateY(-0.9rem) rotate(1deg);
  }
}

.phone-pill {
  position: absolute;
  left: 50%;
  bottom: 1.1rem;
  transform: translateX(-50%);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 999px;
  padding: 0.55rem 0.78rem;
  background: rgba(0, 0, 0, 0.48);
  color: rgba(255, 255, 255, 0.72);
  font-size: 0.74rem;
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
}

.controls-section {
  min-height: 46rem;
}

.controls-shell {
  display: grid;
  grid-template-columns: 0.9fr 1.1fr;
  gap: 4rem;
  align-items: center;
  width: min(100%, 80rem);
  margin: 0 auto;
}

.glass-toolbar {
  grid-column: 2;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  width: fit-content;
  max-width: 100%;
  margin: 0 auto;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 999px;
  padding: 0.55rem;
  background:
    radial-gradient(circle at 32% 10%, rgba(255, 255, 255, 0.17), transparent 32%),
    rgba(255, 255, 255, 0.065);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.36),
    0 22px 56px rgba(0, 0, 0, 0.38);
  -webkit-backdrop-filter: blur(22px) saturate(1.4);
  backdrop-filter: blur(22px) saturate(1.4);
}

.glass-toolbar button {
  display: grid;
  width: 3.1rem;
  height: 3.1rem;
  place-items: center;
  border: 0;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  cursor: pointer;
  transition: transform 180ms ease, background 180ms ease;
}

.glass-toolbar button:hover {
  background: rgba(255, 255, 255, 0.16);
  transform: translateY(-2px) scale(1.04);
}

.glass-toolbar img {
  width: 1.3rem;
  height: 1.3rem;
  object-fit: contain;
  filter: invert(1);
  opacity: 0.82;
}

.control-board {
  grid-column: 2;
  display: grid;
  gap: 0.85rem;
  max-width: 31rem;
  margin: 2rem auto 0;
}

.control-card {
  display: grid;
  gap: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.13);
  padding: 1rem;
  background: rgba(255, 255, 255, 0.04);
}

.control-card span {
  color: var(--screen-muted);
  font-size: 0.78rem;
}

.control-card strong {
  font-weight: 650;
}

.slider-row,
.mini-progress {
  position: relative;
  height: 0.44rem;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.11);
}

.slider-row i {
  display: block;
  width: 64%;
  height: 100%;
  background: var(--screen-accent);
  animation: sliderPulse 3.8s ease-in-out infinite;
}

@keyframes sliderPulse {
  0%, 100% {
    width: 42%;
  }
  50% {
    width: 78%;
  }
}

.toggle {
  width: 3rem;
  height: 1.55rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
  padding: 0.18rem;
}

.toggle::before {
  display: block;
  width: 1.18rem;
  height: 1.18rem;
  border-radius: 999px;
  content: "";
  background: white;
  transform: translateX(1.45rem);
}

.mini-progress {
  display: grid;
  grid-template-columns: 1.2fr 0.6fr 0.9fr;
  gap: 0.25rem;
  background: transparent;
}

.mini-progress i {
  background: rgba(255, 255, 255, 0.18);
}

.mini-progress i:first-child {
  background: rgba(209, 136, 95, 0.75);
}

.performance-section {
  display: grid;
  grid-template-columns: 0.8fr 1.2fr;
  gap: 4rem;
  align-items: start;
}

.performance-copy {
  position: sticky;
  top: 8rem;
}

.performance-copy a {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2rem;
  font-size: 0.92rem;
  font-weight: 650;
}

.comparison-table {
  border-top: 1px solid rgba(255, 255, 255, 0.16);
}

.table-row {
  display: grid;
  grid-template-columns: 1fr 0.7fr 0.8fr;
  gap: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.13);
  padding: 1.1rem 0;
  color: var(--screen-muted);
  font-size: 0.92rem;
}

.table-row strong {
  color: var(--screen-fg);
  font-weight: 680;
}

.table-head {
  color: var(--screen-fg);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.feature-card {
  min-height: 27rem;
  border: 1px solid rgba(255, 255, 255, 0.13);
  padding: 1.2rem;
  background: rgba(255, 255, 255, 0.035);
  transition: border-color 220ms ease, transform 220ms ease, background 220ms ease;
}

.feature-card:hover {
  border-color: rgba(255, 255, 255, 0.28);
  background: rgba(255, 255, 255, 0.052);
  transform: translateY(-0.28rem);
}

.card-visual {
  position: relative;
  height: 16rem;
  margin-bottom: 1.4rem;
  overflow: hidden;
  background:
    radial-gradient(circle at 50% 0%, rgba(209, 136, 95, 0.2), transparent 16rem),
    rgba(0, 0, 0, 0.32);
}

.card-visual span {
  position: absolute;
  background: rgba(255, 255, 255, 0.16);
}

.is-providers .card-visual span {
  width: 70%;
  height: 2.6rem;
  left: 15%;
  border-radius: 999px;
}

.is-providers .card-visual span:nth-child(1) {
  top: 25%;
}

.is-providers .card-visual span:nth-child(2) {
  top: 44%;
  background: rgba(209, 136, 95, 0.42);
}

.is-providers .card-visual span:nth-child(3) {
  top: 63%;
}

.is-gate .card-visual span {
  inset: auto auto 32% 50%;
  width: 7rem;
  height: 7rem;
  border: 1px solid rgba(255, 255, 255, 0.28);
  background: transparent;
  transform: translateX(-50%) rotate(45deg);
}

.is-gate .card-visual span:nth-child(2) {
  width: 4.2rem;
  height: 4.2rem;
}

.is-gate .card-visual span:nth-child(3) {
  width: 1.4rem;
  height: 1.4rem;
  background: var(--screen-accent);
}

.is-skills .card-visual span {
  width: 5.2rem;
  height: 5.2rem;
  border-radius: 1.2rem;
  animation: floatSkill 4.4s ease-in-out infinite;
}

.is-skills .card-visual span:nth-child(1) {
  left: 16%;
  top: 20%;
}

.is-skills .card-visual span:nth-child(2) {
  right: 16%;
  top: 36%;
  animation-delay: 0.5s;
}

.is-skills .card-visual span:nth-child(3) {
  left: 33%;
  bottom: 15%;
  background: rgba(209, 136, 95, 0.42);
  animation-delay: 1s;
}

@keyframes floatSkill {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-0.8rem);
  }
}

.feature-card h3 {
  margin: 0 0 0.75rem;
  font-size: 1.3rem;
  line-height: 1.18;
}

.faq-section {
  display: grid;
  grid-template-columns: 0.75fr 1.25fr;
  gap: 4rem;
}

.faq-list {
  display: grid;
  gap: 0.65rem;
}

.faq-list details {
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  padding: 1.15rem 0;
}

.faq-list summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  color: var(--screen-fg);
  cursor: pointer;
  font-weight: 650;
  list-style: none;
}

.faq-list summary::-webkit-details-marker {
  display: none;
}

.faq-list summary span {
  flex: 0 0 auto;
  color: var(--screen-muted);
  transition: transform 220ms ease;
}

.faq-list details[open] summary span {
  transform: rotate(180deg);
}

.faq-list p {
  max-width: 42rem;
  padding-top: 1rem;
}

.screen-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  width: min(100% - 6rem, 80rem);
  margin: 0 auto;
  border-top: 1px solid rgba(255, 255, 255, 0.13);
  padding: 2rem 0 3rem;
}

.screen-footer nav {
  display: flex;
  flex-wrap: wrap;
  gap: 1.2rem;
  color: var(--screen-muted);
  font-size: 0.9rem;
}

.screen-footer nav a {
  transition: color 180ms ease;
}

.screen-footer nav a:hover {
  color: var(--screen-fg);
}

.reveal {
  opacity: 0;
  transform: translateY(3rem);
  transition:
    opacity 900ms cubic-bezier(0.16, 1, 0.3, 1),
    transform 900ms cubic-bezier(0.16, 1, 0.3, 1);
}

.reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}

@media (max-width: 980px) {
  .screen-nav,
  .header-download {
    display: none;
  }

  .mobile-menu-button {
    display: grid;
    width: 2.45rem;
    height: 2.45rem;
    place-items: center;
    border: 1px solid rgba(255, 255, 255, 0.18);
    background: rgba(5, 5, 5, 0.7);
    color: white;
    -webkit-backdrop-filter: blur(14px);
    backdrop-filter: blur(14px);
  }

  .mobile-panel {
    position: absolute;
    top: 4.75rem;
    left: 1.5rem;
    right: 1.5rem;
    display: grid;
    gap: 0.35rem;
    border: 1px solid rgba(255, 255, 255, 0.16);
    background: rgba(5, 5, 5, 0.86);
    padding: 0.7rem;
    -webkit-backdrop-filter: blur(18px);
    backdrop-filter: blur(18px);
  }

  .mobile-panel a {
    padding: 0.85rem;
    color: rgba(255, 255, 255, 0.76);
  }

  .mobile-panel-enter-active,
  .mobile-panel-leave-active {
    transition: opacity 220ms ease, transform 220ms ease;
  }

  .mobile-panel-enter-from,
  .mobile-panel-leave-to {
    opacity: 0;
    transform: translateY(-0.5rem);
  }

  .hero-bottom,
  .feature-list,
  .mockup-section,
  .controls-shell,
  .performance-section,
  .cards-grid,
  .faq-section {
    grid-template-columns: 1fr;
  }

  .hero-bottom {
    align-items: flex-start;
    flex-direction: column;
  }

  .controls-copy,
  .glass-toolbar,
  .control-board {
    grid-column: auto;
  }

  .performance-copy {
    position: static;
  }
}

@media (max-width: 760px) {
  .screen-header {
    padding: 1.25rem 1.5rem;
  }

  .hero-stage {
    justify-content: flex-start;
    min-height: 100svh;
    padding: 8rem 1.5rem 2rem;
  }

  .hero-title-wrap {
    transform: none;
  }

  .hero-title {
    max-width: none;
    font-size: clamp(3rem, 15vw, 5.25rem);
    line-height: 0.96;
  }

  .hero-title-line {
    white-space: normal;
  }

  .hero-bottom {
    position: relative;
    left: auto;
    right: auto;
    bottom: auto;
    margin-top: 3rem;
  }

  .hero-stats {
    gap: 1.4rem;
  }

  .feature-section,
  .mockup-section,
  .controls-section,
  .performance-section,
  .cards-section,
  .faq-section {
    padding: 5.5rem 1.5rem;
  }

  .demo-surface {
    grid-template-columns: 1fr;
    min-height: 33rem;
  }

  .diff-panel {
    min-height: 12rem;
  }

  .feature-list {
    grid-template-columns: 1fr;
  }

  .device-stage {
    min-height: 25rem;
  }

  .phone-device {
    right: 0.5rem;
    width: 8rem;
  }

  .screen-footer {
    align-items: flex-start;
    flex-direction: column;
    width: calc(100% - 3rem);
  }

  .table-row {
    grid-template-columns: 1fr;
    gap: 0.45rem;
  }
}

@media (max-height: 760px) and (min-width: 761px) {
  .hero-title {
    font-size: clamp(3rem, min(8.2vw, 12.4vh), 7.4rem);
  }

  .hero-title-wrap {
    transform: translateY(calc(clamp(1rem, 7vh, 4.25rem) * -1));
  }
}

@media (prefers-reduced-motion: reduce) {
  .screen-home *,
  .screen-home *::before,
  .screen-home *::after {
    animation-duration: 1ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: 1ms !important;
  }

  .motion-glyph,
  .hero-reveal,
  .reveal {
    opacity: 1;
    filter: none;
    transform: none;
  }
}
</style>
