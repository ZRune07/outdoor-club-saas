<template>
  <div class="registration-form">
    <van-nav-bar
      title="活动报名"
      left-arrow
      @click-left="$router.back()"
    />
    
    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <van-field
          v-model="form.realName"
          name="realName"
          label="真实姓名"
          placeholder="请输入真实姓名"
          :rules="[{ required: true, message: '请输入真实姓名' }]"
        />
        <van-field
          v-model="form.phone"
          name="phone"
          label="手机号码"
          placeholder="请输入手机号码"
          :rules="[{ required: true, message: '请输入手机号码' }]"
        />
        <van-field
          v-model="form.idCard"
          name="idCard"
          label="身份证号"
          placeholder="请输入身份证号"
        />
        <van-field
          v-model="form.emergencyContact"
          name="emergencyContact"
          label="紧急联系人"
          placeholder="请输入紧急联系人"
          :rules="[{ required: true, message: '请输入紧急联系人' }]"
        />
        <van-field
          v-model="form.emergencyPhone"
          name="emergencyPhone"
          label="紧急联系电话"
          placeholder="请输入紧急联系电话"
          :rules="[{ required: true, message: '请输入紧急联系电话' }]"
        />
        <van-field
          v-model.number="form.participantCount"
          name="participantCount"
          label="报名人数"
          type="number"
          placeholder="请输入报名人数"
          :rules="[{ required: true, message: '请输入报名人数' }]"
        />
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
          :disabled="!agreed"
        >
          立即报名
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showToast } from 'vant'
import { getActivityDetail } from '@/api/activity'
import { createRegistration } from '@/api/registration'

const route = useRoute()
const router = useRouter()
const activityId = route.params.activityId
const activity = ref(null)

const form = ref({
  realName: '',
  phone: '',
  idCard: '',
  emergencyContact: '',
  emergencyPhone: '',
  participantCount: 1
})
const agreed = ref(false)

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
  
  try {
    const res = await createRegistration({
      activityId,
      ...form.value
    })
    
    if (res.data?.registrationId) {
      router.push(`/payment-confirm/${res.data.registrationId}`)
    }
  } catch (e) {
    console.error(e)
  }
}

onMounted(async () => {
  try {
    const res = await getActivityDetail(activityId)
    if (res.data) {
      activity.value = res.data
    }
  } catch (e) {
    console.error(e)
  }
})
</script>

<style scoped lang="scss">
.registration-form {
  padding-bottom: 30px;
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
