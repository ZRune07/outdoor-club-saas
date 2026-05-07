package com.ruoyi.outdoor.payment.mapper;

import com.ruoyi.outdoor.payment.domain.Payment;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 订单Mapper接口
 */
@Mapper
public interface PaymentMapper {
    
    /**
     * 根据订单ID查询
     */
    Payment selectPaymentByOrderId(@Param("orderId") Long orderId);
    
    /**
     * 根据订单号查询
     */
    Payment selectPaymentByOrderNo(@Param("orderNo") String orderNo);
    
    /**
     * 根据报名ID查询订单
     */
    Payment selectPaymentByRegistrationId(@Param("registrationId") Long registrationId);
    
    /**
     * 查询用户的订单列表
     */
    List<Payment> selectPaymentListByUserId(@Param("wxUserId") Long wxUserId);
    
    /**
     * 查询俱乐部订单列表
     */
    List<Payment> selectPaymentList(Payment payment);
    
    /**
     * 新增订单
     */
    int insertPayment(Payment payment);
    
    /**
     * 修改订单
     */
    int updatePayment(Payment payment);
    
    /**
     * 删除订单
     */
    int deletePaymentByOrderId(@Param("orderId") Long orderId);
}
