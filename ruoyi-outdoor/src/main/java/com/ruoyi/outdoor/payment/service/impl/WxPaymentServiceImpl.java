package com.ruoyi.outdoor.payment.service.impl;

import cn.binarywang.wx.miniapp.api.WxMaService;
import com.github.binarywang.wxpay.bean.notify.WxPayNotifyResponse;
import com.github.binarywang.wxpay.bean.notify.WxPayOrderNotifyResult;
import com.github.binarywang.wxpay.bean.order.WxPayMpOrderResult;
import com.github.binarywang.wxpay.bean.request.WxPayUnifiedOrderRequest;
import com.github.binarywang.wxpay.bean.result.WxPayOrderQueryResult;
import com.github.binarywang.wxpay.service.WxPayService;
import com.ruoyi.common.exception.ServiceException;
import com.ruoyi.common.utils.DateUtils;
import com.ruoyi.common.utils.StringUtils;
import com.ruoyi.common.utils.uuid.IdUtils;
import com.ruoyi.outdoor.activity.domain.Activity;
import com.ruoyi.outdoor.activity.mapper.ActivityMapper;
import com.ruoyi.outdoor.payment.domain.Payment;
import com.ruoyi.outdoor.payment.dto.WxUnifiedOrderRequest;
import com.ruoyi.outdoor.payment.dto.WxUnifiedOrderResponse;
import com.ruoyi.outdoor.payment.mapper.PaymentMapper;
import com.ruoyi.outdoor.payment.service.IWxPaymentService;
import com.ruoyi.outdoor.registration.domain.Registration;
import com.ruoyi.outdoor.registration.mapper.RegistrationMapper;
import me.chanjar.weixin.common.error.WxErrorException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Date;

@Service
public class WxPaymentServiceImpl implements IWxPaymentService {

    @Autowired
    private WxPayService wxPayService;

    @Autowired
    private WxMaService wxMaService;

    @Autowired
    private PaymentMapper paymentMapper;

    @Autowired
    private RegistrationMapper registrationMapper;

    @Autowired
    private ActivityMapper activityMapper;

    @Value("${wx.pay.notifyUrl}")
    private String notifyUrl;

    @Override
    @Transactional
    public WxUnifiedOrderResponse unifiedOrder(WxUnifiedOrderRequest request) {
        Registration registration = registrationMapper.selectRegistrationByRegistrationId(request.getRegistrationId());
        if (registration == null) {
            throw new ServiceException("报名信息不存在");
        }

        Activity activity = activityMapper.selectActivityByActivityId(request.getActivityId());
        if (activity == null) {
            throw new ServiceException("活动不存在");
        }

        String orderNo = generateOrderNo();
        BigDecimal totalFee = registration.getTotalFee();
        if (totalFee == null || totalFee.compareTo(BigDecimal.ZERO) <= 0) {
            totalFee = activity.getFee() != null ? activity.getFee() : BigDecimal.ZERO;
        }

        Payment payment = new Payment();
        payment.setPaymentId(IdUtils.fastSimpleUUID().substring(0, 32));
        payment.setOrderNo(orderNo);
        payment.setRegistrationId(registration.getRegistrationId());
        payment.setActivityId(activity.getActivityId());
        payment.setWxUserId(registration.getWxUserId());
        payment.setClubId(registration.getClubId());
        payment.setTotalAmount(totalFee);
        payment.setStatus("0");
        payment.setCreateTime(DateUtils.getNowDate());
        payment.setRemark(request.getDescription());
        paymentMapper.insertPayment(payment);

        try {
            WxPayUnifiedOrderRequest orderRequest = new WxPayUnifiedOrderRequest();
            orderRequest.setBody(request.getDescription() != null ? request.getDescription() : activity.getActivityName());
            orderRequest.setOutTradeNo(orderNo);
            orderRequest.setTotalFee(totalFee.multiply(new BigDecimal("100")).intValue());
            orderRequest.setSpbillCreateIp("127.0.0.1");
            orderRequest.setNotifyUrl(notifyUrl);
            orderRequest.setTradeType("JSAPI");
            orderRequest.setOpenid(registration.getWxUserId() != null ? registration.getWxUserId().toString() : "");

            WxPayMpOrderResult result = wxPayService.createOrder(orderRequest);

            WxUnifiedOrderResponse response = new WxUnifiedOrderResponse();
            response.setTimeStamp(result.getTimeStamp());
            response.setNonceStr(result.getNonceStr());
            response.setPackageStr(result.getPackageValue());
            response.setSignType(result.getSignType());
            response.setPaySign(result.getPaySign());
            response.setOrderNo(orderNo);

            return response;
        } catch (WxErrorException e) {
            throw new ServiceException("创建支付订单失败：" + e.getMessage());
        }
    }

    @Override
    @Transactional
    public void handlePaymentCallback(String xmlData) {
        try {
            WxPayOrderNotifyResult notifyResult = wxPayService.parseOrderNotifyResult(xmlData);
            String orderNo = notifyResult.getOutTradeNo();
            
            Payment payment = paymentMapper.selectPaymentByOrderNo(orderNo);
            if (payment == null) {
                throw new ServiceException("订单不存在");
            }

            if ("1".equals(payment.getStatus())) {
                return;
            }

            payment.setStatus("1");
            payment.setPayTime(DateUtils.getNowDate());
            payment.setTransactionId(notifyResult.getTransactionId());
            paymentMapper.updatePayment(payment);

            Registration registration = registrationMapper.selectRegistrationByRegistrationId(payment.getRegistrationId());
            if (registration != null) {
                registration.setStatus("1");
                registration.setUpdateTime(DateUtils.getNowDate());
                registrationMapper.updateRegistration(registration);

                Activity activity = activityMapper.selectActivityByActivityId(registration.getActivityId());
                if (activity != null && activity.getParticipantCount() != null) {
                    activity.setParticipantCount(activity.getParticipantCount() + 1);
                    activityMapper.updateActivity(activity);
                }
            }
        } catch (WxErrorException e) {
            throw new ServiceException("处理支付回调失败：" + e.getMessage());
        }
    }

    @Override
    public String queryPaymentStatus(String orderNo) {
        try {
            WxPayOrderQueryResult result = wxPayService.queryOrder(null, orderNo);
            String tradeState = result.getTradeState();
            
            if ("SUCCESS".equals(tradeState)) {
                return "SUCCESS";
            } else if ("NOTPAY".equals(tradeState) || "USERPAYING".equals(tradeState)) {
                return "PENDING";
            } else {
                return "FAILED";
            }
        } catch (WxErrorException e) {
            throw new ServiceException("查询支付状态失败：" + e.getMessage());
        }
    }

    private String generateOrderNo() {
        String timestamp = DateUtils.dateTimeNow("yyyyMMddHHmmss");
        String random = IdUtils.fastSimpleUUID().substring(0, 8).toUpperCase();
        return "OUT" + timestamp + random;
    }
}
