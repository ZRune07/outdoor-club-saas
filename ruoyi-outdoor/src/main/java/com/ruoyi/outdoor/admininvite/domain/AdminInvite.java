package com.ruoyi.outdoor.admininvite.domain;

import java.util.Date;
import com.ruoyi.common.core.domain.BaseEntity;

/**
 * 管理员邀请
 *
 * @author ruoyi
 */
public class AdminInvite extends BaseEntity
{
    private static final long serialVersionUID = 1L;

    /** 主键ID */
    private Long id;

    /** 俱乐部ID（租户ID） */
    private Long clubId;

    /** 邀请令牌 */
    private String token;

    /** 过期时间 */
    private Date expireTime;

    /** 是否已使用（0未使用 1已使用） */
    private String used;

    /** 使用者（微信用户ID） */
    private Long usedBy;

    /** 删除标志（0代表存在 2代表删除） */
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

    public String getToken()
    {
        return token;
    }

    public void setToken(String token)
    {
        this.token = token;
    }

    public Date getExpireTime()
    {
        return expireTime;
    }

    public void setExpireTime(Date expireTime)
    {
        this.expireTime = expireTime;
    }

    public String getUsed()
    {
        return used;
    }

    public void setUsed(String used)
    {
        this.used = used;
    }

    public Long getUsedBy()
    {
        return usedBy;
    }

    public void setUsedBy(Long usedBy)
    {
        this.usedBy = usedBy;
    }

    public String getDelFlag()
    {
        return delFlag;
    }

    public void setDelFlag(String delFlag)
    {
        this.delFlag = delFlag;
    }
}
