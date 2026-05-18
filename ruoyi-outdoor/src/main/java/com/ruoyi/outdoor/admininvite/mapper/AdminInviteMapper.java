package com.ruoyi.outdoor.admininvite.mapper;

import com.ruoyi.outdoor.admininvite.domain.AdminInvite;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

/**
 * 管理员邀请 Mapper 接口
 *
 * @author ruoyi
 */
@Mapper
public interface AdminInviteMapper
{
    /**
     * 根据令牌查询邀请
     *
     * @param token 邀请令牌
     * @return 管理员邀请
     */
    public AdminInvite selectByToken(@Param("token") String token);

    /**
     * 新增管理员邀请
     *
     * @param adminInvite 管理员邀请
     * @return 结果
     */
    public int insertAdminInvite(AdminInvite adminInvite);

    /**
     * 标记邀请为已使用
     *
     * @param id     邀请ID
     * @param usedBy 使用者（微信用户ID）
     * @return 结果
     */
    public int markUsed(@Param("id") Long id, @Param("usedBy") Long usedBy);
}
