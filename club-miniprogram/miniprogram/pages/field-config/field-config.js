// pages/field-config/field-config.js
const app = getApp()

Page({
  data: {
    tenantId: 'default',
    fields: [],
    agreementContent: '',
    agreementPreview: '',
    membershipConfig: {
      enabled: false,
      levelName: '俱乐部年度会员',
      description: '开通后可获得活动优先通知、会员专属权益与个人活动记录。',
      validityDays: 365,
      benefitsText: '活动优先通知\n会员专属权益\n个人活动记录'
    },
    stats: {
      total: 0,
      required: 0,
      optional: 0,
      hasAgreement: '未配置',
      membershipStatus: '未开放'
    },
    showEditModal: false,
    showAgreementModal: false,
    editingIndex: null,
    editForm: {
      label: '',
      key: '',
      type: 'text',
      typeIndex: 0,
      typeLabel: '文本',
      placeholder: '',
      defaultValue: '',
      required: true
    },
    fieldTypes: [
      { type: 'text', label: '文本' },
      { type: 'tel', label: '手机号' },
      { type: 'email', label: '邮箱' },
      { type: 'number', label: '数字' },
      { type: 'textarea', label: '多行文本' }
    ]
  },

  async onLoad() {
    await app.initUserIdentity()
    const tenantId = app.getCurrentTenantId()
    this.setData({ tenantId })

    if (!app.globalData.isSuperAdmin && !app.globalData.isTenantAdmin) {
      wx.showToast({ title: '无权限访问', icon: 'none' })
      setTimeout(() => wx.navigateBack(), 1200)
      return
    }

    await this.loadFields()
  },

  async loadFields() {
    wx.showLoading({ title: '加载配置...' })
    try {
      const tenantId = this.data.tenantId
      const db = wx.cloud.database()
      const [fieldResult, membershipResult] = await Promise.all([
        db.collection('enrollment_fields').where({ tenantId }).limit(1).get(),
        db.collection('membership_configs').where({ tenantId }).limit(1).get().catch(() => ({ data: [] }))
      ])

      let fields = JSON.parse(JSON.stringify(app.globalData.defaultEnrollmentFields || []))
      let agreementContent = app.globalData.defaultAgreementContent || ''
      let membershipConfig = this.getDefaultMembershipConfig()

      if (fieldResult.data.length > 0) {
        fields = fieldResult.data[0].fields || fields
        agreementContent = fieldResult.data[0].agreementContent || agreementContent
      }
      if (membershipResult.data.length > 0) {
        membershipConfig = this.normalizeMembershipConfig(membershipResult.data[0])
      }

      this.setData({
        fields,
        agreementContent,
        agreementPreview: this.formatAgreementPreview(agreementContent),
        membershipConfig,
        stats: this.buildStats(fields, agreementContent, membershipConfig)
      })
    } catch (err) {
      console.error('load config failed:', err)
      wx.showToast({ title: '配置加载失败', icon: 'none' })
    } finally {
      wx.hideLoading()
    }
  },

  getDefaultMembershipConfig() {
    return {
      enabled: false,
      levelName: '俱乐部年度会员',
      description: '开通后可获得活动优先通知、会员专属权益与个人活动记录。',
      validityDays: 365,
      benefitsText: '活动优先通知\n会员专属权益\n个人活动记录'
    }
  },

  normalizeMembershipConfig(record) {
    const defaultConfig = this.getDefaultMembershipConfig()
    const benefitsText = Array.isArray(record?.benefits) && record.benefits.length > 0
      ? record.benefits.join('\n')
      : defaultConfig.benefitsText
    return {
      enabled: !!record?.enabled,
      levelName: record?.levelName || defaultConfig.levelName,
      description: record?.description || defaultConfig.description,
      validityDays: Number(record?.validityDays) > 0 ? Number(record.validityDays) : defaultConfig.validityDays,
      benefitsText
    }
  },

  buildStats(fields, agreementContent, membershipConfig) {
    const list = Array.isArray(fields) ? fields : []
    const requiredCount = list.filter(item => item.required).length
    return {
      total: list.length,
      required: requiredCount,
      optional: list.length - requiredCount,
      hasAgreement: agreementContent && agreementContent.trim() ? '已配置' : '未配置',
      membershipStatus: membershipConfig?.enabled ? '已开放' : '未开放'
    }
  },

  formatAgreementPreview(content) {
    return String(content || '').trim()
  },

  getFieldTypeLabel(type) {
    const matchedType = this.data.fieldTypes.find(item => item.type === type)
    return matchedType ? matchedType.label : type
  },

  async saveFields() {
    wx.showLoading({ title: '保存中...' })
    try {
      const tenantId = this.data.tenantId
      const db = wx.cloud.database()
      const result = await db.collection('enrollment_fields').where({ tenantId }).limit(1).get()
      const payload = {
        tenantId,
        fields: this.data.fields,
        agreementContent: this.data.agreementContent,
        updatedAt: new Date()
      }
      if (result.data.length > 0) {
        await db.collection('enrollment_fields').doc(result.data[0]._id).update({ data: payload })
      } else {
        await db.collection('enrollment_fields').add({
          data: {
            ...payload,
            createdAt: new Date()
          }
        })
      }
      this.setData({
        stats: this.buildStats(this.data.fields, this.data.agreementContent, this.data.membershipConfig)
      })
      wx.showToast({ title: '已保存', icon: 'success' })
    } catch (err) {
      console.error('save fields failed:', err)
      wx.showToast({ title: '保存失败', icon: 'none' })
    } finally {
      wx.hideLoading()
    }
  },

  showAddModal() {
    this.setData({
      showEditModal: true,
      editingIndex: null,
      editForm: {
        label: '',
        key: '',
        type: 'text',
        typeIndex: 0,
        typeLabel: '文本',
        placeholder: '',
        defaultValue: '',
        required: true
      }
    })
  },

  editField(e) {
    const index = e.currentTarget.dataset.index
    const field = this.data.fields[index]
    const typeIndex = Math.max(0, this.data.fieldTypes.findIndex(item => item.type === field.type))
    this.setData({
      showEditModal: true,
      editingIndex: index,
      editForm: {
        label: field.label,
        key: field.key,
        type: field.type,
        typeIndex,
        typeLabel: this.data.fieldTypes[typeIndex].label,
        placeholder: field.placeholder || '',
        defaultValue: field.defaultValue || '',
        required: !!field.required
      }
    })
  },

  deleteField(e) {
    const index = e.currentTarget.dataset.index
    wx.showModal({
      title: '删除字段',
      content: '删除后，新报名不会再填写这个字段，历史报名仍会保留原数据。',
      success: async res => {
        if (!res.confirm) return
        const fields = [...this.data.fields]
        fields.splice(index, 1)
        this.setData({ fields })
        await this.saveFields()
      }
    })
  },

  closeEditModal() {
    this.setData({ showEditModal: false, editingIndex: null })
  },

  onLabelInput(e) {
    this.setData({ 'editForm.label': e.detail.value })
  },

  onKeyInput(e) {
    this.setData({ 'editForm.key': e.detail.value })
  },

  onTypeChange(e) {
    const typeIndex = Number(e.detail.value)
    const fieldType = this.data.fieldTypes[typeIndex]
    this.setData({
      'editForm.type': fieldType.type,
      'editForm.typeIndex': typeIndex,
      'editForm.typeLabel': fieldType.label
    })
  },

  onPlaceholderInput(e) {
    this.setData({ 'editForm.placeholder': e.detail.value })
  },

  onDefaultValueInput(e) {
    this.setData({ 'editForm.defaultValue': e.detail.value })
  },

  toggleRequired() {
    this.setData({ 'editForm.required': !this.data.editForm.required })
  },

  async saveField() {
    const form = this.data.editForm
    const label = String(form.label || '').trim()
    const key = String(form.key || '').trim()

    if (!label) {
      wx.showToast({ title: '请填写字段名称', icon: 'none' })
      return
    }
    if (!key) {
      wx.showToast({ title: '请填写字段键名', icon: 'none' })
      return
    }
    if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(key)) {
      wx.showToast({ title: '键名只能用字母、数字、下划线，并以字母开头', icon: 'none' })
      return
    }

    const fields = [...this.data.fields]
    const newField = {
      key,
      label,
      type: form.type,
      required: !!form.required,
      placeholder: String(form.placeholder || '').trim(),
      defaultValue: String(form.defaultValue || '').trim()
    }

    if (this.data.editingIndex !== null) {
      fields[this.data.editingIndex] = newField
    } else {
      if (fields.some(item => item.key === key)) {
        wx.showToast({ title: '这个键名已经存在', icon: 'none' })
        return
      }
      fields.push(newField)
    }

    this.setData({
      fields,
      stats: this.buildStats(fields, this.data.agreementContent, this.data.membershipConfig)
    })
    this.closeEditModal()
    await this.saveFields()
  },

  editAgreement() {
    this.setData({ showAgreementModal: true })
  },

  closeAgreementModal() {
    this.setData({ showAgreementModal: false })
  },

  onAgreementInput(e) {
    this.setData({ agreementContent: e.detail.value })
  },

  async saveAgreement() {
    const agreementContent = String(this.data.agreementContent || '').trim()
    if (!agreementContent) {
      wx.showToast({ title: '协议内容不能为空', icon: 'none' })
      return
    }
    this.setData({
      agreementContent,
      agreementPreview: this.formatAgreementPreview(agreementContent),
      stats: this.buildStats(this.data.fields, agreementContent, this.data.membershipConfig)
    })
    await this.saveFields()
    this.closeAgreementModal()
  },

  onMembershipEnabledChange(e) {
    this.setData({ 'membershipConfig.enabled': !!e.detail.value })
  },

  onMembershipLevelInput(e) {
    this.setData({ 'membershipConfig.levelName': e.detail.value })
  },

  onMembershipDescriptionInput(e) {
    this.setData({ 'membershipConfig.description': e.detail.value })
  },

  onMembershipDaysInput(e) {
    this.setData({ 'membershipConfig.validityDays': e.detail.value })
  },

  onMembershipBenefitsInput(e) {
    this.setData({ 'membershipConfig.benefitsText': e.detail.value })
  },

  getMembershipBenefits() {
    return String(this.data.membershipConfig?.benefitsText || '')
      .split('\n')
      .map(item => item.trim())
      .filter(Boolean)
      .slice(0, 6)
  },

  async saveMembershipConfig() {
    const tenantId = this.data.tenantId
    const levelName = String(this.data.membershipConfig.levelName || '').trim()
    const description = String(this.data.membershipConfig.description || '').trim()
    const validityDays = Number(this.data.membershipConfig.validityDays)
    const benefits = this.getMembershipBenefits()

    if (!levelName) {
      wx.showToast({ title: '请填写会员名称', icon: 'none' })
      return
    }
    if (!description) {
      wx.showToast({ title: '请填写会员说明', icon: 'none' })
      return
    }
    if (!Number.isFinite(validityDays) || validityDays <= 0) {
      wx.showToast({ title: '有效期必须大于 0 天', icon: 'none' })
      return
    }
    if (benefits.length === 0) {
      wx.showToast({ title: '至少填写一条会员权益', icon: 'none' })
      return
    }

    wx.showLoading({ title: '保存中...' })
    try {
      const db = wx.cloud.database()
      const result = await db.collection('membership_configs').where({ tenantId }).limit(1).get()
      const payload = {
        tenantId,
        enabled: !!this.data.membershipConfig.enabled,
        levelName,
        description,
        validityDays,
        benefits,
        updatedAt: new Date()
      }
      if (result.data.length > 0) {
        await db.collection('membership_configs').doc(result.data[0]._id).update({ data: payload })
      } else {
        await db.collection('membership_configs').add({
          data: {
            ...payload,
            createdAt: new Date()
          }
        })
      }
      this.setData({
        'membershipConfig.levelName': levelName,
        'membershipConfig.description': description,
        'membershipConfig.validityDays': validityDays,
        'membershipConfig.benefitsText': benefits.join('\n'),
        stats: this.buildStats(this.data.fields, this.data.agreementContent, {
          ...this.data.membershipConfig,
          enabled: payload.enabled
        })
      })
      wx.showToast({ title: '会员配置已保存', icon: 'success' })
    } catch (err) {
      console.error('save membership config failed:', err)
      wx.showToast({ title: '保存失败', icon: 'none' })
    } finally {
      wx.hideLoading()
    }
  },

  preventBubble() {}
})
