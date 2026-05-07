<template>
  <div class="app-container">
    <!-- 搜索表单 -->
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="80px">
      <el-form-item label="活动名称" prop="activityTitle">
        <el-input v-model="queryParams.activityTitle" placeholder="请输入活动名称" clearable style="width: 200px" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="报名人" prop="realName">
        <el-input v-model="queryParams.realName" placeholder="请输入报名人姓名" clearable style="width: 150px" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="queryParams.phone" placeholder="请输入手机号" clearable style="width: 150px" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="报名状态" prop="registrationStatus">
        <el-select v-model="queryParams.registrationStatus" placeholder="请选择状态" clearable style="width: 130px">
          <el-option label="待审核" value="pending" />
          <el-option label="已通过" value="approved" />
          <el-option label="已拒绝" value="rejected" />
          <el-option label="已取消" value="cancelled" />
        </el-select>
      </el-form-item>
      <el-form-item label="支付状态" prop="payStatus">
        <el-select v-model="queryParams.payStatus" placeholder="请选择支付状态" clearable style="width: 130px">
          <el-option label="待支付" value="pending" />
          <el-option label="已支付" value="paid" />
          <el-option label="已退款" value="refunded" />
        </el-select>
      </el-form-item>
      <el-form-item label="报名时间">
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
        <el-button type="success" plain icon="Check" :disabled="multiple" @click="handleBatchAudit">批量审核</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Refresh" :disabled="multiple" @click="handleBatchCancel">批量取消</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleBatchDelete">批量删除</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" />
    </el-row>

    <!-- 表格 -->
    <el-table v-loading="loading" :data="registrationList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column label="报名ID" align="center" prop="registrationId" width="80" />
      <el-table-column label="活动信息" align="left" min-width="180">
        <template #default="scope">
          <div class="activity-info">
            <div class="activity-title">{{ scope.row.activityTitle }}</div>
            <div class="activity-time text-muted">{{ parseTime(scope.row.startTime, '{m}-{d} {h}:{i}') }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="报名人" align="center" width="100">
        <template #default="scope">
          <div>{{ scope.row.realName }}</div>
          <div class="text-small text-muted">{{ scope.row.phone }}</div>
        </template>
      </el-table-column>
      <el-table-column label="性别" align="center" prop="gender" width="60">
        <template #default="scope">
          {{ scope.row.gender === 'male' ? '男' : scope.row.gender === 'female' ? '女' : '-' }}
        </template>
      </el-table-column>
      <el-table-column label="紧急联系人" align="center" prop="emergencyContact" width="100" />
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
      <el-table-column label="操作" align="center" width="180" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="View" @click="handleView(scope.row)">查看</el-button>
          <el-button v-if="scope.row.registrationStatus === 'pending'" link type="success" icon="Check" @click="handleAudit(scope.row, 'approved')">通过</el-button>
          <el-button v-if="scope.row.registrationStatus === 'pending'" link type="danger" icon="Close" @click="handleAudit(scope.row, 'rejected')">拒绝</el-button>
          <el-button v-if="scope.row.registrationStatus === 'approved'" link type="warning" icon="Refresh" @click="handleCancel(scope.row)">取消</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />

    <!-- 查看对话框 -->
    <el-dialog title="报名详情" v-model="viewOpen" width="600px" append-to-body>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="活动名称" :span="2">{{ viewData.activityTitle }}</el-descriptions-item>
        <el-descriptions-item label="活动类型">{{ getActivityTypeName(viewData.activityType) }}</el-descriptions-item>
        <el-descriptions-item label="活动状态">
          <el-tag :type="getStatusType(viewData.status)" size="small">{{ getStatusName(viewData.status) }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="姓名">{{ viewData.realName }}</el-descriptions-item>
        <el-descriptions-item label="手机号">{{ viewData.phone }}</el-descriptions-item>
        <el-descriptions-item label="性别">{{ viewData.gender === 'male' ? '男' : viewData.gender === 'female' ? '女' : '-' }}</el-descriptions-item>
        <el-descriptions-item label="身份证号">{{ viewData.idCard || '-' }}</el-descriptions-item>
        <el-descriptions-item label="紧急联系人">{{ viewData.emergencyContact || '-' }}</el-descriptions-item>
        <el-descriptions-item label="紧急电话">{{ viewData.emergencyPhone || '-' }}</el-descriptions-item>
        <el-descriptions-item label="报名状态">
          <el-tag :type="getRegStatusType(viewData.registrationStatus)">{{ getRegStatusName(viewData.registrationStatus) }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="支付状态">
          <el-tag :type="getPayStatusType(viewData.payStatus)">{{ getPayStatusName(viewData.payStatus) }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="活动费用">¥{{ viewData.activityPrice || 0 }}</el-descriptions-item>
        <el-descriptions-item label="保险费用">¥{{ viewData.insurancePrice || 0 }}</el-descriptions-item>
        <el-descriptions-item label="实付金额">
          <span class="text-price text-bold">¥{{ viewData.payAmount || 0 }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="报名时间" :span="2">{{ parseTime(viewData.createTime) }}</el-descriptions-item>
        <el-descriptions-item label="备注" :span="2">{{ viewData.remark || '-' }}</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="viewOpen = false">关 闭</el-button>
      </template>
    </el-dialog>

    <!-- 审核对话框 -->
    <el-dialog title="审核报名" v-model="auditOpen" width="500px" append-to-body>
      <el-form ref="auditRef" :model="auditForm" label-width="80px">
        <el-form-item label="审核结果">
          <el-radio-group v-model="auditForm.auditStatus">
            <el-radio label="approved">通过</el-radio>
            <el-radio label="rejected">拒绝</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审核备注">
          <el-input v-model="auditForm.auditRemark" type="textarea" :rows="3" placeholder="请输入审核备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="submitAudit">确 定</el-button>
        <el-button @click="auditOpen = false">取 消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="RegistrationManage">
import { listRegistration, auditRegistration, cancelRegistration, delRegistration } from '@/api/outdoor/registration'
import { parseTime } from '@/utils/ruoyi'
import { useRoute } from 'vue-router'

const route = useRoute()
const { proxy } = getCurrentInstance()

const loading = ref(true)
const showSearch = ref(true)
const registrationList = ref([])
const total = ref(0)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const dateRange = ref([])

const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  activityId: route.query.activityId,
  activityTitle: route.query.activityTitle,
  realName: undefined,
  phone: undefined,
  registrationStatus: undefined,
  payStatus: undefined
})

const viewOpen = ref(false)
const viewData = ref({})
const auditOpen = ref(false)
const auditForm = ref({
  registrationId: undefined,
  auditStatus: 'approved',
  auditRemark: ''
})

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

function getRegStatusName(status) { return regStatusMap[status]?.name || status }
function getRegStatusType(status) { return regStatusMap[status]?.type || '' }
function getPayStatusName(status) { return payStatusMap[status]?.name || status }
function getPayStatusType(status) { return payStatusMap[status]?.type || '' }
function getActivityTypeName(type) { return activityTypeMap[type] || type }
function getStatusName(status) { return statusMap[status]?.name || status }
function getStatusType(status) { return statusMap[status]?.type || '' }

/** 查询列表 */
function getList() {
  loading.value = true
  const params = { ...queryParams }
  if (dateRange.value && dateRange.value.length === 2) {
    params.startDate = dateRange.value[0]
    params.endDate = dateRange.value[1]
  }
  listRegistration(params).then(response => {
    registrationList.value = response.rows
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
  ids.value = selection.map(item => item.registrationId)
  single.value = selection.length !== 1
  multiple.value = !selection.length
}

/** 查看 */
function handleView(row) {
  viewData.value = row
  viewOpen.value = true
}

/** 审核 */
function handleAudit(row, status) {
  auditForm.value = {
    registrationId: row.registrationId,
    auditStatus: status,
    auditRemark: ''
  }
  auditOpen.value = true
}

/** 提交审核 */
function submitAudit() {
  auditRegistration(auditForm.value.registrationId, auditForm.value.auditStatus, auditForm.value.auditRemark)
    .then(() => {
      proxy.$modal.msgSuccess('审核成功')
      auditOpen.value = false
      getList()
    })
}

/** 取消 */
function handleCancel(row) {
  proxy.$modal.prompt('取消原因', '请输入取消原因', {
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  }).then(({ value }) => {
    cancelRegistration(row.registrationId, value).then(() => {
      proxy.$modal.msgSuccess('取消成功')
      getList()
    })
  })
}

/** 批量审核 */
function handleBatchAudit() {
  proxy.$modal.confirm('确认要审核通过选中的报名吗?').then(() => {
    ids.value.forEach(id => {
      auditRegistration(id, 'approved', '批量审核通过').then(() => {
        proxy.$modal.msgSuccess('批量审核成功')
        getList()
      })
    })
  })
}

/** 批量取消 */
function handleBatchCancel() {
  proxy.$modal.confirm('确认要取消选中的报名吗?').then(() => {
    ids.value.forEach(id => {
      cancelRegistration(id, '管理员批量取消').then(() => {
        proxy.$modal.msgSuccess('批量取消成功')
        getList()
      })
    })
  })
}

/** 批量删除 */
function handleBatchDelete() {
  proxy.$modal.confirm('确认要删除选中的报名记录吗?').then(() => {
    delRegistration(ids.value.join(',')).then(() => {
      proxy.$modal.msgSuccess('删除成功')
      getList()
    })
  })
}

getList()
</script>

<style scoped>
.mb8 { margin-bottom: 8px; }
.text-muted { color: #909399; font-size: 12px; }
.text-small { font-size: 12px; }
.text-price { color: #f56c6c; font-weight: 600; }
.text-bold { font-weight: 700; }
.activity-info { text-align: left; }
.activity-title { font-weight: 500; }
.activity-time { font-size: 12px; margin-top: 2px; }
</style>
