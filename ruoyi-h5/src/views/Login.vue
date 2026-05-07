<template>
  <div class="login">
    <div class="login-header">
      <img src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg" class="logo" alt="logo" />
      <h1 class="title">户外俱乐部</h1>
      <p class="desc">探索自然，发现美好</p>
    </div>
    
    <div class="login-content">
      <van-button
        round
        block
        type="primary"
        size="large"
        @click="handleWechatLogin"
        :loading="loading"
      >
        <van-icon name="wechat" style="margin-right: 8px;" />
        微信登录
      </van-button>
      
      <div class="agreement">
        <van-checkbox v-model="agreed">
          我已阅读并同意
          <span class="link">《用户协议》</span>
          和
          <span class="link">《隐私政策》</span>
        </van-checkbox>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { login } from '@/api/auth'
import { setToken, setUser } from '@/utils/auth'

const router = useRouter()
const loading = ref(false)
const agreed = ref(false)

const handleWechatLogin = async () => {
  if (!agreed.value) {
    showToast('请先阅读并同意协议')
    return
  }
  
  try {
    loading.value = true
    
    const mockCode = 'mock_code_' + Date.now()
    const res = await login({
      code: mockCode,
      nickname: '户外爱好者',
      avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'
    })
    
    if (res.data?.token) {
      setToken(res.data.token)
      if (res.data.userInfo) {
        setUser(res.data.userInfo)
      }
      router.replace('/home')
    }
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
.login {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
}

.login-header {
  padding-top: 80px;
  text-align: center;
  color: #fff;
}

.logo {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-bottom: 20px;
}

.title {
  font-size: 28px;
  margin: 0 0 8px 0;
}

.desc {
  font-size: 14px;
  opacity: 0.8;
}

.login-content {
  margin-top: auto;
  padding: 40px 20px;
}

.agreement {
  margin-top: 20px;
  color: #fff;
  font-size: 12px;
  text-align: center;
  
  .link {
    color: #fff;
    text-decoration: underline;
  }
}
</style>
