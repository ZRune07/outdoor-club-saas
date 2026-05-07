<template>
  <div class="disclaimer">
    <van-nav-bar
      title="免责条款"
      left-arrow
      @click-left="$router.back()"
    />
    
    <div class="disclaimer-content">
      <h2>户外活动风险告知书</h2>
      
      <div class="content-text">
        <p>1. 户外活动存在一定的风险性和不可预知性，请充分了解活动内容和风险后再报名参加。</p>
        <p>2. 参加者应确保自身身体状况适合参加本次活动，如有心脏病、高血压等疾病请提前告知并谨慎报名。</p>
        <p>3. 请严格按照活动要求准备必要的装备和物品。</p>
        <p>4. 活动过程中请遵守活动纪律，听从领队安排，切勿擅自行动。</p>
        <p>5. 如遇恶劣天气或其他不可抗力因素，组织方有权取消或调整活动。</p>
        <p>6. 活动发生意外时，组织方会尽力提供帮助，但不承担法律责任。</p>
        <p>7. 报名成功即表示您已充分理解并同意以上条款。</p>
      </div>
    </div>
    
    <div class="bottom-section">
      <van-button
        round
        block
        type="primary"
        size="large"
        @click="$router.back()"
      >
        我已了解
      </van-button>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped lang="scss">
.disclaimer {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.disclaimer-content {
  flex: 1;
  padding: 16px;
  background: #fff;
  margin: 10px;
  border-radius: 8px;
  
  h2 {
    text-align: center;
    margin-bottom: 20px;
    font-size: 18px;
  }
  
  .content-text {
    line-height: 2;
    font-size: 14px;
    color: #666;
  }
}

.bottom-section {
  padding: 16px;
}
</style>
