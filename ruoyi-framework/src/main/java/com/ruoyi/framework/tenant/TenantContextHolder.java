package com.ruoyi.framework.tenant;

/**
 * 多租户上下文持有者。
 * 租户与角色均来源于已验签的微信登录 JWT，不接受客户端自报的 header/参数。
 */
public class TenantContextHolder {

    private static final ThreadLocal<Long> TENANT_ID = new ThreadLocal<>();
    private static final ThreadLocal<Long> WX_USER_ID = new ThreadLocal<>();
    private static final ThreadLocal<String> ROLE = new ThreadLocal<>();

    public static void setTenantId(Long tenantId) {
        TENANT_ID.set(tenantId);
    }

    public static Long getTenantId() {
        return TENANT_ID.get();
    }

    public static void setWxUserId(Long wxUserId) {
        WX_USER_ID.set(wxUserId);
    }

    public static Long getWxUserId() {
        return WX_USER_ID.get();
    }

    public static void setRole(String role) {
        ROLE.set(role);
    }

    public static String getRole() {
        return ROLE.get();
    }

    public static boolean isSuperAdmin() {
        return "super_admin".equals(ROLE.get());
    }

    public static boolean isTenantAdmin() {
        String r = ROLE.get();
        return "super_admin".equals(r) || "tenant_admin".equals(r);
    }

    public static void clear() {
        TENANT_ID.remove();
        WX_USER_ID.remove();
        ROLE.remove();
    }
}
