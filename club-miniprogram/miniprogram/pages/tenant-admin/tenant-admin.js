// pages/tenant-admin/tenant-admin.js
const app = getApp()

Page({
  data: {
    tenantId: '',
    activeTab: 'workbench',
    tabs: [
      { key: 'workbench', label: '工作台' },
      { key: 'enrollments', label: '报名' },
      { key: 'members', label: '会员' },
      { key: 'settings', label: '设置' }
    ],
    enrollments: [],
    groupedEnrollments: [],
    visibleEnrollmentGroups: [],
    enrollmentFilter: 'all',
    enrollmentFilters: [
      { key: 'all', label: '全部' },
      { key: 'pending', label: '待跟进' },
      { key: 'waiting_signature', label: '待签署' },
      { key: 'signed', label: '已签署' }
    ],
    enrollmentKeyword: '',
    rawMemberships: [],
    memberships: [],
    membershipStats: {
      total: 0,
      active: 0,
      expiring: 0,
      expired: 0
    },
    memberFilter: 'all',
    memberFilterOptions: [
      { key: 'all', label: '全部' },
      { key: 'active', label: '有效' },
      { key: 'expiring', label: '将到期' },
      { key: 'expired', label: '已过期' }
    ],
    memberKeyword: '',
    stats: {
      total: 0,
      pending: 0,
      waitingSignature: 0,
      signed: 0,
      today: 0,
      fields: 0,
      latestTime: '--'
    },
    todoItems: [],
    recentEnrollments: [],
    inviteLink: '',
    inviteToken: '',
    inviteReady: false,
    exportingGroupKey: '',
    showDetailModal: false,
    currentEnrollment: null,
    enrollmentFields: [],
    currentAgreement: null,
    showAgreementModal: false
  },

  async onLoad() {
    await app.initUserIdentity()

    const tenantId = app.getCurrentTenantId()
    if (!app.globalData.isTenantAdmin && !app.globalData.isSuperAdmin) {
      wx.showToast({ title: '无权限访问', icon: 'none' })
      setTimeout(() => wx.navigateBack(), 1200)
      return
    }

    this.setData({ tenantId })
    wx.showShareMenu({ withShareTicket: true, menus: ['shareAppMessage'] })

    await this.loadEnrollmentFields()
    await Promise.all([
      this.loadEnrollments(),
      this.loadMemberships()
    ])
  },

  onPullDownRefresh() {
    Promise.all([
      this.loadEnrollmentFields(),
      this.loadEnrollments(),
      this.loadMemberships()
    ]).finally(() => wx.stopPullDownRefresh())
  },

  switchTab(e) {
    const key = e.currentTarget.dataset.key
    if (key) {
      this.setData({ activeTab: key })
    }
  },

  async loadEnrollmentFields() {
    try {
      const fields = await app.getEnrollmentFields(this.data.tenantId)
      this.setData({
        enrollmentFields: fields,
        'stats.fields': Array.isArray(fields) ? fields.length : 0
      })
    } catch (err) {
      console.error('load enrollment fields failed:', err)
    }
  },

  async loadEnrollments() {
    try {
      wx.showLoading({ title: '加载报名...' })
      const result = await wx.cloud.callFunction({
        name: 'getTenantEnrollments',
        data: { tenantId: this.data.tenantId }
      })

      if (!result.result || !result.result.success) {
        throw new Error(result.result?.error || '报名加载失败')
      }

      const enrollments = (result.result.data || []).map(item => this.normalizeEnrollment(item))
      const groupedEnrollments = this.groupEnrollments(enrollments)
      const stats = this.buildStats(enrollments, groupedEnrollments)

      this.setData({
        enrollments,
        groupedEnrollments,
        stats,
        todoItems: this.buildTodoItems(stats),
        recentEnrollments: enrollments.slice(0, 5)
      }, () => this.applyEnrollmentFilters())
      wx.hideLoading()
    } catch (err) {
      wx.hideLoading()
      console.error('load enrollments failed:', err)
      wx.showToast({ title: err.message || '报名加载失败', icon: 'none' })
    }
  },

  normalizeEnrollment(item) {
    const agreementStatus = String(item.agreementStatus || '').trim()
    const status = String(item.status || 'pending').trim()
    const createdAt = item.createdAt || item.createTime
    const phone = item.phone || item.telephone || ''
    const displayFields = this.extractDisplayFields(item)
    const agreementText = agreementStatus === 'signed'
      ? '协议已签'
      : agreementStatus === 'waiting_signature'
        ? '待签协议'
        : '无需协议'

    return {
      ...item,
      status,
      agreementStatus,
      phone,
      createTimeStr: this.formatTime(createdAt),
      statusText: this.getEnrollmentStatusText(status),
      agreementText,
      displayFields,
      applicantName: item.name || displayFields[0]?.value || '未填写姓名',
      participantCount: Number(item.participantCount || 1)
    }
  },

  buildStats(enrollments, groups) {
    const todayKey = this.formatDateKey(new Date())
    const latest = enrollments[0]
    return {
      total: enrollments.length,
      pending: enrollments.filter(item => item.status === 'pending').length,
      waitingSignature: enrollments.filter(item => item.agreementStatus === 'waiting_signature').length,
      signed: enrollments.filter(item => item.agreementStatus === 'signed').length,
      today: enrollments.filter(item => this.formatDateKey(this.toDate(item.createdAt || item.createTime)) === todayKey).length,
      fields: this.data.enrollmentFields.length,
      activities: groups.length,
      latestTime: latest ? latest.createTimeStr : '--'
    }
  },

  buildTodoItems(stats) {
    return [
      {
        key: 'pending',
        title: '待确认报名',
        value: stats.pending,
        desc: '建议当天完成电话或微信确认',
        tab: 'enrollments',
        filter: 'pending'
      },
      {
        key: 'signature',
        title: '待签署协议',
        value: stats.waitingSignature,
        desc: '需要提醒用户完成电子签名',
        tab: 'enrollments',
        filter: 'waiting_signature'
      },
      {
        key: 'member',
        title: '将到期会员',
        value: this.data.membershipStats.expiring || 0,
        desc: '可提前沟通续期',
        tab: 'members',
        memberFilter: 'expiring'
      }
    ]
  },

  refreshTodoWithMemberships() {
    this.setData({
      todoItems: this.buildTodoItems(this.data.stats)
    })
  },

  getEnrollmentStatusText(status) {
    const map = {
      pending: '待跟进',
      approved: '已确认',
      completed: '已完成',
      cancelled: '已取消',
      rejected: '已拒绝'
    }
    return map[status] || '待跟进'
  },

  changeEnrollmentFilter(e) {
    const filter = e.currentTarget.dataset.filter
    this.setData({ enrollmentFilter: filter || 'all' }, () => this.applyEnrollmentFilters())
  },

  onEnrollmentKeywordInput(e) {
    this.setData({ enrollmentKeyword: e.detail.value }, () => this.applyEnrollmentFilters())
  },

  clearEnrollmentKeyword() {
    this.setData({ enrollmentKeyword: '' }, () => this.applyEnrollmentFilters())
  },

  applyEnrollmentFilters() {
    const filter = this.data.enrollmentFilter
    const keyword = String(this.data.enrollmentKeyword || '').trim().toLowerCase()

    const visibleEnrollmentGroups = (this.data.groupedEnrollments || []).map(group => {
      const enrollments = group.enrollments.filter(item => {
        const matchFilter = filter === 'all'
          || item.status === filter
          || item.agreementStatus === filter
        const matchKeyword = !keyword || [
          item.applicantName,
          item.phone,
          item.postTitle,
          item.categoryName
        ].some(value => String(value || '').toLowerCase().includes(keyword))
        return matchFilter && matchKeyword
      })
      return {
        ...group,
        enrollments,
        visibleCount: enrollments.length
      }
    }).filter(group => group.enrollments.length > 0)

    this.setData({ visibleEnrollmentGroups })
  },

  openTodo(e) {
    const item = e.currentTarget.dataset.item
    if (!item) return
    const patch = { activeTab: item.tab || 'workbench' }
    if (item.filter) patch.enrollmentFilter = item.filter
    if (item.memberFilter) patch.memberFilter = item.memberFilter
    this.setData(patch, () => {
      this.applyEnrollmentFilters()
      if (item.memberFilter) this.loadMemberships()
    })
  },

  groupEnrollments(enrollments) {
    const groups = {}
    enrollments.forEach(item => {
      const groupKey = String(item.postId || item.postTitle || item._id)
      if (!groups[groupKey]) {
        groups[groupKey] = {
          groupKey,
          postId: item.postId || '',
          postTitle: item.postTitle || '未关联活动',
          categoryName: item.categoryName || '',
          enrollments: [],
          expanded: true
        }
      }
      groups[groupKey].enrollments.push(item)
    })
    return Object.values(groups).map(group => ({
      ...group,
      pendingCount: group.enrollments.filter(item => item.status === 'pending').length,
      waitingSignatureCount: group.enrollments.filter(item => item.agreementStatus === 'waiting_signature').length,
      signedCount: group.enrollments.filter(item => item.agreementStatus === 'signed').length
    }))
  },

  toggleEnrollmentGroup(e) {
    const groupKey = String(e.currentTarget.dataset.groupKey || '')
    const groupedEnrollments = this.data.groupedEnrollments.map(item => (
      String(item.groupKey) === groupKey ? { ...item, expanded: !item.expanded } : item
    ))
    this.setData({ groupedEnrollments }, () => this.applyEnrollmentFilters())
  },

  extractDisplayFields(item) {
    const systemFields = [
      '_id', '_openid', 'openId', 'tenantId', 'postId', 'categoryId', 'categoryName',
      'postTitle', 'createTime', 'createdAt', 'updatedAt', 'status', 'agreementStatus',
      'employeeId', 'fieldSnapshot', 'avatarUrl', 'nickName', 'source'
    ]
    const fieldLabels = {
      name: '姓名',
      phone: '手机号',
      telephone: '手机号',
      email: '邮箱',
      participantCount: '参与人数',
      message: '备注',
      remark: '备注',
      emergencyContact: '紧急联系人',
      emergencyPhone: '紧急联系电话'
    }

    return Object.keys(item || {})
      .filter(key => !systemFields.includes(key))
      .filter(key => item[key] !== undefined && item[key] !== null && item[key] !== '')
      .map(key => ({
        key,
        label: fieldLabels[key] || key,
        value: item[key]
      }))
  },

  async loadMemberships() {
    try {
      const result = await wx.cloud.callFunction({
        name: 'getTenantMemberships',
        data: {
          tenantId: this.data.tenantId,
          filter: this.data.memberFilter
        }
      })
      if (!result.result || !result.result.success) {
        throw new Error(result.result?.error || '会员加载失败')
      }
      const rawMemberships = result.result.data || []
      this.setData({
        rawMemberships,
        memberships: this.filterMembershipsByKeyword(rawMemberships, this.data.memberKeyword),
        membershipStats: result.result.stats || { total: 0, active: 0, expiring: 0, expired: 0 }
      }, () => this.refreshTodoWithMemberships())
    } catch (err) {
      console.error('load memberships failed:', err)
      wx.showToast({ title: '会员加载失败', icon: 'none' })
    }
  },

  changeMemberFilter(e) {
    const filter = e.currentTarget.dataset.filter
    if (!filter || filter === this.data.memberFilter) return
    this.setData({ memberFilter: filter }, () => this.loadMemberships())
  },

  onMemberKeywordInput(e) {
    const memberKeyword = e.detail.value
    this.setData({
      memberKeyword,
      memberships: this.filterMembershipsByKeyword(this.data.rawMemberships, memberKeyword)
    })
  },

  clearMemberKeyword() {
    this.setData({
      memberKeyword: '',
      memberships: this.filterMembershipsByKeyword(this.data.rawMemberships, '')
    })
  },

  filterMembershipsByKeyword(list, keyword) {
    const normalizedKeyword = String(keyword || '').trim().toLowerCase()
    if (!normalizedKeyword) return Array.isArray(list) ? list : []
    return (Array.isArray(list) ? list : []).filter(item => [
      item.displayName,
      item.displayPhone,
      item.levelName,
      item.latestPostTitle,
      item.openIdText
    ].some(value => String(value || '').toLowerCase().includes(normalizedKeyword)))
  },

  async manageMembership(e) {
    const membershipId = e.currentTarget.dataset.id
    const action = e.currentTarget.dataset.action
    const item = e.currentTarget.dataset.item
    if (!membershipId || !action) return

    const actionText = action === 'renew' ? '续期' : '设为失效'
    const confirmed = await new Promise(resolve => {
      wx.showModal({
        title: `确认${actionText}`,
        content: `确定要为「${item?.displayName || '该会员'}」${actionText}吗？`,
        success: res => resolve(!!res.confirm),
        fail: () => resolve(false)
      })
    })
    if (!confirmed) return

    try {
      wx.showLoading({ title: '处理中...' })
      const result = await wx.cloud.callFunction({
        name: 'manageTenantMembership',
        data: {
          tenantId: this.data.tenantId,
          membershipId,
          action
        }
      })
      wx.hideLoading()
      if (!result.result || !result.result.success) {
        throw new Error(result.result?.error || '操作失败')
      }
      wx.showToast({ title: result.result.message || '操作成功', icon: 'success' })
      this.loadMemberships()
    } catch (err) {
      wx.hideLoading()
      wx.showToast({ title: err.message || '操作失败', icon: 'none' })
    }
  },

  async updateEnrollmentStatus(e) {
    const enrollmentId = e.currentTarget.dataset.id
    const status = e.currentTarget.dataset.status
    const actionTextMap = {
      approved: '确认报名',
      completed: '标记完成',
      cancelled: '取消报名'
    }
    const actionText = actionTextMap[status] || '更新状态'

    if (!enrollmentId || !status) return

    const confirmed = await new Promise(resolve => {
      wx.showModal({
        title: actionText,
        content: '确认后会同步更新这条报名记录的处理状态。',
        success: res => resolve(!!res.confirm),
        fail: () => resolve(false)
      })
    })
    if (!confirmed) return

    try {
      wx.showLoading({ title: '更新中...' })
      const result = await wx.cloud.callFunction({
        name: 'manageEnrollmentStatus',
        data: {
          tenantId: this.data.tenantId,
          enrollmentId,
          status
        }
      })
      wx.hideLoading()
      if (!result.result || !result.result.success) {
        throw new Error(result.result?.error || '状态更新失败')
      }
      wx.showToast({ title: '已更新', icon: 'success' })
      this.loadEnrollments()
    } catch (err) {
      wx.hideLoading()
      wx.showToast({ title: err.message || '状态更新失败', icon: 'none' })
    }
  },

  async exportEnrollments(e) {
    const group = e?.currentTarget?.dataset?.group
    const groupKey = String(group?.groupKey || '')
    if (!groupKey || this.data.exportingGroupKey) return

    try {
      this.setData({ exportingGroupKey: groupKey })
      wx.showLoading({ title: '导出中...' })
      const result = await wx.cloud.callFunction({
        name: 'exportTenantEnrollments',
        data: {
          tenantId: this.data.tenantId,
          postId: group.postId || '',
          postTitle: group.postTitle || '',
          groupKey
        }
      })
      if (!result.result || !result.result.success || !result.result.fileID) {
        throw new Error(result.result?.error || '导出失败')
      }
      const tempUrlResult = await wx.cloud.getTempFileURL({ fileList: [result.result.fileID] })
      const fileInfo = tempUrlResult.fileList && tempUrlResult.fileList[0]
      if (!fileInfo || fileInfo.status !== 0 || !fileInfo.tempFileURL) {
        throw new Error('获取下载链接失败')
      }
      const downloadResult = await this.downloadTempFile(fileInfo.tempFileURL)
      if (downloadResult.statusCode !== 200 || !downloadResult.tempFilePath) {
        throw new Error('下载导出文件失败')
      }
      wx.hideLoading()
      await this.openExportDocument(downloadResult.tempFilePath)
    } catch (err) {
      wx.hideLoading()
      wx.showToast({ title: err.message || '导出失败', icon: 'none' })
    } finally {
      this.setData({ exportingGroupKey: '' })
    }
  },

  downloadTempFile(url) {
    return new Promise((resolve, reject) => {
      wx.downloadFile({ url, success: resolve, fail: reject })
    })
  },

  openExportDocument(filePath) {
    return new Promise((resolve, reject) => {
      wx.openDocument({ filePath, fileType: 'xlsx', showMenu: true, success: resolve, fail: reject })
    })
  },

  viewDetail(e) {
    this.setData({
      currentEnrollment: e.currentTarget.dataset.item,
      showDetailModal: true
    })
  },

  closeDetailModal() {
    this.setData({ showDetailModal: false, currentEnrollment: null })
  },

  async viewAgreement(e) {
    const enrollment = e.currentTarget.dataset.item
    if (!enrollment?._id) return
    try {
      wx.showLoading({ title: '加载协议...' })
      const result = await wx.cloud.callFunction({
        name: 'getEnrollmentAgreement',
        data: {
          tenantId: enrollment.tenantId || this.data.tenantId,
          enrollmentId: enrollment._id
        }
      })
      wx.hideLoading()
      if (!result.result || !result.result.success || !result.result.data) {
        wx.showToast({ title: '暂无协议', icon: 'none' })
        return
      }
      const agreement = result.result.data
      if (agreement.signature && agreement.signature.startsWith('cloud://')) {
        const tempUrlResult = await wx.cloud.getTempFileURL({ fileList: [agreement.signature] })
        if (tempUrlResult.fileList?.[0]?.status === 0) {
          agreement.signatureTempUrl = tempUrlResult.fileList[0].tempFileURL
        }
      }
      this.setData({ currentAgreement: agreement, showAgreementModal: true })
    } catch (err) {
      wx.hideLoading()
      wx.showToast({ title: '协议加载失败', icon: 'none' })
    }
  },

  closeAgreementModal() {
    this.setData({ showAgreementModal: false, currentAgreement: null })
  },

  goToFieldConfig() {
    wx.navigateTo({ url: '/pages/field-config/field-config' })
  },

  async generateInviteLink() {
    const tenantId = this.data.tenantId
    if (!tenantId) {
      wx.showToast({ title: '缺少俱乐部信息', icon: 'none' })
      return
    }
    try {
      wx.showLoading({ title: '生成中...' })
      const result = await wx.cloud.callFunction({
        name: 'createAdminInvite',
        data: { tenantId }
      })
      wx.hideLoading()
      if (!result.result || !result.result.success || !result.result.token) {
        throw new Error(result.result?.message || '生成邀请失败')
      }
      const inviteToken = result.result.token
      const inviteLink = `/pages/index/index?tenantId=${tenantId}&bindAdmin=true&inviteToken=${inviteToken}`
      this.setData({ inviteToken, inviteLink, inviteReady: true })
      wx.navigateTo({
        url: `/pages/admin-invite/admin-invite?tenantId=${encodeURIComponent(tenantId)}&inviteToken=${inviteToken}&source=tenant-admin`
      })
    } catch (err) {
      wx.hideLoading()
      wx.showToast({ title: err.message || '生成失败', icon: 'none' })
    }
  },

  copyInviteLink() {
    if (!this.data.inviteLink) return
    wx.setClipboardData({
      data: this.data.inviteLink,
      success: () => wx.showToast({ title: '已复制', icon: 'success' })
    })
  },

  clearInviteLink() {
    this.setData({ inviteToken: '', inviteLink: '', inviteReady: false })
  },

  toDate(value) {
    if (!value) return null
    if (value instanceof Date) return value
    if (typeof value.toDate === 'function') return value.toDate()
    if (typeof value.seconds === 'number') return new Date(value.seconds * 1000)
    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? null : date
  },

  formatDateKey(value) {
    const date = this.toDate(value)
    if (!date) return ''
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
  },

  formatTime(value) {
    const date = this.toDate(value)
    if (!date) return ''
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hour = String(date.getHours()).padStart(2, '0')
    const minute = String(date.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day} ${hour}:${minute}`
  },

  preventBubble() {},

  onShareAppMessage() {
    return {
      title: '俱乐部管理工作台',
      path: `/pages/index/index?tenantId=${this.data.tenantId}`
    }
  }
})
