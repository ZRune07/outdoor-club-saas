package com.ruoyi.outdoor.payment.service;

import com.ruoyi.outdoor.payment.dto.WxUnifiedOrderRequest;
import com.ruoyi.outdoor.payment.dto.WxUnifiedOrderResponse;

public interface IWxPaymentService {
    WxUnifiedOrderResponse unifiedOrder(WxUnifiedOrderRequest request);
    void handlePaymentCallback(String xmlData);
    String queryPaymentStatus(String orderNo);
}
