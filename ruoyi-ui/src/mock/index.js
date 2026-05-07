/**
 * Mock 数据拦截器
 * 
 * 在 axios 响应拦截器中，当请求失败（后端不可达）时，
 * 匹配 mock 规则并返回模拟数据，实现生产环境也能演示。
 * 
 * 也可在开发环境通过设置 VITE_MOCK=true 强制使用 mock。
 */

import loginMocks from './login'
import clubMocks from './club'
import activityMocks from './activity'
import registrationMocks from './registration'
import orderMocks from './order'
import memberMocks from './member'
import disclaimerMocks from './disclaimer'
import systemMocks from './system'

// 合并所有 mock 规则
const allMocks = [
  ...loginMocks,
  ...clubMocks,
  ...activityMocks,
  ...registrationMocks,
  ...orderMocks,
  ...memberMocks,
  ...disclaimerMocks,
  ...systemMocks
]

/**
 * 尝试匹配 mock 规则
 * @param {string} url - 请求路径（不含 baseURL 前缀）
 * @param {string} method - 请求方法
 * @param {object} config - 完整请求配置
 * @returns {object|null} mock 响应数据，或 null（未匹配）
 */
export function matchMock(url, method, config = {}) {
  // 去除 baseURL 前缀（/prod-api 或 /dev-api）
  let cleanUrl = url.replace(/^\/(prod|dev|stage)-api/, '')

  for (const mock of allMocks) {
    const mockMethod = mock.method.toLowerCase()
    const reqMethod = method.toLowerCase()

    if (mockMethod !== reqMethod) continue

    if (mock.url instanceof RegExp) {
      if (mock.url.test(cleanUrl)) {
        console.log(`[Mock] ${method.toUpperCase()} ${cleanUrl} => mock data`)
        return mock.response({ ...config, url: cleanUrl })
      }
    } else if (typeof mock.url === 'string') {
      // 精确匹配 URL 路径（忽略 query 参数）
      const mockPath = mock.url.split('?')[0]
      const reqPath = cleanUrl.split('?')[0]
      if (mockPath === reqPath) {
        console.log(`[Mock] ${method.toUpperCase()} ${cleanUrl} => mock data`)
        return mock.response({ ...config, url: cleanUrl })
      }
    }
  }

  return null
}

/**
 * 是否启用 Mock 模式
 * 1. 环境变量 VITE_MOCK = 'true' 时强制启用
 * 2. 后端不可达时自动 fallback
 */
export const isMockEnabled = import.meta.env.VITE_MOCK === 'true'

export default { matchMock, isMockEnabled }
