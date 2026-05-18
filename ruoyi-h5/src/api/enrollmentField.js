import request from '@/utils/request'

// 获取活动的报名表单字段配置
export function getEnrollmentField(activityId) {
  return request({
    url: '/api/enrollment-field',
    method: 'get',
    params: { activityId }
  })
}

// 提交电子签名（协议签署）
export function signAgreement(data) {
  return request({
    url: '/api/agreement/sign',
    method: 'post',
    data
  })
}
