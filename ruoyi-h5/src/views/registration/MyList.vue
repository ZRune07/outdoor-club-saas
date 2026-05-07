<template>
  <div class="my-registrations">
    <van-nav-bar
      title="我的报名"
      left-arrow
      @click-left="$router.back()"
    />
    
    <van-tabs v-model:active="activeTab">
      <van-tab title="全部">
        <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <div
            v-for="item in list"
            :key="item.registrationId"
            class="registration-card"
          >
            <div class="card-content">
              <div class="card-title">{{ item.activityName }}</div>
              <div class="card-meta">
                <span>报名时间：{{ formatDate(item.createTime) }}</span>
              </div>
              <div class="card-footer">
                <span class="price">¥{{ item.totalFee }}</span>
                <van-tag :type="getStatusType(item.status)" size="small">
                  {{ getStatusText(item.status) }}
                </van-tag>
              </div>
            </div>
          </div>
        </van-list>
      </van-tab>
      <van-tab title="待支付">
        <div class="empty" v-if="true">
          <van-empty description="暂无数据" />
        </div>
      </van-tab>
      <van-tab title="已支付">
        <div class="empty" v-if="true">
          <van-empty description="暂无数据" />
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getMyRegistrations } from '@/api/registration'

const activeTab = ref(0)
const list = ref([])
const loading = ref(false)
const finished = ref(false)

const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`
}

const getStatusType = (status) => {
  const map = {
    '0': 'warning',
    '1': 'success',
    '2': 'default',
    '3': 'danger'
  }
  return map[status] || 'default'
}

const getStatusText = (status) => {
  const map = {
    '0': '待支付',
    '1': '已支付',
    '2': '已取消',
    '3': '已退款'
  }
  return map[status] || '未知'
}

const onLoad = async () => {
  try {
    const res = await getMyRegistrations()
    if (res.data) {
      list.value = res.data.rows || res.data
    }
    finished.value = true
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  onLoad()
})
</script>

<style scoped lang="scss">
.my-registrations {
  min-height: 100vh;
  background: #f7f8fa;
}

.registration-card {
  background: #fff;
  margin: 10px;
  border-radius: 8px;
  padding: 16px;
}

.card-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
}

.card-meta {
  font-size: 12px;
  color: #999;
  margin-bottom: 12px;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price {
  font-size: 18px;
  color: #ff4d4f;
  font-weight: bold;
}

.empty {
  margin-top: 40px;
}
</style>
