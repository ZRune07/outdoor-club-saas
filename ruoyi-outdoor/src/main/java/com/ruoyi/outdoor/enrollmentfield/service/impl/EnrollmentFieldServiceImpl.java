package com.ruoyi.outdoor.enrollmentfield.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.ruoyi.outdoor.enrollmentfield.domain.EnrollmentField;
import com.ruoyi.outdoor.enrollmentfield.mapper.EnrollmentFieldMapper;
import com.ruoyi.outdoor.enrollmentfield.service.IEnrollmentFieldService;

/**
 * 报名表单配置 服务层实现
 *
 * @author ruoyi
 */
@Service
public class EnrollmentFieldServiceImpl implements IEnrollmentFieldService
{
    @Autowired
    private EnrollmentFieldMapper enrollmentFieldMapper;

    /**
     * 查询指定租户与活动的报名表单配置，无则回退到 activityId=0 的租户默认配置
     */
    @Override
    public EnrollmentField getConfig(Long clubId, Long activityId)
    {
        Long queryActivityId = activityId == null ? 0L : activityId;
        EnrollmentField config = enrollmentFieldMapper.selectEnrollmentField(clubId, queryActivityId);
        if (config == null && queryActivityId != 0L)
        {
            config = enrollmentFieldMapper.selectEnrollmentField(clubId, 0L);
        }
        return config;
    }

    /**
     * 保存报名表单配置（存在则更新，否则新增）
     */
    @Override
    public int saveConfig(EnrollmentField enrollmentField)
    {
        if (enrollmentField.getActivityId() == null)
        {
            enrollmentField.setActivityId(0L);
        }
        EnrollmentField existing = enrollmentFieldMapper.selectEnrollmentField(
                enrollmentField.getClubId(), enrollmentField.getActivityId());
        if (existing != null)
        {
            enrollmentField.setId(existing.getId());
            return enrollmentFieldMapper.updateEnrollmentField(enrollmentField);
        }
        return enrollmentFieldMapper.insertEnrollmentField(enrollmentField);
    }
}
