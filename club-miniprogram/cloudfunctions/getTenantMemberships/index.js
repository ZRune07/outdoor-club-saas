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

function formatDateTime(value) {
  const date = toDate(value)
  if (!date) {
    return ''
  }
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hour = String(date.getHours()).padStart(2, '0')
  const minute = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hour}:${minute}`
}

function maskOpenId(openId) {
  if (!openId) {
    return '未知用户'
  }
  if (openId.length <= 8) {
    return openId
  }
  return `${openId.slice(0, 4)}****${openId.slice(-4)}`
}

function buildContactMap(enrollments) {
  return (enrollments || []).reduce((map, item) => {
    if (!item.openId) {
      return map
    }
    if (!map[item.openId]) {
      map[item.openId] = {
        name: item.name || '',
        phone: item.phone || '',
        postTitle: item.postTitle || '',
        updatedAt: toDate(item.updatedAt || item.createdAt)?.getTime() || 0
      }
      return map
    }

    const currentTime = toDate(item.updatedAt || item.createdAt)?.getTime() || 0
    if (currentTime >= map[item.openId].updatedAt) {
      map[item.openId] = {
        name: item.name || map[item.openId].name,
        phone: item.phone || map[item.openId].phone,
        postTitle: item.postTitle || map[item.openId].postTitle,
        updatedAt: currentTime
      }
    }
    return map
  }, {})
}

function buildMemberStatus(item) {
  const expiresAt = toDate(item.expiresAt)
  const now = Date.now()
  const expiresAtMs = expiresAt?.getTime() || 0
  const diffDays = expiresAtMs ? Math.ceil((expiresAtMs - now) / (1000 * 60 * 60 * 24)) : 0

  if (item.status === 'expired' || (expiresAtMs && expiresAtMs < now)) {
    return {
      status: 'expired',
      statusText: '已过期',
      isExpiringSoon: false,
      remainingDays: diffDays
    }
  }

  if (expiresAtMs && diffDays <= 7) {
    return {
      status: 'expiring',
      statusText: '即将到期',
      isExpiringSoon: true,
      remainingDays: diffDays
    }
  }

  return {
    status: 'active',
    statusText: '有效中',
    isExpiringSoon: false,
    remainingDays: diffDays
  }
}

function buildStats(list) {
  return list.reduce((stats, item) => {
    stats.total += 1
    if (item.status === 'expired') {
      stats.expired += 1
    } else if (item.status === 'expiring') {
      stats.expiring += 1
    } else {
      stats.active += 1
    }
    return stats
  }, {
    total: 0,
    active: 0,
    expiring: 0,
    expired: 0
  })
}

function applyFilter(list, filter) {
  if (filter === 'active') {
    return list.filter(item => item.status === 'active')
  }
  if (filter === 'expiring') {
    return list.filter(item => item.status === 'expiring')
  }
  if (filter === 'expired') {
    return list.filter(item => item.status === 'expired')
  }
  return list
}

exports.main = async (event) => {
  const wxContext = cloud.getWXContext()
  const openId = wxContext.OPENID
  const tenantId = String(event.tenantId || '').trim()
  const filter = String(event.filter || 'all').trim()

  try {
    const userIsSuperAdmin = await isSuperAdmin(openId)

    if (!userIsSuperAdmin && !tenantId) {
      return {
        success: false,
        error: '俱乐部ID不能为空'
      }
    }

    if (!userIsSuperAdmin) {
      const userIsTenantAdmin = await isTenantAdmin(openId, tenantId)
      if (!userIsTenantAdmin) {
        return {
          success: false,
          error: '没有权限查看会员信息'
        }
      }
    }

    const membershipResult = await db.collection('user_memberships')
      .where({
        tenantId
      })
      .orderBy('updatedAt', 'desc')
      .limit(200)
      .get()

    const enrollmentResult = await db.collection('enrollments')
      .where({
        tenantId
      })
      .orderBy('updatedAt', 'desc')
      .limit(200)
      .get()

    const contactMap = buildContactMap(enrollmentResult.data || [])

    const memberships = (membershipResult.data || []).map(item => {
      const contact = contactMap[item.openId] || {}
      const memberStatus = buildMemberStatus(item)

      return {
        ...item,
        ...memberStatus,
        displayName: contact.name || maskOpenId(item.openId),
        displayPhone: contact.phone || '',
        latestPostTitle: contact.postTitle || '',
        activatedAtText: formatDateTime(item.activatedAt || item.createdAt),
        expiresAtText: formatDateTime(item.expiresAt),
        openIdText: maskOpenId(item.openId)
      }
    })

    const stats = buildStats(memberships)
    const filteredList = applyFilter(memberships, filter)

    return {
      success: true,
      data: filteredList,
      stats
    }
  } catch (err) {
    console.error('获取会员列表失败:', err)
    return {
      success: false,
      error: err.message
    }
  }
}
