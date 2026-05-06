Page({
  data: {
    webviewUrl: '',
    clubId: null
  },

  onLoad(options) {
    // 获取 clubId
    let clubId = options.clubId || wx.getStorageSync('clubId') || '1'
    this.setData({ clubId })
    getApp().globalData.clubId = clubId

    // 构建 H5 页面地址
    let url = options.url || '/h5/activities'
    // 拼接 clubId 参数
    if (url.indexOf('?') > -1) {
      url += `&club_id=${clubId}`
    } else {
      url += `?club_id=${clubId}`
    }

    // 这里需要替换为实际的 H5 地址
    // 开发环境可以使用本地地址
    const h5BaseUrl = 'http://localhost:5173'
    this.setData({
      webviewUrl: h5BaseUrl + url
    })
  },

  onWebviewMessage(e) {
    // 接收 H5 发送的消息
    const data = e.detail.data[0]
    console.log('收到 H5 消息:', data)

    switch (data.type) {
      case 'getClubId':
        this.sendToWebview({
          type: 'clubIdResponse',
          clubId: this.data.clubId
        })
        break
      case 'getUserToken':
        // 从存储中获取 token 并返回
        const token = wx.getStorageSync('token')
        this.sendToWebview({
          type: 'tokenResponse',
          token: token
        })
        break
      case 'requestPayment':
        this.handlePayment(data)
        break
      case 'showShareMenu':
        this.showShareMenu(data)
        break
    }
  },

  sendToWebview(data) {
    // 向 H5 发送消息 - 通过 web-view 的 postMessage 机制
    // 实际项目中需要通过 URL 参数或其他方式实现
    console.log('发送消息到 H5:', data)
  },

  handlePayment(params) {
    // 处理微信支付
    wx.requestPayment({
      timeStamp: params.timeStamp,
      nonceStr: params.nonceStr,
      package: params.package,
      signType: params.signType,
      paySign: params.paySign,
      success: (res) => {
        this.sendToWebview({
          type: 'paymentResult',
          success: true,
          data: res
        })
      },
      fail: (err) => {
        this.sendToWebview({
          type: 'paymentResult',
          success: false,
          message: err.errMsg
        })
      }
    })
  },

  showShareMenu(options) {
    // 显示分享菜单
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  }
})
