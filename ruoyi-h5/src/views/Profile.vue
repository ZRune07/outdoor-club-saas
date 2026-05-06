<template>
  <div class="profile">
    <van-nav-bar title="我的" />
    <div class="content">
      <div class="user-card">
        <div class="user-avatar">
          <van-icon name="user-circle-o" size="64" />
        </div>
        <div class="user-info">
          <h3 class="user-name">游客</h3>
          <p class="user-desc">请登录获取更多功能</p>
        </div>
      </div>
      <van-cell-group inset class="menu-group">
        <van-cell title="我的活动" is-link />
        <van-cell title="我的收藏" is-link />
        <van-cell title="设置" is-link />
        <van-cell title="关于我们" is-link />
      </van-cell-group>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.profile {
  min-height: 100vh;
  background-color: #f7f8fa;
}

.content {
  padding: 16px;
}

.user-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px 16px;
  background-color: #fff;
  border-radius: 8px;
  margin-bottom: 16px;
}

.user-avatar {
  color: #1989fa;
}

.user-info {
  flex: 1;
}

.user-name {
  margin: 0 0 4px 0;
  font-size: 18px;
  font-weight: bold;
  color: #191919;
}

.user-desc {
  margin: 0;
  font-size: 14px;
  color: #969799;
}

.menu-group {
  border-radius: 8px;
}
</style>
