<template>
  <div class="app-container">
    <!-- 统计卡片 -->
    <el-row :gutter="20" class="mb20">
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-item">
            <div class="stat-value text-primary">{{ stats.totalCount }}</div>
            <div class="stat-label">总订单数</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-item">
            <div class="stat-value text-success">{{ stats.paidCount }}</div>
            <div class="stat-label">已支付</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-item">
            <div class="stat-value text-warning">{{ stats.pendingCount }}</div>
            <div class="stat-label">待支付</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-item">
            <div class="stat-value text-price">¥{{ stats.totalRevenue }}</div>
            <div class="stat-label">总收入</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 搜索表单 -->
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="80px">
      <el-form-item label="订单号" prop="orderNo">
        <el-input v-model="queryParams.orderNo" placeholder="请输入订单号" clearable style="width: 200px" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="用户" prop="userName">
        <el-input v-model="queryParams.userName" placeholder="请输入用户昵称" clearable style="width: 150px" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="支付状态" prop="payStatus">
        <el-select v-model="queryParams.payStatus" placeholder="请选择支付状态" clearable style="width: 130px">
          <el-option label="待支付" value="pending" />
          <el-option label="已支付" value="paid" />
          <el-option label="已退款" value="refunded" />
        </el-select>
      </el-form-item>
      <el-form-item label="订单类型" prop="orderType">
        <el-select v-model="queryParams.orderType" placeholder="请选择订单类型" clearable style="width: 130px">
          <el-option label="活动订单" value="activity" />
          <el-option label="保险订单" value="insurance" />
        </el-select>
      </el-form-item>
      <el-form-item label="下单时间">
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
        <el-button type="warning" plain icon="Download" @click="handleExport">导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" />
    </el-row>

    <!-- 表格 -->
    <el-table v-loading="loading" :data="orderList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column label="订单号" align="center" prop="orderNo" width="200" :show-overflow-tooltip="true" />
      <el-table-column label="订单类型" align="center" prop="orderType" width="100">
        <template #default="scope">
          <el-tag size="small" :type="scope.row.orderType === 'activity' ? '' : 'success'">
            {{ scope.row.orderType === 'activity' ? '活动' : '保险' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="关联活动" align="left" min-width="180" :show-overflow-tooltip="true">
        <template #default="scope">
          {{ scope.row.activityTitle || '-' }}
        </template>
      </el-table-column>
      <el-table-column label="用户" align="center" width="120">
        <template #default="scope">
          <div>{{ scope.row.nickName || scope.row.userName }}</div>
          <div class="text-small text-muted">{{ scope.row.phone }}</div>
        </template>
      </el-table-column>
      <el-table-column label="订单金额" align="center" prop="totalAmount" width="100">
        <template #default="scope">
          <span class="text-price">¥{{ scope.row.totalAmount || 0 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="优惠金额" align="center" prop="discountAmount" width="100">
        <template #default="scope">
          <span class="text-discount">-¥{{ scope.row.discountAmount || 0 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="实付金额" align="center" prop="payAmount" width="100">
        <template #default="scope">
          <span class="text-price text-bold">¥{{ scope.row.payAmount || 0 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="支付状态" align="center" prop="payStatus" width="100">
        <template #default="scope">
          <el-tag :type="getPayStatusType(scope.row.payStatus)" size="small">
            {{ getPayStatusName(scope.row.payStatus) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="下单时间" align="center" prop="createTime" width="160">
        <template #default="scope">
          {{ parseTime(scope.row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column label="支付时间" align="center" prop="payTime" width="160">
        <template #default="scope">
          {{ scope.row.payTime ? parseTime(scope.row.payTime) : '-' }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="View" @click="handleView(scope.row)">查看</el-button>
          <el-button v-if="scope.row.payStatus === 'paid'" link type="danger" icon="Refresh" @click="handleRefund(scope.row)">退款</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />

    <!-- 订单详情 -->
    <el-dialog title="订单详情" v-model="viewOpen" width="700px" append-to-body>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="订单号" :span="2">{{ viewData.orderNo }}</el-descriptions-item>
        <el-descriptions-item label="订单类型">
          <el-tag size="small">{{ viewData.orderType === 'activity' ? '活动订单' : '保险订单' }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="支付状态">
          <el-tag :type="getPayStatusType(viewData.payStatus)">{{ getPayStatusName(viewData.payStatus) }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="关联活动" :span="2">{{ viewData.activityTitle || '-' }}</el-descriptions-item>
        <el-descriptions-item label="报名人">{{ viewData.realName }}</el-descriptions-item>
        <el-descriptions-item label="联系电话">{{ viewData.phone || '-' }}</el-descriptions-item>
        <el-descriptions-item label="订单金额">¥{{ viewData.totalAmount }}</el-descriptions-item>
        <el-descriptions-item label="优惠金额">-¥{{ viewData.discountAmount || 0 }}</el-descriptions-item>
        <el-descriptions-item label="实付金额">
          <span class="text-price text-bold">¥{{ viewData.payAmount }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="下单时间">{{ parseTime(viewData.createTime) }}</el-descriptions-item>
        <el-descriptions-item label="支付时间">{{ viewData.payTime ? parseTime(viewData.payTime) : '-' }}</el-descriptions-item>
        <el-descriptions-item label="微信交易号" :span="2">{{ viewData.transactionId || '-' }}</el-descriptions-item>
        <el-descriptions-item label="备注" :span="2">{{ viewData.remark || '-' }}</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="viewOpen = false">关 闭</el-button>
      </template>
    </el-dialog>

    <!-- 退款对话框 -->
    <el-dialog title="退款确认" v-model="refundOpen" width="500px" append-to-body>
      <el-alert title="退款说明" type="warning" :closable="false" class="mb20">
        <template #default>
          退款金额: <span class="text-price">¥{{ refundForm.payAmount }}</span><br/>
          退款将原路返回到用户支付账户，预计1-7个工作日到账。
        </template>
      </el-alert>
      <el-form ref="refundRef" :model="refundForm" label-width="80px">
        <el-form-item label="退款原因" prop="refundReason">
          <el-input v-model="refundForm.refundReason" type="textarea" :rows="3" placeholder="请输入退款原因" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="submitRefund">确认退款</el-button>
        <el-button @click="refundOpen = false">取 消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="OrderManage">
import { listOrder, getOrder, refundOrder } from '@/api/outdoor/order'
import { parseTime } from '@/utils/ruoyi'

const { proxy } = getCurrentInstance()

const loading = ref(true)
const showSearch = ref(true)
const orderList = ref([])
const total = ref(0)
const dateRange = ref([])

const stats = reactive({
  totalCount: 0,
  paidCount: 0,
  pendingCount: 0,
  totalRevenue: 0
})

const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  orderNo: undefined,
  userName: undefined,
  payStatus: undefined,
  orderType: undefined
})

const viewOpen = ref(false)
const viewData = ref({})
const refundOpen = ref(false)
const refundRef = ref(null)
const refundForm = ref({
  orderId: undefined,
  payAmount: 0,
  refundReason: ''
})

const payStatusMap = {
  pending: { name: '待支付', type: 'warning' },
  paid: { name: '已支付', type: 'success' },
  refunded: { name: '已退款', type: 'info' }
}

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
  listOrder(params).then(response => {
    orderList.value = response.rows
    total.value = response.total
    // 计算统计数据
    stats.totalCount = response.total
    stats.paidCount = response.rows.filter(r => r.payStatus === 'paid').length
    stats.pendingCount = response.rows.filter(r => r.payStatus === 'pending').length
    stats.totalRevenue = response.rows
      .filter(r => r.payStatus === 'paid')
      .reduce((sum, r) => sum + (parseFloat(r.payAmount) || 0), 0)
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
function handleSelectionChange() {}

/** 查看 */
function handleView(row) {
  viewData.value = row
  viewOpen.value = true
}

/** 退款 */
function handleRefund(row) {
  refundForm.value = {
    orderId: row.orderId,
    payAmount: row.payAmount,
    refundReason: ''
  }
  refundOpen.value = true
}

/** 提交退款 */
function submitRefund() {
  refundOrder(refundForm.value.orderId, refundForm.value.refundReason).then(() => {
    proxy.$modal.msgSuccess('退款成功')
    refundOpen.value = false
    getList()
  })
}

/** 导出 */
function handleExport() {
  proxy.$modal.msgInfo('功能开发中')
}

getList()
</script>

<style scoped>
.mb20 { margin-bottom: 20px; }
.mb8 { margin-bottom: 8px; }
.text-muted { color: #909399; font-size: 12px; }
.text-small { font-size: 12px; }
.text-price { color: #f56c6c; }
.text-discount { color: #67c23a; }
.text-bold { font-weight: 700; }
.text-primary { color: #409eff; }
.text-success { color: #67c23a; }
.text-warning { color: #e6a23c; }
.stat-card {
  text-align: center;
}
.stat-item {
  padding: 10px 0;
}
.stat-value {
  font-size: 28px;
  font-weight: 600;
}
.stat-label {
  font-size: 14px;
  color: #909399;
  margin-top: 5px;
}
</style>
