/**
 * 活动 Mock
 */

let activityIdCounter = 12

const activityList = [
  {
    activityId: 1, activityName: '五一太白山徒步穿越', activityType: '1', clubId: 1, clubName: '山野探险俱乐部',
    location: '陕西太白山', startDate: '2025-05-01', endDate: '2025-05-03',
    capacity: 30, enrolledCount: 28, fee: 680, status: '1',
    difficulty: '2', description: '三天两夜太白山穿越，需一定体力基础',
    coverImage: '', createTime: '2025-03-15 10:00:00'
  },
  {
    activityId: 2, activityName: '阳朔攀岩进阶训练营', activityType: '2', clubId: 1, clubName: '山野探险俱乐部',
    location: '广西阳朔', startDate: '2025-05-10', endDate: '2025-05-12',
    capacity: 12, enrolledCount: 12, fee: 1280, status: '1',
    difficulty: '3', description: '专业教练指导，提升攀岩技术',
    coverImage: '', createTime: '2025-03-18 14:30:00'
  },
  {
    activityId: 3, activityName: '库布齐沙漠露营体验', activityType: '3', clubId: 1, clubName: '山野探险俱乐部',
    location: '内蒙古库布齐', startDate: '2025-04-20', endDate: '2025-04-22',
    capacity: 40, enrolledCount: 40, fee: 560, status: '2',
    difficulty: '1', description: '沙漠露营、观星、篝火晚会',
    coverImage: '', createTime: '2025-03-20 09:00:00'
  },
  {
    activityId: 4, activityName: '青海湖环湖骑行', activityType: '4', clubId: 2, clubName: '湖光骑行社',
    location: '青海青海湖', startDate: '2025-06-15', endDate: '2025-06-20',
    capacity: 20, enrolledCount: 15, fee: 2200, status: '1',
    difficulty: '2', description: '六天环湖骑行，全程约360公里',
    coverImage: '', createTime: '2025-04-01 11:00:00'
  },
  {
    activityId: 5, activityName: '三亚潜水认证课程', activityType: '5', clubId: 3, clubName: '深蓝潜水中心',
    location: '海南三亚', startDate: '2025-04-05', endDate: '2025-04-08',
    capacity: 8, enrolledCount: 8, fee: 3600, status: '3',
    difficulty: '1', description: 'PADI开放水域潜水员认证',
    coverImage: '', createTime: '2025-02-28 16:00:00'
  },
  {
    activityId: 6, activityName: '崇礼滑雪周末营', activityType: '6', clubId: 4, clubName: '雪域滑雪俱乐部',
    location: '河北崇礼', startDate: '2025-01-18', endDate: '2025-01-19',
    capacity: 25, enrolledCount: 25, fee: 980, status: '3',
    difficulty: '1', description: '双板/单板入门教学',
    coverImage: '', createTime: '2024-12-20 10:00:00'
  },
  {
    activityId: 7, activityName: '武功山露营日出', activityType: '3', clubId: 1, clubName: '山野探险俱乐部',
    location: '江西武功山', startDate: '2025-05-24', endDate: '2025-05-25',
    capacity: 35, enrolledCount: 20, fee: 380, status: '1',
    difficulty: '1', description: '高山草甸露营观日出云海',
    coverImage: '', createTime: '2025-04-10 09:30:00'
  },
  {
    activityId: 8, activityName: '华山长空栈道挑战', activityType: '2', clubId: 1, clubName: '山野探险俱乐部',
    location: '陕西华山', startDate: '2025-06-01', endDate: '2025-06-02',
    capacity: 10, enrolledCount: 6, fee: 450, status: '1',
    difficulty: '4', description: '华山险道挑战，需具备攀岩经验',
    coverImage: '', createTime: '2025-04-12 14:00:00'
  },
  {
    activityId: 9, activityName: '千岛湖环湖骑行', activityType: '4', clubId: 2, clubName: '湖光骑行社',
    location: '浙江千岛湖', startDate: '2025-04-12', endDate: '2025-04-13',
    capacity: 30, enrolledCount: 30, fee: 580, status: '3',
    difficulty: '1', description: '两天环湖骑行，约150公里',
    coverImage: '', createTime: '2025-03-05 10:00:00'
  },
  {
    activityId: 10, activityName: '贡嘎山大环线徒步', activityType: '1', clubId: 1, clubName: '山野探险俱乐部',
    location: '四川贡嘎山', startDate: '2025-07-10', endDate: '2025-07-17',
    capacity: 15, enrolledCount: 8, fee: 3800, status: '1',
    difficulty: '4', description: '七天大环线徒步，全程约120公里',
    coverImage: '', createTime: '2025-04-15 11:30:00'
  },
  {
    activityId: 11, activityName: '莫干山周末露营', activityType: '3', clubId: 2, clubName: '湖光骑行社',
    location: '浙江莫干山', startDate: '2025-05-17', endDate: '2025-05-18',
    capacity: 50, enrolledCount: 32, fee: 280, status: '1',
    difficulty: '1', description: '山地露营+溯溪+烧烤',
    coverImage: '', createTime: '2025-04-08 15:00:00'
  },
  {
    activityId: 12, activityName: '大理苍山徒步', activityType: '1', clubId: 1, clubName: '山野探险俱乐部',
    location: '云南大理', startDate: '2025-03-22', endDate: '2025-03-23',
    capacity: 25, enrolledCount: 25, fee: 420, status: '3',
    difficulty: '1', description: '苍山玉带路徒步，俯瞰洱海',
    coverImage: '', createTime: '2025-02-15 09:00:00'
  }
]

export default [
  {
    url: '/admin/outdoor/activity/list',
    method: 'get',
    response: (config) => {
      const params = new URLSearchParams(config.url.split('?')[1] || '')
      const pageNum = parseInt(params.get('pageNum') || '1')
      const pageSize = parseInt(params.get('pageSize') || '10')
      const activityName = params.get('activityName') || ''
      const activityType = params.get('activityType') || ''
      const status = params.get('status') || ''

      let filtered = [...activityList]
      if (activityName) filtered = filtered.filter(a => a.activityName.includes(activityName))
      if (activityType) filtered = filtered.filter(a => a.activityType === activityType)
      if (status) filtered = filtered.filter(a => a.status === status)

      const start = (pageNum - 1) * pageSize
      const rows = filtered.slice(start, start + pageSize)
      return { code: 200, msg: '操作成功', rows, total: filtered.length }
    }
  },
  {
    url: /\/admin\/outdoor\/activity\/(\d+)$/,
    method: 'get',
    response: (config) => {
      const match = config.url.match(/\/admin\/outdoor\/activity\/(\d+)/)
      const id = parseInt(match[1])
      const activity = activityList.find(a => a.activityId === id)
      return { code: 200, msg: '操作成功', data: activity || {} }
    }
  },
  {
    url: '/admin/outdoor/activity',
    method: 'post',
    response: (config) => {
      const data = JSON.parse(config.body || '{}')
      data.activityId = ++activityIdCounter
      data.createTime = new Date().toISOString().replace('T', ' ').slice(0, 19)
      data.enrolledCount = 0
      activityList.unshift(data)
      return { code: 200, msg: '新增成功' }
    }
  },
  {
    url: '/admin/outdoor/activity',
    method: 'put',
    response: (config) => {
      const data = JSON.parse(config.body || '{}')
      const idx = activityList.findIndex(a => a.activityId === data.activityId)
      if (idx !== -1) Object.assign(activityList[idx], data)
      return { code: 200, msg: '修改成功' }
    }
  },
  {
    url: /\/admin\/outdoor\/activity\/(\d+)$/,
    method: 'delete',
    response: (config) => {
      const match = config.url.match(/\/admin\/outdoor\/activity\/(\d+)/)
      const id = parseInt(match[1])
      const idx = activityList.findIndex(a => a.activityId === id)
      if (idx !== -1) activityList.splice(idx, 1)
      return { code: 200, msg: '删除成功' }
    }
  },
  {
    url: '/admin/outdoor/activity/changeStatus',
    method: 'put',
    response: (config) => {
      const params = new URLSearchParams(config.url.split('?')[1] || '')
      const activityId = parseInt(params.get('activityId'))
      const status = params.get('status')
      const activity = activityList.find(a => a.activityId === activityId)
      if (activity) activity.status = status
      return { code: 200, msg: '状态修改成功' }
    }
  },
  {
    url: /\/admin\/outdoor\/activity\/registrations\/(\d+)$/,
    method: 'get',
    response: (config) => {
      const params = new URLSearchParams(config.url.split('?')[1] || '')
      const pageNum = parseInt(params.get('pageNum') || '1')
      const pageSize = parseInt(params.get('pageSize') || '10')
      const start = (pageNum - 1) * pageSize
      const rows = registrationList.slice(start, start + pageSize)
      return { code: 200, msg: '操作成功', rows, total: registrationList.length }
    }
  }
]

// 报名数据供活动详情页使用
const registrationList = [
  { registrationId: 1, activityId: 1, wxUserId: 1, nickName: '张伟', phone: '13800138001', auditStatus: '1', createTime: '2025-04-18 10:00:00' },
  { registrationId: 2, activityId: 1, wxUserId: 2, nickName: '李娜', phone: '13800138002', auditStatus: '1', createTime: '2025-04-18 11:00:00' },
  { registrationId: 3, activityId: 1, wxUserId: 3, nickName: '王强', phone: '13800138003', auditStatus: '0', createTime: '2025-04-19 09:00:00' },
  { registrationId: 4, activityId: 2, wxUserId: 4, nickName: '赵敏', phone: '13800138004', auditStatus: '1', createTime: '2025-04-17 14:00:00' },
  { registrationId: 5, activityId: 2, wxUserId: 5, nickName: '陈晨', phone: '13800138005', auditStatus: '2', createTime: '2025-04-17 15:00:00' },
]
