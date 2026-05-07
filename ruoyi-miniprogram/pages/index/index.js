Page({
  data: {
    activityList: [],
    loading: false
  },

  onLoad() {
    this.fetchActivityList()
  },

  onPullDownRefresh() {
    this.fetchActivityList().then(() => {
      wx.stopPullDownRefresh()
    })
  },

  async fetchActivityList() {
    this.setData({ loading: true })
    try {
      const res = await wx.request({
        url: 'https://your-api-domain.com/api/outdoor/activity/list',
        method: 'GET',
        data: { pageNum: 1, pageSize: 10 }
      })
      if (res.data.code === 200) {
        this.setData({
          activityList: res.data.rows || []
        })
      }
    } catch (error) {
      console.error(error)
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      })
    } finally {
      this.setData({ loading: false })
    }
  },

  goToActivityDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/webview/webview?url=/activity/${id}`
    })
  }
})
