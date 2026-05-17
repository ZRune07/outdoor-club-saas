<template>
  <div class="app-container">
    <el-page-header @back="goBack" content="活动详情" title="返回" />

    <el-row :gutter="20" class="mt20">
      <!-- 左侧活动信息 -->
      <el-col :span="16">
        <el-card shadow="hover" class="mb20">
          <template #header>
            <div class="card-header">
              <span>活动信息</span>
              <el-button type="primary" size="small" icon="Edit" @click="handleEdit">编辑</el-button>
            </div>
          </template>

          <!-- 封面图 -->
          <div v-if="activity.coverImage" class="cover-image">
            <el-image :src="activity.coverImage" fit="cover" style="width: 100%; max-height: 300px;" :preview-src-list="[activity.coverImage]" />
          </div>

          <el-descriptions :column="2" border class="mt20">
            <el-descriptions-item label="活动标题" :span="2">{{ activity.activityTitle }}</el-descriptions-item>
            <el-descriptions-item label="活动类型">
              <el-tag size="small">{{ getActivityTypeName(activity.activityType) }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="活动状态">
              <el-tag :type="getStatusType(activity.status)">{{ getStatusName(activity.status) }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="开始时间">{{ parseTime(activity.startTime) }}</el-descriptions-item>
            <el-descriptions-item label="结束时间">{{ parseTime(activity.endTime) }}</el-descriptions-item>
            <el-descriptions-item label="报名截止">{{ parseTime(activity.registrationDeadline) }}</el-descriptions-item>
            <el-descriptions-item label="集合地点">{{ activity.meetingPoint || '-' }}</el-descriptions-item>
            <el-descriptions-item label="活动地点" :span="2">{{ activity.location }}</el-descriptions-item>
            <el-descriptions-item label="参与人数" :span="2">
              <span class="text-primary">{{ activity.currentParticipants || 0 }}</span> / {{ activity.maxParticipants }} 人
              <el-progress :percentage="getProgress(activity)" :color="getProgressColor(activity)" style="width: 200px; display: inline-block; margin-left: 10px;" />
            </el-descriptions-item>
            <el-descriptions-item label="活动费用">¥{{ activity.price || 0 }}</el-descriptions-item>
            <el-descriptions-item label="保险费用">¥{{ activity.insurancePrice || 0 }}</el-descriptions-item>
            <el-descriptions-item label="难度等级">
              <el-rate v-model="activity.difficultyLevel" disabled size="small" />
            </el-descriptions-item>
            <el-descriptions-item label="创建时间">{{ parseTime(activity.createTime) }}</el-descriptions-item>
          </el-descriptions>

          <el-divider content-position="left">活动描述</el-divider>
          <div class="description-content">{{ activity.description || '暂无描述' }}</div>

          <el-divider content-position="left">行程安排</el-divider>
          <div class="itinerary-content">
            <pre v-if="activity.itinerary">{{ formatItinerary(activity.itinerary) }}</pre>
            <span v-else class="text-muted">暂无行程安排</span>
          </div>

          <el-divider content-position="left">费用说明</el-divider>
          <div class="fee-content">
            <p><strong>费用包含：</strong>{{ activity.feeInclude || '暂无说明' }}</p>
            <p><strong>费用不含：</strong>{{ activity.feeExclude || '暂无说明' }}</p>
            <p><strong>退款政策：</strong>{{ activity.refundPolicy || '暂无说明' }}</p>
          </div>

          <el-divider content-position="left">安全须知</el-divider>
          <div class="safety-content">
            <p><strong>装备要求：</strong>{{ activity.equipmentRequired || '暂无' }}</p>
            <p><strong>风险提示：</strong>{{ activity.riskWarning || '暂无' }}</p>
          </div>
        </el-card>

        <!-- 报名人员列表 -->
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>报名人员 ({{ registrations.length }})</span>
              <el-button type="primary" size="small" icon="Download" @click="handleExportRegistrations">导出</el-button>
            </div>
          </template>

          <el-table :data="registrations" v-loading="regLoading">
            <el-table-column label="姓名" align="center" prop="realName" />
            <el-table-column label="手机号" align="center" prop="phone" width="130" />
            <el-table-column label="性别" align="center" prop="gender" width="60">
              <template #default="scope">
                {{ scope.row.gender === 'male' ? '男' : scope.row.gender === 'female' ? '女' : '-' }}
              </template>
            </el-table-column>
            <el-table-column label="紧急联系人" align="center" prop="emergencyContact" />
            <el-table-column label="紧急电话" align="center" prop="emergencyPhone" width="130" />
            <el-table-column label="报名状态" align="center" prop="registrationStatus" width="100">
              <template #default="scope">
                <el-tag :type="getRegStatusType(scope.row.registrationStatus)" size="small">
                  {{ getRegStatusName(scope.row.registrationStatus) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="报名时间" align="center" prop="createTime" width="180">
              <template #default="scope">
                {{ parseTime(scope.row.createTime) }}
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <!-- 右侧统计信息 -->
      <el-col :span="8">
        <el-card shadow="hover" class="mb20">
          <template #header>
            <span>数据统计</span>
          </template>
          <el-row :gutter="10">
            <el-col :span="12">
              <div class="stat-item">
                <div class="stat-value">{{ activity.currentParticipants || 0 }}</div>
                <div class="stat-label">已报名</div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="stat-item">
                <div class="stat-value">{{ activity.maxParticipants - (activity.currentParticipants || 0) }}</div>
                <div class="stat-label">剩余名额</div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="stat-item">
                <div class="stat-value">{{ paidCount }}</div>
                <div class="stat-label">已缴费</div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="stat-item">
                <div class="stat-value">{{ totalRevenue }}</div>
                <div class="stat-label">实收(元)</div>
              </div>
            </el-col>
          </el-row>
        </el-card>

        <el-card shadow="hover" class="mb20">
          <template #header>
            <span>快捷操作</span>
          </template>
          <el-space direction="vertical" :size="10" style="width: 100%">
            <el-button type="primary" plain icon="Edit" style="width: 100%" @click="handleEdit">编辑活动</el-button>
            <el-button type="success" plain icon="User" style="width: 100%" @click="handleManageRegistrations">管理报名</el-button>
            <el-button v-if="activity.status === 'draft'" type="warning" plain icon="Top" style="width: 100%" @click="handlePublish">发布活动</el-button>
            <el-button v-if="activity.status === 'recruiting'" type="info" plain icon="Bottom" style="width: 100%" @click="handleUnpublish">下架活动</el-button>
            <el-button type="danger" plain icon="Delete" style="width: 100%" @click="handleDelete">删除活动</el-button>
          </el-space>
        </el-card>

        <el-card shadow="hover">
          <template #header>
            <span>俱乐部信息</span>
          </template>
          <el-descriptions :column="1" border size="small">
            <el-descriptions-item label="俱乐部">{{ activity.clubName || '-' }}</el-descriptions-item>
            <el-descriptions-item label="联系人">{{ activity.contactName || '-' }}</el-descriptions-item>
            <el-descriptions-item label="联系电话">{{ activity.contactPhone || '-' }}</el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup name="ActivityDetail">
import { getActivity, listActivityRegistrations, changeActivityStatus, delActivity } from '@/api/outdoor/activity'
import { parseTime } from '@/utils/ruoyi'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const { proxy } = getCurrentInstance()

const activityId = route.params.activityId

const activity = ref({})
const registrations = ref([])
const regLoading = ref(false)

const activityTypeMap = {
  hiking: '徒步', cycling: '骑行', camping: '露营',
  mountaineering: '登山', skiing: '滑雪', water: '水上', other: '其他'
}

const statusMap = {
  draft: { name: '草稿', type: 'info' },
  recruiting: { name: '招募中', type: 'success' },
  full: { name: '已满员', type: 'warning' },
  ongoing: { name: '进行中', type: '' },
  ended: { name: '已结束', type: 'info' },
  cancelled: { name: '已取消', type: 'danger' }
}

const regStatusMap = {
  pending: { name: '待审核', type: 'warning' },
  approved: { name: '已通过', type: 'success' },
  rejected: { name: '已拒绝', type: 'danger' },
  cancelled: { name: '已取消', type: 'info' }
}

const paidCount = computed(() => registrations.value.filter(r => r.payStatus === 'paid').length)
const totalRevenue = computed(() => {
  return registrations.value
    .filter(r => r.payStatus === 'paid')
    .reduce((sum, r) => sum + (parseFloat(r.payAmount) || 0), 0)
})

function getActivityTypeName(type) { return activityTypeMap[type] || type }
function getStatusName(status) { return statusMap[status]?.name || status }
function getStatusType(status) { return statusMap[status]?.type || '' }
function getRegStatusName(status) { return regStatusMap[status]?.name || status }
function getRegStatusType(status) { return regStatusMap[status]?.type || '' }

function getProgress(activity) {
  if (!activity.maxParticipants) return 0
  return Math.round(((activity.currentParticipants || 0) / activity.maxParticipants) * 100)
}

function getProgressColor(activity) {
  const percent = getProgress(activity)
  if (percent >= 100) return '#f56c6c'
  if (percent >= 80) return '#e6a23c'
  return '#67c23a'
}

function formatItinerary(itinerary) {
  try {
    const arr = JSON.parse(itinerary)
    return arr.map((item, i) => `${i + 1}. [${item.time}] ${item.title}\n   ${item.content}`).join('\n\n')
  } catch {
    return itinerary
  }
}

/** 加载活动详情 */
function loadActivity() {
  getActivity(activityId).then(response => {
    activity.value = response.data || {}
  })
}

/** 加载报名列表 */
function loadRegistrations() {
  regLoading.value = true
  listActivityRegistrations(activityId, { pageNum: 1, pageSize: 100 }).then(response => {
    registrations.value = response.rows || []
    regLoading.value = false
  })
}

/** 编辑 */
function handleEdit() {
  router.push('/outdoor/activity/edit/' + activityId)
}

/** 管理报名 */
function handleManageRegistrations() {
  router.push({ path: '/outdoor/registration', query: { activityId, activityTitle: activity.value.activityTitle } })
}

/** 发布 */
function handlePublish() {
  proxy.$modal.confirm('确认要发布此活动吗?').then(() => {
    changeActivityStatus(activityId, 'recruiting').then(() => {
      proxy.$modal.msgSuccess('发布成功')
      loadActivity()
    })
  })
}

/** 下架 */
function handleUnpublish() {
  proxy.$modal.confirm('确认要下架此活动吗?').then(() => {
    changeActivityStatus(activityId, 'ended').then(() => {
      proxy.$modal.msgSuccess('下架成功')
      loadActivity()
    })
  })
}

/** 删除 */
function handleDelete() {
  proxy.$modal.confirm('确认要删除此活动吗?此操作不可恢复!').then(() => {
    delActivity(activityId).then(() => {
      proxy.$modal.msgSuccess('删除成功')
      goBack()
    })
  })
}

/** 导出报名 */
function handleExportRegistrations() {
  proxy.$modal.msgInfo('功能开发中')
}

/** 返回 */
function goBack() {
  router.push('/outdoor/activity')
}

loadActivity()
loadRegistrations()
</script>

<style scoped>
.mt20 { margin-top: 20px; }
.mb20 { margin-bottom: 20px; }
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.cover-image {
  border-radius: 8px;
  overflow: hidden;
}
.description-content, .itinerary-content, .fee-content, .safety-content {
  padding: 10px 0;
  color: #606266;
  line-height: 1.8;
}
.itinerary-content pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: inherit;
  margin: 0;
}
.text-muted { color: #909399; }
.text-primary { color: #409eff; font-weight: 600; }
.stat-item {
  text-align: center;
  padding: 15px 0;
  background: #f5f7fa;
  border-radius: 8px;
}
.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
}
.stat-label {
  font-size: 12px;
  color: #909399;
  margin-top: 5px;
}
</style>
