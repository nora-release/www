<script setup lang="ts">
import { computed, ref } from 'vue'
import type { NavItem } from '../data/home'

type HeaderUser = {
  login: string
  avatarUrl: string
}

const props = withDefaults(
  defineProps<{
    navItems: NavItem[]
    brandHref?: string
    ctaHref?: string
    ctaLabel?: string
    ctaIcon?: string
    user?: HeaderUser | null
    isAuthLoading?: boolean
  }>(),
  {
    brandHref: '/',
    ctaLabel: 'Login',
    ctaIcon: 'i-lucide-github',
    user: null,
    isAuthLoading: false,
  },
)

const isMenuOpen = ref(false)
const route = useRoute()
const loginHref = computed(() => {
  return `/auth/github?next=${encodeURIComponent(route.fullPath || '/')}`
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

      <NuxtLink
        v-if="user"
        class="nav-account"
        to="/feedback"
        :aria-label="`Signed in as ${user.login}`"
      >
        <img
          class="nav-account-avatar"
          :src="user.avatarUrl"
          alt=""
          width="34"
          height="34"
        >
        <span>@{{ user.login }}</span>
      </NuxtLink>

      <span
        v-else-if="isAuthLoading"
        class="nav-account nav-account-loading"
        aria-label="Loading account"
      >
        <span class="i-lucide-loader-circle size-[1.0625rem]" aria-hidden="true" />
      </span>

      <a v-else class="nav-cta" :href="primaryCtaHref">
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
        v-if="!user && !isAuthLoading"
        class="mobile-cta"
        :href="primaryCtaHref"
        @click="closeMenu"
      >
        {{ ctaLabel }}
        <span :class="[ctaIcon, 'size-[1.0625rem]']" aria-hidden="true" />
      </a>
      <span
        v-else-if="isAuthLoading"
        class="mobile-account mobile-account-loading"
        aria-label="Loading account"
      >
        <span class="i-lucide-loader-circle size-[1.0625rem]" aria-hidden="true" />
      </span>
      <NuxtLink
        v-else
        class="mobile-account"
        to="/feedback"
        @click="closeMenu"
      >
        <img
          class="nav-account-avatar"
          :src="user.avatarUrl"
          alt=""
          width="34"
          height="34"
        >
        <span>@{{ user.login }}</span>
      </NuxtLink>
    </div>
  </header>
</template>
