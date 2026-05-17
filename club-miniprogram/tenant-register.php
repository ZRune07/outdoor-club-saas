<?php
/**
 * Plugin Name: 租户注册系统
 * Description: 支持前台注册租户，带邀请分佣机制
 * Version: 1.0
 */

// 防止直接访问
if (!defined('ABSPATH')) exit;

// ==========================================
// 强制注册页面公开访问
// ==========================================
add_action('template_redirect', 'allow_public_access_to_register_page');

function allow_public_access_to_register_page() {
    // 检查是否是注册页面
    if (is_page('tenant-register') || is_page('租户注册')) {
        // 移除登录检查
        remove_action('template_redirect', 'wp_redirect_admin_locations', 1000);
    }
}

// ==========================================
// 1. 创建注册页面短代码
// ==========================================
add_shortcode('tenant_register_form', 'render_tenant_register_form');

function render_tenant_register_form() {
    // 确保加载 jQuery
    wp_enqueue_script('jquery');
    
    // 获取邀请人参数
    $inviter_code = isset($_GET['inviter']) ? sanitize_text_field($_GET['inviter']) : '';
    
    // 获取邀请人信息
    $inviter_info = null;
    if ($inviter_code) {
        global $wpdb;
        $table_name = $wpdb->prefix . 'inviters';
        $inviter_info = $wpdb->get_row($wpdb->prepare(
            "SELECT * FROM {$table_name} WHERE inviter_code = %s",
            $inviter_code
        ));
    }
    
    ob_start();
    ?>
    <div class="tenant-register-wrapper">
        <style>
            .tenant-register-wrapper {
                max-width: 600px;
                margin: 40px auto;
                padding: 30px;
                background: #fff;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .tenant-register-wrapper h2 {
                text-align: center;
                color: #333;
                margin-bottom: 30px;
            }
            .form-group {
                margin-bottom: 20px;
            }
            .form-group label {
                display: block;
                margin-bottom: 8px;
                color: #555;
                font-weight: 500;
            }
            .form-group input[type="text"],
            .form-group input[type="email"],
            .form-group input[type="password"],
            .form-group input[type="tel"] {
                width: 100%;
                padding: 12px;
                border: 1px solid #ddd;
                border-radius: 4px;
                font-size: 14px;
                box-sizing: border-box;
            }
            .form-group input[type="file"] {
                width: 100%;
                padding: 10px;
                border: 1px solid #ddd;
                border-radius: 4px;
            }
            .form-group .hint {
                font-size: 12px;
                color: #999;
                margin-top: 5px;
            }
            .submit-btn {
                width: 100%;
                padding: 14px;
                background: #FF6B00;
                color: #fff;
                border: none;
                border-radius: 4px;
                font-size: 16px;
                cursor: pointer;
                margin-top: 10px;
            }
            .submit-btn:hover {
                background: #e55f00;
            }
            .submit-btn:disabled {
                background: #ccc;
                cursor: not-allowed;
            }
            .message {
                padding: 12px;
                border-radius: 4px;
                margin-bottom: 20px;
                display: none;
            }
            .message.success {
                background: #d4edda;
                color: #155724;
                border: 1px solid #c3e6cb;
            }
            .message.error {
                background: #f8d7da;
                color: #721c24;
                border: 1px solid #f5c6cb;
            }
            .inviter-info {
                background: #e7f3ff;
                padding: 12px;
                border-radius: 4px;
                margin-bottom: 20px;
                font-size: 14px;
                color: #0066cc;
            }
            .inviter-card {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: #fff;
                padding: 20px;
                border-radius: 8px;
                margin-top: 30px;
                text-align: center;
            }
            .inviter-card h3 {
                margin: 0 0 15px 0;
                font-size: 18px;
                color: #fff;
            }
            .inviter-card .info-row {
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 30px;
                margin-top: 15px;
            }
            .inviter-card .info-item {
                display: flex;
                flex-direction: column;
                align-items: center;
            }
            .inviter-card .info-label {
                font-size: 12px;
                opacity: 0.9;
                margin-bottom: 5px;
            }
            .inviter-card .info-value {
                font-size: 16px;
                font-weight: bold;
            }
            .no-inviter-tip {
                background: #f8f9fa;
                padding: 15px;
                border-radius: 4px;
                margin-top: 30px;
                text-align: center;
                color: #666;
                font-size: 14px;
            }
        </style>

        <h2>会员注册</h2>

        <div style="background: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 4px; margin-bottom: 20px; text-align: center;">
            <p style="margin: 0; font-size: 15px; color: #856404;">
                📢 <strong>温馨提示</strong><br>
                申请完账户后，请联系管理员开通：<strong style="color: #FF6B00; font-size: 18px;">18653188848</strong>
            </p>
        </div>

        <div id="register-message" class="message"></div>

        <?php if ($inviter_info): ?>
            <div class="inviter-info" style="display:none;">
                ✨ 您通过邀请链接注册，邀请人：<strong><?php echo esc_html($inviter_info->inviter_name); ?></strong>
            </div>
        <?php endif; ?>

        <form id="tenant-register-form" enctype="multipart/form-data" autocomplete="off">
            <div class="form-group">
                <label>后台登录账号<span style="color:red;">*</span></label>
                <input type="text" name="tenant_id" required pattern="[a-z0-9_]+" 
                       autocomplete="off"
                       placeholder="例如：company123（只能包含小写字母、数字、下划线）">
                <div class="hint">用于后台登录，只能小写字母/数字/下划线，注册后不可修改</div>
            </div>

            <div class="form-group">
                <label>公司/组织名称<span style="color:red;">*</span></label>
                <input type="text" name="company_name" required placeholder="例如：某某科技有限公司">
            </div>

            <div class="form-group">
                <label>联系人姓名<span style="color:red;">*</span></label>
                <input type="text" name="contact_name" required placeholder="请输入您的姓名">
            </div>

            <div class="form-group">
                <label>联系电话<span style="color:red;">*</span></label>
                <input type="tel" name="phone" required pattern="[0-9]{11}" placeholder="请输入11位手机号">
            </div>

            <div class="form-group">
                <label>登录密码<span style="color:red;">*</span></label>
                <input type="password" name="password" required minlength="6" autocomplete="new-password" placeholder="至少6位字符">
                <div class="hint">登录时使用：登录账号 + 密码</div>
            </div>

            <input type="hidden" name="inviter" value="<?php echo esc_attr($inviter_code); ?>">
            <input type="hidden" name="action" value="tenant_register_submit">

            <button type="submit" class="submit-btn">立即注册</button>
        </form>
    </div>

    <script>
    // 确保 jQuery 已加载
    if (typeof jQuery === 'undefined') {
        console.error('jQuery 未加载！');
        alert('页面加载错误，请刷新重试');
    }
    
    jQuery(document).ready(function($) {
        console.log('注册表单脚本已加载');
        
        $('#tenant-register-form').on('submit', function(e) {
            console.log('表单提交事件触发');
            e.preventDefault();
            
            var $form = $(this);
            var $btn = $form.find('.submit-btn');
            var $message = $('#register-message');
            var formData = new FormData(this);
            
            // 禁用按钮
            $btn.prop('disabled', true).text('注册中...');
            $message.hide();
            
            console.log('开始发送 AJAX 请求');
            console.log('请求地址:', '<?php echo home_url('/tenant-register-handler.php'); ?>');
            
            $.ajax({
                url: '<?php echo home_url('/tenant-register-handler.php'); ?>',
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function(response) {
                    console.log('AJAX 响应:', response);
                    if (response.success) {
                        $message.removeClass('error').addClass('success')
                                .html('✅ ' + response.data.message).show();
                        $form[0].reset();
                        
                        // 3秒后跳转到首页
                        setTimeout(function() {
                            window.location.href = response.data.redirect_url;
                        }, 3000);
                    } else {
                        $message.removeClass('success').addClass('error')
                                .html('❌ ' + response.data.message).show();
                        $btn.prop('disabled', false).text('立即注册');
                    }
                },
                error: function(xhr, status, error) {
                    console.error('AJAX 错误:', {xhr: xhr, status: status, error: error});
                    $message.removeClass('success').addClass('error')
                            .html('❌ 网络错误，请稍后重试。错误信息: ' + error).show();
                    $btn.prop('disabled', false).text('立即注册');
                }
            });
        });
    });
    </script>
    <?php
    return ob_get_clean();
}

// ==========================================
// 2. 处理注册提交
// ==========================================
add_action('wp_ajax_nopriv_tenant_register_submit', 'handle_tenant_register_submit');
add_action('wp_ajax_tenant_register_submit', 'handle_tenant_register_submit');

// 在 AJAX 请求时关闭不必要的功能，节省内存
add_action('wp_ajax_nopriv_tenant_register_submit', 'tenant_register_reduce_memory', 1);
add_action('wp_ajax_tenant_register_submit', 'tenant_register_reduce_memory', 1);

function tenant_register_reduce_memory() {
    // 关闭不需要的功能，减少内存消耗
    remove_all_actions('plugins_loaded');
    remove_all_actions('widgets_init');
    if (!defined('DOING_AJAX')) define('DOING_AJAX', true);
}

function handle_tenant_register_submit() {
    // 增加内存限制，防止注册时内存溢出
    @ini_set('memory_limit', '256M');
    
    // 开启错误捕获，方便排查500错误
    set_error_handler(function($errno, $errstr, $errfile, $errline) {
        wp_send_json_error(['message' => '服务器错误：' . $errstr . '（第' . $errline . '行）']);
        exit;
    });
    
    try {
    // 验证必填字段
    $required_fields = ['tenant_id', 'company_name', 'contact_name', 'phone', 'password'];
    foreach ($required_fields as $field) {
        if (empty($_POST[$field])) {
            wp_send_json_error(['message' => '请填写所有必填项']);
        }
    }
    
    $tenant_id = sanitize_text_field($_POST['tenant_id']);
    $company_name = sanitize_text_field($_POST['company_name']);
    $contact_name = sanitize_text_field($_POST['contact_name']);
    $phone = sanitize_text_field($_POST['phone']);
    $password = $_POST['password'];
    $inviter = sanitize_text_field($_POST['inviter']);
    
    // 验证租户ID格式
    if (!preg_match('/^[a-z0-9_]+$/', $tenant_id)) {
        wp_send_json_error(['message' => '租户ID只能包含小写字母、数字和下划线']);
    }
    
    // 检查租户ID是否已存在
    if (tenant_id_exists($tenant_id)) {
        wp_send_json_error(['message' => '该租户ID已被使用，请更换']);
    }
    
    // 检查用户名是否已存在
    if (username_exists($tenant_id)) {
        wp_send_json_error(['message' => '该租户ID已被使用，请更换']);
    }
    
    // 处理 Logo 上传
    $logo_id = 0;
    if (!empty($_FILES['logo']['name'])) {
        require_once(ABSPATH . 'wp-admin/includes/file.php');
        require_once(ABSPATH . 'wp-admin/includes/image.php');
        require_once(ABSPATH . 'wp-admin/includes/media.php');
        
        $logo_id = media_handle_upload('logo', 0);
        if (is_wp_error($logo_id)) {
            wp_send_json_error(['message' => 'Logo上传失败：' . $logo_id->get_error_message()]);
        }
    }
    
    // 直接用底层数据库方法创建用户，完全绕过所有钩子和邮件通知，避免内存溢出
    global $wpdb;
    $user_pass = wp_hash_password($password);
    $user_email = $tenant_id . '@placeholder.local';
    $now = current_time('mysql');
    
    $insert_result = $wpdb->insert(
        $wpdb->users,
        [
            'user_login'          => $tenant_id,
            'user_pass'           => $user_pass,
            'user_email'          => $user_email,
            'user_registered'     => $now,
            'display_name'        => $contact_name,
            'user_status'         => 0
        ],
        ['%s', '%s', '%s', '%s', '%s', '%d']
    );
    
    if (!$insert_result) {
        wp_send_json_error(['message' => '用户创建失败，请重试']);
    }
    
    $user_id = $wpdb->insert_id;
    
    // 设置用户角色为待审核（无权限）
    $caps_key = $wpdb->prefix . 'capabilities';
    $wpdb->insert(
        $wpdb->usermeta,
        ['user_id' => $user_id, 'meta_key' => $caps_key, 'meta_value' => 'a:1:{s:14:"pending_tenant";b:1;}'],
        ['%d', '%s', '%s']
    );
    $wpdb->insert(
        $wpdb->usermeta,
        ['user_id' => $user_id, 'meta_key' => $wpdb->prefix . 'user_level', 'meta_value' => '0'],
        ['%d', '%s', '%s']
    );
    
    // 标记为待审核状态
    update_user_meta($user_id, 'account_status', 'pending');
    update_user_meta($user_id, 'registered_at', current_time('mysql'));
    
    // 保存租户信息
    update_user_meta($user_id, 'tenant_id', $tenant_id);
    update_user_meta($user_id, 'company_name', $company_name);
    update_user_meta($user_id, 'contact_name', $contact_name);
    update_user_meta($user_id, 'phone', $phone);
    
    if ($logo_id) {
        update_user_meta($user_id, 'company_logo', $logo_id);
    }
    
    // 保存邀请关系
    if (!empty($inviter)) {
        update_user_meta($user_id, 'inviter', $inviter);
        update_user_meta($user_id, 'invited_at', current_time('mysql'));
        
        // 记录邀请人的邀请列表
        $inviter_user = get_user_by('login', $inviter);
        if ($inviter_user) {
            $invited_list = get_user_meta($inviter_user->ID, 'invited_tenants', true);
            if (!is_array($invited_list)) {
                $invited_list = [];
            }
            $invited_list[] = [
                'tenant_id' => $tenant_id,
                'user_id' => $user_id,
                'registered_at' => current_time('mysql')
            ];
            update_user_meta($inviter_user->ID, 'invited_tenants', $invited_list);
        }
    }
    
    // 跳转回注册页面（显示成功消息后留在注册页）
    $register_page_obj = get_page_by_path('tenant-register') ?: get_page_by_path('租户注册');
    $redirect_url = $register_page_obj ? get_permalink($register_page_obj->ID) : home_url('/tenant-register/');
    
    wp_send_json_success([
        'message'      => '注册成功！请联系管理员开通账号：18653188848',
        'redirect_url' => $redirect_url
    ]);

    } catch (Exception $e) {
        wp_send_json_error(['message' => '服务器异常：' . $e->getMessage()]);
    } catch (Error $e) {
        wp_send_json_error(['message' => '服务器错误：' . $e->getMessage()]);
    }
}

// 检查租户ID是否存在
function tenant_id_exists($tenant_id) {
    global $wpdb;
    $count = $wpdb->get_var($wpdb->prepare(
        "SELECT COUNT(*) FROM {$wpdb->usermeta} WHERE meta_key = 'tenant_id' AND meta_value = %s",
        $tenant_id
    ));
    return $count > 0;
}

// ==========================================
// 3. 添加租户角色
// ==========================================
add_action('init', 'add_tenant_roles');

function add_tenant_roles() {
    // 待审核租户（无权限）
    if (!get_role('pending_tenant')) {
        add_role('pending_tenant', '待审核租户', [
            'read' => true
        ]);
    }
    
    // 正式租户（编辑权限）
    if (!get_role('tenant')) {
        add_role('tenant', '租户', [
            'read' => true,
            'edit_posts' => true,
            'delete_posts' => true,
            'publish_posts' => true,
            'upload_files' => true,
            'edit_published_posts' => true,
            'delete_published_posts' => true
        ]);
    }
}

// ==========================================
// 4. 管理员审核页面
// ==========================================
add_action('admin_menu', 'add_tenant_management_pages');

function add_tenant_management_pages() {
    // 租户审核页面
    add_menu_page(
        '租户审核',
        '租户审核',
        'manage_options',
        'tenant-approval',
        'render_tenant_approval_page',
        'dashicons-yes-alt',
        25
    );
    
    // 邀请人管理页面
    add_menu_page(
        '邀请人管理',
        '邀请人管理',
        'manage_options',
        'inviter-management',
        'render_inviter_management_page',
        'dashicons-admin-users',
        26
    );
    
    // 邀请统计页面
    add_menu_page(
        '邀请统计',
        '邀请统计',
        'manage_options',
        'invitation-stats',
        'render_invitation_stats_page',
        'dashicons-groups',
        30
    );
}

// 渲染租户审核页面
function render_tenant_approval_page() {
    // 处理审核操作
    if (isset($_GET['action']) && isset($_GET['user_id'])) {
        $user_id = intval($_GET['user_id']);
        $action = $_GET['action'];
        
        if ($action === 'approve') {
            approve_tenant($user_id);
            echo '<div class="notice notice-success"><p>✅ 已通过审核</p></div>';
        } elseif ($action === 'reject') {
            reject_tenant($user_id);
            echo '<div class="notice notice-success"><p>❌ 已拒绝申请</p></div>';
        }
    }
    
    // 获取待审核的租户
    $pending_users = get_users([
        'role' => 'pending_tenant',
        'orderby' => 'registered',
        'order' => 'DESC'
    ]);
    
    ?>
    <div class="wrap">
        <h1>租户审核</h1>
        
        <?php if (empty($pending_users)): ?>
            <p>暂无待审核的租户</p>
        <?php else: ?>
            <table class="wp-list-table widefat fixed striped">
                <thead>
                    <tr>
                        <th>租户ID</th>
                        <th>公司名称</th>
                        <th>联系人</th>
                        <th>手机</th>
                        <th>Logo</th>
                        <th>邀请人</th>
                        <th>注册时间</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($pending_users as $user): ?>
                        <?php
                        $tenant_id = get_user_meta($user->ID, 'tenant_id', true);
                        $company_name = get_user_meta($user->ID, 'company_name', true);
                        $contact_name = get_user_meta($user->ID, 'contact_name', true);
                        $phone = get_user_meta($user->ID, 'phone', true);
                        $logo_id = get_user_meta($user->ID, 'company_logo', true);
                        $inviter = get_user_meta($user->ID, 'inviter', true);
                        $registered_at = get_user_meta($user->ID, 'registered_at', true);
                        ?>
                        <tr>
                            <td><strong><?php echo esc_html($tenant_id); ?></strong></td>
                            <td><?php echo esc_html($company_name); ?></td>
                            <td><?php echo esc_html($contact_name); ?></td>
                            <td><?php echo esc_html($phone); ?></td>
                            <td>
                                <?php if ($logo_id): ?>
                                    <img src="<?php echo wp_get_attachment_url($logo_id); ?>" 
                                         style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;">
                                <?php else: ?>
                                    <span style="color: #999;">未上传</span>
                                <?php endif; ?>
                            </td>
                            <td><?php echo $inviter ? esc_html($inviter) : '-'; ?></td>
                            <td><?php echo $registered_at ? date('Y-m-d H:i', strtotime($registered_at)) : '-'; ?></td>
                            <td>
                                <a href="<?php echo admin_url('admin.php?page=tenant-approval&action=approve&user_id=' . $user->ID); ?>" 
                                   class="button button-primary" 
                                   onclick="return confirm('确认通过该租户的申请？')">
                                    通过
                                </a>
                                <a href="<?php echo admin_url('admin.php?page=tenant-approval&action=reject&user_id=' . $user->ID); ?>" 
                                   class="button button-link-delete" 
                                   onclick="return confirm('确认拒绝该租户的申请？用户账号将被删除。')">
                                    拒绝
                                </a>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        <?php endif; ?>
    </div>
    <?php
}

// 通过审核
function approve_tenant($user_id) {
    $user = new WP_User($user_id);
    
    $user->set_role('editor');
    
    // 更新状态
    update_user_meta($user_id, 'account_status', 'approved');
    update_user_meta($user_id, 'approved_at', current_time('mysql'));
}

// 拒绝申请
function reject_tenant($user_id) {
    // 删除用户
    require_once(ABSPATH . 'wp-admin/includes/user.php');
    wp_delete_user($user_id);
}

// ==========================================
// 5. 邀请人管理页面
// ==========================================
function render_inviter_management_page() {
    // 处理添加邀请人
    if (isset($_POST['add_inviter']) && check_admin_referer('add_inviter_action')) {
        $inviter_code = sanitize_text_field($_POST['inviter_code']);
        $inviter_name = sanitize_text_field($_POST['inviter_name']);
        $inviter_phone = sanitize_text_field($_POST['inviter_phone']);
        $commission_rate = floatval($_POST['commission_rate']);
        
        if (empty($inviter_code) || empty($inviter_name)) {
            echo '<div class="notice notice-error"><p>❌ 邀请码和姓名不能为空</p></div>';
        } elseif (inviter_code_exists($inviter_code)) {
            echo '<div class="notice notice-error"><p>❌ 该邀请码已存在</p></div>';
        } else {
            add_inviter($inviter_code, $inviter_name, $inviter_phone, $commission_rate);
            echo '<div class="notice notice-success"><p>✅ 邀请人添加成功</p></div>';
        }
    }
    
    // 处理删除邀请人
    if (isset($_GET['action']) && $_GET['action'] === 'delete' && isset($_GET['inviter_id'])) {
        delete_inviter(intval($_GET['inviter_id']));
        echo '<div class="notice notice-success"><p>✅ 已删除邀请人</p></div>';
    }
    
    // 获取所有邀请人
    global $wpdb;
    $table_name = $wpdb->prefix . 'inviters';
    $inviters = $wpdb->get_results("SELECT * FROM {$table_name} ORDER BY created_at DESC");
    
    // 动态获取注册页面URL（查找包含 tenant_register_form 短代码的页面）
    $register_page = get_pages([
        'meta_key'   => '_wp_page_template',
        'number'     => 1,
    ]);
    // 优先按slug查找，兼容中英文页面名
    $register_page_obj = get_page_by_path('tenant-register') ?: get_page_by_path('租户注册');
    $register_url = $register_page_obj ? get_permalink($register_page_obj->ID) : home_url('/tenant-register/');
    ?>
    <div class="wrap">
        <h1>邀请人管理</h1>
        
        <div style="background: #fff; padding: 20px; margin: 20px 0; border: 1px solid #ccc; border-radius: 4px;">
            <h2>添加邀请人</h2>
            <form method="post" action="">
                <?php wp_nonce_field('add_inviter_action'); ?>
                <table class="form-table">
                    <tr>
                        <th><label>邀请码（英文标识）<span style="color:red;">*</span></label></th>
                        <td>
                            <input type="text" name="inviter_code" required pattern="[a-zA-Z0-9_]+" 
                                   placeholder="例如：zhangsan" style="width: 300px;">
                            <p class="description">只能包含字母、数字、下划线，用于生成邀请链接</p>
                        </td>
                    </tr>
                    <tr>
                        <th><label>姓名<span style="color:red;">*</span></label></th>
                        <td>
                            <input type="text" name="inviter_name" required placeholder="例如：张三" style="width: 300px;">
                        </td>
                    </tr>
                    <tr>
                        <th><label>联系电话</label></th>
                        <td>
                            <input type="text" name="inviter_phone" placeholder="例如：13800138000" style="width: 300px;">
                        </td>
                    </tr>
                    <tr>
                        <th><label>佣金比例（%）</label></th>
                        <td>
                            <input type="number" name="commission_rate" value="0" min="0" max="100" step="0.01" style="width: 150px;">
                            <p class="description">预留字段，用于将来计算佣金</p>
                        </td>
                    </tr>
                </table>
                <p>
                    <button type="submit" name="add_inviter" class="button button-primary">添加邀请人</button>
                </p>
            </form>
        </div>
        
        <h2>邀请人列表</h2>
        <?php if (empty($inviters)): ?>
            <p>暂无邀请人</p>
        <?php else: ?>
            <table class="wp-list-table widefat fixed striped">
                <thead>
                    <tr>
                        <th>邀请码</th>
                        <th>姓名</th>
                        <th>联系电话</th>
                        <th>佣金比例</th>
                        <th>邀请人数</th>
                        <th>邀请链接</th>
                        <th>创建时间</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($inviters as $inviter): ?>
                        <?php
                        $invite_count = get_invite_count($inviter->inviter_code);
                        $invite_url = add_query_arg('inviter', $inviter->inviter_code, $register_url);
                        ?>
                        <tr>
                            <td><strong><?php echo esc_html($inviter->inviter_code); ?></strong></td>
                            <td><?php echo esc_html($inviter->inviter_name); ?></td>
                            <td><?php echo esc_html($inviter->phone ?: '-'); ?></td>
                            <td><?php echo esc_html($inviter->commission_rate); ?>%</td>
                            <td><strong><?php echo $invite_count; ?></strong> 人</td>
                            <td>
                                <input type="text" value="<?php echo esc_url($invite_url); ?>" 
                                       readonly onclick="this.select()" style="width: 100%; font-size: 12px;">
                                <button class="button button-small" onclick="copyToClipboard('<?php echo esc_js($invite_url); ?>')">
                                    复制链接
                                </button>
                            </td>
                            <td><?php echo date('Y-m-d H:i', strtotime($inviter->created_at)); ?></td>
                            <td>
                                <a href="<?php echo admin_url('admin.php?page=invitation-stats&inviter=' . $inviter->inviter_code); ?>" 
                                   class="button button-small">
                                    查看详情
                                </a>
                                <a href="<?php echo admin_url('admin.php?page=inviter-management&action=delete&inviter_id=' . $inviter->id); ?>" 
                                   class="button button-small button-link-delete" 
                                   onclick="return confirm('确认删除该邀请人？')">
                                    删除
                                </a>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        <?php endif; ?>
    </div>
    
    <script>
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(function() {
            alert('✅ 链接已复制到剪贴板');
        }, function() {
            alert('❌ 复制失败，请手动复制');
        });
    }
    </script>
    <?php
}

// 检查邀请码是否存在
function inviter_code_exists($inviter_code) {
    global $wpdb;
    $table_name = $wpdb->prefix . 'inviters';
    $count = $wpdb->get_var($wpdb->prepare(
        "SELECT COUNT(*) FROM {$table_name} WHERE inviter_code = %s",
        $inviter_code
    ));
    return $count > 0;
}

// 添加邀请人
function add_inviter($inviter_code, $inviter_name, $phone, $commission_rate) {
    global $wpdb;
    $table_name = $wpdb->prefix . 'inviters';
    
    $wpdb->insert($table_name, [
        'inviter_code' => $inviter_code,
        'inviter_name' => $inviter_name,
        'phone' => $phone,
        'commission_rate' => $commission_rate,
        'created_at' => current_time('mysql')
    ]);
}

// 删除邀请人
function delete_inviter($inviter_id) {
    global $wpdb;
    $table_name = $wpdb->prefix . 'inviters';
    $wpdb->delete($table_name, ['id' => $inviter_id]);
}

// 获取邀请人数
function get_invite_count($inviter_code) {
    global $wpdb;
    return $wpdb->get_var($wpdb->prepare(
        "SELECT COUNT(*) FROM {$wpdb->usermeta} WHERE meta_key = 'inviter' AND meta_value = %s",
        $inviter_code
    ));
}

// ==========================================
// 6. 创建邀请人数据表
// ==========================================

// 同时保留 activation hook（插件方式安装时用）
register_activation_hook(__FILE__, 'create_inviters_table');

// 只在后台运行时检查建表，避免前台每次请求都消耗内存
add_action('admin_init', 'create_inviters_table_if_not_exists');

function create_inviters_table_if_not_exists() {
    global $wpdb;
    $table_name = $wpdb->prefix . 'inviters';
    // 只在表不存在时才执行，避免每次请求都查询
    if ($wpdb->get_var("SHOW TABLES LIKE '{$table_name}'") !== $table_name) {
        create_inviters_table();
    }
}

function create_inviters_table() {
    global $wpdb;
    $table_name = $wpdb->prefix . 'inviters';
    $charset_collate = $wpdb->get_charset_collate();
    
    $sql = "CREATE TABLE IF NOT EXISTS {$table_name} (
        id bigint(20) NOT NULL AUTO_INCREMENT,
        inviter_code varchar(50) NOT NULL,
        inviter_name varchar(100) NOT NULL,
        phone varchar(20) DEFAULT NULL,
        commission_rate decimal(5,2) DEFAULT 0,
        created_at datetime NOT NULL,
        PRIMARY KEY (id),
        UNIQUE KEY inviter_code (inviter_code)
    ) {$charset_collate};";
    
    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    dbDelta($sql);
}

// ==========================================
// 7. 邀请统计页面（更新）
// ==========================================
function render_invitation_stats_page() {
    global $wpdb;
    
    // 如果指定了邀请人，显示详细信息
    if (isset($_GET['inviter'])) {
        $inviter_code = sanitize_text_field($_GET['inviter']);
        render_inviter_detail($inviter_code);
        return;
    }
    
    // 获取所有邀请人及其邀请数量
    $table_name = $wpdb->prefix . 'inviters';
    $inviters = $wpdb->get_results("
        SELECT i.*, 
               (SELECT COUNT(*) FROM {$wpdb->usermeta} WHERE meta_key = 'inviter' AND meta_value = i.inviter_code) as invite_count
        FROM {$table_name} i
        ORDER BY invite_count DESC
    ");
    
    ?>
    <div class="wrap">
        <h1>邀请统计</h1>
        <table class="wp-list-table widefat fixed striped">
            <thead>
                <tr>
                    <th>邀请人</th>
                    <th>邀请码</th>
                    <th>联系电话</th>
                    <th>邀请人数</th>
                    <th>佣金比例</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                <?php if (empty($inviters)): ?>
                    <tr><td colspan="6">暂无邀请记录</td></tr>
                <?php else: ?>
                    <?php foreach ($inviters as $inviter): ?>
                        <tr>
                            <td><?php echo esc_html($inviter->inviter_name); ?></td>
                            <td><code><?php echo esc_html($inviter->inviter_code); ?></code></td>
                            <td><?php echo esc_html($inviter->phone ?: '-'); ?></td>
                            <td><strong><?php echo $inviter->invite_count; ?></strong> 人</td>
                            <td><?php echo esc_html($inviter->commission_rate); ?>%</td>
                            <td>
                                <a href="<?php echo admin_url('admin.php?page=invitation-stats&inviter=' . $inviter->inviter_code); ?>">
                                    查看详情
                                </a>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                <?php endif; ?>
            </tbody>
        </table>
    </div>
    <?php
}

// 显示邀请人详细信息
function render_inviter_detail($inviter_code) {
    global $wpdb;
    
    // 获取邀请人信息
    $table_name = $wpdb->prefix . 'inviters';
    $inviter = $wpdb->get_row($wpdb->prepare(
        "SELECT * FROM {$table_name} WHERE inviter_code = %s",
        $inviter_code
    ));
    
    if (!$inviter) {
        echo '<div class="wrap"><h1>邀请人不存在</h1></div>';
        return;
    }
    
    // 获取该邀请人邀请的所有租户
    $invited_users = $wpdb->get_results($wpdb->prepare("
        SELECT u.ID, u.user_email, u.user_registered,
               m1.meta_value as tenant_id,
               m2.meta_value as company_name,
               m3.meta_value as contact_name,
               m4.meta_value as account_status
        FROM {$wpdb->users} u
        LEFT JOIN {$wpdb->usermeta} m1 ON u.ID = m1.user_id AND m1.meta_key = 'tenant_id'
        LEFT JOIN {$wpdb->usermeta} m2 ON u.ID = m2.user_id AND m2.meta_key = 'company_name'
        LEFT JOIN {$wpdb->usermeta} m3 ON u.ID = m3.user_id AND m3.meta_key = 'contact_name'
        LEFT JOIN {$wpdb->usermeta} m4 ON u.ID = m4.user_id AND m4.meta_key = 'account_status'
        WHERE EXISTS (
            SELECT 1 FROM {$wpdb->usermeta} 
            WHERE user_id = u.ID AND meta_key = 'inviter' AND meta_value = %s
        )
        ORDER BY u.user_registered DESC
    ", $inviter_code));
    
    ?>
    <div class="wrap">
        <h1>邀请详情：<?php echo esc_html($inviter->inviter_name); ?></h1>
        <p>
            <a href="<?php echo admin_url('admin.php?page=invitation-stats'); ?>">&larr; 返回列表</a>
        </p>
        
        <div style="background: #fff; padding: 20px; margin: 20px 0; border: 1px solid #ccc;">
            <h3>邀请人信息</h3>
            <p><strong>邀请码：</strong><?php echo esc_html($inviter->inviter_code); ?></p>
            <p><strong>姓名：</strong><?php echo esc_html($inviter->inviter_name); ?></p>
            <p><strong>电话：</strong><?php echo esc_html($inviter->phone ?: '-'); ?></p>
            <p><strong>佣金比例：</strong><?php echo esc_html($inviter->commission_rate); ?>%</p>
            <p><strong>累计邀请：</strong><?php echo count($invited_users); ?> 人</p>
        </div>
        
        <h3>邀请的租户列表</h3>
        <?php if (empty($invited_users)): ?>
            <p>暂无邀请记录</p>
        <?php else: ?>
            <table class="wp-list-table widefat fixed striped">
                <thead>
                    <tr>
                        <th>租户ID</th>
                        <th>公司名称</th>
                        <th>联系人</th>
                        <th>状态</th>
                        <th>注册时间</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($invited_users as $user): ?>
                        <tr>
                            <td><strong><?php echo esc_html($user->tenant_id); ?></strong></td>
                            <td><?php echo esc_html($user->company_name); ?></td>
                            <td><?php echo esc_html($user->contact_name); ?></td>
                            <td>
                                <?php if ($user->account_status === 'approved'): ?>
                                    <span style="color: green;">✅ 已通过</span>
                                <?php else: ?>
                                    <span style="color: orange;">⏳ 待审核</span>
                                <?php endif; ?>
                            </td>
                            <td><?php echo date('Y-m-d H:i', strtotime($user->user_registered)); ?></td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        <?php endif; ?>
    </div>
    <?php
}

// ==========================================
// 8. 租户订阅管理系统
// ==========================================

/**
 * 登录时检查订阅状态，过期或未开通则拒绝登录
 */
add_filter('authenticate', 'check_tenant_subscription_on_login', 30, 3);

function check_tenant_subscription_on_login($user, $username, $password) {
    // 如果前面已经验证失败，不做处理
    if (is_wp_error($user)) {
        return $user;
    }
    
    // 管理员不受限制
    if (user_can($user, 'manage_options')) {
        return $user;
    }
    
    // 待审核用户单独提示
    if (in_array('pending_tenant', (array)$user->roles)) {
        return new WP_Error(
            'account_pending',
            '您的账号正在审核中，请联系管理员开通：<strong>18653188848</strong>'
        );
    }
    
    // 检查订阅状态
    $status = get_tenant_subscription_status($user->ID);
    
    if ($status === 'none') {
        return new WP_Error(
            'subscription_none',
            '您的账号尚未开通服务，请联系管理员开通：<strong>18653188848</strong>'
        );
    }
    
    if ($status === 'expired') {
        $expire_date = get_user_meta($user->ID, 'paid_expire_date', true);
        return new WP_Error(
            'subscription_expired',
            '您的账号已于 <strong>' . esc_html($expire_date) . '</strong> 到期，请联系管理员续费：<strong>18653188848</strong>'
        );
    }
    
    // 状态正常（active / expiring），允许登录
    return $user;
}

/**
 * 注册后台菜单（订阅管理）
 */
add_action('admin_menu', 'add_subscription_management_menu');

function add_subscription_management_menu() {
    add_menu_page(
        '租户订阅管理',
        '订阅管理',
        'manage_options',
        'tenant-subscription',
        'render_tenant_subscription_page',
        'dashicons-calendar-alt',
        27
    );
}

/**
 * 获取用户订阅状态
 */
function get_tenant_subscription_status($user_id) {
    $expire_date = get_user_meta($user_id, 'paid_expire_date', true);
    
    if (empty($expire_date)) {
        return 'none'; // 从未付费
    }
    
    $today = current_time('Y-m-d');
    $expire = date('Y-m-d', strtotime($expire_date));
    $days_left = (strtotime($expire) - strtotime($today)) / 86400;
    
    if ($days_left < 0) {
        return 'expired'; // 已过期
    } elseif ($days_left <= 30) {
        return 'expiring'; // 即将到期（30天内）
    } else {
        return 'active'; // 正常
    }
}

/**
 * 获取剩余天数
 */
function get_tenant_days_left($user_id) {
    $expire_date = get_user_meta($user_id, 'paid_expire_date', true);
    if (empty($expire_date)) return null;
    
    $today = strtotime(current_time('Y-m-d'));
    $expire = strtotime(date('Y-m-d', strtotime($expire_date)));
    return (int)(($expire - $today) / 86400);
}

/**
 * 处理续费操作（AJAX）
 */
add_action('wp_ajax_tenant_renew_subscription', 'handle_tenant_renew_subscription');

function handle_tenant_renew_subscription() {
    check_ajax_referer('tenant_subscription_nonce', 'nonce');
    
    if (!current_user_can('manage_options')) {
        wp_send_json_error(['message' => '权限不足']);
    }
    
    $user_id   = intval($_POST['user_id']);
    $action    = sanitize_text_field($_POST['sub_action']); // activate | renew
    $note      = sanitize_text_field($_POST['note'] ?? '');
    
    $user = get_userdata($user_id);
    if (!$user) {
        wp_send_json_error(['message' => '用户不存在']);
    }
    
    $existing_expire = get_user_meta($user_id, 'paid_expire_date', true);
    $today = current_time('Y-m-d');
    
    if ($action === 'renew' && !empty($existing_expire)) {
        // 续费：从当前到期日顺延一年（未过期则从到期日算起，已过期则从今天算起）
        $base = strtotime($existing_expire) > strtotime($today)
            ? $existing_expire
            : $today;
        $new_expire = date('Y-m-d', strtotime($base . ' +1 year'));
    } else {
        // 首次开通：从今天起一年
        $new_expire = date('Y-m-d', strtotime($today . ' +1 year'));
    }
    
    // 如果是首次开通，记录开始日期
    if (empty($existing_expire)) {
        update_user_meta($user_id, 'paid_start_date', $today);
    }
    
    update_user_meta($user_id, 'paid_expire_date', $new_expire);
    update_user_meta($user_id, 'subscription_status', 'active');
    
    if (!empty($note)) {
        // 追加备注记录
        $history = get_user_meta($user_id, 'subscription_history', true);
        if (!is_array($history)) $history = [];
        $history[] = [
            'date'        => current_time('mysql'),
            'action'      => $action === 'renew' ? '续费' : '开通',
            'expire_date' => $new_expire,
            'note'        => $note,
            'operator'    => wp_get_current_user()->display_name,
        ];
        update_user_meta($user_id, 'subscription_history', $history);
    }
    
    wp_send_json_success([
        'message'     => ($action === 'renew' ? '续费' : '开通') . '成功！到期日：' . $new_expire,
        'expire_date' => $new_expire,
    ]);
}

/**
 * 渲染订阅管理主页面
 */
function render_tenant_subscription_page() {
    if (!current_user_can('manage_options')) {
        wp_die('权限不足');
    }
    
    // 获取所有正式租户（editor 角色）
    $all_tenants = get_users([
        'role__in' => ['editor', 'tenant'],
        'orderby'  => 'registered',
        'order'    => 'DESC',
    ]);
    
    // 分组：即将到期 / 已过期 / 正常 / 未付费
    $expiring = [];
    $expired  = [];
    $active   = [];
    $none     = [];
    
    foreach ($all_tenants as $u) {
        $status = get_tenant_subscription_status($u->ID);
        switch ($status) {
            case 'expiring': $expiring[] = $u; break;
            case 'expired':  $expired[]  = $u; break;
            case 'active':   $active[]   = $u; break;
            default:         $none[]     = $u; break;
        }
    }
    
    $nonce = wp_create_nonce('tenant_subscription_nonce');
    ?>
    <div class="wrap" id="tenant-subscription-wrap">
        <h1 style="display:flex;align-items:center;gap:10px;">
            <span class="dashicons dashicons-calendar-alt" style="font-size:28px;color:#FF6B00;"></span>
            租户订阅管理
        </h1>
        
        <!-- 统计卡片 -->
        <div style="display:flex;gap:15px;margin:20px 0;flex-wrap:wrap;">
            <div style="background:#fff8e1;border-left:4px solid #ff9800;padding:15px 25px;border-radius:4px;min-width:140px;">
                <div style="font-size:28px;font-weight:bold;color:#e65100;"><?php echo count($expiring); ?></div>
                <div style="color:#e65100;font-size:13px;margin-top:4px;">⚠️ 30天内到期</div>
            </div>
            <div style="background:#ffebee;border-left:4px solid #f44336;padding:15px 25px;border-radius:4px;min-width:140px;">
                <div style="font-size:28px;font-weight:bold;color:#c62828;"><?php echo count($expired); ?></div>
                <div style="color:#c62828;font-size:13px;margin-top:4px;">❌ 已过期</div>
            </div>
            <div style="background:#e8f5e9;border-left:4px solid #4caf50;padding:15px 25px;border-radius:4px;min-width:140px;">
                <div style="font-size:28px;font-weight:bold;color:#2e7d32;"><?php echo count($active); ?></div>
                <div style="color:#2e7d32;font-size:13px;margin-top:4px;">✅ 订阅正常</div>
            </div>
            <div style="background:#f5f5f5;border-left:4px solid #9e9e9e;padding:15px 25px;border-radius:4px;min-width:140px;">
                <div style="font-size:28px;font-weight:bold;color:#616161;"><?php echo count($none); ?></div>
                <div style="color:#616161;font-size:13px;margin-top:4px;">⭕ 未开通</div>
            </div>
        </div>
        
        <!-- 提示消息 -->
        <div id="sub-message" style="display:none;margin:10px 0;"></div>
        
        <!-- 即将到期 -->
        <?php if (!empty($expiring)): ?>
        <div style="background:#fff8e1;border:1px solid #ffe082;border-radius:4px;padding:15px;margin-bottom:20px;">
            <h3 style="margin:0 0 10px 0;color:#e65100;">⚠️ 即将到期（30天内），请尽快联系续费</h3>
            <?php render_subscription_table($expiring, $nonce, 'expiring'); ?>
        </div>
        <?php endif; ?>
        
        <!-- 已过期 -->
        <?php if (!empty($expired)): ?>
        <div style="background:#ffebee;border:1px solid #ffcdd2;border-radius:4px;padding:15px;margin-bottom:20px;">
            <h3 style="margin:0 0 10px 0;color:#c62828;">❌ 已过期租户</h3>
            <?php render_subscription_table($expired, $nonce, 'expired'); ?>
        </div>
        <?php endif; ?>
        
        <!-- 全部租户 -->
        <div style="background:#fff;border:1px solid #ddd;border-radius:4px;padding:15px;">
            <h3 style="margin:0 0 10px 0;">📋 全部租户订阅状态</h3>
            <?php render_subscription_table(array_merge($expiring, $expired, $active, $none), $nonce, 'all'); ?>
        </div>
    </div>
    
    <!-- 续费弹窗 -->
    <div id="renew-modal" style="display:none;position:fixed;top:0;left:0;right:0;bottom:0;z-index:100000;">
        <div style="position:absolute;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);" id="renew-modal-overlay"></div>
        <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background:#fff;border-radius:6px;box-shadow:0 8px 32px rgba(0,0,0,0.25);min-width:440px;max-width:520px;z-index:1;">
            <div style="padding:20px 24px;border-bottom:1px solid #eee;display:flex;justify-content:space-between;align-items:center;">
                <h2 style="margin:0;font-size:18px;" id="modal-title">开通/续费</h2>
                <button id="renew-modal-close" style="background:none;border:none;font-size:22px;cursor:pointer;color:#888;line-height:1;">&times;</button>
            </div>
            <div style="padding:20px 24px;">
                <p id="modal-user-info" style="background:#f5f5f5;padding:10px;border-radius:4px;margin:0 0 16px 0;"></p>
                <div style="margin-bottom:14px;">
                    <label style="display:block;margin-bottom:6px;font-weight:500;">操作类型</label>
                    <select id="modal-action" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:4px;">
                        <option value="activate">首次开通（从今天起 +1年）</option>
                        <option value="renew">续费（从到期日顺延 +1年）</option>
                    </select>
                </div>
                <div style="margin-bottom:14px;">
                    <label style="display:block;margin-bottom:6px;font-weight:500;">备注（付款方式/金额等，可选）</label>
                    <input type="text" id="modal-note" placeholder="例如：微信转账 500元" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:4px;box-sizing:border-box;">
                </div>
                <p id="modal-expire-preview" style="color:#666;font-size:13px;margin:0;"></p>
            </div>
            <div style="padding:15px 24px;border-top:1px solid #eee;text-align:right;">
                <button class="button button-secondary" id="renew-modal-cancel" style="margin-right:10px;">取消</button>
                <button class="button button-primary" id="renew-modal-confirm" style="background:#FF6B00;border-color:#FF6B00;">确认</button>
            </div>
        </div>
    </div>
    
    <script>
    (function($) {
        var currentUserId = null;
        var currentExpire = null;
        var nonce = '<?php echo $nonce; ?>';
        
        // 打开续费弹窗
        $(document).on('click', '.btn-renew', function() {
            currentUserId = $(this).data('user-id');
            currentExpire = $(this).data('expire');
            var userName  = $(this).data('user-name');
            var tenantId  = $(this).data('tenant-id');
            
            $('#modal-title').text('开通 / 续费');
            $('#modal-user-info').html(
                '<strong>' + userName + '</strong>（' + tenantId + '）' +
                (currentExpire ? '<br>当前到期日：<strong>' + currentExpire + '</strong>' : '<br>当前状态：<strong style="color:#999;">未开通</strong>')
            );
            
            // 如果已有到期日，默认选续费
            if (currentExpire) {
                $('#modal-action').val('renew');
            } else {
                $('#modal-action').val('activate');
            }
            
            updatePreview();
            $('#renew-modal').show();
            $('#modal-note').focus();
        });
        
        // 实时预览到期日
        function updatePreview() {
            var action = $('#modal-action').val();
            var today = new Date();
            var base;
            
            if (action === 'renew' && currentExpire) {
                var expireDate = new Date(currentExpire);
                base = expireDate > today ? expireDate : today;
            } else {
                base = today;
            }
            
            var newExpire = new Date(base);
            newExpire.setFullYear(newExpire.getFullYear() + 1);
            var str = newExpire.getFullYear() + '-' +
                      String(newExpire.getMonth()+1).padStart(2,'0') + '-' +
                      String(newExpire.getDate()).padStart(2,'0');
            $('#modal-expire-preview').html('操作后新到期日：<strong style="color:#FF6B00;">' + str + '</strong>');
        }
        
        $('#modal-action').on('change', updatePreview);
        
        // 关闭弹窗
        $('#renew-modal-close, #renew-modal-cancel, #renew-modal-overlay').on('click', function() {
            $('#renew-modal').hide();
        });
        
        // 确认续费
        $('#renew-modal-confirm').on('click', function() {
            var $btn = $(this);
            $btn.prop('disabled', true).text('处理中...');
            
            $.ajax({
                url: ajaxurl,
                type: 'POST',
                data: {
                    action:     'tenant_renew_subscription',
                    nonce:      nonce,
                    user_id:    currentUserId,
                    sub_action: $('#modal-action').val(),
                    note:       $('#modal-note').val()
                },
                success: function(res) {
                    if (res.success) {
                        $('#sub-message').html(
                            '<div class="notice notice-success inline" style="margin:0;"><p>' + res.data.message + '</p></div>'
                        ).show();
                        $('#renew-modal').hide();
                        // 延迟刷新页面
                        setTimeout(function() { location.reload(); }, 1200);
                    } else {
                        alert('操作失败：' + (res.data ? res.data.message : '未知错误'));
                        $btn.prop('disabled', false).text('确认');
                    }
                },
                error: function() {
                    alert('网络错误，请重试');
                    $btn.prop('disabled', false).text('确认');
                }
            });
        });
        
    })(jQuery);
    </script>
    <?php
}

/**
 * 渲染订阅状态表格
 */
function render_subscription_table($users, $nonce, $context = 'all') {
    if (empty($users)) {
        echo '<p style="color:#999;margin:0;">暂无数据</p>';
        return;
    }
    ?>
    <table class="wp-list-table widefat fixed striped" style="background:#fff;">
        <thead>
            <tr>
                <th style="width:120px;">租户ID</th>
                <th>公司名称</th>
                <th style="width:90px;">联系人</th>
                <th style="width:110px;">开通日期</th>
                <th style="width:110px;">到期日期</th>
                <th style="width:110px;">剩余时间</th>
                <th style="width:80px;">状态</th>
                <th style="width:130px;">操作</th>
            </tr>
        </thead>
        <tbody>
        <?php foreach ($users as $u):
            $tenant_id    = get_user_meta($u->ID, 'tenant_id', true) ?: $u->user_login;
            $company_name = get_user_meta($u->ID, 'company_name', true) ?: $u->display_name;
            $contact_name = get_user_meta($u->ID, 'contact_name', true);
            $start_date   = get_user_meta($u->ID, 'paid_start_date', true);
            $expire_date  = get_user_meta($u->ID, 'paid_expire_date', true);
            $status       = get_tenant_subscription_status($u->ID);
            $days_left    = get_tenant_days_left($u->ID);
            
            // 状态样式
            switch ($status) {
                case 'active':
                    $badge = '<span style="background:#4caf50;color:#fff;padding:2px 8px;border-radius:10px;font-size:11px;">正常</span>';
                    $row_style = '';
                    break;
                case 'expiring':
                    $badge = '<span style="background:#ff9800;color:#fff;padding:2px 8px;border-radius:10px;font-size:11px;">即将到期</span>';
                    $row_style = 'background:#fffde7;';
                    break;
                case 'expired':
                    $badge = '<span style="background:#f44336;color:#fff;padding:2px 8px;border-radius:10px;font-size:11px;">已过期</span>';
                    $row_style = 'background:#ffebee;';
                    break;
                default:
                    $badge = '<span style="background:#9e9e9e;color:#fff;padding:2px 8px;border-radius:10px;font-size:11px;">未开通</span>';
                    $row_style = '';
            }
            
            // 剩余天数显示
            if ($days_left === null) {
                $days_str = '<span style="color:#999;">—</span>';
            } elseif ($days_left < 0) {
                $days_str = '<span style="color:#f44336;font-weight:bold;">已过期 ' . abs($days_left) . ' 天</span>';
            } elseif ($days_left <= 30) {
                $days_str = '<span style="color:#ff9800;font-weight:bold;">还剩 ' . $days_left . ' 天</span>';
            } else {
                $days_str = '<span style="color:#2e7d32;">还剩 ' . $days_left . ' 天</span>';
            }
        ?>
            <tr style="<?php echo $row_style; ?>">
                <td><strong><?php echo esc_html($tenant_id); ?></strong></td>
                <td><?php echo esc_html($company_name); ?></td>
                <td><?php echo esc_html($contact_name ?: '—'); ?></td>
                <td style="color:#666;font-size:13px;"><?php echo $start_date ? esc_html($start_date) : '<span style="color:#999;">—</span>'; ?></td>
                <td style="font-size:13px;"><?php echo $expire_date ? '<strong>' . esc_html($expire_date) . '</strong>' : '<span style="color:#999;">—</span>'; ?></td>
                <td><?php echo $days_str; ?></td>
                <td><?php echo $badge; ?></td>
                <td>
                    <button class="button button-primary btn-renew"
                        style="background:#FF6B00;border-color:#e55f00;font-size:12px;padding:3px 10px;height:auto;"
                        data-user-id="<?php echo $u->ID; ?>"
                        data-tenant-id="<?php echo esc_attr($tenant_id); ?>"
                        data-user-name="<?php echo esc_attr($company_name); ?>"
                        data-expire="<?php echo esc_attr($expire_date); ?>">
                        <?php echo $expire_date ? '续费 +1年' : '立即开通'; ?>
                    </button>
                    <?php
                    $history = get_user_meta($u->ID, 'subscription_history', true);
                    if (!empty($history)):
                        $last = end($history);
                    ?>
                    <br><small style="color:#999;font-size:11px;"><?php echo esc_html($last['date']); ?> <?php echo esc_html($last['note'] ?: ''); ?></small>
                    <?php endif; ?>
                </td>
            </tr>
        <?php endforeach; ?>
        </tbody>
    </table>
    <?php
}

// ==========================================
// 9. 仪表盘小组件：即将到期提醒
// ==========================================
add_action('wp_dashboard_setup', 'add_subscription_dashboard_widget');

function add_subscription_dashboard_widget() {
    if (!current_user_can('manage_options')) return;
    wp_add_dashboard_widget(
        'tenant_subscription_widget',
        '📅 租户订阅到期提醒',
        'render_subscription_dashboard_widget'
    );
}

function render_subscription_dashboard_widget() {
    $all_tenants = get_users([
        'role__in' => ['editor', 'tenant'],
    ]);
    
    $expiring = [];
    $expired  = [];
    
    foreach ($all_tenants as $u) {
        $status = get_tenant_subscription_status($u->ID);
        if ($status === 'expiring') $expiring[] = $u;
        if ($status === 'expired')  $expired[]  = $u;
    }
    
    if (empty($expiring) && empty($expired)) {
        echo '<p style="color:#4caf50;">✅ 所有租户订阅状态正常，无需跟进。</p>';
        echo '<p style="margin:0;"><a href="' . admin_url('admin.php?page=tenant-subscription') . '">查看全部订阅状态 →</a></p>';
        return;
    }
    
    if (!empty($expiring)) {
        echo '<p style="font-weight:bold;color:#e65100;margin:0 0 8px 0;">⚠️ 30天内即将到期（' . count($expiring) . ' 人）</p>';
        echo '<table style="width:100%;border-collapse:collapse;">';
        foreach ($expiring as $u) {
            $company    = get_user_meta($u->ID, 'company_name', true) ?: $u->display_name;
            $tenant_id  = get_user_meta($u->ID, 'tenant_id', true) ?: $u->user_login;
            $expire     = get_user_meta($u->ID, 'paid_expire_date', true);
            $days_left  = get_tenant_days_left($u->ID);
            $phone      = get_user_meta($u->ID, 'phone', true);
            $color      = $days_left <= 7 ? '#f44336' : '#ff9800';
            echo '<tr style="border-bottom:1px solid #f0f0f0;">';
            echo '<td style="padding:6px 4px;"><strong>' . esc_html($company) . '</strong><br><small style="color:#999;">' . esc_html($tenant_id) . '</small></td>';
            echo '<td style="padding:6px 4px;color:#666;font-size:12px;">' . esc_html($expire) . '</td>';
            echo '<td style="padding:6px 4px;"><span style="color:' . $color . ';font-weight:bold;">' . $days_left . '天</span></td>';
            if ($phone) echo '<td style="padding:6px 4px;font-size:12px;color:#666;">' . esc_html($phone) . '</td>';
            echo '</tr>';
        }
        echo '</table>';
    }
    
    if (!empty($expired)) {
        echo '<p style="font-weight:bold;color:#c62828;margin:12px 0 8px 0;">❌ 已过期（' . count($expired) . ' 人）</p>';
        echo '<table style="width:100%;border-collapse:collapse;">';
        foreach ($expired as $u) {
            $company   = get_user_meta($u->ID, 'company_name', true) ?: $u->display_name;
            $tenant_id = get_user_meta($u->ID, 'tenant_id', true) ?: $u->user_login;
            $expire    = get_user_meta($u->ID, 'paid_expire_date', true);
            $phone     = get_user_meta($u->ID, 'phone', true);
            echo '<tr style="border-bottom:1px solid #f0f0f0;">';
            echo '<td style="padding:6px 4px;"><strong>' . esc_html($company) . '</strong><br><small style="color:#999;">' . esc_html($tenant_id) . '</small></td>';
            echo '<td style="padding:6px 4px;color:#f44336;font-size:12px;font-weight:bold;">' . esc_html($expire) . '</td>';
            if ($phone) echo '<td style="padding:6px 4px;font-size:12px;color:#666;">' . esc_html($phone) . '</td>';
            echo '</tr>';
        }
        echo '</table>';
    }
    
    echo '<p style="margin:12px 0 0 0;"><a href="' . admin_url('admin.php?page=tenant-subscription') . '" class="button button-primary" style="background:#FF6B00;border-color:#e55f00;">前往订阅管理</a></p>';
}
    
