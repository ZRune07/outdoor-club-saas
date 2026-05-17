const app = getApp()

Page({
  data: {
    tenantId: '',
    inviteToken: '',
    bindLink: '',
    source: '',
    shareTitle: '成为俱乐部管理员 - 户外云管家'
  },

  onLoad(options) {
    const tenantId = String(options.tenantId || '').trim()
    const inviteToken = String(options.inviteToken || '').trim()
    const source = String(options.source || '').trim()

    if (!tenantId || !inviteToken) {
      wx.showToast({
        title: '邀请信息无效',
        icon: 'none'
      })
      setTimeout(() => {
        wx.navigateBack()
      }, 1200)
      return
    }

    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage']
    })

    this.setData({
      tenantId,
      inviteToken,
      source,
      bindLink: `/pages/index/index?tenantId=${tenantId}&bindAdmin=true&inviteToken=${inviteToken}`,
      shareTitle: `邀请加入 ${tenantId} 管理后台`
    })
  },

  copyInviteLink() {
    if (!this.data.bindLink) {
      return
    }

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

  backToSource() {
    wx.navigateBack()
  },

  onShareAppMessage() {
    if (!this.data.bindLink) {
      return {
        title: '户外云管家',
        path: '/pages/index/index'
      }
    }

    return {
      title: this.data.shareTitle,
      path: this.data.bindLink
    }
  }
})
