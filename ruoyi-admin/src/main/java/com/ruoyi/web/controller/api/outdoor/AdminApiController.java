package com.ruoyi.web.controller.api.outdoor;

import java.util.List;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.ruoyi.common.annotation.Anonymous;
import com.ruoyi.common.core.controller.BaseController;
import com.ruoyi.common.core.domain.AjaxResult;
import com.ruoyi.common.core.page.TableDataInfo;
import com.ruoyi.common.utils.poi.ExcelUtil;
import com.ruoyi.framework.tenant.TenantContextHolder;
import com.ruoyi.outdoor.admininvite.domain.AdminInvite;
import com.ruoyi.outdoor.admininvite.service.IAdminInviteService;
import com.ruoyi.outdoor.adminquery.domain.EnrollmentView;
import com.ruoyi.outdoor.adminquery.mapper.EnrollmentQueryMapper;
import com.ruoyi.outdoor.tenantadmin.domain.TenantAdmin;
import com.ruoyi.outdoor.tenantadmin.service.ITenantAdminService;

/**
 * 管理端 API（角色解析、报名管理、邀请绑定）
 */
@RestController
@RequestMapping("/api/admin")
@Anonymous
public class AdminApiController extends BaseController
{
    @Autowired
    private ITenantAdminService tenantAdminService;

    @Autowired
    private IAdminInviteService adminInviteService;

    @Autowired
    private EnrollmentQueryMapper enrollmentQueryMapper;

    /**
     * 获取当前用户在当前租户下的角色
     */
    @GetMapping("/role")
    public AjaxResult role()
    {
        Long wxUserId = TenantContextHolder.getWxUserId();
        Long tenantId = TenantContextHolder.getTenantId();
        if (wxUserId == null || tenantId == null)
        {
            return error("用户未登录");
        }
        return success(tenantAdminService.resolveRole(wxUserId, tenantId));
    }

    /**
     * 查询当前租户下的报名列表（分页，仅租户管理员）
     */
    @GetMapping("/enrollments")
    public TableDataInfo enrollments(@RequestParam(value = "status", required = false) String status)
    {
        Long clubId = TenantContextHolder.getTenantId();
        if (!TenantContextHolder.isTenantAdmin())
        {
            TableDataInfo denied = new TableDataInfo();
            denied.setCode(403);
            denied.setMsg("无权限");
            denied.setRows(java.util.Collections.emptyList());
            denied.setTotal(0);
            return denied;
        }
        startPage();
        List<EnrollmentView> list = enrollmentQueryMapper.selectEnrollments(clubId, status);
        return getDataTable(list);
    }

    /**
     * 修改报名状态（仅租户管理员）
     */
    @PutMapping("/enrollment/{id}/status")
    public AjaxResult updateEnrollmentStatus(@PathVariable("id") Long id,
                                             @RequestParam("status") String status)
    {
        Long clubId = TenantContextHolder.getTenantId();
        if (!TenantContextHolder.isTenantAdmin())
        {
            return error("无权限");
        }
        int rows = enrollmentQueryMapper.updateEnrollmentStatus(id, clubId, status);
        return rows > 0 ? success() : error("报名不存在或不属于当前俱乐部");
    }

    /**
     * 导出当前租户报名（仅租户管理员）
     */
    @GetMapping("/enrollments/export")
    public void export(HttpServletResponse response)
    {
        Long clubId = TenantContextHolder.getTenantId();
        if (!TenantContextHolder.isTenantAdmin())
        {
            return;
        }
        List<EnrollmentView> list = enrollmentQueryMapper.selectEnrollments(clubId, null);
        ExcelUtil<EnrollmentView> util = new ExcelUtil<EnrollmentView>(EnrollmentView.class);
        util.exportExcel(response, list, "报名数据");
    }

    /**
     * 生成管理员邀请令牌（仅超级管理员）
     */
    @PostMapping("/invite")
    public AjaxResult invite(@RequestParam("clubId") Long clubId)
    {
        Long wxUserId = TenantContextHolder.getWxUserId();
        if (wxUserId == null)
        {
            return error("用户未登录");
        }
        if (!ITenantAdminService.ROLE_SUPER_ADMIN.equals(tenantAdminService.resolveRole(wxUserId, clubId)))
        {
            return error("无权限");
        }
        AdminInvite invite = adminInviteService.createInvite(clubId, String.valueOf(wxUserId));
        AjaxResult ajax = AjaxResult.success();
        ajax.put("token", invite.getToken());
        ajax.put("clubId", invite.getClubId());
        ajax.put("expireTime", invite.getExpireTime());
        return ajax;
    }

    /**
     * 通过邀请令牌绑定为租户管理员
     */
    @PostMapping("/invite/bind")
    public AjaxResult bind(@RequestParam("token") String token)
    {
        Long wxUserId = TenantContextHolder.getWxUserId();
        if (wxUserId == null)
        {
            return error("用户未登录");
        }
        AdminInvite invite = adminInviteService.validateToken(token);
        if (invite == null)
        {
            return error("邀请令牌无效或已过期");
        }
        TenantAdmin admin = new TenantAdmin();
        admin.setWxUserId(wxUserId);
        admin.setClubId(invite.getClubId());
        admin.setRole(ITenantAdminService.ROLE_TENANT_ADMIN);
        admin.setCreateBy(String.valueOf(wxUserId));
        tenantAdminService.insertTenantAdmin(admin);
        adminInviteService.markUsed(invite.getId(), wxUserId);
        return success();
    }
}
