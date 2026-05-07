package com.ruoyi.web.controller.api.outdoor;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.ruoyi.common.core.controller.BaseController;
import com.ruoyi.common.core.domain.AjaxResult;
import com.ruoyi.common.core.page.TableDataInfo;
import com.ruoyi.outdoor.activity.domain.Activity;
import com.ruoyi.outdoor.activity.service.IActivityService;

/**
 * 活动 API
 * 
 * @author ruoyi
 */
@RestController
@RequestMapping("/api/activity")
public class ActivityApiController extends BaseController
{
    @Autowired
    private IActivityService activityService;

    /**
     * 查询招募中的活动列表（首页展示）
     */
    @GetMapping("/recruiting")
    public AjaxResult getRecruitingActivities()
    {
        List<Activity> list = activityService.selectRecruitingActivities();
        return success(list);
    }

    /**
     * 根据俱乐部查询活动列表
     */
    @GetMapping("/club/{clubId}")
    public AjaxResult getActivitiesByClub(@PathVariable("clubId") Long clubId)
    {
        List<Activity> list = activityService.selectActivityByClubId(clubId);
        return success(list);
    }

    /**
     * 查询活动列表（分页）
     */
    @GetMapping("/list")
    public TableDataInfo list(Activity activity)
    {
        startPage();
        List<Activity> list = activityService.selectActivityList(activity);
        return getDataTable(list);
    }

    /**
     * 获取活动详细信息
     */
    @GetMapping("/{activityId}")
    public AjaxResult getInfo(@PathVariable("activityId") Long activityId)
    {
        Activity activity = activityService.selectActivityByActivityId(activityId);
        if (activity == null)
        {
            return error("活动不存在");
        }
        return success(activity);
    }
}
