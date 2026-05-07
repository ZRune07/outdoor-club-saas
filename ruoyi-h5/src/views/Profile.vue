<template>
  <div class="profile">
    <van-nav-bar title="个人中心" />
    
    <div class="profile-header">
      <van-image
        round
        width="80"
        height="80"
        :src="user?.avatar || defaultAvatar"
      />
      <div class="user-info">
        <div class="nickname">{{ user?.nickname || '未登录' }}</div>
      </div>
    </div>
    
    <van-cell-group inset>
      <van-cell title="我的报名" is-link @click="$router.push('/my-registrations')">
        <template #icon>
          <van-icon name="orders-o" size="18" />
        </template>
      </van-cell>
      <van-cell title="联系客服" is-link>
        <template #icon>
          <van-icon name="service-o" size="18" />
        </template>
      </van-cell>
      <van-cell title="关于我们" is-link>
        <template #icon>
          <van-icon name="info-o" size="18" />
        </template>
      </van-cell>
    </van-cell-group>
    
    <div class="logout-section">
      <van-button block plain type="danger" @click="handleLogout" v-if="user">退出登录</van-button>
    </div>
    
    <van-tabbar v-model="activeTabbar">
      <van-tabbar-item icon="home-o" @click="$router.push('/home')">首页</van-tabbar-item>
      <van-tabbar-item icon="orders-o" @click="$router.push('/activity')">活动</van-tabbar-item>
      <van-tabbar-item icon="user-o" @click="$router.push('/profile')">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getUser, clearAuth } from '@/utils/auth'

const router = useRouter()
const user = ref(null)
const activeTabbar = ref(2)
const defaultAvatar = 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'

const handleLogout = () => {
  clearAuth()
  user.value = null
  router.push('/login')
}

onMounted(() => {
  user.value = getUser()
})
</script>

<style scoped lang="scss">
.profile {
  padding-bottom: 50px;
  background: #f7f8fa;
}

.profile-header {
  background: #fff;
  padding: 30px 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 10px;
}

.nickname {
  font-size: 18px;
  font-weight: bold;
}

.logout-section {
  padding: 20px 16px;
}
</style>
