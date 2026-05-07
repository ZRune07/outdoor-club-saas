import request from '@/utils/request'

// 获取俱乐部最新免责条款
export function getLatestDisclaimer(clubId) {
  return request({
    url: `/api/disclaimer/latest/${clubId}`,
    method: 'get'
  })
}

// 获取免责条款详情
export function getDisclaimerDetail(disclaimerId) {
  return request({
    url: `/api/disclaimer/${disclaimerId}`,
    method: 'get'
  })
}

// 签署免责协议
export function signDisclaimer(data) {
  return request({
    url: '/api/disclaimer/sign',
    method: 'post',
    data
  })
}

// 获取报名对应的签署记录
export function getSignRecord(registrationId) {
  return request({
    url: `/api/disclaimer/sign/${registrationId}`,
    method: 'get'
  })
}

// 获取用户的签署记录列表
export function getUserSignRecords(wxUserId) {
  return request({
    url: `/api/disclaimer/sign/user/${wxUserId}`,
    method: 'get'
  })
}
