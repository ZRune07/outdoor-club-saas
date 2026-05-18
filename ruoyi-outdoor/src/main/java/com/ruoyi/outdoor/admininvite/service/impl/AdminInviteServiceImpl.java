package com.ruoyi.outdoor.admininvite.service.impl;

import java.util.Date;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.ruoyi.outdoor.admininvite.domain.AdminInvite;
import com.ruoyi.outdoor.admininvite.mapper.AdminInviteMapper;
import com.ruoyi.outdoor.admininvite.service.IAdminInviteService;

/**
 * 管理员邀请 服务实现
 *
 * @author ruoyi
 */
@Service
public class AdminInviteServiceImpl implements IAdminInviteService
{
    /** 邀请默认有效期：7 天 */
    private static final long EXPIRE_MILLIS = 7L * 24 * 60 * 60 * 1000;

    @Autowired
    private AdminInviteMapper adminInviteMapper;

    @Override
    public AdminInvite createInvite(Long clubId, String createBy)
    {
        AdminInvite invite = new AdminInvite();
        invite.setClubId(clubId);
        invite.setToken(UUID.randomUUID().toString().replace("-", ""));
        invite.setExpireTime(new Date(System.currentTimeMillis() + EXPIRE_MILLIS));
        invite.setUsed("0");
        invite.setCreateBy(createBy);
        adminInviteMapper.insertAdminInvite(invite);
        return invite;
    }

    @Override
    public AdminInvite validateToken(String token)
    {
        if (token == null || token.isEmpty())
        {
            return null;
        }
        AdminInvite invite = adminInviteMapper.selectByToken(token);
        if (invite == null)
        {
            return null;
        }
        if (!"0".equals(invite.getUsed()))
        {
            return null;
        }
        if (invite.getExpireTime() != null && invite.getExpireTime().before(new Date()))
        {
            return null;
        }
        return invite;
    }

    @Override
    public int markUsed(Long id, Long usedBy)
    {
        return adminInviteMapper.markUsed(id, usedBy);
    }
}
