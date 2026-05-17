<?php
/**
 * Plugin Name: 文章报名配置
 * Description: 为文章添加报名和电子协议功能配置
 * Version: 1.0
 */

// 防止直接访问
if (!defined('ABSPATH')) exit;

// ==========================================
// 1. 添加文章元数据字段
// ==========================================

// 添加文章编辑页面的自定义字段
add_action('add_meta_boxes', 'add_enrollment_meta_boxes');

function add_enrollment_meta_boxes() {
    add_meta_box(
        'enrollment_config',
        '报名配置',
        'render_enrollment_meta_box',
        'post',
        'side',
        'default'
    );
}

// 渲染报名配置元数据框
function render_enrollment_meta_box($post) {
    // 获取现有值
    $enable_enrollment = get_post_meta($post->ID, 'enable_enrollment', true);
    $enable_agreement = get_post_meta($post->ID, 'enable_agreement', true);
    $agreement_content = get_post_meta($post->ID, 'agreement_content', true);
    
    // 安全字段
    wp_nonce_field('save_enrollment_config', 'enrollment_config_nonce');
    
    ?>
    <div class="enrollment-meta-box">
        <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px;">
                <input type="checkbox" name="enable_enrollment" value="1" <?php checked($enable_enrollment, '1'); ?>>
                启用报名功能
            </label>
            <p style="font-size: 12px; color: #666; margin-top: 5px;">启用后，文章详情页将显示报名按钮</p>
        </div>
        
        <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px;">
                <input type="checkbox" name="enable_agreement" value="1" <?php checked($enable_agreement, '1'); ?>>
                启用电子协议
            </label>
            <p style="font-size: 12px; color: #666; margin-top: 5px;">启用后，报名成功后将显示电子协议签署界面</p>
        </div>
        
        <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px;">协议内容</label>
            <textarea name="agreement_content" rows="6" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 12px;"><?php echo esc_textarea($agreement_content); ?></textarea>
            <p style="font-size: 12px; color: #666; margin-top: 5px;">支持HTML格式，留空则使用默认协议</p>
        </div>
    </div>
    <?php
}

// 保存文章元数据
add_action('save_post', 'save_enrollment_config');

function save_enrollment_config($post_id) {
    // 验证非ce字段
    if (!isset($_POST['enrollment_config_nonce']) || !wp_verify_nonce($_POST['enrollment_config_nonce'], 'save_enrollment_config')) {
        return;
    }
    
    // 验证用户权限
    if (!current_user_can('edit_post', $post_id)) {
        return;
    }
    
    // 保存启用报名功能
    if (isset($_POST['enable_enrollment'])) {
        update_post_meta($post_id, 'enable_enrollment', '1');
    } else {
        delete_post_meta($post_id, 'enable_enrollment');
    }
    
    // 保存启用电子协议
    if (isset($_POST['enable_agreement'])) {
        update_post_meta($post_id, 'enable_agreement', '1');
    } else {
        delete_post_meta($post_id, 'enable_agreement');
    }
    
    // 保存协议内容
    if (isset($_POST['agreement_content'])) {
        update_post_meta($post_id, 'agreement_content', wp_kses_post($_POST['agreement_content']));
    } else {
        delete_post_meta($post_id, 'agreement_content');
    }
}

// ==========================================
// 2. 添加REST API端点
// ==========================================

// 注册REST API端点
add_action('rest_api_init', 'register_enrollment_rest_endpoints');

function register_enrollment_rest_endpoints() {
    // 获取文章报名配置
    register_rest_route('minip/v1', '/post-enrollment/(?P<id>\d+)', array(
        'methods' => 'GET',
        'callback' => 'get_post_enrollment_config',
        'permission_callback' => '__return_true'
    ));
    
    // 提交报名信息
    register_rest_route('minip/v1', '/enrollments', array(
        'methods' => 'POST',
        'callback' => 'submit_enrollment',
        'permission_callback' => '__return_true'
    ));
    
    // 提交电子协议
    register_rest_route('minip/v1', '/agreements', array(
        'methods' => 'POST',
        'callback' => 'submit_agreement',
        'permission_callback' => '__return_true'
    ));
}

// 获取文章报名配置
function get_post_enrollment_config($request) {
    $post_id = $request['id'];
    
    $config = array(
        'enable_enrollment' => get_post_meta($post_id, 'enable_enrollment', true) === '1',
        'enable_agreement' => get_post_meta($post_id, 'enable_agreement', true) === '1',
        'agreement_content' => get_post_meta($post_id, 'agreement_content', true)
    );
    
    return rest_ensure_response($config);
}

// 提交报名信息
function submit_enrollment($request) {
    $params = $request->get_params();
    
    // 验证必填字段
    $required_fields = array('tenantId', 'postId', 'name', 'phone', 'participantCount');
    foreach ($required_fields as $field) {
        if (empty($params[$field])) {
            return new WP_Error('missing_field', sprintf('缺少必填字段: %s', $field), array('status' => 400));
        }
    }
    
    // 构建报名数据
    $enrollment_data = array(
        'tenantId' => sanitize_text_field($params['tenantId']),
        'postId' => sanitize_text_field($params['postId']),
        'name' => sanitize_text_field($params['name']),
        'phone' => sanitize_text_field($params['phone']),
        'email' => isset($params['email']) ? sanitize_email($params['email']) : '',
        'participantCount' => intval($params['participantCount']),
        'message' => isset($params['message']) ? sanitize_text_field($params['message']) : '',
        'status' => 'pending',
        'employeeId' => isset($params['employeeId']) ? sanitize_text_field($params['employeeId']) : 'default',
        'createdAt' => current_time('mysql')
    );
    
    // 这里可以保存到数据库或云存储
    // 暂时返回成功响应
    return rest_ensure_response(array(
        'success' => true,
        'message' => '报名提交成功',
        'data' => $enrollment_data
    ));
}

// 提交电子协议
function submit_agreement($request) {
    $params = $request->get_params();
    
    // 验证必填字段
    $required_fields = array('tenantId', 'postId', 'enrollmentId', 'content', 'signature', 'signerName', 'signerPhone');
    foreach ($required_fields as $field) {
        if (empty($params[$field])) {
            return new WP_Error('missing_field', sprintf('缺少必填字段: %s', $field), array('status' => 400));
        }
    }
    
    // 构建协议数据
    $agreement_data = array(
        'tenantId' => sanitize_text_field($params['tenantId']),
        'enrollmentId' => sanitize_text_field($params['enrollmentId']),
        'postId' => sanitize_text_field($params['postId']),
        'content' => wp_kses_post($params['content']),
        'signature' => sanitize_text_field($params['signature']),
        'signerName' => sanitize_text_field($params['signerName']),
        'signerPhone' => sanitize_text_field($params['signerPhone']),
        'status' => 'signed',
        'signedAt' => current_time('mysql'),
        'createdAt' => current_time('mysql')
    );
    
    // 这里可以保存到数据库或云存储
    // 暂时返回成功响应
    return rest_ensure_response(array(
        'success' => true,
        'message' => '协议签署成功',
        'data' => $agreement_data
    ));
}

// ==========================================
// 3. 添加管理页面
// ==========================================

// 添加管理菜单
add_action('admin_menu', 'add_enrollment_management_menu');

function add_enrollment_management_menu() {
    add_menu_page(
        '报名管理',
        '报名管理',
        'manage_options',
        'enrollment-management',
        'render_enrollment_management_page',
        'dashicons-clipboard',
        28
    );
}

// 渲染报名管理页面
function render_enrollment_management_page() {
    // 这里可以添加报名记录管理功能
    ?>
    <div class="wrap">
        <h1>报名管理</h1>
        <p>报名记录管理功能开发中...</p>
    </div>
    <?php
}

// ==========================================
// 4. 前端显示控制
// ==========================================

// 在文章详情页添加报名按钮控制
add_filter('the_content', 'add_enrollment_button_to_content');

function add_enrollment_button_to_content($content) {
    // 只在文章详情页显示
    if (!is_single()) {
        return $content;
    }
    
    global $post;
    $enable_enrollment = get_post_meta($post->ID, 'enable_enrollment', true);
    
    if ($enable_enrollment === '1') {
        // 这里可以添加前端报名按钮
        // 暂时只添加一个标记
        $content .= '<div class="enrollment-button-container"></div>';
    }
    
    return $content;
}
