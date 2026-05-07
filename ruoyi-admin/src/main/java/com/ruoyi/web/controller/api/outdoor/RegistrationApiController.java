package com.ruoyi.web.controller.api.outdoor;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.ruoyi.common.core.controller.BaseController;
import com.ruoyi.common.core.domain.AjaxResult;
import com.ruoyi.common.core.page.TableDataInfo;
import com.ruoyi.outdoor.registration.domain.Registration;
import com.ruoyi.outdoor.registration.service.IRegistrationService;

/**
 * 报名API（H5/小程序端）
 * 
 * @author ruoyi
 */
@RestController
@RequestMapping("/api/registration")
public class RegistrationApiController extends BaseController
{
    @Autowired
    private IRegistrationService registrationService;

    /**
     * 查询我的报名列表（H5/小程序端）
     */
    @GetMapping("/my")
    public TableDataInfo myList(Registration registration)
    {
        startPage();
        List<Registration> list = registrationService.selectRegistrationList(registration);
        return getDataTable(list);
    }

    /**
     * 查询报名列表（H5/小程序端）
     */
    @GetMapping("/list")
    public TableDataInfo list(Registration registration)
    {
        startPage();
        List<Registration> list = registrationService.selectRegistrationList(registration);
        return getDataTable(list);
    }

    /**
     * 获取报名详细信息（H5/小程序端）
     */
    @GetMapping(value = "/{registrationId}")
    public AjaxResult getInfo(@PathVariable("registrationId") Long registrationId)
    {
        return success(registrationService.selectRegistrationByRegistrationId(registrationId));
    }

    /**
     * 新增报名（H5/小程序端）
     */
    @PostMapping
    public AjaxResult add(@Validated @RequestBody Registration registration)
    {
        return toAjax(registrationService.insertRegistration(registration));
    }

    /**
     * 修改报名（H5/小程序端）
     */
    @PutMapping
    public AjaxResult edit(@Validated @RequestBody Registration registration)
    {
        return toAjax(registrationService.updateRegistration(registration));
    }
}
