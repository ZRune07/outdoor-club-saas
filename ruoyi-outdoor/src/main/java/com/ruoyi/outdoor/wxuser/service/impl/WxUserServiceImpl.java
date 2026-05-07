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
     * @param userId 微信用户主键
     * @return 微信用户
     */
    @Override
    public WxUser selectWxUserByUserId(Long userId)
    {
        return wxUserMapper.selectWxUserByUserId(userId);
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
     * 查询微信用户列表
     * 
     * @param wxUser 微信用户
     * @return 微信用户
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
     * @param userIds 需要删除的微信用户主键
     * @return 结果
     */
    @Override
    public int deleteWxUserByUserIds(Long[] userIds)
    {
        return wxUserMapper.deleteWxUserByUserIds(userIds);
    }

    /**
     * 删除微信用户信息
     * 
     * @param userId 微信用户主键
     * @return 结果
     */
    @Override
    public int deleteWxUserByUserId(Long userId)
    {
        return wxUserMapper.deleteWxUserByUserId(userId);
    }
}
