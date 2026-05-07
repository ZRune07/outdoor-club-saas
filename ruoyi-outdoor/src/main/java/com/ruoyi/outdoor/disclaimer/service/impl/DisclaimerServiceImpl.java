package com.ruoyi.outdoor.disclaimer.service.impl;

import com.ruoyi.common.core.domain.AjaxResult;
import com.ruoyi.common.utils.DateUtils;
import com.ruoyi.common.utils.StringUtils;
import com.ruoyi.outdoor.disclaimer.domain.Disclaimer;
import com.ruoyi.outdoor.disclaimer.domain.SignRecord;
import com.ruoyi.outdoor.disclaimer.mapper.DisclaimerMapper;
import com.ruoyi.outdoor.disclaimer.mapper.SignRecordMapper;
import com.ruoyi.outdoor.disclaimer.service.IDisclaimerService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

/**
 * 免责声明Service业务层处理
 */
@Service
public class DisclaimerServiceImpl implements IDisclaimerService {
    private static final Logger log = LoggerFactory.getLogger(DisclaimerServiceImpl.class);

    @Autowired
    private DisclaimerMapper disclaimerMapper;
    
    @Autowired
    private SignRecordMapper signRecordMapper;

    /**
     * 根据ID查询
     */
    @Override
    public Disclaimer selectDisclaimerByDisclaimerId(Long disclaimerId) {
        return disclaimerMapper.selectDisclaimerByDisclaimerId(disclaimerId);
    }

    /**
     * 获取俱乐部有效的免责声明
     */
    @Override
    public Disclaimer selectActiveDisclaimer(Long clubId) {
        return disclaimerMapper.selectActiveDisclaimerByClubId(clubId);
    }

    /**
     * 查询免责声明列表
     */
    @Override
    public List<Disclaimer> selectDisclaimerList(Disclaimer disclaimer) {
        return disclaimerMapper.selectDisclaimerList(disclaimer);
    }

    /**
     * 新增免责声明
     */
    @Override
    @Transactional
    public int insertDisclaimer(Disclaimer disclaimer) {
        disclaimer.setCreateTime(DateUtils.getNowDate());
        return disclaimerMapper.insertDisclaimer(disclaimer);
    }

    /**
     * 更新免责声明
     */
    @Override
    @Transactional
    public int updateDisclaimer(Disclaimer disclaimer) {
        disclaimer.setUpdateTime(DateUtils.getNowDate());
        return disclaimerMapper.updateDisclaimer(disclaimer);
    }

    /**
     * 删除免责声明
     */
    @Override
    @Transactional
    public int deleteDisclaimerByDisclaimerId(Long disclaimerId) {
        return disclaimerMapper.deleteDisclaimerByDisclaimerId(disclaimerId);
    }

    /**
     * 获取用户签署记录
     */
    @Override
    public SignRecord selectSignRecordByRegistrationId(Long registrationId) {
        return signRecordMapper.selectSignRecordByRegistrationId(registrationId);
    }

    /**
     * 获取用户的签署记录列表
     */
    @Override
    public List<SignRecord> selectSignRecordListByUserId(Long wxUserId) {
        return signRecordMapper.selectSignRecordListByUserId(wxUserId);
    }

    /**
     * 签署免责协议
     */
    @Override
    @Transactional
    public AjaxResult signDisclaimer(SignRecord signRecord) {
        try {
            // 校验必填参数
            if (signRecord.getWxUserId() == null) {
                return AjaxResult.error("用户ID不能为空");
            }
            if (signRecord.getClubId() == null) {
                return AjaxResult.error("俱乐部ID不能为空");
            }
            if (StringUtils.isEmpty(signRecord.getSignName())) {
                return AjaxResult.error("签署人姓名不能为空");
            }
            
            // 获取有效的免责声明
            Disclaimer disclaimer = disclaimerMapper.selectActiveDisclaimerByClubId(signRecord.getClubId());
            if (disclaimer == null) {
                return AjaxResult.error("未找到有效的免责声明");
            }
            
            // 检查是否已签署
            if (signRecord.getRegistrationId() != null) {
                SignRecord existing = signRecordMapper.selectSignRecordByRegistrationId(signRecord.getRegistrationId());
                if (existing != null && "signed".equals(existing.getSignStatus())) {
                    return AjaxResult.error("您已签署过此活动的免责协议");
                }
            }
            
            // 设置签署信息
            signRecord.setDisclaimerId(disclaimer.getDisclaimerId());
            signRecord.setSignTime(new Date());
            signRecord.setSignStatus("signed");
            signRecord.setCreateTime(DateUtils.getNowDate());
            signRecord.setCreateBy(String.valueOf(signRecord.getWxUserId()));
            
            // 保存签署记录
            signRecordMapper.insertSignRecord(signRecord);
            
            log.info("用户 {} 签署免责协议成功", signRecord.getWxUserId());
            return AjaxResult.success("签署成功", signRecord);
        } catch (Exception e) {
            log.error("签署免责协议失败", e);
            return AjaxResult.error("签署失败，请重试");
        }
    }

    /**
     * 查询签署记录列表
     */
    @Override
    public List<SignRecord> selectSignRecordList(SignRecord signRecord) {
        return signRecordMapper.selectSignRecordList(signRecord);
    }
}
