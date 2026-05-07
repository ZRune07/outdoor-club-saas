package com.ruoyi.framework.tenant;

import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

/**
 * 自定义租户处理器 - 暂时禁用MyBatis-Plus实现，避免冲突
 *
 * import com.baomidou.mybatisplus.extension.plugins.handler.TenantLineHandler;
 * import net.sf.jsqlparser.expression.Expression;
 * import net.sf.jsqlparser.expression.LongValue;
 *
 * @Component
 * public class CustomTenantHandler implements TenantLineHandler {
 *
 *     /**
 *      * 忽略的表（不需要租户隔离的表）
 *      *\/
 *     private static final Set<String> IGNORE_TABLES = new HashSet<>();
 *
 *     static {
 *         // 若依系统管理表
 *         IGNORE_TABLES.add("sys_user");
 *         IGNORE_TABLES.add("sys_role");
 *         IGNORE_TABLES.add("sys_menu");
 *         IGNORE_TABLES.add("sys_dept");
 *         IGNORE_TABLES.add("sys_dict_type");
 *         IGNORE_TABLES.add("sys_dict_data");
 *         IGNORE_TABLES.add("sys_config");
 *         IGNORE_TABLES.add("sys_notice");
 *         IGNORE_TABLES.add("sys_post");
 *         IGNORE_TABLES.add("sys_oper_log");
 *         IGNORE_TABLES.add("sys_logininfor");
 *         IGNORE_TABLES.add("sys_user_role");
 *         IGNORE_TABLES.add("sys_role_menu");
 *         IGNORE_TABLES.add("sys_user_post");
 *         IGNORE_TABLES.add("sys_notice_read");
 *     }
 *
 *     @Override
 *     public Expression getTenantId() {
 *         Long tenantId = TenantContextHolder.getTenantId();
 *         if (tenantId == null) {
 *             return null;
 *         }
 *         return new LongValue(tenantId);
 *     }
 *
 *     @Override
 *     public String getTenantIdColumn() {
 *         return "club_id";
 *     }
 *
 *     @Override
 *     public boolean ignoreTable(String tableName) {
 *         return IGNORE_TABLES.contains(tableName);
 *     }
 * }
 */

/**
 * 自定义租户处理器 - 简化版本，用于TenantContextHolder管理
 */
@Component
public class CustomTenantHandler {

    /**
     * 忽略的表（不需要租户隔离的表）
     */
    private static final Set<String> IGNORE_TABLES = new HashSet<>();

    static {
        // 若依系统管理表
        IGNORE_TABLES.add("sys_user");
        IGNORE_TABLES.add("sys_role");
        IGNORE_TABLES.add("sys_menu");
        IGNORE_TABLES.add("sys_dept");
        IGNORE_TABLES.add("sys_dict_type");
        IGNORE_TABLES.add("sys_dict_data");
        IGNORE_TABLES.add("sys_config");
        IGNORE_TABLES.add("sys_notice");
        IGNORE_TABLES.add("sys_post");
        IGNORE_TABLES.add("sys_oper_log");
        IGNORE_TABLES.add("sys_logininfor");
        IGNORE_TABLES.add("sys_user_role");
        IGNORE_TABLES.add("sys_role_menu");
        IGNORE_TABLES.add("sys_user_post");
        IGNORE_TABLES.add("sys_notice_read");
    }

    /**
     * 获取当前租户ID
     */
    public static Long getCurrentTenantId() {
        return TenantContextHolder.getTenantId();
    }

    /**
     * 检查表是否需要租户隔离
     */
    public static boolean isIgnoreTable(String tableName) {
        return IGNORE_TABLES.contains(tableName);
    }
}
