// pages/super-admin/super-admin.js
const app = getApp()

Page({
  data: {
    tenantId: '',
    bindLink: '',
    inviteToken: '',
    shareReady: false,  // 是否准备好分享
    guideSteps: [
      '输入俱乐部 ID，生成一次性管理员邀请链接',
      '通过右上角分享发送给对应管理员',
      '对方完成绑定后链接自动失效，再邀请需重新生成'
    ]
  },

  async onLoad(options) {
    await app.initUserIdentity()

    // 检查是否是超级管理员
    if (!app.globalData.isSuperAdmin) {
      wx.showToast({
        title: '您没有权限访问',
        icon: 'none'
      })
      setTimeout(() => {
        wx.navigateBack()
      }, 1500)
      return
    }
    
    // 开启分享功能
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },

  onTenantIdInput(e) {
    const tenantId = String(e.detail.value || '').trim()
    this.setData({
      tenantId,
      bindLink: '',
      inviteToken: '',
      shareReady: false
    })
  },

  async generateLink() {
    const tenantId = this.data.tenantId.trim()
    
    if (!tenantId) {
      wx.showToast({
        title: '请输入俱乐部ID',
        icon: 'none'
      })
      return
    }

    try {
      wx.showLoading({
        title: '生成中...'
      })

      const result = await wx.cloud.callFunction({
        name: 'createAdminInvite',
        data: {
          tenantId
        }
      })

      wx.hideLoading()

      if (!result.result || !result.result.success || !result.result.token) {
        throw new Error(result.result?.message || '生成邀请失败')
      }

      const inviteToken = result.result.token
      const bindLink = `/pages/index/index?tenantId=${tenantId}&bindAdmin=true&inviteToken=${inviteToken}`
      
      this.setData({
        bindLink,
        inviteToken,
        shareReady: true
      })

      wx.navigateTo({
        url: `/pages/admin-invite/admin-invite?tenantId=${encodeURIComponent(tenantId)}&inviteToken=${inviteToken}&source=super-admin`
      })
    } catch (err) {
      wx.hideLoading()
      wx.showToast({
        title: err.message || '生成失败',
        icon: 'none'
      })
    }
  },

  copyLink() {
    wx.setClipboardData({
      data: this.data.bindLink,
      success: () => {
        wx.showToast({
          title: '链接已复制',
          icon: 'success'
        })
      }
    })
  },

  clearLink() {
    this.setData({
      bindLink: '',
      inviteToken: '',
      tenantId: '',
      shareReady: false
    })
  },

  // 自定义分享内容
  onShareAppMessage() {
    return {
      title: '户外云管家',
      path: '/pages/index/index'
    }
  },

  // 分享到朋友圈
  onShareTimeline() {
    return {
      title: '户外云管家'
    }
  }
})
