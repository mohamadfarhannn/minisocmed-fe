<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterView, useRouter } from 'vue-router'
// Nanti icon ini otomatis ada kalau kita udah install lucide-vue-next
import { Home, MessageSquare, Plus, Heart, User, Settings, LogOut, ChevronRight, X } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()
const isVisible = ref(true)
const lastScrollPosition = ref(0)

const onScroll = (e: Event) => {
  const target = e.target as HTMLElement
  const currentScrollPosition = target.scrollTop

  if (currentScrollPosition < 0) return

  // Selalu munculkan jika di dekat bagian atas
  if (currentScrollPosition < 50) {
    isVisible.value = true
    lastScrollPosition.value = currentScrollPosition
    return
  }

  // Berhenti di area paling bawah agar tidak glitchy di mobile (elastic scroll)
  const maxScroll = target.scrollHeight - target.clientHeight
  if (currentScrollPosition > maxScroll - 10) return

  // Periksa selisih scroll untuk menghindari scroll yang terlalu sensitif
  const diff = currentScrollPosition - lastScrollPosition.value

  if (Math.abs(diff) < 5) return

  if (diff > 0) {
    // Scroll ke bawah
    isVisible.value = false
  } else {
    // Scroll ke atas
    isVisible.value = true
  }

  lastScrollPosition.value = currentScrollPosition
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

onMounted(() => {
  if (!authStore.user) {
    authStore.fetchUser()
  }
})

const isSidebarOpen = ref(false)
// const toggleSidebar = () => {
//   isSidebarOpen.value = !isSidebarOpen.value
// }
</script>

<template>
  <div class="h-dvh bg-gray-800 flex justify-center overflow-hidden">

    <div class="w-full max-w-md bg-gray-100 h-full relative flex flex-col shadow-2xl">

      <header
        class="fixed top-0 left-0 right-0 mx-auto w-full max-w-md z-30 flex items-center justify-between px-4 py-3 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-transform duration-300 ease-in-out"
        :class="isVisible ? 'translate-y-0' : '-translate-y-full'"
      >
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold">
            S
          </div>
          <h1 class="font-bold text-lg text-gray-800">Socmed</h1>
        </div>
        <button
          @click="isSidebarOpen = true"
          class="w-8 h-8 rounded-full bg-gray-200 overflow-hidden border-2 border-white shadow-sm hover:ring-2 hover:ring-blue-100 transition-all"
        >
          <img
            :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${authStore.user?.name || 'Steve'}`"
            alt="Profile"
          />
        </button>
      </header>

      <main
        class="flex-1 overflow-y-auto pt-16 pb-20 scroll-smooth"
        @scroll="onScroll"
      >
        <RouterView />
      </main>

      <nav
        class="fixed bottom-0 left-0 right-0 mx-auto w-full max-w-md bg-white border-t border-gray-100 px-6 py-2 pb-safe z-30 transition-transform duration-300 ease-in-out"
        :class="isVisible ? 'translate-y-0' : 'translate-y-full'"
      >
        <ul class="flex justify-between items-center relative">

          <li>
            <button @click="router.push('/')" class="p-2 text-blue-600 flex flex-col items-center">
              <Home class="w-6 h-6" />
            </button>
          </li>

          <li>
            <button @click="router.push('/messages')" class="p-2 text-gray-400 hover:text-blue-600 transition flex flex-col items-center">
              <MessageSquare class="w-6 h-6" />
            </button>
          </li>

          <li class="relative -top-5">
            <button class="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-600/30 hover:scale-105 transition-transform">
              <Plus class="w-8 h-8" />
            </button>
          </li>

          <li>
            <button class="p-2 text-gray-400 hover:text-blue-600 transition flex flex-col items-center">
              <Heart class="w-6 h-6" />
            </button>
          </li>

          <li>
            <button class="p-2 text-gray-400 hover:text-blue-600 transition flex flex-col items-center">
              <User class="w-6 h-6" />
            </button>
          </li>

        </ul>
      </nav>

      <!-- Sidebar Overlay -->
      <Transition name="fade">
        <div
          v-if="isSidebarOpen"
          @click="isSidebarOpen = false"
          class="absolute inset-0 bg-black/20 backdrop-blur-sm z-40"
        ></div>
      </Transition>

      <!-- Sidebar -->
      <Transition name="slide">
        <div
          v-if="isSidebarOpen"
          class="absolute top-0 right-0 w-70 h-full bg-white z-50 shadow-2xl flex flex-col p-6"
        >
          <!-- Header Sidebar -->
          <div class="flex items-center justify-between mb-8">
            <h2 class="font-bold text-xl text-gray-800">Menu</h2>
            <button @click="isSidebarOpen = false" class="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X class="w-6 h-6 text-gray-500" />
            </button>
          </div>

          <!-- User Info Profile Card (Premium Look) -->
          <div class="bg-gray-50 rounded-2xl p-4 flex items-center gap-4 mb-8 border border-gray-100">
            <div class="w-14 h-14 rounded-full bg-blue-100 shrink-0 overflow-hidden border-2 border-white shadow-sm">
              <img
                :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${authStore.user?.name || 'Steve'}`"
                alt="Avatar"
              />
            </div>
            <div class="overflow-hidden">
              <p class="font-bold text-gray-800 truncate">{{ authStore.user?.name || 'Loading...' }}</p>
              <p class="text-xs text-gray-500 truncate">{{ authStore.user?.email || 'email@example.com' }}</p>
              <div class="mt-1 inline-flex items-center gap-1.5 py-0.5 px-2 bg-green-100 text-[10px] font-bold text-green-700 rounded-full uppercase tracking-wider">
                <span class="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                Online
              </div>
            </div>
          </div>

          <!-- Menu List -->
          <nav class="flex-1">
            <ul class="space-y-2">
              <li>
                <button
                  @click="router.push('/profile'); isSidebarOpen = false"
                  class="w-full flex items-center justify-between p-3 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all text-gray-600 group"
                >
                  <div class="flex items-center gap-3">
                    <User class="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span class="font-medium">View Profile</span>
                  </div>
                  <ChevronRight class="w-4 h-4 text-gray-300" />
                </button>
              </li>
              <li>
                <button
                  @click="router.push('/settings'); isSidebarOpen = false"
                  class="w-full flex items-center justify-between p-3 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all text-gray-600 group"
                >
                  <div class="flex items-center gap-3">
                    <Settings class="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span class="font-medium">Settings</span>
                  </div>
                  <ChevronRight class="w-4 h-4 text-gray-300" />
                </button>
              </li>
              <li class="pt-4 mt-4 border-t border-gray-100">
                <button
                  @click="handleLogout"
                  class="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 text-red-500 transition-all group"
                >
                  <LogOut class="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  <span class="font-medium">Sign Out</span>
                </button>
              </li>
            </ul>
          </nav>

          <!-- Footer Sidebar -->
          <div class="mt-auto pt-6 text-center">
            <p class="text-[10px] text-gray-400 font-medium tracking-widest uppercase">slothUI v1.0.0</p>
          </div>
        </div>
      </Transition>

    </div>
  </div>
</template>

<style scoped>
/* Biar navbarnya ga ketutup safe area di iPhone */
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom, 1rem);
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.6s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>
