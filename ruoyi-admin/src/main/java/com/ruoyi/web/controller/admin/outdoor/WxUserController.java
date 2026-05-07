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
import com.ruoyi.outdoor.wxuser.domain.WxUser;
import com.ruoyi.outdoor.wxuser.service.IWxUserService;
import com.ruoyi.common.utils.poi.ExcelUtil;
import com.ruoyi.common.core.page.TableDataInfo;

/**
 * 微信用户管理Controller
 * 
 * @author ruoyi
 */
@RestController
@RequestMapping("/admin/wxuser")
public class WxUserController extends BaseController
{
    @Autowired
    private IWxUserService wxUserService;

    /**
     * 查询微信用户列表
     */
    @PreAuthorize("@ss.hasPermi('outdoor:wxuser:list')")
    @GetMapping("/list")
    public TableDataInfo list(WxUser wxUser)
    {
        startPage();
        List<WxUser> list = wxUserService.selectWxUserList(wxUser);
        return getDataTable(list);
    }

    /**
     * 导出微信用户列表
     */
    @PreAuthorize("@ss.hasPermi('outdoor:wxuser:export')")
    @Log(title = "微信用户", businessType = BusinessType.EXPORT)
    @PostMapping("/export")
    public void export(HttpServletResponse response, WxUser wxUser)
    {
        List<WxUser> list = wxUserService.selectWxUserList(wxUser);
        ExcelUtil<WxUser> util = new ExcelUtil<WxUser>(WxUser.class);
        util.exportExcel(response, list, "微信用户数据");
    }

    /**
     * 获取微信用户详细信息
     */
    @PreAuthorize("@ss.hasPermi('outdoor:wxuser:query')")
    @GetMapping(value = "/{userId}")
    public AjaxResult getInfo(@PathVariable("userId") Long userId)
    {
        return success(wxUserService.selectWxUserByUserId(userId));
    }

    /**
     * 新增微信用户
     */
    @PreAuthorize("@ss.hasPermi('outdoor:wxuser:add')")
    @Log(title = "微信用户", businessType = BusinessType.INSERT)
    @PostMapping
    public AjaxResult add(@Validated @RequestBody WxUser wxUser)
    {
        wxUser.setCreateBy(getUsername());
        return toAjax(wxUserService.insertWxUser(wxUser));
    }

    /**
     * 修改微信用户
     */
    @PreAuthorize("@ss.hasPermi('outdoor:wxuser:edit')")
    @Log(title = "微信用户", businessType = BusinessType.UPDATE)
    @PutMapping
    public AjaxResult edit(@Validated @RequestBody WxUser wxUser)
    {
        wxUser.setUpdateBy(getUsername());
        return toAjax(wxUserService.updateWxUser(wxUser));
    }

    /**
     * 删除微信用户
     */
    @PreAuthorize("@ss.hasPermi('outdoor:wxuser:remove')")
    @Log(title = "微信用户", businessType = BusinessType.DELETE)
	@DeleteMapping("/{userIds}")
    public AjaxResult remove(@PathVariable Long[] userIds)
    {
        return toAjax(wxUserService.deleteWxUserByUserIds(userIds));
    }
}
