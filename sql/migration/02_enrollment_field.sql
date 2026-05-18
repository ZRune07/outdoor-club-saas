-- ----------------------------
-- 单元 2: 报名表单配置表
-- PostgreSQL 方言
-- ----------------------------
DROP TABLE IF EXISTS outdoor_enrollment_field CASCADE;
CREATE TABLE outdoor_enrollment_field (
  id                  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  club_id             BIGINT NOT NULL,
  activity_id         BIGINT NOT NULL DEFAULT 0,
  fields_json         TEXT,
  agreement_content   TEXT,
  enable_enrollment   CHAR(1) DEFAULT '1',
  enable_agreement    CHAR(1) DEFAULT '0',
  membership_required CHAR(1) DEFAULT '0',
  status              CHAR(1) DEFAULT '0',
  del_flag            CHAR(1) DEFAULT '0',
  create_by           VARCHAR(64) DEFAULT '',
  create_time         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  update_by           VARCHAR(64) DEFAULT '',
  update_time         TIMESTAMP,
  remark              VARCHAR(500)
);

CREATE UNIQUE INDEX uk_enrollment_field_club_activity
  ON outdoor_enrollment_field (club_id, activity_id);

COMMENT ON TABLE outdoor_enrollment_field IS '报名表单配置表';
COMMENT ON COLUMN outdoor_enrollment_field.id IS '主键ID';
COMMENT ON COLUMN outdoor_enrollment_field.club_id IS '俱乐部ID（租户）';
COMMENT ON COLUMN outdoor_enrollment_field.activity_id IS '活动ID（0=租户级默认配置）';
COMMENT ON COLUMN outdoor_enrollment_field.fields_json IS '字段数组JSON [{label,key,type,placeholder,required}]';
COMMENT ON COLUMN outdoor_enrollment_field.agreement_content IS '报名协议内容';
COMMENT ON COLUMN outdoor_enrollment_field.enable_enrollment IS '是否开启报名（1是 0否）';
COMMENT ON COLUMN outdoor_enrollment_field.enable_agreement IS '是否开启协议（1是 0否）';
COMMENT ON COLUMN outdoor_enrollment_field.membership_required IS '是否要求会员（1是 0否）';
COMMENT ON COLUMN outdoor_enrollment_field.status IS '状态（0正常 1停用）';
COMMENT ON COLUMN outdoor_enrollment_field.del_flag IS '删除标志（0代表存在 2代表删除）';
