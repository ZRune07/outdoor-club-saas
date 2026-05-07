package com.ruoyi.outdoor.wxuser.service;

import com.ruoyi.outdoor.wxuser.dto.WxLoginRequest;
import com.ruoyi.outdoor.wxuser.dto.WxLoginResponse;

public interface IWxLoginService {
    WxLoginResponse login(WxLoginRequest request);
}
