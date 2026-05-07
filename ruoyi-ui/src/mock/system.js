/**
 * Mock 入口 - 系统级 API
 * 包括：字典、配置、系统管理基础接口等
 */

export default [
  // 字典数据 - 活动类型
  {
    url: '/system/dict/data/type/sys_activity_type',
    method: 'get',
    response: () => ({
      code: 200,
      msg: '操作成功',
      data: [
        { dictCode: 1, dictSort: 1, dictLabel: '徒步', dictValue: '1', dictType: 'sys_activity_type', status: '0' },
        { dictCode: 2, dictSort: 2, dictLabel: '攀岩', dictValue: '2', dictType: 'sys_activity_type', status: '0' },
        { dictCode: 3, dictSort: 3, dictLabel: '露营', dictValue: '3', dictType: 'sys_activity_type', status: '0' },
        { dictCode: 4, dictSort: 4, dictLabel: '骑行', dictValue: '4', dictType: 'sys_activity_type', status: '0' },
        { dictCode: 5, dictSort: 5, dictLabel: '潜水', dictValue: '5', dictType: 'sys_activity_type', status: '0' },
        { dictCode: 6, dictSort: 6, dictLabel: '滑雪', dictValue: '6', dictType: 'sys_activity_type', status: '0' }
      ]
    })
  },
  // 字典数据 - 难度等级
  {
    url: '/system/dict/data/type/sys_difficulty_level',
    method: 'get',
    response: () => ({
      code: 200,
      msg: '操作成功',
      data: [
        { dictCode: 10, dictSort: 1, dictLabel: '入门', dictValue: '1', dictType: 'sys_difficulty_level', status: '0' },
        { dictCode: 11, dictSort: 2, dictLabel: '初级', dictValue: '2', dictType: 'sys_difficulty_level', status: '0' },
        { dictCode: 12, dictSort: 3, dictLabel: '中级', dictValue: '3', dictType: 'sys_difficulty_level', status: '0' },
        { dictCode: 13, dictSort: 4, dictLabel: '高级', dictValue: '4', dictType: 'sys_difficulty_level', status: '0' },
        { dictCode: 14, dictSort: 5, dictLabel: '专家', dictValue: '5', dictType: 'sys_difficulty_level', status: '0' }
      ]
    })
  },
  // 字典数据 - 活动状态
  {
    url: '/system/dict/data/type/sys_activity_status',
    method: 'get',
    response: () => ({
      code: 200,
      msg: '操作成功',
      data: [
        { dictCode: 20, dictSort: 1, dictLabel: '报名中', dictValue: '1', dictType: 'sys_activity_status', status: '0' },
        { dictCode: 21, dictSort: 2, dictLabel: '进行中', dictValue: '2', dictType: 'sys_activity_status', status: '0' },
        { dictCode: 22, dictSort: 3, dictLabel: '已结束', dictValue: '3', dictType: 'sys_activity_status', status: '0' }
      ]
    })
  },
  // 字典数据 - 审核状态
  {
    url: '/system/dict/data/type/sys_audit_status',
    method: 'get',
    response: () => ({
      code: 200,
      msg: '操作成功',
      data: [
        { dictCode: 30, dictSort: 1, dictLabel: '待审核', dictValue: '0', dictType: 'sys_audit_status', status: '0' },
        { dictCode: 31, dictSort: 2, dictLabel: '已通过', dictValue: '1', dictType: 'sys_audit_status', status: '0' },
        { dictCode: 32, dictSort: 3, dictLabel: '已拒绝', dictValue: '2', dictType: 'sys_audit_status', status: '0' },
        { dictCode: 33, dictSort: 4, dictLabel: '已取消', dictValue: '3', dictType: 'sys_audit_status', status: '0' }
      ]
    })
  },
  // 字典数据 - 支付状态
  {
    url: '/system/dict/data/type/sys_pay_status',
    method: 'get',
    response: () => ({
      code: 200,
      msg: '操作成功',
      data: [
        { dictCode: 40, dictSort: 1, dictLabel: '待支付', dictValue: '1', dictType: 'sys_pay_status', status: '0' },
        { dictCode: 41, dictSort: 2, dictLabel: '已支付', dictValue: '2', dictType: 'sys_pay_status', status: '0' },
        { dictCode: 42, dictSort: 3, dictLabel: '已退款', dictValue: '3', dictType: 'sys_pay_status', status: '0' }
      ]
    })
  },
  // 字典数据 - 会员等级
  {
    url: '/system/dict/data/type/sys_member_level',
    method: 'get',
    response: () => ({
      code: 200,
      msg: '操作成功',
      data: [
        { dictCode: 50, dictSort: 1, dictLabel: '初级', dictValue: '1', dictType: 'sys_member_level', status: '0' },
        { dictCode: 51, dictSort: 2, dictLabel: '中级', dictValue: '2', dictType: 'sys_member_level', status: '0' },
        { dictCode: 52, dictSort: 3, dictLabel: '高级', dictValue: '3', dictType: 'sys_member_level', status: '0' },
        { dictCode: 53, dictSort: 4, dictLabel: '专业', dictValue: '4', dictType: 'sys_member_level', status: '0' }
      ]
    })
  },
  // 字典数据 - 会员状态
  {
    url: '/system/dict/data/type/sys_member_status',
    method: 'get',
    response: () => ({
      code: 200,
      msg: '操作成功',
      data: [
        { dictCode: 60, dictSort: 1, dictLabel: '正常', dictValue: '0', dictType: 'sys_member_status', status: '0' },
        { dictCode: 61, dictSort: 2, dictLabel: '冻结', dictValue: '1', dictType: 'sys_member_status', status: '0' },
        { dictCode: 62, dictSort: 3, dictLabel: '过期', dictValue: '2', dictType: 'sys_member_status', status: '0' }
      ]
    })
  },
  // 字典数据 - 通用状态
  {
    url: '/system/dict/data/type/sys_normal_disable',
    method: 'get',
    response: () => ({
      code: 200,
      msg: '操作成功',
      data: [
        { dictCode: 70, dictSort: 1, dictLabel: '正常', dictValue: '0', dictType: 'sys_normal_disable', status: '0' },
        { dictCode: 71, dictSort: 2, dictLabel: '停用', dictValue: '1', dictType: 'sys_normal_disable', status: '0' }
      ]
    })
  },
  // 字典数据 - 性别
  {
    url: '/system/dict/data/type/sys_user_sex',
    method: 'get',
    response: () => ({
      code: 200,
      msg: '操作成功',
      data: [
        { dictCode: 80, dictSort: 1, dictLabel: '男', dictValue: '0', dictType: 'sys_user_sex', status: '0' },
        { dictCode: 81, dictSort: 2, dictLabel: '女', dictValue: '1', dictType: 'sys_user_sex', status: '0' },
        { dictCode: 82, dictSort: 3, dictLabel: '未知', dictValue: '2', dictType: 'sys_user_sex', status: '0' }
      ]
    })
  },
  // 字典数据 - 支付方式
  {
    url: '/system/dict/data/type/sys_pay_method',
    method: 'get',
    response: () => ({
      code: 200,
      msg: '操作成功',
      data: [
        { dictCode: 90, dictSort: 1, dictLabel: '微信支付', dictValue: '1', dictType: 'sys_pay_method', status: '0' },
        { dictCode: 91, dictSort: 2, dictLabel: '支付宝', dictValue: '2', dictType: 'sys_pay_method', status: '0' }
      ]
    })
  },
  // 通用字典 fallback - 任何未匹配的字典类型
  {
    url: /\/system\/dict\/data\/type\/(.+)/,
    method: 'get',
    response: () => ({
      code: 200,
      msg: '操作成功',
      data: []
    })
  },
  // 系统配置
  {
    url: /\/system\/config\/configKey\/(.+)/,
    method: 'get',
    response: () => ({
      code: 200,
      msg: '操作成功',
      msg: '操作成功'
    })
  },
  // 系统用户列表
  {
    url: '/system/user/list',
    method: 'get',
    response: () => ({
      code: 200,
      msg: '操作成功',
      rows: [
        { userId: 1, userName: 'admin', nickName: '管理员', deptName: '研发部门', phonenumber: '13800138000', status: '0', createTime: '2023-01-01 00:00:00' },
        { userId: 2, userName: 'ry', nickName: '若依', deptName: '测试部门', phonenumber: '13800138001', status: '0', createTime: '2023-01-01 00:00:00' }
      ],
      total: 2
    })
  },
  // 系统角色列表
  {
    url: '/system/role/list',
    method: 'get',
    response: () => ({
      code: 200,
      msg: '操作成功',
      rows: [
        { roleId: 1, roleName: '超级管理员', roleKey: 'admin', roleSort: 1, status: '0', createTime: '2023-01-01 00:00:00' },
        { roleId: 2, roleName: '普通角色', roleKey: 'common', roleSort: 2, status: '0', createTime: '2023-01-01 00:00:00' }
      ],
      total: 2
    })
  },
  // 部门树
  {
    url: '/system/dept/list',
    method: 'get',
    response: () => ({
      code: 200,
      msg: '操作成功',
      data: [
        { deptId: 100, parentId: 0, deptName: '若依科技', orderNum: 0, status: '0' },
        { deptId: 101, parentId: 100, deptName: '深圳总公司', orderNum: 1, status: '0' },
        { deptId: 103, parentId: 101, deptName: '研发部门', orderNum: 1, status: '0' },
        { deptId: 104, parentId: 101, deptName: '市场部门', orderNum: 2, status: '0' },
        { deptId: 102, parentId: 100, deptName: '长沙分公司', orderNum: 2, status: '0' },
        { deptId: 105, parentId: 102, deptName: '测试部门', orderNum: 1, status: '0' }
      ]
    })
  },
  // 菜单列表
  {
    url: '/system/menu/list',
    method: 'get',
    response: () => ({
      code: 200,
      msg: '操作成功',
      data: []
    })
  },
  // 岗位列表
  {
    url: '/system/post/list',
    method: 'get',
    response: () => ({
      code: 200,
      msg: '操作成功',
      rows: [
        { postId: 1, postCode: 'ceo', postName: '董事长', postSort: 1, status: '0' },
        { postId: 2, postCode: 'se', postName: '项目经理', postSort: 2, status: '0' },
        { postId: 3, postCode: 'hr', postName: '人力资源', postSort: 3, status: '0' },
        { postId: 4, postCode: 'user', postName: '普通员工', postSort: 4, status: '0' }
      ],
      total: 4
    })
  },
  // 通知公告列表
  {
    url: '/system/notice/list',
    method: 'get',
    response: () => ({
      code: 200,
      msg: '操作成功',
      rows: [
        { noticeId: 1, noticeTitle: '温馨提醒：2025年活动安排已发布', noticeType: '2', createBy: 'admin', createTime: '2025-01-01 00:00:00' },
        { noticeId: 2, noticeTitle: '维护通知：系统将于周六凌晨维护', noticeType: '1', createBy: 'admin', createTime: '2025-03-15 00:00:00' }
      ],
      total: 2
    })
  },
  // 字典类型列表
  {
    url: '/system/dict/type/list',
    method: 'get',
    response: () => ({
      code: 200,
      msg: '操作成功',
      rows: [
        { dictId: 1, dictName: '活动类型', dictType: 'sys_activity_type', status: '0', createTime: '2024-01-01 00:00:00' },
        { dictId: 2, dictName: '难度等级', dictType: 'sys_difficulty_level', status: '0', createTime: '2024-01-01 00:00:00' },
        { dictId: 3, dictName: '活动状态', dictType: 'sys_activity_status', status: '0', createTime: '2024-01-01 00:00:00' }
      ],
      total: 3
    })
  },
  // 在线用户
  {
    url: '/monitor/online/list',
    method: 'get',
    response: () => ({
      code: 200,
      msg: '操作成功',
      rows: [],
      total: 0
    })
  },
  // 定时任务
  {
    url: '/monitor/job/list',
    method: 'get',
    response: () => ({
      code: 200,
      msg: '操作成功',
      rows: [],
      total: 0
    })
  },
  // 操作日志
  {
    url: '/monitor/operlog/list',
    method: 'get',
    response: () => ({
      code: 200,
      msg: '操作成功',
      rows: [
        { operId: 1, title: '用户登录', businessType: 10, operName: 'admin', operIp: '127.0.0.1', status: 0, operTime: '2025-04-18 10:00:00' }
      ],
      total: 1
    })
  },
  // 登录日志
  {
    url: '/monitor/logininfor/list',
    method: 'get',
    response: () => ({
      code: 200,
      msg: '操作成功',
      rows: [
        { infoId: 1, userName: 'admin', ipaddr: '127.0.0.1', loginLocation: '内网IP', browser: 'Chrome', os: 'Windows', status: '0', msg: '登录成功', loginTime: '2025-04-18 10:00:00' }
      ],
      total: 1
    })
  },
  // 服务器信息
  {
    url: '/monitor/server',
    method: 'get',
    response: () => ({
      code: 200,
      msg: '操作成功',
      data: { cpuNum: 4, cpuUsage: 23.5, memTotal: 8192, memUsed: 4096, memUsage: 50.0 }
    })
  },
  // 缓存信息
  {
    url: '/monitor/cache',
    method: 'get',
    response: () => ({
      code: 200,
      msg: '操作成功',
      data: { commandStats: [], dbSize: 0, info: {} }
    })
  },
  // 代码生成表
  {
    url: '/tool/gen/list',
    method: 'get',
    response: () => ({
      code: 200,
      msg: '操作成功',
      rows: [],
      total: 0
    })
  }
]
