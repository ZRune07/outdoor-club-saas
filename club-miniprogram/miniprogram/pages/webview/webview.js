// pages/webview/webview.js
Page({
    data: {
        url: ''
    },

    onLoad(options) {
        if (options.url) {
            this.setData({
                url: decodeURIComponent(options.url)
            });
        }
    },

    // 分享给朋友
    onShareAppMessage() {
        const tenantId = getApp().getCurrentTenantId();
        const brand = getApp().getTenantBrand(tenantId);
        return {
            title: brand.appName || '网页浏览',
            path: `/pages/webview/webview?url=${encodeURIComponent(this.data.url)}`
        };
    },

    // 分享到朋友圈
    onShareTimeline() {
        const tenantId = getApp().getCurrentTenantId();
        const brand = getApp().getTenantBrand(tenantId);
        return {
            title: brand.appName || '网页浏览',
            query: `url=${encodeURIComponent(this.data.url)}`
        };
    }
});
