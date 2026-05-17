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
  const enrollmentId = String(event.enrollmentId || '').trim()

  if (!tenantId) {
    return {
      success: false,
      error: '租户ID不能为空'
    }
  }

  if (!enrollmentId) {
    return {
      success: false,
      error: '报名ID不能为空'
    }
  }

  try {
    const userIsSuperAdmin = await isSuperAdmin(openId)

    if (!userIsSuperAdmin) {
      const userIsTenantAdmin = await isTenantAdmin(openId, tenantId)
      if (!userIsTenantAdmin) {
        return {
          success: false,
          error: '没有权限查看电子协议'
        }
      }
    }

    const result = await db.collection('agreements')
      .where({
        enrollmentId,
        tenantId
      })
      .orderBy('createdAt', 'desc')
      .limit(1)
      .get()

    return {
      success: true,
      data: result.data[0] || null
    }
  } catch (err) {
    console.error('获取电子协议失败:', err)
    return {
      success: false,
      error: err.message
    }
  }
}
