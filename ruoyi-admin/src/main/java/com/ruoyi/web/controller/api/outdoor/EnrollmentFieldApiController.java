package com.ruoyi.web.controller.api.outdoor;

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
import com.ruoyi.outdoor.enrollmentfield.domain.EnrollmentField;
import com.ruoyi.outdoor.enrollmentfield.service.IEnrollmentFieldService;

/**
 * 报名表单配置 API（H5/小程序端）
 *
 * @author ruoyi
 */
@Anonymous
@RestController
@RequestMapping("/api/enrollment-field")
public class EnrollmentFieldApiController extends BaseController
{
    @Autowired
    private IEnrollmentFieldService enrollmentFieldService;

    /**
     * 查询当前租户指定活动的报名表单配置（无则回退租户默认 activityId=0）
     */
    @GetMapping
    public AjaxResult getConfig(@RequestParam(required = false) Long activityId)
    {
        Long tenantId = TenantContextHolder.getTenantId();
        if (tenantId == null)
        {
            return error("租户上下文缺失");
        }
        return success(enrollmentFieldService.getConfig(tenantId, activityId));
    }

    /**
     * 保存报名表单配置（新增）
     */
    @PostMapping
    public AjaxResult add(@RequestBody EnrollmentField enrollmentField)
    {
        return save(enrollmentField);
    }

    /**
     * 保存报名表单配置（更新）
     */
    @PutMapping
    public AjaxResult edit(@RequestBody EnrollmentField enrollmentField)
    {
        return save(enrollmentField);
    }

    private AjaxResult save(EnrollmentField enrollmentField)
    {
        Long tenantId = TenantContextHolder.getTenantId();
        if (tenantId == null)
        {
            return error("租户上下文缺失");
        }
        if (!TenantContextHolder.isTenantAdmin())
        {
            return error("无权限操作");
        }
        enrollmentField.setClubId(tenantId);
        int result = enrollmentFieldService.saveConfig(enrollmentField);
        if (result > 0)
        {
            return success(enrollmentField);
        }
        return error("保存失败");
    }
}
