<template>
  <div class="flex flex-col items-center justify-center text-center py-16 px-4 space-y-4">
    <div class="w-16 h-16 rounded-full bg-marxi-800 border border-marxi-700 flex items-center justify-center text-gray-400">
      <slot name="icon">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
        </svg>
      </slot>
    </div>

    <div class="max-w-md space-y-1">
      <h3 class="font-display font-bold text-xl text-white">{{ title }}</h3>
      <p v-if="description" class="text-sm text-gray-400 leading-relaxed">{{ description }}</p>
    </div>

    <div v-if="$slots.action" class="pt-2">
      <slot name="action" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  description?: string;
}>();
</script>
