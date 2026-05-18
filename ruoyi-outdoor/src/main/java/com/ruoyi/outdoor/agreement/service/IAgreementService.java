package com.ruoyi.outdoor.agreement.service;

import com.ruoyi.common.core.domain.AjaxResult;
import com.ruoyi.outdoor.agreement.domain.Agreement;

import java.util.List;

/**
 * 电子签协议Service接口
 */
public interface IAgreementService {

    /**
     * 根据ID查询协议
     */
    Agreement selectAgreementById(Long id);

    /**
     * 根据报名ID查询协议（限当前租户）
     */
    Agreement selectAgreementByEnrollmentId(Long clubId, Long enrollmentId);

    /**
     * 查询协议列表
     */
    List<Agreement> selectAgreementList(Agreement agreement);

    /**
     * 提交签名
     */
    AjaxResult sign(Agreement agreement);
}
