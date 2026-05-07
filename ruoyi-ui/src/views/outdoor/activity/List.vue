<template>
  <div class="app-container">
    <!-- 搜索表单 -->
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="活动标题" prop="activityTitle">
        <el-input v-model="queryParams.activityTitle" placeholder="请输入活动标题" clearable style="width: 200px" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="活动类型" prop="activityType">
        <el-select v-model="queryParams.activityType" placeholder="请选择活动类型" clearable style="width: 150px">
          <el-option label="徒步" value="hiking" />
          <el-option label="骑行" value="cycling" />
          <el-option label="露营" value="camping" />
          <el-option label="登山" value="mountaineering" />
          <el-option label="滑雪" value="skiing" />
          <el-option label="水上" value="water" />
          <el-option label="其他" value="other" />
        </el-select>
      </el-form-item>
      <el-form-item label="活动状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable style="width: 150px">
          <el-option label="草稿" value="draft" />
          <el-option label="招募中" value="recruiting" />
          <el-option label="已满员" value="full" />
          <el-option label="进行中" value="ongoing" />
          <el-option label="已结束" value="ended" />
          <el-option label="已取消" value="cancelled" />
        </el-select>
      </el-form-item>
      <el-form-item label="活动时间" style="width: 260px">
        <el-date-picker v-model="dateRange" value-format="YYYY-MM-DD" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 操作按钮 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd">新增活动</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Top" :disabled="single" @click="handlePublish">发布</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="info" plain icon="Bottom" :disabled="single" @click="handleUnpublish">下架</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" />
    </el-row>

    <!-- 表格 -->
    <el-table v-loading="loading" :data="activityList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column label="活动ID" align="center" prop="activityId" width="80" />
      <el-table-column label="活动封面" align="center" prop="coverImage" width="100">
        <template #default="scope">
          <el-image v-if="scope.row.coverImage" :src="scope.row.coverImage" fit="cover" style="width: 60px; height: 40px" :preview-src-list="[scope.row.coverImage]" />
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="活动标题" align="left" prop="activityTitle" min-width="200" :show-overflow-tooltip="true" />
      <el-table-column label="活动类型" align="center" prop="activityType" width="100">
        <template #default="scope">
          <el-tag size="small">{{ getActivityTypeName(scope.row.activityType) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="活动时间" align="center" prop="startTime" width="160">
        <template #default="scope">
          <div>{{ parseTime(scope.row.startTime, '{y}-{m}-{d} {h}:{i}') }}</div>
          <div class="text-small text-muted">{{ parseTime(scope.row.endTime, '{h}:{i}') }}结束</div>
        </template>
      </el-table-column>
      <el-table-column label="报名" align="center" width="100">
        <template #default="scope">
          <div>{{ scope.row.currentParticipants || 0 }} / {{ scope.row.maxParticipants || '-' }}</div>
          <el-progress v-if="scope.row.maxParticipants" :percentage="getProgress(scope.row)" :color="getProgressColor(scope.row)" style="width: 80px; margin: 0 auto;" />
        </template>
      </el-table-column>
      <el-table-column label="费用" align="center" prop="price" width="100">
        <template #default="scope">
          <span class="text-price">{{ scope.row.price > 0 ? '¥' + scope.row.price : '免费' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status" width="100">
        <template #default="scope">
          <el-tag :type="getStatusType(scope.row.status)">{{ getStatusName(scope.row.status) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="220" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="View" @click="handleView(scope.row)">查看</el-button>
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button link type="success" icon="User" @click="handleRegistrations(scope.row)">报名</el-button>
          <el-button link type="warning" icon="Switch" @click="handleToggleStatus(scope.row)">
            {{ scope.row.status === 'draft' || scope.row.status === 'ended' || scope.row.status === 'cancelled' ? '发布' : '下架' }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
  </div>
</template>

<script setup name="ActivityManage">
import { listActivity, delActivity, changeActivityStatus } from '@/api/outdoor/activity'
import { parseTime } from '@/utils/ruoyi'
import { useRouter } from 'vue-router'

const router = useRouter()
const { proxy } = getCurrentInstance()

const loading = ref(true)
const showSearch = ref(true)
const activityList = ref([])
const total = ref(0)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const dateRange = ref([])

const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  activityTitle: undefined,
  activityType: undefined,
  status: undefined
})

const activityTypeMap = {
  hiking: '徒步',
  cycling: '骑行',
  camping: '露营',
  mountaineering: '登山',
  skiing: '滑雪',
  water: '水上',
  other: '其他'
}

const statusMap = {
  draft: { name: '草稿', type: 'info' },
  recruiting: { name: '招募中', type: 'success' },
  full: { name: '已满员', type: 'warning' },
  ongoing: { name: '进行中', type: '' },
  ended: { name: '已结束', type: 'info' },
  cancelled: { name: '已取消', type: 'danger' }
}

function getActivityTypeName(type) {
  return activityTypeMap[type] || type
}

function getStatusName(status) {
  return statusMap[status]?.name || status
}

function getStatusType(status) {
  return statusMap[status]?.type || ''
}

function getProgress(activity) {
  if (!activity.maxParticipants) return 0
  return Math.round((activity.currentParticipants / activity.maxParticipants) * 100)
}

function getProgressColor(activity) {
  const percent = getProgress(activity)
  if (percent >= 100) return '#f56c6c'
  if (percent >= 80) return '#e6a23c'
  return '#67c23a'
}

/** 查询活动列表 */
function getList() {
  loading.value = true
  const params = { ...queryParams }
  if (dateRange.value && dateRange.value.length === 2) {
    params.startDate = dateRange.value[0]
    params.endDate = dateRange.value[1]
  }
  listActivity(params).then(response => {
    activityList.value = response.rows
    total.value = response.total
    loading.value = false
  })
}

/** 搜索按钮 */
function handleQuery() {
  queryParams.pageNum = 1
  getList()
}

/** 重置按钮 */
function resetQuery() {
  dateRange.value = []
  proxy.resetForm(queryRef.value)
  queryParams.pageNum = 1
  getList()
}

/** 多选框选中 */
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.activityId)
  single.value = selection.length !== 1
  multiple.value = !selection.length
}

/** 新增按钮 */
function handleAdd() {
  router.push('/outdoor/activity/edit')
}

/** 修改按钮 */
function handleUpdate(row) {
  const activityId = row?.activityId || ids.value[0]
  router.push('/outdoor/activity/edit/' + activityId)
}

/** 查看按钮 */
function handleView(row) {
  router.push('/outdoor/activity/detail/' + row.activityId)
}

/** 查看报名列表 */
function handleRegistrations(row) {
  router.push({ path: '/outdoor/registration', query: { activityId: row.activityId, activityTitle: row.activityTitle } })
}

/** 切换发布状态 */
function handleToggleStatus(row) {
  const targetStatus = ['draft', 'ended', 'cancelled'].includes(row.status) ? 'recruiting' : 'ended'
  const action = targetStatus === 'recruiting' ? '发布' : '下架'
  proxy.$modal.confirm('确认要' + action + '活动"' + row.activityTitle + '"吗?')
    .then(() => changeActivityStatus(row.activityId, targetStatus))
    .then(() => {
      proxy.$modal.msgSuccess(action + '成功')
      getList()
    })
}

/** 发布 */
function handlePublish() {
  const activityId = ids.value[0]
  proxy.$modal.confirm('确认要发布选中的活动吗?')
    .then(() => changeActivityStatus(activityId, 'recruiting'))
    .then(() => {
      proxy.$modal.msgSuccess('发布成功')
      getList()
    })
}

/** 下架 */
function handleUnpublish() {
  const activityId = ids.value[0]
  proxy.$modal.confirm('确认要下架选中的活动吗?')
    .then(() => changeActivityStatus(activityId, 'ended'))
    .then(() => {
      proxy.$modal.msgSuccess('下架成功')
      getList()
    })
}

/** 删除 */
function handleDelete(row) {
  const activityIds = row?.activityId || ids.value
  proxy.$modal.confirm('是否确认删除活动ID为"' + activityIds + '"的数据项?')
    .then(() => delActivity(activityIds))
    .then(() => {
      getList()
      proxy.$modal.msgSuccess('删除成功')
    })
}

getList()
</script>

<style scoped>
.text-small {
  font-size: 12px;
}
.text-muted {
  color: #909399;
}
.text-price {
  color: #f56c6c;
  font-weight: 600;
}
</style>
