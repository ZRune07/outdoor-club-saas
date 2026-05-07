import request from '@/utils/request'

// 查询订单列表
export function listOrder(query) {
  return request({
    url: '/admin/outdoor/order/list',
    method: 'get',
    params: query
  })
}

// 查询订单详细
export function getOrder(orderId) {
  return request({
    url: '/admin/outdoor/order/' + orderId,
    method: 'get'
  })
}

// 查询订单详情(包含关联信息)
export function getOrderDetail(orderId) {
  return request({
    url: '/admin/outdoor/order/detail/' + orderId,
    method: 'get'
  })
}

// 退款
export function refundOrder(orderId, refundReason) {
  return request({
    url: '/admin/outdoor/order/refund',
    method: 'put',
    params: { orderId, refundReason }
  })
}

// 修改订单状态
export function changeOrderStatus(orderId, payStatus) {
  return request({
    url: '/admin/outdoor/order/changeStatus',
    method: 'put',
    params: { orderId, payStatus }
  })
}
