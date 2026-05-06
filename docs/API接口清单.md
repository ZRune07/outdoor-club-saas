# 户外运动俱乐部小程序 API接口清单

> **文档版本**：V1.0  
> **编写日期**：2026年5月  
> **文档状态**：初稿

---

## 一、通用规范

### 1.1 统一响应格式

```json
{
  "code": 200,
  "msg": "操作成功",
  "data": { }
}
```

| 状态码 | 说明 |
|-------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未登录或Token过期 |
| 403 | 无权限访问 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

### 1.2 分页请求参数

| 参数名 | 类型 | 必填 | 说明 |
|-------|------|------|------|
| pageNum | Integer | 否 | 页码，默认1 |
| pageSize | Integer | 否 | 每页数量，默认10 |

### 1.3 分页响应格式

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "total": 100,
    "pageNum": 1,
    "pageSize": 10,
    "rows": [ ]
  }
}
```

### 1.4 认证方式

- **认证Header**：`Authorization: Bearer <token>`
- **club_id传递**：通过Token解析获取（前端不传），管理端可手动指定

### 1.5 请求和响应编码

- 字符编码：UTF-8
- Content-Type：`application/json`

---

## 二、接口模块分组

### 2.1 接口统计总览

| 模块 | MVP | V1.0 | V1.5 | V2.0 | 合计 |
|-----|-----|------|------|------|------|
| 认证模块 | 3 | 1 | 0 | 0 | 4 |
| 俱乐部模块 | 2 | 2 | 1 | 0 | 5 |
| 活动模块 | 5 | 4 | 3 | 1 | 13 |
| 报名模块 | 2 | 2 | 2 | 1 | 7 |
| 支付模块 | 4 | 3 | 3 | 1 | 11 |
| 免责签署模块 | 2 | 2 | 1 | 0 | 5 |
| 知识分享模块 | 0 | 0 | 5 | 1 | 6 |
| 个人中心模块 | 2 | 4 | 2 | 1 | 9 |
| 消息模块 | 2 | 2 | 1 | 0 | 5 |
| 管理端-活动 | 5 | 4 | 3 | 1 | 13 |
| 管理端-用户 | 2 | 3 | 2 | 0 | 7 |
| 管理端-财务 | 2 | 3 | 4 | 1 | 10 |
| 管理端-内容 | 0 | 2 | 3 | 1 | 6 |
| 管理端-系统 | 3 | 2 | 1 | 0 | 6 |
| **合计** | **34** | **34** | **31** | **7** | **106** |

---

## 三、认证模块

### 3.1 微信登录

| 项目 | 内容 |
|-----|------|
| **接口名称** | 微信登录 |
| **请求方法** | POST |
| **路径** | `/api/auth/login` |
| **是否需要登录** | 否 |
| **是否需要 club_id** | 是（通过URL参数传递） |

**请求参数**：

| 字段名 | 类型 | 必填 | 说明 |
|-------|------|------|------|
| code | String | 是 | wx.login() 返回的code |
| encryptedData | String | 否 | 微信encryptedData |
| iv | String | 否 | 微信iv |

**响应示例**：

```json
{
  "code": 200,
  "msg": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "userInfo": {
      "user_id": "USER_xxx",
      "nickname": "徒步爱好者",
      "avatar": "https://xxx.com/avatar.jpg",
      "phone": "138****8888",
      "role": "user"
    }
  }
}
```

**优先级**：MVP

---

### 3.2 刷新Token

| 项目 | 内容 |
|-----|------|
| **接口名称** | 刷新Token |
| **请求方法** | POST |
| **路径** | `/api/auth/refresh` |
| **是否需要登录** | 是 |
| **是否需要 club_id** | 否 |

**请求参数**：无

**响应示例**：

```json
{
  "code": 200,
  "msg": "刷新成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**优先级**：MVP

---

### 3.3 退出登录

| 项目 | 内容 |
|-----|------|
| **接口名称** | 退出登录 |
| **请求方法** | POST |
| **路径** | `/api/auth/logout` |
| **是否需要登录** | 是 |
| **是否需要 club_id** | 否 |

**请求参数**：无

**响应示例**：

```json
{
  "code": 200,
  "msg": "退出成功",
  "data": null
}
```

**优先级**：MVP

---

### 3.4 绑定手机号

| 项目 | 内容 |
|-----|------|
| **接口名称** | 绑定手机号 |
| **请求方法** | POST |
| **路径** | `/api/auth/bindPhone` |
| **是否需要登录** | 是 |
| **是否需要 club_id** | 否 |

**请求参数**：

| 字段名 | 类型 | 必填 | 说明 |
|-------|------|------|------|
| code | String | 是 | 微信获取的手机号code |

**响应示例**：

```json
{
  "code": 200,
  "msg": "绑定成功",
  "data": {
    "phone": "138****8888"
  }
}
```

**优先级**：V1.0

---

## 四、俱乐部模块

### 4.1 获取俱乐部配置

| 项目 | 内容 |
|-----|------|
| **接口名称** | 获取俱乐部配置（千人千面） |
| **请求方法** | GET |
| **路径** | `/api/club/config` |
| **是否需要登录** | 否 |
| **是否需要 club_id** | 是 |

**请求参数**：

| 字段名 | 类型 | 必填 | 说明 |
|-------|------|------|------|
| club_id | String | 是 | 俱乐部ID |

**响应示例**：

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "club_id": "CLUB_001",
    "name": "北京徒步者联盟",
    "logo": "https://xxx.com/logo.png",
    "slogan": "走出精彩，感受自然",
    "theme": {
      "primary_color": "#2E7D32",
      "secondary_color": "#81C784"
    },
    "banners": [
      {
        "image_url": "https://xxx.com/banner1.jpg",
        "link_type": "activity",
        "link_value": "ACT_xxx"
      }
    ],
    "contact": {
      "phone": "400-xxx-xxxx",
      "wechat": "outdoor_club_001"
    },
    "features": {
      "enable_knowledge": true,
      "enable_evaluate": false
    }
  }
}
```

**优先级**：MVP

---

### 4.2 获取俱乐部列表

| 项目 | 内容 |
|-----|------|
| **接口名称** | 获取俱乐部列表（共享版入口） |
| **请求方法** | GET |
| **路径** | `/api/clubs` |
| **是否需要登录** | 否 |
| **是否需要 club_id** | 否 |

**请求参数**：

| 字段名 | 类型 | 必填 | 说明 |
|-------|------|------|------|
| pageNum | Integer | 否 | 页码 |
| pageSize | Integer | 否 | 每页数量 |
| keyword | String | 否 | 搜索关键词 |

**响应示例**：

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "total": 100,
    "pageNum": 1,
    "pageSize": 10,
    "rows": [
      {
        "club_id": "CLUB_001",
        "name": "北京徒步者联盟",
        "logo": "https://xxx.com/logo.png",
        "description": "北京最专业的徒步俱乐部",
        "activity_count": 50
      }
    ]
  }
}
```

**优先级**：MVP

---

### 4.3 获取俱乐部详情

| 项目 | 内容 |
|-----|------|
| **接口名称** | 获取俱乐部详情 |
| **请求方法** | GET |
| **路径** | `/api/club/:id` |
| **是否需要登录** | 否 |
| **是否需要 club_id** | 是 |

**响应示例**：

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "club_id": "CLUB_001",
    "name": "北京徒步者联盟",
    "logo": "https://xxx.com/logo.png",
    "description": "北京最专业的徒步俱乐部...",
    "contact": {
      "phone": "400-xxx-xxxx",
      "wechat": "outdoor_club_001"
    },
    "stats": {
      "activity_count": 50,
      "user_count": 1200
    },
    "recent_activities": []
  }
}
```

**优先级**：V1.5

---

## 五、活动模块

### 5.1 获取活动列表

| 项目 | 内容 |
|-----|------|
| **接口名称** | 获取活动列表 |
| **请求方法** | GET |
| **路径** | `/api/activities` |
| **是否需要登录** | 否 |
| **是否需要 club_id** | 是 |

**请求参数**：

| 字段名 | 类型 | 必填 | 说明 |
|-------|------|------|------|
| pageNum | Integer | 否 | 页码 |
| pageSize | Integer | 否 | 每页数量 |
| type | String | 否 | 活动类型：hiking/ climbing/ camping |
| status | String | 否 | 状态：recruiting/ full/ ended |
| keyword | String | 否 | 搜索关键词 |
| startDate | String | 否 | 开始日期（筛选） |
| endDate | String | 否 | 结束日期（筛选） |

**响应示例**：

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "total": 100,
    "pageNum": 1,
    "pageSize": 10,
    "rows": [
      {
        "activity_id": "ACT_xxx",
        "title": "周末徒步 | 白虎涧一日往返",
        "type": "hiking",
        "difficulty": 2,
        "cover_image": "https://xxx.com/cover.jpg",
        "start_time": "2025-03-15 07:00:00",
        "fee": 168.00,
        "insurance_fee": 5.00,
        "max_members": 30,
        "current_members": 18,
        "status": "recruiting",
        "status_label": "招募中",
        "remaining": 12
      }
    ]
  }
}
```

**优先级**：MVP

---

### 5.2 获取活动详情

| 项目 | 内容 |
|-----|------|
| **接口名称** | 获取活动详情 |
| **请求方法** | GET |
| **路径** | `/api/activity/:id` |
| **是否需要登录** | 否 |
| **是否需要 club_id** | 是 |

**响应示例**：

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "activity_id": "ACT_xxx",
    "title": "周末徒步 | 白虎涧一日往返",
    "type": "hiking",
    "difficulty": 2,
    "difficulty_label": "初级",
    "cover_image": "https://xxx.com/cover.jpg",
    "gallery": [
      "https://xxx.com/gallery1.jpg",
      "https://xxx.com/gallery2.jpg"
    ],
    "start_time": "2025-03-15 07:00:00",
    "end_time": "2025-03-15 19:00:00",
    "meeting_point": "惠新西街南口地铁站A口",
    "max_members": 30,
    "backup_members": 10,
    "current_members": 18,
    "status": "recruiting",
    "fee": 168.00,
    "insurance_fee": 5.00,
    "total_fee": 173.00,
    "content": "<p>活动详情HTML...</p>",
    "notices": "<p>注意事项HTML...</p>",
    "leader": {
      "user_id": "USER_leader",
      "nickname": "张三",
      "avatar": "https://xxx.com/avatar.jpg",
      "certified": true
    },
    "is_favorite": false,
    "refund_policy": {
      "rules": [
        {"days": 7, "rate": 100},
        {"days": 3, "rate": 80},
        {"days": 1, "rate": 50},
        {"days": 0, "rate": 0}
      ]
    }
  }
}
```

**优先级**：MVP

---

### 5.3 获取活动行程安排

| 项目 | 内容 |
|-----|------|
| **接口名称** | 获取活动行程安排 |
| **请求方法** | GET |
| **路径** | `/api/activity/:id/itinerary` |
| **是否需要登录** | 否 |
| **是否需要 club_id** | 是 |

**响应示例**：

```json
{
  "code": 200,
  "msg": "success",
  "data": [
    {
      "time": "07:00",
      "title": "集合出发",
      "description": "惠新西街南口地铁站A口集合，清点人数"
    },
    {
      "time": "09:30",
      "title": "到达起点",
      "description": "开始徒步登山"
    },
    {
      "time": "12:00",
      "title": "山顶午餐",
      "description": "自带路餐，补充能量"
    },
    {
      "time": "16:00",
      "title": "下山返程",
      "description": "开始下山"
    },
    {
      "time": "19:00",
      "title": "到达北京",
      "description": "活动结束"
    }
  ]
}
```

**优先级**：V1.0

---

### 5.4 获取集合点列表

| 项目 | 内容 |
|-----|------|
| **接口名称** | 获取集合点列表 |
| **请求方法** | GET |
| **路径** | `/api/activity/:id/meeting-points` |
| **是否需要登录** | 否 |
| **是否需要 club_id** | 是 |

**响应示例**：

```json
{
  "code": 200,
  "msg": "success",
  "data": [
    {
      "point_id": "MP_001",
      "name": "惠新西街南口地铁站A口",
      "arrival_time": "07:00",
      "remaining_seats": 30,
      "latitude": 39.98,
      "longitude": 116.42
    },
    {
      "point_id": "MP_002",
      "name": "芍药居地铁站E口",
      "arrival_time": "07:15",
      "remaining_seats": 20,
      "latitude": 39.96,
      "longitude": 116.44
    }
  ]
}
```

**优先级**：V1.5

---

### 5.5 获取往期活动

| 项目 | 内容 |
|-----|------|
| **接口名称** | 获取往期活动 |
| **请求方法** | GET |
| **路径** | `/api/activities/past` |
| **是否需要登录** | 否 |
| **是否需要 club_id** | 是 |

**请求参数**：

| 字段名 | 类型 | 必填 | 说明 |
|-------|------|------|------|
| pageNum | Integer | 否 | 页码 |
| pageSize | Integer | 否 | 每页数量 |

**响应示例**：同活动列表

**优先级**：V1.5

---

## 六、报名模块

### 6.1 提交报名

| 项目 | 内容 |
|-----|------|
| **接口名称** | 提交报名 |
| **请求方法** | POST |
| **路径** | `/api/registrations` |
| **是否需要登录** | 是 |
| **是否需要 club_id** | 是 |

**请求参数**：

| 字段名 | 类型 | 必填 | 说明 |
|-------|------|------|------|
| activity_id | String | 是 | 活动ID |
| real_name | String | 是 | 真实姓名 |
| phone | String | 是 | 手机号 |
| id_card | String | 是 | 身份证号 |
| emergency_contact | String | 是 | 紧急联系人 |
| emergency_phone | String | 是 | 紧急联系电话 |
| meeting_point | String | 否 | 选择的集合点 |
| remark | String | 否 | 备注 |

**响应示例**：

```json
{
  "code": 200,
  "msg": "报名成功",
  "data": {
    "reg_id": "REG_xxx",
    "order_id": "ORD_xxx",
    "status": "pending_pay",
    "total_amount": 173.00
  }
}
```

**优先级**：MVP

---

### 6.2 获取报名详情

| 项目 | 内容 |
|-----|------|
| **接口名称** | 获取报名详情 |
| **请求方法** | GET |
| **路径** | `/api/registration/:id` |
| **是否需要登录** | 是 |
| **是否需要 club_id** | 是 |

**响应示例**：

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "reg_id": "REG_xxx",
    "activity": {
      "activity_id": "ACT_xxx",
      "title": "周末徒步 | 白虎涧一日往返",
      "start_time": "2025-03-15 07:00:00",
      "meeting_point": "惠新西街南口地铁站A口"
    },
    "real_name": "张三",
    "phone": "138****8888",
    "status": "paid",
    "status_label": "已通过",
    "sign_status": 1,
    "order": {
      "order_id": "ORD_xxx",
      "total_amount": 173.00,
      "pay_time": "2025-03-10 10:30:00"
    }
  }
}
```

**优先级**：MVP

---

### 6.3 取消报名

| 项目 | 内容 |
|-----|------|
| **接口名称** | 取消报名 |
| **请求方法** | POST |
| **路径** | `/api/registration/:id/cancel` |
| **是否需要登录** | 是 |
| **是否需要 club_id** | 是 |

**响应示例**：

```json
{
  "code": 200,
  "msg": "取消成功",
  "data": {
    "refund_amount": 138.40,
    "refund_status": "pending"
  }
}
```

**优先级**：V1.0

---

### 6.4 候补报名

| 项目 | 内容 |
|-----|------|
| **接口名称** | 候补报名 |
| **请求方法** | POST |
| **路径** | `/api/registrations/backup` |
| **是否需要登录** | 是 |
| **是否需要 club_id** | 是 |

**请求参数**：

| 字段名 | 类型 | 必填 | 说明 |
|-------|------|------|------|
| activity_id | String | 是 | 活动ID |
| real_name | String | 是 | 真实姓名 |
| phone | String | 是 | 手机号 |
| id_card | String | 是 | 身份证号 |
| emergency_contact | String | 是 | 紧急联系人 |
| emergency_phone | String | 是 | 紧急联系电话 |

**响应示例**：

```json
{
  "code": 200,
  "msg": "候补报名成功",
  "data": {
    "reg_id": "REG_xxx",
    "position": 5,
    "status": "backup"
  }
}
```

**优先级**：V1.5

---

### 6.5 获取我的报名列表

| 项目 | 内容 |
|-----|------|
| **接口名称** | 获取我的报名列表 |
| **请求方法** | GET |
| **路径** | `/api/registrations` |
| **是否需要登录** | 是 |
| **是否需要 club_id** | 是 |

**请求参数**：

| 字段名 | 类型 | 必填 | 说明 |
|-------|------|------|------|
| pageNum | Integer | 否 | 页码 |
| pageSize | Integer | 否 | 每页数量 |
| status | String | 否 | 状态：pending_pay/ pending_audit/ passed/ ended |

**响应示例**：

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "total": 10,
    "pageNum": 1,
    "pageSize": 10,
    "rows": [
      {
        "reg_id": "REG_xxx",
        "activity": {
          "activity_id": "ACT_xxx",
          "title": "周末徒步 | 白虎涧一日往返",
          "start_time": "2025-03-15 07:00:00",
          "cover_image": "https://xxx.com/cover.jpg"
        },
        "status": "passed",
        "status_label": "已通过",
        "pay_time": "2025-03-10 10:30:00"
      }
    ]
  }
}
```

**优先级**：MVP

---

## 七、支付模块

### 7.1 创建支付订单

| 项目 | 内容 |
|-----|------|
| **接口名称** | 创建支付订单 |
| **请求方法** | POST |
| **路径** | `/api/pay/create` |
| **是否需要登录** | 是 |
| **是否需要 club_id** | 是 |

**请求参数**：

| 字段名 | 类型 | 必填 | 说明 |
|-------|------|------|------|
| reg_id | String | 是 | 报名ID |
| pay_method | String | 否 | 支付方式，默认wechat |

**响应示例**：

```json
{
  "code": 200,
  "msg": "创建成功",
  "data": {
    "order_id": "ORD_xxx",
    "order_no": "WX202503100001",
    "total_amount": 173.00,
    "pay_params": {
      "appId": "wxxxx",
      "timeStamp": "1709959800",
      "nonceStr": "xxxxx",
      "package": "prepay_id=xxxxx",
      "signType": "MD5",
      "paySign": "xxxxx"
    }
  }
}
```

**优先级**：MVP

---

### 7.2 支付回调

| 项目 | 内容 |
|-----|------|
| **接口名称** | 微信支付回调 |
| **请求方法** | POST |
| **路径** | `/api/pay/callback` |
| **是否需要登录** | 否 |
| **是否需要 club_id** | 否 |

**说明**：微信支付成功后，微信服务器回调此接口

**响应要求**：返回 XML 格式的 SUCCESS

```xml
<xml>
  <return_code><![CDATA[SUCCESS]]></return_code>
  <return_msg><![CDATA[OK]]></return_msg>
</xml>
```

**优先级**：MVP

---

### 7.3 查询订单状态

| 项目 | 内容 |
|-----|------|
| **接口名称** | 查询订单状态 |
| **请求方法** | GET |
| **路径** | `/api/order/:id` |
| **是否需要登录** | 是 |
| **是否需要 club_id** | 是 |

**响应示例**：

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "order_id": "ORD_xxx",
    "order_no": "WX202503100001",
    "total_amount": 173.00,
    "status": "paid",
    "status_label": "已支付",
    "pay_time": "2025-03-10 10:30:00",
    "activity": {
      "title": "周末徒步 | 白虎涧一日往返",
      "start_time": "2025-03-15 07:00:00"
    }
  }
}
```

**优先级**：MVP

---

### 7.4 申请退款

| 项目 | 内容 |
|-----|------|
| **接口名称** | 申请退款 |
| **请求方法** | POST |
| **路径** | `/api/refund/apply` |
| **是否需要登录** | 是 |
| **是否需要 club_id** | 是 |

**请求参数**：

| 字段名 | 类型 | 必填 | 说明 |
|-------|------|------|------|
| order_id | String | 是 | 订单ID |
| reason | String | 是 | 退款原因 |
| description | String | 否 | 补充说明 |

**响应示例**：

```json
{
  "code": 200,
  "msg": "申请已提交",
  "data": {
    "refund_id": "REF_xxx",
    "apply_amount": 86.50,
    "status": "applying"
  }
}
```

**优先级**：V1.0

---

### 7.5 退款回调

| 项目 | 内容 |
|-----|------|
| **接口名称** | 微信退款回调 |
| **请求方法** | POST |
| **路径** | `/api/refund/callback` |
| **是否需要登录** | 否 |
| **是否需要 club_id** | 否 |

**说明**：微信退款成功后，微信服务器回调此接口

**优先级**：V1.0

---

### 7.6 获取退款详情

| 项目 | 内容 |
|-----|------|
| **接口名称** | 获取退款详情 |
| **请求方法** | GET |
| **路径** | `/api/refund/:id` |
| **是否需要登录** | 是 |
| **是否需要 club_id** | 是 |

**响应示例**：

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "refund_id": "REF_xxx",
    "order_id": "ORD_xxx",
    "apply_amount": 86.50,
    "actual_amount": 86.50,
    "reason": "时间冲突",
    "status": "completed",
    "apply_time": "2025-03-12 10:00:00",
    "complete_time": "2025-03-13 15:30:00"
  }
}
```

**优先级**：V1.0

---

## 八、免责签署模块

### 8.1 获取免责条款

| 项目 | 内容 |
|-----|------|
| **接口名称** | 获取免责条款 |
| **请求方法** | GET |
| **路径** | `/api/disclaimer` |
| **是否需要登录** | 否 |
| **是否需要 club_id** | 是 |

**请求参数**：

| 字段名 | 类型 | 必填 | 说明 |
|-------|------|------|------|
| activity_id | String | 否 | 活动ID，获取针对该活动的免责条款 |

**响应示例**：

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "version": "v2.0",
    "effective_date": "2025-01-01",
    "content": "<div>免责条款HTML内容...</div>",
    "sections": [
      {
        "title": "一、活动固有风险告知",
        "content": "..."
      },
      {
        "title": "二、健康状况声明",
        "content": "..."
      },
      {
        "title": "三、装备准备确认",
        "content": "..."
      },
      {
        "title": "四、紧急情况授权",
        "content": "..."
      },
      {
        "title": "五、保险信息",
        "content": "..."
      },
      {
        "title": "六、个人信息授权",
        "content": "..."
      }
    ],
    "club_appendix": "<div>俱乐部补充条款...</div>"
  }
}
```

**优先级**：MVP

---

### 8.2 签署免责条款

| 项目 | 内容 |
|-----|------|
| **接口名称** | 签署免责条款 |
| **请求方法** | POST |
| **路径** | `/api/disclaimer/sign` |
| **是否需要登录** | 是 |
| **是否需要 club_id** | 是 |

**请求参数**：

| 字段名 | 类型 | 必填 | 说明 |
|-------|------|------|------|
| activity_id | String | 是 | 活动ID |
| terms_version | String | 是 | 条款版本号 |
| terms_content_hash | String | 是 | 条款内容哈希 |

**服务端记录**：
- 签署时间戳
- 用户IP地址
- UserAgent
- 条款内容哈希

**响应示例**：

```json
{
  "code": 200,
  "msg": "签署成功",
  "data": {
    "sign_id": "SIGN_xxx",
    "sign_time": "2025-03-10 10:25:00"
  }
}
```

**优先级**：MVP

---

### 8.3 获取签署记录

| 项目 | 内容 |
|-----|------|
| **接口名称** | 获取签署记录 |
| **请求方法** | GET |
| **路径** | `/api/disclaimer/sign/record` |
| **是否需要登录** | 是 |
| **是否需要 club_id** | 是 |

**请求参数**：

| 字段名 | 类型 | 必填 | 说明 |
|-------|------|------|------|
| activity_id | String | 否 | 活动ID，筛选特定活动的签署记录 |

**响应示例**：

```json
{
  "code": 200,
  "msg": "success",
  "data": [
    {
      "sign_id": "SIGN_xxx",
      "activity_id": "ACT_xxx",
      "activity_title": "周末徒步 | 白虎涧一日往返",
      "sign_time": "2025-03-10 10:25:00",
      "terms_version": "v2.0",
      "status": "valid",
      "user_ip": "xxx.xxx.xxx.xxx"
    }
  ]
}
```

**优先级**：V1.0

---

### 8.4 检查是否已签署

| 项目 | 内容 |
|-----|------|
| **接口名称** | 检查是否已签署免责条款 |
| **请求方法** | GET |
| **路径** | `/api/disclaimer/check` |
| **是否需要登录** | 是 |
| **是否需要 club_id** | 是 |

**请求参数**：

| 字段名 | 类型 | 必填 | 说明 |
|-------|------|------|------|
| activity_id | String | 是 | 活动ID |

**响应示例**：

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "signed": true,
    "sign_time": "2025-03-10 10:25:00",
    "terms_version": "v2.0",
    "need_resign": false
  }
}
```

**优先级**：V1.5

---

## 九、知识分享模块

### 9.1 获取文章列表

| 项目 | 内容 |
|-----|------|
| **接口名称** | 获取文章列表 |
| **请求方法** | GET |
| **路径** | `/api/articles` |
| **是否需要登录** | 否 |
| **是否需要 club_id** | 是 |

**请求参数**：

| 字段名 | 类型 | 必填 | 说明 |
|-------|------|------|------|
| pageNum | Integer | 否 | 页码 |
| pageSize | Integer | 否 | 每页数量 |
| category | String | 否 | 分类：guide/ equipment/ route/ leader |
| keyword | String | 否 | 搜索关键词 |

**响应示例**：

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "total": 50,
    "pageNum": 1,
    "pageSize": 10,
    "rows": [
      {
        "article_id": "ART_xxx",
        "title": "新手必看：第一次徒步需要准备什么",
        "cover_image": "https://xxx.com/cover.jpg",
        "category": "guide",
        "category_label": "入门指南",
        "author": {
          "user_id": "USER_leader",
          "nickname": "张三",
          "avatar": "https://xxx.com/avatar.jpg",
          "is_leader": true
        },
        "view_count": 1024,
        "created_at": "2025-02-28 10:00:00"
      }
    ]
  }
}
```

**优先级**：V1.5

---

### 9.2 获取文章详情

| 项目 | 内容 |
|-----|------|
| **接口名称** | 获取文章详情 |
| **请求方法** | GET |
| **路径** | `/api/article/:id` |
| **是否需要登录** | 否 |
| **是否需要 club_id** | 是 |

**响应示例**：

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "article_id": "ART_xxx",
    "title": "新手必看：第一次徒步需要准备什么",
    "cover_image": "https://xxx.com/cover.jpg",
    "category": "guide",
    "content": "<p>文章内容HTML...</p>",
    "author": {
      "user_id": "USER_leader",
      "nickname": "张三",
      "avatar": "https://xxx.com/avatar.jpg",
      "is_leader": true,
      "bio": "资深户外领队，10年户外经验"
    },
    "tags": ["新手", "装备", "入门"],
    "view_count": 1024,
    "created_at": "2025-02-28 10:00:00",
    "updated_at": "2025-02-28 10:00:00"
  }
}
```

**优先级**：V1.5

---

### 9.3 获取领队专栏

| 项目 | 内容 |
|-----|------|
| **接口名称** | 获取领队专栏 |
| **请求方法** | GET |
| **路径** | `/api/leaders/:id` |
| **是否需要登录** | 否 |
| **是否需要 club_id** | 是 |

**响应示例**：

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "user_id": "USER_leader",
    "nickname": "张三",
    "avatar": "https://xxx.com/avatar.jpg",
    "bio": "资深户外领队，10年户外经验",
    "certified": true,
    "certified_at": "2024-06-01",
    "stats": {
      "article_count": 25,
      "activity_count": 120,
      "follower_count": 0
    },
    "articles": []
  }
}
```

**优先级**：V1.5

---

### 9.4 收藏文章

| 项目 | 内容 |
|-----|------|
| **接口名称** | 收藏文章 |
| **请求方法** | POST |
| **路径** | `/api/articles/:id/favorite` |
| **是否需要登录** | 是 |
| **是否需要 club_id** | 是 |

**响应示例**：

```json
{
  "code": 200,
  "msg": "收藏成功",
  "data": null
}
```

**优先级**：V1.5

---

### 9.5 取消收藏文章

| 项目 | 内容 |
|-----|------|
| **接口名称** | 取消收藏文章 |
| **请求方法** | DELETE |
| **路径** | `/api/articles/:id/favorite` |
| **是否需要登录** | 是 |
| **是否需要 club_id** | 是 |

**响应示例**：

```json
{
  "code": 200,
  "msg": "取消成功",
  "data": null
}
```

**优先级**：V1.5

---

## 十、个人中心模块

### 10.1 获取用户信息

| 项目 | 内容 |
|-----|------|
| **接口名称** | 获取用户信息 |
| **请求方法** | GET |
| **路径** | `/api/user/info` |
| **是否需要登录** | 是 |
| **是否需要 club_id** | 是 |

**响应示例**：

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "user_id": "USER_xxx",
    "nickname": "徒步爱好者",
    "avatar": "https://xxx.com/avatar.jpg",
    "phone": "138****8888",
    "role": "user",
    "stats": {
      "join_count": 15,
      "favorite_count": 8
    },
    "clubs": [
      {
        "club_id": "CLUB_001",
        "name": "北京徒步者联盟"
      }
    ]
  }
}
```

**优先级**：MVP

---

### 10.2 更新用户信息

| 项目 | 内容 |
|-----|------|
| **接口名称** | 更新用户信息 |
| **请求方法** | PUT |
| **路径** | `/api/user/info` |
| **是否需要登录** | 是 |
| **是否需要 club_id** | 否 |

**请求参数**：

| 字段名 | 类型 | 必填 | 说明 |
|-------|------|------|------|
| nickname | String | 否 | 昵称 |
| avatar | String | 否 | 头像URL |

**响应示例**：

```json
{
  "code": 200,
  "msg": "更新成功",
  "data": null
}
```

**优先级**：V1.0

---

### 10.3 获取我的收藏

| 项目 | 内容 |
|-----|------|
| **接口名称** | 获取我的收藏 |
| **请求方法** | GET |
| **路径** | `/api/favorites` |
| **是否需要登录** | 是 |
| **是否需要 club_id** | 是 |

**请求参数**：

| 字段名 | 类型 | 必填 | 说明 |
|-------|------|------|------|
| pageNum | Integer | 否 | 页码 |
| pageSize | Integer | 否 | 每页数量 |
| type | String | 否 | 类型：activity/ article |

**响应示例**：

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "total": 10,
    "pageNum": 1,
    "pageSize": 10,
    "rows": [
      {
        "favorite_id": "FAV_xxx",
        "type": "activity",
        "activity": {
          "activity_id": "ACT_xxx",
          "title": "周末徒步 | 白虎涧一日往返",
          "cover_image": "https://xxx.com/cover.jpg",
          "fee": 168.00
        },
        "created_at": "2025-03-01 10:00:00"
      }
    ]
  }
}
```

**优先级**：V1.0

---

### 10.4 收藏活动

| 项目 | 内容 |
|-----|------|
| **接口名称** | 收藏活动 |
| **请求方法** | POST |
| **路径** | `/api/activities/:id/favorite` |
| **是否需要登录** | 是 |
| **是否需要 club_id** | 是 |

**响应示例**：

```json
{
  "code": 200,
  "msg": "收藏成功",
  "data": null
}
```

**优先级**：V1.0

---

### 10.5 取消收藏活动

| 项目 | 内容 |
|-----|------|
| **接口名称** | 取消收藏活动 |
| **请求方法** | DELETE |
| **路径** | `/api/activities/:id/favorite` |
| **是否需要登录** | 是 |
| **是否需要 club_id** | 是 |

**响应示例**：

```json
{
  "code": 200,
  "msg": "取消成功",
  "data": null
}
```

**优先级**：V1.0

---

### 10.6 检查收藏状态

| 项目 | 内容 |
|-----|------|
| **接口名称** | 检查收藏状态 |
| **请求方法** | GET |
| **路径** | `/api/activities/:id/favorite/status` |
| **是否需要登录** | 是 |
| **是否需要 club_id** | 是 |

**响应示例**：

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "is_favorite": true
  }
}
```

**优先级**：V1.5

---

## 十一、消息模块

### 11.1 获取消息列表

| 项目 | 内容 |
|-----|------|
| **接口名称** | 获取消息列表 |
| **请求方法** | GET |
| **路径** | `/api/messages` |
| **是否需要登录** | 是 |
| **是否需要 club_id** | 是 |

**请求参数**：

| 字段名 | 类型 | 必填 | 说明 |
|-------|------|------|------|
| pageNum | Integer | 否 | 页码 |
| pageSize | Integer | 否 | 每页数量 |
| type | String | 否 | 类型：system/ order/ activity |

**响应示例**：

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "total": 20,
    "pageNum": 1,
    "pageSize": 10,
    "rows": [
      {
        "message_id": "MSG_xxx",
        "type": "order",
        "title": "报名成功",
        "content": "恭喜！您已成功报名...",
        "is_read": false,
        "created_at": "2025-03-10 10:30:00"
      }
    ],
    "unread_count": 5
  }
}
```

**优先级**：MVP

---

### 11.2 标记消息已读

| 项目 | 内容 |
|-----|------|
| **接口名称** | 标记消息已读 |
| **请求方法** | PUT |
| **路径** | `/api/messages/:id/read` |
| **是否需要登录** | 是 |
| **是否需要 club_id** | 是 |

**响应示例**：

```json
{
  "code": 200,
  "msg": "success",
  "data": null
}
```

**优先级**：MVP

---

### 11.3 标记全部已读

| 项目 | 内容 |
|-----|------|
| **接口名称** | 标记全部已读 |
| **请求方法** | PUT |
| **路径** | `/api/messages/read-all` |
| **是否需要登录** | 是 |
| **是否需要 club_id** | 是 |

**响应示例**：

```json
{
  "code": 200,
  "msg": "success",
  "data": null
}
```

**优先级**：V1.0

---

### 11.4 获取消息未读数

| 项目 | 内容 |
|-----|------|
| **接口名称** | 获取消息未读数 |
| **请求方法** | GET |
| **路径** | `/api/messages/unread-count` |
| **是否需要登录** | 是 |
| **是否需要 club_id** | 是 |

**响应示例**：

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "unread_count": 5
  }
}
```

**优先级**：V1.5

---

## 十二、管理端接口

### 12.1 俱乐部管理

#### 12.1.1 创建俱乐部

| 项目 | 内容 |
|-----|------|
| **接口名称** | 创建俱乐部 |
| **请求方法** | POST |
| **路径** | `/admin/clubs` |
| **是否需要登录** | 是（管理员） |
| **是否需要 club_id** | 否 |

**请求参数**：

| 字段名 | 类型 | 必填 | 说明 |
|-------|------|------|------|
| name | String | 是 | 俱乐部名称 |
| contact_phone | String | 是 | 联系电话 |
| package_type | Integer | 是 | 套餐类型：1=独立版 2=共享版 |

**优先级**：MVP

---

#### 12.1.2 更新俱乐部配置

| 项目 | 内容 |
|-----|------|
| **接口名称** | 更新俱乐部配置 |
| **请求方法** | PUT |
| **路径** | `/admin/club/:id/config` |
| **是否需要登录** | 是（俱乐部管理员） |
| **是否需要 club_id** | 是 |

**请求参数**：

| 字段名 | 类型 | 必填 | 说明 |
|-------|------|------|------|
| name | String | 否 | 俱乐部名称 |
| logo | String | 否 | Logo URL |
| theme | Object | 否 | 主题配置 |
| banners | Array | 否 | Banner配置 |
| features | Object | 否 | 功能开关 |

**优先级**：MVP

---

#### 12.1.3 获取俱乐部列表（管理端）

| 项目 | 内容 |
|-----|------|
| **接口名称** | 获取俱乐部列表（管理端） |
| **请求方法** | GET |
| **路径** | `/admin/clubs` |
| **是否需要登录** | 是（超级管理员） |
| **是否需要 club_id** | 否 |

**请求参数**：

| 字段名 | 类型 | 必填 | 说明 |
|-------|------|------|------|
| pageNum | Integer | 否 | 页码 |
| pageSize | Integer | 否 | 每页数量 |
| status | Integer | 否 | 状态 |
| keyword | String | 否 | 搜索关键词 |

**优先级**：MVP

---

#### 12.1.4 生成小程序码

| 项目 | 内容 |
|-----|------|
| **接口名称** | 生成小程序码 |
| **请求方法** | POST |
| **路径** | `/admin/club/:id/qrcode` |
| **是否需要登录** | 是（俱乐部管理员） |
| **是否需要 club_id** | 是 |

**请求参数**：

| 字段名 | 类型 | 必填 | 说明 |
|-------|------|------|------|
| page | String | 否 | 页面路径 |
| scene | String | 否 | 场景参数 |

**响应示例**：

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "qrcode_url": "https://xxx.com/qrcode.png"
  }
}
```

**优先级**：V1.0

---

### 12.2 活动管理（管理端）

#### 12.2.1 创建活动

| 项目 | 内容 |
|-----|------|
| **接口名称** | 创建活动 |
| **请求方法** | POST |
| **路径** | `/admin/activities` |
| **是否需要登录** | 是（俱乐部管理员） |
| **是否需要 club_id** | 是 |

**请求参数**：

| 字段名 | 类型 | 必填 | 说明 |
|-------|------|------|------|
| title | String | 是 | 活动标题 |
| type | String | 是 | 活动类型 |
| difficulty | Integer | 是 | 难度等级 |
| start_time | String | 是 | 开始时间 |
| end_time | String | 是 | 结束时间 |
| meeting_point | String | 是 | 集合地点 |
| max_members | Integer | 是 | 最大人数 |
| backup_members | Integer | 否 | 候补人数 |
| fee | Decimal | 是 | 活动费用 |
| insurance_fee | Decimal | 否 | 保险费用 |
| cover_image | String | 是 | 封面图 |
| content | String | 是 | 活动详情 |
| notices | String | 否 | 注意事项 |
| refund_policy | Object | 否 | 退款政策 |
| leader_id | String | 否 | 领队ID |
| need_audit | Boolean | 否 | 是否需要审核 |

**优先级**：MVP

---

#### 12.2.2 更新活动

| 项目 | 内容 |
|-----|------|
| **接口名称** | 更新活动 |
| **请求方法** | PUT |
| **路径** | `/admin/activity/:id` |
| **是否需要登录** | 是（俱乐部管理员） |
| **是否需要 club_id** | 是 |

**请求参数**：同创建活动

**优先级**：MVP

---

#### 12.2.3 发布活动

| 项目 | 内容 |
|-----|------|
| **接口名称** | 发布活动 |
| **请求方法** | POST |
| **路径** | `/admin/activity/:id/publish` |
| **是否需要登录** | 是（俱乐部管理员） |
| **是否需要 club_id** | 是 |

**响应示例**：

```json
{
  "code": 200,
  "msg": "发布成功",
  "data": {
    "activity_id": "ACT_xxx",
    "status": "recruiting"
  }
}
```

**优先级**：MVP

---

#### 12.2.4 下架活动

| 项目 | 内容 |
|-----|------|
| **接口名称** | 下架活动 |
| **请求方法** | POST |
| **路径** | `/admin/activity/:id/unpublish` |
| **是否需要登录** | 是（俱乐部管理员） |
| **是否需要 club_id** | 是 |

**响应示例**：

```json
{
  "code": 200,
  "msg": "下架成功",
  "data": null
}
```

**优先级**：MVP

---

#### 12.2.5 删除活动

| 项目 | 内容 |
|-----|------|
| **接口名称** | 删除活动 |
| **请求方法** | DELETE |
| **路径** | `/admin/activity/:id` |
| **是否需要登录** | 是（俱乐部管理员） |
| **是否需要 club_id** | 是 |

**响应示例**：

```json
{
  "code": 200,
  "msg": "删除成功",
  "data": null
}
```

**优先级**：MVP

---

#### 12.2.6 获取活动列表（管理端）

| 项目 | 内容 |
|-----|------|
| **接口名称** | 获取活动列表（管理端） |
| **请求方法** | GET |
| **路径** | `/admin/activities` |
| **是否需要登录** | 是（俱乐部管理员） |
| **是否需要 club_id** | 是 |

**请求参数**：

| 字段名 | 类型 | 必填 | 说明 |
|-------|------|------|------|
| pageNum | Integer | 否 | 页码 |
| pageSize | Integer | 否 | 每页数量 |
| status | String | 否 | 状态 |
| keyword | String | 否 | 搜索关键词 |

**优先级**：MVP

---

#### 12.2.7 获取报名列表（管理端）

| 项目 | 内容 |
|-----|------|
| **接口名称** | 获取报名列表（管理端） |
| **请求方法** | GET |
| **路径** | `/admin/activity/:id/registrations` |
| **是否需要登录** | 是（俱乐部管理员） |
| **是否需要 club_id** | 是 |

**请求参数**：

| 字段名 | 类型 | 必填 | 说明 |
|-------|------|------|------|
| pageNum | Integer | 否 | 页码 |
| pageSize | Integer | 否 | 每页数量 |
| status | String | 否 | 状态 |

**优先级**：MVP

---

#### 12.2.8 审核报名

| 项目 | 内容 |
|-----|------|
| **接口名称** | 审核报名 |
| **请求方法** | POST |
| **路径** | `/admin/registration/:id/audit` |
| **是否需要登录** | 是（俱乐部管理员） |
| **是否需要 club_id** | 是 |

**请求参数**：

| 字段名 | 类型 | 必填 | 说明 |
|-------|------|------|------|
| status | Integer | 是 | 审核状态：2=通过 3=拒绝 |
| reason | String | 否 | 拒绝原因 |

**优先级**：V1.0

---

#### 12.2.9 导出报名表

| 项目 | 内容 |
|-----|------|
| **接口名称** | 导出报名表 |
| **请求方法** | GET |
| **路径** | `/admin/activity/:id/registrations/export` |
| **是否需要登录** | 是（俱乐部管理员） |
| **是否需要 club_id** | 是 |

**响应**：返回 Excel 文件

**优先级**：V1.5

---

#### 12.2.10 复制活动

| 项目 | 内容 |
|-----|------|
| **接口名称** | 复制活动 |
| **请求方法** | POST |
| **路径** | `/admin/activity/:id/clone` |
| **是否需要登录** | 是（俱乐部管理员） |
| **是否需要 club_id** | 是 |

**响应示例**：

```json
{
  "code": 200,
  "msg": "复制成功",
  "data": {
    "new_activity_id": "ACT_yyy"
  }
}
```

**优先级**：V1.5

---

### 12.3 用户管理（管理端）

#### 12.3.1 获取用户列表（管理端）

| 项目 | 内容 |
|-----|------|
| **接口名称** | 获取用户列表（管理端） |
| **请求方法** | GET |
| **路径** | `/admin/users` |
| **是否需要登录** | 是（俱乐部管理员） |
| **是否需要 club_id** | 是 |

**请求参数**：

| 字段名 | 类型 | 必填 | 说明 |
|-------|------|------|------|
| pageNum | Integer | 否 | 页码 |
| pageSize | Integer | 否 | 每页数量 |
| keyword | String | 否 | 搜索关键词 |

**优先级**：MVP

---

#### 12.3.2 获取用户详情（管理端）

| 项目 | 内容 |
|-----|------|
| **接口名称** | 获取用户详情（管理端） |
| **请求方法** | GET |
| **路径** | `/admin/user/:id` |
| **是否需要登录** | 是（俱乐部管理员） |
| **是否需要 club_id** | 是 |

**优先级**：MVP

---

#### 12.3.3 认证领队

| 项目 | 内容 |
|-----|------|
| **接口名称** | 认证领队 |
| **请求方法** | POST |
| **路径** | `/admin/leader/:id/certify` |
| **是否需要登录** | 是（俱乐部管理员） |
| **是否需要 club_id** | 是 |

**请求参数**：

| 字段名 | 类型 | 必填 | 说明 |
|-------|------|------|------|
| bio | String | 否 | 领队简介 |

**响应示例**：

```json
{
  "code": 200,
  "msg": "认证成功",
  "data": null
}
```

**优先级**：V1.0

---

#### 12.3.4 添加到黑名单

| 项目 | 内容 |
|-----|------|
| **接口名称** | 添加到黑名单 |
| **请求方法** | POST |
| **路径** | `/admin/user/:id/blacklist` |
| **是否需要登录** | 是（俱乐部管理员） |
| **是否需要 club_id** | 是 |

**请求参数**：

| 字段名 | 类型 | 必填 | 说明 |
|-------|------|------|------|
| reason | String | 是 | 拉黑原因 |

**优先级**：V1.5

---

#### 12.3.5 移除黑名单

| 项目 | 内容 |
|-----|------|
| **接口名称** | 移除黑名单 |
| **请求方法** | DELETE |
| **路径** | `/admin/user/:id/blacklist` |
| **是否需要登录** | 是（俱乐部管理员） |
| **是否需要 club_id** | 是 |

**优先级**：V1.5

---

### 12.4 财务管理（管理端）

#### 12.4.1 获取订单列表（管理端）

| 项目 | 内容 |
|-----|------|
| **接口名称** | 获取订单列表（管理端） |
| **请求方法** | GET |
| **路径** | `/admin/orders` |
| **是否需要登录** | 是（俱乐部管理员） |
| **是否需要 club_id** | 是 |

**请求参数**：

| 字段名 | 类型 | 必填 | 说明 |
|-------|------|------|------|
| pageNum | Integer | 否 | 页码 |
| pageSize | Integer | 否 | 每页数量 |
| status | Integer | 否 | 订单状态 |
| startDate | String | 否 | 开始日期 |
| endDate | String | 否 | 结束日期 |

**优先级**：MVP

---

#### 12.4.2 获取退款列表（管理端）

| 项目 | 内容 |
|-----|------|
| **接口名称** | 获取退款列表（管理端） |
| **请求方法** | GET |
| **路径** | `/admin/refunds` |
| **是否需要登录** | 是（俱乐部管理员） |
| **是否需要 club_id** | 是 |

**请求参数**：

| 字段名 | 类型 | 必填 | 说明 |
|-------|------|------|------|
| pageNum | Integer | 否 | 页码 |
| pageSize | Integer | 否 | 每页数量 |
| status | Integer | 否 | 退款状态 |

**优先级**：V1.0

---

#### 12.4.3 审核退款

| 项目 | 内容 |
|-----|------|
| **接口名称** | 审核退款 |
| **请求方法** | POST |
| **路径** | `/admin/refund/:id/audit` |
| **是否需要登录** | 是（俱乐部管理员） |
| **是否需要 club_id** | 是 |

**请求参数**：

| 字段名 | 类型 | 必填 | 说明 |
|-------|------|------|------|
| status | Integer | 是 | 审核状态：2=通过 3=拒绝 |
| reason | String | 否 | 拒绝原因 |

**优先级**：V1.0

---

#### 12.4.4 获取账单列表

| 项目 | 内容 |
|-----|------|
| **接口名称** | 获取账单列表 |
| **请求方法** | GET |
| **路径** | `/admin/bills` |
| **是否需要登录** | 是（俱乐部管理员） |
| **是否需要 club_id** | 是 |

**请求参数**：

| 字段名 | 类型 | 必填 | 说明 |
|-------|------|------|------|
| pageNum | Integer | 否 | 页码 |
| pageSize | Integer | 否 | 每页数量 |
| activity_id | String | 否 | 活动ID |

**响应示例**：

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "total": 10,
    "pageNum": 1,
    "pageSize": 10,
    "rows": [
      {
        "bill_id": "BILL_xxx",
        "activity_id": "ACT_xxx",
        "activity_title": "周末徒步 | 白虎涧一日往返",
        "total_amount": 5190.00,
        "platform_amount": 2335.50,
        "club_amount": 2854.50,
        "order_count": 30,
        "profit_sharing_status": "completed",
        "created_at": "2025-03-16 00:00:00"
      }
    ]
  }
}
```

**优先级**：V1.5

---

#### 12.4.5 发起分账

| 项目 | 内容 |
|-----|------|
| **接口名称** | 发起分账 |
| **请求方法** | POST |
| **路径** | `/admin/profit-sharing/发起` |
| **是否需要登录** | 是（俱乐部管理员） |
| **是否需要 club_id** | 是 |

**请求参数**：

| 字段名 | 类型 | 必填 | 说明 |
|-------|------|------|------|
| activity_id | String | 是 | 活动ID |

**响应示例**：

```json
{
  "code": 200,
  "msg": "分账已发起",
  "data": {
    "profit_sharing_id": "PS_xxx",
    "status": "pending"
  }
}
```

**优先级**：V1.5

---

#### 12.4.6 获取分账记录

| 项目 | 内容 |
|-----|------|
| **接口名称** | 获取分账记录 |
| **请求方法** | GET |
| **路径** | `/admin/profit-sharing` |
| **是否需要登录** | 是（俱乐部管理员） |
| **是否需要 club_id** | 是 |

**请求参数**：

| 字段名 | 类型 | 必填 | 说明 |
|-------|------|------|------|
| pageNum | Integer | 否 | 页码 |
| pageSize | Integer | 否 | 每页数量 |

**优先级**：V1.5

---

### 12.5 内容管理（管理端）

#### 12.5.1 创建文章

| 项目 | 内容 |
|-----|------|
| **接口名称** | 创建文章 |
| **请求方法** | POST |
| **路径** | `/admin/articles` |
| **是否需要登录** | 是（俱乐部管理员/领队） |
| **是否需要 club_id** | 是 |

**请求参数**：

| 字段名 | 类型 | 必填 | 说明 |
|-------|------|------|------|
| title | String | 是 | 文章标题 |
| cover_image | String | 是 | 封面图 |
| category | String | 是 | 分类 |
| content | String | 是 | 文章内容 |
| tags | Array | 否 | 标签 |

**优先级**：V1.5

---

#### 12.5.2 更新文章

| 项目 | 内容 |
|-----|------|
| **接口名称** | 更新文章 |
| **请求方法** | PUT |
| **路径** | `/admin/article/:id` |
| **是否需要登录** | 是（俱乐部管理员/领队） |
| **是否需要 club_id** | 是 |

**优先级**：V1.5

---

#### 12.5.3 删除文章

| 项目 | 内容 |
|-----|------|
| **接口名称** | 删除文章 |
| **请求方法** | DELETE |
| **路径** | `/admin/article/:id` |
| **是否需要登录** | 是（俱乐部管理员/领队） |
| **是否需要 club_id** | 是 |

**优先级**：V1.5

---

#### 12.5.4 发布/下架文章

| 项目 | 内容 |
|-----|------|
| **接口名称** | 发布/下架文章 |
| **请求方法** | POST |
| **路径** | `/admin/article/:id/status` |
| **是否需要登录** | 是（俱乐部管理员/领队） |
| **是否需要 club_id** | 是 |

**请求参数**：

| 字段名 | 类型 | 必填 | 说明 |
|-------|------|------|------|
| status | Integer | 是 | 状态：1=发布 2=下架 |

**优先级**：V1.5

---

#### 12.5.5 管理免责条款

| 项目 | 内容 |
|-----|------|
| **接口名称** | 管理免责条款 |
| **请求方法** | PUT |
| **路径** | `/admin/disclaimer` |
| **是否需要登录** | 是（平台管理员） |
| **是否需要 club_id** | 否 |

**请求参数**：

| 字段名 | 类型 | 必填 | 说明 |
|-------|------|------|------|
| version | String | 是 | 版本号 |
| content | String | 是 | 条款内容 |
| effective_date | String | 是 | 生效日期 |

**优先级**：V1.0

---

#### 12.5.6 群发消息

| 项目 | 内容 |
|-----|------|
| **接口名称** | 群发消息 |
| **请求方法** | POST |
| **路径** | `/admin/messages/broadcast` |
| **是否需要登录** | 是（俱乐部管理员） |
| **是否需要 club_id** | 是 |

**请求参数**：

| 字段名 | 类型 | 必填 | 说明 |
|-------|------|------|------|
| title | String | 是 | 消息标题 |
| content | String | 是 | 消息内容 |
| target | String | 是 | 发送目标：all/ participants/ favorites |
| activity_id | String | 否 | 活动ID（针对参与者时需要） |

**优先级**：V1.0

---

### 12.6 系统管理（管理端）

#### 12.6.1 登录

| 项目 | 内容 |
|-----|------|
| **接口名称** | 管理端登录 |
| **请求方法** | POST |
| **路径** | `/admin/auth/login` |
| **是否需要登录** | 否 |
| **是否需要 club_id** | 否 |

**请求参数**：

| 字段名 | 类型 | 必填 | 说明 |
|-------|------|------|------|
| username | String | 是 | 用户名 |
| password | String | 是 | 密码 |

**响应示例**：

```json
{
  "code": 200,
  "msg": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "userInfo": {
      "user_id": "ADMIN_xxx",
      "username": "admin",
      "role": "admin"
    }
  }
}
```

**优先级**：MVP

---

#### 12.6.2 获取当前用户信息

| 项目 | 内容 |
|-----|------|
| **接口名称** | 获取当前用户信息 |
| **请求方法** | GET |
| **路径** | `/admin/auth/info` |
| **是否需要登录** | 是 |
| **是否需要 club_id** | 否 |

**优先级**：MVP

---

#### 12.6.3 退出登录

| 项目 | 内容 |
|-----|------|
| **接口名称** | 退出登录 |
| **请求方法** | POST |
| **路径** | `/admin/auth/logout` |
| **是否需要登录** | 是 |
| **是否需要 club_id** | 否 |

**优先级**：MVP

---

#### 12.6.4 获取菜单列表

| 项目 | 内容 |
|-----|------|
| **接口名称** | 获取菜单列表 |
| **请求方法** | GET |
| **路径** | `/admin/menus` |
| **是否需要登录** | 是 |
| **是否需要 club_id** | 否 |

**优先级**：MVP

---

#### 12.6.5 获取字典数据

| 项目 | 内容 |
|-----|------|
| **接口名称** | 获取字典数据 |
| **请求方法** | GET |
| **路径** | `/admin/dict/:type` |
| **是否需要登录** | 是 |
| **是否需要 club_id** | 是 |

**优先级**：V1.0

---

#### 12.6.6 获取数据统计

| 项目 | 内容 |
|-----|------|
| **接口名称** | 获取数据统计 |
| **请求方法** | GET |
| **路径** | `/admin/statistics` |
| **是否需要登录** | 是（俱乐部管理员） |
| **是否需要 club_id** | 是 |

**响应示例**：

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "today": {
      "visits": 1234,
      "registrations": 56,
      "revenue": 12800.00
    },
    "month": {
      "visits": 34567,
      "registrations": 1234,
      "revenue": 256000.00
    },
    "activities": [
      {
        "activity_id": "ACT_xxx",
        "title": "周末徒步",
        "registration_count": 28,
        "revenue": 4844.00
      }
    ]
  }
}
```

**优先级**：V2.0

---

## 十三、接口统计汇总

### 13.1 按模块统计

| 模块 | MVP | V1.0 | V1.5 | V2.0 | 合计 |
|-----|-----|------|------|------|------|
| 认证模块 | 3 | 1 | 0 | 0 | 4 |
| 俱乐部模块 | 2 | 1 | 1 | 0 | 4 |
| 活动模块 | 2 | 1 | 2 | 1 | 6 |
| 报名模块 | 3 | 2 | 1 | 0 | 6 |
| 支付模块 | 4 | 3 | 1 | 0 | 8 |
| 免责签署模块 | 2 | 2 | 1 | 0 | 5 |
| 知识分享模块 | 0 | 0 | 5 | 0 | 5 |
| 个人中心模块 | 2 | 4 | 1 | 0 | 7 |
| 消息模块 | 2 | 2 | 1 | 0 | 5 |
| 管理端-俱乐部 | 2 | 1 | 0 | 0 | 3 |
| 管理端-活动 | 6 | 3 | 2 | 1 | 12 |
| 管理端-用户 | 2 | 2 | 2 | 0 | 6 |
| 管理端-财务 | 2 | 2 | 4 | 1 | 9 |
| 管理端-内容 | 0 | 2 | 4 | 0 | 6 |
| 管理端-系统 | 3 | 2 | 1 | 0 | 6 |
| **总计** | **35** | **28** | **25** | **3** | **91** |

### 13.2 HTTP方法统计

| 方法 | MVP | V1.0 | V1.5 | V2.0 | 合计 |
|-----|-----|------|------|------|------|
| GET | 16 | 14 | 15 | 2 | 47 |
| POST | 14 | 10 | 7 | 1 | 32 |
| PUT | 3 | 4 | 3 | 0 | 10 |
| DELETE | 2 | 0 | 0 | 0 | 2 |
| **合计** | **35** | **28** | **25** | **3** | **91** |

---

## 十四、接口设计说明

### 14.1 RESTful规范遵循

| 操作 | HTTP方法 | 示例路径 |
|-----|---------|---------|
| 查询列表 | GET | `/api/activities` |
| 查询详情 | GET | `/api/activity/:id` |
| 创建 | POST | `/api/activities` |
| 更新 | PUT | `/api/activity/:id` |
| 删除 | DELETE | `/api/activity/:id` |
| 特定操作 | POST | `/api/activity/:id/publish` |

### 14.2 club_id处理策略

```
┌─────────────────────────────────────────────────────────┐
│                     club_id 处理策略                      │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  C端接口（用户端）                                         │
│  ├── club_id 通过 URL 参数传递                            │
│  ├── 后端从 Token 中解析 club_id 进行校验                  │
│  └── 示例：GET /api/activities?club_id=CLUB_001          │
│                                                          │
│  管理端接口                                               │
│  ├── 超级管理员：可操作所有 club_id                       │
│  ├── 俱乐部管理员：只能操作自己的 club_id                  │
│  └── club_id 可通过请求参数手动指定（超级管理员）          │
│                                                          │
│  多租户隔离                                               │
│  └── 所有业务表包含 club_id 字段                          │
│  └── MyBatis 拦截器自动注入 club_id 条件                  │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### 14.3 微信支付完整流程

```
┌─────────────────────────────────────────────────────────┐
│                   微信支付完整流程                         │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  1. 创建订单                                              │
│     POST /api/pay/create                                 │
│     返回：prepay_id                                       │
│                                                          │
│  2. 调起支付                                              │
│     前端调用 wx.requestPayment()                          │
│                                                          │
│  3. 支付回调                                              │
│     POST /api/pay/callback                               │
│     微信服务器回调，更新订单状态                            │
│                                                          │
│  4. 发送通知                                              │
│     发送微信模板消息/订阅消息                              │
│                                                          │
│  退款流程：                                               │
│  1. 用户申请退款                                          │
│     POST /api/refund/apply                               │
│                                                          │
│  2. 管理员审核                                            │
│     POST /admin/refund/:id/audit                         │
│                                                          │
│  3. 执行退款                                              │
│     调用微信退款API                                       │
│                                                          │
│  4. 退款回调                                              │
│     POST /api/refund/callback                            │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### 14.4 免责签署完整性保证

```
┌─────────────────────────────────────────────────────────┐
│               免责签署记录完整性保证                       │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  签署记录必须包含：                                       │
│  ├── sign_id          - 签署记录唯一ID                    │
│  ├── user_id          - 签署用户ID                       │
│  ├── activity_id      - 关联活动ID                       │
│  ├── club_id          - 俱乐部ID                         │
│  ├── sign_time        - 签署时间戳（服务端生成）          │
│  ├── terms_version    - 条款版本号                       │
│  ├── terms_content_hash - 条款内容哈希（防篡改）          │
│  ├── user_ip          - 用户IP地址                       │
│  ├── user_agent       - 浏览器UserAgent                  │
│  └── status           - 签署状态（有效/无效）             │
│                                                          │
│  合规要点：                                               │
│  ├── 签署时间必须是服务端时间                              │
│  ├── IP地址必须记录（用于争议举证）                        │
│  ├── 条款内容哈希用于验证条款未被篡改                      │
│  └── 签署记录需长期保存（建议3年）                         │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 十五、附录

### 15.1 错误码定义

| 错误码 | 说明 |
|-------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未登录或Token过期 |
| 403 | 无权限访问 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |
| 1001 | 活动已满员 |
| 1002 | 活动已截止报名 |
| 1003 | 活动不存在或已下架 |
| 1004 | 报名已存在 |
| 1005 | 未签署免责条款 |
| 2001 | 订单不存在 |
| 2002 | 订单已支付 |
| 2003 | 订单已取消 |
| 2004 | 退款申请不存在 |
| 2005 | 退款申请已处理 |
| 3001 | 用户已被拉黑 |
| 3002 | 俱乐部已禁用 |

### 15.2 活动状态枚举

| 状态值 | 状态名称 | 说明 |
|-------|---------|------|
| 0 | draft | 草稿 |
| 1 | recruiting | 报名中 |
| 2 | full | 已满员 |
| 3 | ongoing | 进行中 |
| 4 | ended | 已结束 |
| 5 | cancelled | 已取消 |

### 15.3 报名状态枚举

| 状态值 | 状态名称 | 说明 |
|-------|---------|------|
| 0 | pending_pay | 待支付 |
| 1 | pending_audit | 待审核 |
| 2 | passed | 已通过 |
| 3 | rejected | 已拒绝 |
| 4 | cancelled | 已取消 |
| 5 | backup | 候补中 |

### 15.4 订单状态枚举

| 状态值 | 状态名称 | 说明 |
|-------|---------|------|
| 0 | unpaid | 待支付 |
| 1 | paid | 已支付 |
| 2 | refunded | 已退款 |
| 3 | cancelled | 已取消 |

### 15.5 退款状态枚举

| 状态值 | 状态名称 | 说明 |
|-------|---------|------|
| 0 | none | 无退款 |
| 1 | applying | 申请中 |
| 2 | approved | 审核通过 |
| 3 | rejected | 审核拒绝 |
| 4 | processing | 退款中 |
| 5 | completed | 已完成 |
