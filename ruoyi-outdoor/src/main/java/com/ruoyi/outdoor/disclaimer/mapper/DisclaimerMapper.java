package com.ruoyi.outdoor.disclaimer.mapper;

import com.ruoyi.outdoor.disclaimer.domain.Disclaimer;
import com.ruoyi.outdoor.disclaimer.domain.SignRecord;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 免责声明Mapper接口
 */
@Mapper
public interface DisclaimerMapper {
    
    /**
     * 根据ID查询
     */
    Disclaimer selectDisclaimerByDisclaimerId(@Param("disclaimerId") Long disclaimerId);
    
    /**
     * 根据俱乐部ID查询有效的免责声明
     */
    Disclaimer selectActiveDisclaimerByClubId(@Param("clubId") Long clubId);
    
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
    int deleteDisclaimerByDisclaimerId(@Param("disclaimerId") Long disclaimerId);
}

/**
 * 签署记录Mapper接口
 */
@Mapper
public interface SignRecordMapper {
    
    /**
     * 根据ID查询
     */
    SignRecord selectSignRecordBySignId(@Param("signId") Long signId);
    
    /**
     * 根据报名ID查询签署记录
     */
    SignRecord selectSignRecordByRegistrationId(@Param("registrationId") Long registrationId);
    
    /**
     * 根据用户ID查询签署记录
     */
    List<SignRecord> selectSignRecordListByUserId(@Param("wxUserId") Long wxUserId);
    
    /**
     * 查询签署记录列表
     */
    List<SignRecord> selectSignRecordList(SignRecord signRecord);
    
    /**
     * 新增签署记录
     */
    int insertSignRecord(SignRecord signRecord);
    
    /**
     * 更新签署记录
     */
    int updateSignRecord(SignRecord signRecord);
    
    /**
     * 删除签署记录
     */
    int deleteSignRecordBySignId(@Param("signId") Long signId);
}
