# 多租户小程序平台化改造 Spec

## Why
当前系统是单一品牌小程序，无法让多个企业用户独立配置品牌与内容。本次先落地“小程序前端多租户基础层”，为后续 WordPress 后台多租户管理能力提供接入面。

## What Changes
- 引入前端租户模型：支持租户品牌、分类映射、快捷入口与详情页主题配置
- 引入前端租户识别：小程序按 tenantId 初始化租户上下文
- 引入请求租户透传：所有内容请求统一自动追加 tenantId
- 引入默认租户回退：租户分类无数据时回退 default 租户分类
- 补齐跨页租户链路：首页、列表、详情、咨询、分享路径传递 tenantId
- 引入详情页模块化主题变量与租户/默认样式切换
- **BREAKING** 前端数据读取入口由固定全局读取改为“租户上下文驱动”

## Impact
- Affected specs: 前端租户上下文、租户路由透传、详情页主题系统
- Affected code: 小程序 app 全局配置与请求封装、首页/列表/详情/咨询链路、详情页渲染样式

## ADDED Requirements
### Requirement: 前端租户品牌配置
系统 SHALL 支持按租户加载品牌配置（Logo、标题、描述、快捷入口），并在无租户配置时回退默认租户。

#### Scenario: 小程序识别租户并渲染品牌
- **WHEN** 用户通过带 tenantId 的入口访问小程序
- **THEN** 首页按 tenantId 渲染对应品牌与快捷入口

### Requirement: 租户内容加载与回退
系统 SHALL 按租户分类映射加载内容，并在租户无数据时自动回退 default 分类。

#### Scenario: 租户分类为空时回退
- **WHEN** 当前租户某内容分类返回空数据
- **THEN** 小程序自动回退到 default 租户对应分类继续加载

### Requirement: 租户链路透传
系统 SHALL 在首页、列表、详情、咨询与分享链路透传 tenantId，保证同一用户会话租户一致性。

#### Scenario: 跨页进入详情页
- **WHEN** 用户从首页或列表页进入详情页
- **THEN** 页面 URL 保留 tenantId 并按该租户继续请求内容

### Requirement: 详情页主题模块化
系统 SHALL 提供租户主题变量，并支持租户样式与默认样式切换。

#### Scenario: 切换详情页样式模式
- **WHEN** 用户在详情页切换租户样式与默认样式
- **THEN** 页面实时应用对应主题变量且不影响内容结构

## MODIFIED Requirements
### Requirement: 小程序前端数据加载
系统由“固定品牌 + 全局文章读取”修改为“租户识别后加载租户品牌与租户分类映射内容”。

### Requirement: 页面路由与分享
系统由“不感知租户参数”修改为“跨页面与分享路径持续透传 tenantId”。

## REMOVED Requirements
### Requirement: 单品牌硬编码展示
**Reason**: 无法满足平台化多租户扩展需求。  
**Migration**: 原全局品牌与分类映射作为 default 租户模板继续兼容。
