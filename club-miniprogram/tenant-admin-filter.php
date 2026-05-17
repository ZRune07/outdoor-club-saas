<?php
/**
 * Plugin Name: 租户内容筛选器
 * Description: 在WordPress后台为超级管理员提供按租户筛选文章和分类的功能
 * Version: 1.0
 * Author: 定制开发
 */

if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * 只对超级管理员生效
 */
function tenant_filter_is_admin() {
    return current_user_can( 'manage_options' );
}

/**
 * 获取所有租户列表（从 tenant_config CPT 的 ACF 字段读取）
 */
function tenant_filter_get_all_tenants() {
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
 * 在文章列表顶部注入租户筛选下拉框
 */
function tenant_filter_add_dropdown() {
    if ( ! tenant_filter_is_admin() ) return;

    $screen = get_current_screen();
    // 只在文章列表页显示（post_type = post 或其他需要的类型）
    if ( ! $screen || $screen->base !== 'edit' ) return;

    $tenants        = tenant_filter_get_all_tenants();
    $selected       = isset( $_GET['filter_tenant_id'] ) ? sanitize_text_field( $_GET['filter_tenant_id'] ) : '';

    echo '<select name="filter_tenant_id" id="filter_tenant_id" style="margin-right:8px;">';
    echo '<option value="">-- 全部租户 --</option>';
    // 加入管理员默认选项
    $sel_default = selected( $selected, 'default', false );
    echo "<option value=\"default\" {$sel_default}>管理员（default）</option>";
    foreach ( $tenants as $t ) {
        $sel = selected( $selected, $t['tenant_id'], false );
        echo "<option value=\"{$t['tenant_id']}\" {$sel}>{$t['label']}</option>";
    }
    echo '</select>';
}
add_action( 'restrict_manage_posts', 'tenant_filter_add_dropdown' );

/**
 * 根据选中的租户过滤文章查询
 */
function tenant_filter_pre_get_posts( $query ) {
    if ( ! is_admin() )                  return;
    if ( ! tenant_filter_is_admin() )    return;
    if ( ! $query->is_main_query() )     return;

    $tenant_id = isset( $_GET['filter_tenant_id'] ) ? sanitize_text_field( $_GET['filter_tenant_id'] ) : '';
    if ( ! $tenant_id ) return;

    // 通过 meta_query 筛选 tenant_id 字段
    $meta_query = $query->get( 'meta_query' ) ?: [];
    $meta_query[] = [
        'key'     => 'tenant_id',
        'value'   => $tenant_id,
        'compare' => '=',
    ];
    $query->set( 'meta_query', $meta_query );
}
add_action( 'pre_get_posts', 'tenant_filter_pre_get_posts' );

/**
 * 在文章列表顶部显示当前筛选状态提示
 */
function tenant_filter_admin_notice() {
    if ( ! tenant_filter_is_admin() ) return;

    $screen = get_current_screen();
    if ( ! $screen || $screen->base !== 'edit' ) return;

    $tenant_id = isset( $_GET['filter_tenant_id'] ) ? sanitize_text_field( $_GET['filter_tenant_id'] ) : '';
    if ( ! $tenant_id ) return;

    // 找到租户名称
    $tenants = tenant_filter_get_all_tenants();
    $label   = $tenant_id;
    foreach ( $tenants as $t ) {
        if ( $t['tenant_id'] === $tenant_id ) {
            $label = $t['label'];
            break;
        }
    }

    echo "<div class='notice notice-info' style='margin:5px 0;padding:8px 12px;'>"
       . "📋 当前筛选租户：<strong>{$label}</strong>&nbsp;&nbsp;"
       . "<a href='" . remove_query_arg('filter_tenant_id') . "'>清除筛选</a>"
       . "</div>";
}
add_action( 'admin_notices', 'tenant_filter_admin_notice' );


