<template>
  <div class="registration-list">
    <!-- 顶部导航 -->
    <van-nav-bar title="我的报名" left-text="返回" left-arrow @click-left="goBack" fixed />

    <!-- 标签页 -->
    <van-tabs v-model:active="activeTab" sticky offset-top="46">
      <van-tab title="全部" name="all"></van-tab>
      <van-tab title="待支付" name="pending_payment"></van-tab>
      <van-tab title="已报名" name="confirmed"></van-tab>
      <van-tab title="已取消" name="cancelled"></van-tab>
    </van-tabs>

    <!-- 报名列表 -->
    <div class="list-container">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
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
            @click="goToDetail(item)"
          >
            <div class="card-header">
              <img :src="item.coverImage || defaultCover" class="activity-cover" />
              <div class="activity-info">
                <h3 class="activity-title">{{ item.activityTitle }}</h3>
                <div class="info-row">
                  <van-icon name="clock-o" />
                  <span>{{ formatTime(item.startTime) }}</span>
                </div>
                <div class="info-row">
                  <van-icon name="location-o" />
                  <span>{{ item.location || '待定' }}</span>
                </div>
              </div>
            </div>
            
            <div class="card-footer">
              <div class="status-badge" :class="getStatusClass(item.registrationStatus)">
                {{ getStatusText(item.registrationStatus) }}
              </div>
              <div class="price-info" v-if="item.totalAmount > 0">
                <span class="amount">¥{{ item.totalAmount }}</span>
              </div>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
      
      <!-- 空状态 -->
      <van-empty 
        v-if="!loading && list.length === 0" 
        description="暂无报名记录" 
        image="search"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { getMyRegistrations } from '@/api/registration'
import { showToast } from 'vant'

const router = useRouter()
const list = ref([])
const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)
const activeTab = ref('all')

const defaultCover = 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400'

onMounted(() => {
  loadData()
})

// 监听标签页变化
watch(activeTab, () => {
  list.value = []
  finished.value = false
  loadData()
})

const onLoad = async () => {
  await loadData()
}

const onRefresh = async () => {
  list.value = []
  finished.value = false
  await loadData()
  refreshing.value = false
}

const loadData = async () => {
  try {
    loading.value = true
    const wxUserId = localStorage.getItem('wxUserId') || 1
    const res = await getMyRegistrations(wxUserId)
    
    if (res.code === 200) {
      let data = res.result || []
      
      // 根据状态过滤
      if (activeTab.value !== 'all') {
        data = data.filter(item => item.registrationStatus === activeTab.value)
      }
      
      list.value = data
      finished.value = true
    }
  } catch (error) {
    console.error('加载报名记录失败', error)
    showToast('加载失败')
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.back()
}

const goToDetail = (item) => {
  router.push(`/activity/${item.activityId}`)
}

const formatTime = (time) => {
  if (!time) return '待定'
  const date = new Date(time)
  return `${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`
}

const getStatusClass = (status) => {
  const map = {
    pending_payment: 'status-pending',
    confirmed: 'status-confirmed',
    cancelled: 'status-cancelled'
  }
  return map[status] || 'status-pending'
}

const getStatusText = (status) => {
  const map = {
    pending_payment: '待支付',
    confirmed: '已报名',
    cancelled: '已取消'
  }
  return map[status] || '待支付'
}
</script>

<style lang="scss" scoped>
.registration-list {
  min-height: 100vh;
  background: #f5f5f5;
  padding-top: 46px;
}

.list-container {
  padding: 12px;
}

.registration-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  
  .card-header {
    display: flex;
    padding: 14px;
    
    .activity-cover {
      width: 100px;
      height: 80px;
      border-radius: 8px;
      object-fit: cover;
      flex-shrink: 0;
    }
    
    .activity-info {
      flex: 1;
      margin-left: 12px;
      
      .activity-title {
        font-size: 15px;
        font-weight: 600;
        color: #333;
        margin: 0 0 8px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      
      .info-row {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 12px;
        color: #999;
        margin-bottom: 4px;
      }
    }
  }
  
  .card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 14px;
    border-top: 1px solid #f0f0f0;
    
    .status-badge {
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 12px;
      
      &.status-pending {
        background: #fff7e6;
        color: #fa8c16;
      }
      &.status-confirmed {
        background: #e6f7ff;
        color: #1890ff;
      }
      &.status-cancelled {
        background: #f5f5f5;
        color: #999;
      }
    }
    
    .price-info {
      .amount {
        font-size: 16px;
        font-weight: 600;
        color: #ff4d4f;
      }
    }
  }
}
</style>
