import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'

// Bikin komponen Home sementara (nanti kita pisah ke file sendiri)
const HomeDummy = { template: '<div class="p-10 text-2xl font-bold">Ini Halaman Home (Belum dibikin)</div>' }

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/',
      name: 'home',
      component: HomeDummy
    }
  ],
})

export default router
