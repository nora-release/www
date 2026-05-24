<script setup lang="ts">
import {
  downloadHref,
  faqs,
  features,
  footerLinks,
  navItems,
  workModes,
} from './data/home'

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
  <div class="home-page">
    <NuxtRouteAnnouncer />

    <AppHeader :nav-items="navItems" :download-href="downloadHref" />

    <main id="top">
      <HeroSection :download-href="downloadHref" />
      <WorkModesSection :modes="workModes" />
      <FeaturesSection :features="features" />
      <FaqSection :items="faqs" />
      <DownloadSection :download-href="downloadHref" />
    </main>

    <SiteFooter :links="footerLinks" />
  </div>
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
