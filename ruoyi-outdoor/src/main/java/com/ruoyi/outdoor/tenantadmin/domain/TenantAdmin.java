package com.ruoyi.outdoor.tenantadmin.domain;

import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import com.ruoyi.common.core.domain.BaseEntity;

/**
 * 租户管理员对象 outdoor_tenant_admin
 *
 * @author ruoyi
 */
public class TenantAdmin extends BaseEntity
{
    private static final long serialVersionUID = 1L;

    /** 主键ID */
    private Long id;

    /** 微信用户ID */
    private Long wxUserId;

    /** 租户(俱乐部)ID */
    private Long clubId;

    /** 角色：super_admin 超管，tenant_admin 租户管理员 */
    private String role;

    /** 状态（0正常 1停用） */
    private String status;

    /** 删除标志（0存在 2删除） */
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

    public String getRole()
    {
        return role;
    }

    public void setRole(String role)
    {
        this.role = role;
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
            .append("role", getRole())
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
