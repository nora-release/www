<script setup lang="ts">
import type { NavItem } from '../data/home'

defineProps<{
  links: NavItem[]
}>()
</script>

<template>
  <footer class="site-footer">
    <BrandLink />
    <p>A beautiful desktop application that unifies your AI experience.</p>
    <div class="footer-links">
      <a v-for="link in links" :key="link.href" :href="link.href">
        {{ link.label }}
      </a>
    </div>
  </footer>
</template>
