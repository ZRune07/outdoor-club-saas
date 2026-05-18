package com.ruoyi.outdoor.agreement.service.impl;

import com.ruoyi.common.core.domain.AjaxResult;
import com.ruoyi.common.utils.DateUtils;
import com.ruoyi.common.utils.StringUtils;
import com.ruoyi.outdoor.agreement.domain.Agreement;
import com.ruoyi.outdoor.agreement.mapper.AgreementMapper;
import com.ruoyi.outdoor.agreement.service.IAgreementService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

/**
 * 电子签协议Service业务层处理
 */
@Service
public class AgreementServiceImpl implements IAgreementService {
    private static final Logger log = LoggerFactory.getLogger(AgreementServiceImpl.class);

    @Autowired
    private AgreementMapper agreementMapper;

    @Override
    public Agreement selectAgreementById(Long id) {
        return agreementMapper.selectAgreementById(id);
    }

    @Override
    public Agreement selectAgreementByEnrollmentId(Long clubId, Long enrollmentId) {
        return agreementMapper.selectAgreementByEnrollmentId(clubId, enrollmentId);
    }

    @Override
    public List<Agreement> selectAgreementList(Agreement agreement) {
        return agreementMapper.selectAgreementList(agreement);
    }

    @Override
    @Transactional
    public AjaxResult sign(Agreement agreement) {
        try {
            if (agreement.getClubId() == null) {
                return AjaxResult.error("租户不能为空");
            }
            if (StringUtils.isEmpty(agreement.getSignature())) {
                return AjaxResult.error("签名不能为空");
            }
            if (StringUtils.isEmpty(agreement.getSignerName())) {
                return AjaxResult.error("签署人姓名不能为空");
            }

            agreement.setSignedAt(new Date());
            agreement.setStatus("1");
            agreement.setCreateTime(DateUtils.getNowDate());

            agreementMapper.insertAgreement(agreement);

            log.info("协议签署成功，clubId={}, enrollmentId={}", agreement.getClubId(), agreement.getEnrollmentId());
            return AjaxResult.success("签署成功", agreement);
        } catch (Exception e) {
            log.error("协议签署失败", e);
            return AjaxResult.error("签署失败，请重试");
        }
    }
}
