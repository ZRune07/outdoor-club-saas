import request from '@/utils/request'

// 获取俱乐部列表
export function getClubList(params) {
  return request({
    url: '/outdoor/club/list',
    method: 'get',
    params
  })
}

// 获取俱乐部详情
export function getClubDetail(clubId) {
  return request({
    url: `/outdoor/club/${clubId}`,
    method: 'get'
  })
}
