package com.ruoyi.outdoor.payment.service.impl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.ruoyi.outdoor.payment.mapper.PaymentMapper;
import com.ruoyi.outdoor.payment.domain.Payment;
import com.ruoyi.outdoor.payment.service.IPaymentService;

/**
 * 支付Service业务层处理
 * 
 * @author ruoyi
 */
@Service
public class PaymentServiceImpl implements IPaymentService 
{
    @Autowired
    private PaymentMapper paymentMapper;

    /**
     * 查询支付
     * 
     * @param paymentId 支付主键
     * @return 支付
     */
    @Override
    public Payment selectPaymentByPaymentId(Long paymentId)
    {
        return paymentMapper.selectPaymentByPaymentId(paymentId);
    }

    /**
     * 查询支付列表
     * 
     * @param payment 支付
     * @return 支付
     */
    @Override
    public List<Payment> selectPaymentList(Payment payment)
    {
        return paymentMapper.selectPaymentList(payment);
    }

    /**
     * 新增支付
     * 
     * @param payment 支付
     * @return 结果
     */
    @Override
    public int insertPayment(Payment payment)
    {
        return paymentMapper.insertPayment(payment);
    }

    /**
     * 修改支付
     * 
     * @param payment 支付
     * @return 结果
     */
    @Override
    public int updatePayment(Payment payment)
    {
        return paymentMapper.updatePayment(payment);
    }

    /**
     * 批量删除支付
     * 
     * @param paymentIds 需要删除的支付主键
     * @return 结果
     */
    @Override
    public int deletePaymentByPaymentIds(Long[] paymentIds)
    {
        return paymentMapper.deletePaymentByPaymentIds(paymentIds);
    }

    /**
     * 删除支付信息
     * 
     * @param paymentId 支付主键
     * @return 结果
     */
    @Override
    public int deletePaymentByPaymentId(Long paymentId)
    {
        return paymentMapper.deletePaymentByPaymentId(paymentId);
    }
}
