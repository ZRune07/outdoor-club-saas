package com.ruoyi.web.controller.admin.outdoor;

import java.util.List;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.ruoyi.common.annotation.Log;
import com.ruoyi.common.core.controller.BaseController;
import com.ruoyi.common.core.domain.AjaxResult;
import com.ruoyi.common.enums.BusinessType;
import com.ruoyi.outdoor.disclaimer.domain.Disclaimer;
import com.ruoyi.outdoor.disclaimer.service.IDisclaimerService;
import com.ruoyi.common.utils.poi.ExcelUtil;
import com.ruoyi.common.core.page.TableDataInfo;

/**
 * 免责签署管理Controller
 * 
 * @author ruoyi
 */
@RestController
@RequestMapping("/admin/disclaimer")
public class DisclaimerController extends BaseController
{
    @Autowired
    private IDisclaimerService disclaimerService;

    /**
     * 查询免责签署列表
     */
    @PreAuthorize("@ss.hasPermi('outdoor:disclaimer:list')")
    @GetMapping("/list")
    public TableDataInfo list(Disclaimer disclaimer)
    {
        startPage();
        List<Disclaimer> list = disclaimerService.selectDisclaimerList(disclaimer);
        return getDataTable(list);
    }

    /**
     * 导出免责签署列表
     */
    @PreAuthorize("@ss.hasPermi('outdoor:disclaimer:export')")
    @Log(title = "免责签署", businessType = BusinessType.EXPORT)
    @PostMapping("/export")
    public void export(HttpServletResponse response, Disclaimer disclaimer)
    {
        List<Disclaimer> list = disclaimerService.selectDisclaimerList(disclaimer);
        ExcelUtil<Disclaimer> util = new ExcelUtil<Disclaimer>(Disclaimer.class);
        util.exportExcel(response, list, "免责签署数据");
    }

    /**
     * 获取免责签署详细信息
     */
    @PreAuthorize("@ss.hasPermi('outdoor:disclaimer:query')")
    @GetMapping(value = "/{disclaimerId}")
    public AjaxResult getInfo(@PathVariable("disclaimerId") Long disclaimerId)
    {
        return success(disclaimerService.selectDisclaimerByDisclaimerId(disclaimerId));
    }

    /**
     * 新增免责签署
     */
    @PreAuthorize("@ss.hasPermi('outdoor:disclaimer:add')")
    @Log(title = "免责签署", businessType = BusinessType.INSERT)
    @PostMapping
    public AjaxResult add(@Validated @RequestBody Disclaimer disclaimer)
    {
        disclaimer.setCreateBy(getUsername());
        return toAjax(disclaimerService.insertDisclaimer(disclaimer));
    }

    /**
     * 修改免责签署
     */
    @PreAuthorize("@ss.hasPermi('outdoor:disclaimer:edit')")
    @Log(title = "免责签署", businessType = BusinessType.UPDATE)
    @PutMapping
    public AjaxResult edit(@Validated @RequestBody Disclaimer disclaimer)
    {
        disclaimer.setUpdateBy(getUsername());
        return toAjax(disclaimerService.updateDisclaimer(disclaimer));
    }

    /**
     * 删除免责签署
     */
    @PreAuthorize("@ss.hasPermi('outdoor:disclaimer:remove')")
    @Log(title = "免责签署", businessType = BusinessType.DELETE)
	@DeleteMapping("/{disclaimerIds}")
    public AjaxResult remove(@PathVariable Long[] disclaimerIds)
    {
        return toAjax(disclaimerService.deleteDisclaimerByDisclaimerIds(disclaimerIds));
    }
}
