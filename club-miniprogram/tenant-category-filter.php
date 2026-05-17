<?php
/**
 * Plugin Name: 租户分类列表筛选器
 * Description: 在WordPress后台分类列表页面右侧，为超级管理员提供按租户筛选分类的功能。只影响列表展示，不影响创建分类表单。
 * Version: 1.0
 * Author: 定制开发
 */

if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * 只对超级管理员生效
 */
function tcf_is_admin() {
    return current_user_can( 'manage_options' );
}

/**
 * 获取所有租户列表
 */
function tcf_get_all_tenants() {
    $tenants = [];
    $posts = get_posts([
        'post_type'      => 'tenant_config',
        'posts_per_page' => -1,
        'post_status'    => 'publish',
    ]);
    foreach ( $posts as $post ) {
        $tenant_id = get_field( 'tenant_id', $post->ID );
        $app_name  = get_field( 'app_name',  $post->ID );
        if ( $tenant_id ) {
            $tenants[] = [
                'tenant_id' => $tenant_id,
                'label'     => $app_name ? "{$app_name}（{$tenant_id}）" : $tenant_id,
            ];
        }
    }
    return $tenants;
}

/**
 * 在分类列表页右侧注入筛选表单
 * 使用 after-{taxonomy}-table 钩子，确保只加在列表区域，不影响左侧创建表单
 */
function tcf_add_filter_to_category_list() {
    if ( ! tcf_is_admin() ) return;

    $screen = get_current_screen();
    if ( ! $screen || $screen->base !== 'edit-tags' ) return;

    $tenants  = tcf_get_all_tenants();
    $selected = isset( $_GET['filter_tenant_id'] ) ? sanitize_text_field( $_GET['filter_tenant_id'] ) : '';
    $taxonomy = isset( $_GET['taxonomy'] ) ? sanitize_text_field( $_GET['taxonomy'] ) : 'category';
    $current_url = admin_url( 'edit-tags.php?taxonomy=' . $taxonomy );
    ?>
    <script type="text/javascript">
    jQuery(document).ready(function($) {
        // 在分类列表表格上方注入筛选表单，不影响左侧创建表单
        var filterHtml = '<div id="tcf-filter-bar" style="margin:10px 0 15px 0;padding:10px 12px;background:#fff;border:1px solid #c3c4c7;border-radius:3px;">';
        filterHtml += '<strong style="margin-right:10px;">按租户筛选分类：</strong>';
        filterHtml += '<form method="get" style="display:inline;">';
        filterHtml += '<input type="hidden" name="taxonomy" value="<?php echo esc_js( $taxonomy ); ?>" />';
        filterHtml += '<input type="hidden" name="post_type" value="post" />';
        filterHtml += '<select name="filter_tenant_id" style="margin-right:8px;">';
        filterHtml += '<option value="">-- 全部租户 --</option>';
        filterHtml += '<option value="default" <?php echo $selected === "default" ? "selected" : ""; ?>>管理员（default）</option>';
        <?php foreach ( $tenants as $t ) : ?>
        filterHtml += '<option value="<?php echo esc_js( $t['tenant_id'] ); ?>" <?php echo $selected === $t['tenant_id'] ? 'selected' : ''; ?>><?php echo esc_js( $t['label'] ); ?></option>';
        <?php endforeach; ?>
        filterHtml += '</select>';
        filterHtml += '<input type="submit" class="button" value="筛选" />';
        <?php if ( $selected ) : ?>
        filterHtml += ' <a href="<?php echo esc_url( $current_url ); ?>" class="button" style="margin-left:6px;">清除筛选</a>';
        filterHtml += ' <span style="margin-left:10px;color:#2271b1;">📋 当前筛选：<strong><?php
            $label = $selected;
            if ( $selected === 'default' ) { $label = '管理员（default）'; }
            else { foreach ( $tenants as $t ) { if ( $t['tenant_id'] === $selected ) { $label = $t['label']; break; } } }
            echo esc_js( $label );
        ?></strong></span>';
        <?php endif; ?>
        filterHtml += '</form>';
        filterHtml += '</div>';

        // 插入到列表表格之前（.wp-list-table 或 #the-list 的父容器上方）
        $('.wp-list-table').before(filterHtml);
        // 同时把搜索框上方的空间也处理一下，确保显示在列表区
        if ($('#tcf-filter-bar').length === 0) {
            $('.tablenav.top').before(filterHtml);
        }
    });
    </script>
    <?php
}
add_action( 'admin_footer', 'tcf_add_filter_to_category_list' );

/**
 * 过滤分类列表查询，只显示选中租户的分类
 */
function tcf_filter_terms_query( $args ) {
    if ( ! is_admin() )           return $args;
    if ( ! tcf_is_admin() )       return $args;

    $screen = get_current_screen();
    if ( ! $screen || $screen->base !== 'edit-tags' ) return $args;

    $tenant_id = isset( $_GET['filter_tenant_id'] ) ? sanitize_text_field( $_GET['filter_tenant_id'] ) : '';
    if ( ! $tenant_id ) return $args;

    // 确保 meta_query 是数组类型
    $existing_meta = isset( $args['meta_query'] ) && is_array( $args['meta_query'] ) ? $args['meta_query'] : [];
    $existing_meta[] = [
        'key'     => 'tenant_id',
        'value'   => $tenant_id,
        'compare' => '=',
    ];
    $args['meta_query'] = $existing_meta;

    return $args;
}
add_filter( 'get_terms_args', 'tcf_filter_terms_query' );

