package com.ruoyi.outdoor.membership.domain;

import java.math.BigDecimal;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import com.ruoyi.common.core.domain.BaseEntity;

/**
 * 会员等级配置对象 outdoor_membership_config
 *
 * @author ruoyi
 */
public class MembershipConfig extends BaseEntity
{
    private static final long serialVersionUID = 1L;

    /** 主键ID */
    private Long id;

    /** 租户(俱乐部)ID */
    private Long clubId;

    /** 会员等级名称 */
    private String levelName;

    /** 有效天数 */
    private Integer validityDays;

    /** 价格 */
    private BigDecimal price;

    /** 会员权益 */
    private String benefits;

    /** 描述 */
    private String description;

    /** 是否启用(1启用 0停用) */
    private String enabled;

    /** 删除标志 */
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

    public String getLevelName()
    {
        return levelName;
    }

    public void setLevelName(String levelName)
    {
        this.levelName = levelName;
    }

    public Integer getValidityDays()
    {
        return validityDays;
    }

    public void setValidityDays(Integer validityDays)
    {
        this.validityDays = validityDays;
    }

    public BigDecimal getPrice()
    {
        return price;
    }

    public void setPrice(BigDecimal price)
    {
        this.price = price;
    }

    public String getBenefits()
    {
        return benefits;
    }

    public void setBenefits(String benefits)
    {
        this.benefits = benefits;
    }

    public String getDescription()
    {
        return description;
    }

    public void setDescription(String description)
    {
        this.description = description;
    }

    public String getEnabled()
    {
        return enabled;
    }

    public void setEnabled(String enabled)
    {
        this.enabled = enabled;
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
        return new ToStringBuilder(this, ToStringStyle.MULTI_LINE_STYLE)
            .append("id", getId())
            .append("clubId", getClubId())
            .append("levelName", getLevelName())
            .append("validityDays", getValidityDays())
            .append("price", getPrice())
            .append("benefits", getBenefits())
            .append("description", getDescription())
            .append("enabled", getEnabled())
            .append("delFlag", getDelFlag())
            .append("createBy", getCreateBy())
            .append("createTime", getCreateTime())
            .append("updateBy", getUpdateBy())
            .append("updateTime", getUpdateTime())
            .append("remark", getRemark())
            .toString();
    }
}
