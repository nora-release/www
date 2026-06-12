<script setup lang="ts">
import {
  downloadHref,
  faqs,
  features,
  footerLinks,
  navItems,
  workModes,
} from '../data/home'
</script>

<template>
  <div class="home-page">
    <AppHeader
      :nav-items="navItems"
      :download-href="downloadHref"
      brand-href="#top"
    />

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
