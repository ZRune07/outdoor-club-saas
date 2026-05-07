package com.ruoyi.web.controller.wx;

import com.ruoyi.common.annotation.Anonymous;
import com.ruoyi.common.core.controller.BaseController;
import com.ruoyi.common.core.domain.AjaxResult;
import com.ruoyi.outdoor.wxuser.dto.WxLoginRequest;
import com.ruoyi.outdoor.wxuser.dto.WxLoginResponse;
import com.ruoyi.outdoor.wxuser.service.IWxLoginService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class WxAuthController extends BaseController {

    @Autowired
    private IWxLoginService wxLoginService;

    @Anonymous
    @PostMapping("/login")
    public AjaxResult login(@Valid @RequestBody WxLoginRequest request) {
        WxLoginResponse response = wxLoginService.login(request);
        return success(response);
    }
}
