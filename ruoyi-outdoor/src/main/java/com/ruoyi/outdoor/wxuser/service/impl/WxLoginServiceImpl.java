package com.ruoyi.outdoor.wxuser.service.impl;

import cn.binarywang.wx.miniapp.api.WxMaService;
import cn.binarywang.wx.miniapp.bean.WxMaJscode2SessionResult;
import com.ruoyi.common.constant.CacheConstants;
import com.ruoyi.common.constant.Constants;
import com.ruoyi.common.core.redis.RedisCache;
import com.ruoyi.common.exception.ServiceException;
import com.ruoyi.common.utils.DateUtils;
import com.ruoyi.common.utils.uuid.IdUtils;
import com.ruoyi.common.utils.ip.AddressUtils;
import com.ruoyi.common.utils.ip.IpUtils;
import com.ruoyi.outdoor.wxuser.domain.WxUser;
import com.ruoyi.outdoor.wxuser.dto.WxLoginRequest;
import com.ruoyi.outdoor.wxuser.dto.WxLoginResponse;
import com.ruoyi.outdoor.wxuser.mapper.WxUserMapper;
import com.ruoyi.outdoor.wxuser.service.IWxLoginService;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import me.chanjar.weixin.common.error.WxErrorException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.concurrent.TimeUnit;

@Service
public class WxLoginServiceImpl implements IWxLoginService {

    @Autowired
    private WxMaService wxMaService;

    @Autowired
    private WxUserMapper wxUserMapper;

    @Autowired
    private RedisCache redisCache;

    @Value("${token.header}")
    private String header;

    @Value("${token.secret}")
    private String secret;

    @Value("${token.expireTime}")
    private int expireTime;

    protected static final long MILLIS_SECOND = 1000;

    protected static final long MILLIS_MINUTE = 60 * MILLIS_SECOND;

    @Override
    @Transactional
    public WxLoginResponse login(WxLoginRequest request) {
        try {
            WxMaJscode2SessionResult session = wxMaService.jsCode2SessionInfo(request.getCode());
            String openid = session.getOpenid();
            String unionid = session.getUnionid();

            WxUser wxUser = findOrCreateUser(openid, unionid, request);

            String token = generateToken(wxUser);

            WxLoginResponse response = new WxLoginResponse();
            response.setToken(token);

            WxLoginResponse.WxUserInfo userInfo = new WxLoginResponse.WxUserInfo();
            userInfo.setUserId(wxUser.getWxUserId());
            userInfo.setNickname(wxUser.getNickname());
            userInfo.setAvatar(wxUser.getAvatar());
            userInfo.setPhone(wxUser.getPhone());
            response.setUserInfo(userInfo);

            return response;
        } catch (WxErrorException e) {
            throw new ServiceException("微信登录失败：" + e.getMessage());
        }
    }

    private WxUser findOrCreateUser(String openid, String unionid, WxLoginRequest request) {
        WxUser wxUser = wxUserMapper.selectWxUserByOpenid(openid);

        if (wxUser != null) {
            // 更新用户信息
            if (request.getNickname() != null || request.getAvatar() != null) {
                if (request.getNickname() != null) {
                    wxUser.setNickname(request.getNickname());
                }
                if (request.getAvatar() != null) {
                    wxUser.setAvatar(request.getAvatar());
                }
                wxUser.setUpdateTime(DateUtils.getNowDate());
                wxUserMapper.updateWxUser(wxUser);
            }
            return wxUser;
        } else {
            // 创建新用户
            wxUser = new WxUser();
            wxUser.setOpenid(openid);
            wxUser.setUnionid(unionid);
            wxUser.setNickname(request.getNickname() != null ? request.getNickname() : "微信用户");
            wxUser.setAvatar(request.getAvatar());
            if (request.getGender() != null && !"".equals(request.getGender())) {
                wxUser.setGender(Integer.parseInt(request.getGender()));
            }
            wxUser.setClubId(request.getClubId() != null ? request.getClubId() : 1L);
            wxUser.setStatus("0");
            wxUser.setDelFlag("0");
            wxUser.setCreateTime(DateUtils.getNowDate());
            wxUserMapper.insertWxUser(wxUser);
            return wxUser;
        }
    }

    private String generateToken(WxUser wxUser) {
        String uuid = IdUtils.fastUUID();
        Map<String, Object> claims = new HashMap<>();
        claims.put(Constants.LOGIN_USER_KEY, uuid);
        claims.put("userId", wxUser.getWxUserId());
        claims.put("openid", wxUser.getOpenid());
        claims.put("clubId", wxUser.getClubId());

        String userKey = CacheConstants.LOGIN_TOKEN_KEY + uuid;
        Map<String, Object> userCache = new HashMap<>();
        userCache.put("userId", wxUser.getWxUserId());
        userCache.put("openid", wxUser.getOpenid());
        userCache.put("nickname", wxUser.getNickname());
        userCache.put("avatar", wxUser.getAvatar());
        userCache.put("clubId", wxUser.getClubId());
        userCache.put("loginTime", System.currentTimeMillis());
        userCache.put("expireTime", System.currentTimeMillis() + expireTime * MILLIS_MINUTE);

        String ip = IpUtils.getIpAddr();
        userCache.put("ipaddr", ip);
        userCache.put("loginLocation", AddressUtils.getRealAddressByIP(ip));

        redisCache.setCacheObject(userKey, userCache, expireTime, TimeUnit.MINUTES);

        return createToken(claims);
    }

    private String createToken(Map<String, Object> claims) {
        return Jwts.builder()
                .setClaims(claims)
                .signWith(SignatureAlgorithm.HS512, secret).compact();
    }
}
