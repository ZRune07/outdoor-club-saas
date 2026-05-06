import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/activities'
  },
  {
    path: '/activities',
    name: 'Activities',
    component: () => import('@/views/activity/List.vue')
  },
  {
    path: '/activity/:id',
    name: 'ActivityDetail',
    component: () => import('@/views/activity/Detail.vue')
  },
  {
    path: '/activity/:id/register',
    name: 'ActivityRegister',
    component: () => import('@/views/registration/Register.vue')
  },
  {
    path: '/disclaimer/:activityId',
    name: 'Disclaimer',
    component: () => import('@/views/disclaimer/Index.vue')
  },
  {
    path: '/payment/:orderId',
    name: 'Payment',
    component: () => import('@/views/payment/Index.vue')
  },
  {
    path: '/payment/result',
    name: 'PaymentResult',
    component: () => import('@/views/payment/Result.vue')
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/profile/Index.vue')
  },
  {
    path: '/registrations',
    name: 'MyRegistrations',
    component: () => import('@/views/registrations/List.vue')
  },
  {
    path: '/clubs',
    name: 'Clubs',
    component: () => import('@/views/club/List.vue')
  },
  {
    path: '/auth/login',
    name: 'Login',
    component: () => import('@/views/auth/Login.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
