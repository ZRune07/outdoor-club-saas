<template>
  <div class="activity-list">
    <van-nav-bar title="活动列表" />
    
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <div
          v-for="item in list"
          :key="item.activityId"
          class="activity-card"
          @click="goToDetail(item.activityId)"
        >
          <img :src="item.coverImage || defaultCover" class="activity-cover" alt="" />
          <div class="activity-info">
            <div class="activity-title">{{ item.activityName }}</div>
            <div class="activity-meta">
              <span class="activity-type">{{ item.activityType }}</span>
              <span class="activity-time">{{ formatDate(item.startTime) }}</span>
            </div>
            <div class="activity-footer">
              <span class="activity-price">¥{{ item.fee }}</span>
              <van-tag type="primary" size="small">{{ getStatusText(item.status) }}</van-tag>
            </div>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
    
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
import { getActivityList } from '@/api/activity'

const router = useRouter()
const list = ref([])
const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)
const activeTabbar = ref(1)
const defaultCover = 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'

const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`
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

const goToDetail = (id) => {
  router.push(`/activity/${id}`)
}

const onLoad = async () => {
  try {
    const res = await getActivityList()
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

const onRefresh = async () => {
  await onLoad()
  refreshing.value = false
}

onMounted(() => {
  onLoad()
})
</script>

<style scoped lang="scss">
.activity-list {
  padding-bottom: 50px;
}

.activity-card {
  display: flex;
  padding: 12px;
  background: #fff;
  margin-bottom: 10px;
  
  .activity-cover {
    width: 120px;
    height: 90px;
    object-fit: cover;
    border-radius: 8px;
    flex-shrink: 0;
  }
  
  .activity-info {
    flex: 1;
    margin-left: 12px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  
  .activity-title {
    font-size: 16px;
    font-weight: bold;
    color: #333;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  .activity-meta {
    display: flex;
    gap: 10px;
    font-size: 12px;
    color: #999;
  }
  
  .activity-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .activity-price {
    font-size: 18px;
    color: #ff4d4f;
    font-weight: bold;
  }
}
</style>
