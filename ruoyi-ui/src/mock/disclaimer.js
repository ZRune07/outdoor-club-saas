/**
 * 免责条款 Mock
 */

let disclaimerIdCounter = 4

const disclaimerList = [
  {
    disclaimerId: 1, title: '户外活动安全免责声明', content: '一、本声明适用于所有参加由本俱乐部组织的户外活动的参与者。\n\n二、户外活动具有一定的危险性，参与者应充分了解活动风险，对自身安全负责。\n\n三、参与者应如实告知健康状况，隐瞒疾病导致后果的，俱乐部不承担责任。\n\n四、活动期间，参与者应服从领队指挥，不得擅自离队或进行危险行为。\n\n五、因不可抗力因素（天气、自然灾害等）导致活动变更或取消，俱乐部不承担赔偿责任。\n\n六、参与者应自行购买户外运动保险。\n\n七、未成年人参加活动须由监护人陪同或书面授权。',
    status: '0', signCount: 156, version: 'v2.0', effectiveDate: '2024-01-01', createTime: '2024-01-01 00:00:00'
  },
  {
    disclaimerId: 2, title: '高风险运动专项免责协议', content: '一、本协议适用于攀岩、潜水、滑雪等高风险户外活动。\n\n二、参与者须持有相应资质证书或经过专业培训。\n\n三、参与者须使用经检验合格的装备器材。\n\n四、高风险活动须在专业教练指导下进行。\n\n五、参与者须签署健康承诺书。\n\n六、因参与者个人操作不当导致的事故，俱乐部不承担责任。',
    status: '0', signCount: 89, version: 'v1.5', effectiveDate: '2024-03-01', createTime: '2024-03-01 00:00:00'
  },
  {
    disclaimerId: 3, title: '未成年人参加户外活动监护人知情同意书', content: '一、监护人充分了解户外活动的风险性。\n\n二、监护人同意未成年人参加活动，并承担监护责任。\n\n三、监护人应确保未成年人身体健康，适合参加户外活动。\n\n四、活动期间，俱乐部将采取合理安全措施，但不对不可预见的风险承担责任。\n\n五、监护人应提供有效联系方式，确保紧急情况下可及时联络。',
    status: '0', signCount: 45, version: 'v1.0', effectiveDate: '2024-06-01', createTime: '2024-06-01 00:00:00'
  },
  {
    disclaimerId: 4, title: '已停用-旧版免责声明', content: '此为旧版免责声明，已停用。',
    status: '1', signCount: 230, version: 'v1.0', effectiveDate: '2023-01-01', createTime: '2023-01-01 00:00:00'
  }
]

export default [
  {
    url: '/admin/outdoor/disclaimer/list',
    method: 'get',
    response: (config) => {
      const params = new URLSearchParams(config.url.split('?')[1] || '')
      const pageNum = parseInt(params.get('pageNum') || '1')
      const pageSize = parseInt(params.get('pageSize') || '10')
      const title = params.get('title') || ''
      const status = params.get('status') || ''

      let filtered = [...disclaimerList]
      if (title) filtered = filtered.filter(d => d.title.includes(title))
      if (status) filtered = filtered.filter(d => d.status === status)

      const start = (pageNum - 1) * pageSize
      const rows = filtered.slice(start, start + pageSize)
      return { code: 200, msg: '操作成功', rows, total: filtered.length }
    }
  },
  {
    url: /\/admin\/outdoor\/disclaimer\/(\d+)$/,
    method: 'get',
    response: (config) => {
      const match = config.url.match(/\/admin\/outdoor\/disclaimer\/(\d+)/)
      const id = parseInt(match[1])
      const disclaimer = disclaimerList.find(d => d.disclaimerId === id)
      return { code: 200, msg: '操作成功', data: disclaimer || {} }
    }
  },
  {
    url: '/admin/outdoor/disclaimer',
    method: 'post',
    response: (config) => {
      const data = JSON.parse(config.body || '{}')
      data.disclaimerId = ++disclaimerIdCounter
      data.createTime = new Date().toISOString().replace('T', ' ').slice(0, 19)
      data.signCount = 0
      disclaimerList.unshift(data)
      return { code: 200, msg: '新增成功' }
    }
  },
  {
    url: '/admin/outdoor/disclaimer',
    method: 'put',
    response: (config) => {
      const data = JSON.parse(config.body || '{}')
      const idx = disclaimerList.findIndex(d => d.disclaimerId === data.disclaimerId)
      if (idx !== -1) Object.assign(disclaimerList[idx], data)
      return { code: 200, msg: '修改成功' }
    }
  },
  {
    url: /\/admin\/outdoor\/disclaimer\/(\d+)$/,
    method: 'delete',
    response: (config) => {
      const match = config.url.match(/\/admin\/outdoor\/disclaimer\/(\d+)/)
      const id = parseInt(match[1])
      const idx = disclaimerList.findIndex(d => d.disclaimerId === id)
      if (idx !== -1) disclaimerList.splice(idx, 1)
      return { code: 200, msg: '删除成功' }
    }
  },
  {
    url: '/admin/outdoor/disclaimer/changeStatus',
    method: 'put',
    response: (config) => {
      const params = new URLSearchParams(config.url.split('?')[1] || '')
      const disclaimerId = parseInt(params.get('disclaimerId'))
      const status = params.get('status')
      const disclaimer = disclaimerList.find(d => d.disclaimerId === disclaimerId)
      if (disclaimer) disclaimer.status = status
      return { code: 200, msg: '状态修改成功' }
    }
  },
  {
    url: /\/admin\/outdoor\/disclaimer\/signRecords\/(\d+)$/,
    method: 'get',
    response: (config) => {
      const params = new URLSearchParams(config.url.split('?')[1] || '')
      const pageNum = parseInt(params.get('pageNum') || '1')
      const pageSize = parseInt(params.get('pageSize') || '10')
      const rows = [
        { signId: 1, wxUserId: 1, nickName: '张伟', signTime: '2025-04-18 10:00:00' },
        { signId: 2, wxUserId: 2, nickName: '李娜', signTime: '2025-04-18 11:00:00' },
        { signId: 3, wxUserId: 3, nickName: '王强', signTime: '2025-04-19 09:00:00' }
      ]
      return { code: 200, msg: '操作成功', rows, total: rows.length }
    }
  }
]
