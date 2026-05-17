const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

const SUPER_ADMIN_OPENID = 'ox19X48SOa4RevpGfOuKybAXBPSE'

exports.main = async (event) => {
  const wxContext = cloud.getWXContext()
  const openId = wxContext.OPENID
  const tenantId = String(event.tenantId || '').trim()

  if (!openId) {
    return {
      success: false,
      message: '无法获取用户 OpenID',
      openId: ''
    }
  }

  try {
    let isSuperAdmin = openId === SUPER_ADMIN_OPENID

    if (!isSuperAdmin) {
      const superResult = await db.collection('tenant_admins')
        .where({
          openId,
          role: 'super_admin'
        })
        .limit(1)
        .get()

      isSuperAdmin = superResult.data.length > 0
    }

    let isTenantAdmin = false
    if (tenantId) {
      const tenantResult = await db.collection('tenant_admins')
        .where({
          tenantId,
          openId
        })
        .limit(1)
        .get()

      isTenantAdmin = tenantResult.data.length > 0
    }

    return {
      success: true,
      openId,
      appId: wxContext.APPID,
      unionId: wxContext.UNIONID,
      tenantId,
      isSuperAdmin,
      isTenantAdmin,
      userRole: isSuperAdmin ? 'super_admin' : (isTenantAdmin ? 'tenant_admin' : null)
    }
  } catch (err) {
    console.error('getUserRole failed:', err)
    return {
      success: false,
      message: err.message || '获取用户身份失败',
      openId,
      isSuperAdmin: false,
      isTenantAdmin: false,
      userRole: null
    }
  }
}
