# 户外俱乐部 SaaS 管理平台

## 项目概览
基于若依（RuoYi-Vue）框架的户外俱乐部 SaaS 管理平台前端项目。Vue3 + Element Plus + Vite 技术栈。

## 目录结构
```
ruoyi-ui/                  # 前端项目根目录
├── src/
│   ├── api/               # API 接口定义
│   │   ├── outdoor/       # 户外业务 API（activity/club/member/order/registration/disclaimer）
│   │   ├── login.js       # 登录认证
│   │   ├── menu.js        # 菜单路由
│   │   ├── system/        # 系统管理 API
│   │   ├── monitor/       # 监控 API
│   │   └── tool/          # 工具 API
│   ├── mock/              # Mock 数据（生产环境后端不可达时自动兜底）
│   │   ├── index.js       # Mock 入口 + 拦截器匹配逻辑
│   │   ├── login.js       # 登录/用户信息/路由 Mock
│   │   ├── club.js        # 俱乐部 Mock
│   │   ├── activity.js    # 活动 Mock
│   │   ├── registration.js # 报名 Mock
│   │   ├── order.js       # 订单 Mock
│   │   ├── member.js      # 会员 Mock
│   │   ├── disclaimer.js  # 免责条款 Mock
│   │   └── system.js      # 系统级 API Mock（字典/配置/用户/角色等）
│   ├── store/modules/     # Pinia 状态管理
│   │   ├── user.js        # 用户状态（登录/信息/退出）
│   │   ├── permission.js  # 权限路由
│   │   └── settings.js    # 布局设置
│   ├── views/             # 页面组件
│   │   ├── outdoor/       # 户外业务页面
│   │   ├── system/        # 系统管理页面
│   │   ├── monitor/       # 系统监控页面
│   │   └── login.vue      # 登录页
│   ├── utils/
│   │   └── request.js     # Axios 封装 + Mock 拦截器
│   └── router/index.js    # 路由配置
├── .env.production        # 生产环境（VITE_MOCK=true）
├── .env.development       # 开发环境
└── vite.config.js         # Vite 配置（proxy → localhost:8080, port: 5000）
```

## 构建和运行命令
- **安装依赖**: `cd ruoyi-ui && npm install`
- **开发模式**: `cd ruoyi-ui && npm run dev`（端口 5000）
- **生产构建**: `cd ruoyi-ui && npm run build:prod`
- **预览**: `cd ruoyi-ui && npm run preview`

## Mock 系统
- **启用方式**: `.env.production` 中 `VITE_MOCK=true` 强制拦截；不启用时后端不可达自动 fallback
- **机制**: request.js 请求拦截器中通过 adapter 模式返回 mock 数据（强制模式）；错误拦截器中兜底返回（fallback 模式）
- **关闭 Mock**: 将 `.env.production` 中 `VITE_MOCK` 设为 `false` 或删除，并配置真实后端地址

## API 代理
- 开发环境: `/dev-api` → `http://localhost:8080`
- 生产环境: `/prod-api` → 需配置后端地址或使用 Mock

## 关键业务流程
1. **登录**: 验证码（mock 禁用） → login → token → getInfo → getRouters → 动态路由
2. **户外管理**: 俱乐部 → 活动 → 报名 → 订单 → 会员 → 免责条款
3. **系统管理**: 用户/角色/菜单/部门/岗位/字典/配置/通知

## 登录凭据（Mock 模式）
- 用户名: `admin`（任意用户名均可）
- 密码: `admin123`（任意密码均可）
- 验证码: 已禁用

## 注意事项
- 使用 npm 作为包管理器（若依项目默认，非 pnpm）
- 后端为 Java Spring Boot，需 MySQL + Redis
- 户外业务 API 路径前缀: `/admin/outdoor/`
