<template>
  <div class="app-container">
    <el-page-header @back="goBack" content="俱乐部配置" title="返回" />

    <el-row :gutter="20" class="mt20">
      <!-- 俱乐部信息 -->
      <el-col :span="8">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>俱乐部信息</span>
            </div>
          </template>
          <el-descriptions :column="1" border size="small">
            <el-descriptions-item label="俱乐部名称">{{ clubInfo.clubName }}</el-descriptions-item>
            <el-descriptions-item label="俱乐部编码">{{ clubInfo.clubCode }}</el-descriptions-item>
            <el-descriptions-item label="套餐类型">
              <el-tag v-if="clubInfo.packageType === 'basic'" size="small">基础版</el-tag>
              <el-tag v-else-if="clubInfo.packageType === 'standard'" size="small" type="success">标准版</el-tag>
              <el-tag v-else-if="clubInfo.packageType === 'professional'" size="small" type="warning">专业版</el-tag>
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>

      <!-- 快捷配置 -->
      <el-col :span="8">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>快捷配置</span>
            </div>
          </template>
          <el-space direction="vertical" :size="12" style="width: 100%">
            <el-button type="primary" plain icon="Refresh" @click="handleSyncConfig">同步默认配置</el-button>
            <el-button type="warning" plain icon="DocumentCopy" @click="handleCopyConfig">复制配置到其他俱乐部</el-button>
            <el-button type="info" plain icon="View" @click="handlePreview">预览H5效果</el-button>
          </el-space>
        </el-card>
      </el-col>

      <!-- 配置状态 -->
      <el-col :span="8">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>配置状态</span>
            </div>
          </template>
          <el-space direction="vertical" :size="12" style="width: 100%">
            <el-progress :percentage="configProgress" :format="formatPercentage" />
            <el-text type="info" size="small">已配置 {{ configuredCount }} / {{ totalConfigCount }} 项</el-text>
          </el-space>
        </el-card>
      </el-col>
    </el-row>

    <!-- 配置表单 -->
    <el-card class="mt20" shadow="hover">
      <template #header>
        <div class="card-header">
          <span>主题与品牌</span>
        </div>
      </template>

      <el-form ref="formRef" :model="configForm" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="主题色" prop="themeColor">
              <el-color-picker v-model="configForm.themeColor" />
              <span class="ml10">{{ configForm.themeColor }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="次要色" prop="secondaryColor">
              <el-color-picker v-model="configForm.secondaryColor" />
              <span class="ml10">{{ configForm.secondaryColor }}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="Logo" prop="logo">
          <el-input v-model="configForm.logo" placeholder="请输入Logo URL" />
          <div class="form-tip">建议尺寸: 200x200px</div>
        </el-form-item>

        <el-form-item label="Banner" prop="bannerImages">
          <div class="banner-list">
            <div v-for="(banner, index) in configForm.bannerImages" :key="index" class="banner-item">
              <el-input v-model="banner.url" placeholder="Banner图片URL" />
              <el-input v-model="banner.link" placeholder="点击链接(可选)" class="mt5" />
              <el-button type="danger" icon="Delete" circle @click="removeBanner(index)" class="mt5" />
            </div>
          </div>
          <el-button type="primary" plain icon="Plus" @click="addBanner">添加Banner</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="mt20" shadow="hover">
      <template #header>
        <div class="card-header">
          <span>功能开关</span>
        </div>
      </template>

      <el-form ref="featureFormRef" :model="configForm" label-width="150px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="开启活动功能">
              <el-switch v-model="configForm.features.enableActivity" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开启在线报名">
              <el-switch v-model="configForm.features.enableRegistration" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开启在线缴费">
              <el-switch v-model="configForm.features.enablePayment" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开启免责签署">
              <el-switch v-model="configForm.features.enableDisclaimer" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开启会员管理">
              <el-switch v-model="configForm.features.enableMember" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开启公告">
              <el-switch v-model="configForm.features.enableNotice" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开启积分功能">
              <el-switch v-model="configForm.features.enablePoints" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开启分销功能">
              <el-switch v-model="configForm.features.enableDistribution" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card class="mt20" shadow="hover">
      <template #header>
        <div class="card-header">
          <span>报名设置</span>
        </div>
      </template>

      <el-form ref="registrationFormRef" :model="configForm" label-width="150px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="允许取消报名">
              <el-switch v-model="configForm.registration.allowCancel" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="取消截止时间(小时)" prop="registration.cancelDeadlineHours">
              <el-input-number v-model="configForm.registration.cancelDeadlineHours" :min="0" :max="168" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="自动审核">
              <el-switch v-model="configForm.registration.autoAudit" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="报名截止后禁止报名">
              <el-switch v-model="configForm.registration.disableAfterDeadline" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="退款政策" prop="registration.refundPolicy">
          <el-input v-model="configForm.registration.refundPolicy" type="textarea" :rows="3" placeholder="请输入退款政策" />
        </el-form-item>
      </el-form>
    </el-card>

    <div class="mt20 text-center">
      <el-button type="primary" @click="handleSave" :loading="saving">保存配置</el-button>
      <el-button @click="goBack">返回</el-button>
    </div>
  </div>
</template>

<script setup name="ClubConfig">
import { getClub, getClubConfig, saveClubConfig } from '@/api/outdoor/club'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const { proxy } = getCurrentInstance()

const clubId = route.params.clubId
const loading = ref(true)
const saving = ref(false)
const clubInfo = ref({})
const formRef = ref(null)
const featureFormRef = ref(null)
const registrationFormRef = ref(null)

const configForm = reactive({
  themeColor: '#409EFF',
  secondaryColor: '#67C23A',
  logo: '',
  bannerImages: [],
  features: {
    enableActivity: true,
    enableRegistration: true,
    enablePayment: true,
    enableDisclaimer: true,
    enableMember: true,
    enableNotice: false,
    enablePoints: false,
    enableDistribution: false
  },
  registration: {
    allowCancel: true,
    cancelDeadlineHours: 24,
    autoAudit: false,
    disableAfterDeadline: true,
    refundPolicy: ''
  }
})

const configuredCount = computed(() => {
  let count = 0
  if (configForm.logo) count++
  if (configForm.bannerImages.length > 0) count++
  count += Object.values(configForm.features).filter(v => v).length
  return count
})

const totalConfigCount = 11

const configProgress = computed(() => {
  return Math.round((configuredCount.value / totalConfigCount) * 100)
})

function formatPercentage() {
  return configProgress.value + '%'
}

/** 加载俱乐部信息 */
function loadClubInfo() {
  if (!clubId) return
  getClub(clubId).then(response => {
    clubInfo.value = response.data || {}
  })
}

/** 加载配置 */
function loadConfig() {
  if (!clubId) return
  loading.value = true
  getClubConfig(clubId).then(response => {
    if (response.data) {
      Object.assign(configForm, JSON.parse(response.data.configJson || '{}'))
    }
    loading.value = false
  })
}

/** 添加Banner */
function addBanner() {
  configForm.bannerImages.push({ url: '', link: '' })
}

/** 删除Banner */
function removeBanner(index) {
  configForm.bannerImages.splice(index, 1)
}

/** 保存配置 */
function handleSave() {
  saving.value = true
  saveClubConfig({
    clubId,
    configJson: JSON.stringify(configForm)
  }).then(() => {
    proxy.$modal.msgSuccess('保存成功')
  }).finally(() => {
    saving.value = false
  })
}

/** 同步默认配置 */
function handleSyncConfig() {
  proxy.$modal.confirm('确定要同步默认配置吗?这将覆盖当前配置!').then(() => {
    proxy.$modal.msgSuccess('同步成功')
    loadConfig()
  })
}

/** 复制配置 */
function handleCopyConfig() {
  proxy.$modal.msgInfo('功能开发中')
}

/** 预览效果 */
function handlePreview() {
  window.open('/h5', '_blank')
}

/** 返回 */
function goBack() {
  router.push('/outdoor/club')
}

loadClubInfo()
loadConfig()
</script>

<style scoped>
.mt20 {
  margin-top: 20px;
}
.ml10 {
  margin-left: 10px;
}
.text-center {
  text-align: center;
}
.card-header {
  font-weight: 600;
}
.banner-list {
  width: 100%;
}
.banner-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.banner-item .el-input {
  flex: 1;
  margin-right: 10px;
}
.form-tip {
  color: #909399;
  font-size: 12px;
  line-height: 1.5;
  margin-top: 5px;
}
</style>
