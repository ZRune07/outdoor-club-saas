package com.ruoyi.web.controller.api.outdoor;

import com.ruoyi.common.core.controller.BaseController;
import com.ruoyi.common.core.domain.AjaxResult;
import com.ruoyi.common.core.page.TableDataInfo;
import com.ruoyi.outdoor.disclaimer.domain.Disclaimer;
import com.ruoyi.outdoor.disclaimer.domain.SignRecord;
import com.ruoyi.outdoor.disclaimer.service.IDisclaimerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;

/**
 * 免责签署API（H5/小程序端）
 */
@RestController
@RequestMapping("/api/disclaimer")
public class DisclaimerApiController extends BaseController {
    
    @Autowired
    private IDisclaimerService disclaimerService;

    /**
     * 获取俱乐部最新有效的免责条款
     */
    @GetMapping("/latest/{clubId}")
    public AjaxResult getLatest(@PathVariable Long clubId) {
        Disclaimer disclaimer = disclaimerService.selectActiveDisclaimer(clubId);
        return success(disclaimer);
    }

    /**
     * 获取免责条款详情
     */
    @GetMapping("/{disclaimerId}")
    public AjaxResult getInfo(@PathVariable("disclaimerId") Long disclaimerId) {
        return success(disclaimerService.selectDisclaimerByDisclaimerId(disclaimerId));
    }

    /**
     * 查询免责条款列表（管理端）
     */
    @GetMapping("/list")
    public TableDataInfo list(Disclaimer disclaimer) {
        startPage();
        List<Disclaimer> list = disclaimerService.selectDisclaimerList(disclaimer);
        return getDataTable(list);
    }

    /**
     * 新增免责条款（管理端）
     */
    @PostMapping
    public AjaxResult add(@Validated @RequestBody Disclaimer disclaimer) {
        return toAjax(disclaimerService.insertDisclaimer(disclaimer));
    }

    /**
     * 修改免责条款（管理端）
     */
    @PutMapping
    public AjaxResult edit(@Validated @RequestBody Disclaimer disclaimer) {
        return toAjax(disclaimerService.updateDisclaimer(disclaimer));
    }

    /**
     * 删除免责条款（管理端）
     */
    @DeleteMapping("/{disclaimerId}")
    public AjaxResult remove(@PathVariable Long disclaimerId) {
        return toAjax(disclaimerService.deleteDisclaimerByDisclaimerId(disclaimerId));
    }

    /**
     * 签署免责协议
     */
    @PostMapping("/sign")
    public AjaxResult sign(@RequestBody SignRecord signRecord, HttpServletRequest request) {
        // 获取签署IP
        String ip = getIpAddress(request);
        signRecord.setSignIp(ip);
        
        // 获取签署设备
        String userAgent = request.getHeader("User-Agent");
        signRecord.setSignDevice(userAgent);
        
        return disclaimerService.signDisclaimer(signRecord);
    }

    /**
     * 获取报名对应的签署记录
     */
    @GetMapping("/sign/{registrationId}")
    public AjaxResult getSignRecord(@PathVariable Long registrationId) {
        SignRecord signRecord = disclaimerService.selectSignRecordByRegistrationId(registrationId);
        return success(signRecord);
    }

    /**
     * 获取用户的签署记录列表
     */
    @GetMapping("/sign/user/{wxUserId}")
    public AjaxResult getUserSignRecords(@PathVariable Long wxUserId) {
        List<SignRecord> list = disclaimerService.selectSignRecordListByUserId(wxUserId);
        return success(list);
    }

    /**
     * 查询签署记录列表（管理端）
     */
    @GetMapping("/sign/list")
    public TableDataInfo signList(SignRecord signRecord) {
        startPage();
        List<SignRecord> list = disclaimerService.selectSignRecordList(signRecord);
        return getDataTable(list);
    }

    /**
     * 获取客户端IP地址
     */
    private String getIpAddress(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_CLIENT_IP");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_X_FORWARDED_FOR");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        return ip;
    }
}
