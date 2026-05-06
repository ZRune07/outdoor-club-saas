Page({
  data: {
  },
  onLoad(options) {
    // 页面加载时获取 clubId
    if (options.clubId) {
      wx.setStorageSync('clubId', options.clubId)
      getApp().globalData.clubId = options.clubId
    }
  },
  onShow() {
    // 页面显示
  }
})
