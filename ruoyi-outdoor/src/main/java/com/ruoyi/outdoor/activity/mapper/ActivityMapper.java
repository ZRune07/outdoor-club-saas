package com.ruoyi.outdoor.activity.mapper;

import java.util.List;
import com.ruoyi.outdoor.activity.domain.Activity;

/**
 * 活动Mapper接口
 * 
 * @author ruoyi
 */
public interface ActivityMapper 
{
    /**
     * 查询活动
     * 
     * @param activityId 活动主键
     * @return 活动
     */
    public Activity selectActivityByActivityId(Long activityId);

    /**
     * 查询活动列表
     * 
     * @param activity 活动
     * @return 活动集合
     */
    public List<Activity> selectActivityList(Activity activity);

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
     * 删除活动
     * 
     * @param activityId 活动主键
     * @return 结果
     */
    public int deleteActivityByActivityId(Long activityId);

    /**
     * 批量删除活动
     * 
     * @param activityIds 需要删除的数据主键集合
     * @return 结果
     */
    public int deleteActivityByActivityIds(Long[] activityIds);
}
