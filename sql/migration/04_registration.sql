-- ============================================================
-- 单元 4：报名增强 DDL（PostgreSQL）
-- 复用 reg_registration.club_id 作租户隔离（club_id == tenant_id），不新增重复列
-- ============================================================

ALTER TABLE reg_registration ADD COLUMN IF NOT EXISTS participant_count int DEFAULT 1;
ALTER TABLE reg_registration ADD COLUMN IF NOT EXISTS message varchar(500);
ALTER TABLE reg_registration ADD COLUMN IF NOT EXISTS employee_id bigint;
ALTER TABLE reg_registration ADD COLUMN IF NOT EXISTS extra_fields_json text;

COMMENT ON COLUMN reg_registration.participant_count IS '报名人数';
COMMENT ON COLUMN reg_registration.message IS '报名留言';
COMMENT ON COLUMN reg_registration.employee_id IS '关联员工ID（可空）';
COMMENT ON COLUMN reg_registration.extra_fields_json IS '动态表单字段值（JSON文本）';
