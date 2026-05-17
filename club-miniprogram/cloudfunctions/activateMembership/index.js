const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

function addDays(baseDate, days) {
  const next = new Date(baseDate)
  next.setDate(next.getDate() + days)
  return next
}

exports.main = async (event) => {
  const wxContext = cloud.getWXContext()
  const openId = wxContext.OPENID
  const tenantId = String(event.tenantId || '').trim()

  if (!openId) {
    return {
      success: false,
      error: '获取用户身份失败'
    }
  }

  if (!tenantId) {
    return {
      success: false,
      error: '俱乐部ID不能为空'
    }
  }

  try {
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
        error: '当前俱乐部暂未开放会员功能'
      }
    }

    const validityDays = Number(config.validityDays) > 0 ? Number(config.validityDays) : 365
    const benefits = Array.isArray(config.benefits) ? config.benefits.slice(0, 6) : []

    const currentResult = await db.collection('user_memberships')
      .where({
        openId,
        tenantId
      })
      .orderBy('updatedAt', 'desc')
      .limit(1)
      .get()

    const now = new Date()
    const currentRecord = currentResult.data[0]
    const currentExpiry = currentRecord?.expiresAt && typeof currentRecord.expiresAt.toDate === 'function'
      ? currentRecord.expiresAt.toDate()
      : (currentRecord?.expiresAt ? new Date(currentRecord.expiresAt) : null)
    const baseDate = currentExpiry && currentExpiry.getTime() > now.getTime() ? currentExpiry : now
    const expiresAt = addDays(baseDate, validityDays)

    const membershipData = {
      tenantId,
      openId,
      status: 'active',
      levelName: config.levelName || '俱乐部会员',
      description: config.description || '已开通当前俱乐部会员功能。',
      benefits,
      validityDays,
      activatedAt: currentRecord?.activatedAt || now,
      expiresAt,
      updatedAt: now
    }

    if (currentRecord?._id) {
      await db.collection('user_memberships')
        .doc(currentRecord._id)
        .update({
          data: membershipData
        })
    } else {
      await db.collection('user_memberships')
        .add({
          data: {
            ...membershipData,
            createdAt: now
          }
        })
    }

    return {
      success: true,
      message: currentRecord?._id ? '会员已续期' : '会员已开通',
      expiresAt
    }
  } catch (err) {
    console.error('开通会员失败:', err)
    return {
      success: false,
      error: err.message
    }
  }
}
