import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const userInfo = ref(null)
  const token = ref('')
  const clubId = ref(null)
  const role = ref('')

  const setUserInfo = (info) => {
    userInfo.value = info
    if (info) {
      if (info.clubId != null) clubId.value = info.clubId
      if (info.role != null) role.value = info.role
    }
  }

  const setToken = (newToken) => {
    token.value = newToken
  }

  const setClubId = (id) => {
    clubId.value = id
  }

  const setRole = (newRole) => {
    role.value = newRole
  }

  const clearUserInfo = () => {
    userInfo.value = null
    token.value = ''
    clubId.value = null
    role.value = ''
  }

  return {
    userInfo,
    token,
    clubId,
    role,
    setUserInfo,
    setToken,
    setClubId,
    setRole,
    clearUserInfo
  }
})
