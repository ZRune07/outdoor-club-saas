/**
 * 户外模块静态路由配置
 * 户外业务模块的路由定义
 */
import Layout from '@/layout/index'

/**
 * 户外模块路由
 * 注: 这些路由需要通过后端菜单管理添加后才能正常访问
 * 这里仅作为前端路由注册的前置配置
 */
const outdoorRoutes = [
  {
    path: '/outdoor',
    component: Layout,
    redirect: '/outdoor/club',
    name: 'Outdoor',
    meta: {
      title: '户外管理',
      icon: 'forest',
      roles: ['admin', 'outdoor_admin']
    },
    children: [
      // 俱乐部管理
      {
        path: 'club',
        name: 'Club',
        component: () => import('@/views/outdoor/club/List'),
        meta: {
          title: '俱乐部管理',
          roles: ['admin', 'outdoor_admin']
        }
      },
      {
        path: 'club/config/:clubId?',
        name: 'ClubConfig',
        component: () => import('@/views/outdoor/club/Config'),
        meta: {
          title: '俱乐部配置',
          roles: ['admin', 'outdoor_admin'],
          activeMenu: '/outdoor/club'
        }
      },
      // 活动管理
      {
        path: 'activity',
        name: 'Activity',
        component: () => import('@/views/outdoor/activity/List'),
        meta: {
          title: '活动管理',
          roles: ['admin', 'outdoor_admin']
        }
      },
      {
        path: 'activity/edit/:activityId?',
        name: 'ActivityEdit',
        component: () => import('@/views/outdoor/activity/Edit'),
        meta: {
          title: '活动编辑',
          roles: ['admin', 'outdoor_admin'],
          activeMenu: '/outdoor/activity'
        }
      },
      {
        path: 'activity/detail/:activityId',
        name: 'ActivityDetail',
        component: () => import('@/views/outdoor/activity/Detail'),
        meta: {
          title: '活动详情',
          roles: ['admin', 'outdoor_admin'],
          activeMenu: '/outdoor/activity'
        }
      },
      // 报名管理
      {
        path: 'registration',
        name: 'Registration',
        component: () => import('@/views/outdoor/registration/List'),
        meta: {
          title: '报名管理',
          roles: ['admin', 'outdoor_admin']
        }
      },
      // 订单管理
      {
        path: 'order',
        name: 'Order',
        component: () => import('@/views/outdoor/order/List'),
        meta: {
          title: '订单管理',
          roles: ['admin', 'outdoor_admin']
        }
      },
      // 会员管理
      {
        path: 'member',
        name: 'Member',
        component: () => import('@/views/outdoor/member/List'),
        meta: {
          title: '会员管理',
          roles: ['admin', 'outdoor_admin']
        }
      },
      // 免责条款管理
      {
        path: 'disclaimer',
        name: 'Disclaimer',
        component: () => import('@/views/outdoor/disclaimer/List'),
        meta: {
          title: '免责条款',
          roles: ['admin', 'outdoor_admin']
        }
      }
    ]
  }
]

export default outdoorRoutes
