<template>
  <div class="activity-detail">
    <van-nav-bar
      title="活动详情"
      left-arrow
      @click-left="$router.back()"
    />
    
    <div v-if="activity" class="detail-content">
      <img :src="activity.coverImage || defaultCover" class="detail-cover" alt="" />
      
      <div class="info-section">
        <h1 class="activity-title">{{ activity.activityName }}</h1>
        <div class="activity-tags">
          <van-tag type="primary" size="small">{{ activity.activityType }}</van-tag>
          <van-tag type="default" size="small">{{ getStatusText(activity.status) }}</van-tag>
        </div>
      </div>
      
      <van-cell-group inset>
        <van-cell title="活动时间" :value="formatDateTime(activity.startTime) + ' - ' + formatDateTime(activity.endTime)" />
        <van-cell title="活动地点" :value="activity.location" />
        <van-cell title="活动费用" :value="'¥' + activity.fee" />
        <van-cell title="人数限制" :value="activity.participantCount + '/' + activity.maxParticipants" />
        <van-cell title="联系人" :value="activity.contactName" />
        <van-cell title="联系电话" :value="activity.contactPhone" />
      </van-cell-group>
      
      <div class="section">
        <div class="section-title">活动详情</div>
        <div class="section-content">{{ activity.summary }}</div>
      </div>
      
      <div class="section" v-if="activity.content">
        <div class="section-title">详细介绍</div>
        <div class="section-content" v-html="activity.content"></div>
      </div>
    </div>
    
    <div class="bottom-bar">
      <div class="price-info">
        <span class="price-label">费用</span>
        <span class="price-value">¥{{ activity?.fee || 0 }}</span>
      </div>
      <van-button type="primary" size="large" @click="goToRegister">立即报名</van-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getActivityDetail } from '@/api/activity'

const route = useRoute()
const router = useRouter()
const activity = ref(null)
const defaultCover = 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'

const formatDateTime = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`
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

const goToRegister = () => {
  router.push(`/registration/${route.params.id}`)
}

onMounted(async () => {
  try {
    const res = await getActivityDetail(route.params.id)
    if (res.data) {
      activity.value = res.data
    }
  } catch (e) {
    console.error(e)
  }
})
</script>

<style scoped lang="scss">
.activity-detail {
  padding-bottom: 60px;
}

.detail-cover {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.info-section {
  padding: 16px;
  background: #fff;
}

.activity-title {
  font-size: 20px;
  font-weight: bold;
  margin: 0 0 10px 0;
}

.activity-tags {
  display: flex;
  gap: 8px;
}

.section {
  margin-top: 10px;
  background: #fff;
  padding: 16px;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
}

.section-content {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  background: #fff;
  padding: 10px 16px;
  box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
}

.price-info {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 6px;
}

.price-label {
  font-size: 14px;
  color: #666;
}

.price-value {
  font-size: 22px;
  color: #ff4d4f;
  font-weight: bold;
}
</style>
