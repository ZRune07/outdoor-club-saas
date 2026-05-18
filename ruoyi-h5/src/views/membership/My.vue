<template>
  <div class="my-membership">
    <van-nav-bar
      title="我的会员"
      left-arrow
      @click-left="$router.back()"
    />

    <div v-if="loading" class="loading">
      <van-loading>加载中...</van-loading>
    </div>

    <template v-else>
      <div class="member-card" :class="{ active: isMember }">
        <div class="card-title">{{ isMember ? '会员有效' : '尚未开通会员' }}</div>
        <div class="card-meta" v-if="isMember">
          <div>等级：{{ membership.levelName || membership.level || '普通会员' }}</div>
          <div v-if="membership.expireTime">有效期至：{{ formatDate(membership.expireTime) }}</div>
        </div>
        <div class="card-meta" v-else>
          <div>开通会员，享受专属权益</div>
        </div>
      </div>

      <van-cell-group v-if="config" inset class="config-group">
        <van-cell title="会员名称" :value="config.name || '俱乐部会员'" />
        <van-cell title="会员价格" :value="config.price != null ? `¥${config.price}` : '免费'" />
        <van-cell
          v-if="config.description"
          title="会员权益"
          :label="config.description"
        />
      </van-cell-group>

      <div class="action-section" v-if="!isMember">
        <van-button
          round
          block
          type="primary"
          size="large"
          :loading="activating"
          @click="onActivate"
        >
          立即开通
        </van-button>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { showToast } from 'vant'
import { getMyMembership, getMembershipConfig, activateMembership } from '@/api/membership'

const loading = ref(true)
const activating = ref(false)
const membership = ref({})
const config = ref(null)

const isMember = computed(() => {
  const m = membership.value
  if (!m) return false
  if (m.status != null) return m.status === 1 || m.status === '1' || m.status === true
  return !!m.levelName || !!m.level
})

const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`
}

const loadData = async () => {
  loading.value = true
  try {
    const [myRes, cfgRes] = await Promise.all([
      getMyMembership().catch(() => null),
      getMembershipConfig().catch(() => null)
    ])
    if (myRes && myRes.data) membership.value = myRes.data
    if (cfgRes && cfgRes.data) config.value = cfgRes.data
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const onActivate = async () => {
  try {
    activating.value = true
    await activateMembership({})
    showToast('开通成功')
    await loadData()
  } catch (e) {
    console.error(e)
  } finally {
    activating.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped lang="scss">
.my-membership {
  min-height: 100vh;
  background: #f7f8fa;
}

.loading {
  padding: 60px 0;
  text-align: center;
}

.member-card {
  margin: 16px;
  padding: 24px;
  border-radius: 12px;
  color: #fff;
  background: linear-gradient(135deg, #909399 0%, #606266 100%);

  &.active {
    background: linear-gradient(135deg, #f6c177 0%, #e6a23c 100%);
  }
}

.card-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 12px;
}

.card-meta {
  font-size: 13px;
  line-height: 1.8;
  opacity: 0.95;
}

.config-group {
  margin-top: 12px;
}

.action-section {
  padding: 24px 16px;
}
</style>
