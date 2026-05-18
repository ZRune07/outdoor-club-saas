<template>
  <div class="admin-invite">
    <van-nav-bar title="接受邀请" left-text="返回" left-arrow @click-left="goBack" fixed />

    <div class="content">
      <van-cell-group inset title="绑定管理员邀请">
        <van-field
          v-model="token"
          label="邀请码"
          placeholder="请输入或粘贴邀请码"
        />
      </van-cell-group>

      <div class="tip">绑定后您将成为该俱乐部的管理员。</div>

      <div class="submit-btn">
        <van-button block type="primary" :loading="binding" @click="onBind">
          确认绑定
        </van-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showToast, showSuccessToast } from 'vant'
import { bindInvite } from '@/api/admin'

const router = useRouter()
const route = useRoute()
const token = ref('')
const binding = ref(false)

onMounted(() => {
  if (route.query.token) {
    token.value = String(route.query.token)
  }
})

const onBind = async () => {
  if (!token.value.trim()) {
    showToast('请输入邀请码')
    return
  }
  try {
    binding.value = true
    await bindInvite({ token: token.value.trim() })
    showSuccessToast('绑定成功')
    setTimeout(() => {
      router.replace('/admin/tenant')
    }, 1000)
  } catch (error) {
    console.error('绑定失败', error)
    showToast('绑定失败')
  } finally {
    binding.value = false
  }
}

const goBack = () => {
  router.back()
}
</script>

<style lang="scss" scoped>
.admin-invite {
  min-height: 100vh;
  background: #f5f5f5;
  padding-top: 46px;
}

.content {
  padding: 16px 0;
}

.tip {
  color: #999;
  font-size: 13px;
  padding: 12px 16px;
}

.submit-btn {
  padding: 16px;
}
</style>
