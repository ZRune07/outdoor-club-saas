package com.ruoyi.outdoor.registration.domain;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.util.Date;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import com.ruoyi.common.annotation.Excel;
import com.ruoyi.common.core.domain.BaseEntity;
import com.ruoyi.common.xss.Xss;

/**
 * 报名对象 outdoor_registration
 * 
 * @author ruoyi
 */
public class Registration extends BaseEntity
{
    private static final long serialVersionUID = 1L;

    /** 报名ID */
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
    @Size(min = 0, max = 50, message = "身份证号长度不能超过50个字符")
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

    /** 报名人数 */
    @Excel(name = "报名人数")
    private Integer participantCount;

    /** 总费用 */
    @Excel(name = "总费用")
    private BigDecimal totalFee;

    /** 状态（0待支付 1已支付 2已取消 3已退款） */
    @Excel(name = "状态", readConverterExp = "0=待支付,1=已支付,2=已取消,3=已退款")
    private String status;

    /** 备注 */
    @Excel(name = "备注")
    private String remark;

    /** 删除标志（0存在 2删除） */
    private String delFlag;

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

    @Xss(message = "真实姓名不能包含脚本字符")
    public void setRealName(String realName) 
    {
        this.realName = realName;
    }

    public String getRealName() 
    {
        return realName;
    }

    @Xss(message = "手机号不能包含脚本字符")
    public void setPhone(String phone) 
    {
        this.phone = phone;
    }

    public String getPhone() 
    {
        return phone;
    }

    @Xss(message = "身份证号不能包含脚本字符")
    public void setIdCard(String idCard) 
    {
        this.idCard = idCard;
    }

    public String getIdCard() 
    {
        return idCard;
    }

    @Xss(message = "紧急联系人不能包含脚本字符")
    public void setEmergencyContact(String emergencyContact) 
    {
        this.emergencyContact = emergencyContact;
    }

    public String getEmergencyContact() 
    {
        return emergencyContact;
    }

    @Xss(message = "紧急联系电话不能包含脚本字符")
    public void setEmergencyPhone(String emergencyPhone) 
    {
        this.emergencyPhone = emergencyPhone;
    }

    public String getEmergencyPhone() 
    {
        return emergencyPhone;
    }

    public void setParticipantCount(Integer participantCount) 
    {
        this.participantCount = participantCount;
    }

    public Integer getParticipantCount() 
    {
        return participantCount;
    }

    public void setTotalFee(BigDecimal totalFee) 
    {
        this.totalFee = totalFee;
    }

    public BigDecimal getTotalFee() 
    {
        return totalFee;
    }

    public void setStatus(String status) 
    {
        this.status = status;
    }

    public String getStatus() 
    {
        return status;
    }

    public void setDelFlag(String delFlag) 
    {
        this.delFlag = delFlag;
    }

    public String getDelFlag() 
    {
        return delFlag;
    }

    @Override
    public String toString() {
        return new ToStringBuilder(this,ToStringStyle.MULTI_LINE_STYLE)
            .append("registrationId", getRegistrationId())
            .append("clubId", getClubId())
            .append("activityId", getActivityId())
            .append("wxUserId", getWxUserId())
            .append("realName", getRealName())
            .append("phone", getPhone())
            .append("idCard", getIdCard())
            .append("emergencyContact", getEmergencyContact())
            .append("emergencyPhone", getEmergencyPhone())
            .append("participantCount", getParticipantCount())
            .append("totalFee", getTotalFee())
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
