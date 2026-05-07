import request from '@/utils/request'

// 查询俱乐部列表
export function listClub(query) {
  return request({
    url: '/admin/outdoor/club/list',
    method: 'get',
    params: query
  })
}

// 查询俱乐部详细
export function getClub(clubId) {
  return request({
    url: '/admin/outdoor/club/' + clubId,
    method: 'get'
  })
}

// 新增俱乐部
export function addClub(data) {
  return request({
    url: '/admin/outdoor/club',
    method: 'post',
    data: data
  })
}

// 修改俱乐部
export function updateClub(data) {
  return request({
    url: '/admin/outdoor/club',
    method: 'put',
    data: data
  })
}

// 删除俱乐部
export function delClub(clubId) {
  return request({
    url: '/admin/outdoor/club/' + clubId,
    method: 'delete'
  })
}

// 查询俱乐部配置
export function getClubConfig(clubId) {
  return request({
    url: '/admin/outdoor/club/config/' + clubId,
    method: 'get'
  })
}

// 保存俱乐部配置
export function saveClubConfig(data) {
  return request({
    url: '/admin/outdoor/club/config',
    method: 'put',
    data: data
  })
}

// 修改俱乐部状态
export function changeClubStatus(clubId, status) {
  return request({
    url: '/admin/outdoor/club/changeStatus',
    method: 'put',
    params: { clubId, status }
  })
}
