package com.ruoyi.outdoor.registration.service;

import java.util.List;
import com.ruoyi.outdoor.registration.domain.Registration;

/**
 * 报名Service接口
 * 
 * @author ruoyi
 */
public interface IRegistrationService 
{
    /**
     * 查询报名
     * 
     * @param registrationId 报名ID
     * @return 报名
     */
    public Registration selectRegistrationByRegistrationId(Long registrationId);

    /**
     * 查询报名列表
     * 
     * @param registration 报名
     * @return 报名列表
     */
    public List<Registration> selectRegistrationList(Registration registration);

    /**
     * 根据活动ID查询报名列表
     * 
     * @param activityId 活动ID
     * @return 报名列表
     */
    public List<Registration> selectRegistrationByActivityId(Long activityId);

    /**
     * 根据微信用户ID查询报名列表
     * 
     * @param wxUserId 微信用户ID
     * @return 报名列表
     */
    public List<Registration> selectRegistrationByWxUserId(Long wxUserId);

    /**
     * 检查用户是否已报名该活动
     * 
     * @param activityId 活动ID
     * @param wxUserId 微信用户ID
     * @return 报名记录
     */
    public Registration selectRegistrationByActivityAndUser(Long activityId, Long wxUserId);

    /**
     * 统计活动的报名人数
     * 
     * @param activityId 活动ID
     * @return 报名人数
     */
    public int countByActivityId(Long activityId);

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
    public int updateRegistrationStatus(Long registrationId, String status);

    /**
     * 批量删除报名
     * 
     * @param registrationIds 需要删除的报名ID集合
     * @return 结果
     */
    public int deleteRegistrationByRegistrationIds(Long[] registrationIds);

    /**
     * 删除报名信息
     * 
     * @param registrationId 报名ID
     * @return 结果
     */
    public int deleteRegistrationByRegistrationId(Long registrationId);
}
