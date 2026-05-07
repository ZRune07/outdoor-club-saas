import request from '@/utils/request'

export function getActivityList(params) {
  return request({
    url: '/activity/list',
    method: 'get',
    params
  })
}

export function getActivityDetail(id) {
  return request({
    url: `/activity/${id}`,
    method: 'get'
  })
}
