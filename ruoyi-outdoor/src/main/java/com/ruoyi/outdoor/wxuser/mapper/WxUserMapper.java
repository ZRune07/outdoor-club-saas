package com.ruoyi.outdoor.wxuser.mapper;

import java.util.List;
import com.ruoyi.outdoor.wxuser.domain.WxUser;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

/**
 * 微信用户Mapper接口
 * 
 * @author ruoyi
 */
@Mapper
public interface WxUserMapper 
{
    /**
     * 查询微信用户列表
     * 
     * @param wxUser 微信用户
     * @return 微信用户集合
     */
    public List<WxUser> selectWxUserList(WxUser wxUser);

    /**
     * 根据微信用户ID查询微信用户
     * 
     * @param wxUserId 微信用户ID
     * @return 微信用户
     */
    public WxUser selectWxUserByWxUserId(@Param("wxUserId") Long wxUserId);

    /**
     * 通过 openid 查询微信用户
     * 
     * @param openid 微信 openid
     * @return 微信用户
     */
    public WxUser selectWxUserByOpenid(@Param("openid") String openid);

    /**
     * 根据俱乐部ID查询微信用户列表
     * 
     * @param clubId 俱乐部ID
     * @return 微信用户列表
     */
    public List<WxUser> selectWxUserByClubId(@Param("clubId") Long clubId);

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
     * @param wxUserId 微信用户ID
     * @return 结果
     */
    public int deleteWxUserByWxUserId(@Param("wxUserId") Long wxUserId);

    /**
     * 批量删除微信用户
     * 
     * @param wxUserIds 需要删除的数据主键集合
     * @return 结果
     */
    public int deleteWxUserByWxUserIds(@Param("wxUserIds") Long[] wxUserIds);
}
