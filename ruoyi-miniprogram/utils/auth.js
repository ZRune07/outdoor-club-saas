import request from './request'

export function login() {
  return new Promise((resolve, reject) => {
    wx.login({
      success: (res) => {
        if (res.code) {
          // 发送 code 到后端换取 session_key 和 openid
          request('/auth/miniprogram/login', {
            method: 'POST',
            data: { code: res.code }
          }).then(res => {
            if (res.code === 200) {
              // 存储 token
              wx.setStorageSync('token', res.data.token)
              wx.setStorageSync('userInfo', res.data.userInfo)
              resolve(res.data)
            } else {
              reject(res)
            }
          }).catch(err => {
            reject(err)
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

export function getUserInfo() {
  const userInfo = wx.getStorageSync('userInfo')
  return userInfo
}

export function getToken() {
  return wx.getStorageSync('token')
}

export function logout() {
  wx.removeStorageSync('token')
  wx.removeStorageSync('userInfo')
}
