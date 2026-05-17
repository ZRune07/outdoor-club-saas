// pages/index/index.js
const app = getApp();
const RECENT_ACTIVITY_FILE_ID_CANDIDATES = [
    'cloud://cloud1-d6g70npk2c69fe806.636c-cloud1-d6g70npk2c69fe806-1425981447/tupian/jinqihuodong.jpg',
    'cloud://cloud1-d6g70npk2c69fe806/tupian/jinqihuodong.jpg'
];
const RECENT_ACTIVITY_HTTP_CANDIDATES = [
    ''
];
const DEFAULT_AVATAR = 'https://tuanjiansaas-1256002767.cos.ap-chengdu.myqcloud.com/wp-content/uploads/2026/01/touxiang.png';

Page({
    data: {
        banners: [],
        headerBgImage: '',
        statusBarHeight: 20,
        currentBannerIndex: 0,
        tenantId: 'default',
        brand: {
            appName: '户外俱乐部',
            logo: '',
            slogan: '户外探险与运动专家',
            description: '提供专业的户外活动策划与执行服务'
        },
        categories: [],
        homeLayout: [],                // 首页布局配置
        sections: {},                  // 各板块数据
        hotPlans: [],
        hotDestinations: [],
        hotTopics: [],
        wonderfulCases: [],
        loading: true,
        // 员工名片相关
        consultant: null,              // 当前显示的顾问信息
        showEmployeeSelector: false,   // 是否显示员工选择弹窗
        employeeList: [],              // 员工列表
        isEmployee: false,             // 当前用户是否是员工
        currentEmployeeId: null,        // 当前URL传入的员工ID（用于分享）
        bottomNavItems: [],
        showSuperAdminBtn: false,
        showClubAdminBtn: false,
        showConsultantFloating: false,
        pageMode: 'home',
        recentActivityImage: '',
        recentActivityImageError: false,
        recentActivityImageRetry: 0,
        activityTabs: [],
        activeActivityTabId: '',
        activityCards: [],
        activityLoading: false,
        activityPostPool: []
    },

    async onLoad(options) {
        const pageMode = String(options?.mode || 'home') === 'function' ? 'function' : 'home';
        const hasTenantOptions = !!(
            options?.tenantId ||
            options?.tid ||
            options?.scene ||
            options?.query
        );
        const tenantId = hasTenantOptions
            ? app.initTenantFromOptions(options || {})
            : app.getCurrentTenantId();
        
        // 检查是否是绑定管理员的链接
        if (options.bindAdmin === 'true' && tenantId && tenantId !== 'default') {
            await this.bindTenantAdmin(tenantId, options.inviteToken);
        }
        
        // 隐藏tabBar
        wx.hideTabBar();
        // 获取状态栏和胶囊按钮信息
        const systemInfo = wx.getSystemInfoSync();
        const menuButton = wx.getMenuButtonBoundingClientRect();
        // 计算搜索栏顶部位置（胶囊按钮底部 + 间距）
        const headerTop = menuButton.bottom + 10;
        
        // 同步设置所有数据
        this.setData({
            statusBarHeight: systemInfo.statusBarHeight || 20,
            headerTop: headerTop,
            navBarTop: menuButton.top,
            navBarHeight: menuButton.height,
            navBarRight: systemInfo.windowWidth - menuButton.right,
            tenantId: tenantId,
            pageMode
        });
        
        // 应用租户上下文（先用默认配置）
        this.applyTenantContext();
        
        // 加载租户配置（此时租户ID已经正确设置）
        await app.ensureTenantConfigsLoaded();
        
        // 再次应用租户上下文（使用加载后的配置，包括正确的logo）
        this.applyTenantContext();
        
        // 获取首页布局配置
        const homeLayout = app.getTenantHomeLayout(tenantId);
        this.setData({ homeLayout });
        
        // 延迟执行，确保setData完成
        setTimeout(() => {
            // 根据布局配置加载内容
            this.loadContentByLayout();
            if (pageMode === 'home') {
                this.loadActivityFeed();
            } else {
                this.setData({
                    activityTabs: [],
                    activeActivityTabId: '',
                    activityCards: [],
                    activityLoading: false
                });
            }
            
            // 单独加载头部背景（不在布局配置中）
            this.loadHeaderBg();

            // 员工名片逻辑
            this.initConsultant(options);
        }, 100);

        this.resolveRecentActivityImage();
    },

    async bindTenantAdmin(tenantId, inviteToken) {
        try {
            if (!inviteToken) {
                wx.showModal({
                    title: '链接已失效',
                    content: '该邀请链接无效，请联系管理员重新生成。',
                    showCancel: false
                });
                return;
            }

            wx.showLoading({
                title: '绑定中...'
            });
            
            const result = await wx.cloud.callFunction({
                name: 'bindTenantAdmin',
                data: {
                    tenantId: tenantId,
                    inviteToken: inviteToken
                }
            });
            
            wx.hideLoading();
            
            if (result.result && result.result.success) {
                // 更新用户身份
                await app.checkTenantAdmin(tenantId);
                
                wx.showModal({
                    title: '绑定成功',
                    content: result.result.message,
                    showCancel: false,
                    confirmText: '确定',
                    success: () => {
                        // 刷新页面
                        this.onLoad({ tenantId: tenantId });
                    }
                });
            } else {
                wx.showModal({
                    title: '绑定失败',
                    content: result.result?.message || '绑定失败，请重试',
                    showCancel: false
                });
            }
        } catch (err) {
            wx.hideLoading();
            console.error('绑定租户管理员失败:', err);
            wx.showModal({
                title: '绑定失败',
                content: '网络错误，请重试',
                showCancel: false
            });
        }
    },

    applyTenantContext() {
        const tenantId = app.getCurrentTenantId();
        const brand = app.getTenantBrand(tenantId);
        const categories = app.getTenantQuickCategories(tenantId);
        const bottomNavItems = this.buildBottomNavItems(tenantId);

        this.setData({
            tenantId,
            brand,
            categories,
            bottomNavItems
        });

        if (brand.appName) {
            wx.setNavigationBarTitle({
                title: brand.appName
            });
        }
    },

    buildBottomNavItems(tenantId) {
        const navItems = (app.getTenantBottomNavItems(tenantId) || [])
            .filter(item => item?.key !== 'equipment');
        const pageMode = this.data.pageMode || 'home';
        return navItems.map(item => {
            const normalizedUrl = String(item.url || '').trim();
            let finalUrl = normalizedUrl;
            const isActive = pageMode === 'function'
                ? item.key === 'function'
                : item.key === 'home';

            if (item.key === 'home') {
                finalUrl = this.appendTenantToPageUrl('/pages/index/index?mode=home');
            } else if (item.key === 'function' || normalizedUrl === '__function__') {
                finalUrl = this.appendTenantToPageUrl('/pages/index/index?mode=function');
            } else if (normalizedUrl) {
                if (normalizedUrl.startsWith('/pages/')) {
                    finalUrl = this.appendTenantToPageUrl(normalizedUrl);
                } else if (/^\d+$/.test(normalizedUrl) || /^(?:post|page|category):/i.test(normalizedUrl)) {
                    finalUrl = normalizedUrl;
                }
            }

            return {
                ...item,
                url: finalUrl,
                isActive,
                currentIcon: isActive ? (item.activeIcon || item.icon) : item.icon
            };
        });
    },

    async loadPostsWithFallback(categoryKey, perPage = 10) {
        const tenantId = this.data.tenantId || app.getCurrentTenantId();
        const posts = await app.getTenantSectionPosts(categoryKey, {
            tenantId,
            perPage
        });
        return Array.isArray(posts) ? posts : [];
    },

    // 初始化顾问信息
    async initConsultant(options) {
        // 预加载员工列表（用于选择弹窗）
        const employeeList = await app.loadEmployeeList();
        this.setData({ employeeList });

        // 获取 URL 参数中的员工ID
        const urlEmployeeId = options?.employeeId;
        // 获取本地存储的员工ID（员工自己绑定的）
        const localEmployeeId = wx.getStorageSync('myEmployeeId');

        let consultant;
        let isEmployee = false;
        let currentEmployeeId = null;

        if (urlEmployeeId) {
            // URL 有参数，显示对应员工（客户访问或员工自己分享的链接）
            consultant = await app.getEmployeeById(urlEmployeeId);
            currentEmployeeId = urlEmployeeId;
            // 检查当前用户是否就是这个员工（本地绑定的ID与URL匹配）
            if (localEmployeeId && String(localEmployeeId) === String(urlEmployeeId)) {
                isEmployee = true;
            }
        } else if (localEmployeeId) {
            // 本地有绑定，显示自己的信息（员工场景）
            consultant = await app.getEmployeeById(localEmployeeId);
            currentEmployeeId = localEmployeeId;
            isEmployee = true;
        } else {
            // 都没有，使用租户配置的默认员工
            const tenantId = this.data.tenantId || app.getCurrentTenantId();
            const tenantConfig = app.getTenantConfig(tenantId);
            const defaultEmployeeId = tenantConfig.defaultEmployeeId;
            
            if (defaultEmployeeId) {
                // 租户配置了默认员工，使用该员工
                consultant = await app.getEmployeeById(defaultEmployeeId);
                currentEmployeeId = defaultEmployeeId;
            } else {
                // 租户没有配置，使用系统默认顾问
                consultant = app.globalData.defaultConsultant;
            }
        }

        this.setData({
            consultant,
            isEmployee,
            currentEmployeeId
        });
    },

    onPullDownRefresh() {
        const tasks = [
            this.loadContentByLayout(),
            this.loadHeaderBg()
        ];
        if (this.data.pageMode === 'home') {
            tasks.push(this.loadActivityFeed());
        }
        Promise.all(tasks).finally(() => {
            wx.stopPullDownRefresh();
        });
    },

    /**
     * 根据布局配置加载内容
     */
    async loadContentByLayout() {
        const { homeLayout } = this.data;
        this.setData({ loading: true });
        
        const sections = {};
        const loadPromises = [];
        
        // 根据布局配置加载对应的板块数据
        homeLayout.forEach((item) => {
            switch(item.type) {
                case 'banner':
                    loadPromises.push(
                        this.loadPostsWithFallback('banner', 5).then(posts => {
                            sections.banners = posts.map(post => ({
                                id: post.id,
                                image: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '',
                                title: post.title?.rendered || ''
                            })).filter(item => item.image); // 只显示有图片的
                        })
                    );
                    break;
                    
                case 'plans':
                    loadPromises.push(
                        this.loadPostsWithFallback('plans', 100).then(posts => {
                            sections.hotPlans = posts.map(post => ({
                                id: post.id,
                                title: post.title?.rendered || '',
                                excerpt: this.stripHtml(post.excerpt?.rendered || ''),
                                image: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || ''
                            }));
                        })
                    );
                    break;
                    
                case 'topics':
                    loadPromises.push(
                        this.loadPostsWithFallback('topics', 100).then(posts => {
                            sections.hotTopics = posts.map(post => ({
                                id: post.id,
                                title: post.title?.rendered || '',
                                excerpt: this.stripHtml(post.excerpt?.rendered || ''),
                                image: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || ''
                            }));
                        })
                    );
                    break;
                    
                case 'destinations':
                    loadPromises.push(
                        this.loadPostsWithFallback('destinations', 100).then(posts => {
                            sections.hotDestinations = posts.map(post => ({
                                id: post.id,
                                title: post.title?.rendered || '',
                                image: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || ''
                            }));
                        })
                    );
                    break;
                    
                case 'cases':
                    loadPromises.push(
                        this.loadPostsWithFallback('cases', 100).then(posts => {
                            sections.wonderfulCases = posts.map(post => ({
                                id: post.id,
                                title: post.title?.rendered || '',
                                image: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || ''
                            }));
                        })
                    );
                    break;
            }
        });
        
        // 等待所有数据加载完成
        await Promise.all(loadPromises);
        
        // 更新数据（同时更新旧的数据结构以保持兼容）
        this.setData({ 
            sections,
            banners: sections.banners || [],
            hotPlans: sections.hotPlans || [],
            hotTopics: sections.hotTopics || [],
            hotDestinations: sections.hotDestinations || [],
            wonderfulCases: sections.wonderfulCases || [],
            loading: false 
        });
    },

    // 轮播图切换事件
    onBannerChange(e) {
        this.setData({
            currentBannerIndex: e.detail.current
        });
    },

    // 加载轮播图
    async loadBanners() {
        try {
            const posts = await this.loadPostsWithFallback('banner', 5);

            if (posts && posts.length > 0) {
                this.setData({
                    banners: posts.map(post => ({
                        id: post.id,
                        image: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '/images/placeholder.png',
                        title: post.title?.rendered || ''
                    }))
                });
            }
        } catch (err) {
            console.error('加载轮播图失败:', err);
        }
    },

    // 加载头部背景图片
    async loadHeaderBg() {
        try {
            const posts = await this.loadPostsWithFallback('headerBg', 1);

            if (posts && posts.length > 0) {
                const bgImage = posts[0]._embedded?.['wp:featuredmedia']?.[0]?.source_url;
                if (bgImage) {
                    this.setData({ headerBgImage: bgImage });
                }
            } else {
                this.setData({ headerBgImage: '' });
            }
        } catch (err) {
            console.error('加载头部背景图失败:', err);
        }
    },

    // 加载所有内容
    async loadContent() {
        try {
            this.setData({ loading: true });

            // 并行加载所有内容
            const [plans, destinations, topics, cases] = await Promise.all([
                this.loadHotPlans(),
                this.loadHotDestinations(),
                this.loadHotTopics(),
                this.loadWonderfulCases()
            ]);

            this.setData({
                hotPlans: plans,
                hotDestinations: destinations,
                hotTopics: topics,
                wonderfulCases: cases,
                loading: false
            });
        } catch (err) {
            console.error('加载内容失败:', err);
            this.setData({ loading: false });
        }
    },

    // 加载热门目的地
    async loadHotDestinations() {
        try {
            const posts = await this.loadPostsWithFallback('destinations', 6);

            // 处理API返回，确保返回的是数组
            let processedPosts = [];
            if (Array.isArray(posts)) {
                processedPosts = posts;
            } else if (posts && typeof posts === 'object' && posts.length !== undefined) {
                processedPosts = posts;
            }

            if (processedPosts && processedPosts.length > 0) {
                return processedPosts.map(post => ({
                    id: post.id,
                    title: post.title?.rendered || '',
                    image: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '/images/placeholder.png'
                }));
            } else {
                return [];
            }
        } catch (err) {
            console.error('加载热门目的地失败:', err);
            return [];
        }
    },

    // 加载热门方案 (原热门专题位置，ID: 257)
    async loadHotPlans() {
        try {
            const posts = await this.loadPostsWithFallback('plans', 6);

            let processedPosts = [];
            if (Array.isArray(posts)) {
                processedPosts = posts;
            }

            if (processedPosts && processedPosts.length > 0) {
                return processedPosts.map(post => ({
                    id: post.id,
                    title: post.title?.rendered || '',
                    excerpt: this.stripHtml(post.excerpt?.rendered || ''),
                    image: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '/images/placeholder.png'
                }));
            } else {
                return [];
            }
        } catch (err) {
            console.error('加载热门方案失败:', err);
            return [];
        }
    },

    // 加载热门专题 (新 ID: 3320)
    async loadHotTopics() {
        try {
            const posts = await this.loadPostsWithFallback('topics', 100);

            let processedPosts = [];
            if (Array.isArray(posts)) {
                processedPosts = posts;
            }

            if (processedPosts && processedPosts.length > 0) {
                return processedPosts.map(post => ({
                    id: post.id,
                    title: post.title?.rendered || '',
                    excerpt: this.stripHtml(post.excerpt?.rendered || ''),
                    image: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '/images/placeholder.png'
                }));
            } else {
                return [];
            }
        } catch (err) {
            console.error('加载热门专题失败:', err);
            return [];
        }
    },

    // 加载客户案例 (ID: 256)
    async loadWonderfulCases() {
        try {
            const posts = await this.loadPostsWithFallback('cases', 10);

            let processedPosts = [];
            if (Array.isArray(posts)) {
                processedPosts = posts;
            }

            if (processedPosts && processedPosts.length > 0) {
                return processedPosts.map(post => ({
                    id: post.id,
                    title: post.title?.rendered || '',
                    image: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '/images/placeholder.png'
                }));
            } else {
                return [];
            }
        } catch (err) {
            console.error('加载精彩案例失败:', err);
            return [];
        }
    },

    // 去除HTML标签
    stripHtml(html) {
        return html.replace(/<[^>]+>/g, '').replace(/\n/g, '').trim().substring(0, 100);
    },

    async resolveRecentActivityImage() {
        try {
            this.setData({
                recentActivityImageError: false
            });
            if (!wx.cloud || typeof wx.cloud.getTempFileURL !== 'function') {
                this.setData({ recentActivityImage: RECENT_ACTIVITY_HTTP_CANDIDATES[0] || '' });
                return;
            }
            for (const fileID of RECENT_ACTIVITY_FILE_ID_CANDIDATES) {
                const res = await wx.cloud.getTempFileURL({
                    fileList: [fileID]
                });
                const fileInfo = res?.fileList?.[0];
                if (fileInfo?.status === 0 && fileInfo?.tempFileURL) {
                    this.setData({ recentActivityImage: fileInfo.tempFileURL });
                    return;
                }
            }
            const downloaded = await this.downloadRecentActivityImage();
            if (downloaded) {
                return;
            }
            if (RECENT_ACTIVITY_HTTP_CANDIDATES[0]) {
                this.setData({
                    recentActivityImage: RECENT_ACTIVITY_HTTP_CANDIDATES[0],
                    recentActivityImageError: false
                });
                return;
            }
            this.setData({
                recentActivityImage: '',
                recentActivityImageError: true
            });
        } catch (err) {
            console.error('近期活动图片解析失败:', err);
            const downloaded = await this.downloadRecentActivityImage();
            if (downloaded) {
                return;
            }
            if (RECENT_ACTIVITY_HTTP_CANDIDATES[0]) {
                this.setData({
                    recentActivityImage: RECENT_ACTIVITY_HTTP_CANDIDATES[0],
                    recentActivityImageError: false
                });
                return;
            }
            this.setData({
                recentActivityImage: '',
                recentActivityImageError: true
            });
        }
    },

    async downloadRecentActivityImage() {
        try {
            if (!wx.cloud || typeof wx.cloud.downloadFile !== 'function') {
                return false;
            }
            for (const fileID of RECENT_ACTIVITY_FILE_ID_CANDIDATES) {
                const result = await wx.cloud.downloadFile({
                    fileID
                });
                if (result?.tempFilePath) {
                    this.setData({
                        recentActivityImage: result.tempFilePath
                    });
                    return true;
                }
            }
            return false;
        } catch (err) {
            console.error('近期活动图片下载失败:', err);
            return false;
        }
    },

    async handleRecentActivityImageError() {
        const retryCount = Number(this.data.recentActivityImageRetry || 0);
        if (retryCount >= 1) {
            this.setData({
                recentActivityImage: '',
                recentActivityImageError: true
            });
            return;
        }
        this.setData({
            recentActivityImageRetry: retryCount + 1
        });
        const downloaded = await this.downloadRecentActivityImage();
        if (!downloaded) {
            this.setData({
                recentActivityImage: '',
                recentActivityImageError: true
            });
        }
    },

    decodeHtmlEntities(value) {
        return String(value || '')
            .replace(/&#8211;/g, '–')
            .replace(/&#8212;/g, '—')
            .replace(/&#8216;/g, '‘')
            .replace(/&#8217;/g, '’')
            .replace(/&#8220;/g, '“')
            .replace(/&#8221;/g, '”')
            .replace(/&amp;/g, '&')
            .replace(/&nbsp;/g, ' ')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, '\'');
    },

    parseDateText(value, isEnd = false) {
        if (!value) {
            return null;
        }

        if (value instanceof Date) {
            return value;
        }

        const text = String(value).trim();
        if (!text) {
            return null;
        }

        const direct = new Date(text);
        if (!Number.isNaN(direct.getTime())) {
            if (isEnd) {
                direct.setHours(23, 59, 59, 999);
            } else {
                direct.setHours(0, 0, 0, 0);
            }
            return direct;
        }

        const normalized = text
            .replace(/[年./]/g, '-')
            .replace(/[月]/g, '-')
            .replace(/[日]/g, '')
            .replace(/\s+/g, '');
        const monthDayMatch = normalized.match(/^(\d{1,2})-(\d{1,2})$/);
        if (!monthDayMatch) {
            return null;
        }

        const now = new Date();
        const year = now.getFullYear();
        const month = Number(monthDayMatch[1]);
        const day = Number(monthDayMatch[2]);
        const date = new Date(year, month - 1, day, isEnd ? 23 : 0, isEnd ? 59 : 0, isEnd ? 59 : 0, isEnd ? 999 : 0);
        if (Number.isNaN(date.getTime())) {
            return null;
        }
        return date;
    },

    formatDateRangeByWindow(startDate, endDate) {
        if (!startDate || !endDate) {
            return '';
        }
        const startMonth = startDate.getMonth() + 1;
        const startDay = startDate.getDate();
        const endMonth = endDate.getMonth() + 1;
        const endDay = endDate.getDate();
        return `${startMonth}.${startDay}-${endMonth}.${endDay}`;
    },

    extractDateRangeFromTitle(title) {
        const text = String(title || '').trim();
        const rangeMatch = text.match(/(\d{1,2}[.\-/月]\d{1,2})\s*[-~—–至到]+\s*(\d{1,2}[.\-/月]\d{1,2})/);
        if (!rangeMatch) {
            return null;
        }
        const startDate = this.parseDateText(rangeMatch[1], false);
        const endDate = this.parseDateText(rangeMatch[2], true);
        if (!startDate || !endDate) {
            return null;
        }
        return {
            startDate,
            endDate
        };
    },

    resolveActivityWindow(post, title) {
        const acf = post?.acf || {};
        const startRaw = acf.signup_start || acf.sign_up_start || acf.start_date || acf.event_start || acf.activity_start || '';
        const endRaw = acf.signup_end || acf.sign_up_end || acf.end_date || acf.event_end || acf.activity_end || '';
        const startDateFromAcf = this.parseDateText(startRaw, false);
        const endDateFromAcf = this.parseDateText(endRaw, true);

        if (startDateFromAcf && endDateFromAcf) {
            return {
                startDate: startDateFromAcf,
                endDate: endDateFromAcf,
                dateRange: this.formatDateRangeByWindow(startDateFromAcf, endDateFromAcf)
            };
        }

        const titleRange = this.extractDateRangeFromTitle(title);
        if (titleRange) {
            return {
                ...titleRange,
                dateRange: this.formatDateRangeByWindow(titleRange.startDate, titleRange.endDate)
            };
        }

        const fallbackStart = this.parseDateText(post?.date, false) || new Date();
        const fallbackEnd = new Date(fallbackStart.getTime() + 24 * 60 * 60 * 1000);
        fallbackEnd.setHours(23, 59, 59, 999);
        return {
            startDate: fallbackStart,
            endDate: fallbackEnd,
            dateRange: this.formatDateRangeByWindow(fallbackStart, fallbackEnd)
        };
    },

    resolveActivityStatus(startDate, endDate) {
        const now = Date.now();
        const start = startDate ? startDate.getTime() : null;
        const end = endDate ? endDate.getTime() : null;

        if (start && now < start) {
            return {
                statusKey: 'not_started',
                statusText: '未开启'
            };
        }

        if (end && now > end) {
            return {
                statusKey: 'ended',
                statusText: '已结束'
            };
        }

        return {
            statusKey: 'enrolling',
            statusText: '报名中'
        };
    },

    extractPostImages(post) {
        const featured = post?._embedded?.['wp:featuredmedia']?.[0]?.source_url || '';
        const content = String(post?.content?.rendered || '');
        const matches = [...content.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)]
            .map(item => item?.[1])
            .filter(Boolean);
        const merged = [featured, ...matches].filter(Boolean);
        const fallback = merged[0] || 'https://tuanjiansaas-1256002767.cos.ap-chengdu.myqcloud.com/wp-content/uploads/2026/01/touxiang.png';
        const unique = [...new Set(merged)];
        while (unique.length < 3) {
            unique.push(fallback);
        }
        return unique.slice(0, 3);
    },

    async loadEnrollmentStats(postIds = []) {
        const tenantId = this.data.tenantId || app.getCurrentTenantId();
        const validPostIds = (Array.isArray(postIds) ? postIds : [])
            .map(item => Number(item))
            .filter(item => Number.isFinite(item) && item > 0);

        if (validPostIds.length === 0 || !wx.cloud) {
            return {};
        }

        try {
            const result = await wx.cloud.callFunction({
                name: 'getActivityEnrollmentStats',
                data: {
                    tenantId,
                    postIds: validPostIds
                }
            });
            if (result?.result?.success) {
                return result.result.statsByPostId || {};
            }
            return {};
        } catch (err) {
            console.error('加载活动报名统计失败:', err);
            return {};
        }
    },

    buildActivityCards(posts = [], tabName = '推荐', statsByPostId = {}) {
        return (Array.isArray(posts) ? posts : []).map(post => {
            const title = this.decodeHtmlEntities(this.stripHtml(post?.title?.rendered || '未命名活动'));
            const windowInfo = this.resolveActivityWindow(post, title);
            const statusInfo = this.resolveActivityStatus(windowInfo.startDate, windowInfo.endDate);
            const images = this.extractPostImages(post);
            const postStat = statsByPostId[String(post?.id)] || {};
            const realCount = Number(postStat.count || 0);
            const realAvatarList = (Array.isArray(postStat.avatars) ? postStat.avatars : [])
                .map(item => String(item || '').trim())
                .filter(Boolean)
                .slice(0, 6);
            const avatarList = realAvatarList.length > 0 ? realAvatarList : [DEFAULT_AVATAR];
            const isEnrolled = !!postStat.isEnrolled;
            return {
                id: post.id,
                title,
                images,
                statusKey: statusInfo.statusKey,
                statusText: statusInfo.statusText,
                metaText: `${windowInfo.dateRange.replace('-', ' - ')} ｜ ${tabName}`,
                dateRange: windowInfo.dateRange,
                avatarList,
                isEnrolled,
                signupCount: realCount,
                signupText: `${realCount} 人报名`,
                actionText: isEnrolled ? '已报名' : (statusInfo.statusKey === 'enrolling' ? '报名' : statusInfo.statusText)
            };
        });
    },

    extractTenantCategoryTabs(posts = []) {
        const countById = {}
        const nameById = {}

        ;(Array.isArray(posts) ? posts : []).forEach(post => {
            const categoryIds = Array.isArray(post?.categories) ? post.categories : []
            categoryIds.forEach(rawId => {
                const id = String(Number(rawId || 0))
                if (!id || id === '0') {
                    return
                }
                countById[id] = (countById[id] || 0) + 1
            })

            const termGroups = post?._embedded?.['wp:term']
            if (Array.isArray(termGroups)) {
                termGroups.forEach(group => {
                    if (!Array.isArray(group)) {
                        return
                    }
                    group.forEach(term => {
                        if (term?.taxonomy !== 'category') {
                            return
                        }
                        const id = String(Number(term?.id || 0))
                        if (!id || id === '0') {
                            return
                        }
                        nameById[id] = this.decodeHtmlEntities(term?.name || nameById[id] || `分类${id}`)
                    })
                })
            }
        })

        return Object.keys(countById)
            .sort((a, b) => (countById[b] || 0) - (countById[a] || 0))
            .slice(0, 8)
            .map(id => ({
                id,
                name: nameById[id] || `分类${id}`
            }))
    },

    isActivityCategoryEnabled(categoryId, displayMap = {}) {
        const key = String(categoryId || '')
        if (!key || !Object.prototype.hasOwnProperty.call(displayMap, key)) {
            return true
        }
        const value = displayMap[key]
        if (value === false || value === 0 || value === '0') {
            return false
        }
        if (typeof value === 'string' && value.toLowerCase() === 'false') {
            return false
        }
        return true
    },

    filterActivityPoolByDisplayMap(posts = [], displayMap = {}) {
        const ruleKeys = Object.keys(displayMap || {})
        if (ruleKeys.length === 0) {
            return Array.isArray(posts) ? posts : []
        }
        return (Array.isArray(posts) ? posts : []).filter(post => {
            const categoryIds = Array.isArray(post?.categories) ? post.categories : []
            if (categoryIds.length === 0) {
                return false
            }
            return categoryIds.some(rawId => this.isActivityCategoryEnabled(String(Number(rawId || 0)), displayMap))
        })
    },

    async loadActivityCategoryDisplayMapFromTerms(posts = [], tenantId = '') {
        const categoryIdSet = new Set()
        ;(Array.isArray(posts) ? posts : []).forEach(post => {
            const categoryIds = Array.isArray(post?.categories) ? post.categories : []
            categoryIds.forEach(rawId => {
                const id = Number(rawId || 0)
                if (id > 0) {
                    categoryIdSet.add(id)
                }
            })
        })

        const ids = Array.from(categoryIdSet)
        if (ids.length === 0) {
            return {}
        }

        try {
            const termList = await app.request({
                url: `/categories?include=${ids.join(',')}&per_page=100&_fields=id,meta,show_in_recent_activity`,
                tenantId
            })
            const displayMap = {}
            ;(Array.isArray(termList) ? termList : []).forEach(term => {
                const key = String(Number(term?.id || 0))
                if (!key || key === '0') {
                    return
                }
                const raw = term?.show_in_recent_activity !== undefined
                    ? term?.show_in_recent_activity
                    : term?.meta?.show_in_recent_activity
                if (raw === undefined || raw === null || raw === '') {
                    return
                }
                const enabled = !(raw === false || raw === 0 || raw === '0' || String(raw).toLowerCase() === 'false')
                displayMap[key] = enabled
            })
            return displayMap
        } catch (err) {
            console.error('加载分类展示开关失败:', err)
            return {}
        }
    },

    async loadActivityFeed() {
        const tenantId = this.data.tenantId || app.getCurrentTenantId();
        this.setData({ activityLoading: true });
        try {
            const posts = await app.request({
                url: '/posts?per_page=50&_embed',
                tenantId
            });
            const tenantConfig = app.getTenantConfig(tenantId) || {}
            const activityCategoryDisplayByAcf = tenantConfig.activityCategoryDisplay || {}
            const activityCategoryDisplayByTerms = await this.loadActivityCategoryDisplayMapFromTerms(posts, tenantId)
            const activityCategoryDisplay = {
                ...activityCategoryDisplayByAcf,
                ...activityCategoryDisplayByTerms
            }
            const tabs = this.extractTenantCategoryTabs(posts)
                .filter(item => this.isActivityCategoryEnabled(item.id, activityCategoryDisplay))
            const filteredPosts = this.filterActivityPoolByDisplayMap(posts, activityCategoryDisplay)

            const fallbackTabs = [
                { id: 'recommend', name: '推荐' }
            ];
            const activityTabs = tabs.length > 0 ? fallbackTabs.concat(tabs).slice(0, 6) : fallbackTabs;
            const activeActivityTabId = activityTabs[0].id;
            this.setData({
                activityPostPool: filteredPosts,
                activityTabs,
                activeActivityTabId
            });
            await this.loadActivityCardsByTab(activeActivityTabId);
        } catch (err) {
            console.error('加载活动分类失败:', err);
            this.setData({
                activityPostPool: [],
                activityTabs: [{ id: 'recommend', name: '推荐' }],
                activeActivityTabId: 'recommend'
            });
            await this.loadActivityCardsByTab('recommend');
        }
    },

    async loadActivityCardsByTab(tabId) {
        const tab = (this.data.activityTabs || []).find(item => String(item.id) === String(tabId));
        const tabName = tab?.name || '推荐';
        try {
            const pool = Array.isArray(this.data.activityPostPool) ? this.data.activityPostPool : []
            const posts = String(tabId) === 'recommend'
                ? pool.slice(0, 20)
                : pool.filter(item => (Array.isArray(item?.categories) ? item.categories : []).map(id => String(id)).includes(String(tabId))).slice(0, 20)
            const postIds = (Array.isArray(posts) ? posts : []).map(item => item?.id).filter(Boolean);
            const statsByPostId = await this.loadEnrollmentStats(postIds);
            const cards = this.buildActivityCards(posts, tabName, statsByPostId);
            this.setData({
                activityCards: cards,
                activityLoading: false
            });
        } catch (err) {
            console.error('加载活动列表失败:', err);
            this.setData({
                activityCards: [],
                activityLoading: false
            });
        }
    },

    switchActivityTab(e) {
        const tabId = String(e.currentTarget.dataset.id || '');
        if (!tabId || tabId === this.data.activeActivityTabId) {
            return;
        }
        this.setData({
            activeActivityTabId: tabId,
            activityCards: [],
            activityLoading: true
        });
        this.loadActivityCardsByTab(tabId);
    },

    navigateToCategory(e) {
        const rawUrl = e.currentTarget.dataset.url;
        const originalUrl = String(rawUrl || '').trim(); // 强制转为字符串，防止ACF返回数字类型
        const tenantId = this.data.tenantId || app.getCurrentTenantId();

        // ✅ 支持简化写法：
        //   纯数字          → 内容页（about页面），如 "123"
        //   category:数字   → 产品分类页，如 "category:36"
        //   post:数字       → 内容页（明确指定），如 "post:123"
        //   page:数字       → 内容页（明确指定），如 "page:123"
        //   其余            → 原有逻辑（完整路径 或 外部URL）

        // 纯数字
        if (/^\d+$/.test((originalUrl || '').trim())) {
            const postId = originalUrl.trim();
            wx.navigateTo({
                url: `/pages/about/about?postId=${postId}&tenantId=${tenantId}`
            });
            return;
        }

        // post:ID 或 page:ID
        const postMatch = /^(?:post|page):(\d+)$/i.exec((originalUrl || '').trim());
        if (postMatch) {
            const postId = postMatch[1];
            wx.navigateTo({
                url: `/pages/about/about?postId=${postId}&tenantId=${tenantId}`
            });
            return;
        }

        // category:ID
        const catMatch = /^category:(\d+|case)$/i.exec((originalUrl || '').trim());
        if (catMatch) {
            const catId = catMatch[1];
            if (catId === 'case') {
                this.openVideoChannel();
            } else {
                wx.navigateTo({
                    url: `/pages/products/products?category=${catId}&tenantId=${tenantId}`
                });
            }
            return;
        }

        // 以下为原有完整路径逻辑（向后兼容）
        const url = this.appendTenantToPageUrl(originalUrl);

        // Handle external URLs (http/https)
        if (url.startsWith('http://') || url.startsWith('https://')) {
            wx.navigateTo({
                url: `/pages/webview/webview?url=${encodeURIComponent(url)}`
            });
            return;
        }

        // Handle Game Case (Video Channel)
        if (url.includes('category=case')) {
            this.openVideoChannel();
            return;
        }

        // Handle Products with category params - 直接带参数跳转
        if (url.includes('/pages/products/products')) {
            wx.navigateTo({ url: url });
            return;
        }

        // Default navigation
        wx.navigateTo({ url });
    },

    // 导航到产品详情
    navigateToDetail(e) {
        const id = e.currentTarget.dataset.id;
        const tenantId = this.data.tenantId || app.getCurrentTenantId();
        wx.navigateTo({
            url: `/pages/detail/detail?id=${id}&tenantId=${tenantId}`
        });
    },

    goToSectionList(e) {
        const section = e.currentTarget.dataset.section;
        if (!section) {
            return;
        }
        const tenantId = this.data.tenantId || app.getCurrentTenantId();
        const homeLayout = this.data.homeLayout || [];
        const sectionItem = homeLayout.find(item => item.type === section);
        const title = sectionItem?.title || '';
        wx.navigateTo({
            url: `/pages/section/section?section=${section}&tenantId=${tenantId}&title=${encodeURIComponent(title)}`
        });
    },

    // 拨打电话 - 使用当前顾问的电话
    callConsultant() {
        const phone = this.data.consultant?.phone || app.globalData.phone;
        wx.makePhoneCall({
            phoneNumber: phone
        });
    },

    handleBottomNavTap(e) {
        const index = Number(e.currentTarget.dataset.index);
        const item = this.data.bottomNavItems[index];
        if (!item) {
            return;
        }

        if (item.key === 'home') {
            if (this.data.pageMode === 'home') {
                wx.pageScrollTo({
                    scrollTop: 0,
                    duration: 300
                });
                return;
            }
            wx.reLaunch({
                url: this.appendTenantToPageUrl('/pages/index/index?mode=home')
            });
            return;
        }

        if (item.key === 'function') {
            if (this.data.pageMode === 'function') {
                wx.pageScrollTo({
                    scrollTop: 0,
                    duration: 300
                });
                return;
            }
            wx.reLaunch({
                url: this.appendTenantToPageUrl('/pages/index/index?mode=function')
            });
            return;
        }

        if (item.key === 'equipment') {
            wx.showToast({
                title: '装备商城暂未开放',
                icon: 'none'
            });
            return;
        }

        if (item.url) {
            this.navigateByBottomNav(item.url);
        }
    },

    navigateByBottomNav(url) {
        const targetUrl = String(url || '').trim();
        if (!targetUrl) {
            return;
        }

        if (targetUrl.startsWith('/pages/index/index')) {
            wx.pageScrollTo({
                scrollTop: 0,
                duration: 300
            });
            return;
        }

        if (targetUrl.startsWith('/pages/')) {
            wx.redirectTo({
                url: targetUrl
            });
            return;
        }

        if (/^\d+$/.test(targetUrl) || /^(?:post|page|category):/i.test(targetUrl)) {
            this.navigateToCategory({
                currentTarget: {
                    dataset: {
                        url: targetUrl
                    }
                }
            });
        }
    },

    scrollToFunctionSection() {
        wx.pageScrollTo({
            selector: '#homeCategories',
            duration: 300,
            fail: () => {
                wx.showToast({
                    title: '当前页面暂无功能入口',
                    icon: 'none'
                });
            }
        });
    },

    // 打开视频号
    openVideoChannel() {
        wx.openChannelsUserProfile({
            finderUserName: 'sphANs9BBDJnCnE', // 视频号 ID
            fail: (err) => {
                console.error('打开视频号失败', err);
                wx.showToast({
                    title: '无法打开视频号',
                    icon: 'none'
                });
            }
        });
    },

    // 分享给朋友 - 带上员工ID参数
    onShareAppMessage() {
        const tenantId = this.data.tenantId || app.getCurrentTenantId();
        const share = app.getTenantShareConfig(tenantId);
        const brand = this.data.brand || app.getTenantBrand(tenantId);
        const employeeId = this.data.currentEmployeeId || this.data.consultant?.id;
        
        let path = '/pages/index/index';
        const params = [];
        if (tenantId && tenantId !== 'default') {
            params.push(`tenantId=${tenantId}`);
        }
        if (employeeId && employeeId !== 'default') {
            params.push(`employeeId=${employeeId}`);
        }
        if (params.length > 0) {
            path += `?${params.join('&')}`;
        }
        
        // 使用租户配置的分享标题，如果没有则使用：小程序名称 - 品牌标语
        const defaultTitle = brand.slogan 
            ? `${brand.appName} - ${brand.slogan}`
            : brand.appName;
        
        return {
            title: share.title || defaultTitle,
            path: path,
            imageUrl: share.image || '/images/fenxiang.jpg'
        };
    },

    // 分享到朋友圈 - 带上员工ID参数
    onShareTimeline() {
        const tenantId = this.data.tenantId || app.getCurrentTenantId();
        const share = app.getTenantShareConfig(tenantId);
        const brand = this.data.brand || app.getTenantBrand(tenantId);
        const employeeId = this.data.currentEmployeeId || this.data.consultant?.id;
        
        const queryParts = [];
        if (tenantId && tenantId !== 'default') {
            queryParts.push(`tenantId=${tenantId}`);
        }
        if (employeeId && employeeId !== 'default') {
            queryParts.push(`employeeId=${employeeId}`);
        }
        
        // 使用租户配置的分享标题，如果没有则使用：小程序名称 - 品牌标语
        const defaultTitle = brand.slogan 
            ? `${brand.appName} - ${brand.slogan}`
            : brand.appName;
        
        return {
            title: share.title || defaultTitle,
            query: queryParts.join('&'),
            imageUrl: share.image || '/images/fenxiang.jpg'
        };
    },

    // 跳转到咨询页面
    goToContact() {
        const tenantId = this.data.tenantId || app.getCurrentTenantId();
        wx.navigateTo({
            url: `/pages/contact/contact?tenantId=${tenantId}`
        });
    },

    appendTenantToPageUrl(url) {
        if (!url || url.startsWith('http://') || url.startsWith('https://')) {
            return url;
        }
        if (url.includes('tenantId=')) {
            return url;
        }
        const tenantId = this.data.tenantId || app.getCurrentTenantId();
        const separator = url.includes('?') ? '&' : '?';
        return `${url}${separator}tenantId=${tenantId}`;
    },

    // ========== 员工选择相关方法 ==========

    // 显示员工选择弹窗
    showEmployeeSelector() {
        this.setData({ showEmployeeSelector: true });
    },

    // 隐藏员工选择弹窗
    hideEmployeeSelector() {
        this.setData({ showEmployeeSelector: false });
    },

    // 阻止弹窗冒泡
    preventBubble() {
        // 空方法，用于阻止点击弹窗内容时关闭弹窗
    },

    async onShow() {
        await app.initUserIdentity(this.data.tenantId || app.getCurrentTenantId());
        this.checkAdminStatus();
        if (this.data.pageMode === 'home' && this.data.activeActivityTabId) {
            this.loadActivityCardsByTab(this.data.activeActivityTabId);
        }
        
        // 延迟检查，等待身份初始化完成
        setTimeout(() => {
            this.checkAdminStatus();
        }, 1000);
        
        setTimeout(() => {
            this.checkAdminStatus();
        }, 3000);
    },

    checkAdminStatus() {
        const isSuperAdmin = app.globalData.isSuperAdmin;
        const isTenantAdmin = app.globalData.isTenantAdmin;

        this.setData({
            showSuperAdminBtn: isSuperAdmin,
            showClubAdminBtn: isSuperAdmin || isTenantAdmin
        });
    },

    goToSuperAdmin() {
        if (app.globalData.isSuperAdmin) {
            wx.navigateTo({
                url: '/pages/super-admin/super-admin'
            });
        }
    },

    goToClubAdmin() {
        if (app.globalData.isSuperAdmin || app.globalData.isTenantAdmin) {
            wx.navigateTo({
                url: '/pages/tenant-admin/tenant-admin'
            });
        }
    },

    // 选择员工（绑定自己身份）
    async selectEmployee(e) {
        const employeeId = e.currentTarget.dataset.id;

        // 存储到本地
        wx.setStorageSync('myEmployeeId', employeeId);

        // 获取员工信息
        const consultant = await app.getEmployeeById(employeeId);

        this.setData({
            consultant,
            isEmployee: true,
            currentEmployeeId: employeeId,
            showEmployeeSelector: false
        });

        wx.showToast({
            title: '身份绑定成功',
            icon: 'success'
        });
    },

    // 清除员工绑定（恢复默认）
    async clearEmployeeBinding() {
        wx.removeStorageSync('myEmployeeId');

        const tenantId = this.data.tenantId || app.getCurrentTenantId();
        const tenantConfig = app.getTenantConfig(tenantId);
        const defaultEmployeeId = tenantConfig.defaultEmployeeId;
        const consultant = defaultEmployeeId
            ? await app.getEmployeeById(defaultEmployeeId)
            : app.globalData.defaultConsultant;

        this.setData({
            consultant,
            isEmployee: false,
            currentEmployeeId: defaultEmployeeId || null,
            showEmployeeSelector: false
        });

        wx.showToast({
            title: '已恢复默认',
            icon: 'success'
        });
    }

});
