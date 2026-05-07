import request from '@/utils/request'

// 查询会员(微信用户)列表
export function listMember(query) {
  return request({
    url: '/admin/outdoor/member/list',
    method: 'get',
    params: query
  })
}

// 查询会员详细
export function getMember(wxUserId) {
  return request({
    url: '/admin/outdoor/member/' + wxUserId,
    method: 'get'
  })
}

// 获取会员报名统计
export function getMemberStats(wxUserId) {
  return request({
    url: '/admin/outdoor/member/stats/' + wxUserId,
    method: 'get'
  })
}

// 修改会员状态
export function changeMemberStatus(wxUserId, status) {
  return request({
    url: '/admin/outdoor/member/changeStatus',
    method: 'put',
    params: { wxUserId, status }
  })
}

// 获取会员报名历史
export function getMemberRegistrationHistory(wxUserId, query) {
  return request({
    url: '/admin/outdoor/member/registrations/' + wxUserId,
    method: 'get',
    params: query
  })
}
