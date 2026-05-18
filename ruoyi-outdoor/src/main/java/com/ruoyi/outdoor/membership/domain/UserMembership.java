package com.ruoyi.outdoor.membership.domain;

import java.util.Date;
import com.fasterxml.jackson.annotation.JsonFormat;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import com.ruoyi.common.core.domain.BaseEntity;

/**
 * 用户会员对象 outdoor_user_membership
 *
 * @author ruoyi
 */
public class UserMembership extends BaseEntity
{
    private static final long serialVersionUID = 1L;

    /** 主键ID */
    private Long id;

    /** 微信用户ID */
    private Long wxUserId;

    /** 租户(俱乐部)ID */
    private Long clubId;

    /** 会员等级配置ID */
    private Long configId;

    /** 激活时间 */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date activatedAt;

    /** 过期时间 */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date expireAt;

    /** 状态(0有效 1过期) */
    private String status;

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

    public Long getWxUserId()
    {
        return wxUserId;
    }

    public void setWxUserId(Long wxUserId)
    {
        this.wxUserId = wxUserId;
    }

    public Long getClubId()
    {
        return clubId;
    }

    public void setClubId(Long clubId)
    {
        this.clubId = clubId;
    }

    public Long getConfigId()
    {
        return configId;
    }

    public void setConfigId(Long configId)
    {
        this.configId = configId;
    }

    public Date getActivatedAt()
    {
        return activatedAt;
    }

    public void setActivatedAt(Date activatedAt)
    {
        this.activatedAt = activatedAt;
    }

    public Date getExpireAt()
    {
        return expireAt;
    }

    public void setExpireAt(Date expireAt)
    {
        this.expireAt = expireAt;
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
        return new ToStringBuilder(this, ToStringStyle.MULTI_LINE_STYLE)
            .append("id", getId())
            .append("wxUserId", getWxUserId())
            .append("clubId", getClubId())
            .append("configId", getConfigId())
            .append("activatedAt", getActivatedAt())
            .append("expireAt", getExpireAt())
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
