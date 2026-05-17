const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
exports.main = async (event, context) => {
  const tenantId = String(event.tenantId || '').trim()
  const inviteToken = String(event.inviteToken || '').trim()
  const wxContext = cloud.getWXContext()
  const openId = wxContext.OPENID
  
  if (!tenantId) {
    return {
      success: false,
      message: '租户ID不能为空'
    }
  }

  if (!inviteToken) {
    return {
      success: false,
      message: '邀请链接无效，请重新生成'
    }
  }
  
  try {
    const inviteResult = await db.collection('admin_invites')
      .where({
        tenantId,
        token: inviteToken
      })
      .get()

    if (inviteResult.data.length === 0) {
      return {
        success: false,
        message: '邀请链接无效或已失效，请重新获取'
      }
    }

    const invite = inviteResult.data[0]

    if (invite.status !== 'active' || invite.used) {
      return {
        success: false,
        message: '邀请链接已失效，请联系管理员重新生成'
      }
    }

    const checkResult = await db.collection('tenant_admins')
      .where({
        tenantId,
        openId
      })
      .get()

    if (checkResult.data.length > 0) {
      await db.collection('admin_invites').doc(invite._id).update({
        data: {
          used: true,
          usedAt: new Date(),
          usedByOpenId: openId,
          status: 'used'
        }
      })

      return {
        success: true,
        message: '您已经是该租户的管理员了',
        alreadyAdmin: true
      }
    }
    
    // 添加管理员记录
    const result = await db.collection('tenant_admins').add({
      data: {
        tenantId,
        openId,
        createTime: new Date(),
        role: 'admin'
      }
    })

    await db.collection('admin_invites').doc(invite._id).update({
      data: {
        used: true,
        usedAt: new Date(),
        usedByOpenId: openId,
        status: 'used'
      }
    })
    
    return {
      success: true,
      message: '绑定成功！您现在是该租户的管理员了',
      _id: result._id
    }
  } catch (err) {
    console.error('绑定租户管理员失败:', err)
    return {
      success: false,
      message: '绑定失败：' + err.message
    }
  }
}
