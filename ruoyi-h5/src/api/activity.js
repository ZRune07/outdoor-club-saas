import request from '@/utils/request'

// 获取招募中的活动列表（首页展示）
export function getRecruitingActivities() {
  return request({
    url: '/api/activity/recruiting',
    method: 'get'
  })
}

// 根据俱乐部查询活动列表
export function getActivitiesByClub(clubId) {
  return request({
    url: `/api/activity/club/${clubId}`,
    method: 'get'
  })
}

// 获取活动列表（分页）
export function getActivityList(params) {
  return request({
    url: '/api/activity/list',
    method: 'get',
    params
  })
}

// 获取活动详情
export function getActivityDetail(id) {
  return request({
    url: `/api/activity/${id}`,
    method: 'get'
  })
}
