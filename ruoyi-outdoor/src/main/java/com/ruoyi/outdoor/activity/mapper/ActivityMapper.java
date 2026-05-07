package com.ruoyi.outdoor.activity.mapper;

import java.util.List;
import java.util.Map;
import com.ruoyi.outdoor.activity.domain.Activity;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

/**
 * 活动Mapper接口
 * 
 * @author ruoyi
 */
@Mapper
public interface ActivityMapper 
{
    /**
     * 查询活动列表
     * 
     * @param activity 活动
     * @return 活动集合
     */
    public List<Activity> selectActivityList(Activity activity);

    /**
     * 查询所有招募中的活动
     * 
     * @return 招募中的活动列表
     */
    public List<Activity> selectRecruitingActivities();

    /**
     * 根据俱乐部ID查询活动列表
     * 
     * @param clubId 俱乐部ID
     * @return 活动列表
     */
    public List<Activity> selectActivityByClubId(@Param("clubId") Long clubId);

    /**
     * 查询活动
     * 
     * @param activityId 活动ID
     * @return 活动
     */
    public Activity selectActivityByActivityId(@Param("activityId") Long activityId);

    /**
     * 新增活动
     * 
     * @param activity 活动
     * @return 结果
     */
    public int insertActivity(Activity activity);

    /**
     * 修改活动
     * 
     * @param activity 活动
     * @return 结果
     */
    public int updateActivity(Activity activity);

    /**
     * 更新活动人数
     * 
     * @param map 包含activityId和increment(增减人数)
     * @return 结果
     */
    public int updateActivityParticipants(Map<String, Object> map);

    /**
     * 删除活动
     * 
     * @param activityId 活动ID
     * @return 结果
     */
    public int deleteActivityByActivityId(@Param("activityId") Long activityId);

    /**
     * 批量删除活动
     * 
     * @param activityIds 需要删除的活动ID
     * @return 结果
     */
    public int deleteActivityByActivityIds(@Param("activityIds") Long[] activityIds);
}
