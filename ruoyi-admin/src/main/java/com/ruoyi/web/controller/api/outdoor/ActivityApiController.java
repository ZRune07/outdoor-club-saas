package com.ruoyi.web.controller.api.outdoor;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
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
     * 查询活动列表（H5/小程序）
     */
    @GetMapping("/list")
    public TableDataInfo list(Activity activity)
    {
        startPage();
        List<Activity> list = activityService.selectActivityList(activity);
        return getDataTable(list);
    }

    /**
     * 获取活动详细信息（H5/小程序）
     */
    @GetMapping(value = "/{activityId}")
    public AjaxResult getInfo(@PathVariable("activityId") Long activityId)
    {
        return success(activityService.selectActivityByActivityId(activityId));
    }
}
