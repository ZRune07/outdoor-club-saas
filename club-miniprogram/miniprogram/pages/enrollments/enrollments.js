const app = getApp()

Page({
  data: {
    tenantId: 'default',
    loading: true,
    enrollments: []
  },

  async onLoad(options) {
    const tenantId = options?.tenantId ? app.initTenantFromOptions(options) : app.getCurrentTenantId()
    this.setData({ tenantId })
    await this.loadEnrollments()
  },

  onPullDownRefresh() {
    this.loadEnrollments().finally(() => {
      wx.stopPullDownRefresh()
    })
  },

  formatDateTime(value) {
    if (!value) {
      return ''
    }
    let date = value
    if (value && typeof value === 'object') {
      if (typeof value.toDate === 'function') {
        date = value.toDate()
      } else if (typeof value.seconds === 'number') {
        date = new Date(value.seconds * 1000)
      }
    }
    const finalDate = date instanceof Date ? date : new Date(date)
    if (Number.isNaN(finalDate.getTime())) {
      return ''
    }
    const year = finalDate.getFullYear()
    const month = String(finalDate.getMonth() + 1).padStart(2, '0')
    const day = String(finalDate.getDate()).padStart(2, '0')
    const hour = String(finalDate.getHours()).padStart(2, '0')
    const minute = String(finalDate.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day} ${hour}:${minute}`
  },

  maskPhone(phone) {
    const text = String(phone || '').trim()
    if (!text) {
      return '未填写'
    }
    if (text.length < 7) {
      return text
    }
    return `${text.slice(0, 3)}****${text.slice(-4)}`
  },

  normalizeEnrollments(list) {
    return (Array.isArray(list) ? list : []).map(item => ({
      ...item,
      createdAtText: this.formatDateTime(item.createdAt),
      participantCountText: Number(item.participantCount || 1),
      statusText: item.statusText || '待处理',
      applicantName: item.name || '未填写',
      applicantPhone: this.maskPhone(item.phone),
      postTitle: item.postTitle || '活动报名记录'
    }))
  },

  async loadEnrollments() {
    const tenantId = this.data.tenantId || app.getCurrentTenantId()
    this.setData({ loading: true })
    if (!wx.cloud) {
      this.setData({
        loading: false,
        enrollments: []
      })
      return
    }
    try {
      const result = await wx.cloud.callFunction({
        name: 'getMyCenterData',
        data: {
          tenantId,
          limit: 50
        }
      })
      const data = result.result || {}
      if (!data.success) {
        throw new Error(data.error || '加载失败')
      }
      this.setData({
        loading: false,
        enrollments: this.normalizeEnrollments(data.enrollments)
      })
    } catch (err) {
      console.error('加载报名记录失败:', err)
      this.setData({
        loading: false,
        enrollments: []
      })
      wx.showToast({
        title: '加载报名记录失败',
        icon: 'none'
      })
    }
  },

  goToEnrollmentDetail(e) {
    const postId = e.currentTarget.dataset.postId
    const tenantId = this.data.tenantId || app.getCurrentTenantId()
    if (!postId) {
      return
    }
    wx.navigateTo({
      url: `/pages/detail/detail?id=${postId}&tenantId=${tenantId}`
    })
  }
})
