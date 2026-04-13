<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'
import { Mail, Lock, User, Eye, EyeOff, Loader2 } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()

// Variabel penampung inputan
const name = ref('')
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const errorMessage = ref('')
const isLoading = ref(false)

const handleRegister = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    await authStore.register({
      name: name.value,
      email: email.value,
      password: password.value
    })

    // Redirect ke home setelah sukses register (dan dapat token)
    router.push('/')
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response && error.response.status === 422) {
        errorMessage.value = error.response.data.message || 'Data tidak valid.'
      } else {
        errorMessage.value = 'Terjadi kesalahan pada server.'
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
          <h1 class="text-4xl font-extrabold tracking-tight text-[#111827]">Join Us!</h1>
          <p class="mt-2 text-lg text-[#6B7280]">Create your account</p>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="mb-6 rounded-2xl bg-red-50 p-4 text-sm font-medium text-red-600 border border-red-100 flex items-center gap-2">
          <span class="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
          {{ errorMessage }}
        </div>

        <form @submit.prevent="handleRegister" class="space-y-6">
          <!-- Name Field -->
          <div class="space-y-2">
            <label class="ml-1 text-sm font-semibold text-[#374151]">Full Name</label>
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                <User :size="20" />
              </div>
              <input
                v-model="name"
                type="text"
                required
                class="block w-full rounded-2xl border-2 border-gray-50 bg-gray-50 p-4 pl-12 text-[#111827] outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 placeholder:text-gray-400"
                placeholder="Enter your name"
              />
            </div>
          </div>

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
                required
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
                required
                class="block w-full rounded-2xl border-2 border-gray-50 bg-gray-50 p-4 pl-12 pr-12 text-[#111827] outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 placeholder:text-gray-400"
                placeholder="Create a password"
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

          <!-- Sign Up Button -->
          <button
            type="submit"
            :disabled="isLoading"
            class="group relative flex w-full items-center justify-center overflow-hidden rounded-2xl bg-blue-600 py-4 text-base font-bold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-blue-400 disabled:shadow-none"
          >
            <span v-if="isLoading" class="flex items-center gap-2">
              <Loader2 class="animate-spin" :size="20" />
              Creating account...
            </span>
            <span v-else>Sign Up</span>
          </button>
        </form>

        <!-- Footer -->
        <div class="mt-8 text-center text-sm">
          <p class="text-[#6B7280]">
            Already have an account?
            <router-link to="/login" class="ml-1 font-bold text-blue-600 hover:text-blue-700 transition-colors underline-offset-4 hover:underline">
              Sign in
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
