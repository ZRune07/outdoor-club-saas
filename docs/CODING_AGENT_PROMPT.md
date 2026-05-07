# 户外运动俱乐部SaaS小程序 - 编码Agent启动Prompt

> 你是一个高级全栈开发Agent，负责将本项目从零搭建到MVP可运行状态。请严格遵循本文档中的所有规范和约束。

---

## 一、项目概览

**项目名称**：户外运动俱乐部SaaS小程序
**项目定位**：面向全国户外运动俱乐部的SaaS化小程序解决方案，核心差异是「多俱乐部管理 + 千人千面 + 免责签署 + PGC知识分享」
**MVP目标**：一周内跑通「活动展示→报名→缴费→免责签署」核心闭环
**商业模式**：独立小程序2000元/年，共享小程序1000元/年

### 仓库信息
- **仓库地址**：https://github.com/ZRune07/outdoor-club-saas
- **分支策略**：基于 `master` 创建 `develop` 分支开发，功能分支 `feature/xxx` 从 develop 拉出
- **文档目录**：`docs/` 下有6份详细文档，遇到不确定的细节请查阅

---

## 二、技术栈（已确定，不可更改）

| 层级 | 技术 | 说明 |
|-----|------|------|
| **后端** | SpringBoot 3.x + MyBatis（若依RuoYi-Vue框架） | 基于fork的若依官方版，已将Vue2前端替换为Vue3 |
| **数据库** | PostgreSQL 14+ | 主库，用JSONB存储俱乐部配置 |
| **缓存** | Redis 6+ | Session/限流/热点缓存 |
| **管理后台前端** | Vue3 + Element Plus + Vite + Pinia | 已在 `ruoyi-ui/` 目录 |
| **小程序H5层** | Vue3 + Vant + Pinia | WebView内嵌，业务逻辑全在这 |
| **小程序原生层** | 微信小程序原生 | 仅2个页面：首页壳 + WebView容器 |
| **微信SDK** | WxJava 4.6.0 | 小程序登录 + 微信支付 + 模板消息 |
| **文件存储** | 阿里云OSS / 腾讯云COS | 图片、合同文件 |

---

## 三、若依框架适配PostgreSQL（Day 1 首要任务）

当前仓库是若依MySQL版，必须完成以下适配才能运行：

### 3.1 Maven依赖替换
```xml
<!-- 移除MySQL驱动，替换为PostgreSQL -->
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <version>42.6.0</version>
</dependency>

<!-- MyBatis-Plus适配PG -->
<dependency>
    <groupId>com.baomidou</groupId>
    <artifactId>mybatis-plus-boot-starter</artifactId>
    <version>3.5.5</version>
</dependency>
```

### 3.2 配置文件
```yaml
spring:
  datasource:
    driver-class-name: org.postgresql.Driver
    url: jdbc:postgresql://localhost:5432/outdoor_club_saas?useUnicode=true&characterEncoding=utf8&useSSL=false&serverTimezone=Asia/Shanghai
    username: postgres
    password: ${DB_PASSWORD}
```

### 3.3 关键SQL方言差异
| MySQL | PostgreSQL |
|-------|-----------|
| `AUTO_INCREMENT` | `GENERATED ALWAYS AS IDENTITY` |
| `TINYINT(1)` → Boolean | `BOOLEAN` |
| `DATETIME` | `TIMESTAMP` |
| `JSON_CONTAINS()` | `@>` |
| `JSON_EXTRACT()` | `->` 或 `#>` |
| `SUBSTRING(col, 1, 10)` | `SUBSTRING(col FROM 1 FOR 10)` |

### 3.4 分页插件
使用 `PostgreSQLInnerInterceptor` 替代若依默认的MySQL分页。

### 3.5 所有若依自带SQL脚本需要转写为PostgreSQL语法
包括 `sql/` 目录下的初始化脚本。

---

## 四、多租户方案（核心架构决策）

**方案：共享数据库 + 行级隔离（club_id），单实例部署**

### 4.1 实现机制
1. **所有业务表** 增加 `club_id BIGINT NOT NULL` 字段
2. **TenantContextHolder**：ThreadLocal 存储当前请求的 club_id
3. **TenantInterceptor**：从请求头 `X-Club-Id` 或 JWT Token 解析 club_id，设入 ThreadLocal
4. **MyBatis-Plus TenantLineInnerInterceptor**：自动在 SQL 中拼接 `WHERE club_id = ?`
5. **忽略的系统表**：`sys_user, sys_role, sys_menu, sys_dept, sys_dict_type, sys_dict_data, sys_config, sys_notice, sys_post`

### 4.2 club_id 获取优先级
1. 请求头 `X-Club-Id`
2. JWT Token 中的 `clubId` 字段
3. URL 参数 `club_id`

### 4.3 千人千面
- 俱乐部配置存储在 `club` 表的 JSONB 字段中：`theme_config`, `banner_config`, `features_config`, `tabbar_config`
- 前端通过 CSS 变量注入主题色，`--theme-primary` 等
- WebView 加载时读取配置 → 注入 CSS 变量 → 渲染专属皮肤

---

## 五、数据库设计（19张业务表）

### 5.1 系统表（若依自带，需转PG语法）
`sys_user, sys_role, sys_menu, sys_dept, sys_dict_type, sys_dict_data, sys_config, sys_notice, sys_oper_log, sys_logininfor`

### 5.2 业务表（需新建）

| 表名 | 说明 | 前缀 | MVP |
|------|------|------|-----|
| `club` | 俱乐部表（多租户核心） | - | ✅ |
| `club_user` | 俱乐部-用户关联 | - | ✅ |
| `wx_user` | 微信用户表 | - | ✅ |
| `act_activity` | 活动表 | act_ | ✅ |
| `reg_registration` | 报名表 | reg_ | ✅ |
| `pay_order` | 订单表 | pay_ | ✅ |
| `pay_refund` | 退款表 | pay_ | ❌V1.0 |
| `dis_sign_record` | 免责签署记录 | dis_ | ✅ |
| `dis_disclaimer` | 免责条款模板 | dis_ | ✅ |
| `msg_message` | 消息表 | msg_ | ✅ |
| `fav_favorite` | 收藏表 | fav_ | ❌V1.0 |
| `art_article` | 知识库文章（PGC） | art_ | ❌V1.5 |

### 5.3 所有业务表必须包含的字段
```sql
club_id BIGINT NOT NULL  -- 多租户隔离字段（系统表除外）
```
以及若依标准审计字段：`create_by, create_time, update_by, update_time, remark`

### 5.4 完整DDL
详见 `docs/开发规格说明书.md` 第四章，共19张表的完整建表SQL（PostgreSQL语法）和索引定义。

---

## 六、API接口规范

### 6.1 统一响应
```json
{ "code": 200, "msg": "操作成功", "data": {} }
```

### 6.2 分页响应
```json
{ "code": 200, "msg": "success", "data": { "total": 100, "pageNum": 1, "pageSize": 10, "rows": [] } }
```

### 6.3 认证
- **用户端**：`Authorization: Bearer <JWT>`，Token含 `sub=userId, clubId, openid`
- **管理端**：`Authorization: Bearer <admin_token>`，Token含 `sub=adminUserId, role, clubId`

### 6.4 MVP核心接口（34个）

| 模块 | 接口 | 方法 | 路径 |
|------|------|------|------|
| 认证 | 微信登录 | POST | `/api/auth/login` |
| 认证 | 绑定手机号 | POST | `/api/auth/bindPhone` |
| 认证 | 刷新Token | POST | `/api/auth/refresh` |
| 俱乐部 | 获取俱乐部配置 | GET | `/api/club/config` |
| 俱乐部 | 俱乐部列表（共享版） | GET | `/api/club/list` |
| 活动 | 活动列表 | GET | `/api/activities` |
| 活动 | 活动详情 | GET | `/api/activity/{id}` |
| 活动 | 活动类型列表 | GET | `/api/activities/types` |
| 活动 | 活动搜索 | GET | `/api/activities/search` |
| 活动 | 热门活动推荐 | GET | `/api/activities/hot` |
| 报名 | 提交报名 | POST | `/api/registrations` |
| 报名 | 我的报名列表 | GET | `/api/registrations` |
| 支付 | 创建支付订单 | POST | `/api/pay/create` |
| 支付 | 支付回调 | POST | `/api/pay/callback` |
| 支付 | 支付结果查询 | GET | `/api/pay/result/{orderNo}` |
| 支付 | 订单详情 | GET | `/api/pay/order/{orderId}` |
| 免责 | 获取免责条款 | GET | `/api/disclaimer` |
| 免责 | 签署免责条款 | POST | `/api/disclaimer/sign` |
| 个人 | 获取个人信息 | GET | `/api/user/profile` |
| 个人 | 更新个人信息 | PUT | `/api/user/profile` |
| 消息 | 消息列表 | GET | `/api/messages` |
| 消息 | 标记已读 | PUT | `/api/messages/{id}/read` |
| 管理端 | 俱乐部CRUD | * | `/admin/club/*` |
| 管理端 | 活动CRUD+发布 | * | `/admin/activity/*` |
| 管理端 | 报名管理 | * | `/admin/registration/*` |
| 管理端 | 订单管理 | * | `/admin/order/*` |
| 管理端 | 系统管理 | * | `/admin/system/*` |

完整106个接口详见 `docs/API接口清单.md`。

---

## 七、前端架构

### 7.1 三端分离

```
┌───────────────────────────────────────────────┐
│  微信小程序原生层（2个页面）                      │
│  ├── pages/index/index      首页壳+TabBar      │
│  └── pages/webview/container  WebView容器       │
│  职责：生命周期、club_id注入、登录态、支付调用     │
├───────────────────────────────────────────────┤
│  H5业务层（Vue3 + Vant，嵌入WebView）            │
│  路由：/h5/activities, /h5/activity/:id, ...   │
│  职责：所有业务逻辑、页面渲染、主题注入            │
├───────────────────────────────────────────────┤
│  PC管理后台（Vue3 + Element Plus，若依内置）      │
│  路由：/club, /activity, /order, /user, ...    │
│  职责：俱乐部/活动/订单/用户管理                   │
└───────────────────────────────────────────────┘
```

### 7.2 小程序 ↔ H5 交互（JSBridge）
- H5通过 `wx.miniProgram.postMessage` 与小程序通信
- 小程序通过 `onWebViewMessage` 监听
- 核心桥接方法：`getClubId()`, `getUserToken()`, `navigateTo()`, `requestPayment()`, `showShareMenu()`

### 7.3 H5页面路由（MVP部分）

| 路由 | 页面 | 需登录 |
|------|------|-------|
| `/h5/activities` | 活动列表 | 否 |
| `/h5/activity/:id` | 活动详情 | 否 |
| `/h5/activity/:id/register` | 报名表单 | 是 |
| `/h5/disclaimer/:activityId` | 免责条款 | 是 |
| `/h5/pay/:orderId` | 支付确认 | 是 |
| `/h5/pay/result` | 支付结果 | 是 |
| `/h5/profile` | 个人中心 | 是 |
| `/h5/registrations` | 报名记录 | 是 |
| `/h5/clubs` | 俱乐部选择 | 否 |
| `/h5/auth/login` | 微信登录 | 否 |

### 7.4 管理端页面路由（MVP部分）

| 路由 | 页面 |
|------|------|
| `/dashboard` | 管理控制台 |
| `/club` | 俱乐部管理 |
| `/club/config/:id` | 俱乐部配置 |
| `/activity` | 活动管理列表 |
| `/activity/edit/:id?` | 活动编辑/创建 |
| `/activity/:id/registrations` | 报名管理 |
| `/order` | 订单管理 |
| `/user` | 用户管理 |
| `/disclaimer` | 免责条款管理 |

---

## 八、关键业务流程

### 8.1 用户端核心流程
```
打开小程序 → club_id注入 → 活动列表 → 活动详情 → 点击报名 
→ 微信登录 → 签署免责条款 → 填写报名表单 → 创建订单 
→ 微信支付 → 支付回调 → 报名成功 → 推送消息
```

### 8.2 微信登录流程
```
wx.login()获取code → POST /api/auth/login {code} 
→ 后端调微信API换openid → 查询/创建wx_user 
→ 生成JWT(含clubId) → 返回token
```

### 8.3 微信支付流程
```
提交报名 → POST /api/pay/create → 后端调微信统一下单 
→ 返回支付参数 → 前端wx.requestPayment() → 用户支付 
→ 微信回调 POST /api/pay/callback → 更新订单状态 → 推送通知
```

---

## 九、代码规范

### 9.1 后端包结构
```
com.ruoyi（若依基础包，保持不变）
├── outdoor/                    # 业务模块（新增）
│   ├── club/                  # 俱乐部模块
│   │   ├── controller/
│   │   ├── domain/
│   │   ├── mapper/
│   │   └── service/
│   ├── activity/              # 活动模块
│   ├── registration/          # 报名模块
│   ├── payment/               # 支付模块
│   ├── disclaimer/            # 免责模块
│   ├── message/               # 消息模块
│   └── content/               # 内容模块
├── framework/tenant/          # 多租户配置（新增）
│   ├── TenantContextHolder.java
│   ├── TenantInterceptor.java
│   └── CustomTenantHandler.java
```

### 9.2 命名规范
- Controller: `XxxController`
- Service接口: `IXxxService`，实现: `XxxServiceImpl`
- Mapper: `XxxMapper`
- Entity: `XxxEntity`
- DTO: `XxxDTO` / `XxxRequest`
- VO: `XxxVO`
- 数据库表: 带前缀 `act_`, `reg_`, `pay_`, `dis_`, `msg_`, `fav_`, `art_`

### 9.3 Git提交规范
```
<type>(<scope>): <subject>

type: feat/fix/docs/style/refactor/test/chore
scope: 模块名

示例：
feat(activity): 添加活动列表查询接口
fix(payment): 修复支付回调重复通知问题
refactor(tenant): 实现MyBatis-Plus多租户拦截器
```

---

## 十、重要约束（红线）

1. **不做社区/UGC/社交功能**：知识分享为纯PGC模式，管理员/领队发布，无用户评论/点赞/发布
2. **数据库必须用PostgreSQL**：不使用MySQL，JSONB是核心需求
3. **多租户必须用行级隔离**：club_id + MyBatis拦截器，不做多Schema/多实例
4. **单仓库管理前后端**：小程序前端、H5前端、管理后台前端都在同一个仓库
5. **微信支付走WxJava SDK**：不用其他支付SDK
6. **若依框架代码不大幅重构**：在其基础上扩展业务模块，保持框架原有结构
7. **敏感数据加密存储**：身份证号、手机号等必须AES加密后存库

---

## 十一、MVP开发任务（7天）

### Day 1：项目初始化
1. 从 master 创建 develop 分支
2. **若依PG适配**：替换驱动、分页插件、SQL方言、转写所有SQL脚本为PG语法
3. 创建数据库 `outdoor_club_saas`，执行建表脚本
4. 后端能正常 `mvn spring-boot:run` 启动
5. 创建H5项目骨架（Vue3 + Vant + Pinia + Vue Router）
6. 创建小程序项目骨架（2个原生页面）

### Day 2：核心模块开发（上）
1. 实现多租户拦截器：TenantContextHolder + TenantInterceptor + MyBatis-Plus TenantLineHandler
2. 俱乐部配置接口：CRUD + 主题配置读取
3. 活动管理接口：CRUD + 状态机（draft→recruiting→full→closed→ongoing→ended）
4. 集成WxJava，实现微信登录接口
5. H5：活动列表页 + 活动详情页
6. 小程序：登录流程 + WebView容器

### Day 3：核心模块开发（下）
1. 报名接口：创建、查询、状态管理
2. 订单接口：创建、查询
3. 集成微信支付：统一下单 + 回调 + 结果查询
4. 免责签署接口：获取条款 + 签署记录
5. 消息通知接口
6. H5：报名表单 + 免责条款 + 支付确认 + 支付结果 + 个人中心

### Day 4：管理端开发
1. 基于若依管理后台，新增业务菜单
2. 俱乐部管理页面
3. 活动管理页面（列表、创建、编辑）
4. 报名管理页面
5. 订单管理页面
6. 用户管理页面
7. 配置菜单权限和角色

### Day 5：联调与修复
1. 前后端接口联调
2. 核心流程E2E测试：浏览→报名→支付→免责签署
3. 多租户隔离测试
4. Bug修复

### Day 6：部署准备
1. Nginx配置
2. 数据库初始化
3. 环境变量配置
4. 小程序打包提交

### Day 7：发布
1. 最终验收
2. 代码合并到 main

---

## 十二、参考文档（均在仓库 docs/ 目录）

| 文件 | 内容 |
|------|------|
| `docs/功能规划.md` | 完整功能规划V2.1，含竞品对比、差异化策略、定价 |
| `docs/竞品调研.md` | 10个竞品分析 |
| `docs/页面路由规划.md` | 43个页面的路由、类型、优先级 |
| `docs/API接口清单.md` | 106个接口的完整定义 |
| `docs/户外小程序_架构图.drawio` | 5层架构+3条数据流 |
| `docs/开发规格说明书.md` | **最重要**：19张表DDL、多租户实现代码、WxJava集成代码、前端规范、部署方案、MVP任务拆解 |

**遇到任何细节问题，优先查阅 `docs/开发规格说明书.md`，里面有完整的代码示例和实现方案。**

---

## 十三、当前仓库状态

- 后端：若依RuoYi-Vue框架（Java），需适配PostgreSQL
- 前端管理后台：Vue3版本已在 `ruoyi-ui/` 目录
- H5业务层和小程序原生层：**尚未创建**，需新建
- 数据库脚本：当前是MySQL语法，需转写为PostgreSQL
- 文档：6份文档已在 `docs/` 目录

**第一步应该做什么**：完成若依框架的PostgreSQL适配，确保后端能正常启动连接PG数据库。
