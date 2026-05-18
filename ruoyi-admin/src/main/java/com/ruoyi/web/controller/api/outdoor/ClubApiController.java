package com.ruoyi.web.controller.api.outdoor;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.ruoyi.common.core.controller.BaseController;
import com.ruoyi.common.core.domain.AjaxResult;
import com.ruoyi.outdoor.club.domain.Club;
import com.ruoyi.outdoor.club.service.IClubService;

/**
 * 俱乐部 API
 * 
 * @author ruoyi
 */
@RestController
@RequestMapping("/api/club")
public class ClubApiController extends BaseController
{
    @Autowired
    private IClubService clubService;

    /**
     * 获取俱乐部列表（H5/小程序）
     */
    @GetMapping("/list")
    public AjaxResult list(Club club)
    {
        List<Club> list = clubService.selectClubList(club);
        return success(list);
    }

    /**
     * 获取俱乐部详情（H5/小程序）
     */
    @GetMapping("/{clubId}")
    public AjaxResult getInfo(@PathVariable Long clubId)
    {
        return success(clubService.selectClubById(clubId));
    }

    /**
     * 获取指定租户的配置（复用俱乐部信息，即租户主体）
     */
    @GetMapping("/tenant/{tenantId}/config")
    public AjaxResult getTenantConfig(@PathVariable Long tenantId)
    {
        return success(clubService.selectClubById(tenantId));
    }
}
