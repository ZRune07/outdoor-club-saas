package com.ruoyi.outdoor.payment.dto;

import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class WxUnifiedOrderRequest {
    @NotNull(message = "活动ID不能为空")
    private Long activityId;

    @NotNull(message = "报名ID不能为空")
    private Long registrationId;

    private String description;

    public Long getActivityId() {
        return activityId;
    }

    public void setActivityId(Long activityId) {
        this.activityId = activityId;
    }

    public Long getRegistrationId() {
        return registrationId;
    }

    public void setRegistrationId(Long registrationId) {
        this.registrationId = registrationId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
