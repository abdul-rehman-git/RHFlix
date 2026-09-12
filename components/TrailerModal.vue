<template>
  <Teleport to="body">
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div 
        v-if="isOpen" 
        class="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md"
        @click.self="emit('close')"
      >
        <!-- Modal Container -->
        <div class="relative w-full max-w-4xl bg-marxi-950 rounded-2xl sm:rounded-3xl border border-marxi-800 shadow-2xl overflow-hidden flex flex-col">
          
          <!-- Header Bar -->
          <div class="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-marxi-800/80 bg-marxi-900/60">
            <div class="flex items-center space-x-2.5 min-w-0 pr-4">
              <div class="w-2 h-2 rounded-full bg-marxi-accent animate-pulse"></div>
              <h3 class="font-display font-bold text-sm sm:text-lg text-white truncate">
                {{ title ? `Trailer: ${title}` : 'Official Trailer' }}
              </h3>
            </div>

            <!-- Close Button -->
            <button 
              @click="emit('close')"
              class="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-marxi-850 hover:bg-marxi-800 text-gray-300 hover:text-white border border-marxi-700 flex items-center justify-center transition-colors shrink-0 shadow-md min-h-[36px] min-w-[36px]"
              aria-label="Close Trailer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Video Player Iframe Container (16:9 Aspect Ratio) -->
          <div class="relative w-full aspect-video bg-black overflow-hidden">
            <iframe
              v-if="videoKey"
              :src="`https://www.youtube-nocookie.com/embed/${videoKey}?autoplay=1&rel=0`"
              title="Official Trailer"
              class="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
            ></iframe>

            <!-- Fallback if no key -->
            <div v-else class="w-full h-full flex flex-col items-center justify-center p-6 text-center text-gray-400 space-y-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <p class="text-sm font-medium">Trailer video unavailable for this title.</p>
            </div>
          </div>

        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{
  isOpen: boolean;
  videoKey?: string | null;
  title?: string;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.isOpen) {
    emit('close');
  }
};

onMounted(() => {
  if (import.meta.client) {
    window.addEventListener('keydown', handleKeydown);
  }
});

onUnmounted(() => {
  if (import.meta.client) {
    window.removeEventListener('keydown', handleKeydown);
  }
});
</script>

