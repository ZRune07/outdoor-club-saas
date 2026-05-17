// pages/products/products.js
const app = getApp();

Page({
    data: {
        categories: [
            { id: 'all', name: '全部', slug: '' }
        ],
        activeCategory: 'all',
        parentCategoryId: null, // 存储父分类ID
        products: [],
        loading: true,
        page: 1,
        hasMore: true,
        searchMode: false,
        searchKeyword: '',
        simpleMode: false, // 简洁模式：隐藏搜索和分类
        pageTitle: '精选产品',
        categoriesLoading: true,
        tenantId: 'default'
    },

    async onLoad(options) {
        await app.ensureTenantConfigsLoaded();
        const tenantId = app.initTenantFromOptions(options || {});
        const sandboxCategoryId = String(app.getTenantCategory('sandbox', tenantId));
        this.setData({ tenantId });

        if (options.category) {
            this.setData({ 
                activeCategory: options.category,
                parentCategoryId: options.category // 保存父分类ID
            });

            // 沙盘体验特殊处理
            if (String(options.category) === sandboxCategoryId) {
                this.setData({
                    simpleMode: true,
                    pageTitle: '沙盘体验'
                });
                wx.setNavigationBarTitle({ title: '沙盘体验' });
            }
        }
        if (options.search) {
            this.setData({ searchMode: true });
        }
        
        // 先加载分类，再加载产品
        this.loadCategories().then(() => {
            this.loadProducts();
        });
    },

    onShow() {
        // Check if there is a category passed from homepage via globalData
        if (app.globalData.selectedCategory) {
            const category = app.globalData.selectedCategory;
            app.globalData.selectedCategory = null; // Clear it

            if (this.data.activeCategory != category) {
                this.setData({
                    activeCategory: category,
                    page: 1,
                    hasMore: true,
                    products: []
                });
                this.loadProducts();
            }
        }
    },

    onPullDownRefresh() {
        this.setData({ page: 1, hasMore: true });
        this.loadProducts().then(() => {
            wx.stopPullDownRefresh();
        });
    },

    onReachBottom() {
        if (this.data.hasMore && !this.data.loading) {
            this.loadMore();
        }
    },

    // 加载分类列表
    async loadCategories() {
        try {
            this.setData({ categoriesLoading: true });
            
            let categories = [{ id: 'all', name: '全部', slug: '' }];
            
            // 如果有父分类ID，只加载该父分类下的子分类
            if (this.data.parentCategoryId && this.data.parentCategoryId !== 'all') {
                const parentId = this.data.parentCategoryId;
                
                // 从 WordPress 获取指定父分类下的子分类
                const subCategories = await app.request({
                    url: `/categories?parent=${parentId}&per_page=100&orderby=id&order=asc`,
                    tenantId: this.data.tenantId
                });
                
                console.log('子分类数据:', subCategories);
                
                // 如果有子分类，添加到列表中
                if (subCategories && subCategories.length > 0) {
                    const filteredCategories = subCategories.filter(cat => {
                        return cat.slug !== 'uncategorized' && cat.count > 0;
                    });
                    
                    categories = [
                        { id: 'all', name: '全部', slug: '' },
                        ...filteredCategories.map(cat => ({
                            id: cat.id,
                            name: cat.name,
                            slug: cat.slug,
                            count: cat.count
                        }))
                    ];
                }

                // 查询父分类名称，更新页面标题
                try {
                    const parentCat = await app.request({
                        url: `/categories/${parentId}`,
                        tenantId: this.data.tenantId
                    });
                    if (parentCat && parentCat.name) {
                        const title = parentCat.name;
                        this.setData({ pageTitle: title });
                        wx.setNavigationBarTitle({ title });
                    }
                } catch (e) { /* 查询失败不影响主流程 */ }
            }
            
            this.setData({
                categories: categories,
                categoriesLoading: false
            });
            
            console.log('分类加载成功:', categories);
        } catch (err) {
            console.error('加载分类失败:', err);
            // 加载失败时使用默认分类
            this.setData({
                categories: [{ id: 'all', name: '全部', slug: '' }],
                categoriesLoading: false
            });
        }
    },

    // 切换分类
    switchCategory(e) {
        const category = e.currentTarget.dataset.category;
        this.setData({
            activeCategory: category,
            page: 1,
            hasMore: true,
            products: []
        });
        this.loadProducts();
    },

    // 加载产品
    async loadProducts() {
        try {
            this.setData({ loading: true });

            let url = `/posts?per_page=10&page=${this.data.page}&_embed`;

            // 如果有分类筛选
            if (this.data.activeCategory !== 'all') {
                // 如果是纯数字，直接作为ID使用
                if (!isNaN(this.data.activeCategory)) {
                    url += `&categories=${this.data.activeCategory}`;
                } else {
                    // 否则作为slug处理，先获取分类ID
                    const categories = await app.request({
                        url: `/categories?slug=${this.data.activeCategory}`,
                        tenantId: this.data.tenantId
                    });
                    if (categories && categories.length > 0) {
                        url += `&categories=${categories[0].id}`;
                    }
                }
            } else if (this.data.parentCategoryId && this.data.parentCategoryId !== 'all') {
                // 如果选择"全部"，但有父分类ID，则显示父分类下的所有文章
                url += `&categories=${this.data.parentCategoryId}`;
            }

            // 如果有搜索关键词
            if (this.data.searchKeyword) {
                url += `&search=${encodeURIComponent(this.data.searchKeyword)}`;
            }

            const posts = await app.request({
                url,
                tenantId: this.data.tenantId
            });

            const products = posts.map(post => ({
                id: post.id,
                title: post.title?.rendered || '',
                excerpt: this.stripHtml(post.excerpt?.rendered || ''),
                image: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '/images/placeholder.png',
                date: post.date
            }));

            this.setData({
                products: this.data.page === 1 ? products : [...this.data.products, ...products],
                loading: false,
                hasMore: products.length === 10
            });
        } catch (err) {
            console.error('加载产品失败:', err);
            this.setData({ loading: false });
        }
    },

    // 加载更多
    loadMore() {
        this.setData({ page: this.data.page + 1 });
        this.loadProducts();
    },

    // 去除HTML标签
    stripHtml(html) {
        return html.replace(/<[^>]+>/g, '').replace(/\n/g, '').trim().substring(0, 60);
    },

    // 搜索输入
    onSearchInput(e) {
        this.setData({ searchKeyword: e.detail.value });
    },

    // 执行搜索
    onSearch() {
        this.setData({ page: 1, hasMore: true, products: [] });
        this.loadProducts();
    },

    // 导航到详情
    navigateToDetail(e) {
        const id = e.currentTarget.dataset.id;
        const tenantId = this.data.tenantId || app.getCurrentTenantId();
        wx.navigateTo({
            url: `/pages/detail/detail?id=${id}&tenantId=${tenantId}`
        });
    },

    // 分享
    onShareAppMessage() {
        const tenantId = this.data.tenantId || app.getCurrentTenantId();
        const share = app.getTenantShareConfig(tenantId);
        const brand = app.getTenantBrand(tenantId);
        const defaultTitle = brand.appName ? `${this.data.pageTitle} - ${brand.appName}` : this.data.pageTitle;
        return {
            title: share.title || defaultTitle,
            path: `/pages/products/products?category=${this.data.activeCategory}&tenantId=${tenantId}`,
            imageUrl: share.image || '/images/fenxiang.jpg'
        };
    },

    // 分享到朋友圈
    onShareTimeline() {
        const tenantId = this.data.tenantId || app.getCurrentTenantId();
        const share = app.getTenantShareConfig(tenantId);
        const brand = app.getTenantBrand(tenantId);
        const defaultTitle = brand.appName ? `${this.data.pageTitle} - ${brand.appName}` : this.data.pageTitle;
        return {
            title: share.title || defaultTitle,
            query: `category=${this.data.activeCategory}&tenantId=${tenantId}`,
            imageUrl: share.image || '/images/fenxiang.jpg'
        };
    }
});
