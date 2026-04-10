import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/Auth/LoginView.vue'
import HomeView from '@/views/Home/HomeView.vue'
import MobileLayout from '@/components/layout/MobileLayout.vue'

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
      component: MobileLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: HomeView
        },
      ]
    },
  ],
})

export default router
