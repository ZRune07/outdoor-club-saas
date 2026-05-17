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

function addDays(baseDate, days) {
  const next = new Date(baseDate)
  next.setDate(next.getDate() + days)
  return next
}

function toDate(value) {
  if (!value) {
    return null
  }
  if (value instanceof Date) {
    return value
  }
  if (typeof value.toDate === 'function') {
    return value.toDate()
  }
  if (typeof value.seconds === 'number') {
    return new Date(value.seconds * 1000)
  }
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

exports.main = async (event) => {
  const wxContext = cloud.getWXContext()
  const operatorOpenId = wxContext.OPENID
  const tenantId = String(event.tenantId || '').trim()
  const membershipId = String(event.membershipId || '').trim()
  const action = String(event.action || '').trim()

  if (!tenantId || !membershipId || !action) {
    return {
      success: false,
      error: '参数不完整'
    }
  }

  try {
    const userIsSuperAdmin = await isSuperAdmin(operatorOpenId)
    if (!userIsSuperAdmin) {
      const userIsTenantAdmin = await isTenantAdmin(operatorOpenId, tenantId)
      if (!userIsTenantAdmin) {
        return {
          success: false,
          error: '没有权限管理会员'
        }
      }
    }

    const membership = await db.collection('user_memberships').doc(membershipId).get()
    const record = membership.data

    if (!record || record.tenantId !== tenantId) {
      return {
        success: false,
        error: '会员记录不存在'
      }
    }

    const now = new Date()

    if (action === 'expire') {
      await db.collection('user_memberships').doc(membershipId).update({
        data: {
          status: 'expired',
          expiresAt: now,
          updatedAt: now,
          operatedAt: now,
          operatedByOpenId: operatorOpenId
        }
      })

      return {
        success: true,
        message: '会员已设为失效'
      }
    }

    if (action === 'renew') {
      const configResult = await db.collection('membership_configs')
        .where({
          tenantId
        })
        .limit(1)
        .get()

      const config = configResult.data[0]
      if (!config || !config.enabled) {
        return {
          success: false,
          error: '当前俱乐部未开放会员功能'
        }
      }

      const validityDays = Number(config.validityDays) > 0 ? Number(config.validityDays) : 365
      const currentExpiry = toDate(record.expiresAt)
      const baseDate = currentExpiry && currentExpiry.getTime() > now.getTime() ? currentExpiry : now
      const expiresAt = addDays(baseDate, validityDays)

      await db.collection('user_memberships').doc(membershipId).update({
        data: {
          status: 'active',
          levelName: config.levelName || record.levelName || '俱乐部会员',
          description: config.description || record.description || '',
          benefits: Array.isArray(config.benefits) ? config.benefits.slice(0, 6) : (record.benefits || []),
          validityDays,
          expiresAt,
          updatedAt: now,
          operatedAt: now,
          operatedByOpenId: operatorOpenId
        }
      })

      return {
        success: true,
        message: '会员已续期'
      }
    }

    return {
      success: false,
      error: '不支持的操作'
    }
  } catch (err) {
    console.error('管理会员失败:', err)
    return {
      success: false,
      error: err.message
    }
  }
}
