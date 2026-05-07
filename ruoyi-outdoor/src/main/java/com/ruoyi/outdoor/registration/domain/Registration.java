package com.ruoyi.outdoor.registration.domain;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.Date;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import com.ruoyi.common.annotation.Excel;
import com.ruoyi.common.core.domain.BaseEntity;

/**
 * 报名对象 reg_registration
 * 
 * @author ruoyi
 */
public class Registration extends BaseEntity
{
    private static final long serialVersionUID = 1L;

    /** 报名ID */
    @Excel(name = "报名ID")
    private Long registrationId;

    /** 俱乐部ID */
    @NotNull(message = "俱乐部ID不能为空")
    @Excel(name = "俱乐部ID")
    private Long clubId;

    /** 活动ID */
    @NotNull(message = "活动ID不能为空")
    @Excel(name = "活动ID")
    private Long activityId;

    /** 微信用户ID */
    @NotNull(message = "微信用户ID不能为空")
    @Excel(name = "微信用户ID")
    private Long wxUserId;

    /** 真实姓名 */
    @NotBlank(message = "真实姓名不能为空")
    @Size(min = 0, max = 50, message = "真实姓名长度不能超过50个字符")
    @Excel(name = "真实姓名")
    private String realName;

    /** 手机号 */
    @NotBlank(message = "手机号不能为空")
    @Size(min = 0, max = 20, message = "手机号长度不能超过20个字符")
    @Excel(name = "手机号")
    private String phone;

    /** 身份证号 */
    @Size(min = 0, max = 100, message = "身份证号长度不能超过100个字符")
    @Excel(name = "身份证号")
    private String idCard;

    /** 紧急联系人 */
    @Size(min = 0, max = 50, message = "紧急联系人长度不能超过50个字符")
    @Excel(name = "紧急联系人")
    private String emergencyContact;

    /** 紧急联系电话 */
    @Size(min = 0, max = 20, message = "紧急联系电话长度不能超过20个字符")
    @Excel(name = "紧急联系电话")
    private String emergencyPhone;

    /** 状态（pending待支付 paid已支付 approved已审核 canceled已取消） */
    @Excel(name = "状态", readConverterExp = "pending=待支付,paid=已支付,approved=已审核,canceled=已取消")
    private String status;

    /** 备注 */
    @Excel(name = "备注")
    private String remark;

    // ==================== 关联字段（非数据库字段）====================
    /** 活动标题 */
    private String activityTitle;
    
    /** 活动开始时间 */
    private Date activityStartTime;
    
    /** 活动地点 */
    private String activityLocation;

    public void setRegistrationId(Long registrationId) 
    {
        this.registrationId = registrationId;
    }

    public Long getRegistrationId() 
    {
        return registrationId;
    }

    public void setClubId(Long clubId) 
    {
        this.clubId = clubId;
    }

    public Long getClubId() 
    {
        return clubId;
    }

    public void setActivityId(Long activityId) 
    {
        this.activityId = activityId;
    }

    public Long getActivityId() 
    {
        return activityId;
    }

    public void setWxUserId(Long wxUserId) 
    {
        this.wxUserId = wxUserId;
    }

    public Long getWxUserId() 
    {
        return wxUserId;
    }

    public void setRealName(String realName) 
    {
        this.realName = realName;
    }

    public String getRealName() 
    {
        return realName;
    }

    public void setPhone(String phone) 
    {
        this.phone = phone;
    }

    public String getPhone() 
    {
        return phone;
    }

    public void setIdCard(String idCard) 
    {
        this.idCard = idCard;
    }

    public String getIdCard() 
    {
        return idCard;
    }

    public void setEmergencyContact(String emergencyContact) 
    {
        this.emergencyContact = emergencyContact;
    }

    public String getEmergencyContact() 
    {
        return emergencyContact;
    }

    public void setEmergencyPhone(String emergencyPhone) 
    {
        this.emergencyPhone = emergencyPhone;
    }

    public String getEmergencyPhone() 
    {
        return emergencyPhone;
    }

    public void setStatus(String status) 
    {
        this.status = status;
    }

    public String getStatus() 
    {
        return status;
    }

    public String getActivityTitle() {
        return activityTitle;
    }

    public void setActivityTitle(String activityTitle) {
        this.activityTitle = activityTitle;
    }

    public Date getActivityStartTime() {
        return activityStartTime;
    }

    public void setActivityStartTime(Date activityStartTime) {
        this.activityStartTime = activityStartTime;
    }

    public String getActivityLocation() {
        return activityLocation;
    }

    public void setActivityLocation(String activityLocation) {
        this.activityLocation = activityLocation;
    }

    @Override
    public String toString() {
        return new ToStringBuilder(this, ToStringStyle.MULTI_LINE_STYLE)
            .append("registrationId", getRegistrationId())
            .append("clubId", getClubId())
            .append("activityId", getActivityId())
            .append("wxUserId", getWxUserId())
            .append("realName", getRealName())
            .append("phone", getPhone())
            .append("idCard", getIdCard())
            .append("emergencyContact", getEmergencyContact())
            .append("emergencyPhone", getEmergencyPhone())
            .append("status", getStatus())
            .append("remark", getRemark())
            .append("createBy", getCreateBy())
            .append("createTime", getCreateTime())
            .append("updateBy", getUpdateBy())
            .append("updateTime", getUpdateTime())
            .toString();
    }
}
