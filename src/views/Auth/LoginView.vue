<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import api from '@/api/axios'

const router = useRouter()

// Variabel penampung inputan
const email = ref('')
const password = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

const handleLogin = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    // 1. Nembak API Login di VPS Abang
    const response = await api.post('/login', {
      email: email.value,
      password: password.value
    })

    // 2. Tangkap token dari response JSON
    const token = response.data.token

    // 3. Simpan token ke Local Storage (Biar nggak ilang kalau di-refresh)
    localStorage.setItem('token', token)

    alert('Login Sukses, Bang! Token berhasil diamankan.')

    // 4. Pindah ke halaman utama (Home)
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
  <div class="flex min-h-screen items-center justify-center bg-gray-100">
    <div class="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
      <h2 class="mb-6 text-center text-3xl font-bold text-gray-800">Masuk Akun</h2>

      <div v-if="errorMessage" class="mb-4 rounded-lg bg-red-100 p-3 text-sm text-red-700">
        {{ errorMessage }}
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="mb-1 block text-sm font-medium text-gray-700">Email</label>
          <input
            v-model="email"
            type="email"
            required
            class="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="steve@gmail.com"
          />
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium text-gray-700">Password</label>
          <input
            v-model="password"
            type="password"
            required
            class="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          class="w-full rounded-lg bg-blue-600 p-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
        >
          {{ isLoading ? 'Loading...' : 'Login' }}
        </button>
      </form>
    </div>
  </div>
</template>
