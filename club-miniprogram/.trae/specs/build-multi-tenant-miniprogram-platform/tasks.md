# Tasks
- [x] Task 1: 建立前端多租户上下文与默认租户回退
  - [x] SubTask 1.1: 在全局配置中增加 tenant 配置、品牌字段与分类映射
  - [x] SubTask 1.2: 统一请求自动注入 tenantId 并支持 URL 参数透传
  - [x] SubTask 1.3: 增加按租户分类拉取失败时回退 default 的策略

- [x] Task 2: 完成租户驱动的首页与列表页渲染
  - [x] SubTask 2.1: 首页按租户加载品牌信息、快捷入口与内容数据
  - [x] SubTask 2.2: 查看全部页与产品页按租户分类加载文章
  - [x] SubTask 2.3: 首页/列表/详情之间补齐 tenantId 跨页传递

- [x] Task 3: 落地详情页模块化主题基础能力
  - [x] SubTask 3.1: 增加详情页主题变量映射与默认主题
  - [x] SubTask 3.2: 增加租户样式与默认样式切换开关
  - [x] SubTask 3.3: 保持富文本与旧内容结构兼容

- [x] Task 4: 完成基础验证与规格同步
  - [x] SubTask 4.1: 核对主要页面链路中的 tenantId 透传
  - [x] SubTask 4.2: 通过编辑器诊断验证无新增错误
  - [x] SubTask 4.3: 更新 checklist 完成项

# Task Dependencies
- Task 2 depends on Task 1
- Task 3 depends on Task 2
- Task 4 depends on Task 2, Task 3
