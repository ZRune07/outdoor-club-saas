package com.ruoyi.outdoor.payment.service.impl;

import com.ruoyi.common.core.domain.AjaxResult;
import com.ruoyi.common.utils.DateUtils;
import com.ruoyi.common.utils.StringUtils;
import com.ruoyi.outdoor.payment.domain.Payment;
import com.ruoyi.outdoor.payment.mapper.PaymentMapper;
import com.ruoyi.outdoor.payment.service.IPaymentService;
import com.ruoyi.outdoor.payment.service.IWxPaymentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.UUID;

/**
 * 订单Service业务层处理
 */
@Service
public class PaymentServiceImpl implements IPaymentService {
    private static final Logger log = LoggerFactory.getLogger(PaymentServiceImpl.class);

    @Autowired
    private PaymentMapper paymentMapper;
    
    @Autowired
    private IWxPaymentService wxPaymentService;

    /**
     * 根据订单ID查询
     */
    @Override
    public Payment selectPaymentByOrderId(Long orderId) {
        return paymentMapper.selectPaymentByOrderId(orderId);
    }

    /**
     * 根据订单号查询
     */
    @Override
    public Payment selectPaymentByOrderNo(String orderNo) {
        return paymentMapper.selectPaymentByOrderNo(orderNo);
    }

    /**
     * 根据报名ID查询订单
     */
    @Override
    public Payment selectPaymentByRegistrationId(Long registrationId) {
        return paymentMapper.selectPaymentByRegistrationId(registrationId);
    }

    /**
     * 查询用户的订单列表
     */
    @Override
    public List<Payment> selectPaymentListByUserId(Long wxUserId) {
        return paymentMapper.selectPaymentListByUserId(wxUserId);
    }

    /**
     * 查询俱乐部订单列表
     */
    @Override
    public List<Payment> selectPaymentList(Payment payment) {
        return paymentMapper.selectPaymentList(payment);
    }

    /**
     * 创建订单
     */
    @Override
    @Transactional
    public Long createPayment(Payment payment) {
        // 生成订单号
        if (StringUtils.isEmpty(payment.getOrderNo())) {
            payment.setOrderNo(generateOrderNo());
        }
        // 设置默认状态
        if (StringUtils.isEmpty(payment.getPayStatus())) {
            payment.setPayStatus("pending");
        }
        // 设置默认订单类型
        if (StringUtils.isEmpty(payment.getOrderType())) {
            payment.setOrderType("activity");
        }
        // 设置创建时间
        payment.setCreateTime(DateUtils.getNowDate());
        
        paymentMapper.insertPayment(payment);
        return payment.getOrderId();
    }

    /**
     * 更新订单状态
     */
    @Override
    @Transactional
    public int updatePaymentStatus(Long orderId, String status, String transactionId) {
        Payment payment = new Payment();
        payment.setOrderId(orderId);
        payment.setPayStatus(status);
        if (StringUtils.isNotEmpty(transactionId)) {
            payment.setTransactionId(transactionId);
        }
        if ("paid".equals(status)) {
            payment.setPayTime(new Date());
        }
        return paymentMapper.updatePayment(payment);
    }

    /**
     * 删除订单
     */
    @Override
    public int deletePaymentByOrderId(Long orderId) {
        return paymentMapper.deletePaymentByOrderId(orderId);
    }

    /**
     * 发起微信支付
     */
    @Override
    public AjaxResult createWxPayOrder(Payment payment) {
        try {
            // 1. 创建本地订单
            Long orderId = createPayment(payment);
            
            // 2. 调用微信支付统一下单接口
            // 这里简化处理，实际需要调用微信支付API
            // WxUnifiedOrderResponse response = wxPaymentService.unifiedOrder(request);
            
            // 返回支付参数（前端调起支付需要）
            AjaxResult result = AjaxResult.success();
            result.put("orderId", orderId);
            result.put("orderNo", payment.getOrderNo());
            result.put("payAmount", payment.getPayAmount());
            result.put("payStatus", payment.getPayStatus());
            
            // 实际项目中这里应该返回微信支付的prepay_id等参数
            // result.put("wxPayParams", response);
            
            return result;
        } catch (Exception e) {
            log.error("创建微信支付订单失败", e);
            return AjaxResult.error("创建支付订单失败");
        }
    }

    /**
     * 微信支付回调处理
     */
    @Override
    @Transactional
    public AjaxResult handleWxPayCallback(String xmlData) {
        try {
            // 实际项目中需要解析微信支付回调XML
            // 这里简化处理，假设已经解析出orderNo和transactionId
            String orderNo = extractOrderNoFromXml(xmlData);
            String transactionId = extractTransactionIdFromXml(xmlData);
            
            // 查询订单
            Payment payment = paymentMapper.selectPaymentByOrderNo(orderNo);
            if (payment == null) {
                log.warn("微信支付回调：订单不存在, orderNo={}", orderNo);
                return AjaxResult.error("订单不存在");
            }
            
            // 检查订单状态
            if ("paid".equals(payment.getPayStatus())) {
                return AjaxResult.success("OK");
            }
            
            // 更新订单状态
            int result = updatePaymentStatus(payment.getOrderId(), "paid", transactionId);
            
            if (result > 0) {
                log.info("微信支付回调：订单支付成功, orderNo={}, transactionId={}", orderNo, transactionId);
                return AjaxResult.success("OK");
            } else {
                return AjaxResult.error("更新订单状态失败");
            }
        } catch (Exception e) {
            log.error("微信支付回调处理失败", e);
            return AjaxResult.error("处理失败");
        }
    }

    /**
     * 生成订单号
     */
    private String generateOrderNo() {
        return "OUT" + DateUtils.dateTimeNow() + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    /**
     * 从XML中提取订单号（简化实现）
     */
    private String extractOrderNoFromXml(String xmlData) {
        // 实际项目中需要解析XML
        // 这里假设xmlData中包含out_trade_no字段
        int start = xmlData.indexOf("<out_trade_no>");
        int end = xmlData.indexOf("</out_trade_no>");
        if (start >= 0 && end > start) {
            return xmlData.substring(start + 14, end);
        }
        return null;
    }

    /**
     * 从XML中提取交易号（简化实现）
     */
    private String extractTransactionIdFromXml(String xmlData) {
        // 实际项目中需要解析XML
        int start = xmlData.indexOf("<transaction_id>");
        int end = xmlData.indexOf("</transaction_id>");
        if (start >= 0 && end > start) {
            return xmlData.substring(start + 15, end);
        }
        return null;
    }
}
