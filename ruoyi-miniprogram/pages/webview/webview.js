Page({
  data: {
    url: '',
    title: '详情'
  },

  onLoad(options) {
    if (options.url) {
      const baseUrl = 'https://your-h5-domain.com'
      this.setData({
        url: baseUrl + options.url
      })
      
      // 根据 URL 动态设置标题
      if (options.url.includes('/activity/')) {
        this.setData({ title: '活动详情' })
      }
    }
  },

  onShareAppMessage() {
    return {
      title: this.data.title,
      path: this.route
    }
  }
})
