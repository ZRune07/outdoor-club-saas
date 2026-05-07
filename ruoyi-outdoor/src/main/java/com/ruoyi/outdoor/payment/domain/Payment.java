package com.ruoyi.outdoor.payment.domain;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import com.ruoyi.common.annotation.Excel;
import com.ruoyi.common.core.domain.BaseEntity;

/**
 * 支付对象 outdoor_payment
 * 
 * @author ruoyi
 */
public class Payment extends BaseEntity
{
    private static final long serialVersionUID = 1L;

    /** 支付ID */
    private String paymentId;

    /** 俱乐部ID */
    @NotNull(message = "俱乐部ID不能为空")
    @Excel(name = "俱乐部ID")
    private Long clubId;

    /** 活动ID */
    @Excel(name = "活动ID")
    private Long activityId;

    /** 报名ID */
    @NotNull(message = "报名ID不能为空")
    @Excel(name = "报名ID")
    private Long registrationId;

    /** 微信用户ID */
    @Excel(name = "微信用户ID")
    private Long wxUserId;

    /** 支付订单号 */
    @NotBlank(message = "支付订单号不能为空")
    @Size(min = 0, max = 64, message = "支付订单号长度不能超过64个字符")
    @Excel(name = "支付订单号")
    private String orderNo;

    /** 第三方支付流水号 */
    @Size(min = 0, max = 64, message = "第三方支付流水号长度不能超过64个字符")
    @Excel(name = "第三方支付流水号")
    private String transactionId;

    /** 支付金额 */
    @Excel(name = "支付金额")
    private BigDecimal totalAmount;

    /** 支付方式：wechat-微信支付 */
    @Size(min = 0, max = 20, message = "支付方式长度不能超过20个字符")
    @Excel(name = "支付方式")
    private String paymentMethod;

    /** 支付状态：0-待支付，1-已支付，2-已取消，3-已退款 */
    @Excel(name = "支付状态")
    private String status;

    /** 支付时间 */
    @Excel(name = "支付时间", width = 30, dateFormat = "yyyy-MM-dd HH:mm:ss")
    private java.util.Date payTime;

    /** 删除标志（0存在 2删除） */
    private String delFlag;

    public void setPaymentId(String paymentId) 
    {
        this.paymentId = paymentId;
    }

    public String getPaymentId() 
    {
        return paymentId;
    }

    public void setClubId(Long clubId) 
    {
        this.clubId = clubId;
    }

    public Long getClubId() 
    {
        return clubId;
    }

    public void setActivityId(Long activityId) 
    {
        this.activityId = activityId;
    }

    public Long getActivityId() 
    {
        return activityId;
    }

    public void setRegistrationId(Long registrationId) 
    {
        this.registrationId = registrationId;
    }

    public Long getRegistrationId() 
    {
        return registrationId;
    }

    public void setWxUserId(Long wxUserId) 
    {
        this.wxUserId = wxUserId;
    }

    public Long getWxUserId() 
    {
        return wxUserId;
    }

    public void setOrderNo(String orderNo) 
    {
        this.orderNo = orderNo;
    }

    public String getOrderNo() 
    {
        return orderNo;
    }

    public void setTransactionId(String transactionId) 
    {
        this.transactionId = transactionId;
    }

    public String getTransactionId() 
    {
        return transactionId;
    }

    public void setTotalAmount(BigDecimal totalAmount) 
    {
        this.totalAmount = totalAmount;
    }

    public BigDecimal getTotalAmount() 
    {
        return totalAmount;
    }

    public void setPaymentMethod(String paymentMethod) 
    {
        this.paymentMethod = paymentMethod;
    }

    public String getPaymentMethod() 
    {
        return paymentMethod;
    }

    public void setStatus(String status) 
    {
        this.status = status;
    }

    public String getStatus() 
    {
        return status;
    }

    public void setPayTime(java.util.Date payTime) 
    {
        this.payTime = payTime;
    }

    public java.util.Date getPayTime() 
    {
        return payTime;
    }

    public void setDelFlag(String delFlag) 
    {
        this.delFlag = delFlag;
    }

    public String getDelFlag() 
    {
        return delFlag;
    }

    @Override
    public String toString() {
        return new ToStringBuilder(this,ToStringStyle.MULTI_LINE_STYLE)
            .append("paymentId", getPaymentId())
            .append("clubId", getClubId())
            .append("activityId", getActivityId())
            .append("registrationId", getRegistrationId())
            .append("wxUserId", getWxUserId())
            .append("orderNo", getOrderNo())
            .append("transactionId", getTransactionId())
            .append("totalAmount", getTotalAmount())
            .append("paymentMethod", getPaymentMethod())
            .append("status", getStatus())
            .append("payTime", getPayTime())
            .append("delFlag", getDelFlag())
            .append("createBy", getCreateBy())
            .append("createTime", getCreateTime())
            .append("updateBy", getUpdateBy())
            .append("updateTime", getUpdateTime())
            .append("remark", getRemark())
            .toString();
    }
}
