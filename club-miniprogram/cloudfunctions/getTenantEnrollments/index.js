const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

const SUPER_ADMIN_OPENID = 'ox19X48SOa4RevpGfOuKybAXBPSE'

async function isSuperAdmin(openId) {
  if (!openId) {
    return false
  }

  if (openId === SUPER_ADMIN_OPENID) {
    return true
  }

  const result = await db.collection('tenant_admins')
    .where({
      openId,
      role: 'super_admin'
    })
    .get()

  return result.data.length > 0
}

async function isTenantAdmin(openId, tenantId) {
  if (!openId || !tenantId) {
    return false
  }

  const result = await db.collection('tenant_admins')
    .where({
      tenantId,
      openId
    })
    .get()

  return result.data.length > 0
}

exports.main = async (event) => {
  const wxContext = cloud.getWXContext()
  const openId = wxContext.OPENID
  const tenantId = String(event.tenantId || '').trim()

  try {
    const userIsSuperAdmin = await isSuperAdmin(openId)

    if (!userIsSuperAdmin && !tenantId) {
      return {
        success: false,
        error: '租户ID不能为空'
      }
    }

    if (!userIsSuperAdmin) {
      const userIsTenantAdmin = await isTenantAdmin(openId, tenantId)
      if (!userIsTenantAdmin) {
        return {
          success: false,
          error: '没有权限查看报名信息'
        }
      }
    }

    let query = db.collection('enrollments')

    if (!userIsSuperAdmin || tenantId) {
      query = query.where({
        tenantId
      })
    }

    const result = await query
      .orderBy('createdAt', 'desc')
      .limit(100)
      .get()

    return {
      success: true,
      data: result.data
    }
  } catch (err) {
    console.error('获取报名信息失败:', err)
    return {
      success: false,
      error: err.message
    }
  }
}
