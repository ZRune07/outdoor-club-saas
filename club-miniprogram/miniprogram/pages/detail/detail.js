// pages/detail/detail.js
const app = getApp();
const config = require('../../config.js');
const apiClient = require('../../utils/apiClient.js');

Page({
    data: {
        post: null,
        loading: true,
        images: [],
        videos: [],
        externalVideos: [],
        consultant: null,
        tenantId: 'default',
        theme: {},
        themeStyleVars: '',
        brandName: '',
        homeIcon: '', // 底部导航首页图标
        accessDenied: false,  // 权限拒绝标志
        restrictReason: '',   // 拒绝原因
        isEmployee: false,     // 是否是员工
        showEnrollmentModal: false, // 报名弹窗显示状态
        showAgreementModal: false, // 电子协议弹窗显示状态
        agreementContent: '', // 协议内容
        signaturePath: '', // 签名图片路径
        enrollmentData: null, // 报名数据
        enrollmentFields: [], // 报名字段配置
        enableEnrollment: false,
        enableAgreement: false,
        isSubmittingEnrollment: false,
        isSubmittingAgreement: false,
        hasSignature: false
    },

    async onLoad(options) {
        await app.ensureTenantConfigsLoaded();
        const tenantId = app.initTenantFromOptions(options || {});
        
        this.setData({ tenantId });
        
        await this.loadEnrollmentFields(tenantId);
        
        // 获取租户品牌信息
        const brand = app.getTenantBrand(tenantId);
        const homeIcon = app.getTenantHomeIcon(tenantId);
        this.setData({
            brandName: brand.appName || '',
            homeIcon: homeIcon
        });
        
        this.applyDetailTheme();
        if (options.id) {
            this.loadDetail(options.id);
        }
        this.initConsultant(options);
    },

    // 加载详情
    async loadDetail(id) {
        try {
            this.setData({ loading: true });

            console.log('开始加载详情，文章ID:', id);
            const tenantId = this.data.tenantId || app.getCurrentTenantId();
            const [post, enrollmentConfig] = await Promise.all([
                app.request({
                    url: `/posts/${id}?_embed`,
                    tenantId
                }),
                app.getPostEnrollmentConfig(id, tenantId).catch(err => {
                    console.error('加载文章报名开关失败:', err);
                    return {
                        enableEnrollment: false,
                        enableAgreement: false,
                        agreementContent: ''
                    };
                })
            ]);

            console.log('文章详情API返回:', post);

            // 提取内容
            const content = post.content?.rendered || '';
            console.log('提取的content:', content);

            // 提取特色图片
            const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '';

            // 提取分类
            const categories = post._embedded?.['wp:term']?.[0] || [];

            // 提取内容中的图片
            const imgRegex = /<img[^>]+src="([^">]+)"/g;
            const images = [];
            let match;
            while ((match = imgRegex.exec(content)) !== null) {
                images.push(match[1]);
            }

            // 格式化内容，处理视频标签 (返回片段数组)
            const formattedSegments = this.processHtml(content);

            const activityWindow = this.resolveActivityWindow(post, post.title?.rendered || '');
            this.setData({
                post: {
                    id: post.id,
                    title: post.title?.rendered || '',
                    content: formattedSegments, // 这里现在是一个数组
                    excerpt: this.stripHtml(post.excerpt?.rendered || ''),
                    image: featuredImage || '/images/placeholder.png',
                    date: this.formatDate(post.date),
                    activityStartDate: activityWindow.startDateText,
                    activityEndDate: activityWindow.endDateText,
                    activityDateRange: activityWindow.dateRange,
                    categories: categories
                },
                images: images,
                enableEnrollment: enrollmentConfig.enableEnrollment,
                enableAgreement: enrollmentConfig.enableAgreement,
                agreementContent: enrollmentConfig.agreementContent || this.data.agreementContent,
                loading: false
            });

            // 设置导航栏标题
            wx.setNavigationBarTitle({
                title: this.stripHtml(post.title?.rendered || '产品详情')
            });
        } catch (err) {
            console.error('加载详情失败:', err);
            this.setData({ loading: false });
            wx.showToast({
                title: '加载失败',
                icon: 'none'
            });
        }
    },

    // 处理 HTML 内容，适配小程序显示 (返回片段数组)
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
        html = html.replace(/<([a-zA-Z0-9]+)([^>]*)style="([^"]*)"([^>]*)>/gi, (match, tag, before, style, after) => {
            const alignMatch = style.match(/text-align\s*:\s*(left|center|right|justify)/i);
            const alignAttr = alignMatch ? ` data-align="${alignMatch[1].toLowerCase()}"` : '';
            return `<${tag}${before}${alignAttr}${after}>`;
        });

        html = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
        html = html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
        html = html.replace(/loading="lazy"/g, '');
        html = html.replace(/decoding="async"/g, '');
        html = html.replace(/\s(style|class|id|data-(?!align)[^=]+)=("([^"]*)"|'([^']*)')/gi, '');
        html = html.replace(/\s(color|face|size)=("([^"]*)"|'([^']*)')/gi, '');
        html = html.replace(/\s(width|height)=("([^"]*)"|'([^']*)')/gi, '');

        // 移除 figure 标签 (保留内容)
        html = html.replace(/<figure[^>]*>/gi, '');
        html = html.replace(/<\/figure>/gi, '');

        html = html.replace(/<font[^>]*>/gi, '<span>');
        html = html.replace(/<\/font>/gi, '</span>');

        // 处理图片：使用 flex 布局使其居中，并保持圆角样式
        html = html.replace(/<img([^>]*)>/gi, function (match, attributes) {
            // 提取 src
            const srcMatch = attributes.match(/src\s*=\s*['"]([^'"]+)['"]/i);
            const src = srcMatch ? srcMatch[1] : '';
            if (!src) return '';
            
            // 返回一个包含包裹层的新结构
            return `<div style="display:flex;justify-content:center;margin:20px 0;"><img src="${src}" style="max-width:100% !important;height:auto !important;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.08);" /></div>`;
        });

        // 优化段落样式
        html = html.replace(/<p([^>]*)>/gi, '<p$1 style="margin-bottom: 24px; line-height: 1.8; color: #333333; font-size: 15px; text-align: justify;">');

        // 优化标题样式
        html = html.replace(/<h2([^>]*)>/gi, '<h2$1 style="font-size: 20px; font-weight: 600; color: #1a1a1a; margin: 32px 0 16px; border-left: 4px solid var(--detail-primary-color, #FF6B00); padding-left: 12px;">');
        html = html.replace(/<h3([^>]*)>/gi, '<h3$1 style="font-size: 18px; font-weight: 600; color: #1a1a1a; margin: 28px 0 14px;">');
        
        // 优化列表样式
        html = html.replace(/<ul([^>]*)>/gi, '<ul$1 style="margin-bottom: 24px; padding-left: 20px; color: #333333; line-height: 1.8; font-size: 15px;">');
        html = html.replace(/<ol([^>]*)>/gi, '<ol$1 style="margin-bottom: 24px; padding-left: 20px; color: #333333; line-height: 1.8; font-size: 15px;">');
        html = html.replace(/<li([^>]*)>/gi, '<li$1 style="margin-bottom: 8px;">');

        // 清理空段落
        html = html.replace(/<p[^>]*>\s*<\/p>/gi, '');
        html = html.replace(/<p[^>]*>\s*&nbsp;\s*<\/p>/gi, '');

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

    // 去除HTML标签
    stripHtml(html) {
        return html.replace(/<[^>]+>/g, '').replace(/\n/g, '').trim();
    },

    // 格式化日期
    formatDate(dateStr) {
        const date = new Date(dateStr);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    },

    parseActivityDate(value, isEnd = false) {
        if (!value) return null;
        if (value instanceof Date) return value;
        const text = String(value).trim();
        const directDate = new Date(text.replace(/\./g, '-').replace(/\//g, '-'));
        if (!Number.isNaN(directDate.getTime())) {
            if (isEnd) directDate.setHours(23, 59, 59, 999);
            return directDate;
        }
        const normalized = text
            .replace(/[年.\/]/g, '-')
            .replace(/月/g, '-')
            .replace(/日/g, '')
            .replace(/\s+/g, '');
        const match = normalized.match(/^(\d{1,2})-(\d{1,2})$/);
        if (!match) return null;
        const now = new Date();
        const date = new Date(now.getFullYear(), Number(match[1]) - 1, Number(match[2]), isEnd ? 23 : 0, isEnd ? 59 : 0, isEnd ? 59 : 0, isEnd ? 999 : 0);
        return Number.isNaN(date.getTime()) ? null : date;
    },

    formatActivityDate(date) {
        if (!date) return '';
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    },

    formatActivityDateRange(startDate, endDate) {
        if (!startDate || !endDate) return '';
        const sm = startDate.getMonth() + 1;
        const sd = startDate.getDate();
        const em = endDate.getMonth() + 1;
        const ed = endDate.getDate();
        return `${sm}.${sd}-${em}.${ed}`;
    },

    extractActivityDateRangeFromTitle(title) {
        const text = String(title || '').trim();
        const match = text.match(/(\d{1,2}[.\-\/月]\d{1,2})\s*[-~—–至到]\s*(\d{1,2}[.\-\/月]\d{1,2})/);
        if (!match) return null;
        const startDate = this.parseActivityDate(match[1], false);
        const endDate = this.parseActivityDate(match[2], true);
        if (!startDate || !endDate) return null;
        return { startDate, endDate };
    },

    resolveActivityWindow(rawPost, title) {
        const acf = rawPost?.acf || {};
        const meta = rawPost?.meta || {};
        const startRaw = acf.activityStartDate || acf.activity_start_date || acf.activity_start || acf.event_start || acf.start_date || acf.signup_start || meta.activityStartDate || meta.activity_start_date || '';
        const endRaw = acf.activityEndDate || acf.activity_end_date || acf.activity_end || acf.event_end || acf.end_date || acf.signup_end || meta.activityEndDate || meta.activity_end_date || '';
        let startDate = this.parseActivityDate(startRaw, false);
        let endDate = this.parseActivityDate(endRaw, true);
        if (!startDate || !endDate) {
            const titleRange = this.extractActivityDateRangeFromTitle(title);
            startDate = startDate || titleRange?.startDate || this.parseActivityDate(rawPost?.date, false);
            endDate = endDate || titleRange?.endDate || startDate;
        }
        return {
            startDate,
            endDate,
            startDateText: this.formatActivityDate(startDate),
            endDateText: this.formatActivityDate(endDate),
            dateRange: this.formatActivityDateRange(startDate, endDate)
        };
    },

    buildThemeStyleVars(theme) {
        const safeTheme = theme || {};
        return [
            `--detail-bg-color:${safeTheme.bgColor || '#F5F5F5'}`,
            `--detail-card-bg:${safeTheme.cardBg || '#FFFFFF'}`,
            `--detail-text-primary:${safeTheme.textPrimary || '#333333'}`,
            `--detail-text-secondary:${safeTheme.textSecondary || '#666666'}`,
            `--detail-text-light:${safeTheme.textLight || '#999999'}`,
            `--detail-border-color:${safeTheme.borderColor || '#EEEEEE'}`,
            `--detail-primary-color:${safeTheme.primaryColor || '#FF6B00'}`,
            `--detail-tag-bg:${safeTheme.tagBg || 'rgba(255, 107, 0, 0.1)'}`,
            `--detail-bottom-nav-bg:${safeTheme.bottomNavBg || '#FFFFFF'}`,
            `--detail-button-call-bg:${safeTheme.buttonCallBg || '#F06B22'}`,
            `--detail-button-custom-bg:${safeTheme.buttonCustomBg || '#00C853'}`,
            `--detail-external-btn-bg:${safeTheme.externalBtnBg || '#F8F9FA'}`,
            `--detail-external-btn-active-bg:${safeTheme.externalBtnActiveBg || '#F0F0F0'}`,
            `--detail-external-btn-border:${safeTheme.externalBtnBorder || '#EEEEEE'}`
        ].join(';');
    },

    applyDetailTheme() {
        const tenantId = this.data.tenantId || app.getCurrentTenantId();
        const theme = app.getTenantDetailTheme(tenantId);
        this.setData({
            theme,
            themeStyleVars: this.buildThemeStyleVars(theme)
        });
    },

    // 预览图片
    previewImage(e) {
        const current = e.currentTarget.dataset.src;
        wx.previewImage({
            current: current,
            urls: this.data.images.length > 0 ? this.data.images : [current]
        });
    },

    // 加载报名字段配置和电子协议
    async loadEnrollmentFields(tenantId) {
        try {
            const [enrollmentFields, agreementContent] = await Promise.all([
                app.getEnrollmentFields(tenantId),
                app.getAgreementContent(tenantId)
            ]);
            this.setData({ enrollmentFields, agreementContent });
        } catch (err) {
            console.error('加载报名配置失败:', err);
            // 出错时使用默认字段
            this.setData({ 
                enrollmentFields: app.globalData.defaultEnrollmentFields,
                agreementContent: app.globalData.defaultAgreementContent
            });
        }
    },

    // 初始化顾问信息
    async initConsultant(options) {
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
            const tenantId = this.data.tenantId || app.getCurrentTenantId();
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
            consultant
        });
    },

    // 拨打电话咨询
    callConsultant() {
        const phone = this.data.consultant?.phone || app.globalData.phone;
        wx.makePhoneCall({
            phoneNumber: phone
        });
    },

    // 返回首页
    goHome() {
        const tenantId = this.data.tenantId || app.getCurrentTenantId();
        wx.reLaunch({
            url: `/pages/index/index?tenantId=${tenantId}`
        });
    },

    // 分享
    onShareAppMessage() {
        const tenantId = this.data.tenantId || app.getCurrentTenantId();
        const share = app.getTenantShareConfig(tenantId);
        const brand = app.getTenantBrand(tenantId);
        const employeeId = this.data.consultant?.id;
        let path = `/pages/detail/detail?id=${this.data.post?.id}&tenantId=${tenantId}`;
        if (employeeId && employeeId !== 'default') {
            path += `&employeeId=${employeeId}`;
        }

        const title = this.data.post?.title || share.title || brand.appName;

        return {
            title: title,
            path: path,
            imageUrl: this.data.post?.image || share.image || '/images/fenxiang.jpg'
        };
    },

    // 分享到朋友圈
    onShareTimeline() {
        const tenantId = this.data.tenantId || app.getCurrentTenantId();
        const share = app.getTenantShareConfig(tenantId);
        const brand = app.getTenantBrand(tenantId);
        const employeeId = this.data.consultant?.id;
        let query = `id=${this.data.post?.id}&tenantId=${tenantId}`;
        if (employeeId && employeeId !== 'default') {
            query += `&employeeId=${employeeId}`;
        }

        const title = this.data.post?.title || share.title || brand.appName;

        return {
            title: title,
            query: query,
            imageUrl: this.data.post?.image || share.image || '/images/fenxiang.jpg'
        };
    },

    // 处理分享按钮点击
    onShare() {
        // 这一步其实不用变，因为onShareAppMessage已经被重写了，但保留原有逻辑
        // 注意：小程序中 bindtap="onShare" 只能触发自定义逻辑，无法直接唤起分享菜单
        // 除非使用 <button open-type="share">。
        // 原有逻辑是用 wx.showShareMenu? 不对，showShareMenu 是配置。
        // 如果想手动唤起分享，需要引导用户点击右上角或使用button。
        // 这里假设用户希望点击按钮提示或者 what ever，保留目前逻辑即可或者引导。
        // 实际上 wx.showShareMenu 只是开启菜单。
        // 建议改为提示用户点击右上角。
        wx.showToast({
            title: '请点击右上角...进行分享',
            icon: 'none'
        });
    },

    // 打开报名弹窗
    openEnrollmentModal() {
        this.setData({
            showEnrollmentModal: true
        });
    },

    // 关闭报名弹窗
    closeEnrollmentModal() {
        this.setData({
            showEnrollmentModal: false
        });
    },

    // 阻止弹窗冒泡
    preventBubble() {
        // 空方法，用于阻止点击弹窗内容时关闭弹窗
    },

    normalizeFormData(formData) {
        const next = {};
        Object.keys(formData || {}).forEach(key => {
            const value = formData[key];
            next[key] = typeof value === 'string' ? value.trim() : value;
        });
        return next;
    },

    validateEnrollmentForm(formData) {
        const enrollmentFields = this.data.enrollmentFields || [];
        for (const field of enrollmentFields) {
            const value = formData[field.key];
            if (field.required && (value === undefined || value === null || String(value).trim() === '')) {
                return `请填写${field.label}`;
            }
        }

        const phone = String(formData.phone || formData.telephone || '').trim();
        if (phone && !/^1\d{10}$/.test(phone)) {
            return '请填写正确的手机号';
        }

        const participantCount = Number(formData.participantCount || 1);
        if (!Number.isFinite(participantCount) || participantCount < 1) {
            return '参与人数必须大于 0';
        }

        if (!this.data.post?.id) {
            return '活动信息加载异常，请返回后重试';
        }

        return '';
    },

    // 提交报名信息
    async submitEnrollment(e) {
        if (this.data.isSubmittingEnrollment) {
            return;
        }

        if (!config.USE_JAVA_BACKEND && !wx.cloud) {
            wx.showToast({
                title: '报名服务暂不可用',
                icon: 'none'
            });
            return;
        }

        const formData = this.normalizeFormData(e.detail.value);
        const validationError = this.validateEnrollmentForm(formData);
        if (validationError) {
            wx.showToast({
                title: validationError,
                icon: 'none'
            });
            return;
        }

        const tenantId = this.data.tenantId || app.getCurrentTenantId();
        const postId = this.data.post?.id;
        const employeeId = this.data.consultant?.id;
        const post = this.data.post;
        const primaryCategory = post?.categories?.[0] || null;
        const categoryName = primaryCategory?.name || '';
        const categoryId = primaryCategory?.id || '';
        const localProfile = wx.getStorageSync('userProfile') || {};
        const avatarUrl = String(localProfile.avatarUrl || '').trim();
        const nickName = String(localProfile.nickName || '').trim();
        
        // 构建报名数据 - 包含所有字段
        const enrollmentData = {
            tenantId,
            postId,
            postTitle: post?.title || '',  // 保存文章标题
            categoryId,  // 保存分类ID
            categoryName,  // 保存分类名称
            ...formData,
            phone: formData.phone || formData.telephone || '',
            participantCount: formData.participantCount ? Number(formData.participantCount) : 1,
            status: 'pending',
            agreementStatus: this.data.enableAgreement ? 'waiting_signature' : 'not_required',
            employeeId: employeeId || 'default',
            avatarUrl: avatarUrl || '',
            nickName: nickName || '',
            fieldSnapshot: this.data.enrollmentFields || []
        };

        this.setData({ isSubmittingEnrollment: true });
        wx.showLoading({
            title: '提交报名...'
        });

        try {
            let savedId;
            let savedCreatedAt;
            let isUpdated;

            if (config.USE_JAVA_BACKEND) {
                // 走 Java 统一 REST 后端
                const apiRes = await apiClient.post('/registration', enrollmentData);
                if (!apiRes || apiRes.code !== 200) {
                    throw new Error((apiRes && apiRes.msg) || '报名提交失败');
                }
                const apiData = apiRes.data || {};
                savedId = apiData._id || apiData.id;
                savedCreatedAt = apiData.createdAt || new Date();
                isUpdated = !!apiData.isUpdated;
            } else {
                const res = await wx.cloud.callFunction({
                    name: 'addEnrollment',
                    data: enrollmentData
                });

                if (!res.result || !res.result.success) {
                    throw new Error(res.result?.error || '报名提交失败');
                }
                savedId = res.result._id;
                savedCreatedAt = res.result.createdAt || new Date();
                isUpdated = !!res.result.isUpdated;
            }

            wx.hideLoading();
            wx.showToast({
                title: isUpdated ? '报名已更新' : '报名成功',
                icon: 'success'
            });
            this.closeEnrollmentModal();

            const savedEnrollmentData = {
                ...enrollmentData,
                _id: savedId,
                createdAt: savedCreatedAt
            };
            this.setData({
                enrollmentData: savedEnrollmentData
            });
            if (this.data.enableAgreement) {
                this.openAgreementModal();
            }
        } catch (err) {
            console.error('submit enrollment failed:', err);
            wx.hideLoading();
            wx.showToast({
                title: err.message || '提交失败，请重试',
                icon: 'none'
            });
        } finally {
            this.setData({ isSubmittingEnrollment: false });
        }
    },

    // 打开电子协议弹窗
    openAgreementModal() {
        this.setData({
            showAgreementModal: true,
            hasSignature: false
        });
        
        // 初始化签名画布
        this.initSignatureCanvas();
    },

    // 关闭电子协议弹窗
    closeAgreementModal() {
        this.setData({
            showAgreementModal: false,
            hasSignature: false
        });
    },

    // 初始化签名画布
    initSignatureCanvas() {
        const ctx = wx.createCanvasContext('signatureCanvas');
        ctx.setStrokeStyle('#000000');
        ctx.setLineWidth(2);
        ctx.setLineCap('round');
        ctx.setLineJoin('round');
    },

    // 开始签名
    startSignature(e) {
        this.setData({
            startX: e.touches[0].x,
            startY: e.touches[0].y,
            hasSignature: true
        });
    },

    // 移动签名
    moveSignature(e) {
        const ctx = wx.createCanvasContext('signatureCanvas');
        ctx.setStrokeStyle('#000000');
        ctx.setLineWidth(2);
        ctx.setLineCap('round');
        ctx.setLineJoin('round');
        
        ctx.beginPath();
        ctx.moveTo(this.data.startX, this.data.startY);
        ctx.lineTo(e.touches[0].x, e.touches[0].y);
        ctx.stroke();
        ctx.draw(true);
        
        this.setData({
            startX: e.touches[0].x,
            startY: e.touches[0].y
        });
    },

    // 结束签名
    endSignature() {
        // 可以在这里保存签名图片
    },

    // 清除签名
    clearSignature() {
        const ctx = wx.createCanvasContext('signatureCanvas');
        ctx.clearRect(0, 0, 375, 200);
        ctx.draw();
        this.setData({
            signaturePath: '',
            hasSignature: false
        });
    },

    // 提交电子协议
    submitAgreement() {
        if (this.data.isSubmittingAgreement) {
            return;
        }

        if (!this.data.enrollmentData?._id) {
            wx.showToast({
                title: '请先完成报名',
                icon: 'none'
            });
            return;
        }

        if (!this.data.hasSignature) {
            wx.showToast({
                title: '请先签名',
                icon: 'none'
            });
            return;
        }

        this.setData({ isSubmittingAgreement: true });
        wx.canvasToTempFilePath({
            canvasId: 'signatureCanvas',
            success: async (res) => {
                wx.showLoading({
                    title: '提交协议...'
                });
                
                try {
                    const cloudPath = `signatures/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.png`;
                    const uploadResult = await wx.cloud.uploadFile({
                        cloudPath: cloudPath,
                        filePath: res.tempFilePath
                    });
                    
                    const agreementData = {
                        tenantId: this.data.enrollmentData.tenantId,
                        enrollmentId: this.data.enrollmentData._id,
                        postId: this.data.enrollmentData.postId,
                        content: this.data.agreementContent,
                        signature: uploadResult.fileID,
                        signerName: this.data.enrollmentData.name,
                        signerPhone: this.data.enrollmentData.phone,
                        status: 'signed',
                        signedAt: new Date()
                    };
                    
                    const result = await wx.cloud.callFunction({
                        name: 'addAgreement',
                        data: agreementData
                    });

                    if (!result.result || !result.result.success) {
                        throw new Error(result.result?.error || '协议提交失败');
                    }

                    wx.hideLoading();
                    wx.showToast({
                        title: '协议已签署',
                        icon: 'success'
                    });
                    this.setData({
                        'enrollmentData.agreementStatus': 'signed'
                    });
                    this.closeAgreementModal();
                } catch (err) {
                    console.error('submit agreement failed:', err);
                    wx.hideLoading();
                    wx.showToast({
                        title: err.message || '签署失败，请重试',
                        icon: 'none'
                    });
                } finally {
                    this.setData({ isSubmittingAgreement: false });
                }
            },
            fail: (err) => {
                console.error('save signature failed:', err);
                this.setData({ isSubmittingAgreement: false });
                wx.showToast({
                    title: '保存签名失败',
                    icon: 'none'
                });
            }
        });
    }
});
