import { defineStore } from "pinia";
import api from '@/api/axios';

export interface User {
  id: number;
  name: string;
  email: string;
}

export const useAuthStore = defineStore('auth', {
  //  1. state: tempat untuk menyimpan token dan user
  state: () => ({
    // Cek token ada atau tidak
    token: localStorage.getItem('token') || null,
    user: null as User | null,
  }),

  // 2. Getter: untuk cek apakah user sudah login
  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  // 3. actions untuk ambil dan masukin data
  actions: {
    // Fungsi buat login
    async login(credentials: {email: string; password: string}) {
      const response = await api.post('/login', credentials)

      // Simpan token ke state dan local storage
      this.token = response.data.token
      localStorage.setItem('token', this.token as string)
    },

    // Fungsi buat ambil data profil user
    async fetchUser() {
      try {
        const response = await api.get('/me')
        // Simpan data user ke state
        this.user = response.data.data
      } catch (error) {
        // Jika gagal, logout
        this.logout()
      }
    },

    // Fungsi buat register
    async register(data: {name: string; email: string; password: string}) {
      const response = await api.post('/register', data)

      // Simpan token ke state dan local storage
      this.token = response.data.token
      localStorage.setItem('token', this.token as string)
    },

    // Fungsi buat logout
    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
    }
  }
});

