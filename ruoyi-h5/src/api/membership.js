import request from '@/utils/request'

// 获取会员配置
export function getMembershipConfig() {
  return request({
    url: '/api/membership/config',
    method: 'get'
  })
}

// 获取我的会员信息
export function getMyMembership() {
  return request({
    url: '/api/membership/my',
    method: 'get'
  })
}

// 激活会员
export function activateMembership(data) {
  return request({
    url: '/api/membership/activate',
    method: 'post',
    data
  })
}
