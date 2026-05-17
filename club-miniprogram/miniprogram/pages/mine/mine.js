const app = getApp()

const DEFAULT_AVATAR = 'https://tuanjiansaas-1256002767.cos.ap-chengdu.myqcloud.com/wp-content/uploads/2026/01/touxiang.png'
const USER_PROFILE_STORAGE_KEY = 'userProfile'
const DEFAULT_NICKNAME = '微信用户'

Page({
  data: {
    tenantId: 'default',
    brand: {
      appName: '户外俱乐部',
      slogan: '',
      description: ''
    },
    consultant: null,
    loading: true,
    userProfile: {
      avatarUrl: DEFAULT_AVATAR,
      nickName: DEFAULT_NICKNAME
    },
    isEditingProfile: false,
    draftNickName: DEFAULT_NICKNAME,
    profileActionLabel: '登录',
    userRoleText: '普通用户',
    openIdText: '',
    memberCard: {
      status: 'disabled',
      statusText: '未开放',
      levelName: '俱乐部会员',
      description: '当前俱乐部暂未开放会员功能，可先完善个人资料和报名记录。',
      benefits: ['优先活动通知', '会员专属权益', '个人成长记录'],
      actionText: '暂未开放',
      expiresAtText: '',
      canActivate: false
    },
    enrollmentSummary: {
      total: 0,
      pending: 0,
      approved: 0,
      completed: 0,
      cancelled: 0
    },
    enrollments: [],
    metrics: [],
    primaryMenus: [],
    serviceMenus: [],
    otherMenus: [],
    bottomNavItems: [],
    showSuperAdminBtn: false,
    showClubAdminBtn: false
  },

  async onLoad(options) {
    const tenantId = options?.tenantId ? app.initTenantFromOptions(options) : app.getCurrentTenantId()
    await app.ensureTenantConfigsLoaded()
    await app.initUserIdentity()
    const brand = app.getTenantBrand(tenantId)
    const consultant = await this.getCurrentConsultant(tenantId)
    const centerData = await this.loadMyCenterData(tenantId)
    const userProfile = this.getLocalUserProfile()

    this.setData({
      tenantId,
      brand,
      consultant,
      userProfile,
      draftNickName: userProfile.nickName,
      profileActionLabel: this.hasCompleteProfile(userProfile) ? '修改资料' : '登录',
      userRoleText: this.getUserRoleText(),
      openIdText: this.maskOpenId(centerData.openId),
      memberCard: centerData.membership,
      enrollmentSummary: centerData.summary,
      enrollments: centerData.enrollments,
      loading: false
    })
    this.refreshPageViewModel()
    this.checkAdminStatus()
    this.setData({
      bottomNavItems: this.buildBottomNavItems(tenantId)
    })
  },

  onPullDownRefresh() {
    this.reloadPageData().finally(() => {
      wx.stopPullDownRefresh()
    })
  },

  async reloadPageData() {
    const tenantId = this.data.tenantId || app.getCurrentTenantId()
    this.setData({ loading: true })
    const consultant = await this.getCurrentConsultant(tenantId)
    const centerData = await this.loadMyCenterData(tenantId)

    this.setData({
      consultant,
      userRoleText: this.getUserRoleText(),
      openIdText: this.maskOpenId(centerData.openId),
      memberCard: centerData.membership,
      enrollmentSummary: centerData.summary,
      enrollments: centerData.enrollments,
      loading: false
    })
    this.refreshPageViewModel()
    this.checkAdminStatus()
    this.setData({
      bottomNavItems: this.buildBottomNavItems(tenantId)
    })
  },

  async onShow() {
    await app.initUserIdentity(this.data.tenantId || app.getCurrentTenantId())
    this.checkAdminStatus()
    this.setData({
      bottomNavItems: this.buildBottomNavItems(this.data.tenantId || app.getCurrentTenantId())
    })
  },

  refreshPageViewModel() {
    const memberCard = this.data.memberCard || {}
    const summary = this.data.enrollmentSummary || {}

    const metrics = [
      { key: 'activities', label: '活动次数', value: String(summary.total || 0), unit: '' },
      { key: 'footsteps', label: '我的足迹', value: String(this.data.enrollments.length || 0), unit: '' },
      { key: 'distance', label: '徒步距离', value: '0', unit: 'km' },
      { key: 'elevation', label: '累计爬升', value: '0', unit: 'm' }
    ]

    const primaryMenus = [
      { key: 'profile', icon: '🧾', title: '个人资料', badge: '', highlight: false },
      { key: 'enrollments', icon: '🗂️', title: '报名记录', badge: String(summary.total || 0), highlight: false },
      { key: 'member', icon: '🏷️', title: '专属会员', badge: memberCard.actionText || '', highlight: true },
      { key: 'points', icon: '🎟️', title: '积分兑换', badge: '', highlight: false },
      { key: 'coupon', icon: '🎫', title: '优惠券', badge: '0', highlight: false }
    ]

    const serviceMenus = []

    const otherMenus = [
      { key: 'contact_customer', icon: '🙋', title: '联系客服', badge: '', highlight: false }
    ]

    this.setData({
      metrics,
      primaryMenus,
      serviceMenus,
      otherMenus
    })
  },

  getLocalUserProfile() {
    const cachedProfile = wx.getStorageSync(USER_PROFILE_STORAGE_KEY)
    return {
      avatarUrl: cachedProfile?.avatarUrl || DEFAULT_AVATAR,
      nickName: cachedProfile?.nickName || DEFAULT_NICKNAME
    }
  },

  saveLocalUserProfile(profile) {
    const nextProfile = {
      avatarUrl: profile?.avatarUrl || DEFAULT_AVATAR,
      nickName: profile?.nickName || DEFAULT_NICKNAME
    }
    wx.setStorageSync(USER_PROFILE_STORAGE_KEY, nextProfile)
    this.setData({
      userProfile: nextProfile,
      draftNickName: nextProfile.nickName,
      isEditingProfile: false,
      profileActionLabel: this.hasCompleteProfile(nextProfile) ? '修改资料' : '登录'
    })
  },

  hasCompleteProfile(profile) {
    const avatarUrl = String(profile?.avatarUrl || '').trim()
    const nickName = String(profile?.nickName || '').trim()
    const hasCustomAvatar = !!avatarUrl && avatarUrl !== DEFAULT_AVATAR
    const hasCustomNickName = !!nickName && nickName !== DEFAULT_NICKNAME
    return hasCustomAvatar || hasCustomNickName
  },

  async getCurrentConsultant(tenantId) {
    const tenantConfig = app.getTenantConfig(tenantId)
    const localEmployeeId = wx.getStorageSync('myEmployeeId')
    const defaultEmployeeId = tenantConfig.defaultEmployeeId
    return localEmployeeId
      ? app.getEmployeeById(localEmployeeId)
      : defaultEmployeeId
        ? app.getEmployeeById(defaultEmployeeId)
        : Promise.resolve(app.globalData.defaultConsultant)
  },

  getUserRoleText() {
    if (app.globalData.isSuperAdmin) {
      return '超级管理员'
    }
    if (app.globalData.isTenantAdmin) {
      return '俱乐部管理员'
    }
    return '普通用户'
  },

  buildBottomNavItems(tenantId) {
    const navItems = (app.getTenantBottomNavItems(tenantId) || [])
      .filter(item => item?.key !== 'equipment')
    return navItems.map(item => {
      const normalizedUrl = String(item.url || '').trim()
      let finalUrl = normalizedUrl
      const isActive = item.key === 'mine'

      if (item.key === 'home') {
        finalUrl = this.appendTenantToPageUrl('/pages/index/index?mode=home')
      } else if (item.key === 'function' || normalizedUrl === '__function__') {
        finalUrl = this.appendTenantToPageUrl('/pages/index/index?mode=function')
      } else if (normalizedUrl) {
        if (normalizedUrl.startsWith('/pages/')) {
          finalUrl = this.appendTenantToPageUrl(normalizedUrl)
        }
      }

      return {
        ...item,
        url: finalUrl,
        isActive
      }
    })
  },

  appendTenantToPageUrl(url) {
    if (!url || /^https?:\/\//i.test(url)) {
      return url
    }
    if (url.includes('tenantId=')) {
      return url
    }
    const tenantId = this.data.tenantId || app.getCurrentTenantId()
    const separator = url.includes('?') ? '&' : '?'
    return `${url}${separator}tenantId=${tenantId}`
  },

  handleBottomNavTap(e) {
    const index = Number(e.currentTarget.dataset.index)
    const item = this.data.bottomNavItems[index]
    if (!item) {
      return
    }

    if (item.key === 'mine') {
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 300
      })
      return
    }

    if (item.key === 'equipment') {
      wx.showToast({
        title: '装备商城暂未开放',
        icon: 'none'
      })
      return
    }

    const targetUrl = String(item.url || '').trim()
    if (!targetUrl) {
      return
    }

    if (targetUrl.startsWith('/pages/index/index')) {
      wx.reLaunch({
        url: targetUrl
      })
      return
    }

    if (targetUrl.startsWith('/pages/')) {
      wx.redirectTo({
        url: targetUrl
      })
      return
    }

    if (/^https?:\/\//i.test(targetUrl)) {
      wx.navigateTo({
        url: `/pages/webview/webview?url=${encodeURIComponent(targetUrl)}`
      })
      return
    }
  },

  checkAdminStatus() {
    const isSuperAdmin = app.globalData.isSuperAdmin
    const isTenantAdmin = app.globalData.isTenantAdmin
    this.setData({
      showSuperAdminBtn: !!isSuperAdmin,
      showClubAdminBtn: !!(isSuperAdmin || isTenantAdmin)
    })
  },

  goToSuperAdmin() {
    if (app.globalData.isSuperAdmin) {
      wx.navigateTo({
        url: '/pages/super-admin/super-admin'
      })
    }
  },

  goToClubAdmin() {
    if (app.globalData.isSuperAdmin || app.globalData.isTenantAdmin) {
      wx.navigateTo({
        url: '/pages/tenant-admin/tenant-admin'
      })
    }
  },

  maskOpenId(openId) {
    if (!openId) {
      return '当前账号'
    }
    if (openId.length <= 8) {
      return openId
    }
    return `${openId.slice(0, 4)}****${openId.slice(-4)}`
  },

  formatDateTime(value) {
    if (!value) {
      return ''
    }

    let date = value
    if (value && typeof value === 'object') {
      if (typeof value.toDate === 'function') {
        date = value.toDate()
      } else if (typeof value.seconds === 'number') {
        date = new Date(value.seconds * 1000)
      }
    }

    const finalDate = date instanceof Date ? date : new Date(date)
    if (Number.isNaN(finalDate.getTime())) {
      return ''
    }

    const year = finalDate.getFullYear()
    const month = String(finalDate.getMonth() + 1).padStart(2, '0')
    const day = String(finalDate.getDate()).padStart(2, '0')
    const hour = String(finalDate.getHours()).padStart(2, '0')
    const minute = String(finalDate.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day} ${hour}:${minute}`
  },

  normalizeEnrollments(list) {
    return (Array.isArray(list) ? list : []).map(item => ({
      ...item,
      createdAtText: this.formatDateTime(item.createdAt),
      participantCountText: item.participantCount || 1,
      statusText: item.statusText || '待处理'
    }))
  },

  async loadMyCenterData(tenantId) {
    const defaultResult = {
      openId: await app.getUserOpenId(),
      membership: {
        status: 'disabled',
        statusText: '未开放',
        levelName: '俱乐部会员',
        description: '当前俱乐部暂未开放会员功能，可先完善个人资料和报名记录。',
        benefits: ['优先活动通知', '会员专属权益', '个人成长记录'],
        actionText: '暂未开放',
        expiresAtText: '',
        canActivate: false
      },
      summary: {
        total: 0,
        pending: 0,
        approved: 0,
        completed: 0,
        cancelled: 0
      },
      enrollments: []
    }

    if (!wx.cloud) {
      return defaultResult
    }

    try {
      const result = await wx.cloud.callFunction({
        name: 'getMyCenterData',
        data: {
          tenantId,
          limit: 20
        }
      })

      const data = result.result || {}
      if (!data.success) {
        throw new Error(data.error || '加载失败')
      }

      return {
        openId: data.openId || defaultResult.openId,
        membership: data.membership || defaultResult.membership,
        summary: data.summary || defaultResult.summary,
        enrollments: this.normalizeEnrollments(data.enrollments)
      }
    } catch (err) {
      console.error('加载个人中心失败:', err)
      wx.showToast({
        title: '个人中心加载失败',
        icon: 'none'
      })
      return defaultResult
    }
  },

  handleChooseAvatar(e) {
    const avatarUrl = e.detail.avatarUrl
    if (!avatarUrl) {
      return
    }

    const saveAvatar = (finalAvatarUrl) => {
      const nextProfile = {
        ...this.data.userProfile,
        avatarUrl: finalAvatarUrl
      }

      wx.setStorageSync(USER_PROFILE_STORAGE_KEY, nextProfile)
      this.setData({
        userProfile: nextProfile,
        isEditingProfile: true,
        profileActionLabel: this.hasCompleteProfile(nextProfile) ? '修改资料' : '登录'
      })
    }

    wx.saveFile({
      tempFilePath: avatarUrl,
      success: (res) => saveAvatar(res.savedFilePath || avatarUrl),
      fail: () => saveAvatar(avatarUrl)
    })
  },

  handleNicknameInput(e) {
    this.setData({
      draftNickName: String(e.detail.value || '')
    })
  },

  handleNicknameBlur(e) {
    const nickName = String(e.detail.value || '').trim() || DEFAULT_NICKNAME
    this.setData({
      draftNickName: nickName
    })
  },

  handleSaveProfile() {
    const nickName = String(this.data.draftNickName || '').trim() || DEFAULT_NICKNAME
    this.saveLocalUserProfile({
      ...this.data.userProfile,
      nickName
    })
    wx.showToast({
      title: '资料已保存',
      icon: 'success'
    })
  },

  handleCancelProfileEdit() {
    this.setData({
      isEditingProfile: false,
      draftNickName: this.data.userProfile.nickName || DEFAULT_NICKNAME
    })
  },

  async handleMembershipAction() {
    const memberCard = this.data.memberCard || {}

    if (!memberCard.canActivate) {
      wx.showToast({
        title: memberCard.actionText || '暂未开放',
        icon: 'none'
      })
      return
    }

    if (!wx.cloud) {
      wx.showToast({
        title: '当前环境不支持会员开通',
        icon: 'none'
      })
      return
    }

    wx.showLoading({
      title: memberCard.status === 'active' ? '续期中...' : '开通中...'
    })

    try {
      const result = await wx.cloud.callFunction({
        name: 'activateMembership',
        data: {
          tenantId: this.data.tenantId || app.getCurrentTenantId()
        }
      })

      const data = result.result || {}
      if (!data.success) {
        throw new Error(data.error || '会员操作失败')
      }

      wx.hideLoading()
      wx.showToast({
        title: data.message || '操作成功',
        icon: 'success'
      })
      await this.reloadPageData()
    } catch (err) {
      console.error('会员操作失败:', err)
      wx.hideLoading()
      wx.showToast({
        title: err.message || '操作失败',
        icon: 'none'
      })
    }
  },

  showMembershipNotice() {
    wx.showToast({
      title: '会员功能开发中',
      icon: 'none'
    })
  },

  refreshMyCenter() {
    this.reloadPageData()
  },

  handleProfileAction() {
    this.setData({
      isEditingProfile: true,
      draftNickName: this.data.userProfile.nickName || DEFAULT_NICKNAME
    })
  },

  handleMenuItemTap(e) {
    const key = e.currentTarget.dataset.key

    if (!key) {
      return
    }

    if (key === 'profile') {
      this.handleProfileAction()
      return
    }

    if (key === 'enrollments') {
      const tenantId = this.data.tenantId || app.getCurrentTenantId()
      wx.navigateTo({
        url: `/pages/enrollments/enrollments?tenantId=${tenantId}`
      })
      return
    }

    if (key === 'member') {
      this.handleMembershipAction()
      return
    }

    if (key === 'contact_customer') {
      this.callConsultant()
      return
    }

    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    })
  },

  callConsultant() {
    const phone = this.data.consultant?.phone || app.globalData.phone
    wx.makePhoneCall({
      phoneNumber: phone
    })
  },

  goToContact() {
    const tenantId = this.data.tenantId || app.getCurrentTenantId()
    wx.navigateTo({
      url: `/pages/contact/contact?tenantId=${tenantId}`
    })
  }
})
