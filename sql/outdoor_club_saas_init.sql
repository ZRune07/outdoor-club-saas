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
('1039', '操作查询', '500', '1', '#', '', '', '', 1, 0, 'F', '0', '0', 'monitor:operlog:query',    '#', 'admin', NOW(), ''),
('1040', '操作删除', '500', '2', '#', '', '', '', 1, 0, 'F', '0', '0', 'monitor:operlog:remove',   '#', 'admin', NOW(), ''),
('1041', '日志导出', '500', '3', '#', '', '', '', 1, 0, 'F', '0', '0', 'monitor:operlog:export',   '#', 'admin', NOW(), '');

-- 登录日志按钮
INSERT INTO sys_menu (menu_id, menu_name, parent_id, order_num, path, component, query, route_name, is_frame, is_cache, menu_type, visible, status, perms, icon, create_by, create_time, remark) 
OVERRIDING SYSTEM VALUE VALUES
('1042', '登录查询', '501', '1', '#', '', '', '', 1, 0, 'F', '0', '0', 'monitor:logininfor:query', '#', 'admin', NOW(), ''),
('1043', '登录删除', '501', '2', '#', '', '', '', 1, 0, 'F', '0', '0', 'monitor:logininfor:remove', '#', 'admin', NOW(), ''),
('1044', '日志导出', '501', '3', '#', '', '', '', 1, 0, 'F', '0', '0', 'monitor:logininfor:export', '#', 'admin', NOW(), ''),
('1045', '账户解锁', '501', '4', '#', '', '', '', 1, 0, 'F', '0', '0', 'monitor:logininfor:unlock', '#', 'admin', NOW(), '');

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
INSERT INTO sys_role_menu SELECT '2', menu_id FROM sys_menu;


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


-- =============================================
-- 业务表 - 户外运动俱乐部SaaS
-- =============================================

-- ----------------------------
-- 16、俱乐部表
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
-- 17、微信用户表
-- ----------------------------
DROP TABLE IF EXISTS wx_user CASCADE;
CREATE TABLE wx_user (
  wx_user_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  club_id BIGINT,
  openid VARCHAR(100) NOT NULL,
  unionid VARCHAR(100),
  nickname VARCHAR(100),
  avatar VARCHAR(255),
  gender INTEGER DEFAULT 0,
  real_name VARCHAR(50),
  phone VARCHAR(20),
  id_card VARCHAR(100),
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
-- 18、俱乐部-用户关联表
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
-- 19、活动表
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
  insurance_price DECIMAL(10, 2) DEFAULT 0,
  status VARCHAR(20) DEFAULT 'draft',
  leader_id BIGINT,
  content TEXT,
  notices TEXT,
  create_by VARCHAR(64) DEFAULT '',
  create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  update_by VARCHAR(64) DEFAULT '',
  update_time TIMESTAMP,
  remark VARCHAR(500)
);

COMMENT ON TABLE act_activity IS '活动表';
COMMENT ON COLUMN act_activity.activity_id IS '活动ID';
COMMENT ON COLUMN act_activity.club_id IS '俱乐部ID';
COMMENT ON COLUMN act_activity.activity_title IS '活动标题';
COMMENT ON COLUMN act_activity.activity_type IS '活动类型';
COMMENT ON COLUMN act_activity.cover_image IS '封面图';
COMMENT ON COLUMN act_activity.images IS '活动图片列表';
COMMENT ON COLUMN act_activity.description IS '活动描述';
COMMENT ON COLUMN act_activity.start_time IS '开始时间';
COMMENT ON COLUMN act_activity.end_time IS '结束时间';
COMMENT ON COLUMN act_activity.registration_deadline IS '报名截止时间';
COMMENT ON COLUMN act_activity.location IS '集合地点';
COMMENT ON COLUMN act_activity.max_participants IS '最大人数';
COMMENT ON COLUMN act_activity.current_participants IS '当前人数';
COMMENT ON COLUMN act_activity.price IS '活动费用';
COMMENT ON COLUMN act_activity.insurance_price IS '保险费用';
COMMENT ON COLUMN act_activity.status IS '状态（draft草稿 recruiting招募中 full已满员 ongoing进行中 ended已结束）';
COMMENT ON COLUMN act_activity.leader_id IS '领队ID';
COMMENT ON COLUMN act_activity.content IS '活动详情';
COMMENT ON COLUMN act_activity.notices IS '注意事项';
COMMENT ON COLUMN act_activity.create_by IS '创建者';
COMMENT ON COLUMN act_activity.create_time IS '创建时间';
COMMENT ON COLUMN act_activity.update_by IS '更新者';
COMMENT ON COLUMN act_activity.update_time IS '更新时间';
COMMENT ON COLUMN act_activity.remark IS '备注';

CREATE INDEX idx_act_activity_club ON act_activity(club_id);
CREATE INDEX idx_act_activity_status ON act_activity(status);
CREATE INDEX idx_act_activity_start ON act_activity(start_time);


-- ----------------------------
-- 20、报名表
-- ----------------------------
DROP TABLE IF EXISTS reg_registration CASCADE;
CREATE TABLE reg_registration (
  registration_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  club_id BIGINT NOT NULL,
  activity_id BIGINT NOT NULL,
  wx_user_id BIGINT NOT NULL,
  real_name VARCHAR(50) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  id_card VARCHAR(100),
  emergency_contact VARCHAR(50),
  emergency_phone VARCHAR(20),
  status VARCHAR(20) DEFAULT 'pending',
  remark VARCHAR(500),
  create_by VARCHAR(64) DEFAULT '',
  create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  update_by VARCHAR(64) DEFAULT '',
  update_time TIMESTAMP
);

COMMENT ON TABLE reg_registration IS '报名表';
COMMENT ON COLUMN reg_registration.registration_id IS '报名ID';
COMMENT ON COLUMN reg_registration.club_id IS '俱乐部ID';
COMMENT ON COLUMN reg_registration.activity_id IS '活动ID';
COMMENT ON COLUMN reg_registration.wx_user_id IS '微信用户ID';
COMMENT ON COLUMN reg_registration.real_name IS '真实姓名';
COMMENT ON COLUMN reg_registration.phone IS '手机号';
COMMENT ON COLUMN reg_registration.id_card IS '身份证号';
COMMENT ON COLUMN reg_registration.emergency_contact IS '紧急联系人';
COMMENT ON COLUMN reg_registration.emergency_phone IS '紧急联系电话';
COMMENT ON COLUMN reg_registration.status IS '状态（pending待支付 paid已支付 approved已审核 canceled已取消）';
COMMENT ON COLUMN reg_registration.remark IS '备注';
COMMENT ON COLUMN reg_registration.create_by IS '创建者';
COMMENT ON COLUMN reg_registration.create_time IS '创建时间';
COMMENT ON COLUMN reg_registration.update_by IS '更新者';
COMMENT ON COLUMN reg_registration.update_time IS '更新时间';

CREATE INDEX idx_reg_reg_club ON reg_registration(club_id

-- ----------------------------
-- 21、订单表
-- ----------------------------
DROP TABLE IF EXISTS pay_order CASCADE;
CREATE TABLE pay_order (
  order_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_no VARCHAR(64) NOT NULL UNIQUE,
  club_id BIGINT NOT NULL,
  registration_id BIGINT NOT NULL,
  wx_user_id BIGINT NOT NULL,
  order_type VARCHAR(20) DEFAULT 'activity',
  total_amount DECIMAL(10, 2) NOT NULL,
  discount_amount DECIMAL(10, 2) DEFAULT 0,
  pay_amount DECIMAL(10, 2) NOT NULL,
  pay_status VARCHAR(20) DEFAULT 'pending',
  pay_time TIMESTAMP,
  transaction_id VARCHAR(128),
  create_by VARCHAR(64) DEFAULT '',
  create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  update_by VARCHAR(64) DEFAULT '',
  update_time TIMESTAMP,
  remark VARCHAR(500)
);

COMMENT ON TABLE pay_order IS '订单表';
COMMENT ON COLUMN pay_order.order_id IS '订单ID';
COMMENT ON COLUMN pay_order.order_no IS '订单号';
COMMENT ON COLUMN pay_order.club_id IS '俱乐部ID';
COMMENT ON COLUMN pay_order.registration_id IS '报名ID';
COMMENT ON COLUMN pay_order.wx_user_id IS '微信用户ID';
COMMENT ON COLUMN pay_order.order_type IS '订单类型（activity活动 insurance保险）';
COMMENT ON COLUMN pay_order.total_amount IS '订单总金额';
COMMENT ON COLUMN pay_order.discount_amount IS '优惠金额';
COMMENT ON COLUMN pay_order.pay_amount IS '实际支付金额';
COMMENT ON COLUMN pay_order.pay_status IS '支付状态（pending待支付 paid已支付 refunded已退款）';
COMMENT ON COLUMN pay_order.pay_time IS '支付时间';
COMMENT ON COLUMN pay_order.transaction_id IS '微信交易号';
COMMENT ON COLUMN pay_order.create_by IS '创建者';
COMMENT ON COLUMN pay_order.create_time IS '创建时间';
COMMENT ON COLUMN pay_order.update_by IS '更新者';
COMMENT ON COLUMN pay_order.update_time IS '更新时间';
COMMENT ON COLUMN pay_order.remark IS '备注';

CREATE INDEX idx_pay_order_club ON pay_order(club_id);
CREATE INDEX idx_pay_order_reg ON pay_order(registration_id);
CREATE INDEX idx_pay_order_user ON pay_order(wx_user_id);
CREATE INDEX idx_pay_order_no ON pay_order(order_no);


-- ----------------------------
-- 22、免责声明表
-- ----------------------------
DROP TABLE IF EXISTS dis_disclaimer CASCADE;
CREATE TABLE dis_disclaimer (
  disclaimer_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  club_id BIGINT NOT NULL,
  disclaimer_title VARCHAR(200) NOT NULL,
  disclaimer_type VARCHAR(50) DEFAULT 'general',
  content TEXT NOT NULL,
  version VARCHAR(20) DEFAULT '1.0',
  status VARCHAR(20) DEFAULT 'active',
  effective_time TIMESTAMP,
  create_by VARCHAR(64) DEFAULT '',
  create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  update_by VARCHAR(64) DEFAULT '',
  update_time TIMESTAMP,
  remark VARCHAR(500)
);

COMMENT ON TABLE dis_disclaimer IS '免责声明表';
COMMENT ON COLUMN dis_disclaimer.disclaimer_id IS '免责声明ID';
COMMENT ON COLUMN dis_disclaimer.club_id IS '俱乐部ID';
COMMENT ON COLUMN dis_disclaimer.disclaimer_title IS '免责标题';
COMMENT ON COLUMN dis_disclaimer.disclaimer_type IS '免责类型（general通用 activity活动）';
COMMENT ON COLUMN dis_disclaimer.content IS '免责内容';
COMMENT ON COLUMN dis_disclaimer.version IS '版本号';
COMMENT ON COLUMN dis_disclaimer.status IS '状态（active生效 inactive失效）';
COMMENT ON COLUMN dis_disclaimer.effective_time IS '生效时间';
COMMENT ON COLUMN dis_disclaimer.create_by IS '创建者';
COMMENT ON COLUMN dis_disclaimer.create_time IS '创建时间';
COMMENT ON COLUMN dis_disclaimer.update_by IS '更新者';
COMMENT ON COLUMN dis_disclaimer.update_time IS '更新时间';
COMMENT ON COLUMN dis_disclaimer.remark IS '备注';

CREATE INDEX idx_disclaimer_club ON dis_disclaimer(club_id);
CREATE INDEX idx_disclaimer_type ON dis_disclaimer(disclaimer_type);


-- ----------------------------
-- 23、免责签署记录表
-- ----------------------------
DROP TABLE IF EXISTS dis_sign_record CASCADE;
CREATE TABLE dis_sign_record (
  sign_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  club_id BIGINT NOT NULL,
  disclaimer_id BIGINT NOT NULL,
  registration_id BIGINT,
  wx_user_id BIGINT NOT NULL,
  sign_name VARCHAR(50) NOT NULL,
  sign_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  sign_ip VARCHAR(128),
  sign_device VARCHAR(200),
  sign_status VARCHAR(20) DEFAULT 'signed',
  create_by VARCHAR(64) DEFAULT '',
  create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE dis_sign_record IS '免责签署记录表';
COMMENT ON COLUMN dis_sign_record.sign_id IS '签署ID';
COMMENT ON COLUMN dis_sign_record.club_id IS '俱乐部ID';
COMMENT ON COLUMN dis_sign_record.disclaimer_id IS '免责声明ID';
COMMENT ON COLUMN dis_sign_record.registration_id IS '报名ID';
COMMENT ON COLUMN dis_sign_record.wx_user_id IS '微信用户ID';
COMMENT ON COLUMN dis_sign_record.sign_name IS '签署人姓名';
COMMENT ON COLUMN dis_sign_record.sign_time IS '签署时间';
COMMENT ON COLUMN dis_sign_record.sign_ip IS '签署IP地址';
COMMENT ON COLUMN dis_sign_record.sign_device IS '签署设备';
COMMENT ON COLUMN dis_sign_record.sign_status IS '签署状态（signed已签署 withdrawn已撤回）';
COMMENT ON COLUMN dis_sign_record.create_by IS '创建者';
COMMENT ON COLUMN dis_sign_record.create_time IS '创建时间';

CREATE INDEX idx_sign_club ON dis_sign_record(club_id);
CREATE INDEX idx_sign_disclaimer ON dis_sign_record(disclaimer_id);
CREATE INDEX idx_sign_reg ON dis_sign_record(registration_id);
CREATE INDEX idx_sign_user ON dis_sign_record(wx_user_id);


-- ----------------------------
-- 24、俱乐部Banner表
-- ----------------------------
DROP TABLE IF EXISTS club_banner CASCADE;
CREATE TABLE club_banner (
  banner_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  club_id BIGINT NOT NULL,
  banner_title VARCHAR(100),
  banner_url VARCHAR(500) NOT NULL,
  link_type VARCHAR(20) DEFAULT 'none',
  link_value VARCHAR(200),
  sort_order INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'active',
  create_by VARCHAR(64) DEFAULT '',
  create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  update_by VARCHAR(64) DEFAULT '',
  update_time TIMESTAMP,
  remark VARCHAR(500)
);

COMMENT ON TABLE club_banner IS '俱乐部Banner表';
COMMENT ON COLUMN club_banner.banner_id IS 'BannerID';
COMMENT ON COLUMN club_banner.club_id IS '俱乐部ID';
COMMENT ON COLUMN club_banner.banner_title IS 'Banner标题';
COMMENT ON COLUMN club_banner.banner_url IS 'Banner图片URL';
COMMENT ON COLUMN club_banner.link_type IS '链接类型（none无链接 activity活动 web网页）';
COMMENT ON COLUMN club_banner.link_value IS '链接值（活动ID或网页URL）';
COMMENT ON COLUMN club_banner.sort_order IS '排序';
COMMENT ON COLUMN club_banner.status IS '状态（active生效 inactive失效）';
COMMENT ON COLUMN club_banner.create_by IS '创建者';
COMMENT ON COLUMN club_banner.create_time IS '创建时间';
COMMENT ON COLUMN club_banner.update_by IS '更新者';
COMMENT ON COLUMN club_banner.update_time IS '更新时间';
COMMENT ON COLUMN club_banner.remark IS '备注';

CREATE INDEX idx_banner_club ON club_banner(club_id);


-- ----------------------------
-- 25、俱乐部公告表
-- ----------------------------
DROP TABLE IF EXISTS club_notice CASCADE;
CREATE TABLE club_notice (
  notice_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  club_id BIGINT NOT NULL,
  notice_title VARCHAR(200) NOT NULL,
  notice_type VARCHAR(20) DEFAULT 'normal',
  notice_content TEXT,
  publisher VARCHAR(100),
  publish_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(20) DEFAULT 'published',
  create_by VARCHAR(64) DEFAULT '',
  create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  update_by VARCHAR(64) DEFAULT '',
  update_time TIMESTAMP,
  remark VARCHAR(500)
);

COMMENT ON TABLE club_notice IS '俱乐部公告表';
COMMENT ON COLUMN club_notice.notice_id IS '公告ID';
COMMENT ON COLUMN club_notice.club_id IS '俱乐部ID';
COMMENT ON COLUMN club_notice.notice_title IS '公告标题';
COMMENT ON COLUMN club_notice.notice_type IS '公告类型（normal普通 urgent紧急 activity活动）';
COMMENT ON COLUMN club_notice.notice_content IS '公告内容';
COMMENT ON COLUMN club_notice.publisher IS '发布人';
COMMENT ON COLUMN club_notice.publish_time IS '发布时间';
COMMENT ON COLUMN club_notice.status IS '状态（published已发布 draft草稿）';
COMMENT ON COLUMN club_notice.create_by IS '创建者';
COMMENT ON COLUMN club_notice.create_time IS '创建时间';
COMMENT ON COLUMN club_notice.update_by IS '更新者';
COMMENT ON COLUMN club_notice.update_time IS '更新时间';
COMMENT ON COLUMN club_notice.remark IS '备注';

CREATE INDEX idx_notice_club ON club_notice(club_id);


-- ----------------------------
-- 初始化俱乐部数据
-- ----------------------------
INSERT INTO club (club_id, club_name, club_code, logo, slogan, description, contact_name, contact_phone, status) 
VALUES (1, '示例户外俱乐部', 'demo', 'https://example.com/logo.png', '探索自然，畅享户外', '专注于户外运动和探险的俱乐部', '管理员', '400-888-8888', '0');

-- ----------------------------
-- 初始化示例活动数据
-- ----------------------------
INSERT INTO act_activity (club_id, activity_title, activity_type, cover_image, description, start_time, end_time, registration_deadline, location, max_participants, price, insurance_price, status)
VALUES 
(1, '周末徒步穿越', 'hiking', 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800', '轻松愉快的周末徒步活动，适合新手参与', CURRENT_TIMESTAMP + INTERVAL '7 days', CURRENT_TIMESTAMP + INTERVAL '7 days' + INTERVAL '8 hours', CURRENT_TIMESTAMP + INTERVAL '5 days', '北京市朝阳区奥林匹克森林公园南门', 30, 0, 5, 'recruiting'),
(1, '山地自行车挑战', 'cycling', 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=800', '专业山地自行车路线，适合有经验的骑行者', CURRENT_TIMESTAMP + INTERVAL '14 days', CURRENT_TIMESTAMP + INTERVAL '14 days' + INTERVAL '10 hours', CURRENT_TIMESTAMP + INTERVAL '10 days', '北京市昌平区十三陵水库', 20, 50, 10, 'recruiting'),
(1, '露营烧烤派对', 'camping', 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800', '户外露营+烧烤，适合家庭和朋友聚会', CURRENT_TIMESTAMP + INTERVAL '21 days', CURRENT_TIMESTAMP + INTERVAL '22 days', CURRENT_TIMESTAMP + INTERVAL '18 days', '北京市怀柔区慕田峪长城脚下', 50, 100, 5, 'draft');

-- ----------------------------
-- 初始化示例免责协议
-- ----------------------------
INSERT INTO dis_disclaimer (club_id, disclaimer_title, disclaimer_type, content, version, status, effective_time)
VALUES 
(1, '户外活动免责协议', 'general', 
'【免责协议】

1. 本人自愿报名参加户外活动，并确认已了解活动的风险性和可能对身体造成的影响。

2. 本人承诺身体健康，无心脏病、高血压、呼吸系统疾病等不适合户外运动的疾病史。如有隐瞒，后果自负。

3. 活动期间，严格遵守领队指挥，不得擅自行动。因违反规定导致自身或他人人身伤害、财产损失，由本人承担全部责任。

4. 如遇天气、交通等不可抗力因素导致活动取消或变更，组织方不承担违约责任，但会尽力协调解决。

5. 活动期间发生的意外伤害，组织方仅在能力范围内协助救治，不承担医疗费用。

6. 本人同意活动组织方使用活动中的照片、视频等影像资料用于宣传。

7. 本协议自签署之日起生效，最终解释权归活动组织方所有。', 
'1.0', 'active', CURRENT_TIMESTAMP);
