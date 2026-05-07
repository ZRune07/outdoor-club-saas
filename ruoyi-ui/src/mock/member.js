/**
 * 会员 Mock
 */

const memberList = [
  { wxUserId: 1, nickName: '张伟', avatar: '', phone: '13800138001', gender: '1', level: '3', registrationCount: 28, totalFee: 18560, status: '0', lastLoginTime: '2025-04-18 10:00:00', createTime: '2023-01-15 10:00:00' },
  { wxUserId: 2, nickName: '李娜', avatar: '', phone: '13800138002', gender: '2', level: '4', registrationCount: 45, totalFee: 32400, status: '0', lastLoginTime: '2025-04-18 11:00:00', createTime: '2022-06-20 14:30:00' },
  { wxUserId: 3, nickName: '王强', avatar: '', phone: '13800138003', gender: '1', level: '2', registrationCount: 12, totalFee: 7680, status: '0', lastLoginTime: '2025-04-19 09:00:00', createTime: '2023-08-10 09:00:00' },
  { wxUserId: 4, nickName: '赵敏', avatar: '', phone: '13800138004', gender: '2', level: '3', registrationCount: 33, totalFee: 21800, status: '0', lastLoginTime: '2025-04-17 14:00:00', createTime: '2022-11-05 16:00:00' },
  { wxUserId: 5, nickName: '陈晨', avatar: '', phone: '13800138005', gender: '1', level: '1', registrationCount: 5, totalFee: 3200, status: '0', lastLoginTime: '2025-04-17 15:00:00', createTime: '2024-02-18 11:00:00' },
  { wxUserId: 6, nickName: '刘洋', avatar: '', phone: '13800138006', gender: '1', level: '2', registrationCount: 15, totalFee: 9800, status: '1', lastLoginTime: '2025-03-20 08:00:00', createTime: '2023-05-22 10:00:00' },
  { wxUserId: 7, nickName: '孙浩', avatar: '', phone: '13800138007', gender: '1', level: '3', registrationCount: 36, totalFee: 24200, status: '0', lastLoginTime: '2025-04-15 09:30:00', createTime: '2022-09-14 14:00:00' },
  { wxUserId: 8, nickName: '周琳', avatar: '', phone: '13800138008', gender: '2', level: '4', registrationCount: 52, totalFee: 38600, status: '0', lastLoginTime: '2025-04-14 10:00:00', createTime: '2021-12-30 09:00:00' },
  { wxUserId: 9, nickName: '吴鹏', avatar: '', phone: '13800138009', gender: '1', level: '1', registrationCount: 3, totalFee: 2200, status: '0', lastLoginTime: '2025-04-14 11:00:00', createTime: '2024-04-01 15:00:00' },
  { wxUserId: 10, nickName: '郑雪', avatar: '', phone: '13800138010', gender: '2', level: '2', registrationCount: 9, totalFee: 6400, status: '2', lastLoginTime: '2025-02-10 14:00:00', createTime: '2023-07-28 11:00:00' },
  { wxUserId: 11, nickName: '马飞', avatar: '', phone: '13800138011', gender: '1', level: '3', registrationCount: 30, totalFee: 19500, status: '0', lastLoginTime: '2025-04-10 16:00:00', createTime: '2022-03-16 10:00:00' },
  { wxUserId: 12, nickName: '黄丽', avatar: '', phone: '13800138012', gender: '2', level: '2', registrationCount: 11, totalFee: 7200, status: '0', lastLoginTime: '2025-04-09 11:00:00', createTime: '2023-10-09 09:00:00' },
  { wxUserId: 13, nickName: '林涛', avatar: '', phone: '13800138013', gender: '1', level: '4', registrationCount: 60, totalFee: 45800, status: '0', lastLoginTime: '2025-04-12 10:00:00', createTime: '2021-08-25 14:00:00' },
  { wxUserId: 14, nickName: '何静', avatar: '', phone: '13800138014', gender: '2', level: '1', registrationCount: 2, totalFee: 560, status: '1', lastLoginTime: '2025-04-08 15:00:00', createTime: '2024-01-20 11:00:00' },
  { wxUserId: 15, nickName: '罗峰', avatar: '', phone: '13800138015', gender: '1', level: '3', registrationCount: 25, totalFee: 16800, status: '0', lastLoginTime: '2025-04-08 15:00:00', createTime: '2022-07-11 09:00:00' }
]

export default [
  {
    url: '/admin/outdoor/member/list',
    method: 'get',
    response: (config) => {
      const params = new URLSearchParams(config.url.split('?')[1] || '')
      const pageNum = parseInt(params.get('pageNum') || '1')
      const pageSize = parseInt(params.get('pageSize') || '10')
      const nickName = params.get('nickName') || ''
      const phone = params.get('phone') || ''
      const level = params.get('level') || ''
      const status = params.get('status') || ''

      let filtered = [...memberList]
      if (nickName) filtered = filtered.filter(m => m.nickName.includes(nickName))
      if (phone) filtered = filtered.filter(m => m.phone.includes(phone))
      if (level) filtered = filtered.filter(m => m.level === level)
      if (status) filtered = filtered.filter(m => m.status === status)

      const start = (pageNum - 1) * pageSize
      const rows = filtered.slice(start, start + pageSize)
      return { code: 200, msg: '操作成功', rows, total: filtered.length }
    }
  },
  {
    url: /\/admin\/outdoor\/member\/(\d+)$/,
    method: 'get',
    response: (config) => {
      const match = config.url.match(/\/admin\/outdoor\/member\/(\d+)/)
      const id = parseInt(match[1])
      const member = memberList.find(m => m.wxUserId === id)
      return { code: 200, msg: '操作成功', data: member || {} }
    }
  },
  {
    url: /\/admin\/outdoor\/member\/stats\/(\d+)$/,
    method: 'get',
    response: (config) => {
      const match = config.url.match(/\/admin\/outdoor\/member\/stats\/(\d+)/)
      const id = parseInt(match[1])
      const member = memberList.find(m => m.wxUserId === id)
      return {
        code: 200, msg: '操作成功', data: {
          wxUserId: id,
          totalRegistrations: member?.registrationCount || 0,
          totalFee: member?.totalFee || 0,
          completedActivities: Math.floor((member?.registrationCount || 0) * 0.8),
          cancelledActivities: Math.floor((member?.registrationCount || 0) * 0.1),
          avgFee: member?.totalFee ? Math.round(member.totalFee / member.registrationCount) : 0
        }
      }
    }
  },
  {
    url: '/admin/outdoor/member/changeStatus',
    method: 'put',
    response: (config) => {
      const params = new URLSearchParams(config.url.split('?')[1] || '')
      const wxUserId = parseInt(params.get('wxUserId'))
      const status = params.get('status')
      const member = memberList.find(m => m.wxUserId === wxUserId)
      if (member) member.status = status
      return { code: 200, msg: '状态修改成功' }
    }
  },
  {
    url: /\/admin\/outdoor\/member\/registrations\/(\d+)$/,
    method: 'get',
    response: (config) => {
      const params = new URLSearchParams(config.url.split('?')[1] || '')
      const pageNum = parseInt(params.get('pageNum') || '1')
      const pageSize = parseInt(params.get('pageSize') || '10')
      const rows = [
        { registrationId: 1, activityName: '五一太白山徒步穿越', auditStatus: '1', createTime: '2025-04-18 10:00:00' },
        { registrationId: 13, activityName: '千岛湖环湖骑行', auditStatus: '1', createTime: '2025-04-05 10:00:00' }
      ]
      return { code: 200, msg: '操作成功', rows, total: rows.length }
    }
  }
]
