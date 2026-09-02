<template>
  <div class="flex items-center space-x-3 overflow-x-auto hide-scrollbar py-2">
    <button
      v-for="season in validSeasons"
      :key="season.id || season.season_number"
      @click="$emit('update:modelValue', season.season_number)"
      class="px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200"
      :class="[
        modelValue === season.season_number
          ? 'bg-marxi-accent text-white shadow-glow-red'
          : 'bg-marxi-800 text-gray-300 hover:bg-marxi-700 hover:text-white border border-marxi-700'
      ]"
    >
      {{ season.name || `Season ${season.season_number}` }}
      <span class="ml-1 text-xs opacity-75">({{ season.episode_count }} Ep)</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import type { Season } from '~/types/tmdb';

const props = defineProps<{
  seasons: Season[];
  modelValue: number;
}>();

defineEmits(['update:modelValue']);

// Exclude specials (season 0) if desired, or include all
const validSeasons = computed(() => {
  return props.seasons ? props.seasons.filter(s => s.season_number > 0) : [];
});
</script>
