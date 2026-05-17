const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

const DEFAULT_AVATAR = 'https://tuanjiansaas-1256002767.cos.ap-chengdu.myqcloud.com/wp-content/uploads/2026/01/touxiang.png'

function sanitizePostIds(postIds) {
  return (Array.isArray(postIds) ? postIds : [])
    .map(item => Number(item))
    .filter(item => Number.isFinite(item) && item > 0)
    .slice(0, 50)
}

function isCountableStatus(status) {
  const normalized = String(status || '').trim().toLowerCase()
  return normalized !== 'cancelled' && normalized !== 'rejected'
}

exports.main = async (event) => {
  const wxContext = cloud.getWXContext()
  const currentOpenId = wxContext.OPENID || ''
  const tenantId = String(event.tenantId || '').trim()
  const postIds = sanitizePostIds(event.postIds)

  if (!tenantId || postIds.length === 0) {
    return {
      success: true,
      statsByPostId: {}
    }
  }

  try {
    const result = await db.collection('enrollments')
      .where({
        tenantId,
        postId: _.in(postIds)
      })
      .orderBy('createdAt', 'desc')
      .limit(1000)
      .get()

    const statsByPostId = {}

    postIds.forEach(postId => {
      statsByPostId[String(postId)] = {
        count: 0,
        avatars: [],
        isEnrolled: false
      }
    })

    ;(result.data || []).forEach(item => {
      const postKey = String(Number(item.postId))
      const stat = statsByPostId[postKey]
      if (!stat || !isCountableStatus(item.status)) {
        return
      }

      stat.count += 1

      if (item.openId && currentOpenId && item.openId === currentOpenId) {
        stat.isEnrolled = true
      }

      const avatarUrl = String(item.avatarUrl || '').trim() || DEFAULT_AVATAR
      if (stat.avatars.length < 6 && !stat.avatars.includes(avatarUrl)) {
        stat.avatars.push(avatarUrl)
      }
    })

    return {
      success: true,
      statsByPostId
    }
  } catch (err) {
    console.error('获取活动报名统计失败:', err)
    return {
      success: false,
      error: err.message,
      statsByPostId: {}
    }
  }
}
