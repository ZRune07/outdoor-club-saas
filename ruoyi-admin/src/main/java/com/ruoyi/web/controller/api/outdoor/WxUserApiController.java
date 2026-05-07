package com.ruoyi.web.controller.api.outdoor;

import com.ruoyi.common.core.controller.BaseController;
import com.ruoyi.common.core.domain.AjaxResult;
import com.ruoyi.common.utils.SecurityUtils;
import com.ruoyi.outdoor.wxuser.domain.WxUser;
import com.ruoyi.outdoor.wxuser.service.IWxUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wxuser")
public class WxUserApiController extends BaseController {
    @Autowired
    private IWxUserService wxUserService;

    @GetMapping("/{userId}")
    public AjaxResult getInfo(@PathVariable Long userId) {
        return success(wxUserService.selectWxUserByUserId(userId));
    }

    @GetMapping("/openid/{openid}")
    public AjaxResult getByOpenid(@PathVariable String openid) {
        return success(wxUserService.selectWxUserByOpenid(openid));
    }

    @GetMapping("/list")
    public AjaxResult list(WxUser wxUser) {
        startPage();
        List<WxUser> list = wxUserService.selectWxUserList(wxUser);
        return AjaxResult.success(getDataTable(list));
    }

    @PostMapping
    public AjaxResult add(@RequestBody WxUser wxUser) {
        return toAjax(wxUserService.insertWxUser(wxUser));
    }

    @PutMapping
    public AjaxResult edit(@RequestBody WxUser wxUser) {
        return toAjax(wxUserService.updateWxUser(wxUser));
    }
}
