const app = getApp();

Page({
    data: {
        section: '',
        title: '',
        cardType: '',
        tenantId: 'default',
        items: [],
        loading: true
    },

    async onLoad(options) {
        await app.ensureTenantConfigsLoaded();
        const tenantId = app.initTenantFromOptions(options || {});
        const section = options.section || 'plans';
        const title = options.title ? decodeURIComponent(options.title) : '';
        const config = this.getSectionConfig(section);
        const finalTitle = title || config.title;
        this.setData({
            section,
            title: finalTitle,
            cardType: config.cardType,
            tenantId
        });
        wx.setNavigationBarTitle({ title: finalTitle });
        this.loadSection(config.categoryKey);
    },

    getSectionConfig(section) {
        const map = {
            plans: { title: '热门方案', categoryKey: 'plans', cardType: 'plan' },
            topics: { title: '热门专题', categoryKey: 'topics', cardType: 'topic' },
            destinations: { title: '热门目的地', categoryKey: 'destinations', cardType: 'destination' },
            cases: { title: '客户案例', categoryKey: 'cases', cardType: 'case' }
        };
        return map[section] || map.plans;
    },

    async loadSection(categoryKey) {
        try {
            this.setData({ loading: true });
            const tenantId = this.data.tenantId || app.getCurrentTenantId();
            const posts = await app.getTenantSectionPosts(categoryKey, {
                tenantId,
                perPage: 100
            });
            const processedPosts = Array.isArray(posts) ? posts : [];
            const items = processedPosts.map(post => ({
                id: post.id,
                title: post.title?.rendered || '',
                image: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '/images/placeholder.png'
            }));
            this.setData({
                items,
                loading: false
            });
        } catch (err) {
            console.error('加载列表失败:', err);
            this.setData({ loading: false });
        }
    },

    navigateToDetail(e) {
        const id = e.currentTarget.dataset.id;
        const tenantId = this.data.tenantId || app.getCurrentTenantId();
        wx.navigateTo({
            url: `/pages/detail/detail?id=${id}&tenantId=${tenantId}`
        });
    },

    // 分享给朋友
    onShareAppMessage() {
        const tenantId = this.data.tenantId || app.getCurrentTenantId();
        const share = app.getTenantShareConfig(tenantId);
        const brand = app.getTenantBrand(tenantId);
        const defaultTitle = brand.appName ? `${this.data.title} - ${brand.appName}` : this.data.title;
        
        return {
            title: share.title || defaultTitle,
            path: `/pages/section/section?section=${this.data.section}&tenantId=${tenantId}`,
            imageUrl: share.image || '/images/fenxiang.jpg'
        };
    },

    // 分享到朋友圈
    onShareTimeline() {
        const tenantId = this.data.tenantId || app.getCurrentTenantId();
        const share = app.getTenantShareConfig(tenantId);
        const brand = app.getTenantBrand(tenantId);
        const defaultTitle = brand.appName ? `${this.data.title} - ${brand.appName}` : this.data.title;
        
        return {
            title: share.title || defaultTitle,
            query: `section=${this.data.section}&tenantId=${tenantId}`,
            imageUrl: share.image || '/images/fenxiang.jpg'
        };
    }
});
