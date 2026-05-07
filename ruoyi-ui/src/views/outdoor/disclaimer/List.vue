<template>
  <div class="app-container">
    <!-- 搜索表单 -->
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="80px">
      <el-form-item label="条款标题" prop="disclaimerTitle">
        <el-input v-model="queryParams.disclaimerTitle" placeholder="请输入条款标题" clearable style="width: 200px" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="条款类型" prop="disclaimerType">
        <el-select v-model="queryParams.disclaimerType" placeholder="请选择条款类型" clearable style="width: 150px">
          <el-option label="通用免责" value="general" />
          <el-option label="活动免责" value="activity" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable style="width: 130px">
          <el-option label="生效" value="active" />
          <el-option label="失效" value="inactive" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 操作按钮 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd">新增条款</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="info" plain icon="Document" @click="handleViewSignRecords">签署记录</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" />
    </el-row>

    <!-- 表格 -->
    <el-table v-loading="loading" :data="disclaimerList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column label="条款ID" align="center" prop="disclaimerId" width="80" />
      <el-table-column label="条款标题" align="left" min-width="200" :show-overflow-tooltip="true">
        <template #default="scope">
          <span class="link-type" @click="handleView(scope.row)">{{ scope.row.disclaimerTitle }}</span>
        </template>
      </el-table-column>
      <el-table-column label="条款类型" align="center" prop="disclaimerType" width="100">
        <template #default="scope">
          <el-tag size="small" :type="scope.row.disclaimerType === 'general' ? '' : 'success'">
            {{ scope.row.disclaimerType === 'general' ? '通用免责' : '活动免责' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="版本" align="center" prop="version" width="80" />
      <el-table-column label="关联活动数" align="center" prop="activityCount" width="100">
        <template #default="scope">
          <el-link type="primary">{{ scope.row.activityCount || 0 }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="签署次数" align="center" prop="signCount" width="100">
        <template #default="scope">
          <el-link type="success" @click="handleViewSignRecords(scope.row)">{{ scope.row.signCount || 0 }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status" width="80">
        <template #default="scope">
          <el-switch v-model="scope.row.status" active-value="active" inactive-value="inactive" @change="handleStatusChange(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column label="生效时间" align="center" prop="effectiveTime" width="160">
        <template #default="scope">
          {{ scope.row.effectiveTime ? parseTime(scope.row.effectiveTime) : '-' }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="160">
        <template #default="scope">
          {{ parseTime(scope.row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="180" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="View" @click="handleView(scope.row)">查看</el-button>
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button link type="danger" icon="Delete" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />

    <!-- 添加/修改 -->
    <el-dialog :title="formTitle" v-model="formOpen" width="800px" append-to-body>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="条款标题" prop="disclaimerTitle">
              <el-input v-model="form.disclaimerTitle" placeholder="请输入条款标题" maxlength="200" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="条款类型" prop="disclaimerType">
              <el-select v-model="form.disclaimerType" placeholder="请选择条款类型" style="width: 100%">
                <el-option label="通用免责" value="general" />
                <el-option label="活动免责" value="activity" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="版本号" prop="version">
              <el-input v-model="form.version" placeholder="如: 1.0" maxlength="20" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="form.status">
                <el-radio label="active">生效</el-radio>
                <el-radio label="inactive">失效</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="免责内容" prop="content">
          <el-input v-model="form.content" type="textarea" :rows="12" placeholder="请输入免责条款内容" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" :rows="2" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="formOpen = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </template>
    </el-dialog>

    <!-- 查看详情 -->
    <el-dialog title="免责条款详情" v-model="viewOpen" width="800px" append-to-body>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="条款标题" :span="2">{{ viewData.disclaimerTitle }}</el-descriptions-item>
        <el-descriptions-item label="条款类型">
          <el-tag size="small">{{ viewData.disclaimerType === 'general' ? '通用免责' : '活动免责' }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="版本">{{ viewData.version }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="viewData.status === 'active' ? 'success' : 'info'" size="small">
            {{ viewData.status === 'active' ? '生效' : '失效' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="生效时间">{{ viewData.effectiveTime ? parseTime(viewData.effectiveTime) : '-' }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ parseTime(viewData.createTime) }}</el-descriptions-item>
        <el-descriptions-item label="免责内容" :span="2">
          <div class="content-box">{{ viewData.content }}</div>
        </el-descriptions-item>
        <el-descriptions-item label="备注" :span="2">{{ viewData.remark || '-' }}</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="viewOpen = false">关 闭</el-button>
        <el-button type="primary" @click="handleEditFromView">编 辑</el-button>
      </template>
    </el-dialog>

    <!-- 签署记录 -->
    <el-dialog title="免责签署记录" v-model="recordOpen" width="1000px" append-to-body>
      <el-form :model="recordParams" ref="recordQueryRef" :inline="true" label-width="80px">
        <el-form-item label="用户" prop="userName">
          <el-input v-model="recordParams.userName" placeholder="用户昵称" clearable style="width: 150px" />
        </el-form-item>
        <el-form-item label="签署状态" prop="signStatus">
          <el-select v-model="recordParams.signStatus" placeholder="请选择" clearable style="width: 130px">
            <el-option label="已签署" value="signed" />
            <el-option label="已撤回" value="withdrawn" />
          </el-select>
        </el-form-item>
        <el-form-item label="签署时间">
          <el-date-picker v-model="recordDateRange" value-format="YYYY-MM-DD" type="daterange" range-separator="-" start-placeholder="开始" end-placeholder="结束" style="width: 260px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="loadSignRecords">搜索</el-button>
          <el-button icon="Refresh" @click="resetRecordQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="signRecordList" v-loading="recordLoading" :max-height="400">
        <el-table-column label="签署人" align="center" prop="signName" width="100" />
        <el-table-column label="用户" align="center" width="120">
          <template #default="scope">
            <div>{{ scope.row.nickName || '-' }}</div>
            <div class="text-small text-muted">{{ scope.row.phone || '' }}</div>
          </template>
        </el-table-column>
        <el-table-column label="关联活动" align="left" min-width="150" :show-overflow-tooltip="true">
          <template #default="scope">
            {{ scope.row.activityTitle || '通用签署' }}
          </template>
        </el-table-column>
        <el-table-column label="免责条款" align="left" min-width="150" :show-overflow-tooltip="true">
          <template #default="scope">
            {{ scope.row.disclaimerTitle }}
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" prop="signStatus" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.signStatus === 'signed' ? 'success' : 'info'" size="small">
              {{ scope.row.signStatus === 'signed' ? '已签署' : '已撤回' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="签署时间" align="center" prop="signTime" width="160">
          <template #default="scope">
            {{ parseTime(scope.row.signTime) }}
          </template>
        </el-table-column>
        <el-table-column label="IP地址" align="center" prop="signIp" width="130" :show-overflow-tooltip="true" />
      </el-table>
      <pagination v-show="recordTotal > 0" :total="recordTotal" v-model:page="recordParams.pageNum" v-model:limit="recordParams.pageSize" @pagination="loadSignRecords" />
    </el-dialog>
  </div>
</template>

<script setup name="DisclaimerManage">
import { listDisclaimer, getDisclaimer, addDisclaimer, updateDisclaimer, delDisclaimer, changeDisclaimerStatus, listSignRecord } from '@/api/outdoor/disclaimer'
import { parseTime } from '@/utils/ruoyi'

const { proxy } = getCurrentInstance()

const loading = ref(true)
const showSearch = ref(true)
const disclaimerList = ref([])
const total = ref(0)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)

const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  disclaimerTitle: undefined,
  disclaimerType: undefined,
  status: undefined
})

const formTitle = ref('')
const formOpen = ref(false)
const formRef = ref(null)
const form = ref({
  disclaimerId: undefined,
  clubId: 1,
  disclaimerTitle: '',
  disclaimerType: 'general',
  content: '',
  version: '1.0',
  status: 'active',
  effectiveTime: undefined,
  remark: ''
})

const rules = {
  disclaimerTitle: [{ required: true, message: '条款标题不能为空', trigger: 'blur' }],
  disclaimerType: [{ required: true, message: '请选择条款类型', trigger: 'change' }],
  content: [{ required: true, message: '免责内容不能为空', trigger: 'blur' }]
}

const viewOpen = ref(false)
const viewData = ref({})

const recordOpen = ref(false)
const recordLoading = ref(false)
const signRecordList = ref([])
const recordTotal = ref(0)
const recordParams = reactive({
  pageNum: 1,
  pageSize: 10,
  userName: undefined,
  signStatus: undefined
})
const recordDateRange = ref([])
const recordDisclaimerId = ref(null)

/** 查询列表 */
function getList() {
  loading.value = true
  listDisclaimer(queryParams).then(response => {
    disclaimerList.value = response.rows
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
  proxy.resetForm(queryRef.value)
  queryParams.pageNum = 1
  getList()
}

/** 多选 */
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.disclaimerId)
  single.value = selection.length !== 1
  multiple.value = !selection.length
}

/** 新增 */
function handleAdd() {
  form.value = {
    disclaimerId: undefined,
    clubId: 1,
    disclaimerTitle: '',
    disclaimerType: 'general',
    content: '',
    version: '1.0',
    status: 'active',
    effectiveTime: undefined,
    remark: ''
  }
  formTitle.value = '添加免责条款'
  formOpen.value = true
}

/** 修改 */
function handleUpdate(row) {
  const id = row.disclaimerId || ids.value[0]
  getDisclaimer(id).then(response => {
    form.value = response.data
    formTitle.value = '修改免责条款'
    formOpen.value = true
  })
}

/** 查看 */
function handleView(row) {
  viewData.value = row
  viewOpen.value = true
}

/** 从查看页编辑 */
function handleEditFromView() {
  viewOpen.value = false
  handleUpdate(viewData.value)
}

/** 提交 */
function submitForm() {
  proxy.$refs.formRef.validate(valid => {
    if (valid) {
      if (form.value.disclaimerId) {
        updateDisclaimer(form.value).then(() => {
          proxy.$modal.msgSuccess('修改成功')
          formOpen.value = false
          getList()
        })
      } else {
        addDisclaimer(form.value).then(() => {
          proxy.$modal.msgSuccess('新增成功')
          formOpen.value = false
          getList()
        })
      }
    }
  })
}

/** 删除 */
function handleDelete(row) {
  const deleteIds = row.disclaimerId || ids.value
  proxy.$modal.confirm('是否确认删除所选免责条款?')
    .then(() => delDisclaimer(deleteIds))
    .then(() => {
      getList()
      proxy.$modal.msgSuccess('删除成功')
    })
}

/** 状态修改 */
function handleStatusChange(row) {
  const text = row.status === 'active' ? '启用' : '停用'
  proxy.$modal.confirm('确认要"' + text + '"条款"' + row.disclaimerTitle + '"吗?')
    .then(() => changeDisclaimerStatus(row.disclaimerId, row.status))
    .then(() => {
      proxy.$modal.msgSuccess(text + '成功')
    })
    .catch(() => {
      row.status = row.status === 'active' ? 'inactive' : 'active'
    })
}

/** 签署记录 */
function handleViewSignRecords(row) {
  recordDisclaimerId.value = row?.disclaimerId || null
  recordParams.pageNum = 1
  recordDateRange.value = []
  resetRecordQuery()
  recordOpen.value = true
  loadSignRecords()
}

/** 加载签署记录 */
function loadSignRecords() {
  recordLoading.value = true
  const params = { ...recordParams }
  if (recordDisclaimerId.value) {
    params.disclaimerId = recordDisclaimerId.value
  }
  if (recordDateRange.value && recordDateRange.value.length === 2) {
    params.startDate = recordDateRange.value[0]
    params.endDate = recordDateRange.value[1]
  }
  listSignRecord(params).then(response => {
    signRecordList.value = response.rows
    recordTotal.value = response.total
    recordLoading.value = false
  })
}

/** 重置记录查询 */
function resetRecordQuery() {
  recordParams.userName = undefined
  recordParams.signStatus = undefined
  recordDateRange.value = []
  loadSignRecords()
}

getList()
</script>

<style scoped>
.mb8 { margin-bottom: 8px; }
.text-small { font-size: 12px; }
.text-muted { color: #909399; }
.content-box {
  padding: 15px;
  background: #f5f7fa;
  border-radius: 4px;
  white-space: pre-wrap;
  line-height: 1.8;
  max-height: 300px;
  overflow-y: auto;
}
.link-type {
  color: #409eff;
  cursor: pointer;
}
.link-type:hover {
  text-decoration: underline;
}
</style>
