-- =============================================
-- 户外运动俱乐部SaaS小程序 - 数据库初始化脚本
-- 数据库: PostgreSQL
-- =============================================

-- ----------------------------
-- 1、部门表
-- ----------------------------
DROP TABLE IF EXISTS sys_dept CASCADE;
CREATE TABLE sys_dept (
  dept_id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  parent_id         BIGINT          DEFAULT 0,
  ancestors         VARCHAR(50)     DEFAULT '',
  dept_name         VARCHAR(30)     DEFAULT '',
  order_num         INTEGER         DEFAULT 0,
  leader            VARCHAR(20),
  phone             VARCHAR(11),
  email             VARCHAR(50),
  status            CHAR(1)         DEFAULT '0',
  del_flag          CHAR(1)         DEFAULT '0',
  create_by         VARCHAR(64)     DEFAULT '',
  create_time      TIMESTAMP,
  update_by         VARCHAR(64)     DEFAULT '',
  update_time       TIMESTAMP
);

COMMENT ON TABLE sys_dept IS '部门表';
COMMENT ON COLUMN sys_dept.dept_id IS '部门id';
COMMENT ON COLUMN sys_dept.parent_id IS '父部门id';
COMMENT ON COLUMN sys_dept.ancestors IS '祖级列表';
COMMENT ON COLUMN sys_dept.dept_name IS '部门名称';
COMMENT ON COLUMN sys_dept.order_num IS '显示顺序';
COMMENT ON COLUMN sys_dept.leader IS '负责人';
COMMENT ON COLUMN sys_dept.phone IS '联系电话';
COMMENT ON COLUMN sys_dept.email IS '邮箱';
COMMENT ON COLUMN sys_dept.status IS '部门状态（0正常 1停用）';
COMMENT ON COLUMN sys_dept.del_flag IS '删除标志（0代表存在 2代表删除）';
COMMENT ON COLUMN sys_dept.create_by IS '创建者';
COMMENT ON COLUMN sys_dept.create_time IS '创建时间';
COMMENT ON COLUMN sys_dept.update_by IS '更新者';
COMMENT ON COLUMN sys_dept.update_time IS '更新时间';

-- ----------------------------
-- 初始化-部门表数据
-- ----------------------------
INSERT INTO sys_dept (dept_id, parent_id, ancestors, dept_name, order_num, leader, phone, email, status, del_flag, create_by, create_time) 
OVERRIDING SYSTEM VALUE VALUES
(100,  0,   '0',          '若依科技',   0, '若依', '15888888888', 'ry@qq.com', '0', '0', 'admin', NOW()),
(101,  100, '0,100',      '深圳总公司', 1, '若依', '15888888888', 'ry@qq.com', '0', '0', 'admin', NOW()),
(102,  100, '0,100',      '长沙分公司', 2, '若依', '15888888888', 'ry@qq.com', '0', '0', 'admin', NOW()),
(103,  101, '0,100,101',  '研发部门',   1, '若依', '15888888888', 'ry@qq.com', '0', '0', 'admin', NOW()),
(104,  101, '0,100,101',  '市场部门',   2, '若依', '15888888888', 'ry@qq.com', '0', '0', 'admin', NOW()),
(105,  101, '0,100,101',  '测试部门',   3, '若依', '15888888888', 'ry@qq.com', '0', '0', 'admin', NOW()),
(106,  101, '0,100,101',  '财务部门',   4, '若依', '15888888888', 'ry@qq.com', '0', '0', 'admin', NOW()),
(107,  101, '0,100,101',  '运维部门',   5, '若依', '15888888888', 'ry@qq.com', '0', '0', 'admin', NOW()),
(108,  102, '0,100,102',  '市场部门',   1, '若依', '15888888888', 'ry@qq.com', '0', '0', 'admin', NOW()),
(109,  102, '0,100,102',  '财务部门',   2, '若依', '15888888888', 'ry@qq.com', '0', '0', 'admin', NOW());


-- ----------------------------
-- 2、用户信息表
-- ----------------------------
DROP TABLE IF EXISTS sys_user CASCADE;
CREATE TABLE sys_user (
  user_id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  dept_id           BIGINT,
  user_name         VARCHAR(30)     NOT NULL,
  nick_name         VARCHAR(30)     NOT NULL,
  user_type         VARCHAR(2)      DEFAULT '00',
  email             VARCHAR(50)     DEFAULT '',
  phonenumber       VARCHAR(11)     DEFAULT '',
  sex               CHAR(1)         DEFAULT '0',
  avatar            VARCHAR(100)    DEFAULT '',
  password          VARCHAR(100)    DEFAULT '',
  status            CHAR(1)         DEFAULT '0',
  del_flag          CHAR(1)         DEFAULT '0',
  login_ip          VARCHAR(128)    DEFAULT '',
  login_date        TIMESTAMP,
  pwd_update_date   TIMESTAMP,
  create_by         VARCHAR(64)     DEFAULT '',
  create_time       TIMESTAMP,
  update_by         VARCHAR(64)     DEFAULT '',
  update_time       TIMESTAMP,
  remark            VARCHAR(500)
);

COMMENT ON TABLE sys_user IS '用户信息表';
COMMENT ON COLUMN sys_user.user_id IS '用户ID';
COMMENT ON COLUMN sys_user.dept_id IS '部门ID';
COMMENT ON COLUMN sys_user.user_name IS '用户账号';
COMMENT ON COLUMN sys_user.nick_name IS '用户昵称';
COMMENT ON COLUMN sys_user.user_type IS '用户类型（00系统用户）';
COMMENT ON COLUMN sys_user.email IS '用户邮箱';
COMMENT ON COLUMN sys_user.phonenumber IS '手机号码';
COMMENT ON COLUMN sys_user.sex IS '用户性别（0男 1女 2未知）';
COMMENT ON COLUMN sys_user.avatar IS '头像地址';
COMMENT ON COLUMN sys_user.password IS '密码';
COMMENT ON COLUMN sys_user.status IS '账号状态（0正常 1停用）';
COMMENT ON COLUMN sys_user.del_flag IS '删除标志（0代表存在 2代表删除）';
COMMENT ON COLUMN sys_user.login_ip IS '最后登录IP';
COMMENT ON COLUMN sys_user.login_date IS '最后登录时间';
COMMENT ON COLUMN sys_user.pwd_update_date IS '密码最后更新时间';
COMMENT ON COLUMN sys_user.create_by IS '创建者';
COMMENT ON COLUMN sys_user.create_time IS '创建时间';
COMMENT ON COLUMN sys_user.update_by IS '更新者';
COMMENT ON COLUMN sys_user.update_time IS '更新时间';
COMMENT ON COLUMN sys_user.remark IS '备注';

-- ----------------------------
-- 初始化-用户信息表数据
-- ----------------------------
INSERT INTO sys_user (user_id, dept_id, user_name, nick_name, user_type, email, phonenumber, sex, avatar, password, status, del_flag, login_ip, login_date, pwd_update_date, create_by, create_time, remark) 
OVERRIDING SYSTEM VALUE VALUES
(1,  103, 'admin', '若依', '00', 'ry@163.com', '15888888888', '1', '', '$2a$10$7JB720yubVSZvUI0rEqK/.VqGOZTH.ulu33dHOiBE8ByOhJIrdAu2', '0', '0', '127.0.0.1', NOW(), NOW(), 'admin', NOW(), '管理员'),
(2,  105, 'ry',    '若依', '00', 'ry@qq.com',  '15666666666', '1', '', '$2a$10$7JB720yubVSZvUI0rEqK/.VqGOZTH.ulu33dHOiBE8ByOhJIrdAu2', '0', '0', '127.0.0.1', NOW(), NOW(), 'admin', NOW(), '测试员');


-- ----------------------------
-- 3、岗位信息表
-- ----------------------------
DROP TABLE IF EXISTS sys_post CASCADE;
CREATE TABLE sys_post (
  post_id       BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  post_code     VARCHAR(64)     NOT NULL,
  post_name     VARCHAR(50)     NOT NULL,
  post_sort     INTEGER         NOT NULL,
  status        CHAR(1)         NOT NULL,
  create_by     VARCHAR(64)     DEFAULT '',
  create_time   TIMESTAMP,
  update_by     VARCHAR(64)     DEFAULT '',
  update_time   TIMESTAMP,
  remark        VARCHAR(500)
);

COMMENT ON TABLE sys_post IS '岗位信息表';
COMMENT ON COLUMN sys_post.post_id IS '岗位ID';
COMMENT ON COLUMN sys_post.post_code IS '岗位编码';
COMMENT ON COLUMN sys_post.post_name IS '岗位名称';
COMMENT ON COLUMN sys_post.post_sort IS '显示顺序';
COMMENT ON COLUMN sys_post.status IS '状态（0正常 1停用）';
COMMENT ON COLUMN sys_post.create_by IS '创建者';
COMMENT ON COLUMN sys_post.create_time IS '创建时间';
COMMENT ON COLUMN sys_post.update_by IS '更新者';
COMMENT ON COLUMN sys_post.update_time IS '更新时间';
COMMENT ON COLUMN sys_post.remark IS '备注';

-- ----------------------------
-- 初始化-岗位信息表数据
-- ----------------------------
INSERT INTO sys_post (post_id, post_code, post_name, post_sort, status, create_by, create_time) 
OVERRIDING SYSTEM VALUE VALUES
(1, 'ceo',  '董事长',    1, '0', 'admin', NOW()),
(2, 'se',   '项目经理',  2, '0', 'admin', NOW()),
(3, 'hr',   '人力资源',  3, '0', 'admin', NOW()),
(4, 'user', '普通员工',  4, '0', 'admin', NOW());


-- ----------------------------
-- 4、角色信息表
-- ----------------------------
DROP TABLE IF EXISTS sys_role CASCADE;
CREATE TABLE sys_role (
  role_id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  role_name            VARCHAR(30)     NOT NULL,
  role_key             VARCHAR(100)    NOT NULL,
  role_sort            INTEGER         NOT NULL,
  data_scope           CHAR(1)         DEFAULT '1',
  menu_check_strictly  BOOLEAN         DEFAULT TRUE,
  dept_check_strictly  BOOLEAN         DEFAULT TRUE,
  status               CHAR(1)         NOT NULL,
  del_flag             CHAR(1)         DEFAULT '0',
  create_by            VARCHAR(64)     DEFAULT '',
  create_time          TIMESTAMP,
  update_by            VARCHAR(64)     DEFAULT '',
  update_time          TIMESTAMP,
  remark               VARCHAR(500)
);

COMMENT ON TABLE sys_role IS '角色信息表';
COMMENT ON COLUMN sys_role.role_id IS '角色ID';
COMMENT ON COLUMN sys_role.role_name IS '角色名称';
COMMENT ON COLUMN sys_role.role_key IS '角色权限字符串';
COMMENT ON COLUMN sys_role.role_sort IS '显示顺序';
COMMENT ON COLUMN sys_role.data_scope IS '数据范围（1：全部数据权限 2：自定数据权限 3：本部门数据权限 4：本部门及以下数据权限）';
COMMENT ON COLUMN sys_role.menu_check_strictly IS '菜单树选择项是否关联显示';
COMMENT ON COLUMN sys_role.dept_check_strictly IS '部门树选择项是否关联显示';
COMMENT ON COLUMN sys_role.status IS '角色状态（0正常 1停用）';
COMMENT ON COLUMN sys_role.del_flag IS '删除标志（0代表存在 2代表删除）';
COMMENT ON COLUMN sys_role.create_by IS '创建者';
COMMENT ON COLUMN sys_role.create_time IS '创建时间';
COMMENT ON COLUMN sys_role.update_by IS '更新者';
COMMENT ON COLUMN sys_role.update_time IS '更新时间';
COMMENT ON COLUMN sys_role.remark IS '备注';

-- ----------------------------
-- 初始化-角色信息表数据
-- ----------------------------
INSERT INTO sys_role (role_id, role_name, role_key, role_sort, data_scope, menu_check_strictly, dept_check_strictly, status, del_flag, create_by, create_time, remark) 
OVERRIDING SYSTEM VALUE VALUES
('1', '超级管理员',  'admin',  1, '1', TRUE, TRUE, '0', '0', 'admin', NOW(), '超级管理员'),
('2', '普通角色',    'common', 2, '2', TRUE, TRUE, '0', '0', 'admin', NOW(), '普通角色');


-- ----------------------------
-- 5、菜单权限表
-- ----------------------------
DROP TABLE IF EXISTS sys_menu CASCADE;
CREATE TABLE sys_menu (
  menu_id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  menu_name         VARCHAR(50)     NOT NULL,
  parent_id         BIGINT          DEFAULT 0,
  order_num         INTEGER         DEFAULT 0,
  path              VARCHAR(200)    DEFAULT '',
  component         VARCHAR(255),
  query             VARCHAR(255),
  route_name        VARCHAR(50)     DEFAULT '',
  is_frame          INTEGER         DEFAULT 1,
  is_cache          INTEGER         DEFAULT 0,
  menu_type         CHAR(1)         DEFAULT '',
  visible           CHAR(1)         DEFAULT '0',
  status            CHAR(1)         DEFAULT '0',
  perms             VARCHAR(100),
  icon              VARCHAR(100)    DEFAULT '#',
  create_by         VARCHAR(64)     DEFAULT '',
  create_time       TIMESTAMP,
  update_by         VARCHAR(64)     DEFAULT '',
  update_time       TIMESTAMP,
  remark            VARCHAR(500)    DEFAULT ''
);

COMMENT ON TABLE sys_menu IS '菜单权限表';
COMMENT ON COLUMN sys_menu.menu_id IS '菜单ID';
COMMENT ON COLUMN sys_menu.menu_name IS '菜单名称';
COMMENT ON COLUMN sys_menu.parent_id IS '父菜单ID';
COMMENT ON COLUMN sys_menu.order_num IS '显示顺序';
COMMENT ON COLUMN sys_menu.path IS '路由地址';
COMMENT ON COLUMN sys_menu.component IS '组件路径';
COMMENT ON COLUMN sys_menu.query IS '路由参数';
COMMENT ON COLUMN sys_menu.route_name IS '路由名称';
COMMENT ON COLUMN sys_menu.is_frame IS '是否为外链（0是 1否）';
COMMENT ON COLUMN sys_menu.is_cache IS '是否缓存（0缓存 1不缓存）';
COMMENT ON COLUMN sys_menu.menu_type IS '菜单类型（M目录 C菜单 F按钮）';
COMMENT ON COLUMN sys_menu.visible IS '菜单状态（0显示 1隐藏）';
COMMENT ON COLUMN sys_menu.status IS '菜单状态（0正常 1停用）';
COMMENT ON COLUMN sys_menu.perms IS '权限标识';
COMMENT ON COLUMN sys_menu.icon IS '菜单图标';
COMMENT ON COLUMN sys_menu.create_by IS '创建者';
COMMENT ON COLUMN sys_menu.create_time IS '创建时间';
COMMENT ON COLUMN sys_menu.update_by IS '更新者';
COMMENT ON COLUMN sys_menu.update_time IS '更新时间';
COMMENT ON COLUMN sys_menu.remark IS '备注';

-- ----------------------------
-- 初始化-菜单信息表数据
-- ----------------------------
-- 一级菜单
INSERT INTO sys_menu (menu_id, menu_name, parent_id, order_num, path, component, query, route_name, is_frame, is_cache, menu_type, visible, status, perms, icon, create_by, create_time, remark) 
OVERRIDING SYSTEM VALUE VALUES
('1', '系统管理', '0', '1', 'system',           NULL, '', '', 1, 0, 'M', '0', '0', '', 'system',   'admin', NOW(), '系统管理目录'),
('2', '系统监控', '0', '2', 'monitor',          NULL, '', '', 1, 0, 'M', '0', '0', '', 'monitor',  'admin', NOW(), '系统监控目录'),
('3', '系统工具', '0', '3', 'tool',             NULL, '', '', 1, 0, 'M', '0', '0', '', 'tool',     'admin', NOW(), '系统工具目录'),
('4', '若依官网', '0', '4', 'http://ruoyi.vip', NULL, '', '', 0, 0, 'M', '0', '0', '', 'guide',    'admin', NOW(), '若依官网地址');

-- 二级菜单
INSERT INTO sys_menu (menu_id, menu_name, parent_id, order_num, path, component, query, route_name, is_frame, is_cache, menu_type, visible, status, perms, icon, create_by, create_time, remark) 
OVERRIDING SYSTEM VALUE VALUES
('100',  '用户管理', '1',   '1', 'user',       'system/user/index',        '', '', 1, 0, 'C', '0', '0', 'system:user:list',        'user',          'admin', NOW(), '用户管理菜单'),
('101',  '角色管理', '1',   '2', 'role',       'system/role/index',        '', '', 1, 0, 'C', '0', '0', 'system:role:list',        'peoples',       'admin', NOW(), '角色管理菜单'),
('102',  '菜单管理', '1',   '3', 'menu',       'system/menu/index',        '', '', 1, 0, 'C', '0', '0', 'system:menu:list',        'tree-table',    'admin', NOW(), '菜单管理菜单'),
('103',  '部门管理', '1',   '4', 'dept',       'system/dept/index',        '', '', 1, 0, 'C', '0', '0', 'system:dept:list',        'tree',          'admin', NOW(), '部门管理菜单'),
('104',  '岗位管理', '1',   '5', 'post',       'system/post/index',        '', '', 1, 0, 'C', '0', '0', 'system:post:list',        'post',          'admin', NOW(), '岗位管理菜单'),
('105',  '字典管理', '1',   '6', 'dict',       'system/dict/index',        '', '', 1, 0, 'C', '0', '0', 'system:dict:list',        'dict',          'admin', NOW(), '字典管理菜单'),
('106',  '参数设置', '1',   '7', 'config',     'system/config/index',      '', '', 1, 0, 'C', '0', '0', 'system:config:list',      'edit',          'admin', NOW(), '参数设置菜单'),
('107',  '通知公告', '1',   '8', 'notice',     'system/notice/index',      '', '', 1, 0, 'C', '0', '0', 'system:notice:list',      'message',       'admin', NOW(), '通知公告菜单'),
('108',  '日志管理', '1',   '9', 'log',        '',                         '', '', 1, 0, 'M', '0', '0', '',                        'log',           'admin', NOW(), '日志管理菜单'),
('109',  '在线用户', '2',   '1', 'online',     'monitor/online/index',     '', '', 1, 0, 'C', '0', '0', 'monitor:online:list',     'online',        'admin', NOW(), '在线用户菜单'),
('110',  '定时任务', '2',   '2', 'job',        'monitor/job/index',        '', '', 1, 0, 'C', '0', '0', 'monitor:job:list',        'job',           'admin', NOW(), '定时任务菜单'),
('111',  '数据监控', '2',   '3', 'druid',      'monitor/druid/index',      '', '', 1, 0, 'C', '0', '0', 'monitor:druid:list',      'druid',         'admin', NOW(), '数据监控菜单'),
('112',  '服务监控', '2',   '4', 'server',     'monitor/server/index',     '', '', 1, 0, 'C', '0', '0', 'monitor:server:list',     'server',        'admin', NOW(), '服务监控菜单'),
('113',  '缓存监控', '2',   '5', 'cache',      'monitor/cache/index',      '', '', 1, 0, 'C', '0', '0', 'monitor:cache:list',      'redis',         'admin', NOW(), '缓存监控菜单'),
('114',  '缓存列表', '2',   '6', 'cacheList',  'monitor/cache/list',       '', '', 1, 0, 'C', '0', '0', 'monitor:cache:list',      'redis-list',    'admin', NOW(), '缓存列表菜单'),
('115',  '表单构建', '3',   '1', 'build',      'tool/build/index',         '', '', 1, 0, 'C', '0', '0', 'tool:build:list',         'build',         'admin', NOW(), '表单构建菜单'),
('116',  '代码生成', '3',   '2', 'gen',        'tool/gen/index',           '', '', 1, 0, 'C', '0', '0', 'tool:gen:list',           'code',          'admin', NOW(), '代码生成菜单'),
('117',  '系统接口', '3',   '3', 'swagger',    'tool/swagger/index',       '', '', 1, 0, 'C', '0', '0', 'tool:swagger:list',       'swagger',       'admin', NOW(), '系统接口菜单');

-- 三级菜单
INSERT INTO sys_menu (menu_id, menu_name, parent_id, order_num, path, component, query, route_name, is_frame, is_cache, menu_type, visible, status, perms, icon, create_by, create_time, remark) 
OVERRIDING SYSTEM VALUE VALUES
('500',  '操作日志', '108', '1', 'operlog',    'monitor/operlog/index',    '', '', 1, 0, 'C', '0', '0', 'monitor:operlog:list',    'form',          'admin', NOW(), '操作日志菜单'),
('501',  '登录日志', '108', '2', 'logininfor', 'monitor/logininfor/index', '', '', 1, 0, 'C', '0', '0', 'monitor:logininfor:list', 'logininfor',    'admin', NOW(), '登录日志菜单');

-- 用户管理按钮
INSERT INTO sys_menu (menu_id, menu_name, parent_id, order_num, path, component, query, route_name, is_frame, is_cache, menu_type, visible, status, perms, icon, create_by, create_time, remark) 
OVERRIDING SYSTEM VALUE VALUES
('1000', '用户查询', '100', '1',  '', '', '', '', 1, 0, 'F', '0', '0', 'system:user:query',          '#', 'admin', NOW(), ''),
('1001', '用户新增', '100', '2',  '', '', '', '', 1, 0, 'F', '0', '0', 'system:user:add',            '#', 'admin', NOW(), ''),
('1002', '用户修改', '100', '3',  '', '', '', '', 1, 0, 'F', '0', '0', 'system:user:edit',           '#', 'admin', NOW(), ''),
('1003', '用户删除', '100', '4',  '', '', '', '', 1, 0, 'F', '0', '0', 'system:user:remove',         '#', 'admin', NOW(), ''),
('1004', '用户导出', '100', '5',  '', '', '', '', 1, 0, 'F', '0', '0', 'system:user:export',         '#', 'admin', NOW(), ''),
('1005', '用户导入', '100', '6',  '', '', '', '', 1, 0, 'F', '0', '0', 'system:user:import',         '#', 'admin', NOW(), ''),
('1006', '重置密码', '100', '7',  '', '', '', '', 1, 0, 'F', '0', '0', 'system:user:resetPwd',       '#', 'admin', NOW(), '');

-- 角色管理按钮
INSERT INTO sys_menu (menu_id, menu_name, parent_id, order_num, path, component, query, route_name, is_frame, is_cache, menu_type, visible, status, perms, icon, create_by, create_time, remark) 
OVERRIDING SYSTEM VALUE VALUES
('1007', '角色查询', '101', '1',  '', '', '', '', 1, 0, 'F', '0', '0', 'system:role:query',          '#', 'admin', NOW(), ''),
('1008', '角色新增', '101', '2',  '', '', '', '', 1, 0, 'F', '0', '0', 'system:role:add',            '#', 'admin', NOW(), ''),
('1009', '角色修改', '101', '3',  '', '', '', '', 1, 0, 'F', '0', '0', 'system:role:edit',           '#', 'admin', NOW(), ''),
('1010', '角色删除', '101', '4',  '', '', '', '', 1, 0, 'F', '0', '0', 'system:role:remove',         '#', 'admin', NOW(), ''),
('1011', '角色导出', '101', '5',  '', '', '', '', 1, 0, 'F', '0', '0', 'system:role:export',         '#', 'admin', NOW(), '');

-- 菜单管理按钮
INSERT INTO sys_menu (menu_id, menu_name, parent_id, order_num, path, component, query, route_name, is_frame, is_cache, menu_type, visible, status, perms, icon, create_by, create_time, remark) 
OVERRIDING SYSTEM VALUE VALUES
('1012', '菜单查询', '102', '1',  '', '', '', '', 1, 0, 'F', '0', '0', 'system:menu:query',          '#', 'admin', NOW(), ''),
('1013', '菜单新增', '102', '2',  '', '', '', '', 1, 0, 'F', '0', '0', 'system:menu:add',            '#', 'admin', NOW(), ''),
('1014', '菜单修改', '102', '3',  '', '', '', '', 1, 0, 'F', '0', '0', 'system:menu:edit',           '#', 'admin', NOW(), ''),
('1015', '菜单删除', '102', '4',  '', '', '', '', 1, 0, 'F', '0', '0', 'system:menu:remove',         '#', 'admin', NOW(), '');

-- 部门管理按钮
INSERT INTO sys_menu (menu_id, menu_name, parent_id, order_num, path, component, query, route_name, is_frame, is_cache, menu_type, visible, status, perms, icon, create_by, create_time, remark) 
OVERRIDING SYSTEM VALUE VALUES
('1016', '部门查询', '103', '1',  '', '', '', '', 1, 0, 'F', '0', '0', 'system:dept:query',          '#', 'admin', NOW(), ''),
('1017', '部门新增', '103', '2',  '', '', '', '', 1, 0, 'F', '0', '0', 'system:dept:add',            '#', 'admin', NOW(), ''),
('1018', '部门修改', '103', '3',  '', '', '', '', 1, 0, 'F', '0', '0', 'system:dept:edit',           '#', 'admin', NOW(), ''),
('1019', '部门删除', '103', '4',  '', '', '', '', 1, 0, 'F', '0', '0', 'system:dept:remove',         '#', 'admin', NOW(), '');

-- 岗位管理按钮
INSERT INTO sys_menu (menu_id, menu_name, parent_id, order_num, path, component, query, route_name, is_frame, is_cache, menu_type, visible, status, perms, icon, create_by, create_time, remark) 
OVERRIDING SYSTEM VALUE VALUES
('1020', '岗位查询', '104', '1',  '', '', '', '', 1, 0, 'F', '0', '0', 'system:post:query',          '#', 'admin', NOW(), ''),
('1021', '岗位新增', '104', '2',  '', '', '', '', 1, 0, 'F', '0', '0', 'system:post:add',            '#', 'admin', NOW(), ''),
('1022', '岗位修改', '104', '3',  '', '', '', '', 1, 0, 'F', '0', '0', 'system:post:edit',           '#', 'admin', NOW(), ''),
('1023', '岗位删除', '104', '4',  '', '', '', '', 1, 0, 'F', '0', '0', 'system:post:remove',         '#', 'admin', NOW(), ''),
('1024', '岗位导出', '104', '5',  '', '', '', '', 1, 0, 'F', '0', '0', 'system:post:export',         '#', 'admin', NOW(), '');

-- 字典管理按钮
INSERT INTO sys_menu (menu_id, menu_name, parent_id, order_num, path, component, query, route_name, is_frame, is_cache, menu_type, visible, status, perms, icon, create_by, create_time, remark) 
OVERRIDING SYSTEM VALUE VALUES
('1025', '字典查询', '105', '1', '#', '', '', '', 1, 0, 'F', '0', '0', 'system:dict:query',          '#', 'admin', NOW(), ''),
('1026', '字典新增', '105', '2', '#', '', '', '', 1, 0, 'F', '0', '0', 'system:dict:add',            '#', 'admin', NOW(), ''),
('1027', '字典修改', '105', '3', '#', '', '', '', 1, 0, 'F', '0', '0', 'system:dict:edit',           '#', 'admin', NOW(), ''),
('1028', '字典删除', '105', '4', '#', '', '', '', 1, 0, 'F', '0', '0', 'system:dict:remove',         '#', 'admin', NOW(), ''),
('1029', '字典导出', '105', '5', '#', '', '', '', 1, 0, 'F', '0', '0', 'system:dict:export',         '#', 'admin', NOW(), '');

-- 参数设置按钮
INSERT INTO sys_menu (menu_id, menu_name, parent_id, order_num, path, component, query, route_name, is_frame, is_cache, menu_type, visible, status, perms, icon, create_by, create_time, remark) 
OVERRIDING SYSTEM VALUE VALUES
('1030', '参数查询', '106', '1', '#', '', '', '', 1, 0, 'F', '0', '0', 'system:config:query',        '#', 'admin', NOW(), ''),
('1031', '参数新增', '106', '2', '#', '', '', '', 1, 0, 'F', '0', '0', 'system:config:add',          '#', 'admin', NOW(), ''),
('1032', '参数修改', '106', '3', '#', '', '', '', 1, 0, 'F', '0', '0', 'system:config:edit',         '#', 'admin', NOW(), ''),
('1033', '参数删除', '106', '4', '#', '', '', '', 1, 0, 'F', '0', '0', 'system:config:remove',       '#', 'admin', NOW(), ''),
('1034', '参数导出', '106', '5', '#', '', '', '', 1, 0, 'F', '0', '0', 'system:config:export',       '#', 'admin', NOW(), '');

-- 通知公告按钮
INSERT INTO sys_menu (menu_id, menu_name, parent_id, order_num, path, component, query, route_name, is_frame, is_cache, menu_type, visible, status, perms, icon, create_by, create_time, remark) 
OVERRIDING SYSTEM VALUE VALUES
('1035', '公告查询', '107', '1', '#', '', '', '', 1, 0, 'F', '0', '0', 'system:notice:query',        '#', 'admin', NOW(), ''),
('1036', '公告新增', '107', '2', '#', '', '', '', 1, 0, 'F', '0', '0', 'system:notice:add',          '#', 'admin', NOW(), ''),
('1037', '公告修改', '107', '3', '#', '', '', '', 1, 0, 'F', '0', '0', 'system:notice:edit',         '#', 'admin', NOW(), ''),
('1038', '公告删除', '107', '4', '#', '', '', '', 1, 0, 'F', '0', '0', 'system:notice:remove',       '#', 'admin', NOW(), '');

-- 操作日志按钮
INSERT INTO sys_menu (menu_id, menu_name, parent_id, order_num, path, component, query, route_name, is_frame, is_cache, menu_type, visible, status, perms, icon, create_by, create_time, remark) 
OVERRIDING SYSTEM VALUE VALUES
('1039', '操作查询', '500', '1', '#', '', '', '', 1, 0, 'F', '0', '0', 'monitor:operlog:query',      '#', 'admin', NOW(), ''),
('1040', '操作删除', '500', '2', '#', '', '', '', 1, 0, 'F', '0', '0', 'monitor:operlog:remove',     '#', 'admin', NOW(), ''),
('1041', '日志导出', '500', '3', '#', '', '', '', 1, 0, 'F', '0', '0', 'monitor:operlog:export',     '#', 'admin', NOW(), '');

-- 登录日志按钮
INSERT INTO sys_menu (menu_id, menu_name, parent_id, order_num, path, component, query, route_name, is_frame, is_cache, menu_type, visible, status, perms, icon, create_by, create_time, remark) 
OVERRIDING SYSTEM VALUE VALUES
('1042', '登录查询', '501', '1', '#', '', '', '', 1, 0, 'F', '0', '0', 'monitor:logininfor:query',   '#', 'admin', NOW(), ''),
('1043', '登录删除', '501', '2', '#', '', '', '', 1, 0, 'F', '0', '0', 'monitor:logininfor:remove',  '#', 'admin', NOW(), ''),
('1044', '日志导出', '501', '3', '#', '', '', '', 1, 0, 'F', '0', '0', 'monitor:logininfor:export',  '#', 'admin', NOW(), ''),
('1045', '账户解锁', '501', '4', '#', '', '', '', 1, 0, 'F', '0', '0', 'monitor:logininfor:unlock',  '#', 'admin', NOW(), '');

-- 在线用户按钮
INSERT INTO sys_menu (menu_id, menu_name, parent_id, order_num, path, component, query, route_name, is_frame, is_cache, menu_type, visible, status, perms, icon, create_by, create_time, remark) 
OVERRIDING SYSTEM VALUE VALUES
('1046', '在线查询', '109', '1', '#', '', '', '', 1, 0, 'F', '0', '0', 'monitor:online:query',       '#', 'admin', NOW(), ''),
('1047', '批量强退', '109', '2', '#', '', '', '', 1, 0, 'F', '0', '0', 'monitor:online:batchLogout', '#', 'admin', NOW(), ''),
('1048', '单条强退', '109', '3', '#', '', '', '', 1, 0, 'F', '0', '0', 'monitor:online:forceLogout', '#', 'admin', NOW(), '');

-- 定时任务按钮
INSERT INTO sys_menu (menu_id, menu_name, parent_id, order_num, path, component, query, route_name, is_frame, is_cache, menu_type, visible, status, perms, icon, create_by, create_time, remark) 
OVERRIDING SYSTEM VALUE VALUES
('1049', '任务查询', '110', '1', '#', '', '', '', 1, 0, 'F', '0', '0', 'monitor:job:query',          '#', 'admin', NOW(), ''),
('1050', '任务新增', '110', '2', '#', '', '', '', 1, 0, 'F', '0', '0', 'monitor:job:add',            '#', 'admin', NOW(), ''),
('1051', '任务修改', '110', '3', '#', '', '', '', 1, 0, 'F', '0', '0', 'monitor:job:edit',           '#', 'admin', NOW(), ''),
('1052', '任务删除', '110', '4', '#', '', '', '', 1, 0, 'F', '0', '0', 'monitor:job:remove',         '#', 'admin', NOW(), ''),
('1053', '状态修改', '110', '5', '#', '', '', '', 1, 0, 'F', '0', '0', 'monitor:job:changeStatus',   '#', 'admin', NOW(), ''),
('1054', '任务导出', '110', '6', '#', '', '', '', 1, 0, 'F', '0', '0', 'monitor:job:export',         '#', 'admin', NOW(), '');

-- 代码生成按钮
INSERT INTO sys_menu (menu_id, menu_name, parent_id, order_num, path, component, query, route_name, is_frame, is_cache, menu_type, visible, status, perms, icon, create_by, create_time, remark) 
OVERRIDING SYSTEM VALUE VALUES
('1055', '生成查询', '116', '1', '#', '', '', '', 1, 0, 'F', '0', '0', 'tool:gen:query',             '#', 'admin', NOW(), ''),
('1056', '生成修改', '116', '2', '#', '', '', '', 1, 0, 'F', '0', '0', 'tool:gen:edit',              '#', 'admin', NOW(), ''),
('1057', '生成删除', '116', '3', '#', '', '', '', 1, 0, 'F', '0', '0', 'tool:gen:remove',            '#', 'admin', NOW(), ''),
('1058', '导入代码', '116', '4', '#', '', '', '', 1, 0, 'F', '0', '0', 'tool:gen:import',            '#', 'admin', NOW(), ''),
('1059', '预览代码', '116', '5', '#', '', '', '', 1, 0, 'F', '0', '0', 'tool:gen:preview',           '#', 'admin', NOW(), ''),
('1060', '生成代码', '116', '6', '#', '', '', '', 1, 0, 'F', '0', '0', 'tool:gen:code',              '#', 'admin', NOW(), '');


-- ----------------------------
-- 6、用户和角色关联表
-- ----------------------------
DROP TABLE IF EXISTS sys_user_role CASCADE;
CREATE TABLE sys_user_role (
  user_id   BIGINT NOT NULL,
  role_id   BIGINT NOT NULL,
  PRIMARY KEY(user_id, role_id)
);

COMMENT ON TABLE sys_user_role IS '用户和角色关联表';
COMMENT ON COLUMN sys_user_role.user_id IS '用户ID';
COMMENT ON COLUMN sys_user_role.role_id IS '角色ID';

-- ----------------------------
-- 初始化-用户和角色关联表数据
-- ----------------------------
INSERT INTO sys_user_role VALUES ('1', '1'), ('2', '2');


-- ----------------------------
-- 7、角色和菜单关联表
-- ----------------------------
DROP TABLE IF EXISTS sys_role_menu CASCADE;
CREATE TABLE sys_role_menu (
  role_id   BIGINT NOT NULL,
  menu_id   BIGINT NOT NULL,
  PRIMARY KEY(role_id, menu_id)
);

COMMENT ON TABLE sys_role_menu IS '角色和菜单关联表';
COMMENT ON COLUMN sys_role_menu.role_id IS '角色ID';
COMMENT ON COLUMN sys_role_menu.menu_id IS '菜单ID';

-- ----------------------------
-- 初始化-角色和菜单关联表数据
-- ----------------------------
INSERT INTO sys_role_menu VALUES 
('2', '1'), ('2', '2'), ('2', '3'), ('2', '4'), ('2', '100'), ('2', '101'), ('2', '102'), ('2', '103'), ('2', '104'),
('2', '105'), ('2', '106'), ('2', '107'), ('2', '108'), ('2', '109'), ('2', '110'), ('2', '111'), ('2', '112'), ('2', '113'),
('2', '114'), ('2', '115'), ('2', '116'), ('2', '117'), ('2', '500'), ('2', '501'),
('2', '1000'), ('2', '1001'), ('2', '1002'), ('2', '1003'), ('2', '1004'), ('2', '1005'), ('2', '1006'),
('2', '1007'), ('2', '1008'), ('2', '1009'), ('2', '1010'), ('2', '1011'),
('2', '1012'), ('2', '1013'), ('2', '1014'), ('2', '1015'),
('2', '1016'), ('2', '1017'), ('2', '1018'), ('2', '1019'),
('2', '1020'), ('2', '1021'), ('2', '1022'), ('2', '1023'), ('2', '1024'),
('2', '1025'), ('2', '1026'), ('2', '1027'), ('2', '1028'), ('2', '1029'),
('2', '1030'), ('2', '1031'), ('2', '1032'), ('2', '1033'), ('2', '1034'),
('2', '1035'), ('2', '1036'), ('2', '1037'), ('2', '1038'),
('2', '1039'), ('2', '1040'), ('2', '1041'),
('2', '1042'), ('2', '1043'), ('2', '1044'), ('2', '1045'),
('2', '1046'), ('2', '1047'), ('2', '1048'),
('2', '1049'), ('2', '1050'), ('2', '1051'), ('2', '1052'), ('2', '1053'), ('2', '1054'),
('2', '1055'), ('2', '1056'), ('2', '1057'), ('2', '1058'), ('2', '1059'), ('2', '1060');


-- ----------------------------
-- 8、角色和部门关联表
-- ----------------------------
DROP TABLE IF EXISTS sys_role_dept CASCADE;
CREATE TABLE sys_role_dept (
  role_id   BIGINT NOT NULL,
  dept_id   BIGINT NOT NULL,
  PRIMARY KEY(role_id, dept_id)
);

COMMENT ON TABLE sys_role_dept IS '角色和部门关联表';
COMMENT ON COLUMN sys_role_dept.role_id IS '角色ID';
COMMENT ON COLUMN sys_role_dept.dept_id IS '部门ID';

-- ----------------------------
-- 初始化-角色和部门关联表数据
-- ----------------------------
INSERT INTO sys_role_dept VALUES ('2', '100'), ('2', '101'), ('2', '105');


-- ----------------------------
-- 9、用户与岗位关联表
-- ----------------------------
DROP TABLE IF EXISTS sys_user_post CASCADE;
CREATE TABLE sys_user_post (
  user_id   BIGINT NOT NULL,
  post_id   BIGINT NOT NULL,
  PRIMARY KEY (user_id, post_id)
);

COMMENT ON TABLE sys_user_post IS '用户与岗位关联表';
COMMENT ON COLUMN sys_user_post.user_id IS '用户ID';
COMMENT ON COLUMN sys_user_post.post_id IS '岗位ID';

-- ----------------------------
-- 初始化-用户与岗位关联表数据
-- ----------------------------
INSERT INTO sys_user_post VALUES ('1', '1'), ('2', '2');


-- ----------------------------
-- 10、操作日志记录
-- ----------------------------
DROP TABLE IF EXISTS sys_oper_log CASCADE;
CREATE TABLE sys_oper_log (
  oper_id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title             VARCHAR(50)     DEFAULT '',
  business_type     INTEGER         DEFAULT 0,
  method            VARCHAR(200)    DEFAULT '',
  request_method    VARCHAR(10)     DEFAULT '',
  operator_type     INTEGER         DEFAULT 0,
  oper_name         VARCHAR(50)     DEFAULT '',
  dept_name         VARCHAR(50)     DEFAULT '',
  oper_url          VARCHAR(255)    DEFAULT '',
  oper_ip           VARCHAR(128)    DEFAULT '',
  oper_location     VARCHAR(255)    DEFAULT '',
  oper_param        VARCHAR(2000)   DEFAULT '',
  json_result       VARCHAR(2000)   DEFAULT '',
  status            INTEGER         DEFAULT 0,
  error_msg         VARCHAR(2000)   DEFAULT '',
  oper_time         TIMESTAMP,
  cost_time         BIGINT          DEFAULT 0
);

COMMENT ON TABLE sys_oper_log IS '操作日志记录';
COMMENT ON COLUMN sys_oper_log.oper_id IS '日志主键';
COMMENT ON COLUMN sys_oper_log.title IS '模块标题';
COMMENT ON COLUMN sys_oper_log.business_type IS '业务类型（0其它 1新增 2修改 3删除）';
COMMENT ON COLUMN sys_oper_log.method IS '方法名称';
COMMENT ON COLUMN sys_oper_log.request_method IS '请求方式';
COMMENT ON COLUMN sys_oper_log.operator_type IS '操作类别（0其它 1后台用户 2手机端用户）';
COMMENT ON COLUMN sys_oper_log.oper_name IS '操作人员';
COMMENT ON COLUMN sys_oper_log.dept_name IS '部门名称';
COMMENT ON COLUMN sys_oper_log.oper_url IS '请求URL';
COMMENT ON COLUMN sys_oper_log.oper_ip IS '主机地址';
COMMENT ON COLUMN sys_oper_log.oper_location IS '操作地点';
COMMENT ON COLUMN sys_oper_log.oper_param IS '请求参数';
COMMENT ON COLUMN sys_oper_log.json_result IS '返回参数';
COMMENT ON COLUMN sys_oper_log.status IS '操作状态（0正常 1异常）';
COMMENT ON COLUMN sys_oper_log.error_msg IS '错误消息';
COMMENT ON COLUMN sys_oper_log.oper_time IS '操作时间';
COMMENT ON COLUMN sys_oper_log.cost_time IS '消耗时间';

CREATE INDEX idx_sys_oper_log_bt ON sys_oper_log(business_type);
CREATE INDEX idx_sys_oper_log_s ON sys_oper_log(status);
CREATE INDEX idx_sys_oper_log_ot ON sys_oper_log(oper_time);


-- ----------------------------
-- 11、字典类型表
-- ----------------------------
DROP TABLE IF EXISTS sys_dict_type CASCADE;
CREATE TABLE sys_dict_type (
  dict_id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  dict_name        VARCHAR(100)    DEFAULT '',
  dict_type        VARCHAR(100)    DEFAULT '',
  status           CHAR(1)         DEFAULT '0',
  create_by        VARCHAR(64)     DEFAULT '',
  create_time      TIMESTAMP,
  update_by        VARCHAR(64)     DEFAULT '',
  update_time      TIMESTAMP,
  remark           VARCHAR(500)
);

COMMENT ON TABLE sys_dict_type IS '字典类型表';
COMMENT ON COLUMN sys_dict_type.dict_id IS '字典主键';
COMMENT ON COLUMN sys_dict_type.dict_name IS '字典名称';
COMMENT ON COLUMN sys_dict_type.dict_type IS '字典类型';
COMMENT ON COLUMN sys_dict_type.status IS '状态（0正常 1停用）';
COMMENT ON COLUMN sys_dict_type.create_by IS '创建者';
COMMENT ON COLUMN sys_dict_type.create_time IS '创建时间';
COMMENT ON COLUMN sys_dict_type.update_by IS '更新者';
COMMENT ON COLUMN sys_dict_type.update_time IS '更新时间';
COMMENT ON COLUMN sys_dict_type.remark IS '备注';

CREATE UNIQUE INDEX idx_sys_dict_type_dt ON sys_dict_type(dict_type);

INSERT INTO sys_dict_type (dict_id, dict_name, dict_type, status, create_by, create_time, remark) 
OVERRIDING SYSTEM VALUE VALUES
(1,  '用户性别', 'sys_user_sex',        '0', 'admin', NOW(), '用户性别列表'),
(2,  '菜单状态', 'sys_show_hide',       '0', 'admin', NOW(), '菜单状态列表'),
(3,  '系统开关', 'sys_normal_disable',  '0', 'admin', NOW(), '系统开关列表'),
(4,  '任务状态', 'sys_job_status',      '0', 'admin', NOW(), '任务状态列表'),
(5,  '任务分组', 'sys_job_group',       '0', 'admin', NOW(), '任务分组列表'),
(6,  '系统是否', 'sys_yes_no',          '0', 'admin', NOW(), '系统是否列表'),
(7,  '通知类型', 'sys_notice_type',     '0', 'admin', NOW(), '通知类型列表'),
(8,  '通知状态', 'sys_notice_status',   '0', 'admin', NOW(), '通知状态列表'),
(9,  '操作类型', 'sys_oper_type',       '0', 'admin', NOW(), '操作类型列表'),
(10, '系统状态', 'sys_common_status',   '0', 'admin', NOW(), '登录状态列表');


-- ----------------------------
-- 12、字典数据表
-- ----------------------------
DROP TABLE IF EXISTS sys_dict_data CASCADE;
CREATE TABLE sys_dict_data (
  dict_code        BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  dict_sort        INTEGER         DEFAULT 0,
  dict_label       VARCHAR(100)    DEFAULT '',
  dict_value       VARCHAR(100)    DEFAULT '',
  dict_type        VARCHAR(100)    DEFAULT '',
  css_class        VARCHAR(100),
  list_class       VARCHAR(100),
  is_default       CHAR(1)         DEFAULT 'N',
  status           CHAR(1)         DEFAULT '0',
  create_by        VARCHAR(64)     DEFAULT '',
  create_time      TIMESTAMP,
  update_by        VARCHAR(64)     DEFAULT '',
  update_time      TIMESTAMP,
  remark           VARCHAR(500)
);

COMMENT ON TABLE sys_dict_data IS '字典数据表';
COMMENT ON COLUMN sys_dict_data.dict_code IS '字典编码';
COMMENT ON COLUMN sys_dict_data.dict_sort IS '字典排序';
COMMENT ON COLUMN sys_dict_data.dict_label IS '字典标签';
COMMENT ON COLUMN sys_dict_data.dict_value IS '字典键值';
COMMENT ON COLUMN sys_dict_data.dict_type IS '字典类型';
COMMENT ON COLUMN sys_dict_data.css_class IS '样式属性（其他样式扩展）';
COMMENT ON COLUMN sys_dict_data.list_class IS '表格回显样式';
COMMENT ON COLUMN sys_dict_data.is_default IS '是否默认（Y是 N否）';
COMMENT ON COLUMN sys_dict_data.status IS '状态（0正常 1停用）';
COMMENT ON COLUMN sys_dict_data.create_by IS '创建者';
COMMENT ON COLUMN sys_dict_data.create_time IS '创建时间';
COMMENT ON COLUMN sys_dict_data.update_by IS '更新者';
COMMENT ON COLUMN sys_dict_data.update_time IS '更新时间';
COMMENT ON COLUMN sys_dict_data.remark IS '备注';

INSERT INTO sys_dict_data (dict_code, dict_sort, dict_label, dict_value, dict_type, css_class, list_class, is_default, status, create_by, create_time, remark) 
OVERRIDING SYSTEM VALUE VALUES
(1,  1,  '男',       '0',       'sys_user_sex',        '',   '',        'Y', '0', 'admin', NOW(), '性别男'),
(2,  2,  '女',       '1',       'sys_user_sex',        '',   '',        'N', '0', 'admin', NOW(), '性别女'),
(3,  3,  '未知',     '2',       'sys_user_sex',        '',   '',        'N', '0', 'admin', NOW(), '性别未知');


-- ----------------------------
-- 13、系统配置表
-- ----------------------------
DROP TABLE IF EXISTS sys_config CASCADE;
CREATE TABLE sys_config (
  config_id        BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  config_name      VARCHAR(100)    DEFAULT '',
  config_key       VARCHAR(100)    DEFAULT '',
  config_value     VARCHAR(500)    DEFAULT '',
  config_type      CHAR(1)         DEFAULT 'Y',
  create_by         VARCHAR(64)     DEFAULT '',
  create_time       TIMESTAMP,
  update_by         VARCHAR(64)     DEFAULT '',
  update_time       TIMESTAMP,
  remark            VARCHAR(500)
);

COMMENT ON TABLE sys_config IS '系统配置表';
COMMENT ON COLUMN sys_config.config_id IS '参数主键';
COMMENT ON COLUMN sys_config.config_name IS '参数名称';
COMMENT ON COLUMN sys_config.config_key IS '参数键名';
COMMENT ON COLUMN sys_config.config_value IS '参数键值';
COMMENT ON COLUMN sys_config.config_type IS '系统内置（Y是 N否）';
COMMENT ON COLUMN sys_config.create_by IS '创建者';
COMMENT ON COLUMN sys_config.create_time IS '创建时间';
COMMENT ON COLUMN sys_config.update_by IS '更新者';
COMMENT ON COLUMN sys_config.update_time IS '更新时间';
COMMENT ON COLUMN sys_config.remark IS '备注';


-- ----------------------------
-- 14、系统访问记录
-- ----------------------------
DROP TABLE IF EXISTS sys_logininfor CASCADE;
CREATE TABLE sys_logininfor (
  info_id        BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_name      VARCHAR(50)     DEFAULT '',
  ipaddr         VARCHAR(128)    DEFAULT '',
  login_location  VARCHAR(255)    DEFAULT '',
  browser         VARCHAR(50)     DEFAULT '',
  os              VARCHAR(50)     DEFAULT '',
  status          CHAR(1)         DEFAULT '0',
  msg             VARCHAR(255)    DEFAULT '',
  login_time      TIMESTAMP
);

COMMENT ON TABLE sys_logininfor IS '系统访问记录';
COMMENT ON COLUMN sys_logininfor.info_id IS '访问ID';
COMMENT ON COLUMN sys_logininfor.user_name IS '用户账号';
COMMENT ON COLUMN sys_logininfor.ipaddr IS '登录IP地址';
COMMENT ON COLUMN sys_logininfor.login_location IS '登录地点';
COMMENT ON COLUMN sys_logininfor.browser IS '浏览器类型';
COMMENT ON COLUMN sys_logininfor.os IS '操作系统';
COMMENT ON COLUMN sys_logininfor.status IS '登录状态（0成功 1失败）';
COMMENT ON COLUMN sys_logininfor.msg IS '提示消息';
COMMENT ON COLUMN sys_logininfor.login_time IS '访问时间';

CREATE INDEX idx_sys_logininfor_s ON sys_logininfor(status);
CREATE INDEX idx_sys_logininfor_lt ON sys_logininfor(login_time);


-- ----------------------------
-- 15、通知公告表
-- ----------------------------
DROP TABLE IF EXISTS sys_notice CASCADE;
CREATE TABLE sys_notice (
  notice_id        BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  notice_title    VARCHAR(50)     NOT NULL,
  notice_type     CHAR(1)         NOT NULL,
  notice_content TEXT,
  status          CHAR(1)         DEFAULT '0',
  create_by         VARCHAR(64)     DEFAULT '',
  create_time       TIMESTAMP,
  update_by         VARCHAR(64)     DEFAULT '',
  update_time       TIMESTAMP,
  remark            VARCHAR(500)
);

COMMENT ON TABLE sys_notice IS '通知公告表';
COMMENT ON COLUMN sys_notice.notice_id IS '公告ID';
COMMENT ON COLUMN sys_notice.notice_title IS '公告标题';
COMMENT ON COLUMN sys_notice.notice_type IS '公告类型（1通知 2公告）';
COMMENT ON COLUMN sys_notice.notice_content IS '公告内容';
COMMENT ON COLUMN sys_notice.status IS '公告状态（0正常 1关闭）';
COMMENT ON COLUMN sys_notice.create_by IS '创建者';
COMMENT ON COLUMN sys_notice.create_time IS '创建时间';
COMMENT ON COLUMN sys_notice.update_by IS '更新者';
COMMENT ON COLUMN sys_notice.update_time IS '更新时间';
COMMENT ON COLUMN sys_notice.remark IS '备注';


-- ----------------------------
-- 16、通知公告阅读记录表
-- ----------------------------
DROP TABLE IF EXISTS sys_notice_read CASCADE;
CREATE TABLE sys_notice_read (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  notice_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  read_time TIMESTAMP
);

COMMENT ON TABLE sys_notice_read IS '通知公告阅读记录表';
COMMENT ON COLUMN sys_notice_read.id IS '主键ID';
COMMENT ON COLUMN sys_notice_read.notice_id IS '公告ID';
COMMENT ON COLUMN sys_notice_read.user_id IS '用户ID';
COMMENT ON COLUMN sys_notice_read.read_time IS '阅读时间';


-- =============================================
-- 业务表 - 户外运动俱乐部SaaS
-- =============================================

-- ----------------------------
-- 17、俱乐部表
-- ----------------------------
DROP TABLE IF EXISTS club CASCADE;
CREATE TABLE club (
  club_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  club_name VARCHAR(100) NOT NULL,
  club_code VARCHAR(50) NOT NULL UNIQUE,
  logo VARCHAR(255),
  slogan VARCHAR(500),
  description TEXT,
  contact_name VARCHAR(50),
  contact_phone VARCHAR(20),
  contact_email VARCHAR(100),
  address VARCHAR(500),
  theme_config JSONB,
  banner_config JSONB,
  features_config JSONB,
  tabbar_config JSONB,
  status CHAR(1) DEFAULT '0',
  del_flag CHAR(1) DEFAULT '0',
  create_by VARCHAR(64) DEFAULT '',
  create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  update_by VARCHAR(64) DEFAULT '',
  update_time TIMESTAMP,
  remark VARCHAR(500)
);

COMMENT ON TABLE club IS '俱乐部表';
COMMENT ON COLUMN club.club_id IS '俱乐部ID';
COMMENT ON COLUMN club.club_name IS '俱乐部名称';
COMMENT ON COLUMN club.club_code IS '俱乐部编码';
COMMENT ON COLUMN club.logo IS '俱乐部Logo';
COMMENT ON COLUMN club.slogan IS '俱乐部标语';
COMMENT ON COLUMN club.description IS '俱乐部描述';
COMMENT ON COLUMN club.contact_name IS '联系人姓名';
COMMENT ON COLUMN club.contact_phone IS '联系电话';
COMMENT ON COLUMN club.contact_email IS '联系邮箱';
COMMENT ON COLUMN club.address IS '俱乐部地址';
COMMENT ON COLUMN club.theme_config IS '主题配置（JSONB）';
COMMENT ON COLUMN club.banner_config IS 'Banner配置（JSONB）';
COMMENT ON COLUMN club.features_config IS '功能配置（JSONB）';
COMMENT ON COLUMN club.tabbar_config IS 'TabBar配置（JSONB）';
COMMENT ON COLUMN club.status IS '状态（0正常 1停用）';
COMMENT ON COLUMN club.del_flag IS '删除标志（0代表存在 2代表删除）';
COMMENT ON COLUMN club.create_by IS '创建者';
COMMENT ON COLUMN club.create_time IS '创建时间';
COMMENT ON COLUMN club.update_by IS '更新者';
COMMENT ON COLUMN club.update_time IS '更新时间';
COMMENT ON COLUMN club.remark IS '备注';


-- ----------------------------
-- 18、微信用户表
-- ----------------------------
DROP TABLE IF EXISTS wx_user CASCADE;
CREATE TABLE wx_user (
  wx_user_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  club_id BIGINT NOT NULL,
  openid VARCHAR(100) NOT NULL,
  unionid VARCHAR(100),
  nickname VARCHAR(100),
  avatar VARCHAR(255),
  gender INTEGER DEFAULT 0,
  real_name VARCHAR(50),
  phone VARCHAR(20),
  id_card VARCHAR(50),
  status CHAR(1) DEFAULT '0',
  del_flag CHAR(1) DEFAULT '0',
  create_by VARCHAR(64) DEFAULT '',
  create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  update_by VARCHAR(64) DEFAULT '',
  update_time TIMESTAMP,
  remark VARCHAR(500)
);

COMMENT ON TABLE wx_user IS '微信用户表';
COMMENT ON COLUMN wx_user.wx_user_id IS '微信用户ID';
COMMENT ON COLUMN wx_user.club_id IS '俱乐部ID';
COMMENT ON COLUMN wx_user.openid IS '微信OpenID';
COMMENT ON COLUMN wx_user.unionid IS '微信UnionID';
COMMENT ON COLUMN wx_user.nickname IS '昵称';
COMMENT ON COLUMN wx_user.avatar IS '头像';
COMMENT ON COLUMN wx_user.gender IS '性别（0未知 1男 2女）';
COMMENT ON COLUMN wx_user.real_name IS '真实姓名';
COMMENT ON COLUMN wx_user.phone IS '手机号';
COMMENT ON COLUMN wx_user.id_card IS '身份证号（加密）';
COMMENT ON COLUMN wx_user.status IS '状态（0正常 1停用）';
COMMENT ON COLUMN wx_user.del_flag IS '删除标志（0代表存在 2代表删除）';
COMMENT ON COLUMN wx_user.create_by IS '创建者';
COMMENT ON COLUMN wx_user.create_time IS '创建时间';
COMMENT ON COLUMN wx_user.update_by IS '更新者';
COMMENT ON COLUMN wx_user.update_time IS '更新时间';
COMMENT ON COLUMN wx_user.remark IS '备注';

CREATE INDEX idx_wx_user_club ON wx_user(club_id);
CREATE INDEX idx_wx_user_openid ON wx_user(openid);


-- ----------------------------
-- 19、俱乐部-用户关联表
-- ----------------------------
DROP TABLE IF EXISTS club_user CASCADE;
CREATE TABLE club_user (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  club_id BIGINT NOT NULL,
  wx_user_id BIGINT NOT NULL,
  user_role VARCHAR(20) DEFAULT 'member',
  join_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  create_by VARCHAR(64) DEFAULT '',
  create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  remark VARCHAR(500)
);

COMMENT ON TABLE club_user IS '俱乐部-用户关联表';
COMMENT ON COLUMN club_user.id IS '主键ID';
COMMENT ON COLUMN club_user.club_id IS '俱乐部ID';
COMMENT ON COLUMN club_user.wx_user_id IS '微信用户ID';
COMMENT ON COLUMN club_user.user_role IS '用户角色（member会员 leader领队 admin管理员）';
COMMENT ON COLUMN club_user.join_time IS '加入时间';
COMMENT ON COLUMN club_user.create_by IS '创建者';
COMMENT ON COLUMN club_user.create_time IS '创建时间';
COMMENT ON COLUMN club_user.remark IS '备注';

CREATE INDEX idx_club_user_club ON club_user(club_id);
CREATE INDEX idx_club_user_user ON club_user(wx_user_id);


-- ----------------------------
-- 20、活动表
-- ----------------------------
DROP TABLE IF EXISTS act_activity CASCADE;
CREATE TABLE act_activity (
  activity_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  club_id BIGINT NOT NULL,
  activity_title VARCHAR(200) NOT NULL,
  activity_type VARCHAR(50),
  cover_image VARCHAR(500),
  images TEXT,
  description TEXT,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  registration_deadline TIMESTAMP,
  location VARCHAR(500),
  max_participants INTEGER,
  current_participants INTEGER DEFAULT 0,
  price DECIMAL(10, 2) DEFAULT 0,
  status VARCHAR(20) DEFAULT 'draft',
  leader_id BIGINT,
  create_by VARCHAR(64) DEFAULT '',
  create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  update_by VARCHAR(64) DEFAULT '',
  update_time TIMESTAMP,
  remark