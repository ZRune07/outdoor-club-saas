<template>
  <div class="payment-confirm">
    <van-nav-bar
      title="支付确认"
      left-arrow
      @click-left="$router.back()"
    />
    
    <div v-if="registration" class="confirm-content">
      <van-cell-group inset>
        <van-cell title="活动名称" :value="activity?.activityName" />
        <van-cell title="报名人" :value="registration.realName" />
        <van-cell title="联系电话" :value="registration.phone" />
        <van-cell title="报名人数" :value="registration.participantCount + '人'" />
      </van-cell-group>
      
      <div class="price-section">
        <div class="price-item">
          <span>活动费用</span>
          <span>¥{{ activity?.fee || 0 }}</span>
        </div>
        <div class="price-item total">
          <span>合计</span>
          <span>¥{{ totalFee }}</span>
        </div>
      </div>
      
      <div class="pay-method">
        <div class="pay-method-title">支付方式</div>
        <van-cell-group inset>
          <van-cell title="微信支付" is-link>
            <template #icon>
              <img src="https://img.icons8.com/color/48/weixing.png" alt="微信" class="pay-icon" />
            </template>
          </van-cell>
        </van-cell-group>
      </div>
    </div>
    
    <div class="bottom-bar">
      <div class="price-info">
        <span class="price-label">支付金额</span>
        <span class="price-value">¥{{ totalFee }}</span>
      </div>
      <van-button type="primary" size="large" @click="handlePay" :loading="paying">
        确认支付
      </van-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getActivityDetail } from '@/api/activity'
import { getRegistrationDetail } from '@/api/registration'
import { createPayment } from '@/api/payment'

const route = useRoute()
const router = useRouter()
const registrationId = route.params.registrationId
const registration = ref(null)
const activity = ref(null)
const paying = ref(false)

const totalFee = computed(() => {
  if (!activity.value || !registration.value) return 0
  return (activity.value.fee || 0) * (registration.value.participantCount || 1)
})

const handlePay = async () => {
  try {
    paying.value = true
    const res = await createPayment({
      activityId: activity.value.activityId,
      registrationId: registration.value.registrationId
    })
    
    if (res.data?.orderNo) {
      router.push(`/payment-result/${res.data.orderNo}`)
    }
  } catch (e) {
    console.error(e)
  } finally {
    paying.value = false
  }
}

onMounted(async () => {
  try {
    const regRes = await getRegistrationDetail(registrationId)
    if (regRes.data) {
      registration.value = regRes.data
      
      const actRes = await getActivityDetail(registration.value.activityId)
      if (actRes.data) {
        activity.value = actRes.data
      }
    }
  } catch (e) {
    console.error(e)
  }
})
</script>

<style scoped lang="scss">
.payment-confirm {
  padding-bottom: 70px;
}

.price-section {
  background: #fff;
  margin: 10px;
  border-radius: 8px;
  padding: 16px;
}

.price-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  
  &:last-child {
    margin-bottom: 0;
    padding-top: 12px;
    border-top: 1px solid #eee;
  }
  
  &.total {
    font-weight: bold;
    font-size: 16px;
    
    span:last-child {
      color: #ff4d4f;
      font-size: 20px;
    }
  }
}

.pay-method {
  margin-top: 10px;
}

.pay-method-title {
  padding: 10px 16px;
  font-size: 14px;
  color: #999;
}

.pay-icon {
  width: 24px;
  height: 24px;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  background: #fff;
  padding: 10px 16px;
  box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
}

.price-info {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 6px;
}

.price-label {
  font-size: 14px;
  color: #666;
}

.price-value {
  font-size: 22px;
  color: #ff4d4f;
  font-weight: bold;
}
</style>
