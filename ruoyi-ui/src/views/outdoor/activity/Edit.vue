<template>
  <div class="app-container">
    <el-page-header @back="goBack" :content="isEdit ? '编辑活动' : '创建活动'" title="返回" />

    <el-form ref="formRef" :model="form" :rules="rules" label-width="120px" class="mt20">
      <!-- 基本信息 -->
      <el-card shadow="hover" class="mb20">
        <template #header>
          <span>基本信息</span>
        </template>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="活动标题" prop="activityTitle">
              <el-input v-model="form.activityTitle" placeholder="请输入活动标题" maxlength="100" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="活动类型" prop="activityType">
              <el-select v-model="form.activityType" placeholder="请选择活动类型" style="width: 100%">
                <el-option label="徒步" value="hiking" />
                <el-option label="骑行" value="cycling" />
                <el-option label="露营" value="camping" />
                <el-option label="登山" value="mountaineering" />
                <el-option label="滑雪" value="skiing" />
                <el-option label="水上运动" value="water" />
                <el-option label="其他" value="other" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="活动封面" prop="coverImage">
              <el-input v-model="form.coverImage" placeholder="请输入封面图片URL" />
              <div class="form-tip">建议尺寸: 750x400px，支持JPG/PNG格式</div>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="活动描述" prop="description">
              <el-input v-model="form.description" type="textarea" :rows="4" placeholder="请输入活动描述" maxlength="2000" show-word-limit />
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>

      <!-- 时间地点 -->
      <el-card shadow="hover" class="mb20">
        <template #header>
          <span>时间地点</span>
        </template>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="开始时间" prop="startTime">
              <el-date-picker v-model="form.startTime" type="datetime" placeholder="请选择开始时间" value-format="YYYY-MM-DD HH:mm:ss" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结束时间" prop="endTime">
              <el-date-picker v-model="form.endTime" type="datetime" placeholder="请选择结束时间" value-format="YYYY-MM-DD HH:mm:ss" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="报名截止" prop="registrationDeadline">
              <el-date-picker v-model="form.registrationDeadline" type="datetime" placeholder="请选择报名截止时间" value-format="YYYY-MM-DD HH:mm:ss" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="集合地点" prop="meetingPoint">
              <el-input v-model="form.meetingPoint" placeholder="请输入集合地点" maxlength="200" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="活动地点" prop="location">
              <el-input v-model="form.location" placeholder="请输入活动详细地点" maxlength="500" />
              <div class="form-tip">详细描述活动地点，包括具体地址或导航提示</div>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="行程安排" prop="itinerary">
              <el-input v-model="form.itinerary" type="textarea" :rows="6" placeholder="请输入行程安排（支持JSON格式）" />
              <div class="form-tip">
                支持JSON格式: [{"time": "08:00", "title": "集合出发", "content": "指定地点集合"}, ...]
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>

      <!-- 人数费用 -->
      <el-card shadow="hover" class="mb20">
        <template #header>
          <span>人数与费用</span>
        </template>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="最大人数" prop="maxParticipants">
              <el-input-number v-model="form.maxParticipants" :min="1" :max="1000" placeholder="最大参与人数" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="活动费用(元)" prop="price">
              <el-input-number v-model="form.price" :min="0" :precision="2" placeholder="活动费用" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="保险费用(元)" prop="insurancePrice">
              <el-input-number v-model="form.insurancePrice" :min="0" :precision="2" placeholder="保险费用" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="费用包含" prop="feeInclude">
              <el-input v-model="form.feeInclude" type="textarea" :rows="3" placeholder="费用包含哪些内容" maxlength="500" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="费用不含" prop="feeExclude">
              <el-input v-model="form.feeExclude" type="textarea" :rows="3" placeholder="费用不包含哪些内容" maxlength="500" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="退款政策" prop="refundPolicy">
              <el-input v-model="form.refundPolicy" type="textarea" :rows="3" placeholder="请输入退款政策" maxlength="1000" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>

      <!-- 免责设置 -->
      <el-card shadow="hover" class="mb20">
        <template #header>
          <span>免责与风险</span>
        </template>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="免责条款" prop="disclaimerId">
              <el-select v-model="form.disclaimerId" placeholder="请选择适用的免责条款" style="width: 100%">
                <el-option v-for="item in disclaimerList" :key="item.disclaimerId" :label="item.disclaimerTitle" :value="item.disclaimerId" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="难度等级" prop="difficultyLevel">
              <el-rate v-model="form.difficultyLevel" :max="5" show-text :texts="['非常简单', '简单', '中等', '较难', '困难', '极难']" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="风险提示" prop="riskWarning">
              <el-input v-model="form.riskWarning" type="textarea" :rows="2" placeholder="请输入风险提示" maxlength="500" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="装备要求" prop="equipmentRequired">
              <el-input v-model="form.equipmentRequired" type="textarea" :rows="3" placeholder="请输入装备要求" maxlength="500" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>

      <!-- 俱乐部设置 -->
      <el-card shadow="hover" class="mb20">
        <template #header>
          <span>俱乐部设置</span>
        </template>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="所属俱乐部" prop="clubId">
              <el-select v-model="form.clubId" placeholder="请选择俱乐部" style="width: 100%" :disabled="isEdit">
                <el-option v-for="item in clubList" :key="item.clubId" :label="item.clubName" :value="item.clubId" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="活动状态" prop="status">
              <el-select v-model="form.status" placeholder="请选择状态" style="width: 100%">
                <el-option label="草稿" value="draft" />
                <el-option label="招募中" value="recruiting" />
                <el-option label="已满员" value="full" />
                <el-option label="进行中" value="ongoing" />
                <el-option label="已结束" value="ended" />
                <el-option label="已取消" value="cancelled" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>

      <!-- 提交按钮 -->
      <div class="text-center">
        <el-button type="primary" @click="submitForm" :loading="saving">保存</el-button>
        <el-button @click="goBack">取消</el-button>
      </div>
    </el-form>
  </div>
</template>

<script setup name="ActivityEdit">
import { getActivity, addActivity, updateActivity, listActivity } from '@/api/outdoor/activity'
import { listDisclaimer } from '@/api/outdoor/disclaimer'
import { listClub } from '@/api/outdoor/club'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const { proxy } = getCurrentInstance()

const activityId = route.params.activityId
const isEdit = computed(() => !!activityId)

const loading = ref(false)
const saving = ref(false)
const formRef = ref(null)
const disclaimerList = ref([])
const clubList = ref([])

const form = reactive({
  activityId: undefined,
  clubId: undefined,
  activityTitle: '',
  activityType: 'hiking',
  coverImage: '',
  description: '',
  startTime: '',
  endTime: '',
  registrationDeadline: '',
  meetingPoint: '',
  location: '',
  itinerary: '',
  maxParticipants: 30,
  price: 0,
  insurancePrice: 0,
  feeInclude: '',
  feeExclude: '',
  refundPolicy: '',
  disclaimerId: undefined,
  difficultyLevel: 1,
  riskWarning: '',
  equipmentRequired: '',
  status: 'draft'
})

const rules = {
  activityTitle: [{ required: true, message: '活动标题不能为空', trigger: 'blur' }],
  activityType: [{ required: true, message: '请选择活动类型', trigger: 'change' }],
  startTime: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
  endTime: [{ required: true, message: '请选择结束时间', trigger: 'change' }],
  registrationDeadline: [{ required: true, message: '请选择报名截止时间', trigger: 'change' }],
  location: [{ required: true, message: '活动地点不能为空', trigger: 'blur' }],
  maxParticipants: [{ required: true, message: '请输入最大参与人数', trigger: 'blur' }],
  clubId: [{ required: true, message: '请选择俱乐部', trigger: 'change' }]
}

/** 加载表单数据 */
function loadFormData() {
  if (!activityId) return

  loading.value = true
  getActivity(activityId).then(response => {
    if (response.data) {
      Object.assign(form, response.data)
    }
    loading.value = false
  })
}

/** 加载俱乐部列表 */
function loadClubList() {
  listClub({ pageNum: 1, pageSize: 100 }).then(response => {
    clubList.value = response.rows || []
    if (clubList.value.length > 0 && !form.clubId) {
      form.clubId = clubList.value[0].clubId
    }
  })
}

/** 加载免责条款列表 */
function loadDisclaimerList() {
  listDisclaimer({ pageNum: 1, pageSize: 100 }).then(response => {
    disclaimerList.value = response.rows || []
  })
}

/** 提交表单 */
function submitForm() {
  proxy.$refs.formRef.validate(valid => {
    if (valid) {
      saving.value = true
      const data = { ...form }

      const action = isEdit.value ? updateActivity(data) : addActivity(data)

      action.then(() => {
        proxy.$modal.msgSuccess(isEdit.value ? '修改成功' : '创建成功')
        goBack()
      }).finally(() => {
        saving.value = false
      })
    }
  })
}

/** 返回 */
function goBack() {
  router.push('/outdoor/activity')
}

loadFormData()
loadClubList()
loadDisclaimerList()
</script>

<style scoped>
.mb20 {
  margin-bottom: 20px;
}
.mt20 {
  margin-top: 20px;
}
.text-center {
  text-align: center;
  margin-bottom: 30px;
}
.form-tip {
  color: #909399;
  font-size: 12px;
  line-height: 1.5;
  margin-top: 5px;
}
</style>
