<template>
  <div class="app-container">
    <!-- 搜索表单 -->
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="80px">
      <el-form-item label="用户昵称" prop="nickName">
        <el-input v-model="queryParams.nickName" placeholder="请输入用户昵称" clearable style="width: 150px" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="queryParams.phone" placeholder="请输入手机号" clearable style="width: 150px" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable style="width: 130px">
          <el-option label="正常" value="0" />
          <el-option label="禁用" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="注册时间">
        <el-date-picker v-model="dateRange" value-format="YYYY-MM-DD" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" style="width: 260px" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 操作按钮 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd">添加会员</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Download" @click="handleExport">导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" />
    </el-row>

    <!-- 表格 -->
    <el-table v-loading="loading" :data="memberList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column label="用户ID" align="center" prop="wxUserId" width="80" />
      <el-table-column label="用户头像" align="center" prop="avatarUrl" width="80">
        <template #default="scope">
          <el-avatar v-if="scope.row.avatarUrl" :src="scope.row.avatarUrl" :size="40" />
          <el-avatar v-else :size="40">{{ scope.row.nickName?.charAt(0) || '?' }}</el-avatar>
        </template>
      </el-table-column>
      <el-table-column label="用户信息" align="left" min-width="150">
        <template #default="scope">
          <div class="user-info">
            <div class="nick-name">{{ scope.row.nickName || '-' }}</div>
            <div class="phone text-muted">{{ scope.row.phone || '未绑定手机' }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="性别" align="center" prop="gender" width="70">
        <template #default="scope">
          <el-tag v-if="scope.row.gender === 'male'" size="small" type="primary">男</el-tag>
          <el-tag v-else-if="scope.row.gender === 'female'" size="small" type="danger">女</el-tag>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="报名次数" align="center" prop="registrationCount" width="100">
        <template #default="scope">
          <el-link type="primary" @click="handleViewHistory(scope.row)">{{ scope.row.registrationCount || 0 }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="累计消费" align="center" prop="totalAmount" width="100">
        <template #default="scope">
          <span class="text-price">¥{{ scope.row.totalAmount || 0 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="积分" align="center" prop="points" width="80">
        <template #default="scope">
          <span>{{ scope.row.points || 0 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status" width="80">
        <template #default="scope">
          <el-switch v-model="scope.row.status" active-value="0" inactive-value="1" @change="handleStatusChange(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column label="注册时间" align="center" prop="createTime" width="160">
        <template #default="scope">
          {{ parseTime(scope.row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column label="最后登录" align="center" prop="lastLoginTime" width="160">
        <template #default="scope">
          {{ scope.row.lastLoginTime ? parseTime(scope.row.lastLoginTime) : '-' }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="View" @click="handleView(scope.row)">详情</el-button>
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button link type="warning" icon="User" @click="handleViewHistory(scope.row)">记录</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />

    <!-- 用户详情 -->
    <el-dialog title="会员详情" v-model="viewOpen" width="700px" append-to-body>
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="user-avatar">
            <el-avatar v-if="viewData.avatarUrl" :src="viewData.avatarUrl" :size="100" />
            <el-avatar v-else :size="100">{{ viewData.nickName?.charAt(0) || '?' }}</el-avatar>
          </div>
        </el-col>
        <el-col :span="18">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="用户昵称">{{ viewData.nickName || '-' }}</el-descriptions-item>
            <el-descriptions-item label="手机号">{{ viewData.phone || '-' }}</el-descriptions-item>
            <el-descriptions-item label="性别">
              {{ viewData.gender === 'male' ? '男' : viewData.gender === 'female' ? '女' : '-' }}
            </el-descriptions-item>
            <el-descriptions-item label="状态">
              <el-tag :type="viewData.status === '0' ? 'success' : 'danger'" size="small">
                {{ viewData.status === '0' ? '正常' : '禁用' }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="报名次数">{{ viewData.registrationCount || 0 }} 次</el-descriptions-item>
            <el-descriptions-item label="累计消费">¥{{ viewData.totalAmount || 0 }}</el-descriptions-item>
            <el-descriptions-item label="积分">{{ viewData.points || 0 }}</el-descriptions-item>
            <el-descriptions-item label="注册时间">{{ parseTime(viewData.createTime) }}</el-descriptions-item>
          </el-descriptions>
        </el-col>
      </el-row>

      <el-divider content-position="left">统计信息</el-divider>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-statistic title="总报名数" :value="memberStats.totalRegistrations" />
        </el-col>
        <el-col :span="8">
          <el-statistic title="已参加活动" :value="memberStats.joinedActivities" />
        </el-col>
        <el-col :span="8">
          <el-statistic title="总消费金额" :value="memberStats.totalSpent" prefix="¥" />
        </el-col>
      </el-row>
    </el-dialog>

    <!-- 报名记录 -->
    <el-dialog title="报名记录" v-model="historyOpen" width="900px" append-to-body>
      <el-table :data="historyList" v-loading="historyLoading">
        <el-table-column label="活动名称" align="left" prop="activityTitle" min-width="150" :show-overflow-tooltip="true" />
        <el-table-column label="活动类型" align="center" prop="activityType" width="80">
          <template #default="scope">
            {{ getActivityTypeName(scope.row.activityType) }}
          </template>
        </el-table-column>
        <el-table-column label="报名状态" align="center" prop="registrationStatus" width="100">
          <template #default="scope">
            <el-tag :type="getRegStatusType(scope.row.registrationStatus)" size="small">
              {{ getRegStatusName(scope.row.registrationStatus) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="支付状态" align="center" prop="payStatus" width="100">
          <template #default="scope">
            <el-tag :type="getPayStatusType(scope.row.payStatus)" size="small">
              {{ getPayStatusName(scope.row.payStatus) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="实付金额" align="center" prop="payAmount" width="100">
          <template #default="scope">
            <span class="text-price">¥{{ scope.row.payAmount || 0 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="报名时间" align="center" prop="createTime" width="160">
          <template #default="scope">
            {{ parseTime(scope.row.createTime) }}
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="historyTotal > 0" :total="historyTotal" v-model:page="historyParams.pageNum" v-model:limit="historyParams.pageSize" @pagination="loadHistory" />
    </el-dialog>
  </div>
</template>

<script setup name="MemberManage">
import { listMember, getMember, getMemberStats, getMemberRegistrationHistory, changeMemberStatus } from '@/api/outdoor/member'
import { parseTime } from '@/utils/ruoyi'

const { proxy } = getCurrentInstance()

const loading = ref(true)
const showSearch = ref(true)
const memberList = ref([])
const total = ref(0)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const dateRange = ref([])

const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  nickName: undefined,
  phone: undefined,
  status: undefined
})

const viewOpen = ref(false)
const viewData = ref({})
const memberStats = ref({
  totalRegistrations: 0,
  joinedActivities: 0,
  totalSpent: 0
})

const historyOpen = ref(false)
const historyLoading = ref(false)
const historyList = ref([])
const historyTotal = ref(0)
const historyParams = reactive({
  pageNum: 1,
  pageSize: 10
})
const currentMemberId = ref(null)

const activityTypeMap = {
  hiking: '徒步', cycling: '骑行', camping: '露营',
  mountaineering: '登山', skiing: '滑雪', water: '水上', other: '其他'
}

const regStatusMap = {
  pending: { name: '待审核', type: 'warning' },
  approved: { name: '已通过', type: 'success' },
  rejected: { name: '已拒绝', type: 'danger' },
  cancelled: { name: '已取消', type: 'info' }
}

const payStatusMap = {
  pending: { name: '待支付', type: 'warning' },
  paid: { name: '已支付', type: 'success' },
  refunded: { name: '已退款', type: 'info' }
}

function getActivityTypeName(type) { return activityTypeMap[type] || type }
function getRegStatusName(status) { return regStatusMap[status]?.name || status }
function getRegStatusType(status) { return regStatusMap[status]?.type || '' }
function getPayStatusName(status) { return payStatusMap[status]?.name || status }
function getPayStatusType(status) { return payStatusMap[status]?.type || '' }

/** 查询列表 */
function getList() {
  loading.value = true
  const params = { ...queryParams }
  if (dateRange.value && dateRange.value.length === 2) {
    params.startDate = dateRange.value[0]
    params.endDate = dateRange.value[1]
  }
  listMember(params).then(response => {
    memberList.value = response.rows
    total.value = response.total
    loading.value = false
  })
}

/** 搜索 */
function handleQuery() {
  queryParams.pageNum = 1
  getList()
}

/** 重置 */
function resetQuery() {
  dateRange.value = []
  proxy.resetForm(queryRef.value)
  queryParams.pageNum = 1
  getList()
}

/** 多选 */
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.wxUserId)
  single.value = selection.length !== 1
  multiple.value = !selection.length
}

/** 查看 */
function handleView(row) {
  viewData.value = row
  // 加载统计数据
  getMemberStats(row.wxUserId).then(response => {
    memberStats.value = response.data || memberStats.value
  })
  viewOpen.value = true
}

/** 修改 */
function handleUpdate(row) {
  proxy.$modal.msgInfo('功能开发中')
}

/** 添加 */
function handleAdd() {
  proxy.$modal.msgInfo('功能开发中')
}

/** 查看历史 */
function handleViewHistory(row) {
  currentMemberId.value = row.wxUserId
  historyParams.pageNum = 1
  loadHistory()
  historyOpen.value = true
}

/** 加载历史记录 */
function loadHistory() {
  historyLoading.value = true
  getMemberRegistrationHistory(currentMemberId.value, historyParams).then(response => {
    historyList.value = response.rows
    historyTotal.value = response.total
    historyLoading.value = false
  })
}

/** 状态修改 */
function handleStatusChange(row) {
  const text = row.status === '0' ? '启用' : '禁用'
  proxy.$modal.confirm('确认要"' + text + '"用户"' + row.nickName + '"吗?')
    .then(() => changeMemberStatus(row.wxUserId, row.status))
    .then(() => {
      proxy.$modal.msgSuccess(text + '成功')
    })
    .catch(() => {
      row.status = row.status === '0' ? '1' : '0'
    })
}

/** 导出 */
function handleExport() {
  proxy.$modal.msgInfo('功能开发中')
}

getList()
</script>

<style scoped>
.mb8 { margin-bottom: 8px; }
.text-muted { color: #909399; font-size: 12px; }
.text-price { color: #f56c6c; font-weight: 600; }
.user-info { text-align: left; }
.nick-name { font-weight: 500; }
.phone { font-size: 12px; margin-top: 2px; }
.user-avatar {
  text-align: center;
  padding: 20px 0;
}
</style>
