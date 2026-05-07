package com.ruoyi.outdoor.payment.service;

import com.ruoyi.common.core.domain.AjaxResult;
import com.ruoyi.outdoor.payment.domain.Payment;

import java.util.List;

/**
 * 订单Service接口
 */
public interface IPaymentService {
    
    /**
     * 根据订单ID查询
     */
    Payment selectPaymentByOrderId(Long orderId);
    
    /**
     * 根据订单号查询
     */
    Payment selectPaymentByOrderNo(String orderNo);
    
    /**
     * 根据报名ID查询订单
     */
    Payment selectPaymentByRegistrationId(Long registrationId);
    
    /**
     * 查询用户的订单列表
     */
    List<Payment> selectPaymentListByUserId(Long wxUserId);
    
    /**
     * 查询俱乐部订单列表
     */
    List<Payment> selectPaymentList(Payment payment);
    
    /**
     * 创建订单
     */
    Long createPayment(Payment payment);
    
    /**
     * 更新订单状态
     */
    int updatePaymentStatus(Long orderId, String status, String transactionId);
    
    /**
     * 删除订单
     */
    int deletePaymentByOrderId(Long orderId);
    
    /**
     * 发起微信支付
     */
    AjaxResult createWxPayOrder(Payment payment);
    
    /**
     * 微信支付回调处理
     */
    AjaxResult handleWxPayCallback(String xmlData);
}
