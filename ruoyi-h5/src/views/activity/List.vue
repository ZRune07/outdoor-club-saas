<template>
  <div class="activity-list">
    <!-- 顶部Banner -->
    <div class="banner">
      <div class="banner-content">
        <h1 class="banner-title">探索自然</h1>
        <p class="banner-subtitle">和志同道合的人一起户外</p>
      </div>
    </div>

    <!-- 活动分类标签 -->
    <div class="category-tabs">
      <div 
        v-for="tab in tabs" 
        :key="tab.value"
        :class="['tab-item', { active: currentTab === tab.value }]"
        @click="switchTab(tab.value)"
      >
        {{ tab.label }}
      </div>
    </div>

    <!-- 活动列表 -->
    <div class="activity-container">
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
            <div class="card-image">
              <img :src="item.coverImage || defaultCover" :alt="item.activityTitle" />
              <div class="card-badge" :class="getStatusClass(item.status)">
                {{ getStatusText(item.status) }}
              </div>
            </div>
            <div class="card-content">
              <h3 class="card-title">{{ item.activityTitle }}</h3>
              <div class="card-info">
                <div class="info-item">
                  <van-icon name="clock-o" />
                  <span>{{ formatTime(item.startTime) }}</span>
                </div>
                <div class="info-item">
                  <van-icon name="location-o" />
                  <span>{{ item.location || '待定' }}</span>
                </div>
              </div>
              <div class="card-footer">
                <div class="price" v-if="item.price > 0">
                  <span class="amount">¥{{ item.price }}</span>
                  <span class="unit">/人</span>
                </div>
                <div class="price free" v-else>
                  <span>免费</span>
                </div>
                <div class="participants">
                  <span>{{ item.currentParticipants || 0 }}/{{ item.maxParticipants || '∞' }}</span>
                  <van-icon name="friends-o" />
                </div>
              </div>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
      
      <!-- 空状态 -->
      <van-empty 
        v-if="!loading && list.length === 0" 
        description="暂无活动" 
        image="search"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getRecruitingActivities, getActivityList } from '@/api/activity'
import { showToast } from 'vant'

const router = useRouter()
const list = ref([])
const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)
const currentTab = ref('all')
const pageNum = ref(1)
const pageSize = ref(10)

const tabs = [
  { label: '全部', value: 'all' },
  { label: '徒步', value: 'hiking' },
  { label: '骑行', value: 'cycling' },
  { label: '露营', value: 'camping' }
]

const defaultCover = 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400'

onMounted(() => {
  loadData()
})

const onLoad = async () => {
  await loadData()
}

const onRefresh = async () => {
  pageNum.value = 1
  list.value = []
  finished.value = false
  await loadData()
  refreshing.value = false
}

const loadData = async () => {
  try {
    loading.value = true
    let res
    if (currentTab.value === 'all') {
      res = await getRecruitingActivities()
    } else {
      res = await getActivityList({
        activityType: currentTab.value,
        pageNum: pageNum.value,
        pageSize: pageSize.value
      })
    }
    
    if (res.code === 200) {
      const data = res.result || []
      if (currentTab.value === 'all') {
        list.value = data
        finished.value = true
      } else {
        list.value = [...list.value, ...data.rows || []]
        finished.value = list.value.length >= (data.total || 0)
        pageNum.value++
      }
    }
  } catch (error) {
    console.error('加载活动列表失败', error)
    showToast('加载失败')
  } finally {
    loading.value = false
  }
}

const switchTab = async (value) => {
  currentTab.value = value
  pageNum.value = 1
  list.value = []
  finished.value = false
  await loadData()
}

const goToDetail = (id) => {
  router.push(`/activity/${id}`)
}

const formatTime = (time) => {
  if (!time) return '待定'
  const date = new Date(time)
  return `${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`
}

const getStatusClass = (status) => {
  const map = {
    recruiting: 'status-recruiting',
    full: 'status-full',
    ongoing: 'status-ongoing',
    ended: 'status-ended',
    draft: 'status-draft'
  }
  return map[status] || 'status-recruiting'
}

const getStatusText = (status) => {
  const map = {
    recruiting: '招募中',
    full: '已满员',
    ongoing: '进行中',
    ended: '已结束',
    draft: '即将发布'
  }
  return map[status] || '招募中'
}
</script>

<style lang="scss" scoped>
.activity-list {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 20px;
}

.banner {
  height: 180px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  
  .banner-content {
    text-align: center;
    
    .banner-title {
      font-size: 32px;
      font-weight: 600;
      margin: 0 0 8px;
    }
    
    .banner-subtitle {
      font-size: 14px;
      opacity: 0.9;
      margin: 0;
    }
  }
}

.category-tabs {
  display: flex;
  padding: 12px 16px;
  background: #fff;
  gap: 12px;
  overflow-x: auto;
  
  .tab-item {
    flex-shrink: 0;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 14px;
    color: #666;
    background: #f5f5f5;
    transition: all 0.3s;
    
    &.active {
      background: #667eea;
      color: #fff;
    }
  }
}

.activity-container {
  padding: 12px;
}

.activity-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  
  .card-image {
    position: relative;
    height: 180px;
    overflow: hidden;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .card-badge {
      position: absolute;
      top: 12px;
      right: 12px;
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 12px;
      color: #fff;
      
      &.status-recruiting {
        background: #07c160;
      }
      &.status-full {
        background: #ff976a;
      }
      &.status-ongoing {
        background: #667eea;
      }
      &.status-ended {
        background: #999;
      }
      &.status-draft {
        background: #ccc;
      }
    }
  }
  
  .card-content {
    padding: 14px;
    
    .card-title {
      font-size: 16px;
      font-weight: 600;
      color: #333;
      margin: 0 0 12px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    
    .card-info {
      margin-bottom: 12px;
      
      .info-item {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 13px;
        color: #666;
        margin-bottom: 6px;
        
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
    
    .card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .price {
        font-size: 18px;
        font-weight: 600;
        color: #ff4d4f;
        
        .unit {
          font-size: 12px;
          font-weight: normal;
        }
        
        &.free span {
          color: #07c160;
        }
      }
      
      .participants {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 13px;
        color: #999;
      }
    }
  }
}
</style>
