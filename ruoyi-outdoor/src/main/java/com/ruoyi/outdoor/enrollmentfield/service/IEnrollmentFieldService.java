package com.ruoyi.outdoor.enrollmentfield.service;

import com.ruoyi.outdoor.enrollmentfield.domain.EnrollmentField;

/**
 * 报名表单配置 服务层
 *
 * @author ruoyi
 */
public interface IEnrollmentFieldService
{
    /**
     * 查询指定租户与活动的报名表单配置，无则回退到 activityId=0 的租户默认配置
     *
     * @param clubId 俱乐部ID（租户）
     * @param activityId 活动ID
     * @return 报名表单配置
     */
    public EnrollmentField getConfig(Long clubId, Long activityId);

    /**
     * 保存报名表单配置（存在则更新，否则新增）
     *
     * @param enrollmentField 报名表单配置
     * @return 结果
     */
    public int saveConfig(EnrollmentField enrollmentField);
}
