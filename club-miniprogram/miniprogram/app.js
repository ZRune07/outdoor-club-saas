// app.js
App({
  globalData: {
    baseUrl: 'https://huwai.huodong.xyz/wp-json/wp/v2',
    tenantConfigApiPath: '/wp-json/minip/v1/tenant-configs',
    tenantConfigCptApiPath: '/wp-json/wp/v2/tenant_config?per_page=100',
    phone: '18653188848',
    brandColor: '#FF6B00',
    tenantStorageKey: 'tenantId',
    currentTenantId: 'default',
    tenantConfigs: {
      default: {
        brand: {
          appName: '户外俱乐部',
          logo: '',
          slogan: '户外探险与团队建设专家',
          description: '提供专业的户外活动策划与执行服务'
        },
        share: {
          title: '户外俱乐部 - 专注户外活动与团建体验',
          image: '/images/fenxiang.jpg'
        },
        detailTheme: {
          bgColor: '#F5F5F5',
          cardBg: '#FFFFFF',
          textPrimary: '#333333',
          textSecondary: '#666666',
          textLight: '#999999',
          borderColor: '#EEEEEE',
          primaryColor: '#FF6B00',
          tagBg: 'rgba(255, 107, 0, 0.1)',
          bottomNavBg: '#FFFFFF',
          buttonCallBg: '#F06B22',
          buttonCustomBg: '#00C853',
          externalBtnBg: '#F8F9FA',
          externalBtnActiveBg: '#F0F0F0',
          externalBtnBorder: '#EEEEEE'
        },
        categories: {
          employee: 45,
          banner: 40,
          headerBg: 43,
          plans: 41,
          destinations: 47,
          topics: 42,
          cases: 44,
          featuredProducts: 5,
          sandbox: 46,
          about: 4
        },
        contentStrategy: {
          banner: { mode: 'category', postIds: [] },
          headerBg: { mode: 'category', postIds: [] },
          plans: { mode: 'category', postIds: [] },
          destinations: { mode: 'category', postIds: [] },
          topics: { mode: 'category', postIds: [] },
          cases: { mode: 'category', postIds: [] },
          employee: { mode: 'category', postIds: [] }
        },
        activityCategoryDisplay: {},
        quickCategories: [
          { id: 36, name: '精选产品', icon: 'https://tuanjiansaas-1256002767.cos.ap-chengdu.myqcloud.com/wp-content/uploads/2026/03/%E5%8F%AF%E4%B9%90.png', url: '/pages/products/products?category=36' },
          { id: 46, name: '沙盘体验', icon: 'https://tuanjiansaas-1256002767.cos.ap-chengdu.myqcloud.com/wp-content/uploads/2026/03/%E5%93%88%E5%A3%AB%E5%A5%87.png', url: '/pages/products/products?category=46' },
          { id: 3, name: '游戏集锦', icon: 'https://tuanjiansaas-1256002767.cos.ap-chengdu.myqcloud.com/wp-content/uploads/2026/03/%E6%A9%98%E7%8C%AB.png', url: '/pages/products/products?category=case' },
          { id: 4, name: '关于我们', icon: 'https://tuanjiansaas-1256002767.cos.ap-chengdu.myqcloud.com/wp-content/uploads/2026/03/%E6%A3%92%E7%90%83.png', url: '/pages/about/about?postId=1757' }
        ],
        bottomNavItems: [
          { key: 'home', name: '首页', icon: '/images/tabbar/home.svg', activeIcon: '/images/tabbar/home-active.svg', url: '/pages/index/index' },
          { key: 'function', name: '功能', icon: '/images/tabbar/function.svg', activeIcon: '/images/tabbar/function-active.svg', url: '__function__' },
          { key: 'equipment', name: '装备', icon: '/images/tabbar/product.svg', activeIcon: '/images/tabbar/product-active.svg', url: '/pages/products/products' },
          { key: 'mine', name: '我的', icon: '/images/tabbar/mine.svg', activeIcon: '/images/tabbar/mine-active.svg', url: '/pages/mine/mine' }
        ],
        miniappIntegration: {
          active_mode: 'shared',
          shared_enabled: true,
          dedicated_appid: '',
          dedicated_app_secret: '',
          dedicated_enabled: false,
          strict_appid_check: true
        }
      }
    },
    // 默认顾问信息（当无法识别员工时显示）
    defaultConsultant: {
      id: 'default',
      name: '户外顾问',
      title: '客服顾问',
      phone: '18653188848',
      avatar: 'https://tuanjiansaas-1256002767.cos.ap-chengdu.myqcloud.com/wp-content/uploads/2026/01/touxiang.png'
    },
    // 员工列表缓存
    employeeListMap: {},
    employeeList: [],
    // 用户身份信息
    userOpenId: null,
    // 默认报名字段配置
    defaultEnrollmentFields: [
      {
        key: 'name',
        label: '姓名',
        type: 'text',
        required: true,
        placeholder: '请输入您的姓名'
      },
      {
        key: 'phone',
        label: '手机号',
        type: 'tel',
        required: true,
        placeholder: '请输入您的手机号'
      },
      {
        key: 'participantCount',
        label: '参与人数',
        type: 'number',
        required: true,
        placeholder: '请输入参与人数',
        defaultValue: 1
      },
      {
        key: 'email',
        label: '邮箱（选填）',
        type: 'email',
        required: false,
        placeholder: '请输入您的邮箱'
      },
      {
        key: 'message',
        label: '备注信息（选填）',
        type: 'textarea',
        required: false,
        placeholder: '请输入备注信息'
      }
    ],
    // 默认电子协议内容
    defaultAgreementContent: `
            <h3>活动参与协议</h3>
            <p>1. 参与者需确保自身身体状况适合参加本次活动。</p>
            <p>2. 活动过程中需遵守组织者的安排和指导。</p>
            <p>3. 参与者需自行承担活动过程中的风险。</p>
            <p>4. 组织者保留活动最终解释权。</p>
            <p>5. 报名成功后，如需取消请提前24小时通知。</p>
        `,
    isSuperAdmin: false,
    isTenantAdmin: false,
    userRole: null, // 'super_admin' | 'tenant_admin' | null
    currentMiniProgramAppId: '',
    _autoTenantBootFinished: false
  },

  onLaunch(options) {
    this.captureMiniProgramAppId();
    // 初始化云开发
    if (wx.cloud) {
      wx.cloud.init({
        env: 'cloud1-d6g70npk2c69fe806', // 云开发环境ID
        traceUser: true
      });
    } else {
      console.error('云开发未启用，请在小程序管理后台开启云开发');
    }
    
    // 先初始化租户，再加载租户配置
    this.initTenantFromOptions(options || {});
    
    // 初始化用户身份
    this.initUserIdentity().catch(err => {
      console.error('初始化用户身份失败:', err);
    });
    
    this.ensureTenantConfigsLoaded().catch(err => {
      console.error('远程租户配置加载失败:', err);
    });
  },

  // 封装请求方法
  request(options) {
    return new Promise((resolve, reject) => {
      const method = options.method || 'GET';
      this.applyAutoTenantByAppId();
      const tenantId = this.normalizeTenantId(options.tenantId || this.getCurrentTenantId());
      const accessCheck = this.assertTenantMiniAppAccess(tenantId);
      if (!accessCheck.ok) {
        reject(new Error(accessCheck.message || '小程序接入校验失败'));
        return;
      }

      let requestUrl = options.url;
      const appId = this.getCurrentMiniProgramAppId();
      if (tenantId && tenantId !== 'default') {
        requestUrl = this.appendTenantToUrl(requestUrl, tenantId);
      } else if (appId) {
        requestUrl = this.appendAppIdToUrl(requestUrl, appId);
      }

      const requestData = this.injectTenantToData(options.data || {}, tenantId, method);
      const fullUrl = this.globalData.baseUrl + requestUrl;

      wx.request({
        url: fullUrl,
        method,
        data: requestData,
        header: {
          'Content-Type': 'application/json'
        },
        success: (res) => {
          // WordPress REST API可能返回200以外的状态码，比如400、404等
          // 我们应该根据实际情况处理，而不是简单地reject
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(res.data);
          } else {
            console.error('API请求失败，状态码:', res.statusCode, '响应:', res.data);
            // 即使状态码不是200，我们也返回数据，让调用者决定如何处理
            resolve(res.data);
          }
        },
        fail: (err) => {
          console.error('API请求失败:', err);
          reject(err);
        }
      });
    });
  },

  normalizeTenantId(tenantId) {
    const id = String(tenantId || '').trim();
    if (!id) {
      return 'default';
    }
    return id;
  },

  captureMiniProgramAppId() {
    try {
      if (typeof wx.getAccountInfoSync === 'function') {
        const account = wx.getAccountInfoSync();
        const appId = String(account?.miniProgram?.appId || '').trim();
        this.globalData.currentMiniProgramAppId = appId;
      }
    } catch (err) {
      console.warn('读取小程序AppID失败:', err);
    }
    return this.globalData.currentMiniProgramAppId || '';
  },

  getCurrentMiniProgramAppId() {
    const cached = String(this.globalData.currentMiniProgramAppId || '').trim();
    if (cached) {
      return cached;
    }
    return this.captureMiniProgramAppId();
  },

  toBoolean(value, defaultValue = false) {
    if (value === undefined || value === null || value === '') {
      return !!defaultValue;
    }
    if (value === true || value === 1 || value === '1') {
      return true;
    }
    if (typeof value === 'string') {
      const normalized = value.trim().toLowerCase();
      if (normalized === 'true' || normalized === 'yes' || normalized === 'on') {
        return true;
      }
      if (normalized === 'false' || normalized === 'no' || normalized === 'off' || normalized === '0') {
        return false;
      }
    }
    return !!value;
  },

  normalizeMiniAppIntegration(raw = {}) {
    const activeModeRaw = String(raw.active_mode || 'shared').trim();
    const activeMode = (
      activeModeRaw === 'dedicated' ||
      activeModeRaw === 'tenant_owned' ||
      activeModeRaw === 'tenant' ||
      activeModeRaw === 'private'
    ) ? 'dedicated' : 'shared';
    const dedicatedAppId = String(raw.dedicated_appid || '').trim();
    const hasDedicatedEnabled = !(raw.dedicated_enabled === undefined || raw.dedicated_enabled === null || raw.dedicated_enabled === '');
    const hasStrictCheck = !(raw.strict_appid_check === undefined || raw.strict_appid_check === null || raw.strict_appid_check === '');
    return {
      active_mode: activeMode,
      shared_enabled: this.toBoolean(raw.shared_enabled, true),
      dedicated_appid: dedicatedAppId,
      dedicated_app_secret: String(raw.dedicated_app_secret || '').trim(),
      dedicated_enabled: hasDedicatedEnabled
        ? this.toBoolean(raw.dedicated_enabled, false)
        : (!!dedicatedAppId),
      strict_appid_check: hasStrictCheck
        ? this.toBoolean(raw.strict_appid_check, false)
        : false
    };
  },

  getTenantMiniAppIntegration(tenantId) {
    const allConfigs = this.getAllTenantConfigs();
    const defaultRaw = allConfigs.default?.miniappIntegration || {};
    const tenantRaw = this.getTenantConfig(tenantId)?.miniappIntegration || {};
    return this.normalizeMiniAppIntegration({
      ...defaultRaw,
      ...tenantRaw
    });
  },

  assertTenantMiniAppAccess(tenantId) {
    const integration = this.getTenantMiniAppIntegration(tenantId);
    if (integration.active_mode !== 'dedicated') {
      return { ok: true };
    }
    if (!integration.dedicated_enabled) {
      return { ok: true };
    }
    if (!integration.strict_appid_check) {
      return { ok: true };
    }

    const currentAppId = this.getCurrentMiniProgramAppId();
    if (!currentAppId) {
      return {
        ok: false,
        message: '无法识别当前小程序，请稍后重试'
      };
    }
    if (!integration.dedicated_appid) {
      return {
        ok: false,
        message: '当前租户未配置自有小程序AppID'
      };
    }
    if (currentAppId !== integration.dedicated_appid) {
      return {
        ok: false,
        message: '当前小程序与租户绑定不匹配'
      };
    }
    return { ok: true };
  },

  setCurrentTenant(tenantId) {
    const normalizedTenantId = this.normalizeTenantId(tenantId);
    this.globalData.currentTenantId = normalizedTenantId;
    wx.setStorageSync(this.globalData.tenantStorageKey, normalizedTenantId);
    return normalizedTenantId;
  },

  initTenantFromOptions(options) {
    // 解析场景值（扫码进入时使用）
    let tenantIdFromOptions = options?.tenantId || options?.tid;
    
    // 检查是否在query对象中
    if (!tenantIdFromOptions && options?.query) {
      // 先尝试正常的 tenantId 和 tid
      tenantIdFromOptions = options.query.tenantId || options.query.tid;
      
      // 如果没有找到，尝试处理异常情况：query 对象的键可能是 "pages/index/index?tenantId"
      if (!tenantIdFromOptions) {
        for (const key in options.query) {
          if (key.includes('tenantId') || key.includes('tid')) {
            tenantIdFromOptions = options.query[key];
            break;
          }
        }
      }
    }
    
    if (!tenantIdFromOptions && options?.scene) {
      const sceneParams = this.parseScene(options.scene);
      tenantIdFromOptions = sceneParams.tid || sceneParams.tenantId;
    }

    // 只有 URL 参数或场景值明确传入了 tenantId 才使用并持久化
    if (tenantIdFromOptions) {
      this._tenantSelectedByParam = true;
      return this.setCurrentTenant(tenantIdFromOptions);
    }
    
    this._tenantSelectedByParam = false;
    const autoTenantId = this.applyAutoTenantByAppId();
    if (autoTenantId) {
      return autoTenantId;
    }

    const cachedTenantId = wx.getStorageSync(this.globalData.tenantStorageKey);
    if (cachedTenantId) {
      return this.setCurrentTenant(cachedTenantId);
    }

    return this.setCurrentTenant('default');
  },

  // 解析场景值参数（格式：tid=123&key=value）
  parseScene(scene) {
    const params = {};
    if (!scene || typeof scene !== 'string') {
      return params;
    }
    scene.split('&').forEach(item => {
      const [key, value] = item.split('=');
      if (key && value) {
        params[key] = decodeURIComponent(value);
      }
    });
    return params;
  },

  getCurrentTenantId() {
    this.applyAutoTenantByAppId();
    if (this.globalData.currentTenantId) {
      return this.globalData.currentTenantId;
    }
    // 如果没有设置租户ID，只返回默认值，不要重新初始化
    return 'default';
  },

  findDedicatedTenantByAppId(appId) {
    const normalizedAppId = String(appId || '').trim();
    if (!normalizedAppId) {
      return '';
    }
    const allConfigs = this.getAllTenantConfigs();
    const tenantIds = Object.keys(allConfigs || {});
    let fallbackTenantId = '';
    for (let i = 0; i < tenantIds.length; i++) {
      const tenantId = tenantIds[i];
      if (tenantId === 'default') {
        continue;
      }
      const integration = this.normalizeMiniAppIntegration(allConfigs[tenantId]?.miniappIntegration || {});
      if (!integration.dedicated_appid || integration.dedicated_appid !== normalizedAppId) {
        continue;
      }
      if (integration.active_mode === 'dedicated' && integration.dedicated_enabled) {
        return tenantId;
      }
      if (!fallbackTenantId) {
        fallbackTenantId = tenantId;
      }
    }
    return fallbackTenantId;
  },

  applyAutoTenantByAppId() {
    if (this._tenantSelectedByParam) {
      return '';
    }
    const currentTenantId = this.globalData.currentTenantId || 'default';
    if (currentTenantId !== 'default') {
      return '';
    }
    const appId = this.getCurrentMiniProgramAppId();
    const matchedTenantId = this.findDedicatedTenantByAppId(appId);
    if (matchedTenantId) {
      this.globalData._autoTenantBootFinished = true;
      this.setCurrentTenant(matchedTenantId);
      return matchedTenantId;
    }

    const allConfigs = this.getAllTenantConfigs();
    const tenantIds = Object.keys(allConfigs || {}).filter(id => id && id !== 'default');
    const hasDedicatedCandidates = tenantIds.some(id => {
      const integration = this.normalizeMiniAppIntegration(allConfigs[id]?.miniappIntegration || {});
      return !!integration.dedicated_appid;
    });

    if (!hasDedicatedCandidates) {
      return '';
    }

    this.globalData._autoTenantBootFinished = true;
    return '';
  },

  // 获取用户openId
  async getUserOpenId() {
    if (this.globalData.userOpenId) {
      return this.globalData.userOpenId;
    }
    
    try {
      const result = await wx.cloud.callFunction({
        name: 'getOpenId'
      });
      
      if (result.result && result.result.openId) {
        this.globalData.userOpenId = result.result.openId;
        return this.globalData.userOpenId;
      }
    } catch (err) {
      console.error('获取用户openId失败:', err);
    }
    
    return null;
  },

  // 检查用户是否是超级管理员（第一个用户自动成为超级管理员）
  async checkSuperAdmin() {
    const openId = await this.getUserOpenId();
    if (!openId) {
      return false;
    }
    
    // 固定的超级管理员 openId
    const SUPER_ADMIN_OPENID = 'ox19X48SOa4RevpGfOuKybAXBPSE';
    
    // 如果是固定的超级管理员，直接返回 true
    if (openId === SUPER_ADMIN_OPENID) {
      this.globalData.isSuperAdmin = true;
      this.globalData.userRole = 'super_admin';
      return true;
    }
    
    try {
      const db = wx.cloud.database();
      const result = await db.collection('tenant_admins')
        .where({
          role: 'super_admin'
        })
        .get();
      
      // 检查当前用户是否是超级管理员
      const isSuperAdmin = result.data.some(admin => admin.openId === openId);
      this.globalData.isSuperAdmin = isSuperAdmin;
      if (isSuperAdmin) {
        this.globalData.userRole = 'super_admin';
      }
      
      return isSuperAdmin;
    } catch (err) {
      console.error('检查超级管理员失败:', err);
      return false;
    }
  },

  // 检查用户是否是当前租户的管理员
  async checkTenantAdmin(tenantId) {
    const openId = await this.getUserOpenId();
    if (!openId) {
      return false;
    }
    
    const targetTenantId = tenantId || this.getCurrentTenantId();
    
    try {
      const db = wx.cloud.database();
      const result = await db.collection('tenant_admins')
        .where({
          tenantId: targetTenantId,
          openId: openId
        })
        .get();
      
      const isTenantAdmin = result.data.length > 0;
      this.globalData.isTenantAdmin = isTenantAdmin;
      
      if (isTenantAdmin && !this.globalData.userRole) {
        this.globalData.userRole = 'tenant_admin';
      }
      
      return isTenantAdmin;
    } catch (err) {
      console.error('检查租户管理员失败:', err);
      return false;
    }
  },

  // 初始化用户身份
  async initUserIdentity() {
    const openId = await this.getUserOpenId();
    const targetTenantId = arguments[0] || this.getCurrentTenantId();

    this.globalData.isSuperAdmin = false;
    this.globalData.isTenantAdmin = false;
    this.globalData.userRole = null;

    if (!openId) {
      return {
        openId: '',
        isSuperAdmin: false,
        isTenantAdmin: false,
        userRole: null
      };
    }

    try {
      const result = await wx.cloud.callFunction({
        name: 'getUserRole',
        data: {
          tenantId: targetTenantId
        }
      });
      const role = result.result || {};

      if (role.success) {
        this.globalData.userOpenId = role.openId || openId;
        this.globalData.isSuperAdmin = !!role.isSuperAdmin;
        this.globalData.isTenantAdmin = !!role.isTenantAdmin;
        this.globalData.userRole = role.userRole || null;
        return role;
      }
    } catch (err) {
      console.error('通过云函数初始化用户身份失败:', err);
    }

    await this.checkSuperAdmin();
    await this.checkTenantAdmin(targetTenantId);
    return {
      openId,
      isSuperAdmin: this.globalData.isSuperAdmin,
      isTenantAdmin: this.globalData.isTenantAdmin,
      userRole: this.globalData.userRole
    };
  },

  // 获取报名字段配置
  async getEnrollmentFields(tenantId) {
    const normalizedTenantId = tenantId || this.getCurrentTenantId();
    
    try {
      const db = wx.cloud.database()
      const result = await db.collection('enrollment_fields')
        .where({ tenantId: normalizedTenantId })
        .get()
      
      if (result.data.length > 0 && result.data[0].fields) {
        return result.data[0].fields
      }
    } catch (err) {
      console.error('获取报名字段配置失败:', err)
    }
    
    // 如果数据库没有，返回默认字段
    return this.globalData.defaultEnrollmentFields
  },

  // 获取电子协议内容
  async getAgreementContent(tenantId) {
    const normalizedTenantId = tenantId || this.getCurrentTenantId();
    
    try {
      const db = wx.cloud.database()
      const result = await db.collection('enrollment_fields')
        .where({ tenantId: normalizedTenantId })
        .get()
      
      if (result.data.length > 0 && result.data[0].agreementContent) {
        return result.data[0].agreementContent
      }
    } catch (err) {
      console.error('获取电子协议内容失败:', err)
    }
    
    // 如果数据库没有，返回默认内容
    return this.globalData.defaultAgreementContent
  },

  getTenantConfig(tenantId) {
    const normalizedTenantId = this.normalizeTenantId(tenantId || this.getCurrentTenantId());
    const allConfigs = this.getAllTenantConfigs();
    return allConfigs[normalizedTenantId] || allConfigs.default;
  },

  getTenantBrand(tenantId) {
    const allConfigs = this.getAllTenantConfigs();
    const defaultBrand = allConfigs.default?.brand || {};
    const tenantBrand = this.getTenantConfig(tenantId).brand || {};

    const result = {
      ...defaultBrand,
      ...tenantBrand
    };

    return result;
  },

  getTenantCategory(categoryKey, tenantId) {
    const allConfigs = this.getAllTenantConfigs();
    const config = this.getTenantConfig(tenantId);
    const defaultCategories = allConfigs.default?.categories || {};
    return config.categories?.[categoryKey] ?? defaultCategories[categoryKey];
  },

  getTenantQuickCategories(tenantId) {
    const allConfigs = this.getAllTenantConfigs();
    const defaultQuickCategories = allConfigs.default?.quickCategories || [];
    const quickCategories = this.getTenantConfig(tenantId).quickCategories;
    return Array.isArray(quickCategories) && quickCategories.length > 0 ? quickCategories : defaultQuickCategories;
  },

  getTenantBottomNavItems(tenantId) {
    const allConfigs = this.getAllTenantConfigs();
    const defaultBottomNavItems = Array.isArray(allConfigs.default?.bottomNavItems)
      ? allConfigs.default.bottomNavItems
      : [];
    const bottomNavItems = this.getTenantConfig(tenantId).bottomNavItems;

    if (!Array.isArray(defaultBottomNavItems) || defaultBottomNavItems.length === 0) {
      return Array.isArray(bottomNavItems) ? bottomNavItems : [];
    }

    return defaultBottomNavItems
      .map((defaultItem, index) => {
        const matchedItem = Array.isArray(bottomNavItems)
          ? (
              bottomNavItems.find(item => String(item?.key || '').trim() === String(defaultItem.key || '').trim())
              || bottomNavItems[index]
            )
          : null;

        const icon = String(matchedItem?.icon || defaultItem.icon || '').trim();
        const activeIcon = String(matchedItem?.activeIcon || defaultItem.activeIcon || icon).trim();
        const name = String(matchedItem?.name || defaultItem.name || '').trim();
        const url = String(matchedItem?.url || defaultItem.url || '').trim();

        if (!name || !icon || !url) {
          return null;
        }

        return {
          ...defaultItem,
          ...(matchedItem || {}),
          key: String(matchedItem?.key || defaultItem.key || `bottom_${index + 1}`).trim(),
          name,
          icon,
          activeIcon,
          url
        };
      })
      .filter(Boolean);
  },

  getTenantDetailTheme(tenantId) {
    const allConfigs = this.getAllTenantConfigs();
    const defaultTheme = allConfigs.default?.detailTheme || {};
    const tenantTheme = this.getTenantConfig(tenantId).detailTheme || {};
    return {
      ...defaultTheme,
      ...tenantTheme
    };
  },

  getTenantShareConfig(tenantId) {
    const allConfigs = this.getAllTenantConfigs();
    const defaultShare = allConfigs.default?.share || {};
    const tenantShare = this.getTenantConfig(tenantId).share || {};
    return {
      ...defaultShare,
      ...tenantShare
    };
  },

  getTenantHomeIcon(tenantId) {
    const config = this.getTenantConfig(tenantId);
    return config.homeIcon || ''; // 返回首页图标URL，如果没有配置则返回空字符串
  },

  normalizePostIds(value) {
    if (!Array.isArray(value)) {
      return [];
    }
    const ids = value.map(item => {
      if (typeof item === 'number') {
        return item;
      }
      if (typeof item === 'string' && /^\d+$/.test(item)) {
        return Number(item);
      }
      if (item && typeof item === 'object') {
        if (typeof item.ID === 'number') {
          return item.ID;
        }
        if (typeof item.id === 'number') {
          return item.id;
        }
      }
      return undefined;
    }).filter(Boolean);
    return [...new Set(ids)];
  },

  getTenantSectionStrategy(sectionKey, tenantId) {
    const config = this.getTenantConfig(tenantId);
    const allConfigs = this.getAllTenantConfigs();
    const defaultStrategy = allConfigs.default?.contentStrategy?.[sectionKey] || {};
    const tenantStrategy = config.contentStrategy?.[sectionKey] || {};
    const mode = tenantStrategy.mode || defaultStrategy.mode || 'category';
    const postIds = this.normalizePostIds(tenantStrategy.postIds || defaultStrategy.postIds || []);
    return {
      mode: mode === 'manual' ? 'manual' : 'category',
      postIds
    };
  },

  async fetchPostsByIds(postIds, tenantId, perPage = 10) {
    const ids = this.normalizePostIds(postIds).slice(0, perPage);
    if (ids.length === 0) {
      return [];
    }
    const posts = await this.request({
      url: `/posts?per_page=${ids.length}&_embed&include=${ids.join(',')}`,
      tenantId
    });
    const rows = Array.isArray(posts) ? posts : [];
    const rowMap = {};
    rows.forEach(item => {
      if (item?.id) {
        rowMap[item.id] = item;
      }
    });
    return ids.map(id => rowMap[id]).filter(Boolean);
  },

  async fetchPostsByCategory(categoryId, tenantId, perPage = 10) {
    if (!categoryId) {
      return [];
    }
    const posts = await this.request({
      url: `/posts?per_page=${perPage}&_embed&categories=${categoryId}`,
      tenantId
    });
    return Array.isArray(posts) ? posts : [];
  },

  async getTenantSectionPosts(sectionKey, options = {}) {
    const tenantId = options.tenantId || this.getCurrentTenantId();
    const perPage = options.perPage || 10;
    const strategy = this.getTenantSectionStrategy(sectionKey, tenantId);
    
    // 如果是手动模式且有指定文章ID
    if (strategy.mode === 'manual' && strategy.postIds.length > 0) {
      const manualPosts = await this.fetchPostsByIds(strategy.postIds, tenantId, perPage);
      if (manualPosts.length > 0) {
        return manualPosts;
      }
    }
    
    // 获取租户的分类ID
    const tenantCategoryId = this.getTenantCategory(sectionKey, tenantId);
    
    // 只获取当前租户的文章，不再 fallback 到 default
    let posts = await this.fetchPostsByCategory(tenantCategoryId, tenantId, perPage);
    
    return posts;
  },

  getAllTenantConfigs() {
    const localConfigs = this.globalData.tenantConfigs || {};
    const remoteConfigs = this.globalData.remoteTenantConfigs || {};

    const result = {
      ...localConfigs,
      ...remoteConfigs,
      default: {
        ...(localConfigs.default || {}),
        ...(remoteConfigs.default || {})
      }
    };

    return result;
  },

  getSiteBaseUrl() {
    return this.globalData.baseUrl.replace(/\/wp-json\/wp\/v2\/?$/, '');
  },

  getTenantConfigApiUrl() {
    return `${this.getSiteBaseUrl()}${this.globalData.tenantConfigApiPath}`;
  },

  getTenantConfigCptApiUrl() {
    return `${this.getSiteBaseUrl()}${this.globalData.tenantConfigCptApiPath}`;
  },

  getPostEnrollmentConfig(postId, tenantId) {
    const normalizedTenantId = this.normalizeTenantId(tenantId || this.getCurrentTenantId());
    const url = `${this.getSiteBaseUrl()}/wp-json/minip/v1/post-enrollment/${postId}?tenantId=${encodeURIComponent(normalizedTenantId)}`;

    return new Promise((resolve, reject) => {
      wx.request({
        url,
        method: 'GET',
        header: {
          'Content-Type': 'application/json'
        },
        success: (res) => {
          if (res.statusCode >= 200 && res.statusCode < 300 && res.data && !res.data.code) {
            resolve({
              enableEnrollment: !!res.data.enable_enrollment,
              enableAgreement: !!res.data.enable_agreement,
              agreementContent: typeof res.data.agreement_content === 'string' ? res.data.agreement_content : ''
            });
            return;
          }

          reject(new Error(res.data?.message || '加载文章报名配置失败'));
        },
        fail: reject
      });
    });
  },

  buildTenantConfigsFromCpt(items) {
    if (!Array.isArray(items)) {
      return {};
    }
    const configs = {};
    items.forEach(item => {
      const acf = item?.acf;
      if (!acf || typeof acf !== 'object' || Array.isArray(acf)) {
        return;
      }
      const tenantId = String(acf.tenant_id || '').trim();
      if (!tenantId) {
        return;
      }
      const toNumber = (value) => {
        const num = Number(value);
        return Number.isFinite(num) && num > 0 ? num : undefined;
      };
      const toLogoRef = (value) => {
        if (typeof value === 'string' && /^https?:\/\//i.test(value)) {
          return value;
        }
        if (typeof value === 'number' && value > 0) {
          return value;
        }
        if (typeof value === 'string' && /^\d+$/.test(value)) {
          return Number(value);
        }
        if (value && typeof value === 'object') {
          if (typeof value.url === 'string' && /^https?:\/\//i.test(value.url)) {
            return value.url;
          }
          if (typeof value.guid === 'string' && /^https?:\/\//i.test(value.guid)) {
            return value.guid;
          }
        }
        return '';
      };
      const toMediaRef = (value) => {
        if (typeof value === 'string' && /^https?:\/\//i.test(value)) {
          return value;
        }
        if (typeof value === 'number' && value > 0) {
          return value;
        }
        if (typeof value === 'string' && /^\d+$/.test(value)) {
          return Number(value);
        }
        if (value && typeof value === 'object') {
          if (typeof value.url === 'string' && /^https?:\/\//i.test(value.url)) {
            return value.url;
          }
          if (typeof value.guid === 'string' && /^https?:\/\//i.test(value.guid)) {
            return value.guid;
          }
        }
        return '';
      };
      const toIconRef = (value) => {
        if (typeof value === 'string' && /^https?:\/\//i.test(value)) {
          return value;
        }
        if (typeof value === 'number' && value > 0) {
          return value;
        }
        if (typeof value === 'string' && /^\d+$/.test(value)) {
          return Number(value);
        }
        if (value && typeof value === 'object') {
          if (typeof value.url === 'string' && value.url.trim()) {
            return value.url.trim();
          }
          if (typeof value.guid === 'string' && value.guid.trim()) {
            return value.guid.trim();
          }
          if (typeof value.sizes?.thumbnail === 'string' && value.sizes.thumbnail.trim()) {
            return value.sizes.thumbnail.trim();
          }
        }
        return typeof value === 'string' ? value.trim() : '';
      };
      // 解析首页布局配置
      let homeLayout = [];
      if (Array.isArray(acf.home_layout) && acf.home_layout.length > 0) {
        homeLayout = acf.home_layout.map(item => ({
          type: item.section_type || '',
          section_type: item.section_type || '',
          enabled: item.enabled !== false,
          title: item.title || ''
        })).filter(item => item.type);
      }

      // 解析快捷入口按钮配置（ACF免费版方案：使用独立字段）
      const aboutPostId = toNumber(acf.about_post_id);
      let quickCategories = [];
      let bottomNavItems = [];
      const activityCategoryDisplay = {};
      for (let i = 1; i <= 4; i++) {
        const name = acf[`quick_btn_${i}_name`];
        const icon = acf[`quick_btn_${i}_icon`];
        const url = acf[`quick_btn_${i}_url`];
        
        // 处理图标字段（可能是URL字符串、图片对象或媒体ID）
        let iconUrl = '';
        if (typeof icon === 'string' && /^https?:\/\//i.test(icon)) {
          iconUrl = icon;
        } else if (icon && typeof icon === 'object') {
          // ACF图片字段返回对象，尝试多种属性
          iconUrl = icon.url || icon.guid || icon.sizes?.thumbnail || '';
        } else if (typeof icon === 'number' && icon > 0) {
          iconUrl = icon;
        } else if (typeof icon === 'string' && icon.trim()) {
          // 其他字符串格式也尝试使用
          iconUrl = icon.trim();
        }
        
        // url 强制转为字符串，防止 ACF 返回纯数字类型或被截断
        let urlStr = String(url || '').trim();
        
        // 如果按钮url是旧的 /pages/about/about（不带postId），
        // 且租户配置了 about_post_id，自动替换为文章ID
        if (urlStr === '/pages/about/about' && aboutPostId) {
          urlStr = String(aboutPostId);
        }
        
        // 确保按钮四的URL处理与其他按钮一致，不受长度限制
        // 支持纯数字、post:数字、page:数字、category:数字等格式
        // 只要名称和链接存在就添加按钮（图标为空时降级显示默认图标）
        if (name && urlStr) {
          quickCategories.push({
            id: i,
            name: name,
            icon: iconUrl,
            url: urlStr
          });
        }
      }

      const strictAppIdCheckRaw = acf.strict_appid_check ?? acf.strit_appid_check;
      const dedicatedAppId = String(acf.dedicated_appid || '').trim();
      const normalizedAppId = dedicatedAppId.replace(/\s+/g, '');
      const miniappIntegration = this.normalizeMiniAppIntegration({
        active_mode: acf.active_mode,
        shared_enabled: acf.shared_enabled,
        dedicated_appid: normalizedAppId,
        dedicated_app_secret: acf.dedicated_app_secret,
        dedicated_enabled: acf.dedicated_enabled,
        strict_appid_check: strictAppIdCheckRaw
      });

      for (let i = 1; i <= 12; i++) {
        const categoryValue = acf[`activity_tab_cat_${i}`]
          ?? acf[`activity_recommend_cat_${i}`]
          ?? acf[`activity_category_${i}`]
          ?? acf[`activity_tab_category_${i}`];
        const enabledValue = acf[`activity_tab_cat_${i}_enabled`]
          ?? acf[`activity_recommend_cat_${i}_enabled`]
          ?? acf[`activity_category_${i}_enabled`]
          ?? acf[`activity_tab_category_${i}_enabled`];
        const categoryId = toNumber(categoryValue);
        if (!categoryId) {
          continue;
        }
        const enabled = enabledValue === undefined
          ? true
          : !(enabledValue === false || enabledValue === 0 || enabledValue === '0' || String(enabledValue).toLowerCase() === 'false');
        activityCategoryDisplay[String(categoryId)] = enabled;
      }

      if (Array.isArray(acf.activity_tab_rules)) {
        acf.activity_tab_rules.forEach(rule => {
          const categoryId = toNumber(rule?.category || rule?.category_id || rule?.cat_id);
          if (!categoryId) {
            return;
          }
          const enabledValue = rule?.enabled ?? rule?.is_enabled ?? rule?.show;
          const enabled = enabledValue === undefined
            ? true
            : !(enabledValue === false || enabledValue === 0 || enabledValue === '0' || String(enabledValue).toLowerCase() === 'false');
          activityCategoryDisplay[String(categoryId)] = enabled;
        });
      }

      for (let i = 1; i <= 4; i++) {
        const name = acf[`bottom_nav_${i}_name`];
        const icon = acf[`bottom_nav_${i}_icon`];
        const activeIcon = acf[`bottom_nav_${i}_active_icon`];
        const url = acf[`bottom_nav_${i}_url`];
        const key = acf[`bottom_nav_${i}_key`];

        const iconUrl = toIconRef(icon);
        const activeIconUrl = toIconRef(activeIcon);

        const urlStr = String(url || '').trim();
        if (name && urlStr) {
          bottomNavItems.push({
            key: String(key || `bottom_${i}`).trim(),
            name,
            icon: iconUrl,
            activeIcon: activeIconUrl,
            url: urlStr
          });
        }
      }

      configs[tenantId] = {
        brand: {
          appName: acf.app_name || '',
          logo: toLogoRef(acf.logo),
          slogan: acf.slogan || '',
          description: acf.description || ''
        },
        share: {
          title: acf.share_title || '',
          image: toMediaRef(acf.share_image)
        },
        detailTheme: {
          primaryColor: acf.primary_color || ''
        },
        homeIcon: toMediaRef(acf.home_icon), // 底部导航首页图标
        // 首页板块显示开关（ACF免费版方案）
        show_banner: acf.show_banner,
        show_categories: acf.show_categories,
        show_plans: acf.show_plans,
        show_topics: acf.show_topics,
        show_destinations: acf.show_destinations,
        show_cases: acf.show_cases,
        // 板块标题
        plans_title: acf.plans_title || '',
        topics_title: acf.topics_title || '',
        destinations_title: acf.destinations_title || '',
        cases_title: acf.cases_title || '',
        categories: {
          banner: toNumber(acf.cat_banner),
          headerBg: toNumber(acf.cat_header_bg),
          plans: toNumber(acf.cat_plans),
          destinations: toNumber(acf.cat_destinations),
          topics: toNumber(acf.cat_topics),
          cases: toNumber(acf.cat_cases),
          employee: toNumber(acf.cat_employee)
        },
        contentStrategy: {
          banner: { mode: acf.mode_banner || 'category', postIds: this.normalizePostIds(acf.posts_banner) },
          headerBg: { mode: acf.mode_header_bg || 'category', postIds: this.normalizePostIds(acf.posts_header_bg) },
          plans: { mode: acf.mode_plans || 'category', postIds: this.normalizePostIds(acf.posts_plans) },
          destinations: { mode: acf.mode_destinations || 'category', postIds: this.normalizePostIds(acf.posts_destinations) },
          topics: { mode: acf.mode_topics || 'category', postIds: this.normalizePostIds(acf.posts_topics) },
          cases: { mode: acf.mode_cases || 'category', postIds: this.normalizePostIds(acf.posts_cases) },
          employee: { mode: acf.mode_employee || 'category', postIds: this.normalizePostIds(acf.posts_employee) }
        },
        activityCategoryDisplay,
        miniappIntegration,
        homeLayout: homeLayout,
        quickCategories: quickCategories, // 新增：快捷入口按钮配置
        bottomNavItems: bottomNavItems,
        defaultEmployeeId: toNumber(acf.default_employee_id) // 新增：默认员工ID
      };
    });
    return configs;
  },

  resolveTenantMediaUrls(configs) {
    const mediaIdSet = new Set();
    Object.keys(configs || {}).forEach(tenantId => {
      const logoRef = configs[tenantId]?.brand?.logo;
      if (typeof logoRef === 'number' && logoRef > 0) {
        mediaIdSet.add(logoRef);
      }
      const shareImageRef = configs[tenantId]?.share?.image;
      if (typeof shareImageRef === 'number' && shareImageRef > 0) {
        mediaIdSet.add(shareImageRef);
      }
      const homeIconRef = configs[tenantId]?.homeIcon;
      if (typeof homeIconRef === 'number' && homeIconRef > 0) {
        mediaIdSet.add(homeIconRef);
      }
      // 收集快捷按钮图标的媒体ID
      const quickCategories = configs[tenantId]?.quickCategories || [];
      quickCategories.forEach(btn => {
        if (typeof btn.icon === 'number' && btn.icon > 0) {
          mediaIdSet.add(btn.icon);
        }
      });
      const bottomNavItems = configs[tenantId]?.bottomNavItems || [];
      bottomNavItems.forEach(item => {
        if (typeof item.icon === 'number' && item.icon > 0) {
          mediaIdSet.add(item.icon);
        }
        if (typeof item.activeIcon === 'number' && item.activeIcon > 0) {
          mediaIdSet.add(item.activeIcon);
        }
      });
    });
    const ids = Array.from(mediaIdSet);
    if (ids.length === 0) {
      return Promise.resolve(configs);
    }
    const mediaMap = {};
    const mediaUrl = `${this.globalData.baseUrl}/media?include=${ids.join(',')}&per_page=100`;
    return new Promise((resolve) => {
      wx.request({
        url: mediaUrl,
        method: 'GET',
        header: {
          'Content-Type': 'application/json'
        },
        success: (res) => {
          if (res.statusCode >= 200 && res.statusCode < 300 && Array.isArray(res.data)) {
            res.data.forEach(item => {
              if (item?.id && item?.source_url) {
                mediaMap[item.id] = item.source_url;
              }
            });
          }
        },
        complete: () => {
          const nextConfigs = { ...configs };
          
          Object.keys(nextConfigs).forEach(tenantId => {
            const tenant = nextConfigs[tenantId];
            const logoRef = tenant?.brand?.logo;
            const shareImageRef = tenant?.share?.image;
            const homeIconRef = tenant?.homeIcon;

            if (typeof logoRef === 'number') {
              const url = mediaMap[logoRef] || '';
              nextConfigs[tenantId] = {
                ...tenant,
                brand: {
                  ...(tenant.brand || {}),
                  logo: url
                }
              };
            }
            if (typeof shareImageRef === 'number') {
              const shareImageUrl = mediaMap[shareImageRef] || '';
              nextConfigs[tenantId] = {
                ...nextConfigs[tenantId],
                share: {
                  ...(nextConfigs[tenantId].share || {}),
                  image: shareImageUrl
                }
              };
            }
            if (typeof homeIconRef === 'number') {
              const homeIconUrl = mediaMap[homeIconRef] || '';
              nextConfigs[tenantId] = {
                ...nextConfigs[tenantId],
                homeIcon: homeIconUrl
              };
            }
            // 解析快捷按钮图标的媒体ID为URL
            const quickCategories = nextConfigs[tenantId]?.quickCategories || [];
            if (quickCategories.length > 0) {
              nextConfigs[tenantId].quickCategories = quickCategories.map(btn => {
                if (typeof btn.icon === 'number') {
                  return {
                    ...btn,
                    icon: mediaMap[btn.icon] || ''
                  };
                }
                return btn;
              });
            }
            const bottomNavItems = nextConfigs[tenantId]?.bottomNavItems || [];
            if (bottomNavItems.length > 0) {
              nextConfigs[tenantId].bottomNavItems = bottomNavItems.map(item => {
                const nextItem = { ...item };
                if (typeof item.icon === 'number') {
                  nextItem.icon = mediaMap[item.icon] || '';
                }
                if (typeof item.activeIcon === 'number') {
                  nextItem.activeIcon = mediaMap[item.activeIcon] || nextItem.icon || '';
                }
                return nextItem;
              });
            }
          });
          resolve(nextConfigs);
        }
      });
    });
  },

  ensureTenantConfigsLoaded() {
    if (this._tenantConfigsLoaded) {
      return Promise.resolve(this.globalData.remoteTenantConfigs || {});
    }
    if (this._tenantConfigsLoadingPromise) {
      return this._tenantConfigsLoadingPromise;
    }
    
    const apiUrl = this.getTenantConfigCptApiUrl();
    
    // 直接使用 CPT API，不再尝试旧的 tenant-configs API
    this._tenantConfigsLoadingPromise = new Promise((resolve) => {
      wx.request({
        url: apiUrl,
        method: 'GET',
        header: {
          'Content-Type': 'application/json'
        },
        success: (res) => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            const cptConfigs = this.buildTenantConfigsFromCpt(res.data);
            if (Object.keys(cptConfigs).length > 0) {
              this.resolveTenantMediaUrls(cptConfigs).then((resolvedConfigs) => {
                this.globalData.remoteTenantConfigs = resolvedConfigs;
                this._tenantConfigsLoaded = true;
                this.applyAutoTenantByAppId();
                resolve(resolvedConfigs);
              });
              return;
            }
          }
          resolve({});
        },
        fail: (err) => {
          console.error('加载租户配置失败:', err);
          resolve({});
        },
        complete: () => {
          this._tenantConfigsLoadingPromise = null;
        }
      });
    });
    return this._tenantConfigsLoadingPromise;
  },

  appendTenantToUrl(url, tenantId) {
    if (!url) {
      return '';
    }
    if (/([?&])tenantId=/.test(url)) {
      return url;
    }
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}tenantId=${encodeURIComponent(tenantId)}`;
  },

  appendAppIdToUrl(url, appId) {
    if (!url) {
      return '';
    }
    if (/([?&])appid=/.test(url) || /([?&])appId=/.test(url) || /([?&])APPID=/.test(url)) {
      return url;
    }
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}appid=${encodeURIComponent(appId)}`;
  },

  injectTenantToData(data, tenantId, method) {
    const upperMethod = String(method || 'GET').toUpperCase();
    if (upperMethod === 'GET' || data == null || typeof data !== 'object' || Array.isArray(data)) {
      return data;
    }
    if (Object.prototype.hasOwnProperty.call(data, 'tenantId')) {
      return data;
    }
    return {
      ...data,
      tenantId
    };
  },

  // 加载员工列表（支持租户隔离和fallback）
  async loadEmployeeList() {
    const tenantId = this.getCurrentTenantId();
    const cachedList = this.globalData.employeeListMap[tenantId];
    if (Array.isArray(cachedList) && cachedList.length > 0) {
      return cachedList;
    }

    try {
      // 使用 getTenantSectionPosts 方法，支持租户隔离和fallback
      const posts = await this.getTenantSectionPosts('employee', {
        tenantId,
        perPage: 20
      });

      const employeeList = Array.isArray(posts) ? posts.map(post => {
          const parsed = this.parseEmployeeExcerpt(post.excerpt?.rendered || '');
          return {
            id: post.id,
            name: this.stripHtml(post.title?.rendered || ''),
            title: parsed.title || '顾问',
            phone: parsed.phone || this.globalData.phone,
            avatar: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || this.globalData.defaultConsultant.avatar
          };
        }).filter(emp => emp.id) : []; // 过滤掉无效的员工
      
      this.globalData.employeeListMap[tenantId] = employeeList;
      this.globalData.employeeList = employeeList;
      return employeeList;
    } catch (err) {
      console.error('加载员工列表失败:', err);
      return [];
    }
  },

  // 根据ID获取员工信息
  async getEmployeeById(employeeId) {
    // 如果是默认顾问
    if (!employeeId || employeeId === 'default') {
      return this.globalData.defaultConsultant;
    }

    // 先尝试从缓存获取
    const list = await this.loadEmployeeList();
    const employee = list.find(e => String(e.id) === String(employeeId));

    if (employee) {
      return employee;
    }

    // 缓存中没有，单独请求
    try {
      const post = await this.request({
        url: `/posts/${employeeId}?_embed`,
        tenantId: this.getCurrentTenantId()
      });

      if (post && post.id && !post.code) {
        const parsed = this.parseEmployeeExcerpt(post.excerpt?.rendered || '');
        return {
          id: post.id,
          name: this.stripHtml(post.title?.rendered || ''),
          title: parsed.title || '顾问',
          phone: parsed.phone || this.globalData.phone,
          avatar: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || this.globalData.defaultConsultant.avatar
        };
      }
    } catch (err) {
      console.error('获取员工信息失败:', err);
    }

    // 获取失败返回默认顾问
    return this.globalData.defaultConsultant;
  },

  // 解析员工摘要（格式：职位|电话）
  parseEmployeeExcerpt(excerpt) {
    const text = this.stripHtml(excerpt).trim();
    const parts = text.split('|');
    return {
      title: parts[0]?.trim() || '',
      phone: parts[1]?.trim() || ''
    };
  },

  // 去除HTML标签
  stripHtml(html) {
    return html.replace(/<[^>]+>/g, '').replace(/\n/g, '').trim();
  },

  /**
   * 获取租户的首页布局配置（ACF免费版方案）
   */
  getTenantHomeLayout(tenantId) {
    const config = this.getTenantConfig(tenantId);
    
    // 默认布局
    const layout = [];
    
    // 轮播图（始终显示）
    if (config.show_banner !== false) {
      layout.push({ type: 'banner', enabled: true, title: '' });
    }
    
    // 快捷分类（始终显示）
    if (config.show_categories !== false) {
      layout.push({ type: 'categories', enabled: true, title: '' });
    }
    
    // 热门方案
    if (config.show_plans !== false) {
      layout.push({ 
        type: 'plans', 
        enabled: true, 
        title: config.plans_title || '热门方案' 
      });
    }
    
    // 热门专题
    if (config.show_topics !== false) {
      layout.push({ 
        type: 'topics', 
        enabled: true, 
        title: config.topics_title || '热门专题' 
      });
    }
    
    // 热门目的地
    if (config.show_destinations !== false) {
      layout.push({ 
        type: 'destinations', 
        enabled: true, 
        title: config.destinations_title || '热门目的地' 
      });
    }
    
    // 客户案例
    if (config.show_cases !== false) {
      layout.push({ 
        type: 'cases', 
        enabled: true, 
        title: config.cases_title || '客户案例' 
      });
    }
    
    // 如果没有任何配置，返回默认全部显示
    if (layout.length === 0) {
      return [
        { type: 'banner', enabled: true, title: '' },
        { type: 'categories', enabled: true, title: '' },
        { type: 'plans', enabled: true, title: '热门方案' },
        { type: 'topics', enabled: true, title: '热门专题' },
        { type: 'destinations', enabled: true, title: '热门目的地' },
        { type: 'cases', enabled: true, title: '客户案例' }
      ];
    }
    
    return layout;
  },

  /**
   * 获取板块的默认标题
   */
  getSectionDefaultTitle(sectionType) {
    const titles = {
      'banner': '',
      'categories': '',
      'plans': '热门方案',
      'topics': '热门专题',
      'destinations': '热门目的地',
      'cases': '客户案例'
    };
    return titles[sectionType] || '';
  },

  /**
   * 检查文章是否受限
   */
  isPostRestricted(post) {
    return post?.acf?.access_restricted === true || post?.meta?.access_restricted === '1';
  },

  /**
   * 检查员工是否有权限访问受限文章
   * 只要有 employeeId 就有权限
   */
  canAccessRestrictedPost(employeeId) {
    if (!employeeId || employeeId === 'default') {
      return false;
    }
    return true;
  },

  /**
   * 获取文章的访问权限状态
   */
  getPostAccessStatus(post, employeeId) {
    const isRestricted = this.isPostRestricted(post);
    const hasAccess = !isRestricted || this.canAccessRestrictedPost(employeeId);
    
    return {
      isRestricted,
      hasAccess,
      restrictReason: post?.acf?.restrict_reason || '暂无访问权限'
    };
  }
});
