package com.ruoyi.outdoor.registration.mapper;

import java.util.List;
import java.util.Map;
import com.ruoyi.outdoor.registration.domain.Registration;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

/**
 * 报名Mapper接口
 * 
 * @author ruoyi
 */
@Mapper
public interface RegistrationMapper 
{
    /**
     * 查询报名列表
     * 
     * @param registration 报名
     * @return 报名集合
     */
    public List<Registration> selectRegistrationList(Registration registration);

    /**
     * 根据活动ID查询报名列表
     * 
     * @param activityId 活动ID
     * @return 报名列表
     */
    public List<Registration> selectRegistrationByActivityId(@Param("activityId") Long activityId);

    /**
     * 根据微信用户ID查询报名列表
     * 
     * @param wxUserId 微信用户ID
     * @return 报名列表
     */
    public List<Registration> selectRegistrationByWxUserId(@Param("wxUserId") Long wxUserId);

    /**
     * 根据报名ID查询报名
     * 
     * @param registrationId 报名ID
     * @return 报名
     */
    public Registration selectRegistrationByRegistrationId(@Param("registrationId") Long registrationId);

    /**
     * 根据活动ID和用户ID查询报名（检查是否已报名）
     * 
     * @param activityId 活动ID
     * @param wxUserId 微信用户ID
     * @return 报名
     */
    public Registration selectRegistrationByActivityAndUser(@Param("activityId") Long activityId, @Param("wxUserId") Long wxUserId);

    /**
     * 统计活动的报名人数
     * 
     * @param activityId 活动ID
     * @return 报名人数
     */
    public int countByActivityId(@Param("activityId") Long activityId);

    /**
     * 查询当前用户在指定租户下的报名列表
     *
     * @param wxUserId 微信用户ID
     * @param clubId 俱乐部ID（租户，可空）
     * @return 报名列表
     */
    public List<Registration> selectMyRegistrations(@Param("wxUserId") Long wxUserId, @Param("clubId") Long clubId);

    /**
     * 按活动统计报名数（排除 cancelled/rejected），限当前租户
     *
     * @param activityIds 活动ID数组
     * @param clubId 俱乐部ID（租户，可空）
     * @return 每个活动的报名数 [{activityId, count}]
     */
    public List<Map<String, Object>> selectRegistrationStats(@Param("activityIds") Long[] activityIds, @Param("clubId") Long clubId);

    /**
     * 新增报名
     * 
     * @param registration 报名
     * @return 结果
     */
    public int insertRegistration(Registration registration);

    /**
     * 修改报名
     * 
     * @param registration 报名
     * @return 结果
     */
    public int updateRegistration(Registration registration);

    /**
     * 更新报名状态
     * 
     * @param registrationId 报名ID
     * @param status 状态
     * @return 结果
     */
    public int updateRegistrationStatus(@Param("registrationId") Long registrationId, @Param("status") String status);

    /**
     * 删除报名
     * 
     * @param registrationId 报名ID
     * @return 结果
     */
    public int deleteRegistrationByRegistrationId(@Param("registrationId") Long registrationId);

    /**
     * 批量删除报名
     * 
     * @param registrationIds 需要删除的数据主键集合
     * @return 结果
     */
    public int deleteRegistrationByRegistrationIds(@Param("registrationIds") Long[] registrationIds);
}
