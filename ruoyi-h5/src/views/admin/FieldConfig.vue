<template>
  <div class="field-config">
    <van-nav-bar title="报名表单配置" left-text="返回" left-arrow @click-left="goBack" fixed />

    <div class="content">
      <van-loading v-if="loading" class="loading" />

      <template v-else>
        <div class="section-title">报名字段</div>
        <div v-if="fields.length === 0" class="empty-tip">暂无字段，点击下方按钮添加</div>

        <div v-for="(field, index) in fields" :key="index" class="field-card">
          <van-cell-group inset>
            <van-field
              v-model="field.label"
              label="字段名称"
              placeholder="如：紧急联系人"
            />
            <van-field label="字段类型" readonly>
              <template #input>
                <van-radio-group v-model="field.type" direction="horizontal">
                  <van-radio name="text">文本</van-radio>
                  <van-radio name="number">数字</van-radio>
                  <van-radio name="select">选项</van-radio>
                </van-radio-group>
              </template>
            </van-field>
            <van-field
              v-if="field.type === 'select'"
              v-model="field.options"
              label="可选项"
              placeholder="逗号分隔，如：A,B,C"
            />
            <van-field label="必填" readonly>
              <template #input>
                <van-switch v-model="field.required" size="20" />
              </template>
            </van-field>
            <van-cell>
              <template #title>
                <van-button size="small" type="danger" plain @click="removeField(index)">
                  删除字段
                </van-button>
              </template>
            </van-cell>
          </van-cell-group>
        </div>

        <div class="add-btn">
          <van-button block plain type="primary" icon="plus" @click="addField">
            添加字段
          </van-button>
        </div>

        <div class="section-title">报名协议</div>
        <van-cell-group inset>
          <van-field
            v-model="agreement"
            type="textarea"
            rows="5"
            autosize
            placeholder="请输入报名协议/免责声明内容"
          />
        </van-cell-group>

        <div class="submit-btn">
          <van-button block type="primary" :loading="saving" @click="save">
            保存配置
          </van-button>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showSuccessToast } from 'vant'
import {
  getEnrollmentField,
  createEnrollmentField,
  updateEnrollmentField
} from '@/api/admin'

const router = useRouter()
const loading = ref(false)
const saving = ref(false)
const fields = ref([])
const agreement = ref('')
const hasConfig = ref(false)

onMounted(() => {
  loadConfig()
})

const loadConfig = async () => {
  try {
    loading.value = true
    const res = await getEnrollmentField()
    const data = res.result || res.data || null
    if (data) {
      hasConfig.value = true
      let parsed = data.fields
      if (typeof parsed === 'string') {
        try {
          parsed = JSON.parse(parsed)
        } catch (e) {
          parsed = []
        }
      }
      fields.value = (parsed || []).map((f) => ({
        label: f.label || '',
        type: f.type || 'text',
        options: Array.isArray(f.options) ? f.options.join(',') : (f.options || ''),
        required: !!f.required
      }))
      agreement.value = data.agreement || ''
    }
  } catch (error) {
    console.error('加载配置失败', error)
  } finally {
    loading.value = false
  }
}

const addField = () => {
  fields.value.push({ label: '', type: 'text', options: '', required: false })
}

const removeField = (index) => {
  fields.value.splice(index, 1)
}

const buildPayload = () => {
  const normalized = fields.value
    .filter((f) => f.label.trim())
    .map((f) => ({
      label: f.label.trim(),
      type: f.type,
      options:
        f.type === 'select'
          ? f.options
              .split(',')
              .map((o) => o.trim())
              .filter(Boolean)
          : [],
      required: !!f.required
    }))
  return {
    fields: JSON.stringify(normalized),
    agreement: agreement.value
  }
}

const save = async () => {
  try {
    saving.value = true
    const payload = buildPayload()
    if (hasConfig.value) {
      await updateEnrollmentField(payload)
    } else {
      await createEnrollmentField(payload)
      hasConfig.value = true
    }
    showSuccessToast('保存成功')
  } catch (error) {
    console.error('保存失败', error)
    showToast('保存失败')
  } finally {
    saving.value = false
  }
}

const goBack = () => {
  router.back()
}
</script>

<style lang="scss" scoped>
.field-config {
  min-height: 100vh;
  background: #f5f5f5;
  padding-top: 46px;
}

.content {
  padding: 12px 0 32px;
}

.loading {
  text-align: center;
  padding: 40px 0;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  padding: 16px 16px 8px;
}

.empty-tip {
  color: #999;
  font-size: 13px;
  text-align: center;
  padding: 16px;
}

.field-card {
  margin-bottom: 12px;
}

.add-btn,
.submit-btn {
  padding: 12px 16px;
}

.submit-btn {
  margin-top: 16px;
}
</style>
