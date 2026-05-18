// utils/apiClient.js
// 基于 wx.request 的轻量封装，指向 Java 统一 REST 后端
// 自动携带登录 token（读现有本地存储，无则不带），ES5 + 小程序语法

var config = require('../config.js');

// 现有小程序未使用 JWT，登录态主要存在 userProfile 中。
// 这里优先读取专用 token key，回退到 userProfile.token，均无则匿名请求。
function getToken() {
    var token = '';
    try {
        token = wx.getStorageSync('javaToken') || '';
        if (!token) {
            var profile = wx.getStorageSync('userProfile') || {};
            token = profile.token || '';
        }
    } catch (e) {
        token = '';
    }
    return token;
}

function buildUrl(path) {
    var base = config.JAVA_API_BASE || '';
    if (base.charAt(base.length - 1) === '/') {
        base = base.slice(0, base.length - 1);
    }
    if (path.charAt(0) !== '/') {
        path = '/' + path;
    }
    return base + path;
}

function request(method, path, data) {
    return new Promise(function (resolve, reject) {
        var header = {
            'Content-Type': 'application/json'
        };
        var token = getToken();
        if (token) {
            header['Authorization'] = 'Bearer ' + token;
        }

        wx.request({
            url: buildUrl(path),
            method: method,
            data: data || {},
            header: header,
            success: function (res) {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(res.data);
                } else {
                    console.error('Java API 请求失败，状态码:', res.statusCode, '响应:', res.data);
                    reject(new Error('请求失败(' + res.statusCode + ')'));
                }
            },
            fail: function (err) {
                console.error('Java API 请求异常:', err);
                reject(err);
            }
        });
    });
}

function get(path, data) {
    return request('GET', path, data);
}

function post(path, data) {
    return request('POST', path, data);
}

module.exports = {
    get: get,
    post: post,
    request: request
};
