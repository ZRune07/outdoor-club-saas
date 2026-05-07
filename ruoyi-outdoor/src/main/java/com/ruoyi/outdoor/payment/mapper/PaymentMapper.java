package com.ruoyi.outdoor.payment.mapper;

import java.util.List;
import com.ruoyi.outdoor.payment.domain.Payment;

/**
 * 支付Mapper接口
 * 
 * @author ruoyi
 */
public interface PaymentMapper 
{
    /**
     * 查询支付
     * 
     * @param paymentId 支付主键
     * @return 支付
     */
    public Payment selectPaymentByPaymentId(String paymentId);

    /**
     * 根据订单号查询支付
     * 
     * @param orderNo 订单号
     * @return 支付
     */
    public Payment selectPaymentByOrderNo(String orderNo);

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
     * 删除支付
     * 
     * @param paymentId 支付主键
     * @return 结果
     */
    public int deletePaymentByPaymentId(String paymentId);

    /**
     * 批量删除支付
     * 
     * @param paymentIds 需要删除的数据主键集合
     * @return 结果
     */
    public int deletePaymentByPaymentIds(String[] paymentIds);
}
