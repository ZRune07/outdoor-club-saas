import request from '@/utils/request'

// 获取活动列表
export function getActivityList(params) {
  return request({
    url: '/outdoor/activity/list',
    method: 'get',
    params
  })
}

// 获取活动详情
export function getActivityDetail(activityId) {
  return request({
    url: `/outdoor/activity/${activityId}`,
    method: 'get'
  })
}
