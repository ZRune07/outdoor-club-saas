<template>
  <div class="home">
    <van-nav-bar title="活动列表" />
    <div class="content">
      <div v-if="loading" class="loading">
        <van-loading type="spinner" />
      </div>
      <div v-else-if="activityList.length > 0" class="activity-list">
        <van-cell
          v-for="activity in activityList"
          :key="activity.activityId"
          is-link
          :title="activity.activityName"
          :label="activity.location"
          @click="goToDetail(activity.activityId)"
        >
          <template #icon>
            <img
              v-if="activity.coverImage"
              :src="activity.coverImage"
              class="cover-image"
            />
            <div v-else class="cover-placeholder">
              <van-icon name="photo-o" size="32" />
            </div>
          </template>
        </van-cell>
      </div>
      <div v-else class="empty">
        <van-empty description="暂无活动" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getActivityList } from '@/api/activity'

const router = useRouter()
const loading = ref(false)
const activityList = ref([])

const fetchActivityList = async () => {
  loading.value = true
  try {
    const res = await getActivityList({ pageNum: 1, pageSize: 10 })
    activityList.value = res.rows || []
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const goToDetail = (id) => {
  router.push(`/activity/${id}`)
}

onMounted(() => {
  fetchActivityList()
})
</script>

<style scoped>
.home {
  min-height: 100vh;
  background-color: #f7f8fa;
}

.content {
  padding: 12px;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 0;
}

.activity-list {
  background-color: #fff;
  border-radius: 8px;
}

.cover-image {
  width: 60px;
  height: 60px;
  border-radius: 4px;
  object-fit: cover;
}

.cover-placeholder {
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f2f3f5;
  border-radius: 4px;
  color: #969799;
}

.empty {
  padding: 40px 0;
}
</style>
