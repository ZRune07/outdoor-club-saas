package com.ruoyi.outdoor.admininvite.service;

import com.ruoyi.outdoor.admininvite.domain.AdminInvite;

/**
 * 管理员邀请 服务接口
 *
 * @author ruoyi
 */
public interface IAdminInviteService
{
    /**
     * 生成一个邀请并写入库，返回带 token 的实体
     *
     * @param clubId    俱乐部ID（租户ID）
     * @param createBy  创建者
     * @return 管理员邀请
     */
    AdminInvite createInvite(Long clubId, String createBy);

    /**
     * 校验令牌有效（存在、未使用、未过期、未删除）
     *
     * @param token 邀请令牌
     * @return 有效的邀请；无效返回 null
     */
    AdminInvite validateToken(String token);

    /**
     * 标记邀请为已使用
     *
     * @param id     邀请ID
     * @param usedBy 使用者（微信用户ID）
     * @return 结果
     */
    int markUsed(Long id, Long usedBy);
}
