package com.ruoyi.outdoor.disclaimer.domain;

import com.ruoyi.common.annotation.Excel;
import com.ruoyi.common.core.domain.BaseEntity;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

import java.util.Date;

/**
 * 免责声明表
 */
public class Disclaimer extends BaseEntity {
    private static final long serialVersionUID = 1L;

    /** 免责声明ID */
    @Excel(name = "免责声明ID")
    private Long disclaimerId;

    /** 俱乐部ID */
    @Excel(name = "俱乐部ID")
    private Long clubId;

    /** 免责标题 */
    @Excel(name = "免责标题")
    private String disclaimerTitle;

    /** 免责类型 */
    @Excel(name = "免责类型")
    private String disclaimerType;

    /** 免责内容 */
    @Excel(name = "免责内容")
    private String content;

    /** 版本号 */
    @Excel(name = "版本号")
    private String version;

    /** 状态 */
    @Excel(name = "状态")
    private String status;

    /** 生效时间 */
    @Excel(name = "生效时间", width = 30, dateFormat = "yyyy-MM-dd HH:mm:ss")
    private Date effectiveTime;

    // 关联查询字段
    private String clubName;

    public Long getDisclaimerId() {
        return disclaimerId;
    }

    public void setDisclaimerId(Long disclaimerId) {
        this.disclaimerId = disclaimerId;
    }

    public Long getClubId() {
        return clubId;
    }

    public void setClubId(Long clubId) {
        this.clubId = clubId;
    }

    public String getDisclaimerTitle() {
        return disclaimerTitle;
    }

    public void setDisclaimerTitle(String disclaimerTitle) {
        this.disclaimerTitle = disclaimerTitle;
    }

    public String getDisclaimerType() {
        return disclaimerType;
    }

    public void setDisclaimerType(String disclaimerType) {
        this.disclaimerType = disclaimerType;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Date getEffectiveTime() {
        return effectiveTime;
    }

    public void setEffectiveTime(Date effectiveTime) {
        this.effectiveTime = effectiveTime;
    }

    public String getClubName() {
        return clubName;
    }

    public void setClubName(String clubName) {
        this.clubName = clubName;
    }

    @Override
    public String toString() {
        return new ToStringBuilder(this, ToStringStyle.MULTI_LINE_STYLE)
            .append("disclaimerId", getDisclaimerId())
            .append("clubId", getClubId())
            .append("disclaimerTitle", getDisclaimerTitle())
            .append("disclaimerType", getDisclaimerType())
            .append("content", getContent())
            .append("version", getVersion())
            .append("status", getStatus())
            .append("effectiveTime", getEffectiveTime())
            .append("createTime", getCreateTime())
            .toString();
    }
}
