import request from '@/utils/request'

// 获取订单详情
export function getPaymentDetail(orderId) {
  return request({
    url: `/api/payment/${orderId}`,
    method: 'get'
  })
}

// 根据订单号查询
export function getPaymentByOrderNo(orderNo) {
  return request({
    url: `/api/payment/no/${orderNo}`,
    method: 'get'
  })
}

// 根据报名ID查询订单
export function getPaymentByRegistration(registrationId) {
  return request({
    url: `/api/payment/registration/${registrationId}`,
    method: 'get'
  })
}

// 获取用户的订单列表
export function getUserPayments(wxUserId) {
  return request({
    url: `/api/payment/user/${wxUserId}`,
    method: 'get'
  })
}

// 创建订单并发起支付
export function createPayment(data) {
  return request({
    url: '/api/payment/create',
    method: 'post',
    data
  })
}

// 查询支付状态
export function queryPaymentStatus(orderNo) {
  return request({
    url: '/api/payment/status',
    method: 'get',
    params: { orderNo }
  })
}
