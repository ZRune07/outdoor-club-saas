package com.ruoyi.web.controller.wx;

import com.ruoyi.common.annotation.Anonymous;
import com.ruoyi.common.core.controller.BaseController;
import com.ruoyi.common.core.domain.AjaxResult;
import com.ruoyi.outdoor.payment.dto.WxUnifiedOrderRequest;
import com.ruoyi.outdoor.payment.dto.WxUnifiedOrderResponse;
import com.ruoyi.outdoor.payment.service.IWxPaymentService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.BufferedReader;
import java.io.IOException;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/wx-payment")
public class WxPaymentController extends BaseController {

    @Autowired
    private IWxPaymentService wxPaymentService;

    @PostMapping("/unified-order")
    public AjaxResult unifiedOrder(@Valid @RequestBody WxUnifiedOrderRequest request) {
        WxUnifiedOrderResponse response = wxPaymentService.unifiedOrder(request);
        return success(response);
    }

    @Anonymous
    @PostMapping("/callback")
    public String paymentCallback(HttpServletRequest request) throws IOException {
        BufferedReader reader = request.getReader();
        String xmlData = reader.lines().collect(Collectors.joining());
        wxPaymentService.handlePaymentCallback(xmlData);
        return "<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>";
    }

    @GetMapping("/status/{orderNo}")
    public AjaxResult queryPaymentStatus(@PathVariable String orderNo) {
        String status = wxPaymentService.queryPaymentStatus(orderNo);
        return success(status);
    }
}
