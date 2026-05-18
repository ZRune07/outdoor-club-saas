package com.ruoyi.outdoor.enrollmentfield.domain;

import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import com.ruoyi.common.core.domain.BaseEntity;

/**
 * 报名表单配置对象 outdoor_enrollment_field
 *
 * @author ruoyi
 */
public class EnrollmentField extends BaseEntity
{
    private static final long serialVersionUID = 1L;

    /** 主键ID */
    private Long id;

    /** 俱乐部ID（租户） */
    private Long clubId;

    /** 活动ID（0=租户级默认配置） */
    private Long activityId;

    /** 字段数组JSON [{label,key,type,placeholder,required}] */
    private String fieldsJson;

    /** 报名协议内容 */
    private String agreementContent;

    /** 是否开启报名（1是 0否） */
    private String enableEnrollment;

    /** 是否开启协议（1是 0否） */
    private String enableAgreement;

    /** 是否要求会员（1是 0否） */
    private String membershipRequired;

    /** 状态（0正常 1停用） */
    private String status;

    /** 删除标志（0代表存在 2代表删除） */
    private String delFlag;

    public Long getId()
    {
        return id;
    }

    public void setId(Long id)
    {
        this.id = id;
    }

    public Long getClubId()
    {
        return clubId;
    }

    public void setClubId(Long clubId)
    {
        this.clubId = clubId;
    }

    public Long getActivityId()
    {
        return activityId;
    }

    public void setActivityId(Long activityId)
    {
        this.activityId = activityId;
    }

    public String getFieldsJson()
    {
        return fieldsJson;
    }

    public void setFieldsJson(String fieldsJson)
    {
        this.fieldsJson = fieldsJson;
    }

    public String getAgreementContent()
    {
        return agreementContent;
    }

    public void setAgreementContent(String agreementContent)
    {
        this.agreementContent = agreementContent;
    }

    public String getEnableEnrollment()
    {
        return enableEnrollment;
    }

    public void setEnableEnrollment(String enableEnrollment)
    {
        this.enableEnrollment = enableEnrollment;
    }

    public String getEnableAgreement()
    {
        return enableAgreement;
    }

    public void setEnableAgreement(String enableAgreement)
    {
        this.enableAgreement = enableAgreement;
    }

    public String getMembershipRequired()
    {
        return membershipRequired;
    }

    public void setMembershipRequired(String membershipRequired)
    {
        this.membershipRequired = membershipRequired;
    }

    public String getStatus()
    {
        return status;
    }

    public void setStatus(String status)
    {
        this.status = status;
    }

    public String getDelFlag()
    {
        return delFlag;
    }

    public void setDelFlag(String delFlag)
    {
        this.delFlag = delFlag;
    }

    @Override
    public String toString() {
        return new ToStringBuilder(this,ToStringStyle.MULTI_LINE_STYLE)
            .append("id", getId())
            .append("clubId", getClubId())
            .append("activityId", getActivityId())
            .append("fieldsJson", getFieldsJson())
            .append("agreementContent", getAgreementContent())
            .append("enableEnrollment", getEnableEnrollment())
            .append("enableAgreement", getEnableAgreement())
            .append("membershipRequired", getMembershipRequired())
            .append("status", getStatus())
            .append("delFlag", getDelFlag())
            .append("createBy", getCreateBy())
            .append("createTime", getCreateTime())
            .append("updateBy", getUpdateBy())
            .append("updateTime", getUpdateTime())
            .append("remark", getRemark())
            .toString();
    }
}
