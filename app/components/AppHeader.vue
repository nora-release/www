<script setup lang="ts">
import { ref } from 'vue'
import {
  Download as DownloadIcon,
  Menu,
  X,
} from '@lucide/vue'
import type { NavItem } from '../data/home'

defineProps<{
  navItems: NavItem[]
  downloadHref: string
}>()

const isMenuOpen = ref(false)

const closeMenu = () => {
  isMenuOpen.value = false
}
</script>

<template>
  <header class="nav-wrap">
    <nav class="site-nav" aria-label="Primary navigation">
      <BrandLink @navigate="closeMenu" />

      <div class="nav-links" aria-label="Main sections">
        <a v-for="item in navItems" :key="item.href" :href="item.href">
          {{ item.label }}
        </a>
      </div>

      <a class="nav-cta" :href="downloadHref">
        Download app
        <DownloadIcon :size="17" aria-hidden="true" />
      </a>

      <button
        class="menu-button"
        type="button"
        aria-label="Toggle navigation menu"
        :aria-expanded="isMenuOpen"
        aria-controls="mobile-menu"
        @click="isMenuOpen = !isMenuOpen"
      >
        <Menu v-if="!isMenuOpen" :size="22" aria-hidden="true" />
        <X v-else :size="22" aria-hidden="true" />
      </button>
    </nav>

    <div v-if="isMenuOpen" id="mobile-menu" class="mobile-panel">
      <a
        v-for="item in navItems"
        :key="item.href"
        :href="item.href"
        @click="closeMenu"
      >
        {{ item.label }}
      </a>
      <a
        class="mobile-cta"
        :href="downloadHref"
        @click="closeMenu"
      >
        Download app
        <DownloadIcon :size="17" aria-hidden="true" />
      </a>
    </div>
  </header>
</template>
