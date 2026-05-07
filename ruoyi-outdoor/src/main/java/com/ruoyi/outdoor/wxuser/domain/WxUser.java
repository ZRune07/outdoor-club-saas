package com.ruoyi.outdoor.wxuser.domain;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import com.ruoyi.common.annotation.Excel;
import com.ruoyi.common.core.domain.BaseEntity;

/**
 * 微信用户对象 outdoor_wx_user
 * 
 * @author ruoyi
 */
public class WxUser extends BaseEntity
{
    private static final long serialVersionUID = 1L;

    /** 用户ID */
    private Long userId;

    /** 俱乐部ID */
    @Excel(name = "俱乐部ID")
    private Long clubId;

    /** 微信 openid */
    @NotBlank(message = "微信 openid 不能为空")
    @Size(min = 0, max = 100, message = "微信 openid 长度不能超过100个字符")
    @Excel(name = "微信 openid")
    private String openid;

    /** 微信 unionid */
    @Size(min = 0, max = 100, message = "微信 unionid 长度不能超过100个字符")
    @Excel(name = "微信 unionid")
    private String unionid;

    /** 昵称 */
    @Size(min = 0, max = 100, message = "昵称长度不能超过100个字符")
    @Excel(name = "昵称")
    private String nickname;

    /** 头像 */
    @Size(min = 0, max = 255, message = "头像长度不能超过255个字符")
    @Excel(name = "头像")
    private String avatar;

    /** 性别：0-未知，1-男，2-女 */
    @Excel(name = "性别")
    private String gender;

    /** 手机号 */
    @Size(min = 0, max = 20, message = "手机号长度不能超过20个字符")
    @Excel(name = "手机号")
    private String phone;

    /** 状态：0-正常，1-禁用 */
    @Excel(name = "状态")
    private String status;

    /** 删除标志（0存在 2删除） */
    private String delFlag;

    public void setUserId(Long userId) 
    {
        this.userId = userId;
    }

    public Long getUserId() 
    {
        return userId;
    }

    public void setClubId(Long clubId) 
    {
        this.clubId = clubId;
    }

    public Long getClubId() 
    {
        return clubId;
    }

    public void setOpenid(String openid) 
    {
        this.openid = openid;
    }

    public String getOpenid() 
    {
        return openid;
    }

    public void setUnionid(String unionid) 
    {
        this.unionid = unionid;
    }

    public String getUnionid() 
    {
        return unionid;
    }

    public void setNickname(String nickname) 
    {
        this.nickname = nickname;
    }

    public String getNickname() 
    {
        return nickname;
    }

    public void setAvatar(String avatar) 
    {
        this.avatar = avatar;
    }

    public String getAvatar() 
    {
        return avatar;
    }

    public void setGender(String gender) 
    {
        this.gender = gender;
    }

    public String getGender() 
    {
        return gender;
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
            .append("userId", getUserId())
            .append("clubId", getClubId())
            .append("openid", getOpenid())
            .append("unionid", getUnionid())
            .append("nickname", getNickname())
            .append("avatar", getAvatar())
            .append("gender", getGender())
            .append("phone", getPhone())
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
