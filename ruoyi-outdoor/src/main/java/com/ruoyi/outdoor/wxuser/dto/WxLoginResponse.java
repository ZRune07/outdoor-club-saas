package com.ruoyi.outdoor.wxuser.dto;

public class WxLoginResponse {
    private String token;
    private WxUserInfo userInfo;

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public WxUserInfo getUserInfo() {
        return userInfo;
    }

    public void setUserInfo(WxUserInfo userInfo) {
        this.userInfo = userInfo;
    }

    public static class WxUserInfo {
        private Long userId;
        private String nickname;
        private String avatar;
        private String phone;
        private Long clubId;
        private String role;

        public Long getClubId() {
            return clubId;
        }

        public void setClubId(Long clubId) {
            this.clubId = clubId;
        }

        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = role;
        }

        public Long getUserId() {
            return userId;
        }

        public void setUserId(Long userId) {
            this.userId = userId;
        }

        public String getNickname() {
            return nickname;
        }

        public void setNickname(String nickname) {
            this.nickname = nickname;
        }

        public String getAvatar() {
            return avatar;
        }

        public void setAvatar(String avatar) {
            this.avatar = avatar;
        }

        public String getPhone() {
            return phone;
        }

        public void setPhone(String phone) {
            this.phone = phone;
        }
    }
}
