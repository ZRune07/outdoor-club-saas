import request from '@/utils/request'

// 查询报名列表
export function listRegistration(query) {
  return request({
    url: '/admin/outdoor/registration/list',
    method: 'get',
    params: query
  })
}

// 查询报名详细
export function getRegistration(registrationId) {
  return request({
    url: '/admin/outdoor/registration/' + registrationId,
    method: 'get'
  })
}

// 审核报名
export function auditRegistration(registrationId, auditStatus, auditRemark) {
  return request({
    url: '/admin/outdoor/registration/audit',
    method: 'put',
    params: { registrationId, auditStatus, auditRemark }
  })
}

// 取消报名
export function cancelRegistration(registrationId, cancelReason) {
  return request({
    url: '/admin/outdoor/registration/cancel',
    method: 'put',
    params: { registrationId, cancelReason }
  })
}

// 删除报名
export function delRegistration(registrationId) {
  return request({
    url: '/admin/outdoor/registration/' + registrationId,
    method: 'delete'
  })
}
