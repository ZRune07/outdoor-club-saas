package com.ruoyi.outdoor.membership.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import com.ruoyi.outdoor.membership.domain.UserMembership;

/**
 * 用户会员Mapper接口
 *
 * @author ruoyi
 */
@Mapper
public interface UserMembershipMapper
{
    /**
     * 查询用户在某租户下的会员记录
     *
     * @param wxUserId 微信用户ID
     * @param clubId 租户ID
     * @return 用户会员
     */
    public UserMembership selectByUserAndClub(@Param("wxUserId") Long wxUserId, @Param("clubId") Long clubId);

    /**
     * 新增用户会员
     *
     * @param userMembership 用户会员
     * @return 结果
     */
    public int insertUserMembership(UserMembership userMembership);

    /**
     * 修改用户会员
     *
     * @param userMembership 用户会员
     * @return 结果
     */
    public int updateUserMembership(UserMembership userMembership);
}
