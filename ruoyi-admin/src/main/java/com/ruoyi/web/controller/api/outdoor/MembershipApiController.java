package com.ruoyi.web.controller.api.outdoor;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.ruoyi.common.annotation.Anonymous;
import com.ruoyi.common.core.controller.BaseController;
import com.ruoyi.common.core.domain.AjaxResult;
import com.ruoyi.framework.tenant.TenantContextHolder;
import com.ruoyi.outdoor.membership.domain.MembershipConfig;
import com.ruoyi.outdoor.membership.domain.UserMembership;
import com.ruoyi.outdoor.membership.service.IMembershipService;

/**
 * 会员体系 API
 */
@Anonymous
@RestController
@RequestMapping("/api/membership")
public class MembershipApiController extends BaseController
{
    @Autowired
    private IMembershipService membershipService;

    /**
     * 取当前租户会员等级配置
     */
    @GetMapping("/config")
    public AjaxResult getConfig()
    {
        Long tenantId = TenantContextHolder.getTenantId();
        if (tenantId == null)
        {
            return error("缺少租户信息");
        }
        List<MembershipConfig> list = membershipService.getConfigByClubId(tenantId);
        return success(list);
    }

    /**
     * 保存会员等级配置（仅租户管理员）
     */
    @PostMapping("/config")
    public AjaxResult saveConfig(@RequestBody MembershipConfig config)
    {
        return doSaveConfig(config);
    }

    /**
     * 更新会员等级配置（仅租户管理员）
     */
    @PutMapping("/config")
    public AjaxResult updateConfig(@RequestBody MembershipConfig config)
    {
        return doSaveConfig(config);
    }

    private AjaxResult doSaveConfig(MembershipConfig config)
    {
        if (!TenantContextHolder.isTenantAdmin())
        {
            return error("无权限：仅租户管理员可操作");
        }
        Long tenantId = TenantContextHolder.getTenantId();
        if (tenantId == null)
        {
            return error("缺少租户信息");
        }
        config.setClubId(tenantId);
        return toAjax(membershipService.saveConfig(config));
    }

    /**
     * 当前用户激活会员
     */
    @PostMapping("/activate")
    public AjaxResult activate(@RequestParam("configId") Long configId)
    {
        Long wxUserId = TenantContextHolder.getWxUserId();
        Long tenantId = TenantContextHolder.getTenantId();
        if (wxUserId == null || tenantId == null)
        {
            return error("用户未登录");
        }
        UserMembership membership = membershipService.activate(wxUserId, tenantId, configId);
        if (membership == null)
        {
            return error("会员等级配置不存在或不属于当前租户");
        }
        return success(membership);
    }

    /**
     * 当前用户在当前租户的会员状态
     */
    @GetMapping("/my")
    public AjaxResult my()
    {
        Long wxUserId = TenantContextHolder.getWxUserId();
        Long tenantId = TenantContextHolder.getTenantId();
        if (wxUserId == null || tenantId == null)
        {
            return error("用户未登录");
        }
        return success(membershipService.getMyMembership(wxUserId, tenantId));
    }
}
