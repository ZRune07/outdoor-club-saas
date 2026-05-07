package com.ruoyi.outdoor.disclaimer.domain;

import com.ruoyi.common.annotation.Excel;
import com.ruoyi.common.core.domain.BaseEntity;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

import java.util.Date;

/**
 * 免责签署记录表
 */
public class SignRecord extends BaseEntity {
    private static final long serialVersionUID = 1L;

    /** 签署ID */
    @Excel(name = "签署ID")
    private Long signId;

    /** 俱乐部ID */
    @Excel(name = "俱乐部ID")
    private Long clubId;

    /** 免责声明ID */
    @Excel(name = "免责声明ID")
    private Long disclaimerId;

    /** 报名ID */
    @Excel(name = "报名ID")
    private Long registrationId;

    /** 微信用户ID */
    @Excel(name = "微信用户ID")
    private Long wxUserId;

    /** 签署人姓名 */
    @Excel(name = "签署人姓名")
    private String signName;

    /** 签署时间 */
    @Excel(name = "签署时间", width = 30, dateFormat = "yyyy-MM-dd HH:mm:ss")
    private Date signTime;

    /** 签署IP地址 */
    @Excel(name = "签署IP地址")
    private String signIp;

    /** 签署设备 */
    @Excel(name = "签署设备")
    private String signDevice;

    /** 签署状态 */
    @Excel(name = "签署状态")
    private String signStatus;

    // 关联查询字段
    private String disclaimerTitle;
    private String activityTitle;
    private String phone;

    public Long getSignId() {
        return signId;
    }

    public void setSignId(Long signId) {
        this.signId = signId;
    }

    public Long getClubId() {
        return clubId;
    }

    public void setClubId(Long clubId) {
        this.clubId = clubId;
    }

    public Long getDisclaimerId() {
        return disclaimerId;
    }

    public void setDisclaimerId(Long disclaimerId) {
        this.disclaimerId = disclaimerId;
    }

    public Long getRegistrationId() {
        return registrationId;
    }

    public void setRegistrationId(Long registrationId) {
        this.registrationId = registrationId;
    }

    public Long getWxUserId() {
        return wxUserId;
    }

    public void setWxUserId(Long wxUserId) {
        this.wxUserId = wxUserId;
    }

    public String getSignName() {
        return signName;
    }

    public void setSignName(String signName) {
        this.signName = signName;
    }

    public Date getSignTime() {
        return signTime;
    }

    public void setSignTime(Date signTime) {
        this.signTime = signTime;
    }

    public String getSignIp() {
        return signIp;
    }

    public void setSignIp(String signIp) {
        this.signIp = signIp;
    }

    public String getSignDevice() {
        return signDevice;
    }

    public void setSignDevice(String signDevice) {
        this.signDevice = signDevice;
    }

    public String getSignStatus() {
        return signStatus;
    }

    public void setSignStatus(String signStatus) {
        this.signStatus = signStatus;
    }

    public String getDisclaimerTitle() {
        return disclaimerTitle;
    }

    public void setDisclaimerTitle(String disclaimerTitle) {
        this.disclaimerTitle = disclaimerTitle;
    }

    public String getActivityTitle() {
        return activityTitle;
    }

    public void setActivityTitle(String activityTitle) {
        this.activityTitle = activityTitle;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    @Override
    public String toString() {
        return new ToStringBuilder(this, ToStringStyle.MULTI_LINE_STYLE)
            .append("signId", getSignId())
            .append("clubId", getClubId())
            .append("disclaimerId", getDisclaimerId())
            .append("registrationId", getRegistrationId())
            .append("wxUserId", getWxUserId())
            .append("signName", getSignName())
            .append("signTime", getSignTime())
            .append("signIp", getSignIp())
            .append("signStatus", getSignStatus())
            .toString();
    }
}
