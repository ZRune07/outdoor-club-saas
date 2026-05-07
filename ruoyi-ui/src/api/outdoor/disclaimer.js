import request from '@/utils/request'

// 查询免责条款列表
export function listDisclaimer(query) {
  return request({
    url: '/admin/outdoor/disclaimer/list',
    method: 'get',
    params: query
  })
}

// 查询免责条款详细
export function getDisclaimer(disclaimerId) {
  return request({
    url: '/admin/outdoor/disclaimer/' + disclaimerId,
    method: 'get'
  })
}

// 新增免责条款
export function addDisclaimer(data) {
  return request({
    url: '/admin/outdoor/disclaimer',
    method: 'post',
    data: data
  })
}

// 修改免责条款
export function updateDisclaimer(data) {
  return request({
    url: '/admin/outdoor/disclaimer',
    method: 'put',
    data: data
  })
}

// 删除免责条款
export function delDisclaimer(disclaimerId) {
  return request({
    url: '/admin/outdoor/disclaimer/' + disclaimerId,
    method: 'delete'
  })
}

// 修改免责条款状态
export function changeDisclaimerStatus(disclaimerId, status) {
  return request({
    url: '/admin/outdoor/disclaimer/changeStatus',
    method: 'put',
    params: { disclaimerId, status }
  })
}

// 查询免责条款签署记录
export function listSignRecords(disclaimerId, query) {
  return request({
    url: '/admin/outdoor/disclaimer/signRecords/' + disclaimerId,
    method: 'get',
    params: query
  })
}
