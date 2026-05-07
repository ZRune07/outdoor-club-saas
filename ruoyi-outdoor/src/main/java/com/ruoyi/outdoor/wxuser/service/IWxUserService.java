package com.ruoyi.outdoor.wxuser.service;

import java.util.List;
import com.ruoyi.outdoor.wxuser.domain.WxUser;

/**
 * 微信用户Service接口
 * 
 * @author ruoyi
 */
public interface IWxUserService 
{
    /**
     * 查询微信用户
     * 
     * @param wxUserId 微信用户ID
     * @return 微信用户
     */
    public WxUser selectWxUserByWxUserId(Long wxUserId);

    /**
     * 通过 openid 查询微信用户
     * 
     * @param openid 微信 openid
     * @return 微信用户
     */
    public WxUser selectWxUserByOpenid(String openid);

    /**
     * 根据俱乐部ID查询微信用户列表
     * 
     * @param clubId 俱乐部ID
     * @return 微信用户列表
     */
    public List<WxUser> selectWxUserByClubId(Long clubId);

    /**
     * 查询微信用户列表
     * 
     * @param wxUser 微信用户
     * @return 微信用户列表
     */
    public List<WxUser> selectWxUserList(WxUser wxUser);

    /**
     * 新增微信用户
     * 
     * @param wxUser 微信用户
     * @return 结果
     */
    public int insertWxUser(WxUser wxUser);

    /**
     * 修改微信用户
     * 
     * @param wxUser 微信用户
     * @return 结果
     */
    public int updateWxUser(WxUser wxUser);

    /**
     * 批量删除微信用户
     * 
     * @param wxUserIds 需要删除的微信用户ID集合
     * @return 结果
     */
    public int deleteWxUserByWxUserIds(Long[] wxUserIds);

    /**
     * 删除微信用户信息
     * 
     * @param wxUserId 微信用户ID
     * @return 结果
     */
    public int deleteWxUserByWxUserId(Long wxUserId);
}
