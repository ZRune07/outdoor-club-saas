<template>
  <div class="registration-form">
    <van-nav-bar
      title="活动报名"
      left-arrow
      @click-left="$router.back()"
    />

    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <template v-for="field in fields" :key="field.name">
          <!-- 单选 -->
          <van-field
            v-if="field.type === 'radio'"
            :name="field.name"
            :label="field.label"
            :rules="buildRules(field)"
          >
            <template #input>
              <van-radio-group v-model="form[field.name]" direction="horizontal">
                <van-radio
                  v-for="opt in normalizeOptions(field.options)"
                  :key="opt.value"
                  :name="opt.value"
                >
                  {{ opt.label }}
                </van-radio>
              </van-radio-group>
            </template>
          </van-field>

          <!-- 多选 -->
          <van-field
            v-else-if="field.type === 'checkbox'"
            :name="field.name"
            :label="field.label"
            :rules="buildRules(field)"
          >
            <template #input>
              <van-checkbox-group v-model="form[field.name]" direction="horizontal">
                <van-checkbox
                  v-for="opt in normalizeOptions(field.options)"
                  :key="opt.value"
                  :name="opt.value"
                  shape="square"
                >
                  {{ opt.label }}
                </van-checkbox>
              </van-checkbox-group>
            </template>
          </van-field>

          <!-- 下拉选择 -->
          <van-field
            v-else-if="field.type === 'select'"
            v-model="pickerText[field.name]"
            :name="field.name"
            :label="field.label"
            :placeholder="field.placeholder || '请选择'"
            readonly
            is-link
            :rules="buildRules(field)"
            @click="openPicker(field)"
          />

          <!-- 数字 -->
          <van-field
            v-else-if="field.type === 'number'"
            v-model.number="form[field.name]"
            :name="field.name"
            :label="field.label"
            type="number"
            :placeholder="field.placeholder || `请输入${field.label}`"
            :rules="buildRules(field)"
          />

          <!-- 多行文本 -->
          <van-field
            v-else-if="field.type === 'textarea'"
            v-model="form[field.name]"
            :name="field.name"
            :label="field.label"
            type="textarea"
            rows="2"
            autosize
            :placeholder="field.placeholder || `请输入${field.label}`"
            :rules="buildRules(field)"
          />

          <!-- 默认文本 -->
          <van-field
            v-else
            v-model="form[field.name]"
            :name="field.name"
            :label="field.label"
            :placeholder="field.placeholder || `请输入${field.label}`"
            :rules="buildRules(field)"
          />
        </template>

        <van-field
          v-model.number="participantCount"
          name="participantCount"
          label="报名人数"
          type="number"
          placeholder="请输入报名人数"
          :rules="[{ required: true, message: '请输入报名人数' }]"
        />
        <van-field
          v-model="message"
          name="message"
          label="备注"
          type="textarea"
          rows="1"
          autosize
          placeholder="选填"
        />
      </van-cell-group>

      <!-- 电子签名 -->
      <van-cell-group v-if="config.enableAgreement" inset class="signature-group">
        <van-cell title="电子签名" :label="config.agreementText || '请在下方区域签名以确认协议'" />
        <div class="signature-wrap">
          <canvas
            ref="canvasRef"
            class="signature-canvas"
            @mousedown="startDraw"
            @mousemove="moveDraw"
            @mouseup="endDraw"
            @mouseleave="endDraw"
            @touchstart.prevent="startDraw"
            @touchmove.prevent="moveDraw"
            @touchend.prevent="endDraw"
          ></canvas>
        </div>
        <div class="signature-actions">
          <van-button size="small" plain @click="clearSignature">清除签名</van-button>
        </div>
      </van-cell-group>

      <div class="disclaimer-section">
        <van-checkbox v-model="agreed">
          我已阅读并同意
          <span class="link" @click="goToDisclaimer">《免责条款》</span>
        </van-checkbox>
      </div>

      <div class="submit-section">
        <van-button
          round
          block
          type="primary"
          size="large"
          native-type="submit"
          :loading="submitting"
          :disabled="!agreed"
        >
          立即报名
        </van-button>
      </div>
    </van-form>

    <van-popup v-model:show="showPicker" position="bottom">
      <van-picker
        :columns="pickerColumns"
        @confirm="onPickerConfirm"
        @cancel="showPicker = false"
      />
    </van-popup>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showToast } from 'vant'
import { getActivityDetail } from '@/api/activity'
import { createRegistration } from '@/api/registration'
import { getEnrollmentField, signAgreement } from '@/api/enrollmentField'

const route = useRoute()
const router = useRouter()
const activityId = route.params.activityId
const activity = ref(null)

const fields = ref([])
const config = reactive({ enableAgreement: false, agreementText: '' })
const form = reactive({})
const pickerText = reactive({})
const participantCount = ref(1)
const message = ref('')
const agreed = ref(false)
const submitting = ref(false)

// 签名画板
const canvasRef = ref(null)
let ctx = null
let drawing = false
let hasSignature = false

const showPicker = ref(false)
const pickerColumns = ref([])
let activePickerField = null

const normalizeOptions = (options) => {
  if (!options) return []
  return options.map((o) =>
    typeof o === 'object' ? { label: o.label ?? o.value, value: o.value ?? o.label } : { label: o, value: o }
  )
}

const buildRules = (field) => {
  return field.required ? [{ required: true, message: `请填写${field.label}` }] : []
}

const openPicker = (field) => {
  activePickerField = field
  pickerColumns.value = normalizeOptions(field.options).map((o) => ({ text: o.label, value: o.value }))
  showPicker.value = true
}

const onPickerConfirm = ({ selectedOptions }) => {
  if (activePickerField && selectedOptions[0]) {
    form[activePickerField.name] = selectedOptions[0].value
    pickerText[activePickerField.name] = selectedOptions[0].text
  }
  showPicker.value = false
}

const initCanvas = () => {
  const canvas = canvasRef.value
  if (!canvas) return
  canvas.width = canvas.offsetWidth
  canvas.height = canvas.offsetHeight
  ctx = canvas.getContext('2d')
  ctx.lineWidth = 2
  ctx.lineCap = 'round'
  ctx.strokeStyle = '#333'
}

const getPos = (e) => {
  const canvas = canvasRef.value
  const rect = canvas.getBoundingClientRect()
  const point = e.touches ? e.touches[0] : e
  return { x: point.clientX - rect.left, y: point.clientY - rect.top }
}

const startDraw = (e) => {
  if (!ctx) return
  drawing = true
  const { x, y } = getPos(e)
  ctx.beginPath()
  ctx.moveTo(x, y)
}

const moveDraw = (e) => {
  if (!drawing || !ctx) return
  const { x, y } = getPos(e)
  ctx.lineTo(x, y)
  ctx.stroke()
  hasSignature = true
}

const endDraw = () => {
  drawing = false
}

const clearSignature = () => {
  if (!ctx || !canvasRef.value) return
  ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)
  hasSignature = false
}

const goToDisclaimer = () => {
  router.push({
    path: '/disclaimer',
    query: { activityId }
  })
}

const onSubmit = async () => {
  if (!agreed.value) {
    showToast('请先阅读并同意免责条款')
    return
  }
  if (config.enableAgreement && !hasSignature) {
    showToast('请先完成电子签名')
    return
  }

  try {
    submitting.value = true

    let signatureBase64 = ''
    if (config.enableAgreement && hasSignature) {
      signatureBase64 = canvasRef.value.toDataURL('image/png')
      await signAgreement({
        activityId,
        signature: signatureBase64
      })
    }

    const res = await createRegistration({
      activityId,
      participantCount: participantCount.value,
      message: message.value,
      extraFieldsJson: JSON.stringify({ ...form })
    })

    if (res.data?.registrationId) {
      router.push(`/payment-confirm/${res.data.registrationId}`)
    }
  } catch (e) {
    console.error(e)
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  const [actRes, fieldRes] = await Promise.all([
    getActivityDetail(activityId).catch(() => null),
    getEnrollmentField(activityId).catch(() => null)
  ])

  if (actRes && actRes.data) {
    activity.value = actRes.data
  }

  if (fieldRes) {
    const data = fieldRes.data || {}
    config.enableAgreement = !!(data.enableAgreement ?? data.enable_agreement)
    config.agreementText = data.agreementText ?? data.agreement_text ?? ''

    let parsed = data.fieldsJson ?? data.fields_json ?? data.fields ?? []
    if (typeof parsed === 'string') {
      try {
        parsed = JSON.parse(parsed)
      } catch (err) {
        parsed = []
      }
    }
    fields.value = Array.isArray(parsed) ? parsed : []

    fields.value.forEach((f) => {
      form[f.name] = f.type === 'checkbox' ? [] : ''
    })

    if (config.enableAgreement) {
      // 等待画板渲染后再初始化绘制上下文
      setTimeout(initCanvas, 0)
    }
  }
})
</script>

<style scoped lang="scss">
.registration-form {
  padding-bottom: 30px;
}

.signature-group {
  margin-top: 12px;
}

.signature-wrap {
  padding: 12px 16px;
}

.signature-canvas {
  width: 100%;
  height: 160px;
  border: 1px dashed #c8c9cc;
  border-radius: 6px;
  background: #fff;
  touch-action: none;
}

.signature-actions {
  padding: 0 16px 12px;
  text-align: right;
}

.disclaimer-section {
  padding: 16px;

  .link {
    color: #1989fa;
  }
}

.submit-section {
  padding: 16px;
}
</style>
