// pages/about/about.js
const app = getApp();

Page({
    data: {
        pageTitle: '文章详情',
        pageContent: [], // 现在的 pageContent 是一个数组
        featuredImage: '', // 顶部特色图片
        phone: app.globalData.phone,
        loading: true,
        consultant: null,  // 当前顾问信息
        post: null, // 存储文章信息
        postId: '', // 存储文章ID
        brandName: '' // 品牌名称
    },

    async onLoad(options) {
        // 初始化租户信息
        await app.ensureTenantConfigsLoaded();
        const tenantId = app.initTenantFromOptions(options || {});
        
        // 获取品牌信息
        const brand = app.getTenantBrand(tenantId);
        this.setData({ 
            postId: options?.postId || '',
            brandName: brand.appName || ''
        });
        
        this.loadAboutPage(options);
        this.loadConsultant(options);
    },

    // 加载当前顾问信息
    async loadConsultant(options) {
        // 获取 URL 参数中的员工ID
        const urlEmployeeId = options?.employeeId;
        // 获取本地存储的员工ID（员工自己绑定的）
        const localEmployeeId = wx.getStorageSync('myEmployeeId');

        let consultant;
        if (urlEmployeeId) {
            // URL 有参数，显示对应员工
            consultant = await app.getEmployeeById(urlEmployeeId);
        } else if (localEmployeeId) {
            // 本地有绑定，显示自己的信息
            consultant = await app.getEmployeeById(localEmployeeId);
        } else {
            // 都没有，使用租户配置的默认员工
            const tenantId = app.getCurrentTenantId();
            const tenantConfig = app.getTenantConfig(tenantId);
            const defaultEmployeeId = tenantConfig.defaultEmployeeId;
            
            if (defaultEmployeeId) {
                // 租户配置了默认员工，使用该员工
                consultant = await app.getEmployeeById(defaultEmployeeId);
            } else {
                // 租户没有配置，使用系统默认顾问
                consultant = app.globalData.defaultConsultant;
            }
        }

        this.setData({
            consultant,
            phone: consultant?.phone || app.globalData.phone
        });
        
        console.log('关于页面顾问信息:', consultant);
    },

    // 从 WordPress 加载文章页面
    // 只支持按文章ID加载（租户在快捷按钮填数字ID时触发）
    async loadAboutPage(options) {
        try {
            this.setData({ loading: true });
            const postId = options && String(options.postId || '').trim();
            let item = null;

            if (postId) {
                // 按文章ID加载（先尝试 posts，再尝试 pages）
                const post = await app.request({
                    url: `/posts/${postId}?_embed`
                });
                if (post && post.id && !post.code) {
                    item = post;
                } else {
                    const page = await app.request({
                        url: `/pages/${postId}?_embed`
                    });
                    if (page && page.id && !page.code) {
                        item = page;
                    }
                }
            }

            if (item) {
                const featuredImage = item._embedded?.['wp:featuredmedia']?.[0]?.source_url || '';
                let content = item.content?.rendered || '';
                const segments = this.processHtml(content);
                
                // 处理日期格式
                let formattedDate = '';
                if (item.date) {
                    const date = new Date(item.date);
                    formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                }
                
                // 确保 post 对象包含必要的字段
                const postData = {
                    ...item,
                    title: item.title?.rendered || '',
                    date: formattedDate
                };
                
                this.setData({
                    post: postData,
                    pageTitle: item.title?.rendered || '文章详情',
                    featuredImage: featuredImage,
                    pageContent: segments,
                    loading: false
                });
            } else {
                this.setData({
                    post: null,
                    pageContent: [{ type: 'html', content: '<p>暂无内容</p>' }],
                    loading: false
                });
            }
        } catch (err) {
            console.error('加载文章失败:', err);
            this.setData({
                pageContent: [{ type: 'html', content: '<p>加载失败，请稍后重试</p>' }],
                loading: false
            });
        }
    },

    // 处理 HTML 内容，适配小程序显示
    processHtml(html) {
        if (!html) return [];

        const segments = [];

        // 分割正则：匹配视频、figure视频、iframe、embed容器
        const splitRegex = /(<figure[^>]+class="wp-block-video[^>]*>[\s\S]*?<\/figure>|<video[^>]+>[\s\S]*?<\/video>|<iframe[^>]+>[\s\S]*?<\/iframe>|<div[^>]+class="wp-block-embed[^>]*>[\s\S]*?<\/div>)/gi;

        // split 结果会包含分隔符（因为正则用了捕获组），所以数组是 [text, match, text, match, ...]
        const parts = html.split(splitRegex);

        parts.forEach(part => {
            if (!part) return;

            // 判断是否是媒体片段
            if (this.isMedia(part)) {
                const mediaData = this.parseMedia(part);
                if (mediaData) {
                    segments.push(mediaData);
                }
            } else {
                // 文本/图片片段，进行常规清理
                const cleanedHtml = this.cleanHtml(part);
                if (cleanedHtml.trim()) {
                    segments.push({
                        type: 'html',
                        content: cleanedHtml
                    });
                }
            }
        });

        return segments;
    },

    // 判断是否是媒体片段
    isMedia(html) {
        return /<video|<iframe|<figure[^>]+class="wp-block-video"|<div[^>]+class="wp-block-embed"/i.test(html);
    },

    // 解析媒体片段
    parseMedia(html) {
        // 1. 尝试解析为本地视频 (video 标签 或 wp-block-video)
        if (html.includes('<video') || html.includes('wp-block-video')) {
            const srcMatch = html.match(/src\s*=\s*['"]([^'"]+)['"]/);
            const posterMatch = html.match(/poster\s*=\s*['"]([^'"]+)['"]/);

            if (srcMatch && srcMatch[1]) {
                return {
                    type: 'video',
                    src: srcMatch[1],
                    poster: posterMatch ? posterMatch[1] : ''
                };
            }
        }

        // 2. 尝试解析为 iframe (或 embed 中的 iframe)
        if (html.includes('<iframe') || html.includes('wp-block-embed')) {
            const srcRegex = /src\s*=\s*['"]([^'"]+)['"]/;
            const srcMatch = html.match(srcRegex);

            if (srcMatch && srcMatch[1]) {
                let src = srcMatch[1];
                if (src.startsWith('//')) {
                    src = 'https:' + src;
                }
                return {
                    type: 'external-video',
                    url: src
                };
            }
        }

        return null;
    },

    // 清理 HTML (处理图片等)
    cleanHtml(html) {
        // 移除 figure 标签 (保留内容)
        html = html.replace(/<figure[^>]*>/gi, '');
        html = html.replace(/<\/figure>/gi, '');

        // 处理图片
        html = html.replace(/<img[^>]*>/gi, function (match) {
            const srcMatch = match.match(/src\s*=\s*['"]([^'"]+)['"]/);
            const src = srcMatch ? srcMatch[1] : '';
            if (!src) return '';
            // 清除 !important，简化样式
            return `<img src="${src}" style="max-width:100% !important;height:auto !important;display:block;margin:10px auto;border-radius:10px;" />`;
        });

        return html;
    },

    // 打开外部视频
    openExternalVideo(e) {
        const url = e.currentTarget.dataset.url;
        if (url) {
            wx.navigateTo({
                url: `/pages/webview/webview?url=${encodeURIComponent(url)}`
            });
        }
    },

    // 拨打电话（专属顾问）- 使用当前顾问电话
    callConsultant() {
        const phone = this.data.consultant?.phone || this.data.phone;
        wx.makePhoneCall({
            phoneNumber: phone
        });
    },

    // 拨打电话
    callPhone() {
        const phone = this.data.consultant?.phone || this.data.phone;
        wx.makePhoneCall({
            phoneNumber: phone
        });
    },

    // 复制微信
    copyWechat() {
        const phone = this.data.consultant?.phone || this.data.phone;
        wx.setClipboardData({
            data: phone,
            success: () => {
                wx.showToast({
                    title: '已复制电话号码',
                    icon: 'success'
                });
            }
        });
    },

    // 跳转咨询
    goToContact() {
        wx.navigateTo({
            url: '/pages/contact/contact'
        });
    },

    // 返回上一页
    goBack() {
        wx.navigateBack();
    },

    // 分享 - 带上租户ID和员工ID参数
    onShareAppMessage() {
        const tenantId = app.getCurrentTenantId();
        const share = app.getTenantShareConfig(tenantId);
        const brand = app.getTenantBrand(tenantId);
        const employeeId = this.data.consultant?.id;
        const postId = this.data.postId;
        
        let path = '/pages/about/about';
        const params = [];
        if (tenantId && tenantId !== 'default') {
            params.push(`tenantId=${tenantId}`);
        }
        if (postId) {
            params.push(`postId=${postId}`);
        }
        if (employeeId && employeeId !== 'default') {
            params.push(`employeeId=${employeeId}`);
        }
        if (params.length > 0) {
            path += `?${params.join('&')}`;
        }
        
        const title = this.data.post?.title?.rendered || this.data.pageTitle || brand.appName;
        const imageUrl = this.data.post?._embedded?.['wp:featuredmedia']?.[0]?.source_url || share.image || '/images/fenxiang.jpg';
        
        return {
            title: title,
            path: path,
            imageUrl: imageUrl
        };
    },

    // 分享到朋友圈 - 带上租户ID和员工ID参数
    onShareTimeline() {
        const tenantId = app.getCurrentTenantId();
        const share = app.getTenantShareConfig(tenantId);
        const brand = app.getTenantBrand(tenantId);
        const employeeId = this.data.consultant?.id;
        const postId = this.data.postId;
        
        const queryParts = [];
        if (tenantId && tenantId !== 'default') {
            queryParts.push(`tenantId=${tenantId}`);
        }
        if (postId) {
            queryParts.push(`postId=${postId}`);
        }
        if (employeeId && employeeId !== 'default') {
            queryParts.push(`employeeId=${employeeId}`);
        }
        
        const title = this.data.post?.title?.rendered || this.data.pageTitle || brand.appName;
        const imageUrl = this.data.post?._embedded?.['wp:featuredmedia']?.[0]?.source_url || share.image || '/images/fenxiang.jpg';
        
        return {
            title: title,
            query: queryParts.join('&'),
            imageUrl: imageUrl
        };
    }
});
