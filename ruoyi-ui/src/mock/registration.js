/**
 * 报名 Mock
 */

let registrationIdCounter = 15

const registrationList = [
  { registrationId: 1, activityId: 1, activityName: '五一太白山徒步穿越', wxUserId: 1, nickName: '张伟', phone: '13800138001', auditStatus: '1', auditRemark: '', cancelReason: '', createTime: '2025-04-18 10:00:00' },
  { registrationId: 2, activityId: 1, activityName: '五一太白山徒步穿越', wxUserId: 2, nickName: '李娜', phone: '13800138002', auditStatus: '1', auditRemark: '', cancelReason: '', createTime: '2025-04-18 11:00:00' },
  { registrationId: 3, activityId: 1, activityName: '五一太白山徒步穿越', wxUserId: 3, nickName: '王强', phone: '13800138003', auditStatus: '0', auditRemark: '', cancelReason: '', createTime: '2025-04-19 09:00:00' },
  { registrationId: 4, activityId: 2, activityName: '阳朔攀岩进阶训练营', wxUserId: 4, nickName: '赵敏', phone: '13800138004', auditStatus: '1', auditRemark: '', cancelReason: '', createTime: '2025-04-17 14:00:00' },
  { registrationId: 5, activityId: 2, activityName: '阳朔攀岩进阶训练营', wxUserId: 5, nickName: '陈晨', phone: '13800138005', auditStatus: '2', auditRemark: '身体不适', cancelReason: '', createTime: '2025-04-17 15:00:00' },
  { registrationId: 6, activityId: 3, activityName: '库布齐沙漠露营体验', wxUserId: 6, nickName: '刘洋', phone: '13800138006', auditStatus: '1', auditRemark: '', cancelReason: '', createTime: '2025-04-15 08:00:00' },
  { registrationId: 7, activityId: 3, activityName: '库布齐沙漠露营体验', wxUserId: 7, nickName: '孙浩', phone: '13800138007', auditStatus: '1', auditRemark: '', cancelReason: '', createTime: '2025-04-15 09:30:00' },
  { registrationId: 8, activityId: 4, activityName: '青海湖环湖骑行', wxUserId: 8, nickName: '周琳', phone: '13800138008', auditStatus: '1', auditRemark: '', cancelReason: '', createTime: '2025-04-13 10:00:00' },
  { registrationId: 9, activityId: 4, activityName: '青海湖环湖骑行', wxUserId: 9, nickName: '吴鹏', phone: '13800138009', auditStatus: '0', auditRemark: '', cancelReason: '', createTime: '2025-04-14 11:00:00' },
  { registrationId: 10, activityId: 5, activityName: '三亚潜水认证课程', wxUserId: 10, nickName: '郑雪', phone: '13800138010', auditStatus: '1', auditRemark: '', cancelReason: '', createTime: '2025-04-10 14:00:00' },
  { registrationId: 11, activityId: 7, activityName: '武功山露营日出', wxUserId: 11, nickName: '马飞', phone: '13800138011', auditStatus: '1', auditRemark: '', cancelReason: '', createTime: '2025-04-10 16:00:00' },
  { registrationId: 12, activityId: 7, activityName: '武功山露营日出', wxUserId: 12, nickName: '黄丽', phone: '13800138012', auditStatus: '3', auditRemark: '', cancelReason: '临时有事', createTime: '2025-04-11 09:00:00' },
  { registrationId: 13, activityId: 8, activityName: '华山长空栈道挑战', wxUserId: 13, nickName: '林涛', phone: '13800138013', auditStatus: '1', auditRemark: '', cancelReason: '', createTime: '2025-04-12 10:00:00' },
  { registrationId: 14, activityId: 11, activityName: '莫干山周末露营', wxUserId: 14, nickName: '何静', phone: '13800138014', auditStatus: '0', auditRemark: '', cancelReason: '', createTime: '2025-04-09 11:00:00' },
  { registrationId: 15, activityId: 11, activityName: '莫干山周末露营', wxUserId: 15, nickName: '罗峰', phone: '13800138015', auditStatus: '1', auditRemark: '', cancelReason: '', createTime: '2025-04-08 15:00:00' }
]

export default [
  {
    url: '/admin/outdoor/registration/list',
    method: 'get',
    response: (config) => {
      const params = new URLSearchParams(config.url.split('?')[1] || '')
      const pageNum = parseInt(params.get('pageNum') || '1')
      const pageSize = parseInt(params.get('pageSize') || '10')
      const activityName = params.get('activityName') || ''
      const auditStatus = params.get('auditStatus') || ''
      const nickName = params.get('nickName') || ''

      let filtered = [...registrationList]
      if (activityName) filtered = filtered.filter(r => r.activityName.includes(activityName))
      if (auditStatus) filtered = filtered.filter(r => r.auditStatus === auditStatus)
      if (nickName) filtered = filtered.filter(r => r.nickName.includes(nickName))

      const start = (pageNum - 1) * pageSize
      const rows = filtered.slice(start, start + pageSize)
      return { code: 200, msg: '操作成功', rows, total: filtered.length }
    }
  },
  {
    url: /\/admin\/outdoor\/registration\/(\d+)$/,
    method: 'get',
    response: (config) => {
      const match = config.url.match(/\/admin\/outdoor\/registration\/(\d+)/)
      const id = parseInt(match[1])
      const reg = registrationList.find(r => r.registrationId === id)
      return { code: 200, msg: '操作成功', data: reg || {} }
    }
  },
  {
    url: '/admin/outdoor/registration/audit',
    method: 'put',
    response: (config) => {
      const params = new URLSearchParams(config.url.split('?')[1] || '')
      const registrationId = parseInt(params.get('registrationId'))
      const auditStatus = params.get('auditStatus')
      const reg = registrationList.find(r => r.registrationId === registrationId)
      if (reg) reg.auditStatus = auditStatus
      return { code: 200, msg: '审核成功' }
    }
  },
  {
    url: '/admin/outdoor/registration/cancel',
    method: 'put',
    response: (config) => {
      const params = new URLSearchParams(config.url.split('?')[1] || '')
      const registrationId = parseInt(params.get('registrationId'))
      const reg = registrationList.find(r => r.registrationId === registrationId)
      if (reg) { reg.auditStatus = '3'; reg.cancelReason = params.get('cancelReason') || '' }
      return { code: 200, msg: '取消成功' }
    }
  },
  {
    url: /\/admin\/outdoor\/registration\/(\d+)$/,
    method: 'delete',
    response: (config) => {
      const match = config.url.match(/\/admin\/outdoor\/registration\/(\d+)/)
      const id = parseInt(match[1])
      const idx = registrationList.findIndex(r => r.registrationId === id)
      if (idx !== -1) registrationList.splice(idx, 1)
      return { code: 200, msg: '删除成功' }
    }
  }
]
