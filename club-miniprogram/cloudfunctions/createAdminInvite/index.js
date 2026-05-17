const cloud = require('wx-server-sdk')
const crypto = require('crypto')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

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
      openId,
      tenantId
    })
    .get()

  return result.data.length > 0
}

function createInviteToken() {
  return crypto.randomBytes(16).toString('hex')
}

exports.main = async (event) => {
  const wxContext = cloud.getWXContext()
  const openId = wxContext.OPENID
  const tenantId = String(event.tenantId || '').trim()

  if (!tenantId) {
    return {
      success: false,
      message: '租户ID不能为空'
    }
  }

  try {
    const userIsSuperAdmin = await isSuperAdmin(openId)
    const userIsTenantAdmin = userIsSuperAdmin ? true : await isTenantAdmin(openId, tenantId)

    if (!userIsTenantAdmin) {
      return {
        success: false,
        message: '没有权限生成管理员邀请'
      }
    }

    const token = createInviteToken()
    const result = await db.collection('admin_invites').add({
      data: {
        token,
        tenantId,
        createdByOpenId: openId,
        createdByRole: userIsSuperAdmin ? 'super_admin' : 'admin',
        createdAt: new Date(),
        status: 'active',
        used: false
      }
    })

    await db.collection('admin_invites')
      .where({
        tenantId,
        status: 'active',
        used: false,
        _id: _.neq(result._id)
      })
      .update({
        data: {
          status: 'replaced',
          invalidatedAt: new Date()
        }
      })

    return {
      success: true,
      token,
      inviteId: result._id,
      message: '邀请链接已生成，该链接仅可绑定一次'
    }
  } catch (err) {
    console.error('生成管理员邀请失败:', err)
    return {
      success: false,
      message: '生成邀请失败：' + err.message
    }
  }
}
