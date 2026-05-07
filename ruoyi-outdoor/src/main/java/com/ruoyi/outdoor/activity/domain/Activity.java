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

/**
 * 活动对象 act_activity
 * 
 * @author ruoyi
 */
public class Activity extends BaseEntity
{
    private static final long serialVersionUID = 1L;

    /** 活动ID */
    @Excel(name = "活动ID")
    private Long activityId;

    /** 俱乐部ID */
    @NotNull(message = "俱乐部ID不能为空")
    @Excel(name = "俱乐部ID")
    private Long clubId;

    /** 活动标题 */
    @NotBlank(message = "活动标题不能为空")
    @Size(min = 0, max = 200, message = "活动标题长度不能超过200个字符")
    @Excel(name = "活动标题")
    private String activityTitle;

    /** 活动类型 */
    @Excel(name = "活动类型")
    private String activityType;

    /** 封面图 */
    @Excel(name = "封面图")
    private String coverImage;

    /** 活动图片列表 */
    @Excel(name = "活动图片")
    private String images;

    /** 活动描述 */
    @Excel(name = "活动描述")
    private String description;

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
    private Date registrationDeadline;

    /** 集合地点 */
    @Excel(name = "集合地点")
    private String location;

    /** 最大人数 */
    @Excel(name = "最大人数")
    private Integer maxParticipants;

    /** 当前人数 */
    @Excel(name = "当前人数")
    private Integer currentParticipants;

    /** 活动费用 */
    @Excel(name = "活动费用")
    private BigDecimal price;

    /** 保险费用 */
    @Excel(name = "保险费用")
    private BigDecimal insurancePrice;

    /** 状态（draft草稿 recruiting招募中 full已满员 ongoing进行中 ended已结束） */
    @Excel(name = "状态", readConverterExp = "draft=草稿,recruiting=招募中,full=已满员,ongoing=进行中,ended=已结束")
    private String status;

    /** 领队ID */
    @Excel(name = "领队ID")
    private Long leaderId;

    /** 活动详情 */
    @Excel(name = "活动详情")
    private String content;

    /** 注意事项 */
    @Excel(name = "注意事项")
    private String notices;

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

    public void setActivityTitle(String activityTitle) 
    {
        this.activityTitle = activityTitle;
    }

    public String getActivityTitle() 
    {
        return activityTitle;
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

    public void setImages(String images) 
    {
        this.images = images;
    }

    public String getImages() 
    {
        return images;
    }

    public void setDescription(String description) 
    {
        this.description = description;
    }

    public String getDescription() 
    {
        return description;
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

    public void setRegistrationDeadline(Date registrationDeadline) 
    {
        this.registrationDeadline = registrationDeadline;
    }

    public Date getRegistrationDeadline() 
    {
        return registrationDeadline;
    }

    public void setLocation(String location) 
    {
        this.location = location;
    }

    public String getLocation() 
    {
        return location;
    }

    public void setMaxParticipants(Integer maxParticipants) 
    {
        this.maxParticipants = maxParticipants;
    }

    public Integer getMaxParticipants() 
    {
        return maxParticipants;
    }

    public void setCurrentParticipants(Integer currentParticipants) 
    {
        this.currentParticipants = currentParticipants;
    }

    public Integer getCurrentParticipants() 
    {
        return currentParticipants;
    }

    public void setPrice(BigDecimal price) 
    {
        this.price = price;
    }

    public BigDecimal getPrice() 
    {
        return price;
    }

    public void setInsurancePrice(BigDecimal insurancePrice) 
    {
        this.insurancePrice = insurancePrice;
    }

    public BigDecimal getInsurancePrice() 
    {
        return insurancePrice;
    }

    public void setStatus(String status) 
    {
        this.status = status;
    }

    public String getStatus() 
    {
        return status;
    }

    public void setLeaderId(Long leaderId) 
    {
        this.leaderId = leaderId;
    }

    public Long getLeaderId() 
    {
        return leaderId;
    }

    public void setContent(String content) 
    {
        this.content = content;
    }

    public String getContent() 
    {
        return content;
    }

    public void setNotices(String notices) 
    {
        this.notices = notices;
    }

    public String getNotices() 
    {
        return notices;
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
        return new ToStringBuilder(this, ToStringStyle.MULTI_LINE_STYLE)
            .append("activityId", getActivityId())
            .append("clubId", getClubId())
            .append("activityTitle", getActivityTitle())
            .append("activityType", getActivityType())
            .append("coverImage", getCoverImage())
            .append("images", getImages())
            .append("description", getDescription())
            .append("startTime", getStartTime())
            .append("endTime", getEndTime())
            .append("registrationDeadline", getRegistrationDeadline())
            .append("location", getLocation())
            .append("maxParticipants", getMaxParticipants())
            .append("currentParticipants", getCurrentParticipants())
            .append("price", getPrice())
            .append("insurancePrice", getInsurancePrice())
            .append("status", getStatus())
            .append("leaderId", getLeaderId())
            .append("content", getContent())
            .append("notices", getNotices())
            .append("delFlag", getDelFlag())
            .append("createBy", getCreateBy())
            .append("createTime", getCreateTime())
            .append("updateBy", getUpdateBy())
            .append("updateTime", getUpdateTime())
            .append("remark", getRemark())
            .toString();
    }
}
