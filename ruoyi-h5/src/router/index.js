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
  },
  {
    path: '/membership',
    name: 'MyMembership',
    component: () => import('@/views/membership/My.vue')
  },
  {
    path: '/admin/field-config',
    name: 'AdminFieldConfig',
    component: () => import('@/views/admin/FieldConfig.vue'),
    meta: { adminRoles: ['tenant_admin', 'super_admin'] }
  },
  {
    path: '/admin/tenant',
    name: 'AdminTenant',
    component: () => import('@/views/admin/TenantAdmin.vue'),
    meta: { adminRoles: ['tenant_admin', 'super_admin'] }
  },
  {
    path: '/admin/super',
    name: 'AdminSuper',
    component: () => import('@/views/admin/SuperAdmin.vue'),
    meta: { adminRoles: ['super_admin'] }
  },
  {
    path: '/admin/invite',
    name: 'AdminInvite',
    component: () => import('@/views/admin/AdminInvite.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  if (to.path.startsWith('/admin') && to.meta.adminRoles) {
    try {
      const { getAdminRole } = await import('@/api/admin')
      const res = await getAdminRole()
      const role = res.result || res.data || null
      if (role && to.meta.adminRoles.includes(role)) {
        next()
      } else {
        next('/home')
      }
    } catch (e) {
      next('/login')
    }
  } else {
    next()
  }
})

export default router
