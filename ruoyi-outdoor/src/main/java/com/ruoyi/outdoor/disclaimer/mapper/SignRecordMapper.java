package com.ruoyi.outdoor.disclaimer.mapper;

import com.ruoyi.outdoor.disclaimer.domain.SignRecord;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

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
