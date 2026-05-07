package com.ruoyi.web.controller.admin.outdoor;

import java.util.List;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.ruoyi.common.annotation.Log;
import com.ruoyi.common.core.controller.BaseController;
import com.ruoyi.common.core.domain.AjaxResult;
import com.ruoyi.common.core.page.TableDataInfo;
import com.ruoyi.common.enums.BusinessType;
import com.ruoyi.common.utils.poi.ExcelUtil;
import com.ruoyi.outdoor.club.domain.Club;
import com.ruoyi.outdoor.club.service.IClubService;

/**
 * 俱乐部管理 信息操作处理
 * 
 * @author ruoyi
 */
@RestController
@RequestMapping("/admin/club")
public class ClubController extends BaseController
{
    @Autowired
    private IClubService clubService;

    /**
     * 获取俱乐部列表
     */
    @PreAuthorize("@ss.hasPermi('outdoor:club:list')")
    @GetMapping("/list")
    public TableDataInfo list(Club club)
    {
        startPage();
        List<Club> list = clubService.selectClubList(club);
        return getDataTable(list);
    }

    @Log(title = "俱乐部管理", businessType = BusinessType.EXPORT)
    @PreAuthorize("@ss.hasPermi('outdoor:club:export')")
    @PostMapping("/export")
    public void export(HttpServletResponse response, Club club)
    {
        List<Club> list = clubService.selectClubList(club);
        ExcelUtil<Club> util = new ExcelUtil<Club>(Club.class);
        util.exportExcel(response, list, "俱乐部数据");
    }

    /**
     * 根据俱乐部编号获取详细信息
     */
    @PreAuthorize("@ss.hasPermi('outdoor:club:query')")
    @GetMapping(value = "/{clubId}")
    public AjaxResult getInfo(@PathVariable Long clubId)
    {
        return success(clubService.selectClubById(clubId));
    }

    /**
     * 新增俱乐部
     */
    @PreAuthorize("@ss.hasPermi('outdoor:club:add')")
    @Log(title = "俱乐部管理", businessType = BusinessType.INSERT)
    @PostMapping
    public AjaxResult add(@Validated @RequestBody Club club)
    {
        club.setCreateBy(getUsername());
        return toAjax(clubService.insertClub(club));
    }

    /**
     * 修改俱乐部
     */
    @PreAuthorize("@ss.hasPermi('outdoor:club:edit')")
    @Log(title = "俱乐部管理", businessType = BusinessType.UPDATE)
    @PutMapping
    public AjaxResult edit(@Validated @RequestBody Club club)
    {
        club.setUpdateBy(getUsername());
        return toAjax(clubService.updateClub(club));
    }

    /**
     * 删除俱乐部
     */
    @PreAuthorize("@ss.hasPermi('outdoor:club:remove')")
    @Log(title = "俱乐部管理", businessType = BusinessType.DELETE)
    @DeleteMapping("/{clubIds}")
    public AjaxResult remove(@PathVariable Long[] clubIds)
    {
        return toAjax(clubService.deleteClubByIds(clubIds));
    }
}
