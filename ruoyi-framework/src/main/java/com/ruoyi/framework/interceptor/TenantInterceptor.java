package com.ruoyi.framework.interceptor;

import com.ruoyi.common.constant.Constants;
import com.ruoyi.common.utils.StringUtils;
import com.ruoyi.framework.tenant.TenantContextHolder;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * 多租户拦截器。
 * 租户(clubId) 与角色(role) 均从已验签的微信登录 JWT 中解析，
 * 不信任客户端自报的 header/参数，避免越权读取其他租户数据。
 */
@Component
public class TenantInterceptor implements HandlerInterceptor {

    @Value("${token.header}")
    private String header;

    @Value("${token.secret}")
    private String secret;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        String token = request.getHeader(header);
        if (StringUtils.isEmpty(token)) {
            return true;
        }
        if (token.startsWith(Constants.TOKEN_PREFIX)) {
            token = token.replace(Constants.TOKEN_PREFIX, "");
        }

        try {
            Claims claims = Jwts.parser()
                    .setSigningKey(secret)
                    .parseClaimsJws(token)
                    .getBody();

            Object clubId = claims.get("clubId");
            if (clubId != null) {
                TenantContextHolder.setTenantId(Long.parseLong(String.valueOf(clubId)));
            }
            Object userId = claims.get("userId");
            if (userId != null) {
                TenantContextHolder.setWxUserId(Long.parseLong(String.valueOf(userId)));
            }
            Object role = claims.get("role");
            if (role != null) {
                TenantContextHolder.setRole(String.valueOf(role));
            }
        } catch (Exception e) {
            // 非微信令牌（如后台管理 RuoYi 令牌）或令牌无效：不设置租户上下文
        }

        return true;
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
        TenantContextHolder.clear();
    }
}
