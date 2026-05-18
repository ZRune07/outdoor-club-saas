<template>
  <div class="super-admin">
    <van-nav-bar title="生成邀请链接" left-text="返回" left-arrow @click-left="goBack" fixed />

    <div class="content">
      <van-cell-group inset title="邀请信息">
        <van-field
          v-model="form.clubName"
          label="俱乐部名称"
          placeholder="请输入俱乐部名称"
        />
        <van-field label="角色" readonly>
          <template #input>
            <van-radio-group v-model="form.role" direction="horizontal">
              <van-radio name="tenant_admin">俱乐部管理员</van-radio>
            </van-radio-group>
          </template>
        </van-field>
      </van-cell-group>

      <div class="submit-btn">
        <van-button block type="primary" :loading="creating" @click="onCreate">
          生成邀请链接
        </van-button>
      </div>

      <van-cell-group inset title="生成结果" v-if="inviteUrl">
        <van-field
          v-model="inviteUrl"
          label="链接"
          readonly
          type="textarea"
          autosize
        />
        <van-cell>
          <template #title>
            <van-button size="small" type="primary" plain @click="copyUrl">
              复制链接
            </van-button>
          </template>
        </van-cell>
      </van-cell-group>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showSuccessToast } from 'vant'
import { createInvite } from '@/api/admin'

const router = useRouter()
const creating = ref(false)
const inviteUrl = ref('')

const form = reactive({
  clubName: '',
  role: 'tenant_admin'
})

const onCreate = async () => {
  if (!form.clubName.trim()) {
    showToast('请输入俱乐部名称')
    return
  }
  try {
    creating.value = true
    const res = await createInvite({
      clubName: form.clubName.trim(),
      role: form.role
    })
    const data = res.result || res.data || {}
    const token = data.token || data.inviteToken || ''
    inviteUrl.value =
      data.url || `${window.location.origin}/admin/invite?token=${token}`
    showSuccessToast('生成成功')
  } catch (error) {
    console.error('生成邀请链接失败', error)
    showToast('生成失败')
  } finally {
    creating.value = false
  }
}

const copyUrl = async () => {
  try {
    await navigator.clipboard.writeText(inviteUrl.value)
    showSuccessToast('已复制')
  } catch (e) {
    showToast('复制失败，请手动复制')
  }
}

const goBack = () => {
  router.back()
}
</script>

<style lang="scss" scoped>
.super-admin {
  min-height: 100vh;
  background: #f5f5f5;
  padding-top: 46px;
}

.content {
  padding: 16px 0;
}

.submit-btn {
  padding: 16px;
}
</style>
