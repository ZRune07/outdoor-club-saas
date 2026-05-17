// pages/contact/contact.js
const app = getApp();

Page({
    data: {
        form: {
            name: '',
            phone: '',
            company: '',
            people: '',
            budget: '',
            requirement: '',
            product: ''
        },
        peopleOptions: ['10人以下', '10-30人', '30-50人', '50-100人', '100人以上'],
        budgetOptions: ['5000元以下', '5000-10000元', '10000-30000元', '30000-50000元', '50000元以上'],
        peopleIndex: -1,
        budgetIndex: -1,
        submitting: false
    },

    onLoad(options) {
        if (options.product) {
            this.setData({
                'form.product': decodeURIComponent(options.product)
            });
        }
    },

    // 表单输入
    onInput(e) {
        const field = e.currentTarget.dataset.field;
        this.setData({
            [`form.${field}`]: e.detail.value
        });
    },

    // 选择人数
    onPeopleChange(e) {
        const index = e.detail.value;
        this.setData({
            peopleIndex: index,
            'form.people': this.data.peopleOptions[index]
        });
    },

    // 选择预算
    onBudgetChange(e) {
        const index = e.detail.value;
        this.setData({
            budgetIndex: index,
            'form.budget': this.data.budgetOptions[index]
        });
    },

    // 验证表单
    validateForm() {
        const { name, phone, requirement } = this.data.form;

        if (!name.trim()) {
            wx.showToast({ title: '请输入您的姓名', icon: 'none' });
            return false;
        }

        if (!phone.trim()) {
            wx.showToast({ title: '请输入联系电话', icon: 'none' });
            return false;
        }

        if (!/^1[3-9]\d{9}$/.test(phone)) {
            wx.showToast({ title: '请输入正确的手机号', icon: 'none' });
            return false;
        }

        if (!requirement.trim()) {
            wx.showToast({ title: '请描述您的需求', icon: 'none' });
            return false;
        }

        return true;
    },

    // 提交表单
    async submitForm() {
        if (!this.validateForm()) return;
        if (this.data.submitting) return;

        this.setData({ submitting: true });

        try {
            // 准备提交数据到自定义 API 端点
            const formData = {
                name: this.data.form.name,
                phone: this.data.form.phone,
                company: this.data.form.company || '',
                people: this.data.form.people || '',
                budget: this.data.form.budget || '',
                product: this.data.form.product || '',
                requirement: this.data.form.requirement,
                category_id: 3325 // 需求咨询分类ID
            };

            console.log('提交表单数据:', formData);

            // 提交到自定义 API 端点
            const result = await new Promise((resolve, reject) => {
                wx.request({
                    url: 'https://www.mufengtiyan.com/wp-json/miniprogram/v1/submit-form',
                    method: 'POST',
                    data: formData,
                    header: {
                        'Content-Type': 'application/json'
                    },
                    success: (res) => {
                        console.log('API响应:', res);
                        if (res.statusCode >= 200 && res.statusCode < 300) {
                            resolve(res.data);
                        } else {
                            reject(new Error('提交失败: ' + res.statusCode));
                        }
                    },
                    fail: (err) => {
                        console.error('请求失败:', err);
                        reject(err);
                    }
                });
            });

            console.log('提交成功:', result);

            wx.showModal({
                title: '提交成功',
                content: '我们已收到您的需求，专属顾问将尽快与您联系！',
                showCancel: false,
                confirmText: '好的',
                success: () => {
                    wx.navigateBack();
                }
            });
        } catch (err) {
            console.error('提交失败:', err);
            wx.showToast({
                title: '提交失败，请重试',
                icon: 'none'
            });
        } finally {
            this.setData({ submitting: false });
        }
    },

    // 拨打电话
    callPhone() {
        wx.makePhoneCall({
            phoneNumber: app.globalData.phone
        });
    },

    // 分享给朋友
    onShareAppMessage() {
        const tenantId = app.getCurrentTenantId();
        const share = app.getTenantShareConfig(tenantId);
        const brand = app.getTenantBrand(tenantId);
        const title = share.title || (brand.appName ? `${brand.appName} - 需求定制` : '需求定制');
        return {
            title: title,
            path: '/pages/contact/contact'
        };
    },

    // 分享到朋友圈
    onShareTimeline() {
        const tenantId = app.getCurrentTenantId();
        const share = app.getTenantShareConfig(tenantId);
        const brand = app.getTenantBrand(tenantId);
        const title = share.title || (brand.appName ? `${brand.appName} - 需求定制` : '需求定制');
        return {
            title: title,
            query: ''
        };
    }
});
