package com.ruoyi.web.controller.api.outdoor;

import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.ruoyi.common.annotation.Anonymous;
import com.ruoyi.common.core.controller.BaseController;
import com.ruoyi.common.core.domain.AjaxResult;
import com.ruoyi.common.core.page.TableDataInfo;
import com.ruoyi.framework.tenant.TenantContextHolder;
import com.ruoyi.outdoor.registration.domain.Registration;
import com.ruoyi.outdoor.registration.service.IRegistrationService;

/**
 * 报名API（H5/小程序端）
 * 
 * @author ruoyi
 */
@Anonymous
@RestController
@RequestMapping("/api/registration")
public class RegistrationApiController extends BaseController
{
    @Autowired
    private IRegistrationService registrationService;

    /**
     * 根据活动ID查询报名列表
     */
    @GetMapping("/activity/{activityId}")
    public AjaxResult getByActivity(@PathVariable("activityId") Long activityId)
    {
        List<Registration> list = registrationService.selectRegistrationByActivityId(activityId);
        return success(list);
    }

    /**
     * 查询我的报名列表
     */
    @GetMapping("/my/{wxUserId}")
    public AjaxResult getMyRegistrations(@PathVariable("wxUserId") Long wxUserId)
    {
        List<Registration> list = registrationService.selectRegistrationByWxUserId(wxUserId);
        return success(list);
    }

    /**
     * 查询报名列表（分页）
     */
    @GetMapping("/list")
    public TableDataInfo list(Registration registration)
    {
        startPage();
        List<Registration> list = registrationService.selectRegistrationList(registration);
        return getDataTable(list);
    }

    /**
     * 获取报名详细信息
     */
    @GetMapping("/{registrationId}")
    public AjaxResult getInfo(@PathVariable("registrationId") Long registrationId)
    {
        Registration registration = registrationService.selectRegistrationByRegistrationId(registrationId);
        if (registration == null)
        {
            return error("报名记录不存在");
        }
        return success(registration);
    }

    /**
     * 检查用户是否已报名该活动
     */
    @GetMapping("/check")
    public AjaxResult checkRegistration(@RequestParam Long activityId, @RequestParam Long wxUserId)
    {
        Registration registration = registrationService.selectRegistrationByActivityAndUser(activityId, wxUserId);
        return success(registration != null);
    }

    /**
     * 查询当前用户在当前租户下的报名列表
     */
    @GetMapping("/my")
    public AjaxResult myRegistrations()
    {
        Long wxUserId = TenantContextHolder.getWxUserId();
        Long tenantId = TenantContextHolder.getTenantId();
        if (wxUserId == null)
        {
            return error("用户未登录");
        }
        List<Registration> list = registrationService.selectMyRegistrations(wxUserId, tenantId);
        return success(list);
    }

    /**
     * 按活动统计报名数（排除 cancelled/rejected），限当前租户
     */
    @GetMapping("/stats")
    public AjaxResult stats(@RequestParam("activityIds") Long[] activityIds)
    {
        Long tenantId = TenantContextHolder.getTenantId();
        List<Map<String, Object>> list = registrationService.selectRegistrationStats(activityIds, tenantId);
        return success(list);
    }

    /**
     * 新增报名
     */
    @PostMapping
    public AjaxResult add(@Validated @RequestBody Registration registration)
    {
        // club_id 用当前租户，若为空则回退请求体携带的值
        Long tenantId = TenantContextHolder.getTenantId();
        if (tenantId != null)
        {
            registration.setClubId(tenantId);
        }
        // 设置初始状态为待支付
        registration.setStatus("pending");
        int result = registrationService.insertRegistration(registration);
        if (result > 0)
        {
            return success(registration);
        }
        return error("报名失败");
    }

    /**
     * 修改报名
     */
    @PutMapping
    public AjaxResult edit(@Validated @RequestBody Registration registration)
    {
        int result = registrationService.updateRegistration(registration);
        return toAjax(result);
    }

    /**
     * 更新报名状态
     */
    @PutMapping("/{registrationId}/status")
    public AjaxResult updateStatus(@PathVariable("registrationId") Long registrationId, 
                                   @RequestParam String status)
    {
        int result = registrationService.updateRegistrationStatus(registrationId, status);
        return toAjax(result);
    }
}
