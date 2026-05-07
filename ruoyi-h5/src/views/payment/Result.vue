<template>
  <div class="payment-result">
    <div class="result-content">
      <van-icon :name="status === 'success' ? 'checked' : 'cross'" :color="status === 'success' ? '#07c160' : '#ee0a24'" size="80" />
      <div class="result-title">{{ status === 'success' ? '支付成功' : '支付失败' }}</div>
      <div class="result-desc">{{ status === 'success' ? '您已成功报名活动，请耐心等待' : '请稍后重试或联系客服' }}</div>
      <div class="order-info">
        <div class="order-no">订单号：{{ orderNo }}</div>
      </div>
    </div>
    
    <div class="button-group">
      <van-button type="default" @click="goToMyRegistrations" v-if="status === 'success'">查看报名</van-button>
      <van-button type="primary" @click="goHome">返回首页</van-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { queryPaymentStatus } from '@/api/payment'

const route = useRoute()
const router = useRouter()
const orderNo = route.params.orderNo
const status = ref('pending')

const goHome = () => {
  router.push('/home')
}

const goToMyRegistrations = () => {
  router.push('/my-registrations')
}

onMounted(async () => {
  try {
    const res = await queryPaymentStatus(orderNo)
    if (res.data === 'SUCCESS') {
      status.value = 'success'
    } else if (res.data === 'FAILED') {
      status.value = 'fail'
    } else {
      status.value = 'pending'
    }
  } catch (e) {
    console.error(e)
  }
})
</script>

<style scoped lang="scss">
.payment-result {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f7f8fa;
}

.result-content {
  background: #fff;
  border-radius: 12px;
  padding: 40px 20px;
  width: 90%;
  text-align: center;
}

.result-title {
  font-size: 20px;
  font-weight: bold;
  margin-top: 20px;
}

.result-desc {
  font-size: 14px;
  color: #666;
  margin-top: 8px;
}

.order-info {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.order-no {
  font-size: 12px;
  color: #999;
}

.button-group {
  margin-top: 30px;
  display: flex;
  gap: 12px;
}
</style>
