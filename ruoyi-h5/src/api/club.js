import request from '@/utils/request'

// 获取俱乐部列表
export function getClubList(params) {
  return request({
    url: '/api/club/list',
    method: 'get',
    params
  })
}

// 获取俱乐部详情
export function getClubDetail(clubId) {
  return request({
    url: `/api/club/${clubId}`,
    method: 'get'
  })
}
