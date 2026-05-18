-- ----------------------------
-- 单元1迁移：分类树 outdoor_category + 活动租户化（act_activity.category_id）
-- PostgreSQL 方言
-- ----------------------------

DROP TABLE IF EXISTS outdoor_category CASCADE;
CREATE TABLE outdoor_category (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  club_id BIGINT NOT NULL,
  parent_id BIGINT DEFAULT 0,
  name VARCHAR(100) NOT NULL,
  sort INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT '0',
  del_flag VARCHAR(1) DEFAULT '0',
  create_by VARCHAR(64) DEFAULT '',
  create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  update_by VARCHAR(64) DEFAULT '',
  update_time TIMESTAMP,
  remark VARCHAR(500)
);

COMMENT ON TABLE outdoor_category IS '活动分类表';
COMMENT ON COLUMN outdoor_category.id IS '分类ID';
COMMENT ON COLUMN outdoor_category.club_id IS '俱乐部ID（租户ID）';
COMMENT ON COLUMN outdoor_category.parent_id IS '父分类ID（0为根）';
COMMENT ON COLUMN outdoor_category.name IS '分类名称';
COMMENT ON COLUMN outdoor_category.sort IS '显示顺序';
COMMENT ON COLUMN outdoor_category.status IS '状态（0正常 1停用）';
COMMENT ON COLUMN outdoor_category.del_flag IS '删除标志（0存在 2删除）';
COMMENT ON COLUMN outdoor_category.create_by IS '创建者';
COMMENT ON COLUMN outdoor_category.create_time IS '创建时间';
COMMENT ON COLUMN outdoor_category.update_by IS '更新者';
COMMENT ON COLUMN outdoor_category.update_time IS '更新时间';
COMMENT ON COLUMN outdoor_category.remark IS '备注';

CREATE INDEX idx_outdoor_category_club ON outdoor_category(club_id);
CREATE INDEX idx_outdoor_category_parent ON outdoor_category(parent_id);

-- ----------------------------
-- 活动租户化：新增分类外键列（club_id 已存在，复用作租户）
-- ----------------------------
ALTER TABLE act_activity ADD COLUMN IF NOT EXISTS category_id BIGINT;
COMMENT ON COLUMN act_activity.category_id IS '活动分类ID';
CREATE INDEX IF NOT EXISTS idx_act_activity_category ON act_activity(category_id);
