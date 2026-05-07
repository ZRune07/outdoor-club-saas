<template>
  <div class="activity-detail">
    <!-- 返回导航 -->
    <van-nav-bar
      title="活动详情"
      left-text="返回"
      left-arrow
      @click-left="goBack"
      fixed
    />

    <!-- 活动封面 -->
    <div class="cover-section">
      <img :src="activity.coverImage || defaultCover" class="cover-image" />
      <div class="cover-overlay">
        <div class="status-badge" :class="getStatusClass(activity.status)">
          {{ getStatusText(activity.status) }}
        </div>
      </div>
    </div>

    <!-- 活动基本信息 -->
    <div class="info-section">
      <h1 class="activity-title">{{ activity.activityTitle }}</h1>
      <div class="activity-tags">
        <span class="tag" v-if="activity.activityType === 'hiking'">徒步</span>
        <span class="tag" v-else-if="activity.activityType === 'cycling'">骑行</span>
        <span class="tag" v-else-if="activity.activityType === 'camping'">露营</span>
        <span class="tag tag-danger" v-if="activity.price > 0">收费活动</span>
        <span class="tag tag-success" v-else>免费活动</span>
      </div>
    </div>

    <!-- 活动时间地点 -->
    <van-cell-group class="detail-group">
      <van-cell title="开始时间" :value="formatDateTime(activity.startTime)" icon="clock-o" />
      <van-cell title="结束时间" :value="formatDateTime(activity.endTime)" icon="clock-o" />
      <van-cell title="报名截止" :value="formatDateTime(activity.registrationDeadline)" icon="stop-circle-o" />
      <van-cell title="活动地点" :value="activity.location || '待定'" icon="location-o" is-link />
    </van-cell-group>

    <!-- 费用说明 -->
    <van-cell-group class="detail-group">
      <van-cell title="活动费用">
        <template #value>
          <span class="price-text" v-if="activity.price > 0">¥{{ activity.price }}</span>
          <span class="price-free" v-else>免费</span>
        </template>
      </van-cell>
      <van-cell title="保险费用" :value="activity.insurancePrice ? '¥' + activity.insurancePrice : '可选'" />
      <van-cell title="报名人数" :value="`${activity.currentParticipants || 0} / ${activity.maxParticipants}`" icon="friends-o" />
    </van-cell-group>

    <!-- 活动介绍 -->
    <div class="intro-section">
      <h3 class="section-title">活动介绍</h3>
      <div class="intro-content" v-html="activity.description || '暂无活动介绍'"></div>
    </div>

    <!-- 报名须知 -->
    <div class="notice-section">
      <h3 class="section-title">报名须知</h3>
      <div class="notice-content">
        <p>1. 请如实填写报名信息;</p>
        <p>2. 报名截止前可取消报名;</p>
        <p>3. 参加活动需签署免责协议;</p>
        <p>4. 活动前一天会发送通知短信;</p>
      </div>
    </div>

    <!-- 底部报名按钮 -->
    <div class="bottom-bar" v-if="activity.status === 'recruiting'">
      <div class="price-info">
        <span class="label">合计</span>
        <span class="amount">¥{{ totalPrice }}</span>
      </div>
      <van-button 
        type="primary" 
        color="#667eea" 
        round 
        :disabled="isFull || hasRegistered"
        @click="handleSignUp"
      >
        {{ isFull ? '已满员' : hasRegistered ? '已报名' : '立即报名' }}
      </van-button>
    </div>

    <!-- 报名弹窗 -->
    <van-popup v-model:show="showSignUp" position="bottom" round style="max-height: 80vh;">
      <div class="sign-up-popup">
        <div class="popup-header">
          <h3>报名信息</h3>
          <van-icon name="cross" @click="showSignUp = false" />
        </div>
        
        <van-form @submit="onSubmit">
          <van-cell-group inset>
            <van-field
              v-model="form.realName"
              name="realName"
              label="姓名"
              placeholder="请输入真实姓名"
              :rules="[{ required: true, message: '请输入姓名' }]"
            />
            <van-field
              v-model="form.phone"
              name="phone"
              type="tel"
              label="手机号"
              placeholder="请输入手机号"
              :rules="[{ required: true, message: '请输入手机号' }]"
            />
            <van-field
              v-model="form.idCard"
              name="idCard"
              label="身份证"
              placeholder="购买保险需要"
            />
            <van-field
              v-model="form.remark"
              name="remark"
              label="备注"
              type="textarea"
              rows="2"
              placeholder="有无特殊要求"
            />
          </van-cell-group>
          
          <!-- 费用明细 -->
          <div class="fee-detail">
            <div class="fee-item">
              <span>活动费用</span>
              <span>¥{{ activity.price || 0 }}</span>
            </div>
            <div class="fee-item" v-if="form.needInsurance">
              <span>保险费用</span>
              <span>¥{{ activity.insurancePrice || 0 }}</span>
            </div>
            <div class="fee-total">
              <span>合计</span>
              <span>¥{{ totalPrice }}</span>
            </div>
          </div>
          
          <!-- 免责协议勾选 -->
          <div class="disclaimer-check">
            <van-checkbox v-model="form.agreeDisclaimer" shape="square" icon-size="18px">
              <span>我已阅读并同意</span>
              <span class="link" @click.stop="showDisclaimer = true">《户外活动免责协议》</span>
            </van-checkbox>
          </div>
          
          <div class="submit-btn">
            <van-button 
              type="primary" 
              color="#667eea" 
              round 
              block 
              native-type="submit"
              :disabled="!form.agreeDisclaimer"
            >
              确认报名
            </van-button>
          </div>
        </van-form>
      </div>
    </van-popup>

    <!-- 免责协议弹窗 -->
    <van-popup v-model:show="showDisclaimer" position="right" style="width: 100%; height: 100%">
      <div class="disclaimer-popup">
        <van-nav-bar title="免责协议" left-text="返回" left-arrow @click-left="showDisclaimer = false" fixed />
        <div class="disclaimer-content">
          <h2>户外活动免责协议</h2>
          <div v-html="disclaimerContent"></div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getActivityDetail, checkActivityRegistration } from '@/api/activity'
import { createRegistration } from '@/api/registration'
import { showToast, showSuccessToast } from 'vant'

const router = useRouter()
const route = useRoute()

const activityId = route.params.id
const activity = ref({})
const hasRegistered = ref(false)
const showSignUp = ref(false)
const showDisclaimer = ref(false)
const loading = ref(false)

const form = ref({
  realName: '',
  phone: '',
  idCard: '',
  remark: '',
  needInsurance: false,
  agreeDisclaimer: false
})

const defaultCover = 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800'
const disclaimerContent = `
<p>1. 本人自愿报名参加户外活动，并确认已了解活动的风险性和可能对身体造成的影响。</p>
<p>2. 本人承诺身体健康，无心脏病、高血压、呼吸系统疾病等不适合户外运动的疾病史。如有隐瞒，后果自负。</p>
<p>3. 活动期间，严格遵守领队指挥，不得擅自行动。因违反规定导致自身或他人人身伤害、财产损失，由本人承担全部责任。</p>
<p>4. 如遇天气、交通等不可抗力因素导致活动取消或变更，组织方不承担违约责任，但会尽力协调解决。</p>
<p>5. 活动期间发生的意外伤害，组织方仅在能力范围内协助救治，不承担医疗费用。</p>
<p>6. 本人同意活动组织方使用活动中的照片、视频等影像资料用于宣传。</p>
<p>7. 本协议自签署之日起生效，最终解释权归活动组织方所有。</p>
`

const totalPrice = computed(() => {
  let price = activity.value.price || 0
  if (form.value.needInsurance) {
    price += activity.value.insurancePrice || 0
  }
  return price.toFixed(2)
})

const isFull = computed(() => {
  const current = activity.value.currentParticipants || 0
  const max = activity.value.maxParticipants || 0
  return max > 0 && current >= max
})

onMounted(() => {
  loadActivityDetail()
  checkRegistration()
})

const loadActivityDetail = async () => {
  try {
    loading.value = true
    const res = await getActivityDetail(activityId)
    if (res.code === 200) {
      activity.value = res.result || {}
    }
  } catch (error) {
    console.error('加载活动详情失败', error)
    showToast('加载失败')
  } finally {
    loading.value = false
  }
}

const checkRegistration = async () => {
  try {
    // 假设已登录用户的wxUserId从本地存储获取
    const wxUserId = localStorage.getItem('wxUserId')
    if (wxUserId) {
      const res = await checkActivityRegistration(activityId, wxUserId)
      if (res.code === 200 && res.result) {
        hasRegistered.value = true
      }
    }
  } catch (error) {
    console.error('检查报名状态失败', error)
  }
}

const handleSignUp = () => {
  if (hasRegistered.value) {
    showToast('您已报名此活动')
    return
  }
  showSignUp.value = true
}

const onSubmit = async () => {
  if (!form.value.agreeDisclaimer) {
    showToast('请先阅读并同意免责协议')
    return
  }
  
  try {
    const wxUserId = localStorage.getItem('wxUserId') || 1
    const data = {
      activityId: parseInt(activityId),
      wxUserId: parseInt(wxUserId),
      realName: form.value.realName,
      phone: form.value.phone,
      idCard: form.value.idCard,
      remark: form.value.remark,
      needInsurance: form.value.needInsurance ? 1 : 0,
      registrationStatus: totalPrice.value > 0 ? 'pending_payment' : 'confirmed'
    }
    
    const res = await createRegistration(data)
    if (res.code === 200) {
      showSuccessToast('报名成功')
      showSignUp.value = false
      hasRegistered.value = true
      loadActivityDetail() // 刷新活动详情
    } else {
      showToast(res.msg || '报名失败')
    }
  } catch (error) {
    console.error('报名失败', error)
    showToast('报名失败，请重试')
  }
}

const goBack = () => {
  router.back()
}

const formatDateTime = (time) => {
  if (!time) return '待定'
  const date = new Date(time)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

const getStatusClass = (status) => {
  const map = {
    recruiting: 'status-recruiting',
    full: 'status-full',
    ongoing: 'status-ongoing',
    ended: 'status-ended'
  }
  return map[status] || 'status-recruiting'
}

const getStatusText = (status) => {
  const map = {
    recruiting: '招募中',
    full: '已满员',
    ongoing: '进行中',
    ended: '已结束'
  }
  return map[status] || '招募中'
}
</script>

<style lang="scss" scoped>
.activity-detail {
  padding-bottom: 80px;
  background: #f5f5f5;
}

.cover-section {
  position: relative;
  height: 280px;
  
  .cover-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .cover-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 16px;
    background: linear-gradient(transparent, rgba(0,0,0,0.5));
    
    .status-badge {
      display: inline-block;
      padding: 6px 14px;
      border-radius: 16px;
      font-size: 13px;
      color: #fff;
      
      &.status-recruiting { background: #07c160; }
      &.status-full { background: #ff976a; }
      &.status-ongoing { background: #667eea; }
      &.status-ended { background: #999; }
    }
  }
}

.info-section {
  padding: 16px;
  background: #fff;
  
  .activity-title {
    font-size: 20px;
    font-weight: 600;
    color: #333;
    margin: 0 0 12px;
  }
  
  .activity-tags {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    
    .tag {
      padding: 4px 10px;
      border-radius: 4px;
      font-size: 12px;
      background: #f0f0f0;
      color: #666;
      
      &.tag-danger {
        background: #fff2f0;
        color: #ff4d4f;
      }
      
      &.tag-success {
        background: #f6ffed;
        color: #07c160;
      }
    }
  }
}

.detail-group {
  margin: 12px 0;
}

.intro-section, .notice-section {
  padding: 16px;
  background: #fff;
  margin-bottom: 12px;
  
  .section-title {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin: 0 0 12px;
    padding-left: 10px;
    border-left: 3px solid #667eea;
  }
  
  .intro-content, .notice-content {
    font-size: 14px;
    color: #666;
    line-height: 1.8;
    
    p {
      margin: 8px 0;
    }
  }
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #fff;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  
  .price-info {
    .label {
      font-size: 13px;
      color: #999;
      margin-right: 8px;
    }
    
    .amount {
      font-size: 22px;
      font-weight: 600;
      color: #ff4d4f;
    }
  }
}

.sign-up-popup {
  padding: 16px;
  
  .popup-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    
    h3 {
      font-size: 18px;
      font-weight: 600;
      margin: 0;
    }
  }
  
  .fee-detail {
    margin: 16px;
    padding: 12px;
    background: #f5f5f5;
    border-radius: 8px;
    
    .fee-item {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      color: #666;
      margin-bottom: 8px;
    }
    
    .fee-total {
      display: flex;
      justify-content: space-between;
      font-size: 16px;
      font-weight: 600;
      color: #333;
      padding-top: 8px;
      border-top: 1px solid #ddd;
    }
  }
  
  .disclaimer-check {
    padding: 12px 16px;
    font-size: 13px;
    
    .link {
      color: #667eea;
    }
  }
  
  .submit-btn {
    padding: 16px;
  }
}

.disclaimer-popup {
  .disclaimer-content {
    padding: 60px 16px 16px;
    
    h2 {
      text-align: center;
      font-size: 20px;
      margin-bottom: 20px;
    }
    
    p {
      line-height: 1.8;
      margin-bottom: 12px;
    }
  }
}

.price-text {
  font-size: 18px;
  font-weight: 600;
  color: #ff4d4f;
}

.price-free {
  font-size: 18px;
  font-weight: 600;
  color: #07c160;
}
</style>
