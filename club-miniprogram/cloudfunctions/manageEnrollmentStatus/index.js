const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

const SUPER_ADMIN_OPENID = 'ox19X48SOa4RevpGfOuKybAXBPSE'
const ALLOWED_STATUS = ['pending', 'approved', 'completed', 'cancelled', 'rejected']

async function isSuperAdmin(openId) {
  if (!openId) return false
  if (openId === SUPER_ADMIN_OPENID) return true
  const result = await db.collection('tenant_admins')
    .where({ openId, role: 'super_admin' })
    .limit(1)
    .get()
  return result.data.length > 0
}

async function isTenantAdmin(openId, tenantId) {
  if (!openId || !tenantId) return false
  const result = await db.collection('tenant_admins')
    .where({ openId, tenantId })
    .limit(1)
    .get()
  return result.data.length > 0
}

exports.main = async (event) => {
  const wxContext = cloud.getWXContext()
  const operatorOpenId = wxContext.OPENID || ''
  const tenantId = String(event.tenantId || '').trim()
  const enrollmentId = String(event.enrollmentId || '').trim()
  const status = String(event.status || '').trim()

  if (!tenantId || !enrollmentId || !status) {
    return {
      success: false,
      error: '参数不完整'
    }
  }

  if (!ALLOWED_STATUS.includes(status)) {
    return {
      success: false,
      error: '不支持的报名状态'
    }
  }

  try {
    const userIsSuperAdmin = await isSuperAdmin(operatorOpenId)
    const userIsTenantAdmin = userIsSuperAdmin ? true : await isTenantAdmin(operatorOpenId, tenantId)
    if (!userIsTenantAdmin) {
      return {
        success: false,
        error: '没有权限处理报名'
      }
    }

    const enrollment = await db.collection('enrollments').doc(enrollmentId).get()
    if (!enrollment.data || enrollment.data.tenantId !== tenantId) {
      return {
        success: false,
        error: '报名记录不存在'
      }
    }

    await db.collection('enrollments').doc(enrollmentId).update({
      data: {
        status,
        handledAt: new Date(),
        handledByOpenId: operatorOpenId,
        updatedAt: new Date()
      }
    })

    return {
      success: true
    }
  } catch (err) {
    console.error('manage enrollment status failed:', err)
    return {
      success: false,
      error: err.message
    }
  }
}
