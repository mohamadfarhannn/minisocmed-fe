<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()

// Variabel penampung inputan
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const rememberMe = ref(false)
const errorMessage = ref('')
const isLoading = ref(false)

// Lifecycle: Load email jika ada di remember me
onMounted(() => {
  const savedEmail = localStorage.getItem('rememberedEmail')
  if (savedEmail) {
    email.value = savedEmail
    rememberMe.value = true
  }
})

// Auto-hide error saat user mulai mengetik ulang
watch([email, password], () => {
  if (errorMessage.value) {
    errorMessage.value = ''
  }
})

const handleLogin = async () => {
  // 1. Validasi Client-side (Empty Fields)
  if (!email.value || !password.value) {
    errorMessage.value = 'Email dan Password wajib diisi!'
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    // 2. Kirim data login ke API
    await authStore.login({
      email: email.value,
      password: password.value
    })

    // 3. Simpan/Hapus email di localStorage berdasarkan Remember Me
    if (rememberMe.value) {
      localStorage.setItem('rememberedEmail', email.value)
    } else {
      localStorage.removeItem('rememberedEmail')
    }

    await authStore.fetchUser()
    router.push('/')
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response && error.response.status === 401) {
        errorMessage.value = 'Email atau Password salah!'
      } else {
        errorMessage.value = 'Koneksi server terputus.'
      }
    } else {
      errorMessage.value = 'Terjadi kesalahan sistem.'
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-linear-to-br from-[#1E40AF] via-[#2563EB] to-[#1E3A8A] p-4 relative overflow-hidden">
    <!-- Subtle Background Elements -->
    <div class="absolute top-[-10%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
    <div class="absolute bottom-[-10%] left-[-10%] w-80 h-80 bg-blue-400/20 rounded-full blur-3xl"></div>

    <div class="relative w-full max-w-md">
      <!-- Card Container -->
      <div class="rounded-[2.5rem] bg-white px-8 py-10 shadow-2xl shadow-blue-900/40">
        <!-- Header -->
        <div class="mb-10 text-center">
          <h1 class="text-4xl font-extrabold tracking-tight text-[#111827]">Welcome Back!</h1>
          <p class="mt-2 text-lg text-[#6B7280]">Sign in to your account</p>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="mb-6 rounded-2xl bg-red-50 p-4 text-sm font-medium text-red-600 border border-red-100 flex items-center gap-2">
          <!-- <span class="w-1.5 h-1.5 bg-red-600 rounded-full"></span> -->
          <AlertCircle :size="20" />
          {{ errorMessage }}
        </div>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Email Field -->
          <div class="space-y-2">
            <label class="ml-1 text-sm font-semibold text-[#374151]">Email Address</label>
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                <Mail :size="20" />
              </div>
              <input
                v-model="email"
                type="email"
                class="block w-full rounded-2xl border-2 border-gray-50 bg-gray-50 p-4 pl-12 text-[#111827] outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 placeholder:text-gray-400"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <!-- Password Field -->
          <div class="space-y-2">
            <label class="ml-1 text-sm font-semibold text-[#374151]">Password</label>
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                <Lock :size="20" />
              </div>
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                class="block w-full rounded-2xl border-2 border-gray-50 bg-gray-50 p-4 pl-12 pr-12 text-[#111827] outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 placeholder:text-gray-400"
                placeholder="Enter your password"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Eye v-if="!showPassword" :size="20" />
                <EyeOff v-else :size="20" />
              </button>
            </div>
          </div>

          <!-- Remember & Forgot -->
          <div class="flex items-center justify-between px-1">
            <label class="flex items-center gap-2 cursor-pointer group">
              <div class="relative flex items-center">
                <input
                  v-model="rememberMe"
                  type="checkbox"
                  class="peer h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-gray-200 transition-all checked:bg-blue-600 checked:border-blue-600"
                />
                <svg
                  class="absolute h-3.5 w-3.5 pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity text-white left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span class="text-sm font-medium text-[#4B5563] group-hover:text-gray-900 transition-colors">Remember me</span>
            </label>
            <!-- <a href="#" class="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">Forgot Password?</a> -->
          </div>

          <!-- Sign In Button -->
          <button
            type="submit"
            :disabled="isLoading"
            class="group relative flex w-full items-center justify-center overflow-hidden rounded-2xl bg-blue-600 py-4 text-base font-bold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-blue-400 disabled:shadow-none"
          >
            <span v-if="isLoading" class="flex items-center gap-2">
              <Loader2 class="animate-spin" :size="20" />
              Signing in...
            </span>
            <span v-else>Sign In</span>
          </button>
        </form>

        <!-- Footer -->
        <div class="mt-8 text-center text-sm">
          <p class="text-[#6B7280]">
            Don't have an account?
            <router-link to="/register" class="ml-1 font-bold text-blue-600 hover:text-blue-700 transition-colors underline-offset-4 hover:underline">
              Sign up
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
