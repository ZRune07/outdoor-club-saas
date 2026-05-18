package com.ruoyi.outdoor.membership.service;

import java.util.List;
import com.ruoyi.outdoor.membership.domain.MembershipConfig;
import com.ruoyi.outdoor.membership.domain.UserMembership;

/**
 * 会员体系 服务层
 *
 * @author ruoyi
 */
public interface IMembershipService
{
    /**
     * 查询某租户的会员等级配置列表
     */
    public List<MembershipConfig> getConfigByClubId(Long clubId);

    /**
     * 保存(新增或修改)会员等级配置
     */
    public int saveConfig(MembershipConfig config);

    /**
     * 当前用户激活会员，按 config.validityDays 计算 expireAt = now + days
     *
     * @param wxUserId 微信用户ID
     * @param clubId 租户ID
     * @param configId 会员等级配置ID
     * @return 激活后的会员记录
     */
    public UserMembership activate(Long wxUserId, Long clubId, Long configId);

    /**
     * 查询用户在某租户下的会员状态
     */
    public UserMembership getMyMembership(Long wxUserId, Long clubId);
}
