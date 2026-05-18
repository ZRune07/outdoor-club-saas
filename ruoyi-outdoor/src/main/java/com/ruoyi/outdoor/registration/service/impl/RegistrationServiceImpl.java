package com.ruoyi.outdoor.registration.service.impl;

import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.ruoyi.outdoor.registration.mapper.RegistrationMapper;
import com.ruoyi.outdoor.registration.domain.Registration;
import com.ruoyi.outdoor.registration.service.IRegistrationService;

/**
 * 报名Service业务层处理
 * 
 * @author ruoyi
 */
@Service
public class RegistrationServiceImpl implements IRegistrationService 
{
    @Autowired
    private RegistrationMapper registrationMapper;

    /**
     * 查询报名
     * 
     * @param registrationId 报名ID
     * @return 报名
     */
    @Override
    public Registration selectRegistrationByRegistrationId(Long registrationId)
    {
        return registrationMapper.selectRegistrationByRegistrationId(registrationId);
    }

    /**
     * 查询报名列表
     * 
     * @param registration 报名
     * @return 报名列表
     */
    @Override
    public List<Registration> selectRegistrationList(Registration registration)
    {
        return registrationMapper.selectRegistrationList(registration);
    }

    /**
     * 根据活动ID查询报名列表
     * 
     * @param activityId 活动ID
     * @return 报名列表
     */
    @Override
    public List<Registration> selectRegistrationByActivityId(Long activityId)
    {
        return registrationMapper.selectRegistrationByActivityId(activityId);
    }

    /**
     * 根据微信用户ID查询报名列表
     * 
     * @param wxUserId 微信用户ID
     * @return 报名列表
     */
    @Override
    public List<Registration> selectRegistrationByWxUserId(Long wxUserId)
    {
        return registrationMapper.selectRegistrationByWxUserId(wxUserId);
    }

    /**
     * 检查用户是否已报名该活动
     * 
     * @param activityId 活动ID
     * @param wxUserId 微信用户ID
     * @return 报名记录（null表示未报名）
     */
    @Override
    public Registration selectRegistrationByActivityAndUser(Long activityId, Long wxUserId)
    {
        return registrationMapper.selectRegistrationByActivityAndUser(activityId, wxUserId);
    }

    /**
     * 统计活动的报名人数
     * 
     * @param activityId 活动ID
     * @return 报名人数
     */
    @Override
    public int countByActivityId(Long activityId)
    {
        return registrationMapper.countByActivityId(activityId);
    }

    /**
     * 查询当前用户在指定租户下的报名列表
     */
    @Override
    public List<Registration> selectMyRegistrations(Long wxUserId, Long clubId)
    {
        return registrationMapper.selectMyRegistrations(wxUserId, clubId);
    }

    /**
     * 按活动统计报名数（排除 cancelled/rejected），限当前租户
     */
    @Override
    public List<Map<String, Object>> selectRegistrationStats(Long[] activityIds, Long clubId)
    {
        return registrationMapper.selectRegistrationStats(activityIds, clubId);
    }

    /**
     * 新增报名
     *
     * @param registration 报名
     * @return 结果
     */
    @Override
    @Transactional
    public int insertRegistration(Registration registration)
    {
        return registrationMapper.insertRegistration(registration);
    }

    /**
     * 修改报名
     * 
     * @param registration 报名
     * @return 结果
     */
    @Override
    public int updateRegistration(Registration registration)
    {
        return registrationMapper.updateRegistration(registration);
    }

    /**
     * 更新报名状态
     * 
     * @param registrationId 报名ID
     * @param status 状态
     * @return 结果
     */
    @Override
    public int updateRegistrationStatus(Long registrationId, String status)
    {
        return registrationMapper.updateRegistrationStatus(registrationId, status);
    }

    /**
     * 批量删除报名
     * 
     * @param registrationIds 需要删除的报名ID
     * @return 结果
     */
    @Override
    public int deleteRegistrationByRegistrationIds(Long[] registrationIds)
    {
        return registrationMapper.deleteRegistrationByRegistrationIds(registrationIds);
    }

    /**
     * 删除报名信息
     * 
     * @param registrationId 报名ID
     * @return 结果
     */
    @Override
    public int deleteRegistrationByRegistrationId(Long registrationId)
    {
        return registrationMapper.deleteRegistrationByRegistrationId(registrationId);
    }
}
