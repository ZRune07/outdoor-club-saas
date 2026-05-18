package com.ruoyi.web.controller.api.outdoor;

import com.ruoyi.common.annotation.Anonymous;
import com.ruoyi.common.core.controller.BaseController;
import com.ruoyi.common.core.domain.AjaxResult;
import com.ruoyi.framework.tenant.TenantContextHolder;
import com.ruoyi.outdoor.agreement.domain.Agreement;
import com.ruoyi.outdoor.agreement.service.IAgreementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * 电子签协议 API
 *
 * @author ruoyi
 */
@Anonymous
@RestController
@RequestMapping("/api/agreement")
public class AgreementApiController extends BaseController {

    @Autowired
    private IAgreementService agreementService;

    /**
     * 提交签名
     */
    @PostMapping("/sign")
    public AjaxResult sign(@RequestBody Agreement agreement) {
        Long tenantId = TenantContextHolder.getTenantId();
        if (tenantId == null) {
            return error("租户信息缺失");
        }
        agreement.setClubId(tenantId);
        return agreementService.sign(agreement);
    }

    /**
     * 根据报名ID查询协议（限当前租户）
     */
    @GetMapping
    public AjaxResult getByEnrollmentId(@RequestParam("enrollmentId") Long enrollmentId) {
        Long tenantId = TenantContextHolder.getTenantId();
        if (tenantId == null) {
            return error("租户信息缺失");
        }
        Agreement agreement = agreementService.selectAgreementByEnrollmentId(tenantId, enrollmentId);
        if (agreement == null) {
            return error("协议不存在");
        }
        return success(agreement);
    }
}
