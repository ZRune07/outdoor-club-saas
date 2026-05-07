/**
 * 登录相关 Mock
 */
const tokenMap = {}

export default [
  // 验证码
  {
    url: '/captchaImage',
    method: 'get',
    response: () => ({
      code: 200,
      msg: '操作成功',
      img: '',
      captchaEnabled: false,
      uuid: 'mock-uuid-001'
    })
  },
  // 登录
  {
    url: '/login',
    method: 'post',
    response: (config) => {
      const { username } = JSON.parse(config.body || '{}')
      const token = 'mock-token-' + username + '-' + Date.now()
      tokenMap[username] = token
      return {
        code: 200,
        msg: '操作成功',
        token: token
      }
    }
  },
  // 获取用户信息
  {
    url: '/getInfo',
    method: 'get',
    response: () => ({
      code: 200,
      msg: '操作成功',
      user: {
        userId: 1,
        userName: 'admin',
        nickName: '管理员',
        email: 'admin@outdoor-club.com',
        phonenumber: '13800138000',
        sex: '0',
        avatar: '',
        deptId: 103,
        remark: '管理员'
      },
      roles: ['admin'],
      permissions: ['*:*:*'],
      isDefaultModifyPwd: false,
      isPasswordExpired: false,
      pwdChrtype: 0
    })
  },
  // 退出
  {
    url: '/logout',
    method: 'post',
    response: () => ({
      code: 200,
      msg: '操作成功'
    })
  },
  // 解锁屏幕
  {
    url: '/unlockscreen',
    method: 'post',
    response: () => ({
      code: 200,
      msg: '操作成功'
    })
  },
  // 获取路由
  {
    url: '/getRouters',
    method: 'get',
    response: () => ({
      code: 200,
      msg: '操作成功',
      data: [
        {
          name: 'Outdoor',
          path: '/outdoor',
          hidden: false,
          redirect: 'noRedirect',
          component: 'Layout',
          alwaysShow: true,
          meta: {
            title: '户外管理',
            icon: 'guide',
            noCache: false,
            link: null
          },
          children: [
            {
              name: 'Club',
              path: 'club',
              hidden: false,
              component: 'outdoor/club/index',
              meta: {
                title: '俱乐部管理',
                icon: 'peoples',
                noCache: false,
                link: null
              }
            },
            {
              name: 'Activity',
              path: 'activity',
              hidden: false,
              component: 'outdoor/activity/index',
              meta: {
                title: '活动管理',
                icon: 'checkbox',
                noCache: false,
                link: null
              }
            },
            {
              name: 'Registration',
              path: 'registration',
              hidden: false,
              component: 'outdoor/registration/index',
              meta: {
                title: '报名管理',
                icon: 'peoples',
                noCache: false,
                link: null
              }
            },
            {
              name: 'Member',
              path: 'member',
              hidden: false,
              component: 'outdoor/member/index',
              meta: {
                title: '会员管理',
                icon: 'user',
                noCache: false,
                link: null
              }
            },
            {
              name: 'Order',
              path: 'order',
              hidden: false,
              component: 'outdoor/order/index',
              meta: {
                title: '订单管理',
                icon: 'money',
                noCache: false,
                link: null
              }
            },
            {
              name: 'Disclaimer',
              path: 'disclaimer',
              hidden: false,
              component: 'outdoor/disclaimer/index',
              meta: {
                title: '免责条款',
                icon: 'documentation',
                noCache: false,
                link: null
              }
            }
          ]
        },
        {
          name: 'System',
          path: '/system',
          hidden: false,
          redirect: 'noRedirect',
          component: 'Layout',
          alwaysShow: true,
          meta: {
            title: '系统管理',
            icon: 'system',
            noCache: false,
            link: null
          },
          children: [
            {
              name: 'User',
              path: 'user',
              hidden: false,
              component: 'system/user/index',
              meta: {
                title: '用户管理',
                icon: 'user',
                noCache: false,
                link: null
              }
            },
            {
              name: 'Role',
              path: 'role',
              hidden: false,
              component: 'system/role/index',
              meta: {
                title: '角色管理',
                icon: 'peoples',
                noCache: false,
                link: null
              }
            },
            {
              name: 'Menu',
              path: 'menu',
              hidden: false,
              component: 'system/menu/index',
              meta: {
                title: '菜单管理',
                icon: 'tree-table',
                noCache: false,
                link: null
              }
            },
            {
              name: 'Dept',
              path: 'dept',
              hidden: false,
              component: 'system/dept/index',
              meta: {
                title: '部门管理',
                icon: 'tree',
                noCache: false,
                link: null
              }
            },
            {
              name: 'Post',
              path: 'post',
              hidden: false,
              component: 'system/post/index',
              meta: {
                title: '岗位管理',
                icon: 'post',
                noCache: false,
                link: null
              }
            },
            {
              name: 'Dict',
              path: 'dict',
              hidden: false,
              component: 'system/dict/index',
              meta: {
                title: '字典管理',
                icon: 'dict',
                noCache: false,
                link: null
              }
            },
            {
              name: 'Config',
              path: 'config',
              hidden: false,
              component: 'system/config/index',
              meta: {
                title: '参数设置',
                icon: 'edit',
                noCache: false,
                link: null
              }
            },
            {
              name: 'Notice',
              path: 'notice',
              hidden: false,
              component: 'system/notice/index',
              meta: {
                title: '通知公告',
                icon: 'message',
                noCache: false,
                link: null
              }
            }
          ]
        },
        {
          name: 'Monitor',
          path: '/monitor',
          hidden: false,
          redirect: 'noRedirect',
          component: 'Layout',
          alwaysShow: true,
          meta: {
            title: '系统监控',
            icon: 'monitor',
            noCache: false,
            link: null
          },
          children: [
            {
              name: 'Online',
              path: 'online',
              hidden: false,
              component: 'monitor/online/index',
              meta: {
                title: '在线用户',
                icon: 'online',
                noCache: false,
                link: null
              }
            },
            {
              name: 'Job',
              path: 'job',
              hidden: false,
              component: 'monitor/job/index',
              meta: {
                title: '定时任务',
                icon: 'time',
                noCache: false,
                link: null
              }
            },
            {
              name: 'Druid',
              path: 'druid',
              hidden: false,
              component: 'InnerLink',
              meta: {
                title: '数据监控',
                icon: 'druid',
                noCache: false,
                link: null
              }
            },
            {
              name: 'Server',
              path: 'server',
              hidden: false,
              component: 'monitor/server/index',
              meta: {
                title: '服务监控',
                icon: 'server',
                noCache: false,
                link: null
              }
            },
            {
              name: 'Cache',
              path: 'cache',
              hidden: false,
              component: 'monitor/cache/index',
              meta: {
                title: '缓存监控',
                icon: 'redis',
                noCache: false,
                link: null
              }
            },
            {
              name: 'CacheList',
              path: 'cacheList',
              hidden: false,
              component: 'monitor/cache/list',
              meta: {
                title: '缓存列表',
                icon: 'redis-list',
                noCache: false,
                link: null
              }
            },
            {
              name: 'Operlog',
              path: 'operlog',
              hidden: false,
              component: 'monitor/operlog/index',
              meta: {
                title: '操作日志',
                icon: 'form',
                noCache: false,
                link: null
              }
            },
            {
              name: 'Logininfor',
              path: 'logininfor',
              hidden: false,
              component: 'monitor/logininfor/index',
              meta: {
                title: '登录日志',
                icon: 'logininfor',
                noCache: false,
                link: null
              }
            }
          ]
        },
        {
          name: 'Tool',
          path: '/tool',
          hidden: false,
          redirect: 'noRedirect',
          component: 'Layout',
          alwaysShow: true,
          meta: {
            title: '系统工具',
            icon: 'tool',
            noCache: false,
            link: null
          },
          children: [
            {
              name: 'Gen',
              path: 'gen',
              hidden: false,
              component: 'tool/gen/index',
              meta: {
                title: '代码生成',
                icon: 'code',
                noCache: false,
                link: null
              }
            },
            {
              name: 'Swagger',
              path: 'swagger',
              hidden: false,
              component: 'InnerLink',
              meta: {
                title: '系统接口',
                icon: 'swagger',
                noCache: false,
                link: null
              }
            }
          ]
        }
      ]
    })
  }
]
