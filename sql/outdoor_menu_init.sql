-- =============================================
-- 户外模块菜单初始化脚本
-- 用于在sys_menu表中添加户外管理模块的菜单
-- =============================================

-- 注意: 执行此脚本前请确保已导入户外相关的数据库表结构

-- 户外管理一级菜单
INSERT INTO sys_menu (menu_id, menu_name, parent_id, order_num, path, component, is_frame, is_cache, menu_type, visible, status, perms, icon, create_by, create_time, update_by, update_time, remark)
VALUES (2000, '户外管理', 0, 4, 'outdoor', NULL, 1, 0, 'M', '0', '0', '', 'forest', 'admin', sysdate, '', NULL, '户外模块根目录');

-- 俱乐部管理
INSERT INTO sys_menu (menu_id, menu_name, parent_id, order_num, path, component, is_frame, is_cache, menu_type, visible, status, perms, icon, create_by, create_time, update_by, update_time, remark)
VALUES (2001, '俱乐部管理', 2000, 1, 'club', 'outdoor/club/List', 1, 0, 'C', '0', '0', 'outdoor:club:list', 'company', 'admin', sysdate, '', NULL, '俱乐部列表');

INSERT INTO sys_menu (menu_id, menu_name, parent_id, order_num, path, component, is_frame, is_cache, menu_type, visible, status, perms, icon, create_by, create_time, update_by, update_time, remark)
VALUES (2002, '俱乐部配置', 2001, 1, 'config', 'outdoor/club/Config', 1, 0, 'F', '0', '0', 'outdoor:club:config', '#', 'admin', sysdate, '', NULL, '俱乐部配置');

-- 活动管理
INSERT INTO sys_menu (menu_id, menu_name, parent_id, order_num, path, component, is_frame, is_cache, menu_type, visible, status, perms, icon, create_by, create_time, update_by, update_time, remark)
VALUES (2010, '活动管理', 2000, 2, 'activity', 'outdoor/activity/List', 1, 0, 'C', '0', '0', 'outdoor:activity:list', 'activity', 'admin', sysdate, '', NULL, '活动列表');

INSERT INTO sys_menu (menu_id, menu_name, parent_id, order_num, path, component, is_frame, is_cache, menu_type, visible, status, perms, icon, create_by, create_time, update_by, update_time, remark)
VALUES (2011, '活动新增', 2010, 1, '', NULL, 1, 0, 'F', '0', '0', 'outdoor:activity:add', '#', 'admin', sysdate, '', NULL, '');

INSERT INTO sys_menu (menu_id, menu_name, parent_id, order_num, path, component, is_frame, is_cache, menu_type, visible, status, perms, icon, create_by, create_time, update_by, update_time, remark)
VALUES (2012, '活动编辑', 2010, 2, '', NULL, 1, 0, 'F', '0', '0', 'outdoor:activity:edit', '#', 'admin', sysdate, '', NULL, '');

INSERT INTO sys_menu (menu_id, menu_name, parent_id, order_num, path, component, is_frame, is_cache, menu_type, visible, status, perms, icon, create_by, create_time, update_by, update_time, remark)
VALUES (2013, '活动删除', 2010, 3, '', NULL, 1, 0, 'F', '0', '0', 'outdoor:activity:remove', '#', 'admin', sysdate, '', NULL, '');

INSERT INTO sys_menu (menu_id, menu_name, parent_id, order_num, path, component, is_frame, is_cache, menu_type, visible, status, perms, icon, create_by, create_time, update_by, update_time, remark)
VALUES (2014, '活动查看', 2010, 4, '', NULL, 1, 0, 'F', '0', '0', 'outdoor:activity:query', '#', 'admin', sysdate, '', NULL, '');

INSERT INTO sys_menu (menu_id, menu_name, parent_id, order_num, path, component, is_frame, is_cache, menu_type, visible, status, perms, icon, create_by, create_time, update_by, update_time, remark)
VALUES (2015, '活动详情', 2010, 5, 'detail', 'outdoor/activity/Detail', 1, 0, 'F', '0', '0', 'outdoor:activity:detail', '#', 'admin', sysdate, '', NULL, '');

-- 报名管理
INSERT INTO sys_menu (menu_id, menu_name, parent_id, order_num, path, component, is_frame, is_cache, menu_type, visible, status, perms, icon, create_by, create_time, update_by, update_time, remark)
VALUES (2020, '报名管理', 2000, 3, 'registration', 'outdoor/registration/List', 1, 0, 'C', '0', '0', 'outdoor:registration:list', 'list', 'admin', sysdate, '', NULL, '报名列表');

INSERT INTO sys_menu (menu_id, menu_name, parent_id, order_num, path, component, is_frame, is_cache, menu_type, visible, status, perms, icon, create_by, create_time, update_by, update_time, remark)
VALUES (2021, '报名审核', 2020, 1, '', NULL, 1, 0, 'F', '0', '0', 'outdoor:registration:audit', '#', 'admin', sysdate, '', NULL, '');

-- 订单管理
INSERT INTO sys_menu (menu_id, menu_name, parent_id, order_num, path, component, is_frame, is_cache, menu_type, visible, status, perms, icon, create_by, create_time, update_by, update_time, remark)
VALUES (2030, '订单管理', 2000, 4, 'order', 'outdoor/order/List', 1, 0, 'C', '0', '0', 'outdoor:order:list', 'money', 'admin', sysdate, '', NULL, '订单列表');

INSERT INTO sys_menu (menu_id, menu_name, parent_id, order_num, path, component, is_frame, is_cache, menu_type, visible, status, perms, icon, create_by, create_time, update_by, update_time, remark)
VALUES (2031, '订单退款', 2030, 1, '', NULL, 1, 0, 'F', '0', '0', 'outdoor:order:refund', '#', 'admin', sysdate, '', NULL, '');

-- 会员管理
INSERT INTO sys_menu (menu_id, menu_name, parent_id, order_num, path, component, is_frame, is_cache, menu_type, visible, status, perms, icon, create_by, create_time, update_by, update_time, remark)
VALUES (2040, '会员管理', 2000, 5, 'member', 'outdoor/member/List', 1, 0, 'C', '0', '0', 'outdoor:member:list', 'user', 'admin', sysdate, '', NULL, '会员列表');

-- 免责条款管理
INSERT INTO sys_menu (menu_id, menu_name, parent_id, order_num, path, component, is_frame, is_cache, menu_type, visible, status, perms, icon, create_by, create_time, update_by, update_time, remark)
VALUES (2050, '免责条款', 2000, 6, 'disclaimer', 'outdoor/disclaimer/List', 1, 0, 'C', '0', '0', 'outdoor:disclaimer:list', 'document', 'admin', sysdate, '', NULL, '免责条款列表');

INSERT INTO sys_menu (menu_id, menu_name, parent_id, order_num, path, component, is_frame, is_cache, menu_type, visible, status, perms, icon, create_by, create_time, update_by, update_time, remark)
VALUES (2051, '免责条款新增', 2050, 1, '', NULL, 1, 0, 'F', '0', '0', 'outdoor:disclaimer:add', '#', 'admin', sysdate, '', NULL, '');

INSERT INTO sys_menu (menu_id, menu_name, parent_id, order_num, path, component, is_frame, is_cache, menu_type, visible, status, perms, icon, create_by, create_time, update_by, update_time, remark)
VALUES (2052, '免责条款编辑', 2050, 2, '', NULL, 1, 0, 'F', '0', '0', 'outdoor:disclaimer:edit', '#', 'admin', sysdate, '', NULL, '');

INSERT INTO sys_menu (menu_id, menu_name, parent_id, order_num, path, component, is_frame, is_cache, menu_type, visible, status, perms, icon, create_by, create_time, update_by, update_time, remark)
VALUES (2053, '免责条款删除', 2050, 3, '', NULL, 1, 0, 'F', '0', '0', 'outdoor:disclaimer:remove', '#', 'admin', sysdate, '', NULL, '');

-- 给管理员角色添加户外模块权限
INSERT INTO sys_role_menu (role_id, menu_id) 
SELECT 1, menu_id FROM sys_menu WHERE menu_id >= 2000;

-- 创建户外管理员角色
INSERT INTO sys_role (role_id, role_name, role_key, role_sort, data_scope, menu_check_strictly, dept_check_strictly, status, del_flag, create_by, create_time, update_by, update_time, remark)
VALUES (10, '户外管理员', 'outdoor_admin', 10, '5', 1, 1, '0', '0', 'admin', sysdate, '', NULL, '户外业务管理员角色');

-- 给户外管理员角色分配户外模块菜单权限
INSERT INTO sys_role_menu (role_id, menu_id)
SELECT 10, menu_id FROM sys_menu WHERE menu_id >= 2000;
