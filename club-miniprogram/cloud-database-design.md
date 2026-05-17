# 微信云开发数据库设计

## 1. 报名信息表 (enrollments)

### 字段设计
| 字段名 | 类型 | 描述 | 索引 |
|-------|------|------|------|
| _id | String | 报名记录ID | 主键 |
| tenantId | String | 租户ID | 索引 |
| postId | String | 文章ID | 索引 |
| name | String | 姓名 | 普通 |
| phone | String | 电话号码 | 普通 |
| email | String | 电子邮箱 | 普通 |
| participantCount | Number | 参与人数 | 普通 |
| message | String | 备注信息 | 普通 |
| status | String | 报名状态 (pending/approved/rejected) | 普通 |
| createdAt | Timestamp | 创建时间 | 索引 |
| updatedAt | Timestamp | 更新时间 | 普通 |
| employeeId | String | 关联员工ID | 普通 |

### 索引设计
- `tenantId` 索引：用于按租户查询报名记录
- `postId` 索引：用于按文章查询报名记录
- `createdAt` 索引：用于按时间排序查询

## 2. 电子协议表 (agreements)

### 字段设计
| 字段名 | 类型 | 描述 | 索引 |
|-------|------|------|------|
| _id | String | 协议ID | 主键 |
| tenantId | String | 租户ID | 索引 |
| enrollmentId | String | 关联报名记录ID | 索引 |
| postId | String | 文章ID | 索引 |
| content | String | 协议内容 | 普通 |
| signature | String | 电子签名（base64） | 普通 |
| signerName | String | 签署人姓名 | 普通 |
| signerPhone | String | 签署人电话 | 普通 |
| signedAt | Timestamp | 签署时间 | 普通 |
| status | String | 协议状态 (draft/signed) | 普通 |
| createdAt | Timestamp | 创建时间 | 索引 |

### 索引设计
- `tenantId` 索引：用于按租户查询协议
- `enrollmentId` 索引：用于按报名记录查询协议
- `postId` 索引：用于按文章查询协议

## 3. 文章协议配置表 (post_agreements)

### 字段设计
| 字段名 | 类型 | 描述 | 索引 |
|-------|------|------|------|
| _id | String | 配置ID | 主键 |
| tenantId | String | 租户ID | 索引 |
| postId | String | 文章ID | 唯一索引 |
| agreementContent | String | 协议内容 | 普通 |
| enableEnrollment | Boolean | 是否启用报名 | 普通 |
| enableAgreement | Boolean | 是否启用电子协议 | 普通 |
| createdAt | Timestamp | 创建时间 | 普通 |
| updatedAt | Timestamp | 更新时间 | 普通 |

### 索引设计
- `tenantId` 索引：用于按租户查询配置
- `postId` 唯一索引：确保每个文章只有一个配置

## 4. 数据隔离策略

### 多租户隔离
- 所有表都包含 `tenantId` 字段
- 查询时必须指定 `tenantId` 条件
- 数据操作（增删改查）都需要验证租户权限

### 安全措施
- 敏感信息（如电话号码）加密存储
- 数据访问权限控制
- 操作日志记录

## 5. 数据迁移和初始化

### 初始化步骤
1. 创建云开发环境
2. 创建上述数据表
3. 配置索引
4. 导入初始数据（如默认协议模板）

### 迁移策略
- 现有数据迁移到新结构
- 保持向后兼容性

## 6. 性能优化

### 查询优化
- 合理使用索引
- 避免全表扫描
- 分页查询

### 存储优化
- 协议内容使用压缩存储
- 签名图片使用云存储

## 7. 扩展性考虑

### 未来扩展
- 支持更多报名字段
- 支持协议模板管理
- 支持报名统计和分析