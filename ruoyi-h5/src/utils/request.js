import axios from 'axios'
import { showToast } from 'vant'
import { getToken, clearAuth } from './auth'
import router from '../router'

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    const res = response.data
    if (res.code !== 200) {
      if (res.code === 401) {
        showToast('登录已过期，请重新登录')
        clearAuth()
        router.push('/login')
        return Promise.reject(new Error('登录已过期'))
      }
      showToast(res.msg || '请求失败')
      return Promise.reject(new Error(res.msg || '请求失败'))
    }
    return res
  },
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        showToast('登录已过期，请重新登录')
        clearAuth()
        router.push('/login')
      } else {
        showToast(error.response.data?.msg || error.message || '网络错误')
      }
    } else {
      showToast(error.message || '网络错误')
    }
    return Promise.reject(error)
  }
)

export default request
