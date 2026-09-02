<template>
  <PlaybackPlayer
    :mediaType="type"
    :tmdbId="tmdbId"
    :season="season"
    :episode="episode"
    :title="title"
  />
</template>

<script setup lang="ts">
import PlaybackPlayer from './PlaybackPlayer.vue';

defineProps<{
  type: 'movie' | 'tv';
  tmdbId: number | string;
  season?: number | string;
  episode?: number | string;
  title?: string;
  autoPlay?: boolean;
}>();
</script>
