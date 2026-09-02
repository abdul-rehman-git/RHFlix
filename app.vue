<template>
  <div class="min-h-screen bg-marxi-900 text-gray-100 flex flex-col font-sans selection:bg-marxi-accent selection:text-white">
    
    <!-- Optional Service Banner when API configuration is offline -->
    <div v-if="!isConfigured" class="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white text-xs py-2 px-4 text-center font-medium shadow-md z-[60] flex items-center justify-center space-x-2">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>
        <strong>RHFlix Notice:</strong> Media catalog connection is currently offline. Please configure your API key to access full live content.
      </span>
    </div>

    <!-- Header Navigation -->
    <Navbar />

    <!-- Main Page View -->
    <main class="flex-grow pt-16 pb-20 md:pb-0">
      <NuxtPage />
    </main>

    <!-- Mobile Fixed Bottom Navigation Bar -->
    <MobileBottomNav />

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup lang="ts">
const { isConfigured } = useTmdb();
</script>
