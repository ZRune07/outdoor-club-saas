package com.ruoyi.outdoor.activity.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.ruoyi.outdoor.activity.mapper.ActivityMapper;
import com.ruoyi.outdoor.activity.domain.Activity;
import com.ruoyi.outdoor.activity.service.IActivityService;

/**
 * 活动Service业务层处理
 * 
 * @author ruoyi
 */
@Service
public class ActivityServiceImpl implements IActivityService 
{
    @Autowired
    private ActivityMapper activityMapper;

    /**
     * 查询活动
     * 
     * @param activityId 活动ID
     * @return 活动
     */
    @Override
    public Activity selectActivityByActivityId(Long activityId)
    {
        return activityMapper.selectActivityByActivityId(activityId);
    }

    /**
     * 查询招募中的活动列表
     * 
     * @return 招募中的活动列表
     */
    @Override
    public List<Activity> selectRecruitingActivities()
    {
        return activityMapper.selectRecruitingActivities();
    }

    /**
     * 根据俱乐部ID查询活动列表
     * 
     * @param clubId 俱乐部ID
     * @return 活动列表
     */
    @Override
    public List<Activity> selectActivityByClubId(Long clubId)
    {
        return activityMapper.selectActivityByClubId(clubId);
    }

    /**
     * 查询活动列表
     * 
     * @param activity 活动
     * @return 活动列表
     */
    @Override
    public List<Activity> selectActivityList(Activity activity)
    {
        return activityMapper.selectActivityList(activity);
    }

    /**
     * 新增活动
     * 
     * @param activity 活动
     * @return 结果
     */
    @Override
    public int insertActivity(Activity activity)
    {
        return activityMapper.insertActivity(activity);
    }

    /**
     * 修改活动
     * 
     * @param activity 活动
     * @return 结果
     */
    @Override
    public int updateActivity(Activity activity)
    {
        return activityMapper.updateActivity(activity);
    }

    /**
     * 更新活动人数
     * 
     * @param activityId 活动ID
     * @param increment 增减人数（正数增加，负数减少）
     * @return 结果
     */
    @Override
    @Transactional
    public int updateActivityParticipants(Long activityId, int increment)
    {
        Map<String, Object> params = new HashMap<>();
        params.put("activityId", activityId);
        params.put("increment", increment);
        return activityMapper.updateActivityParticipants(params);
    }

    /**
     * 批量删除活动
     * 
     * @param activityIds 需要删除的活动ID
     * @return 结果
     */
    @Override
    public int deleteActivityByActivityIds(Long[] activityIds)
    {
        return activityMapper.deleteActivityByActivityIds(activityIds);
    }

    /**
     * 删除活动信息
     * 
     * @param activityId 活动ID
     * @return 结果
     */
    @Override
    public int deleteActivityByActivityId(Long activityId)
    {
        return activityMapper.deleteActivityByActivityId(activityId);
    }
}
