<template>
  <div class="activity-detail">
    <van-nav-bar title="活动详情" left-arrow @click-left="goBack" />
    <div v-if="loading" class="loading">
      <van-loading type="spinner" />
    </div>
    <div v-else-if="activity" class="content">
      <img
        v-if="activity.coverImage"
        :src="activity.coverImage"
        class="cover"
        alt="活动封面"
      />
      <div class="info-card">
        <h2 class="title">{{ activity.activityName }}</h2>
        <div class="meta">
          <van-tag v-if="activity.activityType" type="primary">
            {{ activity.activityType }}
          </van-tag>
          <span class="status" :class="getStatusClass(activity.status)">
            {{ getStatusText(activity.status) }}
          </span>
        </div>
        <van-cell-group inset>
          <van-cell title="活动时间" :value="formatDateTime(activity.startTime)" />
          <van-cell title="活动地点" :value="activity.location" />
          <van-cell title="活动人数">
            <template #value>
              <span>{{ activity.participantCount || 0 }}/{{ activity.maxParticipants || '不限' }}</span>
            </template>
          </van-cell>
          <van-cell v-if="activity.fee" title="活动费用" :value="`¥${activity.fee}`" />
          <van-cell v-if="activity.contactName" title="联系人" :value="activity.contactName" />
          <van-cell v-if="activity.contactPhone" title="联系电话" :value="activity.contactPhone" />
        </van-cell-group>
        <div v-if="activity.summary" class="section">
          <h3 class="section-title">活动简介</h3>
          <p class="section-content">{{ activity.summary }}</p>
        </div>
        <div v-if="activity.content" class="section">
          <h3 class="section-title">活动详情</h3>
          <div class="section-content" v-html="activity.content"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getActivityDetail } from '@/api/activity'

const router = useRouter()
const route = useRoute()
const loading = ref(false)
const activity = ref(null)

const goBack = () => {
  router.back()
}

const getStatusText = (status) => {
  const statusMap = {
    '0': '未开始',
    '1': '进行中',
    '2': '已结束',
    '3': '已取消'
  }
  return statusMap[status] || '未知'
}

const getStatusClass = (status) => {
  const classMap = {
    '0': 'status-pending',
    '1': 'status-active',
    '2': 'status-ended',
    '3': 'status-cancelled'
  }
  return classMap[status] || ''
}

const formatDateTime = (dateTime) => {
  if (!dateTime) return ''
  const date = new Date(dateTime)
  return date.toLocaleString('zh-CN')
}

const fetchActivityDetail = async () => {
  loading.value = true
  try {
    const res = await getActivityDetail(route.params.id)
    activity.value = res.data
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchActivityDetail()
})
</script>

<style scoped>
.activity-detail {
  min-height: 100vh;
  background-color: #f7f8fa;
  padding-bottom: 20px;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 0;
}

.cover {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.info-card {
  padding: 16px;
}

.title {
  font-size: 20px;
  font-weight: bold;
  margin: 0 0 12px 0;
  color: #191919;
}

.meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.status {
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 4px;
}

.status-pending {
  background-color: #e6f7ff;
  color: #1890ff;
}

.status-active {
  background-color: #f6ffed;
  color: #52c41a;
}

.status-ended, .status-cancelled {
  background-color: #fff7e6;
  color: #fa8c16;
}

.section {
  margin-top: 20px;
  padding: 16px;
  background-color: #fff;
  border-radius: 8px;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  margin: 0 0 12px 0;
  color: #191919;
}

.section-content {
  font-size: 14px;
  color: #646566;
  line-height: 1.6;
}
</style>
