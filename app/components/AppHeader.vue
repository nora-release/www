<script setup lang="ts">
import { computed, ref } from 'vue'
import type { NavItem } from '../data/home'

const props = withDefaults(
  defineProps<{
    navItems: NavItem[]
    brandHref?: string
    ctaHref?: string
    ctaLabel?: string
    ctaIcon?: string
  }>(),
  {
    brandHref: '/',
    ctaLabel: 'Login',
    ctaIcon: 'i-lucide-github',
  },
)

const isMenuOpen = ref(false)
const route = useRoute()
const loginHref = computed(() => {
  return `/api/auth/github?next=${encodeURIComponent(route.fullPath || '/')}`
})
const primaryCtaHref = computed(() => props.ctaHref ?? loginHref.value)

const closeMenu = () => {
  isMenuOpen.value = false
}
</script>

<template>
  <header class="nav-wrap">
    <nav class="site-nav" aria-label="Primary navigation">
      <BrandLink :href="brandHref" @navigate="closeMenu" />

      <div class="nav-links" aria-label="Main sections">
        <a v-for="item in navItems" :key="item.href" :href="item.href">
          {{ item.label }}
        </a>
      </div>

      <a class="nav-cta" :href="primaryCtaHref">
        {{ ctaLabel }}
        <span :class="[ctaIcon, 'size-[1.0625rem]']" aria-hidden="true" />
      </a>

      <button
        class="menu-button"
        type="button"
        aria-label="Toggle navigation menu"
        :aria-expanded="isMenuOpen"
        aria-controls="mobile-menu"
        @click="isMenuOpen = !isMenuOpen"
      >
        <span
          v-if="!isMenuOpen"
          class="i-lucide-menu size-[1.375rem]"
          aria-hidden="true"
        />
        <span
          v-else
          class="i-lucide-x size-[1.375rem]"
          aria-hidden="true"
        />
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
        :href="primaryCtaHref"
        @click="closeMenu"
      >
        {{ ctaLabel }}
        <span :class="[ctaIcon, 'size-[1.0625rem]']" aria-hidden="true" />
      </a>
    </div>
  </header>
</template>
