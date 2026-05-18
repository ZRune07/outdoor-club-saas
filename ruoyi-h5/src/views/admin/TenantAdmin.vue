<template>
  <div class="tenant-admin">
    <van-nav-bar title="报名管理" left-text="返回" left-arrow @click-left="goBack" fixed>
      <template #right>
        <van-icon name="down" @click="onExport" />
      </template>
    </van-nav-bar>

    <van-tabs v-model:active="activeStatus" sticky offset-top="46" @change="onStatusChange">
      <van-tab title="全部" name=""></van-tab>
      <van-tab title="待审核" name="pending"></van-tab>
      <van-tab title="已通过" name="approved"></van-tab>
      <van-tab title="已拒绝" name="rejected"></van-tab>
    </van-tabs>

    <div class="list-container">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <div v-for="item in list" :key="item.id" class="enroll-card">
            <div class="card-row">
              <span class="name">{{ item.userName || item.name || '未知用户' }}</span>
              <span class="status" :class="'status-' + item.status">
                {{ statusText(item.status) }}
              </span>
            </div>
            <div class="card-info">活动：{{ item.activityTitle || item.activityName || '-' }}</div>
            <div class="card-info">手机：{{ item.phone || '-' }}</div>
            <div class="card-info">报名时间：{{ item.createTime || '-' }}</div>
            <div class="card-actions" v-if="item.status === 'pending'">
              <van-button size="small" type="success" @click="changeStatus(item, 'approved')">
                通过
              </van-button>
              <van-button size="small" type="danger" @click="changeStatus(item, 'rejected')">
                拒绝
              </van-button>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>

      <van-empty
        v-if="!loading && list.length === 0"
        description="暂无报名记录"
        image="search"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showSuccessToast, showConfirmDialog } from 'vant'
import { getEnrollments, updateEnrollmentStatus, exportEnrollments } from '@/api/admin'

const router = useRouter()
const list = ref([])
const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)
const activeStatus = ref('')
const pageNum = ref(1)
const pageSize = 10

const statusText = (status) => {
  const map = { pending: '待审核', approved: '已通过', rejected: '已拒绝' }
  return map[status] || status || '-'
}

const loadData = async () => {
  try {
    loading.value = true
    const params = { pageNum: pageNum.value, pageSize }
    if (activeStatus.value) params.status = activeStatus.value
    const res = await getEnrollments(params)
    const data = res.result || res.data || {}
    const rows = data.rows || data.list || data.records || (Array.isArray(data) ? data : [])
    const total = data.total ?? rows.length

    list.value = list.value.concat(rows)
    pageNum.value += 1
    if (list.value.length >= total || rows.length < pageSize) {
      finished.value = true
    }
  } catch (error) {
    console.error('加载报名列表失败', error)
    finished.value = true
  } finally {
    loading.value = false
  }
}

const onLoad = async () => {
  await loadData()
}

const reset = () => {
  list.value = []
  pageNum.value = 1
  finished.value = false
}

const onRefresh = async () => {
  reset()
  await loadData()
  refreshing.value = false
}

const onStatusChange = () => {
  reset()
  loadData()
}

const changeStatus = async (item, status) => {
  try {
    await showConfirmDialog({
      title: '确认操作',
      message: `确定将该报名标记为「${statusText(status)}」？`
    })
  } catch (e) {
    return
  }
  try {
    await updateEnrollmentStatus(item.id, status)
    showSuccessToast('操作成功')
    reset()
    await loadData()
  } catch (error) {
    console.error('修改状态失败', error)
    showToast('操作失败')
  }
}

const onExport = async () => {
  try {
    const params = {}
    if (activeStatus.value) params.status = activeStatus.value
    const blob = await exportEnrollments(params)
    const url = window.URL.createObjectURL(new Blob([blob]))
    const link = document.createElement('a')
    link.href = url
    link.download = `报名列表_${Date.now()}.xlsx`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('导出失败', error)
    showToast('导出失败')
  }
}

const goBack = () => {
  router.back()
}
</script>

<style lang="scss" scoped>
.tenant-admin {
  min-height: 100vh;
  background: #f5f5f5;
  padding-top: 46px;
}

.list-container {
  padding: 12px;
}

.enroll-card {
  background: #fff;
  border-radius: 12px;
  padding: 14px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  .card-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;

    .name {
      font-size: 15px;
      font-weight: 600;
      color: #333;
    }

    .status {
      padding: 2px 10px;
      border-radius: 12px;
      font-size: 12px;
      background: #f5f5f5;
      color: #999;

      &.status-pending {
        background: #fff7e6;
        color: #fa8c16;
      }
      &.status-approved {
        background: #e6f7ff;
        color: #1890ff;
      }
      &.status-rejected {
        background: #fff1f0;
        color: #ff4d4f;
      }
    }
  }

  .card-info {
    font-size: 13px;
    color: #666;
    margin-bottom: 4px;
  }

  .card-actions {
    display: flex;
    gap: 12px;
    margin-top: 10px;
  }
}
</style>
