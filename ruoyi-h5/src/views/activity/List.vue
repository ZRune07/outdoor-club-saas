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
        <van-cell
          v-for="item in list"
          :key="item.id"
          :title="item.title"
          :value="item.location"
          :label="item.startTime"
          is-link
          @click="goToDetail(item.id)"
        />
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'

const router = useRouter()
const list = ref([])
const loading = ref(false)
const refreshing = ref(false)
const finished = ref(false)

const onLoad = () => {
  // 模拟加载数据
  setTimeout(() => {
    if (refreshing.value) {
      list.value = []
      refreshing.value = false
    }
    for (let i = 0; i < 10; i++) {
      list.value.push({
        id: list.value.length + 1,
        title: `户外活动 ${list.value.length + 1}`,
        location: '北京市朝阳区',
        startTime: '2024-06-01 08:00:00'
      })
    }
    loading.value = false
    if (list.value.length >= 40) {
      finished.value = true
    }
  }, 1000)
}

const onRefresh = () => {
  finished.value = false
  onLoad()
}

const goToDetail = (id) => {
  router.push(`/activity/${id}`)
}

onMounted(() => {
  onLoad()
})
</script>

<style lang="scss" scoped>
.activity-list {
  min-height: 100vh;
  background-color: #f7f8fa;
}
</style>
