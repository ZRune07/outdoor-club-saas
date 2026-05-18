package com.ruoyi.outdoor.agreement.domain;

import com.ruoyi.common.annotation.Excel;
import com.ruoyi.common.core.domain.BaseEntity;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

import java.util.Date;

/**
 * 电子签协议表
 */
public class Agreement extends BaseEntity {
    private static final long serialVersionUID = 1L;

    /** 协议ID */
    @Excel(name = "协议ID")
    private Long id;

    /** 俱乐部ID（租户） */
    @Excel(name = "俱乐部ID")
    private Long clubId;

    /** 报名ID（可空） */
    @Excel(name = "报名ID")
    private Long enrollmentId;

    /** 活动ID */
    @Excel(name = "活动ID")
    private Long activityId;

    /** 协议正文 */
    private String content;

    /** 签名图（base64） */
    private String signature;

    /** 签署人姓名 */
    @Excel(name = "签署人姓名")
    private String signerName;

    /** 签署人手机号 */
    @Excel(name = "签署人手机号")
    private String signerPhone;

    /** 签署时间 */
    @Excel(name = "签署时间", width = 30, dateFormat = "yyyy-MM-dd HH:mm:ss")
    private Date signedAt;

    /** 状态（0草稿 1已签） */
    @Excel(name = "状态", readConverterExp = "0=草稿,1=已签")
    private String status;

    /** 删除标志（0代表存在 2代表删除） */
    private String delFlag;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getClubId() {
        return clubId;
    }

    public void setClubId(Long clubId) {
        this.clubId = clubId;
    }

    public Long getEnrollmentId() {
        return enrollmentId;
    }

    public void setEnrollmentId(Long enrollmentId) {
        this.enrollmentId = enrollmentId;
    }

    public Long getActivityId() {
        return activityId;
    }

    public void setActivityId(Long activityId) {
        this.activityId = activityId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getSignature() {
        return signature;
    }

    public void setSignature(String signature) {
        this.signature = signature;
    }

    public String getSignerName() {
        return signerName;
    }

    public void setSignerName(String signerName) {
        this.signerName = signerName;
    }

    public String getSignerPhone() {
        return signerPhone;
    }

    public void setSignerPhone(String signerPhone) {
        this.signerPhone = signerPhone;
    }

    public Date getSignedAt() {
        return signedAt;
    }

    public void setSignedAt(Date signedAt) {
        this.signedAt = signedAt;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getDelFlag() {
        return delFlag;
    }

    public void setDelFlag(String delFlag) {
        this.delFlag = delFlag;
    }

    @Override
    public String toString() {
        return new ToStringBuilder(this, ToStringStyle.MULTI_LINE_STYLE)
            .append("id", getId())
            .append("clubId", getClubId())
            .append("enrollmentId", getEnrollmentId())
            .append("activityId", getActivityId())
            .append("signerName", getSignerName())
            .append("signerPhone", getSignerPhone())
            .append("signedAt", getSignedAt())
            .append("status", getStatus())
            .append("delFlag", getDelFlag())
            .append("createBy", getCreateBy())
            .append("createTime", getCreateTime())
            .toString();
    }
}
