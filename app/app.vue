<script setup lang="ts">
useHead({
  htmlAttrs: {
    lang: 'en',
  },
  title: 'Nora - Unified AI desktop app',
  meta: [
    {
      name: 'description',
      content:
        'Nora is a beautiful desktop application that unifies your AI experience across OpenAI, Anthropic, Google Gemini, and custom providers.',
    },
  ],
  link: [
    {
      rel: 'preconnect',
      href: 'https://fonts.googleapis.com',
    },
    {
      rel: 'preconnect',
      href: 'https://fonts.gstatic.com',
      crossorigin: '',
    },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght,SOFT@9..144,600..800,70..100&family=Nunito:wght@400;500;600;700;800&display=swap',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      href: '/default/icon_32x32.png',
    },
    {
      rel: 'apple-touch-icon',
      sizes: '128x128',
      href: '/default/icon_128x128.png',
    },
  ],
})

</script>

<template>
  <NuxtRouteAnnouncer />
  <NuxtPage />
</template>

<style>
:root {
  --background: #fdfcf8;
  --foreground: #2c2c24;
  --primary: #5d7052;
  --primary-foreground: #f3f4f1;
  --secondary: #c18c5d;
  --secondary-foreground: #ffffff;
  --accent: #e6dccd;
  --accent-foreground: #4a4a40;
  --muted: #f0ebe5;
  --muted-foreground: #78786c;
  --border: #ded8cf;
  --destructive: #a85448;
  --paper: #fefefa;
  --soft-shadow: 0 4px 20px -2px rgba(93, 112, 82, 0.15);
  --float-shadow: 0 18px 50px -16px rgba(193, 140, 93, 0.35);
  --font-heading: 'Fraunces', Georgia, serif;
  --font-body: 'Nunito', system-ui, sans-serif;
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  background: var(--background);
  color: var(--foreground);
  font-family: var(--font-body);
}

body,
button,
input,
textarea,
select {
  font: inherit;
}

a {
  color: inherit;
  text-decoration: none;
}

button {
  border: 0;
}

button,
a {
  -webkit-tap-highlight-color: transparent;
}

button:focus-visible,
a:focus-visible,
summary:focus-visible {
  outline: 0;
  box-shadow: 0 0 0 3px rgba(93, 112, 82, 0.3), 0 0 0 6px rgba(253, 252, 248, 0.9);
}

.home-page {
  position: relative;
  min-height: 100vh;
  overflow-x: hidden;
  background:
    radial-gradient(circle at 12% 7%, rgba(230, 220, 205, 0.78), transparent 26rem),
    radial-gradient(circle at 88% 12%, rgba(193, 140, 93, 0.16), transparent 22rem),
    var(--background);
}

.home-page::before {
  position: fixed;
  inset: 0;
  z-index: 1000;
  pointer-events: none;
  content: '';
  opacity: 0.04;
  mix-blend-mode: multiply;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180' viewBox='0 0 180 180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='.45'/%3E%3C/svg%3E");
}

.section-shell {
  width: min(100% - 2rem, 1180px);
  margin: 0 auto;
}

.nav-wrap {
  position: fixed;
  top: 1rem;
  left: 50%;
  z-index: 50;
  width: min(100% - 4rem, 1120px);
  margin: 0;
  transform: translateX(-50%);
}

main {
  padding-top: 5.25rem;
}

#features,
#faq,
#download {
  scroll-margin-top: 7rem;
}

.site-nav,
.mobile-panel {
  border: 1px solid rgba(222, 216, 207, 0.7);
  background: rgba(255, 255, 255, 0.72);
  box-shadow: var(--soft-shadow);
  backdrop-filter: blur(18px);
}

.site-nav {
  display: flex;
  min-height: 4.25rem;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.5rem 0.55rem 0.5rem 0.85rem;
  border-radius: 999px;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  color: var(--foreground);
  font-family: var(--font-heading);
  font-size: 1.28rem;
  font-weight: 760;
  letter-spacing: 0;
}

.brand-mark {
  display: grid;
  width: 2.65rem;
  height: 2.65rem;
  place-items: center;
  flex: 0 0 auto;
  border-radius: 1rem;
  background: transparent;
  box-shadow: 0 12px 28px -16px rgba(44, 44, 36, 0.55);
  overflow: hidden;
}

.brand-mark img {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: inherit;
  object-fit: cover;
}

.nav-links {
  display: none;
  align-items: center;
  gap: 0.2rem;
  color: var(--muted-foreground);
  font-size: 0.96rem;
  font-weight: 800;
}

.nav-links a {
  padding: 0.8rem 1rem;
  border-radius: 999px;
  transition: color 220ms ease, background 220ms ease;
}

.nav-links a:hover {
  background: rgba(93, 112, 82, 0.1);
  color: var(--primary);
}

.nav-cta,
.mobile-cta,
.button {
  display: inline-flex;
  min-height: 3rem;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  border-radius: 999px;
  font-weight: 850;
  transition:
    transform 300ms ease,
    box-shadow 300ms ease,
    background 300ms ease,
    color 300ms ease,
    border-color 300ms ease;
}

.nav-cta {
  display: none;
  padding: 0 1.35rem;
  background: var(--primary);
  color: var(--primary-foreground);
  box-shadow: var(--soft-shadow);
}

.nav-cta:hover,
.button-primary:hover,
.mobile-cta:hover {
  transform: scale(1.045);
  box-shadow: 0 12px 28px -12px rgba(93, 112, 82, 0.5);
}

.nav-cta:active,
.button:active,
.mobile-cta:active,
.menu-button:active {
  transform: scale(0.96);
}

.menu-button {
  display: grid;
  width: 3rem;
  height: 3rem;
  place-items: center;
  border-radius: 999px;
  background: rgba(93, 112, 82, 0.1);
  color: var(--primary);
  cursor: pointer;
  transition: transform 260ms ease, background 260ms ease;
}

.menu-button:hover {
  background: rgba(93, 112, 82, 0.16);
}

.mobile-panel {
  display: grid;
  gap: 0.35rem;
  margin-top: 0.75rem;
  padding: 1rem;
  border-radius: 2rem 2.8rem 2rem 2.4rem;
}

.mobile-panel a {
  min-height: 3rem;
  padding: 0.8rem 1rem;
  border-radius: 999px;
  color: var(--accent-foreground);
  font-weight: 800;
}

.mobile-panel a:hover {
  background: rgba(230, 220, 205, 0.72);
}

.mobile-panel .mobile-cta {
  margin-top: 0.25rem;
  background: var(--primary);
  color: var(--primary-foreground);
}

.hero {
  position: relative;
  padding: 3.6rem 0 2.75rem;
}

.hero-grid {
  position: relative;
  z-index: 1;
  display: grid;
  gap: 3.5rem;
  align-items: center;
}

.hero-copy {
  max-width: 46rem;
}

.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 1.15rem;
  color: var(--primary);
  font-size: 0.92rem;
  font-weight: 900;
  letter-spacing: 0;
  text-transform: uppercase;
}

h1,
h2,
h3,
p {
  margin-top: 0;
}

h1,
h2,
h3 {
  font-family: var(--font-heading);
  font-weight: 760;
  letter-spacing: 0;
  line-height: 1.02;
}

h1 {
  max-width: 13ch;
  margin-bottom: 1.35rem;
  font-size: 3.25rem;
}

.hero-text {
  max-width: 40rem;
  margin-bottom: 2rem;
  color: var(--muted-foreground);
  font-size: 1.12rem;
  line-height: 1.78;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.9rem;
}

.button {
  min-height: 3.4rem;
  padding: 0 1.7rem;
  font-size: 1rem;
}

.button-primary {
  background: var(--primary);
  color: var(--primary-foreground);
  box-shadow: var(--soft-shadow);
}

.button-outline {
  border: 2px solid var(--secondary);
  color: var(--secondary);
}

.button-outline:hover {
  background: rgba(193, 140, 93, 0.1);
  transform: scale(1.035);
}

.hero-visual {
  position: relative;
  min-height: 27rem;
}

.release-board {
  position: relative;
  z-index: 1;
  width: min(100%, 34rem);
  margin: 0 auto;
  padding: 1.35rem;
  border: 1px solid rgba(222, 216, 207, 0.72);
  border-radius: 3.2rem 2.2rem 4rem 2.45rem;
  background:
    linear-gradient(145deg, rgba(255, 255, 255, 0.9), rgba(254, 254, 250, 0.76)),
    var(--paper);
  box-shadow: var(--float-shadow);
  transform: rotate(-1.5deg);
}

.release-board::before {
  position: absolute;
  inset: 0.65rem;
  z-index: -1;
  content: '';
  border: 1px solid rgba(222, 216, 207, 0.6);
  border-radius: 2.7rem 2rem 3.6rem 2.1rem;
}

.board-header,
.source-row,
.story-grid {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.board-header {
  margin-bottom: 1.15rem;
}

.board-kicker,
.board-status,
.story-label,
.source-row span {
  font-size: 0.78rem;
  font-weight: 900;
  letter-spacing: 0;
  text-transform: uppercase;
}

.board-kicker {
  color: var(--muted-foreground);
}

.board-status {
  padding: 0.5rem 0.8rem;
  border-radius: 999px;
  background: rgba(93, 112, 82, 0.12);
  color: var(--primary);
}

.release-title {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 1.2rem;
  color: var(--foreground);
  font-family: var(--font-heading);
  font-size: 1.8rem;
  font-weight: 740;
  line-height: 1.14;
}

.release-title svg {
  flex: 0 0 auto;
  color: var(--secondary);
}

.source-row {
  flex-wrap: wrap;
  justify-content: flex-start;
  margin-bottom: 1rem;
}

.source-row span {
  padding: 0.52rem 0.72rem;
  border: 1px solid rgba(222, 216, 207, 0.7);
  border-radius: 999px;
  background: rgba(240, 235, 229, 0.72);
  color: var(--accent-foreground);
}

.story-card {
  padding: 1.25rem;
  border-radius: 2rem 3.2rem 2.2rem 2.6rem;
}

.story-card-primary {
  margin-bottom: 1rem;
  background: var(--primary);
  color: var(--primary-foreground);
  box-shadow: 0 16px 42px -22px rgba(93, 112, 82, 0.8);
}

.story-label {
  display: block;
  margin-bottom: 0.8rem;
  color: rgba(243, 244, 241, 0.78);
}

.story-card p {
  margin-bottom: 0;
  font-size: 1.06rem;
  line-height: 1.65;
}

.story-grid {
  display: grid;
  grid-template-columns: 1fr;
}

.mini-note {
  display: flex;
  min-height: 5.5rem;
  align-items: center;
  gap: 0.65rem;
  padding: 1rem;
  border: 1px solid rgba(222, 216, 207, 0.72);
  border-radius: 1.7rem 2.5rem 1.8rem 2.1rem;
  background: rgba(253, 252, 248, 0.82);
  color: var(--primary);
  font-weight: 900;
}

.mini-note-clay {
  color: var(--secondary);
}

.floating-note {
  position: absolute;
  z-index: 2;
  display: none;
  align-items: center;
  gap: 0.5rem;
  padding: 0.85rem 1rem;
  border: 1px solid rgba(222, 216, 207, 0.72);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.76);
  box-shadow: var(--soft-shadow);
  color: var(--accent-foreground);
  font-size: 0.9rem;
  font-weight: 900;
  backdrop-filter: blur(14px);
}

.floating-note svg {
  color: var(--primary);
}

.floating-note-right {
  top: 0.55rem;
  right: -0.35rem;
  transform: rotate(-4deg);
}

.ambient {
  position: absolute;
  z-index: 0;
  pointer-events: none;
  filter: blur(34px);
  opacity: 0.38;
}

.ambient-moss {
  top: 9rem;
  right: 5%;
  width: 21rem;
  height: 18rem;
  border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
  background: rgba(93, 112, 82, 0.28);
}

.ambient-clay {
  right: 28%;
  bottom: 2rem;
  width: 18rem;
  height: 16rem;
  border-radius: 35% 65% 58% 42% / 48% 38% 62% 52%;
  background: rgba(193, 140, 93, 0.26);
}

.work-section {
  padding: 0 1rem 5rem;
}

.work-grid {
  display: grid;
  width: min(100%, 1120px);
  margin: 0 auto;
  gap: 1rem;
}

.work-card {
  min-height: 13rem;
  padding: 1.55rem;
  border: 1px solid rgba(222, 216, 207, 0.68);
  border-radius: 2rem 2.6rem 2rem 2.9rem;
  background: rgba(254, 254, 250, 0.76);
  box-shadow: var(--soft-shadow);
  transition: transform 300ms ease, box-shadow 300ms ease;
}

.work-card:nth-child(2) {
  border-radius: 2.4rem 3.8rem 2rem 2.8rem;
}

.work-card:nth-child(3) {
  border-radius: 3.4rem 2rem 3.8rem 2.2rem;
}

.work-card:hover {
  transform: translateY(-0.25rem);
  box-shadow: 0 20px 40px -18px rgba(93, 112, 82, 0.35);
}

.work-card h2 {
  margin-bottom: 1rem;
  color: var(--secondary);
  font-family: var(--font-heading);
  font-size: 1.65rem;
  font-weight: 760;
  line-height: 1.12;
}

.work-card p {
  margin-bottom: 0;
  color: var(--muted-foreground);
  font-weight: 800;
  line-height: 1.6;
}

.features {
  padding: 5rem 0 6.5rem;
}

.section-heading {
  max-width: 46rem;
  margin-bottom: 2.5rem;
}

.section-heading h2,
.faq-copy h2,
.final-cta h2 {
  margin-bottom: 0;
  font-size: 2.45rem;
}

.feature-grid {
  display: grid;
  gap: 1.2rem;
}

.feature-card {
  min-height: 20rem;
  padding: 1.55rem;
  border: 1px solid rgba(222, 216, 207, 0.64);
  background: rgba(254, 254, 250, 0.88);
  box-shadow: var(--soft-shadow);
  transition: transform 360ms ease, box-shadow 360ms ease;
}

.feature-card:hover {
  transform: translateY(-0.35rem);
  box-shadow: 0 22px 46px -20px rgba(93, 112, 82, 0.42);
}

.feature-shape-1 {
  border-radius: 4rem 2rem 3rem 2.2rem;
}

.feature-shape-2 {
  border-radius: 2.2rem 4.6rem 2.5rem 3.5rem;
}

.feature-shape-3 {
  border-radius: 3rem 2.4rem 4.8rem 2.2rem;
}

.icon-bloom {
  display: grid;
  width: 3.65rem;
  height: 3.65rem;
  place-items: center;
  margin-bottom: 1.5rem;
  border-radius: 42% 58% 46% 54% / 54% 42% 58% 46%;
  background: rgba(93, 112, 82, 0.1);
  color: var(--primary);
  transition: background 300ms ease, color 300ms ease, transform 300ms ease;
}

.feature-card:hover .icon-bloom {
  background: var(--primary);
  color: var(--primary-foreground);
  transform: rotate(-3deg) scale(1.05);
}

.feature-card h3 {
  margin-bottom: 0.85rem;
  font-size: 1.55rem;
}

.feature-card p,
.faq-item p,
.final-cta p,
.site-footer p {
  color: var(--muted-foreground);
  line-height: 1.72;
}

.faq {
  display: grid;
  gap: 2rem;
  padding: 6.5rem 0;
}

.faq-copy {
  max-width: 30rem;
}

.faq-list {
  display: grid;
  gap: 0.9rem;
}

.faq-item {
  border: 1px solid rgba(222, 216, 207, 0.7);
  border-radius: 1.8rem 2.4rem 1.8rem 2.1rem;
  background: rgba(254, 254, 250, 0.82);
  box-shadow: var(--soft-shadow);
  overflow: hidden;
}

.faq-item summary {
  display: flex;
  min-height: 4.75rem;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.2rem;
  color: var(--foreground);
  cursor: pointer;
  font-weight: 900;
  list-style: none;
}

.faq-item summary::-webkit-details-marker {
  display: none;
}

.faq-item summary svg {
  flex: 0 0 auto;
  color: var(--primary);
  transition: transform 300ms ease;
}

.faq-item[open] summary svg {
  transform: rotate(180deg);
}

.faq-item p {
  margin: 0;
  padding: 0 1.2rem 1.25rem;
}

.final-cta {
  position: relative;
  margin-bottom: 5rem;
  padding: 4rem 1.3rem;
  border-radius: 4.5rem 2.5rem 4rem 2.8rem;
  background: var(--primary);
  color: var(--primary-foreground);
  text-align: center;
  box-shadow: 0 28px 60px -28px rgba(93, 112, 82, 0.58);
  overflow: hidden;
}

.final-cta > * {
  position: relative;
  z-index: 1;
}

.final-cta .eyebrow,
.final-cta p {
  color: rgba(243, 244, 241, 0.82);
}

.final-cta h2 {
  width: min(100%, 13ch);
  margin: 0 auto 1rem;
}

.final-cta p {
  width: min(100%, 42rem);
  margin: 0 auto 2rem;
  font-size: 1.06rem;
}

.button-light {
  background: var(--primary-foreground);
  color: var(--primary);
}

.ambient-cta {
  inset: auto -4rem -6rem auto;
  width: 26rem;
  height: 18rem;
  border-radius: 34% 66% 44% 56% / 52% 42% 58% 48%;
  background: rgba(193, 140, 93, 0.55);
  opacity: 0.6;
}

.site-footer {
  display: grid;
  width: min(100% - 2rem, 1120px);
  align-items: center;
  gap: 1rem;
  margin: 0 auto;
  padding: 2rem 0 3rem;
  border-top: 1px solid rgba(222, 216, 207, 0.85);
}

.site-footer p {
  margin: 0;
}

.footer-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.95rem;
  color: var(--muted-foreground);
  font-weight: 850;
}

.footer-links a:hover {
  color: var(--primary);
}

.feedback-page {
  min-height: 100vh;
  overflow-x: hidden;
  background:
    linear-gradient(180deg, rgba(240, 235, 229, 0.86), rgba(253, 252, 248, 0) 26rem),
    var(--background);
  color: var(--foreground);
}

.feedback-page button {
  cursor: pointer;
}

.feedback-page button:disabled,
.feedback-page .button[aria-disabled='true'] {
  cursor: not-allowed;
  opacity: 0.58;
  transform: none;
}

.feedback-shell {
  padding-bottom: 3rem;
}

.feedback-hero {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 2rem;
  padding: 3rem 0 1.5rem;
}

.feedback-hero-copy {
  max-width: 42rem;
}

.feedback-hero h1 {
  max-width: 18ch;
  margin-bottom: 0.85rem;
  font-size: 2.8rem;
}

.feedback-hero p:not(.eyebrow) {
  margin-bottom: 0;
  color: var(--muted-foreground);
  font-size: 1.06rem;
  line-height: 1.72;
}

.feedback-hero-meta {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.7rem;
}

.feedback-stat {
  display: inline-flex;
  min-height: 3rem;
  align-items: center;
  gap: 0.55rem;
  padding: 0.72rem 0.95rem;
  border: 1px solid rgba(222, 216, 207, 0.78);
  border-radius: 999px;
  background: rgba(254, 254, 250, 0.78);
  color: var(--accent-foreground);
  font-weight: 900;
  box-shadow: var(--soft-shadow);
}

.feedback-state,
.feedback-login {
  display: grid;
  align-items: center;
  gap: 1.1rem;
  margin-top: 1rem;
  padding: 1.4rem;
  border: 1px solid rgba(222, 216, 207, 0.74);
  border-radius: 2.1rem;
  background: rgba(254, 254, 250, 0.86);
  box-shadow: var(--soft-shadow);
}

.feedback-login {
  grid-template-columns: auto 1fr auto;
}

.feedback-login-icon {
  display: grid;
  width: 3.4rem;
  height: 3.4rem;
  place-items: center;
  border-radius: 1.15rem;
  background: var(--foreground);
  color: var(--primary-foreground);
  font-size: 1.65rem;
}

.feedback-login h2 {
  margin: 0 0 0.25rem;
  font-size: 1.65rem;
}

.feedback-login p {
  margin: 0;
  color: var(--muted-foreground);
  line-height: 1.58;
}

.feedback-workspace {
  display: grid;
  gap: 1rem;
  align-items: start;
  padding: 1rem 0 4rem;
}

.feedback-sidebar,
.feedback-detail {
  border: 1px solid rgba(222, 216, 207, 0.74);
  border-radius: 2rem;
  background: rgba(254, 254, 250, 0.84);
  box-shadow: var(--soft-shadow);
}

.feedback-sidebar {
  display: grid;
  gap: 1rem;
  padding: 1rem;
}

.feedback-detail {
  min-height: 34rem;
  padding: 1.1rem;
}

.feedback-account {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 0.75rem;
}

.feedback-account span,
.feedback-list-meta,
.feedback-message-author span,
.feedback-admin-bar span {
  color: var(--muted-foreground);
  font-size: 0.86rem;
  font-weight: 800;
}

.feedback-account strong,
.feedback-message-author strong,
.feedback-admin-bar strong {
  display: block;
  color: var(--foreground);
}

.feedback-avatar,
.feedback-message-avatar {
  display: block;
  border: 1px solid rgba(222, 216, 207, 0.82);
  border-radius: 999px;
  background: var(--muted);
  object-fit: cover;
}

.feedback-avatar {
  width: 2.75rem;
  height: 2.75rem;
}

.feedback-icon-button {
  display: grid;
  width: 2.7rem;
  height: 2.7rem;
  place-items: center;
  border-radius: 999px;
  background: rgba(93, 112, 82, 0.1);
  color: var(--primary);
  transition: background 220ms ease, transform 220ms ease;
}

.feedback-icon-button:hover {
  background: rgba(93, 112, 82, 0.16);
}

.feedback-icon-button:active {
  transform: scale(0.96);
}

.feedback-form,
.feedback-reply-form {
  display: grid;
  gap: 0.8rem;
}

.feedback-admin-panel {
  display: grid;
  gap: 0.75rem;
  border-top: 1px solid rgba(222, 216, 207, 0.74);
  padding-top: 1rem;
}

.feedback-admin-form {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: end;
  gap: 0.65rem;
}

.feedback-admin-add {
  min-height: 3rem;
  padding-right: 1rem;
  padding-left: 1rem;
}

.feedback-admin-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.feedback-admin-list span {
  display: inline-flex;
  min-height: 2rem;
  align-items: center;
  border: 1px solid rgba(93, 112, 82, 0.16);
  border-radius: 999px;
  background: rgba(93, 112, 82, 0.08);
  padding: 0.25rem 0.65rem;
  color: var(--primary);
  font-size: 0.84rem;
  font-weight: 900;
}

.feedback-field {
  display: grid;
  gap: 0.45rem;
  color: var(--accent-foreground);
  font-weight: 900;
}

.feedback-field input,
.feedback-field textarea {
  width: 100%;
  border: 1px solid rgba(222, 216, 207, 0.9);
  border-radius: 1.1rem;
  background: rgba(255, 255, 255, 0.72);
  color: var(--foreground);
  line-height: 1.5;
  outline: 0;
  transition: border-color 200ms ease, box-shadow 200ms ease, background 200ms ease;
}

.feedback-field input {
  min-height: 3rem;
  padding: 0 0.95rem;
}

.feedback-field textarea {
  min-height: 8rem;
  resize: vertical;
  padding: 0.85rem 0.95rem;
}

.feedback-field input:focus,
.feedback-field textarea:focus {
  border-color: rgba(93, 112, 82, 0.72);
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 0 0 3px rgba(93, 112, 82, 0.16);
}

.feedback-submit {
  width: 100%;
}

.feedback-list-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  color: var(--foreground);
  font-weight: 900;
}

.feedback-list {
  display: grid;
  gap: 0.65rem;
}

.feedback-list-item {
  display: grid;
  gap: 0.45rem;
  width: 100%;
  min-height: 5rem;
  padding: 0.85rem;
  border: 1px solid rgba(222, 216, 207, 0.72);
  border-radius: 1.15rem;
  background: rgba(255, 255, 255, 0.62);
  color: inherit;
  text-align: left;
  transition: border-color 220ms ease, background 220ms ease, transform 220ms ease;
}

.feedback-list-item:hover,
.feedback-list-item-active {
  border-color: rgba(93, 112, 82, 0.42);
  background: rgba(93, 112, 82, 0.08);
}

.feedback-list-item:hover {
  transform: translateY(-0.08rem);
}

.feedback-list-item-header {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: start;
  gap: 0.7rem;
}

.feedback-list-title {
  color: var(--foreground);
  font-weight: 900;
  line-height: 1.28;
  overflow-wrap: anywhere;
}

.feedback-list-meta {
  line-height: 1.42;
}

.feedback-status {
  display: inline-flex;
  min-height: 1.75rem;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  padding: 0.28rem 0.6rem;
  background: rgba(93, 112, 82, 0.12);
  color: var(--primary);
  font-size: 0.76rem;
  font-weight: 950;
  text-transform: uppercase;
}

.feedback-status-promoted {
  background: rgba(193, 140, 93, 0.16);
  color: var(--secondary);
}

.feedback-empty,
.feedback-detail-empty,
.feedback-inline-error,
.feedback-action-message,
.feedback-alert {
  margin: 0;
  line-height: 1.6;
}

.feedback-empty,
.feedback-detail-empty {
  color: var(--muted-foreground);
  font-weight: 800;
}

.feedback-inline-error,
.feedback-alert {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  color: var(--destructive);
  font-weight: 850;
}

.feedback-action-message {
  color: var(--primary);
  font-weight: 900;
}

.feedback-thread {
  display: grid;
  gap: 1rem;
}

.feedback-thread-header {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: start;
  gap: 1rem;
}

.feedback-thread-header h2 {
  margin: 0.65rem 0 0.45rem;
  font-size: 2.15rem;
  line-height: 1.1;
  overflow-wrap: anywhere;
}

.feedback-thread-header p {
  margin: 0;
  color: var(--muted-foreground);
  font-weight: 800;
}

.feedback-issue-link {
  display: inline-flex;
  min-height: 2.5rem;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  border-radius: 999px;
  background: rgba(193, 140, 93, 0.12);
  padding: 0 0.8rem;
  color: var(--secondary);
  font-weight: 900;
}

.feedback-description {
  margin: 0;
  padding: 1rem;
  border-radius: 1.15rem;
  background: rgba(240, 235, 229, 0.6);
  color: var(--accent-foreground);
  line-height: 1.7;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.feedback-message-list {
  display: grid;
  gap: 0.75rem;
}

.feedback-message {
  display: grid;
  gap: 0.7rem;
  padding: 1rem;
  border: 1px solid rgba(222, 216, 207, 0.68);
  border-radius: 1.15rem;
  background: rgba(255, 255, 255, 0.58);
}

.feedback-message p {
  margin: 0;
  line-height: 1.7;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.feedback-message-author {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

.feedback-message-avatar {
  width: 2rem;
  height: 2rem;
}

.feedback-actions,
.feedback-admin-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.feedback-admin-bar {
  border-top: 1px solid rgba(222, 216, 207, 0.74);
  padding-top: 1rem;
}

.feedback-detail-empty {
  display: grid;
  min-height: 31rem;
  place-items: center;
  align-content: center;
  gap: 0.8rem;
  text-align: center;
}

@media (min-width: 540px) {
  .story-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .hero-actions {
    align-items: center;
  }
}

@media (min-width: 760px) {
  h1 {
    font-size: 5.75rem;
  }

  .section-heading h2,
  .faq-copy h2,
  .final-cta h2 {
    font-size: 4.15rem;
  }

  .feedback-hero h1 {
    font-size: 4rem;
  }

  .work-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .feature-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .faq {
    grid-template-columns: 0.75fr 1.25fr;
  }

  .site-footer {
    grid-template-columns: auto 1fr auto;
  }
}

@media (min-width: 900px) {
  .nav-links,
  .nav-cta {
    display: flex;
  }

  .menu-button,
  .mobile-panel {
    display: none;
  }

  .hero-grid {
    grid-template-columns: minmax(0, 0.92fr) minmax(25rem, 1fr);
  }

  .hero {
    padding-top: 4.5rem;
  }

  .floating-note {
    display: flex;
  }

  .feedback-workspace {
    grid-template-columns: minmax(19rem, 0.42fr) minmax(0, 1fr);
  }

}

@media (min-width: 1120px) {
  .feature-card {
    padding: 1.9rem;
  }
}

@media (max-width: 760px) {
  .nav-wrap {
    width: min(100% - 2rem, 1120px);
  }

  .feedback-hero,
  .feedback-thread-header {
    align-items: stretch;
    grid-template-columns: 1fr;
  }

  .feedback-hero {
    display: grid;
  }

  .feedback-hero-meta {
    justify-content: flex-start;
  }

  .feedback-login {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 520px) {
  .section-shell {
    width: min(100% - 1.2rem, 1180px);
  }

  .nav-wrap {
    width: min(100% - 1rem, 1120px);
  }

  .site-nav {
    min-height: 3.8rem;
  }

  .brand {
    font-size: 1.12rem;
  }

  .brand-mark {
    width: 2.3rem;
    height: 2.3rem;
  }

  .hero {
    padding-top: 2.5rem;
  }

  h1 {
    font-size: 2.7rem;
  }

  .hero-text {
    font-size: 1rem;
  }

  .hero-grid {
    gap: 1.35rem;
  }

  .hero-actions .button {
    flex: 1 1 10rem;
    min-width: 0;
    padding-right: 1rem;
    padding-left: 1rem;
  }

  .hero-visual {
    min-height: 0;
  }

  .release-board {
    width: min(100%, 22rem);
    padding: 1rem;
    border-radius: 2.45rem 1.6rem 3rem 1.9rem;
  }

  .board-header {
    margin-bottom: 0.8rem;
  }

  .release-title {
    margin-bottom: 0.85rem;
    font-size: 1.32rem;
  }

  .source-row,
  .story-grid {
    display: none;
  }

  .story-card-primary {
    margin-bottom: 0;
  }

  .story-card {
    padding: 1rem;
  }

  .story-card p {
    font-size: 0.95rem;
    line-height: 1.5;
  }

  .section-heading h2,
  .faq-copy h2,
  .final-cta h2 {
    font-size: 2.25rem;
  }

  .feedback-hero {
    padding-top: 2.35rem;
  }

  .feedback-hero h1,
  .feedback-thread-header h2 {
    font-size: 2.25rem;
  }

  .feedback-actions .button,
  .feedback-admin-bar .button,
  .feedback-admin-add {
    width: 100%;
  }

  .feedback-admin-form {
    grid-template-columns: 1fr;
  }

  .work-grid {
    grid-template-columns: 1fr;
  }

  .work-card,
  .feature-card {
    min-height: auto;
  }

  .final-cta {
    border-radius: 3rem 1.7rem 3.4rem 2rem;
  }
}

@media (max-width: 520px) and (max-height: 760px) {
  .hero {
    padding-bottom: 2rem;
  }

  .hero-visual {
    position: absolute;
    right: -8.5rem;
    bottom: 0.25rem;
    width: 20rem;
    opacity: 0.16;
    pointer-events: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    transition-duration: 0.001ms !important;
    animation-duration: 0.001ms !important;
  }
}
</style>
