App({
  onLaunch() {
    console.log('小程序启动')
    this.checkLoginStatus()
  },
  
  globalData: {
    clubId: null,
    userInfo: null
  },
  
  checkLoginStatus() {
    const userInfo = wx.getStorageSync('userInfo')
    const token = wx.getStorageSync('token')
    if (userInfo && token) {
      this.globalData.userInfo = userInfo
    }
  },
  
  login() {
    return new Promise((resolve, reject) => {
      wx.login({
        success: (res) => {
          if (res.code) {
            wx.request({
              url: 'https://your-api-domain.com/api/auth/miniprogram/login',
              method: 'POST',
              data: { code: res.code },
              success: (response) => {
                if (response.data.code === 200) {
                  wx.setStorageSync('token', response.data.data.token)
                  wx.setStorageSync('userInfo', response.data.data.userInfo)
                  this.globalData.userInfo = response.data.data.userInfo
                  resolve(response.data.data)
                } else {
                  reject(response.data)
                }
              },
              fail: (err) => {
                reject(err)
              }
            })
          } else {
            reject(res)
          }
        },
        fail: (err) => {
          reject(err)
        }
      })
    })
  }
})
