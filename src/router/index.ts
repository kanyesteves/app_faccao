import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: () => import(/* webpackChunkName: "home" */ '../views/HomeView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '../views/LoginView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/references',
    name: 'references',
    component: () => import(/* webpackChunkName: "references" */ '../views/ReferenceView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/customers',
    name: 'customers',
    component: () => import(/* webpackChunkName: "customers" */ '../views/CustomerView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/lots',
    name: 'lots',
    component: () => import(/* webpackChunkName: "lots" */ '../views/LotView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/type-services',
    name: 'type-services',
    component: () => import(/* webpackChunkName: "type-services" */ '../views/TypeServiceView.vue'),
    meta: { requiresAuth: true }
  },
  // { Será implentado em outra feature !!
  //   path: '/users',
  //   name: 'users',
  //   component: () => import(/* webpackChunkName: "users" */ '../views/UserView.vue'),
  //   meta: { requiresAuth: true }
  // },
  {
    path: '/organization',
    name: 'organization',
    component: () => import(/* webpackChunkName: "organization" */ '../views/OrganizationView.vue'),
    meta: { requiresAuth: true }
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

/**
 * Guard de autenticação
 * Protege rotas que requerem autenticação
 * Redireciona para login se não estiver autenticado
 * Redireciona para home se já estiver autenticado e tentar acessar login
 */
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  // Aguarda verificação de autenticação se ainda estiver carregando
  if (authStore.loading) {
    await authStore.checkAuth()
  }

  if (requiresAuth) {
    // Se a rota requer autenticação, verifica se está autenticado
    if (!authStore.isAuthenticated) {
      next({ name: 'login' })
    } else {
      next()
    }
  } else {
    // Se é a rota de login e já está autenticado, redireciona para home
    if (to.name === 'login' && authStore.isAuthenticated) {
      next({ name: 'home' })
    } else {
      next()
    }
  }
})

export default router
