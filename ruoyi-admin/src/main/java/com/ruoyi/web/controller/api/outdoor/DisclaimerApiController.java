package com.ruoyi.web.controller.api.outdoor;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.ruoyi.common.core.controller.BaseController;
import com.ruoyi.common.core.domain.AjaxResult;
import com.ruoyi.common.core.page.TableDataInfo;
import com.ruoyi.outdoor.disclaimer.domain.Disclaimer;
import com.ruoyi.outdoor.disclaimer.service.IDisclaimerService;

/**
 * 免责签署API（H5/小程序端）
 * 
 * @author ruoyi
 */
@RestController
@RequestMapping("/api/disclaimer")
public class DisclaimerApiController extends BaseController
{
    @Autowired
    private IDisclaimerService disclaimerService;

    /**
     * 获取最新免责条款（H5/小程序端）
     */
    @GetMapping("/latest")
    public AjaxResult getLatest()
    {
        Disclaimer disclaimer = new Disclaimer();
        List<Disclaimer> list = disclaimerService.selectDisclaimerList(disclaimer);
        if (list != null && !list.isEmpty())
        {
            return success(list.get(0));
        }
        return success(null);
    }

    /**
     * 查询免责签署列表（H5/小程序端）
     */
    @GetMapping("/list")
    public TableDataInfo list(Disclaimer disclaimer)
    {
        startPage();
        List<Disclaimer> list = disclaimerService.selectDisclaimerList(disclaimer);
        return getDataTable(list);
    }

    /**
     * 获取免责签署详细信息（H5/小程序端）
     */
    @GetMapping(value = "/{disclaimerId}")
    public AjaxResult getInfo(@PathVariable("disclaimerId") Long disclaimerId)
    {
        return success(disclaimerService.selectDisclaimerByDisclaimerId(disclaimerId));
    }

    /**
     * 新增免责签署（H5/小程序端）
     */
    @PostMapping
    public AjaxResult add(@Validated @RequestBody Disclaimer disclaimer)
    {
        return toAjax(disclaimerService.insertDisclaimer(disclaimer));
    }

    /**
     * 修改免责签署（H5/小程序端）
     */
    @PutMapping
    public AjaxResult edit(@Validated @RequestBody Disclaimer disclaimer)
    {
        return toAjax(disclaimerService.updateDisclaimer(disclaimer));
    }
}
