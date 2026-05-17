const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

const DEFAULT_MEMBERSHIP_CONFIG = {
  enabled: false,
  levelName: '俱乐部会员',
  description: '开通后可获得活动优先通知、会员专属标识与成长记录。',
  validityDays: 365,
  benefits: ['优先活动通知', '会员专属权益', '个人成长记录']
}

function formatStatusText(status) {
  switch (status) {
    case 'approved':
      return '已确认'
    case 'completed':
      return '已完成'
    case 'cancelled':
      return '已取消'
    default:
      return '待处理'
  }
}

function buildEnrollmentSummary(list) {
  return list.reduce((summary, item) => {
    summary.total += 1
    if (item.status === 'approved') {
      summary.approved += 1
    } else if (item.status === 'completed') {
      summary.completed += 1
    } else if (item.status === 'cancelled') {
      summary.cancelled += 1
    } else {
      summary.pending += 1
    }
    return summary
  }, {
    total: 0,
    pending: 0,
    approved: 0,
    completed: 0,
    cancelled: 0
  })
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

function formatDateText(value) {
  const date = toDate(value)
  if (!date) {
    return ''
  }
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

async function getMembershipConfig(tenantId) {
  try {
    const result = await db.collection('membership_configs')
      .where({
        tenantId
      })
      .limit(1)
      .get()

    if (result.data.length === 0) {
      return DEFAULT_MEMBERSHIP_CONFIG
    }

    const record = result.data[0] || {}
    const benefits = Array.isArray(record.benefits) && record.benefits.length > 0
      ? record.benefits
      : DEFAULT_MEMBERSHIP_CONFIG.benefits

    return {
      enabled: !!record.enabled,
      levelName: record.levelName || DEFAULT_MEMBERSHIP_CONFIG.levelName,
      description: record.description || DEFAULT_MEMBERSHIP_CONFIG.description,
      validityDays: Number(record.validityDays) > 0 ? Number(record.validityDays) : DEFAULT_MEMBERSHIP_CONFIG.validityDays,
      benefits
    }
  } catch (err) {
    console.error('获取会员配置失败:', err)
    return DEFAULT_MEMBERSHIP_CONFIG
  }
}

async function getMembership(openId, tenantId) {
  try {
    const result = await db.collection('user_memberships')
      .where({
        openId,
        tenantId
      })
      .orderBy('updatedAt', 'desc')
      .limit(1)
      .get()

    if (result.data.length === 0) {
      return null
    }

    return result.data[0]
  } catch (err) {
    console.error('获取会员信息失败:', err)
    return null
  }
}

function buildMembershipCard(record, config) {
  const safeConfig = config || DEFAULT_MEMBERSHIP_CONFIG
  const benefits = Array.isArray(safeConfig.benefits) && safeConfig.benefits.length > 0
    ? safeConfig.benefits.slice(0, 3)
    : DEFAULT_MEMBERSHIP_CONFIG.benefits

  if (!safeConfig.enabled) {
    return {
      status: 'disabled',
      statusText: '未开放',
      levelName: safeConfig.levelName || '俱乐部会员',
      description: '当前俱乐部暂未开放会员功能，可先完善个人资料和报名记录。',
      expiresAt: '',
      expiresAtText: '',
      actionText: '暂未开放',
      canActivate: false,
      validityDays: safeConfig.validityDays || 365,
      benefits
    }
  }

  if (!record) {
    return {
      status: 'inactive',
      statusText: '未开通',
      levelName: safeConfig.levelName || '俱乐部会员',
      description: safeConfig.description || DEFAULT_MEMBERSHIP_CONFIG.description,
      expiresAt: '',
      expiresAtText: '',
      actionText: '立即开通',
      canActivate: true,
      validityDays: safeConfig.validityDays || 365,
      benefits
    }
  }

  const expiresAt = toDate(record.expiresAt)
  const isExpired = !!(expiresAt && expiresAt.getTime() < Date.now())
  const status = isExpired ? 'expired' : (record.status || 'active')

  return {
    status,
    statusText: status === 'expired' ? '已过期' : '已开通',
    levelName: record.levelName || safeConfig.levelName || '俱乐部会员',
    description: record.description || safeConfig.description || DEFAULT_MEMBERSHIP_CONFIG.description,
    expiresAt: record.expiresAt || '',
    expiresAtText: formatDateText(record.expiresAt),
    actionText: status === 'expired' ? '立即续期' : '续期会员',
    canActivate: true,
    validityDays: safeConfig.validityDays || 365,
    benefits: Array.isArray(record.benefits) && record.benefits.length > 0
      ? record.benefits.slice(0, 3)
      : benefits
  }
}

exports.main = async (event) => {
  const wxContext = cloud.getWXContext()
  const openId = wxContext.OPENID
  const tenantId = String(event.tenantId || '').trim()
  const limit = Math.min(Math.max(Number(event.limit || 20), 1), 50)

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
    const enrollmentResult = await db.collection('enrollments')
      .where({
        tenantId,
        openId
      })
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get()

    const enrollments = (enrollmentResult.data || []).map(item => ({
      ...item,
      statusText: formatStatusText(item.status)
    }))

    const membershipConfig = await getMembershipConfig(tenantId)
    const membershipRecord = await getMembership(openId, tenantId)

    return {
      success: true,
      openId,
      enrollments,
      summary: buildEnrollmentSummary(enrollments),
      membership: buildMembershipCard(membershipRecord, membershipConfig),
      membershipConfig
    }
  } catch (err) {
    console.error('获取个人中心数据失败:', err)
    return {
      success: false,
      error: err.message
    }
  }
}
