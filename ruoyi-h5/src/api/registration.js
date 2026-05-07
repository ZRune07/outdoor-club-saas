import request from '@/utils/request'

// 获取活动的报名列表
export function getRegistrationsByActivity(activityId) {
  return request({
    url: `/api/registration/activity/${activityId}`,
    method: 'get'
  })
}

// 获取我的报名列表
export function getMyRegistrations(wxUserId) {
  return request({
    url: `/api/registration/my/${wxUserId}`,
    method: 'get'
  })
}

// 获取报名列表（分页）
export function getRegistrationList(params) {
  return request({
    url: '/api/registration/list',
    method: 'get',
    params
  })
}

// 获取报名详情
export function getRegistrationDetail(id) {
  return request({
    url: `/api/registration/${id}`,
    method: 'get'
  })
}

// 检查用户是否已报名
export function checkRegistration(activityId, wxUserId) {
  return request({
    url: '/api/registration/check',
    method: 'get',
    params: { activityId, wxUserId }
  })
}

// 创建报名
export function createRegistration(data) {
  return request({
    url: '/api/registration',
    method: 'post',
    data
  })
}

// 更新报名
export function updateRegistration(data) {
  return request({
    url: '/api/registration',
    method: 'put',
    data
  })
}

// 更新报名状态
export function updateRegistrationStatus(id, status) {
  return request({
    url: `/api/registration/${id}/status`,
    method: 'put',
    params: { status }
  })
}
