package com.ruoyi.outdoor.club.domain;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import com.ruoyi.common.core.domain.BaseEntity;
import com.ruoyi.common.xss.Xss;

public class Club extends BaseEntity
{
    private static final long serialVersionUID = 1L;

    private Long clubId;

    @NotBlank(message = "俱乐部名称不能为空")
    @Size(min = 0, max = 100, message = "俱乐部名称长度不能超过100个字符")
    private String clubName;

    @NotBlank(message = "俱乐部编码不能为空")
    @Size(min = 0, max = 50, message = "俱乐部编码长度不能超过50个字符")
    private String clubCode;

    private String logo;

    private String slogan;

    private String description;

    private String contactName;

    private String contactPhone;

    private String contactEmail;

    private String address;

    private String themeConfig;

    private String bannerConfig;

    private String featuresConfig;

    private String tabbarConfig;

    private String status;

    private String delFlag;

    public Long getClubId()
    {
        return clubId;
    }

    public void setClubId(Long clubId)
    {
        this.clubId = clubId;
    }

    public String getClubName()
    {
        return clubName;
    }

    public void setClubName(String clubName)
    {
        this.clubName = clubName;
    }

    public String getClubCode()
    {
        return clubCode;
    }

    public void setClubCode(String clubCode)
    {
        this.clubCode = clubCode;
    }

    public String getLogo()
    {
        return logo;
    }

    public void setLogo(String logo)
    {
        this.logo = logo;
    }

    public String getSlogan()
    {
        return slogan;
    }

    public void setSlogan(String slogan)
    {
        this.slogan = slogan;
    }

    public String getDescription()
    {
        return description;
    }

    public void setDescription(String description)
    {
        this.description = description;
    }

    public String getContactName()
    {
        return contactName;
    }

    public void setContactName(String contactName)
    {
        this.contactName = contactName;
    }

    public String getContactPhone()
    {
        return contactPhone;
    }

    public void setContactPhone(String contactPhone)
    {
        this.contactPhone = contactPhone;
    }

    public String getContactEmail()
    {
        return contactEmail;
    }

    public void setContactEmail(String contactEmail)
    {
        this.contactEmail = contactEmail;
    }

    public String getAddress()
    {
        return address;
    }

    public void setAddress(String address)
    {
        this.address = address;
    }

    public String getThemeConfig()
    {
        return themeConfig;
    }

    public void setThemeConfig(String themeConfig)
    {
        this.themeConfig = themeConfig;
    }

    public String getBannerConfig()
    {
        return bannerConfig;
    }

    public void setBannerConfig(String bannerConfig)
    {
        this.bannerConfig = bannerConfig;
    }

    public String getFeaturesConfig()
    {
        return featuresConfig;
    }

    public void setFeaturesConfig(String featuresConfig)
    {
        this.featuresConfig = featuresConfig;
    }

    public String getTabbarConfig()
    {
        return tabbarConfig;
    }

    public void setTabbarConfig(String tabbarConfig)
    {
        this.tabbarConfig = tabbarConfig;
    }

    public String getStatus()
    {
        return status;
    }

    public void setStatus(String status)
    {
        this.status = status;
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
        return new ToStringBuilder(this,ToStringStyle.MULTI_LINE_STYLE)
            .append("clubId", getClubId())
            .append("clubName", getClubName())
            .append("clubCode", getClubCode())
            .append("logo", getLogo())
            .append("slogan", getSlogan())
            .append("description", getDescription())
            .append("contactName", getContactName())
            .append("contactPhone", getContactPhone())
            .append("contactEmail", getContactEmail())
            .append("address", getAddress())
            .append("themeConfig", getThemeConfig())
            .append("bannerConfig", getBannerConfig())
            .append("featuresConfig", getFeaturesConfig())
            .append("tabbarConfig", getTabbarConfig())
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
