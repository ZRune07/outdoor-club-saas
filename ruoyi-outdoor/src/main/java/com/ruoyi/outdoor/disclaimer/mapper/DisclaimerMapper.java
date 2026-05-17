package com.ruoyi.outdoor.disclaimer.mapper;

import com.ruoyi.outdoor.disclaimer.domain.Disclaimer;
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


