package com.ruoyi.outdoor.adminquery.domain;

import java.util.Date;
import com.ruoyi.common.annotation.Excel;

/**
 * 报名只读视图（本单元自有，直接查 reg_registration，只读，不依赖 registration 包）
 *
 * @author ruoyi
 */
public class EnrollmentView
{
    @Excel(name = "报名ID")
    private Long registrationId;

    @Excel(name = "俱乐部ID")
    private Long clubId;

    @Excel(name = "活动ID")
    private Long activityId;

    @Excel(name = "微信用户ID")
    private Long wxUserId;

    @Excel(name = "真实姓名")
    private String realName;

    @Excel(name = "手机号")
    private String phone;

    @Excel(name = "身份证号")
    private String idCard;

    @Excel(name = "紧急联系人")
    private String emergencyContact;

    @Excel(name = "紧急联系电话")
    private String emergencyPhone;

    @Excel(name = "状态")
    private String status;

    @Excel(name = "活动标题")
    private String activityTitle;

    @Excel(name = "报名时间", dateFormat = "yyyy-MM-dd HH:mm:ss")
    private Date createTime;

    public Long getRegistrationId()
    {
        return registrationId;
    }

    public void setRegistrationId(Long registrationId)
    {
        this.registrationId = registrationId;
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

    public Long getWxUserId()
    {
        return wxUserId;
    }

    public void setWxUserId(Long wxUserId)
    {
        this.wxUserId = wxUserId;
    }

    public String getRealName()
    {
        return realName;
    }

    public void setRealName(String realName)
    {
        this.realName = realName;
    }

    public String getPhone()
    {
        return phone;
    }

    public void setPhone(String phone)
    {
        this.phone = phone;
    }

    public String getIdCard()
    {
        return idCard;
    }

    public void setIdCard(String idCard)
    {
        this.idCard = idCard;
    }

    public String getEmergencyContact()
    {
        return emergencyContact;
    }

    public void setEmergencyContact(String emergencyContact)
    {
        this.emergencyContact = emergencyContact;
    }

    public String getEmergencyPhone()
    {
        return emergencyPhone;
    }

    public void setEmergencyPhone(String emergencyPhone)
    {
        this.emergencyPhone = emergencyPhone;
    }

    public String getStatus()
    {
        return status;
    }

    public void setStatus(String status)
    {
        this.status = status;
    }

    public String getActivityTitle()
    {
        return activityTitle;
    }

    public void setActivityTitle(String activityTitle)
    {
        this.activityTitle = activityTitle;
    }

    public Date getCreateTime()
    {
        return createTime;
    }

    public void setCreateTime(Date createTime)
    {
        this.createTime = createTime;
    }
}
