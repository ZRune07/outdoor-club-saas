package com.ruoyi.outdoor.payment.service;

import java.util.List;
import com.ruoyi.outdoor.payment.domain.Payment;

/**
 * 支付Service接口
 * 
 * @author ruoyi
 */
public interface IPaymentService 
{
    /**
     * 查询支付
     * 
     * @param paymentId 支付主键
     * @return 支付
     */
    public Payment selectPaymentByPaymentId(Long paymentId);

    /**
     * 查询支付列表
     * 
     * @param payment 支付
     * @return 支付集合
     */
    public List<Payment> selectPaymentList(Payment payment);

    /**
     * 新增支付
     * 
     * @param payment 支付
     * @return 结果
     */
    public int insertPayment(Payment payment);

    /**
     * 修改支付
     * 
     * @param payment 支付
     * @return 结果
     */
    public int updatePayment(Payment payment);

    /**
     * 批量删除支付
     * 
     * @param paymentIds 需要删除的支付主键集合
     * @return 结果
     */
    public int deletePaymentByPaymentIds(Long[] paymentIds);

    /**
     * 删除支付信息
     * 
     * @param paymentId 支付主键
     * @return 结果
     */
    public int deletePaymentByPaymentId(Long paymentId);
}
