package com.ruoyi.outdoor.tenantadmin.mapper;

import java.util.List;
import com.ruoyi.outdoor.tenantadmin.domain.TenantAdmin;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

/**
 * 租户管理员Mapper接口
 *
 * @author ruoyi
 */
@Mapper
public interface TenantAdminMapper
{
    /**
     * 查询某用户在某租户下的有效管理员记录
     *
     * @param wxUserId 微信用户ID
     * @param clubId 租户(俱乐部)ID
     * @return 租户管理员
     */
    public TenantAdmin selectByUserAndClub(@Param("wxUserId") Long wxUserId, @Param("clubId") Long clubId);

    /**
     * 查询某用户是否为超级管理员（任意租户下 role=super_admin）
     *
     * @param wxUserId 微信用户ID
     * @return 记录数
     */
    public int countSuperAdmin(@Param("wxUserId") Long wxUserId);

    /**
     * 查询租户管理员列表
     *
     * @param tenantAdmin 查询条件
     * @return 集合
     */
    public List<TenantAdmin> selectTenantAdminList(TenantAdmin tenantAdmin);

    public TenantAdmin selectTenantAdminById(@Param("id") Long id);

    public int insertTenantAdmin(TenantAdmin tenantAdmin);

    public int updateTenantAdmin(TenantAdmin tenantAdmin);

    public int deleteTenantAdminById(@Param("id") Long id);

    public int deleteTenantAdminByIds(@Param("ids") Long[] ids);
}
