package com.ruoyi.outdoor.activity.domain;

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
 * 活动对象 outdoor_activity
 * 
 * @author ruoyi
 */
public class Activity extends BaseEntity
{
    private static final long serialVersionUID = 1L;

    /** 活动ID */
    private Long activityId;

    /** 俱乐部ID */
    @NotNull(message = "俱乐部ID不能为空")
    @Excel(name = "俱乐部ID")
    private Long clubId;

    /** 活动名称 */
    @NotBlank(message = "活动名称不能为空")
    @Size(min = 0, max = 200, message = "活动名称长度不能超过200个字符")
    @Excel(name = "活动名称")
    private String activityName;

    /** 活动类型 */
    @Excel(name = "活动类型")
    private String activityType;

    /** 活动封面 */
    @Excel(name = "活动封面")
    private String coverImage;

    /** 活动简介 */
    @Excel(name = "活动简介")
    private String summary;

    /** 活动详情 */
    @Excel(name = "活动详情")
    private String content;

    /** 开始时间 */
    @NotNull(message = "开始时间不能为空")
    @Excel(name = "开始时间", width = 30, dateFormat = "yyyy-MM-dd HH:mm:ss")
    private Date startTime;

    /** 结束时间 */
    @NotNull(message = "结束时间不能为空")
    @Excel(name = "结束时间", width = 30, dateFormat = "yyyy-MM-dd HH:mm:ss")
    private Date endTime;

    /** 报名截止时间 */
    @Excel(name = "报名截止时间", width = 30, dateFormat = "yyyy-MM-dd HH:mm:ss")
    private Date deadline;

    /** 活动地点 */
    @Excel(name = "活动地点")
    private String location;

    /** 经度 */
    @Excel(name = "经度")
    private BigDecimal longitude;

    /** 纬度 */
    @Excel(name = "纬度")
    private BigDecimal latitude;

    /** 最大人数 */
    @Excel(name = "最大人数")
    private Integer maxParticipants;

    /** 已报名人数 */
    @Excel(name = "已报名人数")
    private Integer participantCount;

    /** 费用 */
    @Excel(name = "费用")
    private BigDecimal fee;

    /** 费用说明 */
    @Excel(name = "费用说明")
    private String feeNote;

    /** 联系人 */
    @Excel(name = "联系人")
    private String contactName;

    /** 联系电话 */
    @Excel(name = "联系电话")
    private String contactPhone;

    /** 活动状态（0未开始 1进行中 2已结束 3已取消） */
    @Excel(name = "活动状态", readConverterExp = "0=未开始,1=进行中,2=已结束,3=已取消")
    private String status;

    /** 是否置顶（0否 1是） */
    @Excel(name = "是否置顶", readConverterExp = "0=否,1=是")
    private String isTop;

    /** 删除标志（0存在 2删除） */
    private String delFlag;

    public void setActivityId(Long activityId) 
    {
        this.activityId = activityId;
    }

    public Long getActivityId() 
    {
        return activityId;
    }

    public void setClubId(Long clubId) 
    {
        this.clubId = clubId;
    }

    public Long getClubId() 
    {
        return clubId;
    }

    @Xss(message = "活动名称不能包含脚本字符")
    public void setActivityName(String activityName) 
    {
        this.activityName = activityName;
    }

    public String getActivityName() 
    {
        return activityName;
    }

    public void setActivityType(String activityType) 
    {
        this.activityType = activityType;
    }

    public String getActivityType() 
    {
        return activityType;
    }

    public void setCoverImage(String coverImage) 
    {
        this.coverImage = coverImage;
    }

    public String getCoverImage() 
    {
        return coverImage;
    }

    public void setSummary(String summary) 
    {
        this.summary = summary;
    }

    public String getSummary() 
    {
        return summary;
    }

    public void setContent(String content) 
    {
        this.content = content;
    }

    public String getContent() 
    {
        return content;
    }

    public void setStartTime(Date startTime) 
    {
        this.startTime = startTime;
    }

    public Date getStartTime() 
    {
        return startTime;
    }

    public void setEndTime(Date endTime) 
    {
        this.endTime = endTime;
    }

    public Date getEndTime() 
    {
        return endTime;
    }

    public void setDeadline(Date deadline) 
    {
        this.deadline = deadline;
    }

    public Date getDeadline() 
    {
        return deadline;
    }

    @Xss(message = "活动地点不能包含脚本字符")
    public void setLocation(String location) 
    {
        this.location = location;
    }

    public String getLocation() 
    {
        return location;
    }

    public void setLongitude(BigDecimal longitude) 
    {
        this.longitude = longitude;
    }

    public BigDecimal getLongitude() 
    {
        return longitude;
    }

    public void setLatitude(BigDecimal latitude) 
    {
        this.latitude = latitude;
    }

    public BigDecimal getLatitude() 
    {
        return latitude;
    }

    public void setMaxParticipants(Integer maxParticipants) 
    {
        this.maxParticipants = maxParticipants;
    }

    public Integer getMaxParticipants() 
    {
        return maxParticipants;
    }

    public void setParticipantCount(Integer participantCount) 
    {
        this.participantCount = participantCount;
    }

    public Integer getParticipantCount() 
    {
        return participantCount;
    }

    public void setFee(BigDecimal fee) 
    {
        this.fee = fee;
    }

    public BigDecimal getFee() 
    {
        return fee;
    }

    public void setFeeNote(String feeNote) 
    {
        this.feeNote = feeNote;
    }

    public String getFeeNote() 
    {
        return feeNote;
    }

    public void setContactName(String contactName) 
    {
        this.contactName = contactName;
    }

    public String getContactName() 
    {
        return contactName;
    }

    public void setContactPhone(String contactPhone) 
    {
        this.contactPhone = contactPhone;
    }

    public String getContactPhone() 
    {
        return contactPhone;
    }

    public void setStatus(String status) 
    {
        this.status = status;
    }

    public String getStatus() 
    {
        return status;
    }

    public void setIsTop(String isTop) 
    {
        this.isTop = isTop;
    }

    public String getIsTop() 
    {
        return isTop;
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
            .append("activityId", getActivityId())
            .append("clubId", getClubId())
            .append("activityName", getActivityName())
            .append("activityType", getActivityType())
            .append("coverImage", getCoverImage())
            .append("summary", getSummary())
            .append("content", getContent())
            .append("startTime", getStartTime())
            .append("endTime", getEndTime())
            .append("deadline", getDeadline())
            .append("location", getLocation())
            .append("longitude", getLongitude())
            .append("latitude", getLatitude())
            .append("maxParticipants", getMaxParticipants())
            .append("participantCount", getParticipantCount())
            .append("fee", getFee())
            .append("feeNote", getFeeNote())
            .append("contactName", getContactName())
            .append("contactPhone", getContactPhone())
            .append("status", getStatus())
            .append("isTop", getIsTop())
            .append("delFlag", getDelFlag())
            .append("createBy", getCreateBy())
            .append("createTime", getCreateTime())
            .append("updateBy", getUpdateBy())
            .append("updateTime", getUpdateTime())
            .append("remark", getRemark())
            .toString();
    }
}
