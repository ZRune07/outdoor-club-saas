package com.ruoyi.web.controller.admin.outdoor;

import java.util.List;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.ruoyi.common.annotation.Log;
import com.ruoyi.common.core.controller.BaseController;
import com.ruoyi.common.core.domain.AjaxResult;
import com.ruoyi.common.enums.BusinessType;
import com.ruoyi.outdoor.registration.domain.Registration;
import com.ruoyi.outdoor.registration.service.IRegistrationService;
import com.ruoyi.common.utils.poi.ExcelUtil;
import com.ruoyi.common.core.page.TableDataInfo;

/**
 * 报名管理Controller
 * 
 * @author ruoyi
 */
@RestController
@RequestMapping("/admin/outdoor/registration")
public class RegistrationController extends BaseController
{
    @Autowired
    private IRegistrationService registrationService;

    /**
     * 查询报名列表
     */
    @PreAuthorize("@ss.hasPermi('outdoor:registration:list')")
    @GetMapping("/list")
    public TableDataInfo list(Registration registration)
    {
        startPage();
        List<Registration> list = registrationService.selectRegistrationList(registration);
        return getDataTable(list);
    }

    /**
     * 导出报名列表
     */
    @PreAuthorize("@ss.hasPermi('outdoor:registration:export')")
    @Log(title = "报名", businessType = BusinessType.EXPORT)
    @PostMapping("/export")
    public void export(HttpServletResponse response, Registration registration)
    {
        List<Registration> list = registrationService.selectRegistrationList(registration);
        ExcelUtil<Registration> util = new ExcelUtil<Registration>(Registration.class);
        util.exportExcel(response, list, "报名数据");
    }

    /**
     * 获取报名详细信息
     */
    @PreAuthorize("@ss.hasPermi('outdoor:registration:query')")
    @GetMapping(value = "/{registrationId}")
    public AjaxResult getInfo(@PathVariable("registrationId") Long registrationId)
    {
        return success(registrationService.selectRegistrationByRegistrationId(registrationId));
    }

    /**
     * 新增报名
     */
    @PreAuthorize("@ss.hasPermi('outdoor:registration:add')")
    @Log(title = "报名", businessType = BusinessType.INSERT)
    @PostMapping
    public AjaxResult add(@Validated @RequestBody Registration registration)
    {
        registration.setCreateBy(getUsername());
        return toAjax(registrationService.insertRegistration(registration));
    }

    /**
     * 修改报名
     */
    @PreAuthorize("@ss.hasPermi('outdoor:registration:edit')")
    @Log(title = "报名", businessType = BusinessType.UPDATE)
    @PutMapping
    public AjaxResult edit(@Validated @RequestBody Registration registration)
    {
        registration.setUpdateBy(getUsername());
        return toAjax(registrationService.updateRegistration(registration));
    }

    /**
     * 审核报名
     */
    @PreAuthorize("@ss.hasPermi('outdoor:registration:edit')")
    @Log(title = "报名", businessType = BusinessType.UPDATE)
    @PutMapping("/audit")
    public AjaxResult audit(Long registrationId, String auditStatus, String auditRemark)
    {
        Registration registration = new Registration();
        registration.setRegistrationId(registrationId);
        registration.setStatus(auditStatus);
        registration.setRemark(auditRemark);
        registration.setUpdateBy(getUsername());
        return toAjax(registrationService.updateRegistration(registration));
    }

    /**
     * 取消报名
     */
    @PreAuthorize("@ss.hasPermi('outdoor:registration:edit')")
    @Log(title = "报名", businessType = BusinessType.UPDATE)
    @PutMapping("/cancel")
    public AjaxResult cancel(Long registrationId, String cancelReason)
    {
        Registration registration = new Registration();
        registration.setRegistrationId(registrationId);
        registration.setStatus("canceled");
        registration.setRemark(cancelReason);
        registration.setUpdateBy(getUsername());
        return toAjax(registrationService.updateRegistration(registration));
    }

    /**
     * 删除报名
     */
    @PreAuthorize("@ss.hasPermi('outdoor:registration:remove')")
    @Log(title = "报名", businessType = BusinessType.DELETE)
	@DeleteMapping("/{registrationIds}")
    public AjaxResult remove(@PathVariable Long[] registrationIds)
    {
        return toAjax(registrationService.deleteRegistrationByRegistrationIds(registrationIds));
    }
}
