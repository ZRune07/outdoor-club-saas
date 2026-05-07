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
import com.ruoyi.outdoor.payment.domain.Payment;
import com.ruoyi.outdoor.payment.service.IPaymentService;
import com.ruoyi.common.utils.poi.ExcelUtil;
import com.ruoyi.common.core.page.TableDataInfo;

/**
 * 支付管理Controller
 * 
 * @author ruoyi
 */
@RestController
@RequestMapping("/admin/payment")
public class PaymentController extends BaseController
{
    @Autowired
    private IPaymentService paymentService;

    /**
     * 查询支付列表
     */
    @PreAuthorize("@ss.hasPermi('outdoor:payment:list')")
    @GetMapping("/list")
    public TableDataInfo list(Payment payment)
    {
        startPage();
        List<Payment> list = paymentService.selectPaymentList(payment);
        return getDataTable(list);
    }

    /**
     * 导出支付列表
     */
    @PreAuthorize("@ss.hasPermi('outdoor:payment:export')")
    @Log(title = "支付", businessType = BusinessType.EXPORT)
    @PostMapping("/export")
    public void export(HttpServletResponse response, Payment payment)
    {
        List<Payment> list = paymentService.selectPaymentList(payment);
        ExcelUtil<Payment> util = new ExcelUtil<Payment>(Payment.class);
        util.exportExcel(response, list, "支付数据");
    }

    /**
     * 获取支付详细信息
     */
    @PreAuthorize("@ss.hasPermi('outdoor:payment:query')")
    @GetMapping(value = "/{paymentId}")
    public AjaxResult getInfo(@PathVariable("paymentId") Long paymentId)
    {
        return success(paymentService.selectPaymentByPaymentId(paymentId));
    }

    /**
     * 新增支付
     */
    @PreAuthorize("@ss.hasPermi('outdoor:payment:add')")
    @Log(title = "支付", businessType = BusinessType.INSERT)
    @PostMapping
    public AjaxResult add(@Validated @RequestBody Payment payment)
    {
        payment.setCreateBy(getUsername());
        return toAjax(paymentService.insertPayment(payment));
    }

    /**
     * 修改支付
     */
    @PreAuthorize("@ss.hasPermi('outdoor:payment:edit')")
    @Log(title = "支付", businessType = BusinessType.UPDATE)
    @PutMapping
    public AjaxResult edit(@Validated @RequestBody Payment payment)
    {
        payment.setUpdateBy(getUsername());
        return toAjax(paymentService.updatePayment(payment));
    }

    /**
     * 删除支付
     */
    @PreAuthorize("@ss.hasPermi('outdoor:payment:remove')")
    @Log(title = "支付", businessType = BusinessType.DELETE)
	@DeleteMapping("/{paymentIds}")
    public AjaxResult remove(@PathVariable Long[] paymentIds)
    {
        return toAjax(paymentService.deletePaymentByPaymentIds(paymentIds));
    }
}
