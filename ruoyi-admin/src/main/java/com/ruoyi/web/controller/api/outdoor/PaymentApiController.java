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
import com.ruoyi.outdoor.payment.domain.Payment;
import com.ruoyi.outdoor.payment.service.IPaymentService;

/**
 * 支付API（H5/小程序端）
 * 
 * @author ruoyi
 */
@RestController
@RequestMapping("/api/payment")
public class PaymentApiController extends BaseController
{
    @Autowired
    private IPaymentService paymentService;

    /**
     * 查询支付列表（H5/小程序端）
     */
    @GetMapping("/list")
    public TableDataInfo list(Payment payment)
    {
        startPage();
        List<Payment> list = paymentService.selectPaymentList(payment);
        return getDataTable(list);
    }

    /**
     * 获取支付详细信息（H5/小程序端）
     */
    @GetMapping(value = "/{paymentId}")
    public AjaxResult getInfo(@PathVariable("paymentId") Long paymentId)
    {
        return success(paymentService.selectPaymentByPaymentId(paymentId));
    }

    /**
     * 新增支付（H5/小程序端）
     */
    @PostMapping
    public AjaxResult add(@Validated @RequestBody Payment payment)
    {
        return toAjax(paymentService.insertPayment(payment));
    }

    /**
     * 修改支付（H5/小程序端）
     */
    @PutMapping
    public AjaxResult edit(@Validated @RequestBody Payment payment)
    {
        return toAjax(paymentService.updatePayment(payment));
    }
}
