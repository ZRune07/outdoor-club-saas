-- ----------------------------
-- 单元3：电子签协议表
-- PostgreSQL 方言
-- ----------------------------
DROP TABLE IF EXISTS outdoor_agreement CASCADE;
CREATE TABLE outdoor_agreement (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  club_id BIGINT NOT NULL,
  enrollment_id BIGINT,
  activity_id BIGINT,
  content TEXT,
  signature TEXT,
  signer_name VARCHAR(50),
  signer_phone VARCHAR(20),
  signed_at TIMESTAMP,
  status CHAR(1) DEFAULT '0',
  del_flag CHAR(1) DEFAULT '0',
  create_by VARCHAR(64) DEFAULT '',
  create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  update_by VARCHAR(64) DEFAULT '',
  update_time TIMESTAMP
);

COMMENT ON TABLE outdoor_agreement IS '电子签协议表';
COMMENT ON COLUMN outdoor_agreement.id IS '协议ID';
COMMENT ON COLUMN outdoor_agreement.club_id IS '俱乐部ID（租户）';
COMMENT ON COLUMN outdoor_agreement.enrollment_id IS '报名ID（可空）';
COMMENT ON COLUMN outdoor_agreement.activity_id IS '活动ID';
COMMENT ON COLUMN outdoor_agreement.content IS '协议正文';
COMMENT ON COLUMN outdoor_agreement.signature IS '签名图（base64）';
COMMENT ON COLUMN outdoor_agreement.signer_name IS '签署人姓名';
COMMENT ON COLUMN outdoor_agreement.signer_phone IS '签署人手机号';
COMMENT ON COLUMN outdoor_agreement.signed_at IS '签署时间';
COMMENT ON COLUMN outdoor_agreement.status IS '状态（0草稿 1已签）';
COMMENT ON COLUMN outdoor_agreement.del_flag IS '删除标志（0代表存在 2代表删除）';
COMMENT ON COLUMN outdoor_agreement.create_by IS '创建者';
COMMENT ON COLUMN outdoor_agreement.create_time IS '创建时间';
COMMENT ON COLUMN outdoor_agreement.update_by IS '更新者';
COMMENT ON COLUMN outdoor_agreement.update_time IS '更新时间';

CREATE INDEX idx_agreement_club ON outdoor_agreement(club_id);
CREATE INDEX idx_agreement_enrollment ON outdoor_agreement(enrollment_id);
CREATE INDEX idx_agreement_activity ON outdoor_agreement(activity_id);
