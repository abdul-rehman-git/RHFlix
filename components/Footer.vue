<template>
  <footer class="bg-marxi-950 border-t border-marxi-800/80 pt-12 pb-8 text-gray-400 text-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        
        <!-- Brand Info -->
        <div class="md:col-span-2 space-y-4">
          <div class="flex items-center space-x-2">
            <div class="w-8 h-8 rounded-lg bg-gradient-to-tr from-marxi-accent to-red-500 flex items-center justify-center shadow-glow-red">
              <span class="font-display font-black text-sm text-white">RH</span>
            </div>
            <span class="font-display font-extrabold text-xl text-white">
              RHFlix<span class="text-marxi-accent">.</span>
            </span>
          </div>
          <p class="text-gray-400 max-w-sm text-xs leading-relaxed">
            Stream your favorite movies, top-rated TV series, trending blockbusters, and exclusive releases online with fast, high-definition streaming on RHFlix.
          </p>
          <div class="flex items-center space-x-3 text-xs text-gray-500">
            <span>Ultra HD Playback</span> • <span>Fast Streaming</span> • <span>Multi-Device</span>
          </div>
        </div>

        <!-- Navigation Links -->
        <div>
          <h4 class="text-white font-semibold text-xs tracking-wider uppercase mb-3">Quick Navigation</h4>
          <ul class="space-y-2 text-xs">
            <li><NuxtLink to="/" class="hover:text-white transition-colors">Home</NuxtLink></li>
            <li><NuxtLink to="/movies" class="hover:text-white transition-colors">Popular Movies</NuxtLink></li>
            <li><NuxtLink to="/tv" class="hover:text-white transition-colors">TV Series</NuxtLink></li>
            <li><NuxtLink to="/my-list" class="hover:text-white transition-colors">My Watchlist</NuxtLink></li>
            <li><NuxtLink to="/search" class="hover:text-white transition-colors">Global Search</NuxtLink></li>
          </ul>
        </div>

        <!-- Legal & Terms -->
        <div>
          <h4 class="text-white font-semibold text-xs tracking-wider uppercase mb-3">Legal & Terms</h4>
          <p class="text-xs text-gray-400 leading-relaxed">
            All entertainment titles, posters, and trademarks are property of their respective owners. Streaming is powered by seamless external media networks.
          </p>
        </div>
      </div>

      <div class="pt-6 border-t border-marxi-800/40 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-3">
        <p>&copy; {{ new Date().getFullYear() }} RHFlix Entertainment. All rights reserved.</p>
        <div class="flex items-center space-x-4">
          <span>Privacy Policy</span> • <span>Terms of Service</span>
        </div>
      </div>
    </div>
  </footer>
</template>
