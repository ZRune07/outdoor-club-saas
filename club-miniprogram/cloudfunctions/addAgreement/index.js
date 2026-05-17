// cloudfunctions/addAgreement/index.js
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

function cleanText(value) {
  return typeof value === 'string' ? value.trim() : value
}

function normalizePayload(event) {
  return {
    tenantId: String(event.tenantId || '').trim(),
    enrollmentId: String(event.enrollmentId || '').trim(),
    postId: Number(event.postId),
    content: String(event.content || '').trim(),
    signature: String(event.signature || '').trim(),
    signerName: cleanText(event.signerName || ''),
    signerPhone: cleanText(event.signerPhone || ''),
    status: 'signed',
    signedAt: event.signedAt ? new Date(event.signedAt) : new Date()
  }
}

function validateAgreement(data, openId) {
  if (!openId) return '无法识别用户身份'
  if (!data.tenantId) return '缺少俱乐部ID'
  if (!data.enrollmentId) return '缺少报名记录'
  if (!Number.isFinite(data.postId) || data.postId <= 0) return '缺少活动ID'
  if (!data.content) return '协议内容不能为空'
  if (!data.signature) return '请先完成签名'
  if (!data.signerName) return '缺少签署人姓名'
  if (!data.signerPhone) return '缺少签署人手机号'
  return ''
}

exports.main = async (event) => {
  try {
    const wxContext = cloud.getWXContext()
    const openId = wxContext.OPENID || ''
    const agreementData = normalizePayload(event)
    const validationError = validateAgreement(agreementData, openId)

    if (validationError) {
      return {
        success: false,
        error: validationError
      }
    }

    const enrollment = await db.collection('enrollments').doc(agreementData.enrollmentId).get()
    if (!enrollment.data || enrollment.data.tenantId !== agreementData.tenantId || enrollment.data.openId !== openId) {
      return {
        success: false,
        error: '报名记录不存在或无权签署'
      }
    }

    const now = new Date()
    const existing = await db.collection('agreements')
      .where({
        tenantId: agreementData.tenantId,
        enrollmentId: agreementData.enrollmentId
      })
      .limit(1)
      .get()

    let agreementId = ''
    if (existing.data.length > 0) {
      agreementId = existing.data[0]._id
      await db.collection('agreements').doc(agreementId).update({
        data: {
          ...agreementData,
          openId,
          updatedAt: now
        }
      })
    } else {
      const result = await db.collection('agreements').add({
        data: {
          ...agreementData,
          openId,
          createdAt: now,
          updatedAt: now
        }
      })
      agreementId = result._id
    }

    await db.collection('enrollments').doc(agreementData.enrollmentId).update({
      data: {
        agreementStatus: 'signed',
        agreementId,
        status: enrollment.data.status || 'pending',
        updatedAt: now
      }
    })

    return {
      success: true,
      _id: agreementId
    }
  } catch (err) {
    console.error('save agreement failed:', err)
    return {
      success: false,
      error: err.message
    }
  }
}
