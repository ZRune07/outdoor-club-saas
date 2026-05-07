import request from '@/utils/request'

export function createRegistration(data) {
  return request({
    url: '/api/registration',
    method: 'post',
    data
  })
}

export function getRegistrationDetail(id) {
  return request({
    url: `/api/registration/${id}`,
    method: 'get'
  })
}

export function getMyRegistrations(params) {
  return request({
    url: '/api/registration/my',
    method: 'get',
    params
  })
}
