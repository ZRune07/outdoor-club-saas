// cloudfunctions/addEnrollment/index.js
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

const SYSTEM_KEYS = new Set([
  'tcbContext',
  'userInfo',
  '_openid',
  'openId',
  'createdAt',
  'updatedAt'
])

function cleanText(value) {
  return typeof value === 'string' ? value.trim() : value
}

function normalizePayload(event) {
  const cleanEvent = {}
  Object.keys(event || {}).forEach(key => {
    if (!SYSTEM_KEYS.has(key)) {
      cleanEvent[key] = cleanText(event[key])
    }
  })

  const category = cleanEvent.categoryId
  if (category && typeof category === 'object') {
    cleanEvent.categoryName = cleanEvent.categoryName || category.name || ''
    cleanEvent.categoryId = category.id || category._id || ''
  }

  cleanEvent.tenantId = String(cleanEvent.tenantId || '').trim()
  cleanEvent.postId = Number(cleanEvent.postId)
  cleanEvent.participantCount = Number(cleanEvent.participantCount || 1)
  cleanEvent.name = String(cleanEvent.name || '').trim()
  cleanEvent.phone = String(cleanEvent.phone || cleanEvent.telephone || '').trim()
  cleanEvent.status = String(cleanEvent.status || 'pending').trim()
  cleanEvent.agreementStatus = String(cleanEvent.agreementStatus || 'not_required').trim()

  return cleanEvent
}

function validateEnrollment(data, openId) {
  if (!openId) return '无法识别用户身份'
  if (!data.tenantId) return '缺少俱乐部ID'
  if (!Number.isFinite(data.postId) || data.postId <= 0) return '缺少活动ID'
  if (!data.name) return '请填写姓名'
  if (!data.phone) return '请填写手机号'
  if (!/^1\d{10}$/.test(data.phone)) return '手机号格式不正确'
  if (!Number.isFinite(data.participantCount) || data.participantCount < 1) return '参与人数必须大于 0'
  return ''
}

exports.main = async (event) => {
  try {
    const wxContext = cloud.getWXContext()
    const openId = wxContext.OPENID || ''
    const enrollmentData = normalizePayload(event)
    const validationError = validateEnrollment(enrollmentData, openId)

    if (validationError) {
      return {
        success: false,
        error: validationError
      }
    }

    const now = new Date()
    const existing = await db.collection('enrollments')
      .where({
        tenantId: enrollmentData.tenantId,
        postId: enrollmentData.postId,
        openId
      })
      .limit(1)
      .get()

    const baseData = {
      ...enrollmentData,
      openId,
      source: 'miniprogram',
      updatedAt: now
    }

    if (existing.data.length > 0) {
      const target = existing.data[0]
      await db.collection('enrollments')
        .doc(target._id)
        .update({
          data: {
            ...baseData,
            createdAt: target.createdAt || now,
            agreementStatus: enrollmentData.agreementStatus === 'waiting_signature'
              ? (target.agreementStatus === 'signed' ? 'signed' : 'waiting_signature')
              : enrollmentData.agreementStatus
          }
        })

      return {
        success: true,
        _id: target._id,
        isUpdated: true,
        createdAt: target.createdAt || now
      }
    }

    const result = await db.collection('enrollments').add({
      data: {
        ...baseData,
        createdAt: now
      }
    })

    return {
      success: true,
      _id: result._id,
      isUpdated: false,
      createdAt: now
    }
  } catch (err) {
    console.error('save enrollment failed:', err)
    return {
      success: false,
      error: err.message
    }
  }
}
