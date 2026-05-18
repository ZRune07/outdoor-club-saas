package com.ruoyi.outdoor.enrollmentfield.mapper;

import com.ruoyi.outdoor.enrollmentfield.domain.EnrollmentField;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

/**
 * 报名表单配置Mapper接口
 *
 * @author ruoyi
 */
@Mapper
public interface EnrollmentFieldMapper
{
    /**
     * 查询指定租户与活动的报名表单配置
     *
     * @param clubId 俱乐部ID（租户）
     * @param activityId 活动ID
     * @return 报名表单配置
     */
    public EnrollmentField selectEnrollmentField(@Param("clubId") Long clubId,
                                                 @Param("activityId") Long activityId);

    /**
     * 新增报名表单配置
     *
     * @param enrollmentField 报名表单配置
     * @return 结果
     */
    public int insertEnrollmentField(EnrollmentField enrollmentField);

    /**
     * 修改报名表单配置
     *
     * @param enrollmentField 报名表单配置
     * @return 结果
     */
    public int updateEnrollmentField(EnrollmentField enrollmentField);
}
