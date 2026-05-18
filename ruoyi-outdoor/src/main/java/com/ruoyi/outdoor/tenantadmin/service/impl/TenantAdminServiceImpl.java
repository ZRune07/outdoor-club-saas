package com.ruoyi.outdoor.tenantadmin.service.impl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.ruoyi.outdoor.tenantadmin.domain.TenantAdmin;
import com.ruoyi.outdoor.tenantadmin.domain.TenantRole;
import com.ruoyi.outdoor.tenantadmin.mapper.TenantAdminMapper;
import com.ruoyi.outdoor.tenantadmin.service.ITenantAdminService;

/**
 * 租户管理员 服务层实现
 *
 * @author ruoyi
 */
@Service
public class TenantAdminServiceImpl implements ITenantAdminService
{
    @Autowired
    private TenantAdminMapper tenantAdminMapper;

    @Override
    public String resolveRole(Long wxUserId, Long clubId)
    {
        if (wxUserId == null)
        {
            return TenantRole.USER;
        }
        if (tenantAdminMapper.countSuperAdmin(wxUserId) > 0)
        {
            return TenantRole.SUPER_ADMIN;
        }
        if (clubId != null)
        {
            TenantAdmin admin = tenantAdminMapper.selectByUserAndClub(wxUserId, clubId);
            if (admin != null)
            {
                return admin.getRole();
            }
        }
        return TenantRole.USER;
    }

    @Override
    public TenantAdmin selectTenantAdminById(Long id)
    {
        return tenantAdminMapper.selectTenantAdminById(id);
    }

    @Override
    public List<TenantAdmin> selectTenantAdminList(TenantAdmin tenantAdmin)
    {
        return tenantAdminMapper.selectTenantAdminList(tenantAdmin);
    }

    @Override
    public int insertTenantAdmin(TenantAdmin tenantAdmin)
    {
        return tenantAdminMapper.insertTenantAdmin(tenantAdmin);
    }

    @Override
    public int updateTenantAdmin(TenantAdmin tenantAdmin)
    {
        return tenantAdminMapper.updateTenantAdmin(tenantAdmin);
    }

    @Override
    public int deleteTenantAdminByIds(Long[] ids)
    {
        return tenantAdminMapper.deleteTenantAdminByIds(ids);
    }

    @Override
    public int deleteTenantAdminById(Long id)
    {
        return tenantAdminMapper.deleteTenantAdminById(id);
    }
}
