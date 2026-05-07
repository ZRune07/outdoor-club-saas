package com.ruoyi.outdoor.wxuser.domain;

import jakarta.validation.constraints.Size;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import com.ruoyi.common.annotation.Excel;
import com.ruoyi.common.core.domain.BaseEntity;

/**
 * 微信用户对象 wx_user
 * 
 * @author ruoyi
 */
public class WxUser extends BaseEntity
{
    private static final long serialVersionUID = 1L;

    /** 微信用户ID */
    @Excel(name = "微信用户ID")
    private Long wxUserId;

    /** 俱乐部ID */
    @Excel(name = "俱乐部ID")
    private Long clubId;

    /** 微信 openid */
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
    private Integer gender;

    /** 真实姓名 */
    @Size(min = 0, max = 50, message = "真实姓名长度不能超过50个字符")
    @Excel(name = "真实姓名")
    private String realName;

    /** 手机号 */
    @Size(min = 0, max = 20, message = "手机号长度不能超过20个字符")
    @Excel(name = "手机号")
    private String phone;

    /** 身份证号 */
    @Size(min = 0, max = 100, message = "身份证号长度不能超过100个字符")
    @Excel(name = "身份证号")
    private String idCard;

    /** 状态：0-正常，1-禁用 */
    @Excel(name = "状态")
    private String status;

    /** 删除标志（0存在 2删除） */
    private String delFlag;

    public void setWxUserId(Long wxUserId) 
    {
        this.wxUserId = wxUserId;
    }

    public Long getWxUserId() 
    {
        return wxUserId;
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

    public void setGender(Integer gender) 
    {
        this.gender = gender;
    }

    public Integer getGender() 
    {
        return gender;
    }

    public void setRealName(String realName) 
    {
        this.realName = realName;
    }

    public String getRealName() 
    {
        return realName;
    }

    public void setPhone(String phone) 
    {
        this.phone = phone;
    }

    public String getPhone() 
    {
        return phone;
    }

    public void setIdCard(String idCard) 
    {
        this.idCard = idCard;
    }

    public String getIdCard() 
    {
        return idCard;
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
        return new ToStringBuilder(this, ToStringStyle.MULTI_LINE_STYLE)
            .append("wxUserId", getWxUserId())
            .append("clubId", getClubId())
            .append("openid", getOpenid())
            .append("unionid", getUnionid())
            .append("nickname", getNickname())
            .append("avatar", getAvatar())
            .append("gender", getGender())
            .append("realName", getRealName())
            .append("phone", getPhone())
            .append("idCard", getIdCard())
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
