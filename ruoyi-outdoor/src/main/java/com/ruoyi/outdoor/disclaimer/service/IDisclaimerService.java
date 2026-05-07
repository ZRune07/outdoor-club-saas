package com.ruoyi.outdoor.disclaimer.service;

import com.ruoyi.common.core.domain.AjaxResult;
import com.ruoyi.outdoor.disclaimer.domain.Disclaimer;
import com.ruoyi.outdoor.disclaimer.domain.SignRecord;

import java.util.List;

/**
 * 免责声明Service接口
 */
public interface IDisclaimerService {
    
    /**
     * 根据ID查询
     */
    Disclaimer selectDisclaimerByDisclaimerId(Long disclaimerId);
    
    /**
     * 获取俱乐部有效的免责声明
     */
    Disclaimer selectActiveDisclaimer(Long clubId);
    
    /**
     * 查询免责声明列表
     */
    List<Disclaimer> selectDisclaimerList(Disclaimer disclaimer);
    
    /**
     * 新增免责声明
     */
    int insertDisclaimer(Disclaimer disclaimer);
    
    /**
     * 更新免责声明
     */
    int updateDisclaimer(Disclaimer disclaimer);
    
    /**
     * 删除免责声明
     */
    int deleteDisclaimerByDisclaimerId(Long disclaimerId);
    
    /**
     * 获取用户签署记录
     */
    SignRecord selectSignRecordByRegistrationId(Long registrationId);
    
    /**
     * 获取用户的签署记录列表
     */
    List<SignRecord> selectSignRecordListByUserId(Long wxUserId);
    
    /**
     * 签署免责协议
     */
    AjaxResult signDisclaimer(SignRecord signRecord);
    
    /**
     * 查询签署记录列表
     */
    List<SignRecord> selectSignRecordList(SignRecord signRecord);
}
