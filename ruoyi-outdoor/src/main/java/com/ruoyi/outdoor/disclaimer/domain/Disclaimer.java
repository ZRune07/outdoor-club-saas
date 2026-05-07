package com.ruoyi.outdoor.disclaimer.domain;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import com.ruoyi.common.annotation.Excel;
import com.ruoyi.common.core.domain.BaseEntity;

/**
 * 免责签署对象 outdoor_disclaimer
 * 
 * @author ruoyi
 */
public class Disclaimer extends BaseEntity
{
    private static final long serialVersionUID = 1L;

    /** 签署ID */
    private Long disclaimerId;

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

    /** 签署人姓名 */
    @NotBlank(message = "签署人姓名不能为空")
    @Size(min = 0, max = 50, message = "签署人姓名长度不能超过50个字符")
    @Excel(name = "签署人姓名")
    private String signerName;

    /** 身份证号 */
    @Size(min = 0, max = 50, message = "身份证号长度不能超过50个字符")
    @Excel(name = "身份证号")
    private String idCard;

    /** 联系电话 */
    @Size(min = 0, max = 20, message = "联系电话长度不能超过20个字符")
    @Excel(name = "联系电话")
    private String phone;

    /** 签署状态：0-未签署，1-已签署 */
    @Excel(name = "签署状态")
    private String status;

    /** 签署时间 */
    @Excel(name = "签署时间", width = 30, dateFormat = "yyyy-MM-dd HH:mm:ss")
    private java.util.Date signTime;

    /** 删除标志（0存在 2删除） */
    private String delFlag;

    public void setDisclaimerId(Long disclaimerId) 
    {
        this.disclaimerId = disclaimerId;
    }

    public Long getDisclaimerId() 
    {
        return disclaimerId;
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

    public void setSignerName(String signerName) 
    {
        this.signerName = signerName;
    }

    public String getSignerName() 
    {
        return signerName;
    }

    public void setIdCard(String idCard) 
    {
        this.idCard = idCard;
    }

    public String getIdCard() 
    {
        return idCard;
    }

    public void setPhone(String phone) 
    {
        this.phone = phone;
    }

    public String getPhone() 
    {
        return phone;
    }

    public void setStatus(String status) 
    {
        this.status = status;
    }

    public String getStatus() 
    {
        return status;
    }

    public void setSignTime(java.util.Date signTime) 
    {
        this.signTime = signTime;
    }

    public java.util.Date getSignTime() 
    {
        return signTime;
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
            .append("disclaimerId", getDisclaimerId())
            .append("clubId", getClubId())
            .append("activityId", getActivityId())
            .append("wxUserId", getWxUserId())
            .append("signerName", getSignerName())
            .append("idCard", getIdCard())
            .append("phone", getPhone())
            .append("status", getStatus())
            .append("signTime", getSignTime())
            .append("delFlag", getDelFlag())
            .append("createBy", getCreateBy())
            .append("createTime", getCreateTime())
            .append("updateBy", getUpdateBy())
            .append("updateTime", getUpdateTime())
            .append("remark", getRemark())
            .toString();
    }
}
