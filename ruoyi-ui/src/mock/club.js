/**
 * 俱乐部 Mock
 */

let clubIdCounter = 4

const clubList = [
  {
    clubId: 1,
    clubName: '山野探险俱乐部',
    clubCode: 'SYTX001',
    contactPerson: '张伟',
    contactPhone: '13800138001',
    description: '专注于山地徒步、攀岩探险的专业户外俱乐部，拥有10年运营经验。',
    address: '北京市朝阳区建国路88号',
    status: '0',
    createTime: '2023-01-15 10:00:00',
    memberCount: 128,
    activityCount: 45
  },
  {
    clubId: 2,
    clubName: '湖光骑行社',
    clubCode: 'HGQX002',
    contactPerson: '李娜',
    contactPhone: '13800138002',
    description: '环湖骑行、公路骑行、山地骑行，周末骑行爱好者的聚集地。',
    address: '杭州市西湖区龙井路56号',
    status: '0',
    createTime: '2023-03-20 14:30:00',
    memberCount: 86,
    activityCount: 32
  },
  {
    clubId: 3,
    clubName: '深蓝潜水中心',
    clubCode: 'SLQS003',
    contactPerson: '王强',
    contactPhone: '13800138003',
    description: 'PADI认证潜水中心，提供从体验潜水到专业潜水的全套课程和活动。',
    address: '三亚市海棠区海岸大道168号',
    status: '0',
    createTime: '2023-06-10 09:00:00',
    memberCount: 52,
    activityCount: 18
  },
  {
    clubId: 4,
    clubName: '雪域滑雪俱乐部',
    clubCode: 'XYHX004',
    contactPerson: '赵敏',
    contactPhone: '13800138004',
    description: '冬季滑雪、单板滑雪教学及雪地露营，覆盖崇礼、北大壶等雪场。',
    address: '张家口市崇礼区冬奥村商业街12号',
    status: '1',
    createTime: '2023-09-05 16:00:00',
    memberCount: 34,
    activityCount: 12
  }
]

export default [
  // 俱乐部列表
  {
    url: '/admin/outdoor/club/list',
    method: 'get',
    response: (config) => {
      const params = new URLSearchParams(config.url.split('?')[1] || '')
      const pageNum = parseInt(params.get('pageNum') || '1')
      const pageSize = parseInt(params.get('pageSize') || '10')
      const clubName = params.get('clubName') || ''
      const status = params.get('status') || ''

      let filtered = [...clubList]
      if (clubName) filtered = filtered.filter(c => c.clubName.includes(clubName))
      if (status) filtered = filtered.filter(c => c.status === status)

      const start = (pageNum - 1) * pageSize
      const rows = filtered.slice(start, start + pageSize)
      return { code: 200, msg: '操作成功', rows, total: filtered.length }
    }
  },
  // 俱乐部详情
  {
    url: /\/admin\/outdoor\/club\/(\d+)$/,
    method: 'get',
    response: (config) => {
      const match = config.url.match(/\/admin\/outdoor\/club\/(\d+)/)
      const id = parseInt(match[1])
      const club = clubList.find(c => c.clubId === id)
      return { code: 200, msg: '操作成功', data: club || {} }
    }
  },
  // 新增俱乐部
  {
    url: '/admin/outdoor/club',
    method: 'post',
    response: (config) => {
      const data = JSON.parse(config.body || '{}')
      data.clubId = ++clubIdCounter
      data.createTime = new Date().toISOString().replace('T', ' ').slice(0, 19)
      data.memberCount = 0
      data.activityCount = 0
      clubList.push(data)
      return { code: 200, msg: '新增成功' }
    }
  },
  // 修改俱乐部
  {
    url: '/admin/outdoor/club',
    method: 'put',
    response: (config) => {
      const data = JSON.parse(config.body || '{}')
      const idx = clubList.findIndex(c => c.clubId === data.clubId)
      if (idx !== -1) Object.assign(clubList[idx], data)
      return { code: 200, msg: '修改成功' }
    }
  },
  // 删除俱乐部
  {
    url: /\/admin\/outdoor\/club\/(\d+)$/,
    method: 'delete',
    response: (config) => {
      const match = config.url.match(/\/admin\/outdoor\/club\/(\d+)/)
      const id = parseInt(match[1])
      const idx = clubList.findIndex(c => c.clubId === id)
      if (idx !== -1) clubList.splice(idx, 1)
      return { code: 200, msg: '删除成功' }
    }
  },
  // 俱乐部配置
  {
    url: /\/admin\/outdoor\/club\/config\/(\d+)$/,
    method: 'get',
    response: () => ({
      code: 200,
      msg: '操作成功',
      data: {
        maxMembers: 200,
        autoApprove: true,
        requireDisclaimer: true,
        refundPolicy: '活动开始前48小时可全额退款',
        noticeTemplate: '尊敬的{memberName}，您报名的活动{activityName}将于{date}开始，请准时参加。'
      }
    })
  },
  // 保存俱乐部配置
  {
    url: '/admin/outdoor/club/config',
    method: 'put',
    response: () => ({ code: 200, msg: '配置保存成功' })
  },
  // 修改俱乐部状态
  {
    url: '/admin/outdoor/club/changeStatus',
    method: 'put',
    response: (config) => {
      const params = new URLSearchParams(config.url.split('?')[1] || '')
      const clubId = parseInt(params.get('clubId'))
      const status = params.get('status')
      const club = clubList.find(c => c.clubId === clubId)
      if (club) club.status = status
      return { code: 200, msg: '状态修改成功' }
    }
  }
]
