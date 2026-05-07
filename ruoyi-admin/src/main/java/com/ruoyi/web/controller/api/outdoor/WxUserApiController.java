package com.ruoyi.web.controller.api.outdoor;

import com.ruoyi.common.core.controller.BaseController;
import com.ruoyi.common.core.domain.AjaxResult;
import com.ruoyi.outdoor.wxuser.domain.WxUser;
import com.ruoyi.outdoor.wxuser.service.IWxUserService;
import com.ruoyi.outdoor.wxuser.service.IWxLoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 微信用户API
 */
@RestController
@RequestMapping("/api/wxuser")
public class WxUserApiController extends BaseController {
    
    @Autowired
    private IWxUserService wxUserService;
    
    @Autowired
    private IWxLoginService wxLoginService;

    /**
     * 获取用户信息
     */
    @GetMapping("/{userId}")
    public AjaxResult getInfo(@PathVariable Long userId) {
        return success(wxUserService.selectWxUserByUserId(userId));
    }

    /**
     * 根据openid获取用户信息
     */
    @GetMapping("/openid/{openid}")
    public AjaxResult getByOpenid(@PathVariable String openid) {
        return success(wxUserService.selectWxUserByOpenid(openid));
    }

    /**
     * 微信登录
     */
    @PostMapping("/login")
    public AjaxResult wxLogin(@RequestBody WxUser wxUser) {
        return wxLoginService.wxLogin(wxUser.getOpenid());
    }

    /**
     * 更新用户信息
     */
    @PutMapping
    public AjaxResult edit(@RequestBody WxUser wxUser) {
        return toAjax(wxUserService.updateWxUser(wxUser));
    }

    /**
     * 保存用户信息（首次登录时完善资料）
     */
    @PostMapping("/profile")
    public AjaxResult saveProfile(@RequestBody WxUser wxUser) {
        return wxUserService.saveUserProfile(wxUser);
    }
}
