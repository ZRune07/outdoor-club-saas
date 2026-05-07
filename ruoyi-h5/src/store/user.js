import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const userInfo = ref(null)
  const token = ref('')

  const setUserInfo = (info) => {
    userInfo.value = info
  }

  const setToken = (newToken) => {
    token.value = newToken
  }

  const clearUserInfo = () => {
    userInfo.value = null
    token.value = ''
  }

  return {
    userInfo,
    token,
    setUserInfo,
    setToken,
    clearUserInfo
  }
})
