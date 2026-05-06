package com.ruoyi.framework.interceptor;

import com.ruoyi.common.utils.StringUtils;
import com.ruoyi.framework.tenant.TenantContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * 多租户拦截器
 */
@Component
public class TenantInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        // 从请求头获取 club_id
        String clubIdHeader = request.getHeader("X-Club-Id");

        // 如果没有，从 URL 参数获取
        if (StringUtils.isBlank(clubIdHeader)) {
            clubIdHeader = request.getParameter("club_id");
        }

        // 设置到上下文中
        if (StringUtils.isNotBlank(clubIdHeader)) {
            try {
                TenantContextHolder.setTenantId(Long.parseLong(clubIdHeader));
            } catch (NumberFormatException e) {
                // 如果解析失败，忽略
            }
        }

        return true;
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
        // 清除上下文
        TenantContextHolder.clear();
    }
}
