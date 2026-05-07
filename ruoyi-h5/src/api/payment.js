import request from '@/utils/request'

export function createPayment(data) {
  return request({
    url: '/api/payment/unified-order',
    method: 'post',
    data
  })
}

export function queryPaymentStatus(orderNo) {
  return request({
    url: `/api/payment/status/${orderNo}`,
    method: 'get'
  })
}
