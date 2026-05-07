/**
 * 订单 Mock
 */

let orderIdCounter = 20

const orderList = [
  { orderId: 1, orderNo: 'OD20250418001', activityId: 1, activityName: '五一太白山徒步穿越', wxUserId: 1, nickName: '张伟', payAmount: 680, payStatus: '2', payTime: '2025-04-18 10:05:00', payMethod: '1', createTime: '2025-04-18 10:00:00', refundAmount: 0, refundReason: '' },
  { orderId: 2, orderNo: 'OD20250418002', activityId: 1, activityName: '五一太白山徒步穿越', wxUserId: 2, nickName: '李娜', payAmount: 680, payStatus: '2', payTime: '2025-04-18 11:05:00', payMethod: '2', createTime: '2025-04-18 11:00:00', refundAmount: 0, refundReason: '' },
  { orderId: 3, orderNo: 'OD20250417001', activityId: 2, activityName: '阳朔攀岩进阶训练营', wxUserId: 4, nickName: '赵敏', payAmount: 1280, payStatus: '2', payTime: '2025-04-17 14:10:00', payMethod: '1', createTime: '2025-04-17 14:00:00', refundAmount: 0, refundReason: '' },
  { orderId: 4, orderNo: 'OD20250417002', activityId: 2, activityName: '阳朔攀岩进阶训练营', wxUserId: 5, nickName: '陈晨', payAmount: 1280, payStatus: '3', payTime: '2025-04-17 15:05:00', payMethod: '2', createTime: '2025-04-17 15:00:00', refundAmount: 1280, refundReason: '身体不适' },
  { orderId: 5, orderNo: 'OD20250416001', activityId: 3, activityName: '库布齐沙漠露营体验', wxUserId: 6, nickName: '刘洋', payAmount: 560, payStatus: '2', payTime: '2025-04-16 08:10:00', payMethod: '1', createTime: '2025-04-16 08:00:00', refundAmount: 0, refundReason: '' },
  { orderId: 6, orderNo: 'OD20250415001', activityId: 3, activityName: '库布齐沙漠露营体验', wxUserId: 7, nickName: '孙浩', payAmount: 560, payStatus: '2', payTime: '2025-04-15 09:35:00', payMethod: '1', createTime: '2025-04-15 09:30:00', refundAmount: 0, refundReason: '' },
  { orderId: 7, orderNo: 'OD20250414001', activityId: 4, activityName: '青海湖环湖骑行', wxUserId: 8, nickName: '周琳', payAmount: 2200, payStatus: '2', payTime: '2025-04-14 10:10:00', payMethod: '2', createTime: '2025-04-14 10:00:00', refundAmount: 0, refundReason: '' },
  { orderId: 8, orderNo: 'OD20250413001', activityId: 4, activityName: '青海湖环湖骑行', wxUserId: 9, nickName: '吴鹏', payAmount: 2200, payStatus: '1', payTime: '', payMethod: '', createTime: '2025-04-13 11:00:00', refundAmount: 0, refundReason: '' },
  { orderId: 9, orderNo: 'OD20250410001', activityId: 5, activityName: '三亚潜水认证课程', wxUserId: 10, nickName: '郑雪', payAmount: 3600, payStatus: '2', payTime: '2025-04-10 14:10:00', payMethod: '1', createTime: '2025-04-10 14:00:00', refundAmount: 0, refundReason: '' },
  { orderId: 10, orderNo: 'OD20250409001', activityId: 7, activityName: '武功山露营日出', wxUserId: 11, nickName: '马飞', payAmount: 380, payStatus: '2', payTime: '2025-04-09 16:10:00', payMethod: '2', createTime: '2025-04-09 16:00:00', refundAmount: 0, refundReason: '' },
  { orderId: 11, orderNo: 'OD20250408001', activityId: 7, activityName: '武功山露营日出', wxUserId: 12, nickName: '黄丽', payAmount: 380, payStatus: '3', payTime: '2025-04-08 15:10:00', payMethod: '1', createTime: '2025-04-08 15:00:00', refundAmount: 380, refundReason: '临时有事' },
  { orderId: 12, orderNo: 'OD20250412001', activityId: 8, activityName: '华山长空栈道挑战', wxUserId: 13, nickName: '林涛', payAmount: 450, payStatus: '2', payTime: '2025-04-12 10:10:00', payMethod: '2', createTime: '2025-04-12 10:00:00', refundAmount: 0, refundReason: '' },
  { orderId: 13, orderNo: 'OD20250405001', activityId: 9, activityName: '千岛湖环湖骑行', wxUserId: 1, nickName: '张伟', payAmount: 580, payStatus: '2', payTime: '2025-04-05 10:05:00', payMethod: '1', createTime: '2025-04-05 10:00:00', refundAmount: 0, refundReason: '' },
  { orderId: 14, orderNo: 'OD20250405002', activityId: 9, activityName: '千岛湖环湖骑行', wxUserId: 2, nickName: '李娜', payAmount: 580, payStatus: '2', payTime: '2025-04-05 11:05:00', payMethod: '2', createTime: '2025-04-05 11:00:00', refundAmount: 0, refundReason: '' },
  { orderId: 15, orderNo: 'OD20250115001', activityId: 6, activityName: '崇礼滑雪周末营', wxUserId: 4, nickName: '赵敏', payAmount: 980, payStatus: '2', payTime: '2025-01-15 10:10:00', payMethod: '1', createTime: '2025-01-15 10:00:00', refundAmount: 0, refundReason: '' },
  { orderId: 16, orderNo: 'OD20250415001', activityId: 11, activityName: '莫干山周末露营', wxUserId: 14, nickName: '何静', payAmount: 280, payStatus: '1', payTime: '', payMethod: '', createTime: '2025-04-15 11:00:00', refundAmount: 0, refundReason: '' },
  { orderId: 17, orderNo: 'OD20250408002', activityId: 11, activityName: '莫干山周末露营', wxUserId: 15, nickName: '罗峰', payAmount: 280, payStatus: '2', payTime: '2025-04-08 15:10:00', payMethod: '2', createTime: '2025-04-08 15:00:00', refundAmount: 0, refundReason: '' },
  { orderId: 18, orderNo: 'OD20250322001', activityId: 12, activityName: '大理苍山徒步', wxUserId: 3, nickName: '王强', payAmount: 420, payStatus: '2', payTime: '2025-03-22 09:10:00', payMethod: '1', createTime: '2025-03-22 09:00:00', refundAmount: 0, refundReason: '' },
  { orderId: 19, orderNo: 'OD20250415002', activityId: 10, activityName: '贡嘎山大环线徒步', wxUserId: 6, nickName: '刘洋', payAmount: 3800, payStatus: '2', payTime: '2025-04-15 08:10:00', payMethod: '1', createTime: '2025-04-15 08:00:00', refundAmount: 0, refundReason: '' },
  { orderId: 20, orderNo: 'OD20250416002', activityId: 10, activityName: '贡嘎山大环线徒步', wxUserId: 7, nickName: '孙浩', payAmount: 3800, payStatus: '2', payTime: '2025-04-16 09:35:00', payMethod: '2', createTime: '2025-04-16 09:30:00', refundAmount: 0, refundReason: '' }
]

export default [
  {
    url: '/admin/outdoor/order/list',
    method: 'get',
    response: (config) => {
      const params = new URLSearchParams(config.url.split('?')[1] || '')
      const pageNum = parseInt(params.get('pageNum') || '1')
      const pageSize = parseInt(params.get('pageSize') || '10')
      const orderNo = params.get('orderNo') || ''
      const payStatus = params.get('payStatus') || ''
      const nickName = params.get('nickName') || ''

      let filtered = [...orderList]
      if (orderNo) filtered = filtered.filter(o => o.orderNo.includes(orderNo))
      if (payStatus) filtered = filtered.filter(o => o.payStatus === payStatus)
      if (nickName) filtered = filtered.filter(o => o.nickName.includes(nickName))

      const start = (pageNum - 1) * pageSize
      const rows = filtered.slice(start, start + pageSize)
      return { code: 200, msg: '操作成功', rows, total: filtered.length }
    }
  },
  {
    url: /\/admin\/outdoor\/order\/detail\/(\d+)$/,
    method: 'get',
    response: (config) => {
      const match = config.url.match(/\/admin\/outdoor\/order\/detail\/(\d+)/)
      const id = parseInt(match[1])
      const order = orderList.find(o => o.orderId === id)
      return { code: 200, msg: '操作成功', data: order || {} }
    }
  },
  {
    url: /\/admin\/outdoor\/order\/(\d+)$/,
    method: 'get',
    response: (config) => {
      const match = config.url.match(/\/admin\/outdoor\/order\/(\d+)/)
      const id = parseInt(match[1])
      const order = orderList.find(o => o.orderId === id)
      return { code: 200, msg: '操作成功', data: order || {} }
    }
  },
  {
    url: '/admin/outdoor/order/refund',
    method: 'put',
    response: (config) => {
      const params = new URLSearchParams(config.url.split('?')[1] || '')
      const orderId = parseInt(params.get('orderId'))
      const order = orderList.find(o => o.orderId === orderId)
      if (order) { order.payStatus = '3'; order.refundAmount = order.payAmount; order.refundReason = params.get('refundReason') || '' }
      return { code: 200, msg: '退款成功' }
    }
  },
  {
    url: '/admin/outdoor/order/changeStatus',
    method: 'put',
    response: (config) => {
      const params = new URLSearchParams(config.url.split('?')[1] || '')
      const orderId = parseInt(params.get('orderId'))
      const payStatus = params.get('payStatus')
      const order = orderList.find(o => o.orderId === orderId)
      if (order) order.payStatus = payStatus
      return { code: 200, msg: '状态修改成功' }
    }
  }
]
