package com.ruoyi.outdoor.membership.mapper;

import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import com.ruoyi.outdoor.membership.domain.MembershipConfig;

/**
 * 会员等级配置Mapper接口
 *
 * @author ruoyi
 */
@Mapper
public interface MembershipConfigMapper
{
    /**
     * 查询某租户的会员等级配置列表
     *
     * @param clubId 租户ID
     * @return 会员等级配置集合
     */
    public List<MembershipConfig> selectConfigByClubId(@Param("clubId") Long clubId);

    /**
     * 查询会员等级配置
     *
     * @param id 主键
     * @return 会员等级配置
     */
    public MembershipConfig selectConfigById(@Param("id") Long id);

    /**
     * 新增会员等级配置
     *
     * @param config 会员等级配置
     * @return 结果
     */
    public int insertConfig(MembershipConfig config);

    /**
     * 修改会员等级配置
     *
     * @param config 会员等级配置
     * @return 结果
     */
    public int updateConfig(MembershipConfig config);
}
