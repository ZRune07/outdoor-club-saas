package com.ruoyi.outdoor.tenantadmin.service;

import java.util.List;
import com.ruoyi.outdoor.tenantadmin.domain.TenantAdmin;

/**
 * 租户管理员 服务层
 *
 * @author ruoyi
 */
public interface ITenantAdminService
{
    String ROLE_SUPER_ADMIN = "super_admin";
    String ROLE_TENANT_ADMIN = "tenant_admin";
    String ROLE_USER = "user";

    /**
     * 解析用户在指定租户下的角色。
     * 优先级：全局超管 super_admin > 该租户 tenant_admin > 普通用户 user
     *
     * @param wxUserId 微信用户ID
     * @param clubId 租户(俱乐部)ID
     * @return 角色字符串：super_admin / tenant_admin / user
     */
    public String resolveRole(Long wxUserId, Long clubId);

    public TenantAdmin selectTenantAdminById(Long id);

    public List<TenantAdmin> selectTenantAdminList(TenantAdmin tenantAdmin);

    public int insertTenantAdmin(TenantAdmin tenantAdmin);

    public int updateTenantAdmin(TenantAdmin tenantAdmin);

    public int deleteTenantAdminByIds(Long[] ids);

    public int deleteTenantAdminById(Long id);
}
