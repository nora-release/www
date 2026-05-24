<script setup lang="ts">
withDefaults(
  defineProps<{
    href?: string
    ariaLabel?: string
  }>(),
  {
    href: '#top',
    ariaLabel: 'Nora home',
  },
)

const emit = defineEmits<{
  navigate: []
}>()

const iconSrc = '/default/icon_128x128.png'

const handleClick = () => {
  emit('navigate')
}
</script>

<template>
  <a class="brand" :href="href" :aria-label="ariaLabel" @click="handleClick">
    <span class="brand-mark" aria-hidden="true">
      <img :src="iconSrc" alt="" width="42" height="42">
    </span>
    <span>Nora</span>
  </a>
</template>
