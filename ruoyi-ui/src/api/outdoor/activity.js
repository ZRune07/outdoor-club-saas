import request from '@/utils/request'

// 查询活动列表
export function listActivity(query) {
  return request({
    url: '/admin/outdoor/activity/list',
    method: 'get',
    params: query
  })
}

// 查询活动详细
export function getActivity(activityId) {
  return request({
    url: '/admin/outdoor/activity/' + activityId,
    method: 'get'
  })
}

// 新增活动
export function addActivity(data) {
  return request({
    url: '/admin/outdoor/activity',
    method: 'post',
    data: data
  })
}

// 修改活动
export function updateActivity(data) {
  return request({
    url: '/admin/outdoor/activity',
    method: 'put',
    data: data
  })
}

// 删除活动
export function delActivity(activityId) {
  return request({
    url: '/admin/outdoor/activity/' + activityId,
    method: 'delete'
  })
}

// 修改活动状态(上下架)
export function changeActivityStatus(activityId, status) {
  return request({
    url: '/admin/outdoor/activity/changeStatus',
    method: 'put',
    params: { activityId, status }
  })
}

// 查询活动报名人员列表
export function listActivityRegistrations(activityId, query) {
  return request({
    url: '/admin/outdoor/activity/registrations/' + activityId,
    method: 'get',
    params: query
  })
}
