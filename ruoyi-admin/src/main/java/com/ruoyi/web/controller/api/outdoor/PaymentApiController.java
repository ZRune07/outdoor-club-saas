package com.ruoyi.web.controller.api.outdoor;

import com.ruoyi.common.core.controller.BaseController;
import com.ruoyi.common.core.domain.AjaxResult;
import com.ruoyi.common.core.page.TableDataInfo;
import com.ruoyi.outdoor.payment.domain.Payment;
import com.ruoyi.outdoor.payment.service.IPaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 订单支付API（H5/小程序端）
 */
@RestController
@RequestMapping("/api/payment")
public class PaymentApiController extends BaseController {
    
    @Autowired
    private IPaymentService paymentService;

    /**
     * 获取订单详情
     */
    @GetMapping("/{orderId}")
    public AjaxResult getInfo(@PathVariable Long orderId) {
        return success(paymentService.selectPaymentByOrderId(orderId));
    }

    /**
     * 根据订单号查询
     */
    @GetMapping("/no/{orderNo}")
    public AjaxResult getByOrderNo(@PathVariable String orderNo) {
        return success(paymentService.selectPaymentByOrderNo(orderNo));
    }

    /**
     * 根据报名ID查询订单
     */
    @GetMapping("/registration/{registrationId}")
    public AjaxResult getByRegistrationId(@PathVariable Long registrationId) {
        return success(paymentService.selectPaymentByRegistrationId(registrationId));
    }

    /**
     * 获取用户的订单列表
     */
    @GetMapping("/user/{wxUserId}")
    public TableDataInfo getUserPayments(@PathVariable Long wxUserId) {
        startPage();
        List<Payment> list = paymentService.selectPaymentListByUserId(wxUserId);
        return getDataTable(list);
    }

    /**
     * 查询订单列表（管理端）
     */
    @GetMapping("/list")
    public TableDataInfo list(Payment payment) {
        startPage();
        List<Payment> list = paymentService.selectPaymentList(payment);
        return getDataTable(list);
    }

    /**
     * 创建订单并发起支付
     */
    @PostMapping("/create")
    public AjaxResult createPayment(@RequestBody Payment payment) {
        return paymentService.createWxPayOrder(payment);
    }

    /**
     * 微信支付回调（由微信服务器调用）
     */
    @PostMapping("/callback")
    public AjaxResult paymentCallback(@RequestBody String xmlData) {
        return paymentService.handleWxPayCallback(xmlData);
    }

    /**
     * 更新订单状态（管理端）
     */
    @PutMapping("/status/{orderId}")
    public AjaxResult updateStatus(
            @PathVariable Long orderId,
            @RequestParam String status,
            @RequestParam(required = false) String transactionId) {
        return toAjax(paymentService.updatePaymentStatus(orderId, status, transactionId));
    }
}
