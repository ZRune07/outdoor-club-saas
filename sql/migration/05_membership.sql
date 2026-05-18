-- ----------------------------
-- 单元5：会员体系（PostgreSQL）
-- ----------------------------

-- 会员等级配置表
CREATE TABLE outdoor_membership_config (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  club_id BIGINT NOT NULL,
  level_name VARCHAR(100) NOT NULL,
  validity_days INT NOT NULL DEFAULT 365,
  price NUMERIC(10,2) DEFAULT 0,
  benefits TEXT,
  description TEXT,
  enabled CHAR(1) DEFAULT '1',
  del_flag CHAR(1) DEFAULT '0',
  create_by VARCHAR(64) DEFAULT '',
  create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  update_by VARCHAR(64) DEFAULT '',
  update_time TIMESTAMP,
  remark VARCHAR(500)
);

COMMENT ON TABLE outdoor_membership_config IS '会员等级配置表';
COMMENT ON COLUMN outdoor_membership_config.club_id IS '租户(俱乐部)ID';
COMMENT ON COLUMN outdoor_membership_config.level_name IS '会员等级名称';
COMMENT ON COLUMN outdoor_membership_config.validity_days IS '有效天数';
COMMENT ON COLUMN outdoor_membership_config.price IS '价格';
COMMENT ON COLUMN outdoor_membership_config.benefits IS '会员权益';
COMMENT ON COLUMN outdoor_membership_config.enabled IS '是否启用(1启用 0停用)';
COMMENT ON COLUMN outdoor_membership_config.del_flag IS '删除标志(0存在 2删除)';

CREATE INDEX idx_membership_config_club ON outdoor_membership_config (club_id);

-- 用户会员表
CREATE TABLE outdoor_user_membership (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  wx_user_id BIGINT NOT NULL,
  club_id BIGINT NOT NULL,
  config_id BIGINT NOT NULL,
  activated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expire_at TIMESTAMP,
  status CHAR(1) DEFAULT '0',
  del_flag CHAR(1) DEFAULT '0',
  create_by VARCHAR(64) DEFAULT '',
  create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  update_by VARCHAR(64) DEFAULT '',
  update_time TIMESTAMP,
  remark VARCHAR(500)
);

COMMENT ON TABLE outdoor_user_membership IS '用户会员表';
COMMENT ON COLUMN outdoor_user_membership.wx_user_id IS '微信用户ID';
COMMENT ON COLUMN outdoor_user_membership.club_id IS '租户(俱乐部)ID';
COMMENT ON COLUMN outdoor_user_membership.config_id IS '会员等级配置ID';
COMMENT ON COLUMN outdoor_user_membership.activated_at IS '激活时间';
COMMENT ON COLUMN outdoor_user_membership.expire_at IS '过期时间';
COMMENT ON COLUMN outdoor_user_membership.status IS '状态(0有效 1过期)';
COMMENT ON COLUMN outdoor_user_membership.del_flag IS '删除标志(0存在 2删除)';

CREATE INDEX idx_user_membership_user_club ON outdoor_user_membership (wx_user_id, club_id);
