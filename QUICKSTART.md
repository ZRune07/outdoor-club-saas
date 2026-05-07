# 户外运动俱乐部 SaaS - 快速启动指南

## 项目概述

这是一个基于若依框架的户外运动俱乐部 SaaS 管理系统，包含微信登录、微信支付、活动管理、报名管理等功能。

## 项目结构

```
/workspace
├── ruoyi-admin/          # 后端管理系统
├── ruoyi-outdoor/        # 业务模块（户外活动、报名、支付等）
├── ruoyi-h5/             # H5 前端项目（Vue 3 + Vant UI）
├── ruoyi-miniprogram/    # 微信小程序项目
└── docs/                 # 项目文档
```

## 环境准备

### 必需环境

- JDK 17+
- Maven 3.6+
- Node.js 16+
- PostgreSQL 12+
- Redis 6+

## 后端启动

### 1. 数据库配置

修改 `ruoyi-admin/src/main/resources/application-druid.yml`：

```yaml
url: jdbc:postgresql://localhost:5432/outdoor_club_saas?useUnicode=true&characterEncoding=utf8&useSSL=false&serverTimezone=Asia/Shanghai
username: postgres
password: 你的密码
```

### 2. 微信配置

修改 `ruoyi-admin/src/main/resources/application.yml`：

```yaml
wx:
  miniapp:
    appid: 你的小程序appid
    secret: 你的小程序secret
  pay:
    appId: 你的小程序appid
    mchId: 你的商户号
    mchKey: 你的商户密钥
    notifyUrl: http://你的域名/api/payment/callback
```

### 3. 启动后端

```bash
cd /workspace
mvn clean install
cd ruoyi-admin
mvn spring-boot:run
```

后端服务将在 `http://localhost:8080` 启动

## 前端启动

### 1. 安装依赖

```bash
cd /workspace/ruoyi-h5
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

前端服务将在 `http://localhost:5173` 启动

## 主要功能

### 微信登录
- `/api/auth/login` - 微信小程序登录
- 自动创建/更新用户信息
- JWT Token 认证

### 微信支付
- `/api/payment/unified-order` - 统一下单
- `/api/payment/callback` - 支付回调
- `/api/payment/status/{orderNo}` - 查询支付状态

### 活动管理
- `/api/activity/list` - 获取活动列表
- `/api/activity/{id}` - 获取活动详情

### 报名管理
- `/api/registration` - 创建报名
- `/api/registration/my` - 我的报名列表
- `/api/registration/{id}` - 报名详情

### 免责条款
- `/api/disclaimer/latest` - 获取最新免责条款

## 数据库初始化

请参考 `docs/` 目录下的数据库脚本进行初始化。

## 注意事项

1. **微信配置**：正式使用前请替换为真实的微信小程序和支付配置
2. **HTTPS**：生产环境建议使用 HTTPS
3. **安全**：请妥善保管密钥和敏感配置
4. **域名**：支付回调地址需要在微信商户平台配置白名单

## 技术栈

### 后端
- Spring Boot 4.0.3
- MyBatis + PageHelper
- PostgreSQL + Redis
- WxJava (微信 SDK)

### 前端
- Vue 3.4
- Vant UI 4.x
- Vite 5.x
- Vue Router 4.x
- Pinia 2.x

## 开发建议

1. **后端开发**：建议使用 IntelliJ IDEA
2. **前端开发**：建议使用 VS Code + Volar 插件
3. **API 文档**：后端启动后访问 `http://localhost:8080/swagger-ui.html`

## 问题反馈

如有问题，请查看项目文档或联系开发团队。
