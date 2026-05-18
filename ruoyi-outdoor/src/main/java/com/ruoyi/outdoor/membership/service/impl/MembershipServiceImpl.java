package com.ruoyi.outdoor.membership.service.impl;

import java.util.Date;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.ruoyi.common.utils.DateUtils;
import com.ruoyi.outdoor.membership.domain.MembershipConfig;
import com.ruoyi.outdoor.membership.domain.UserMembership;
import com.ruoyi.outdoor.membership.mapper.MembershipConfigMapper;
import com.ruoyi.outdoor.membership.mapper.UserMembershipMapper;
import com.ruoyi.outdoor.membership.service.IMembershipService;

/**
 * 会员体系 服务层实现
 *
 * @author ruoyi
 */
@Service
public class MembershipServiceImpl implements IMembershipService
{
    @Autowired
    private MembershipConfigMapper membershipConfigMapper;

    @Autowired
    private UserMembershipMapper userMembershipMapper;

    @Override
    public List<MembershipConfig> getConfigByClubId(Long clubId)
    {
        return membershipConfigMapper.selectConfigByClubId(clubId);
    }

    @Override
    public int saveConfig(MembershipConfig config)
    {
        if (config.getId() != null)
        {
            return membershipConfigMapper.updateConfig(config);
        }
        return membershipConfigMapper.insertConfig(config);
    }

    @Override
    public UserMembership activate(Long wxUserId, Long clubId, Long configId)
    {
        MembershipConfig config = membershipConfigMapper.selectConfigById(configId);
        if (config == null || !clubId.equals(config.getClubId()))
        {
            return null;
        }

        Date now = DateUtils.getNowDate();
        int days = config.getValidityDays() == null ? 0 : config.getValidityDays();
        Date expireAt = DateUtils.addDays(now, days);

        UserMembership existing = userMembershipMapper.selectByUserAndClub(wxUserId, clubId);
        if (existing != null)
        {
            existing.setConfigId(configId);
            existing.setActivatedAt(now);
            existing.setExpireAt(expireAt);
            existing.setStatus("0");
            userMembershipMapper.updateUserMembership(existing);
            return existing;
        }

        UserMembership membership = new UserMembership();
        membership.setWxUserId(wxUserId);
        membership.setClubId(clubId);
        membership.setConfigId(configId);
        membership.setActivatedAt(now);
        membership.setExpireAt(expireAt);
        membership.setStatus("0");
        membership.setDelFlag("0");
        userMembershipMapper.insertUserMembership(membership);
        return membership;
    }

    @Override
    public UserMembership getMyMembership(Long wxUserId, Long clubId)
    {
        UserMembership membership = userMembershipMapper.selectByUserAndClub(wxUserId, clubId);
        if (membership != null && membership.getExpireAt() != null
                && membership.getExpireAt().before(DateUtils.getNowDate())
                && "0".equals(membership.getStatus()))
        {
            membership.setStatus("1");
            userMembershipMapper.updateUserMembership(membership);
        }
        return membership;
    }
}
