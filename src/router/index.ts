import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/Auth/LoginView.vue'
import RegisterView from '@/views/Auth/RegisterView.vue'
import HomeView from '@/views/Home/HomeView.vue'
import MobileLayout from '@/components/layout/MobileLayout.vue'
import { useAuthStore } from '@/stores/authStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
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

// Guard untuk proteksi halaman
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Cek apakah halaman yang dituju butuh login?
  const isPublicPage = ['/login', '/register'].includes(to.path)
  const isAuthenticated = !!localStorage.getItem('token')

  if (!isPublicPage && !isAuthenticated) {
    next('/login')
  } else if (isPublicPage && isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router
