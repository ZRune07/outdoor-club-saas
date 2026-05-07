package com.ruoyi.outdoor.wxuser.service.impl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.ruoyi.outdoor.wxuser.mapper.WxUserMapper;
import com.ruoyi.outdoor.wxuser.domain.WxUser;
import com.ruoyi.outdoor.wxuser.service.IWxUserService;

/**
 * 微信用户Service业务层处理
 * 
 * @author ruoyi
 */
@Service
public class WxUserServiceImpl implements IWxUserService 
{
    @Autowired
    private WxUserMapper wxUserMapper;

    /**
     * 查询微信用户
     * 
     * @param wxUserId 微信用户ID
     * @return 微信用户
     */
    @Override
    public WxUser selectWxUserByWxUserId(Long wxUserId)
    {
        return wxUserMapper.selectWxUserByWxUserId(wxUserId);
    }

    /**
     * 通过 openid 查询微信用户
     * 
     * @param openid 微信 openid
     * @return 微信用户
     */
    @Override
    public WxUser selectWxUserByOpenid(String openid)
    {
        return wxUserMapper.selectWxUserByOpenid(openid);
    }

    /**
     * 根据俱乐部ID查询微信用户列表
     * 
     * @param clubId 俱乐部ID
     * @return 微信用户列表
     */
    @Override
    public List<WxUser> selectWxUserByClubId(Long clubId)
    {
        return wxUserMapper.selectWxUserByClubId(clubId);
    }

    /**
     * 查询微信用户列表
     * 
     * @param wxUser 微信用户
     * @return 微信用户列表
     */
    @Override
    public List<WxUser> selectWxUserList(WxUser wxUser)
    {
        return wxUserMapper.selectWxUserList(wxUser);
    }

    /**
     * 新增微信用户
     * 
     * @param wxUser 微信用户
     * @return 结果
     */
    @Override
    public int insertWxUser(WxUser wxUser)
    {
        return wxUserMapper.insertWxUser(wxUser);
    }

    /**
     * 修改微信用户
     * 
     * @param wxUser 微信用户
     * @return 结果
     */
    @Override
    public int updateWxUser(WxUser wxUser)
    {
        return wxUserMapper.updateWxUser(wxUser);
    }

    /**
     * 批量删除微信用户
     * 
     * @param wxUserIds 需要删除的微信用户ID
     * @return 结果
     */
    @Override
    public int deleteWxUserByWxUserIds(Long[] wxUserIds)
    {
        return wxUserMapper.deleteWxUserByWxUserIds(wxUserIds);
    }

    /**
     * 删除微信用户信息
     * 
     * @param wxUserId 微信用户ID
     * @return 结果
     */
    @Override
    public int deleteWxUserByWxUserId(Long wxUserId)
    {
        return wxUserMapper.deleteWxUserByWxUserId(wxUserId);
    }
}
