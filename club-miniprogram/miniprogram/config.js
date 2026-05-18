// config.js
// Java 统一 REST 后端适配配置
// 该开关默认关闭，开启后关键页改走 Java REST 后端，否则保持原有 wx.cloud / WordPress 逻辑

// Java REST 后端基础地址（部署时按实际域名修改）
var JAVA_API_BASE = 'https://your-domain/api';

// 是否启用 Java 后端。默认 false，行为不变，可随时回退
var USE_JAVA_BACKEND = false;

module.exports = {
    JAVA_API_BASE: JAVA_API_BASE,
    USE_JAVA_BACKEND: USE_JAVA_BACKEND
};
