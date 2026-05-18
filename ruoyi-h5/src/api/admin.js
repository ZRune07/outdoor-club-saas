import request from '@/utils/request'

// 获取当前用户管理角色（tenant_admin / super_admin / null）
export function getAdminRole() {
  return request({
    url: '/api/admin/role',
    method: 'get'
  })
}

// 报名列表（分页）
export function getEnrollments(params) {
  return request({
    url: '/api/admin/enrollments',
    method: 'get',
    params
  })
}

// 修改报名状态
export function updateEnrollmentStatus(id, status) {
  return request({
    url: `/api/admin/enrollment/${id}/status`,
    method: 'put',
    params: { status }
  })
}

// 导出报名列表
export function exportEnrollments(params) {
  return request({
    url: '/api/admin/enrollments/export',
    method: 'get',
    params,
    responseType: 'blob'
  })
}

// 生成邀请链接（super_admin）
export function createInvite(data) {
  return request({
    url: '/api/admin/invite',
    method: 'post',
    data
  })
}

// 绑定邀请 token
export function bindInvite(data) {
  return request({
    url: '/api/admin/invite/bind',
    method: 'post',
    data
  })
}

// 获取报名表单字段配置
export function getEnrollmentField(params) {
  return request({
    url: '/api/enrollment-field',
    method: 'get',
    params
  })
}

// 新增报名表单字段配置
export function createEnrollmentField(data) {
  return request({
    url: '/api/enrollment-field',
    method: 'post',
    data
  })
}

// 更新报名表单字段配置
export function updateEnrollmentField(data) {
  return request({
    url: '/api/enrollment-field',
    method: 'put',
    data
  })
}
