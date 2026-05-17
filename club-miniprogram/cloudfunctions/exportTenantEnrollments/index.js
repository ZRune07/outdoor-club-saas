const cloud = require('wx-server-sdk')
const XLSX = require('xlsx')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

const SUPER_ADMIN_OPENID = 'ox19X48SOa4RevpGfOuKybAXBPSE'

async function isSuperAdmin(openId) {
  if (!openId) {
    return false
  }

  if (openId === SUPER_ADMIN_OPENID) {
    return true
  }

  const result = await db.collection('tenant_admins')
    .where({
      openId,
      role: 'super_admin'
    })
    .get()

  return result.data.length > 0
}

async function isTenantAdmin(openId, tenantId) {
  if (!openId || !tenantId) {
    return false
  }

  const result = await db.collection('tenant_admins')
    .where({
      tenantId,
      openId
    })
    .get()

  return result.data.length > 0
}

function toDate(value) {
  if (!value) {
    return null
  }
  if (value instanceof Date) {
    return value
  }
  if (typeof value.toDate === 'function') {
    return value.toDate()
  }
  if (typeof value.seconds === 'number') {
    return new Date(value.seconds * 1000)
  }
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

function formatDateTime(value) {
  const date = toDate(value)
  if (!date) {
    return ''
  }
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hour = String(date.getHours()).padStart(2, '0')
  const minute = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hour}:${minute}`
}

function getFieldLabel(key) {
  const fieldLabels = {
    name: '姓名',
    phone: '手机号',
    telephone: '手机号',
    email: '邮箱',
    participantCount: '参与人数',
    peopleCount: '参与人数',
    count: '人数',
    message: '备注',
    remark: '备注',
    remarks: '备注',
    idCard: '身份证号',
    idNumber: '身份证号',
    emergencyContact: '紧急联系人',
    emergencyPhone: '紧急联系电话',
    healthStatus: '健康状况',
    allergies: '过敏史'
  }
  return fieldLabels[key] || key
}

function buildHeaderKeys(list) {
  const systemKeys = new Set(['_id', '_openid', 'openId', 'tenantId', 'postId', 'categoryId', 'createdAt', 'updatedAt', 'status', 'employeeId'])
  const orderedKeys = ['name', 'phone', 'participantCount', 'email', 'message']
  const discoveredKeys = new Set()

  list.forEach(item => {
    Object.keys(item || {}).forEach(key => {
      if (!systemKeys.has(key) && item[key] !== undefined && item[key] !== null && item[key] !== '') {
        discoveredKeys.add(key)
      }
    })
  })

  const remainingKeys = Array.from(discoveredKeys).filter(key => !orderedKeys.includes(key))
  return orderedKeys.filter(key => discoveredKeys.has(key)).concat(remainingKeys)
}

function buildRows(list, fieldKeys) {
  return list.map(item => {
    const row = {
      文章名称: item.postTitle || '未关联文章',
      活动分类: item.categoryName || '',
      报名时间: formatDateTime(item.createdAt),
      状态: item.status || 'pending'
    }

    fieldKeys.forEach(key => {
      row[getFieldLabel(key)] = item[key] ?? ''
    })

    return row
  })
}

function sanitizeSheetName(name, index) {
  const fallback = `文章${index + 1}`
  const value = String(name || fallback).replace(/[\\\/\?\*\[\]\:]/g, '').trim()
  return (value || fallback).slice(0, 31)
}

exports.main = async (event) => {
  const wxContext = cloud.getWXContext()
  const openId = wxContext.OPENID
  const tenantId = String(event.tenantId || '').trim()
  const postId = String(event.postId || '').trim()
  const postTitle = String(event.postTitle || '').trim()
  const groupKey = String(event.groupKey || '').trim()

  try {
    const userIsSuperAdmin = await isSuperAdmin(openId)

    if (!userIsSuperAdmin && !tenantId) {
      return {
        success: false,
        error: '俱乐部ID不能为空'
      }
    }

    if (!userIsSuperAdmin) {
      const userIsTenantAdmin = await isTenantAdmin(openId, tenantId)
      if (!userIsTenantAdmin) {
        return {
          success: false,
          error: '没有权限导出报名信息'
        }
      }
    }

    const result = await db.collection('enrollments')
      .where({
        tenantId
      })
      .orderBy('createdAt', 'desc')
      .limit(500)
      .get()

    const allEnrollments = result.data || []
    const enrollments = allEnrollments.filter(item => {
      const itemGroupKey = String(item.postId || item.postTitle || item._id)
      if (postId && String(item.postId || '') === postId) {
        return true
      }
      if (!postId && groupKey && itemGroupKey === groupKey) {
        return true
      }
      if (!postId && !groupKey && postTitle && String(item.postTitle || '') === postTitle) {
        return true
      }
      return !postId && !groupKey && !postTitle
    })

    if (enrollments.length === 0) {
      return {
        success: false,
        error: '当前没有可导出的报名数据'
      }
    }

    const fieldKeys = buildHeaderKeys(enrollments)
    const workbook = XLSX.utils.book_new()
    const targetTitle = postTitle || enrollments[0]?.postTitle || '报名数据'
    const rows = buildRows(enrollments, fieldKeys)
    const sheet = XLSX.utils.json_to_sheet(rows)
    XLSX.utils.book_append_sheet(workbook, sheet, sanitizeSheetName(targetTitle, 0))

    const buffer = XLSX.write(workbook, {
      type: 'buffer',
      bookType: 'xlsx'
    })

    const timestamp = Date.now()
    const safeTitle = String(targetTitle || '报名数据').replace(/[\\\/\?\*\[\]\:\s]+/g, '-')
    const fileName = `${tenantId || 'club'}-${safeTitle || '报名数据'}-${timestamp}.xlsx`
    const cloudPath = `exports/enrollments/${tenantId || 'default'}/${fileName}`
    const uploadResult = await cloud.uploadFile({
      cloudPath,
      fileContent: buffer
    })

    return {
      success: true,
      fileID: uploadResult.fileID,
      fileName
    }
  } catch (err) {
    console.error('导出报名信息失败:', err)
    return {
      success: false,
      error: err.message
    }
  }
}
