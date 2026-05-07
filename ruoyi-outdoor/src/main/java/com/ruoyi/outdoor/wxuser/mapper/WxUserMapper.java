package com.ruoyi.outdoor.wxuser.mapper;

import java.util.List;
import com.ruoyi.outdoor.wxuser.domain.WxUser;

/**
 * 微信用户Mapper接口
 * 
 * @author ruoyi
 */
public interface WxUserMapper 
{
    /**
     * 查询微信用户
     * 
     * @param userId 微信用户主键
     * @return 微信用户
     */
    public WxUser selectWxUserByUserId(Long userId);

    /**
     * 通过 openid 查询微信用户
     * 
     * @param openid 微信 openid
     * @return 微信用户
     */
    public WxUser selectWxUserByOpenid(String openid);

    /**
     * 查询微信用户列表
     * 
     * @param wxUser 微信用户
     * @return 微信用户集合
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
     * 删除微信用户
     * 
     * @param userId 微信用户主键
     * @return 结果
     */
    public int deleteWxUserByUserId(Long userId);

    /**
     * 批量删除微信用户
     * 
     * @param userIds 需要删除的数据主键集合
     * @return 结果
     */
    public int deleteWxUserByUserIds(Long[] userIds);
}
