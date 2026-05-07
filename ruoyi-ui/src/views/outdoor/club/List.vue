<template>
  <div class="app-container">
    <!-- 搜索表单 -->
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="俱乐部名称" prop="clubName">
        <el-input v-model="queryParams.clubName" placeholder="请输入俱乐部名称" clearable style="width: 200px" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="俱乐部编码" prop="clubCode">
        <el-input v-model="queryParams.clubCode" placeholder="请输入俱乐部编码" clearable style="width: 150px" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="俱乐部状态" clearable style="width: 150px">
          <el-option label="正常" value="0" />
          <el-option label="停用" value="1" />
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
        <el-button type="primary" plain icon="Plus" @click="handleAdd">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete">删除</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" />
    </el-row>

    <!-- 表格 -->
    <el-table v-loading="loading" :data="clubList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column label="俱乐部ID" align="center" prop="clubId" width="100" />
      <el-table-column label="俱乐部名称" align="center" prop="clubName" :show-overflow-tooltip="true" min-width="150" />
      <el-table-column label="俱乐部编码" align="center" prop="clubCode" width="120" />
      <el-table-column label="联系人" align="center" prop="contactName" width="100" />
      <el-table-column label="联系电话" align="center" prop="contactPhone" width="130" />
      <el-table-column label="套餐类型" align="center" prop="packageType" width="100">
        <template #default="scope">
          <el-tag v-if="scope.row.packageType === 'basic'">基础版</el-tag>
          <el-tag v-else-if="scope.row.packageType === 'standard'" type="success">标准版</el-tag>
          <el-tag v-else-if="scope.row.packageType === 'professional'" type="warning">专业版</el-tag>
          <el-tag v-else type="info">{{ scope.row.packageType }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="到期时间" align="center" prop="expireTime" width="180">
        <template #default="scope">
          <span :class="{ 'text-danger': isExpire(scope.row.expireTime) }">
            {{ parseTime(scope.row.expireTime) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status" width="100">
        <template #default="scope">
          <el-switch v-model="scope.row.status" active-value="0" inactive-value="1" @change="handleStatusChange(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="View" @click="handleView(scope.row)">查看</el-button>
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button link type="primary" icon="Setting" @click="handleConfig(scope.row)">配置</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改对话框 -->
    <el-dialog :title="title" v-model="open" width="600px" append-to-body>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="俱乐部名称" prop="clubName">
          <el-input v-model="form.clubName" placeholder="请输入俱乐部名称" maxlength="100" />
        </el-form-item>
        <el-form-item label="俱乐部编码" prop="clubCode">
          <el-input v-model="form.clubCode" placeholder="请输入俱乐部编码(唯一)" maxlength="50" :disabled="form.clubId !== undefined" />
        </el-form-item>
        <el-form-item label="俱乐部Logo" prop="logo">
          <el-input v-model="form.logo" placeholder="请输入Logo URL" maxlength="500" />
        </el-form-item>
        <el-form-item label="俱乐部标语" prop="slogan">
          <el-input v-model="form.slogan" placeholder="请输入俱乐部标语" maxlength="200" />
        </el-form-item>
        <el-form-item label="联系电话" prop="contactPhone">
          <el-input v-model="form.contactPhone" placeholder="请输入联系电话" maxlength="20" />
        </el-form-item>
        <el-form-item label="联系邮箱" prop="contactEmail">
          <el-input v-model="form.contactEmail" placeholder="请输入联系邮箱" maxlength="100" />
        </el-form-item>
        <el-form-item label="套餐类型" prop="packageType">
          <el-select v-model="form.packageType" placeholder="请选择套餐类型" style="width: 100%">
            <el-option label="基础版" value="basic" />
            <el-option label="标准版" value="standard" />
            <el-option label="专业版" value="professional" />
          </el-select>
        </el-form-item>
        <el-form-item label="到期时间" prop="expireTime">
          <el-date-picker v-model="form.expireTime" type="datetime" placeholder="请选择到期时间" value-format="YYYY-MM-DD HH:mm:ss" style="width: 100%" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio label="0">正常</el-radio>
            <el-radio label="1">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入备注" maxlength="500" show-word-limit />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="open = false">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 查看对话框 -->
    <el-dialog title="俱乐部详情" v-model="viewOpen" width="600px" append-to-body>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="俱乐部名称">{{ viewData.clubName }}</el-descriptions-item>
        <el-descriptions-item label="俱乐部编码">{{ viewData.clubCode }}</el-descriptions-item>
        <el-descriptions-item label="联系人">{{ viewData.contactName }}</el-descriptions-item>
        <el-descriptions-item label="联系电话">{{ viewData.contactPhone }}</el-descriptions-item>
        <el-descriptions-item label="联系邮箱">{{ viewData.contactEmail }}</el-descriptions-item>
        <el-descriptions-item label="套餐类型">
          <el-tag v-if="viewData.packageType === 'basic'">基础版</el-tag>
          <el-tag v-else-if="viewData.packageType === 'standard'" type="success">标准版</el-tag>
          <el-tag v-else-if="viewData.packageType === 'professional'" type="warning">专业版</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="到期时间">{{ parseTime(viewData.expireTime) }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="viewData.status === '0' ? 'success' : 'danger'">
            {{ viewData.status === '0' ? '正常' : '停用' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ parseTime(viewData.createTime) }}</el-descriptions-item>
        <el-descriptions-item label="更新时间">{{ parseTime(viewData.updateTime) }}</el-descriptions-item>
        <el-descriptions-item label="备注" :span="2">{{ viewData.remark }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup name="ClubManage">
import { listClub, addClub, updateClub, delClub, changeClubStatus } from '@/api/outdoor/club'
import { parseTime } from '@/utils/ruoyi'
import { useRouter } from 'vue-router'

const router = useRouter()
const { proxy } = getCurrentInstance()

const loading = ref(true)
const showSearch = ref(true)
const clubList = ref([])
const total = ref(0)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const title = ref('')
const open = ref(false)
const viewOpen = ref(false)
const viewData = ref({})
const formRef = ref(null)
const queryRef = ref(null)

const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  clubName: undefined,
  clubCode: undefined,
  status: undefined
})

const form = reactive({
  clubId: undefined,
  clubName: '',
  clubCode: '',
  logo: '',
  slogan: '',
  contactName: '',
  contactPhone: '',
  contactEmail: '',
  packageType: 'basic',
  expireTime: undefined,
  status: '0',
  remark: ''
})

const rules = {
  clubName: [{ required: true, message: '俱乐部名称不能为空', trigger: 'blur' }],
  clubCode: [{ required: true, message: '俱乐部编码不能为空', trigger: 'blur' }],
  contactPhone: [{ pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }]
}

/** 判断是否过期 */
function isExpire(expireTime) {
  if (!expireTime) return false
  return new Date(expireTime) < new Date()
}

/** 查询俱乐部列表 */
function getList() {
  loading.value = true
  listClub(queryParams).then(response => {
    clubList.value = response.rows
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
  proxy.resetForm(queryRef.value)
  queryParams.pageNum = 1
  getList()
}

/** 多选框选中 */
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.clubId)
  single.value = selection.length !== 1
  multiple.value = !selection.length
}

/** 新增按钮 */
function handleAdd() {
  resetForm()
  open.value = true
  title.value = '添加俱乐部'
}

/** 修改按钮 */
function handleUpdate(row) {
  resetForm()
  const clubId = row?.clubId || ids.value[0]
  listClub({ clubId }).then(response => {
    Object.assign(form, response.rows[0])
    open.value = true
    title.value = '修改俱乐部'
  })
}

/** 查看按钮 */
function handleView(row) {
  viewData.value = row
  viewOpen.value = true
}

/** 配置按钮 */
function handleConfig(row) {
  router.push('/outdoor/club/config/' + row.clubId)
}

/** 提交表单 */
function submitForm() {
  proxy.$refs.formRef.validate(valid => {
    if (valid) {
      if (form.clubId) {
        updateClub(form).then(() => {
          proxy.$modal.msgSuccess('修改成功')
          open.value = false
          getList()
        })
      } else {
        addClub(form).then(() => {
          proxy.$modal.msgSuccess('新增成功')
          open.value = false
          getList()
        })
      }
    }
  })
}

/** 重置表单 */
function resetForm() {
  Object.assign(form, {
    clubId: undefined,
    clubName: '',
    clubCode: '',
    logo: '',
    slogan: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    packageType: 'basic',
    expireTime: undefined,
    status: '0',
    remark: ''
  })
  proxy.resetForm('formRef')
}

/** 删除按钮 */
function handleDelete(row) {
  const clubIds = row?.clubId || ids.value
  proxy.$modal.confirm('是否确认删除俱乐部ID为"' + clubIds + '"的数据项?')
    .then(() => delClub(clubIds))
    .then(() => {
      getList()
      proxy.$modal.msgSuccess('删除成功')
    })
}

/** 状态修改 */
function handleStatusChange(row) {
  const text = row.status === '0' ? '启用' : '停用'
  proxy.$modal.confirm('确认要"' + text + '"俱乐部"' + row.clubName + '"吗?')
    .then(() => changeClubStatus(row.clubId, row.status))
    .then(() => {
      proxy.$modal.msgSuccess(text + '成功')
    })
    .catch(() => {
      row.status = row.status === '0' ? '1' : '0'
    })
}

getList()
</script>

<style scoped>
.text-danger {
  color: #f56c6c;
}
</style>
