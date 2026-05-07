import request from '@/utils/request'

export function getDisclaimer() {
  return request({
    url: '/api/disclaimer/latest',
    method: 'get'
  })
}
