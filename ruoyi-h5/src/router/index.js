import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/activity',
    name: 'ActivityList',
    component: () => import('@/views/activity/List.vue')
  },
  {
    path: '/activity/:id',
    name: 'ActivityDetail',
    component: () => import('@/views/activity/Detail.vue')
  },
  {
    path: '/registration/:activityId',
    name: 'RegistrationForm',
    component: () => import('@/views/registration/Form.vue')
  },
  {
    path: '/disclaimer',
    name: 'Disclaimer',
    component: () => import('@/views/Disclaimer.vue')
  },
  {
    path: '/payment-confirm/:registrationId',
    name: 'PaymentConfirm',
    component: () => import('@/views/payment/Confirm.vue')
  },
  {
    path: '/payment-result/:orderNo',
    name: 'PaymentResult',
    component: () => import('@/views/payment/Result.vue')
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/Profile.vue')
  },
  {
    path: '/my-registrations',
    name: 'MyRegistrations',
    component: () => import('@/views/registration/MyList.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
