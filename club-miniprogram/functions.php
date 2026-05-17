<?php
/**
 * Twenty Twenty-Five functions and definitions.
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package WordPress
 * @subpackage Twenty_Twenty_Five
 * @since Twenty Twenty-Five 1.0
 */

// Adds theme support for post formats.
if ( ! function_exists( 'twentytwentyfive_post_format_setup' ) ) :
	function twentytwentyfive_post_format_setup() {
		add_theme_support( 'post-formats', array( 'aside', 'audio', 'chat', 'gallery', 'image', 'link', 'quote', 'status', 'video' ) );
	}
endif;
add_action( 'after_setup_theme', 'twentytwentyfive_post_format_setup' );

// Enqueues editor-style.css in the editors.
if ( ! function_exists( 'twentytwentyfive_editor_style' ) ) :
	function twentytwentyfive_editor_style() {
		add_editor_style( 'assets/css/editor-style.css' );
	}
endif;
add_action( 'after_setup_theme', 'twentytwentyfive_editor_style' );

// Enqueues the theme stylesheet on the front.
if ( ! function_exists( 'twentytwentyfive_enqueue_styles' ) ) :
	function twentytwentyfive_enqueue_styles() {
		$suffix = SCRIPT_DEBUG ? '' : '.min';
		$src    = 'style' . $suffix . '.css';

		wp_enqueue_style(
			'twentytwentyfive-style',
			get_parent_theme_file_uri( $src ),
			array(),
			wp_get_theme()->get( 'Version' )
		);
		wp_style_add_data(
			'twentytwentyfive-style',
			'path',
			get_parent_theme_file_path( $src )
		);
	}
endif;
add_action( 'wp_enqueue_scripts', 'twentytwentyfive_enqueue_styles' );

// Registers custom block styles.
if ( ! function_exists( 'twentytwentyfive_block_styles' ) ) :
	function twentytwentyfive_block_styles() {
		register_block_style(
			'core/list',
			array(
				'name'         => 'checkmark-list',
				'label'        => __( 'Checkmark', 'twentytwentyfive' ),
				'inline_style' => '
				ul.is-style-checkmark-list {
					list-style-type: "\2713";
				}

				ul.is-style-checkmark-list li {
					padding-inline-start: 1ch;
				}',
			)
		);
	}
endif;
add_action( 'init', 'twentytwentyfive_block_styles' );

// Registers pattern categories.
if ( ! function_exists( 'twentytwentyfive_pattern_categories' ) ) :
	function twentytwentyfive_pattern_categories() {

		register_block_pattern_category(
			'twentytwentyfive_page',
			array(
				'label'       => __( 'Pages', 'twentytwentyfive' ),
				'description' => __( 'A collection of full page layouts.', 'twentytwentyfive' ),
			)
		);

		register_block_pattern_category(
			'twentytwentyfive_post-format',
			array(
				'label'       => __( 'Post formats', 'twentytwentyfive' ),
				'description' => __( 'A collection of post format patterns.', 'twentytwentyfive' ),
			)
		);
	}
endif;
add_action( 'init', 'twentytwentyfive_pattern_categories' );

// Registers block binding sources.
if ( ! function_exists( 'twentytwentyfive_register_block_bindings' ) ) :
	function twentytwentyfive_register_block_bindings() {
		register_block_bindings_source(
			'twentytwentyfive/format',
			array(
				'label'              => _x( 'Post format name', 'Label for the block binding placeholder in the editor', 'twentytwentyfive' ),
				'get_value_callback' => 'twentytwentyfive_format_binding',
			)
		);
	}
endif;
add_action( 'init', 'twentytwentyfive_register_block_bindings' );

// Registers block binding callback function for the post format name.
if ( ! function_exists( 'twentytwentyfive_format_binding' ) ) :
	function twentytwentyfive_format_binding() {
		$post_format_slug = get_post_format();

		if ( $post_format_slug && 'standard' !== $post_format_slug ) {
			return get_post_format_string( $post_format_slug );
		}
	}
endif;


// ==========================================
// 多租户系统 - 完整版
// ==========================================

if (!defined('ABSPATH')) {
    exit;
}

// ==========================================
// 1. 租户隔离功能
// ==========================================

class Tenant_Isolation_System {
    
    public function __construct() {
        // 后台权限控制
        add_filter('map_meta_cap', array($this, 'restrict_post_editing'), 10, 4);
        add_action('pre_get_posts', array($this, 'filter_posts_by_author'));
        add_action('pre_get_posts', array($this, 'filter_tenant_configs'));
        
        // 自动添加 tenant_id
        add_action('save_post', array($this, 'auto_add_tenant_id'), 10, 3);
        
        // 后台界面增强
        add_filter('manage_posts_columns', array($this, 'add_author_column'));
        add_action('manage_posts_custom_column', array($this, 'show_author_column'), 10, 2);
        add_filter('manage_tenant_config_posts_columns', array($this, 'add_tenant_id_column'));
        add_action('manage_tenant_config_posts_custom_column', array($this, 'show_tenant_id_column'), 10, 2);
        
        // REST API 租户隔离
        add_filter('rest_post_query', array($this, 'filter_rest_api_posts'), 10, 2);
        add_filter('rest_prepare_post', array($this, 'filter_rest_api_response'), 10, 3);
        
        // REST API 权限开放（只读）
        add_filter('rest_authentication_errors', array($this, 'allow_rest_api_read'), 99);
    }
    
    /**
     * 限制文章编辑权限
     */
    public function restrict_post_editing($caps, $cap, $user_id, $args) {
        if ($cap !== 'edit_post' && $cap !== 'delete_post') {
            return $caps;
        }
        
        if (user_can($user_id, 'manage_options')) {
            return $caps;
        }
        
        $post_id = isset($args[0]) ? $args[0] : 0;
        if (!$post_id) {
            return $caps;
        }
        
        $post = get_post($post_id);
        if (!$post || $post->post_type === 'tenant_config') {
            return $caps;
        }
        
        $post_author = $post->post_author;
        if (user_can($post_author, 'manage_options') || $post_author != $user_id) {
            $caps[] = 'do_not_allow';
        }
        
        return $caps;
    }
    
    /**
     * 过滤后台文章列表
     */
    public function filter_posts_by_author($query) {
        if (!is_admin() || !$query->is_main_query()) {
            return;
        }
        
        if (current_user_can('manage_options')) {
            return;
        }
        
        $post_type = $query->get('post_type');
        if ($post_type === 'tenant_config') {
            return;
        }
        
        $admin_users = get_users(array(
            'role' => 'administrator',
            'fields' => 'ID'
        ));
        
        global $user_ID;
        $allowed_authors = array_merge(array($user_ID), $admin_users);
        
        $query->set('author__in', $allowed_authors);
    }
    
    /**
     * 过滤租户配置列表
     */
    public function filter_tenant_configs($query) {
        if (!is_admin() || !$query->is_main_query()) {
            return;
        }
        
        if (current_user_can('manage_options')) {
            return;
        }
        
        $post_type = $query->get('post_type');
        if ($post_type !== 'tenant_config') {
            return;
        }
        
        global $user_ID;
        $current_user = get_userdata($user_ID);
        $user_tenant_id = get_user_meta($user_ID, 'tenant_id', true);
        
        if (empty($user_tenant_id)) {
            $user_tenant_id = $current_user->user_login;
        }
        
        $meta_query = array(
            array(
                'key' => 'tenant_id',
                'value' => $user_tenant_id,
                'compare' => '='
            )
        );
        
        $query->set('meta_query', $meta_query);
    }
    
    /**
     * 自动为新文章添加 tenant_id
     */
    public function auto_add_tenant_id($post_id, $post, $update) {
        // 避免自动保存和修订版本
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
            return;
        }
        
        // 只处理文章类型
        if ($post->post_type !== 'post') {
            return;
        }
        
        // 检查是否已经有 tenant_id
        $existing_tenant_id = get_post_meta($post_id, 'tenant_id', true);
        if (!empty($existing_tenant_id)) {
            return;
        }
        
        // 获取文章作者
        $author_id = $post->post_author;
        
        // 确定 tenant_id
        if (user_can($author_id, 'manage_options')) {
            $tenant_id = 'default';
        } else {
            $tenant_id = get_user_meta($author_id, 'tenant_id', true);
            
            if (empty($tenant_id)) {
                $author = get_userdata($author_id);
                $tenant_id = $author->user_login;
            }
        }
        
        // 添加 tenant_id
        update_post_meta($post_id, 'tenant_id', $tenant_id);
    }
    
    /**
     * REST API 过滤 - 查询阶段
     */
    public function filter_rest_api_posts($args, $request) {
        $tenant_id = $request->get_param('tenantId');
        if (empty($tenant_id)) {
            $tenant_id = $request->get_param('tenant_id');
        }
        if (empty($tenant_id)) {
            $tenant_id = $request->get_param('tenant');
        }
        
        if (empty($tenant_id)) {
            return $args;
        }
        
        if (!isset($args['meta_query'])) {
            $args['meta_query'] = array();
        }
        
        $args['meta_query'][] = array(
            'key' => 'tenant_id',
            'value' => $tenant_id,
            'compare' => '='
        );
        
        if (count($args['meta_query']) > 1) {
            $args['meta_query']['relation'] = 'AND';
        }
        
        return $args;
    }
    
    /**
     * REST API 过滤 - 响应阶段（双重保险）
     */
    public function filter_rest_api_response($response, $post, $request) {
        $tenant_id = $request->get_param('tenantId');
        if (empty($tenant_id)) {
            $tenant_id = $request->get_param('tenant_id');
        }
        if (empty($tenant_id)) {
            $tenant_id = $request->get_param('tenant');
        }
        
        if (empty($tenant_id)) {
            return $response;
        }
        
        $post_tenant_id = get_post_meta($post->ID, 'tenant_id', true);
        
        if ($post_tenant_id !== $tenant_id) {
            return null;
        }
        
        return $response;
    }
    
    /**
     * 允许 REST API 读取（GET请求）
     */
    public function allow_rest_api_read($result) {
        if (!is_wp_error($result)) {
            return $result;
        }
        
        $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
        if ($method === 'GET') {
            return true;
        }
        
        return $result;
    }
    
    /**
     * 添加作者列
     */
    public function add_author_column($columns) {
        $new_columns = array();
        foreach ($columns as $key => $value) {
            $new_columns[$key] = $value;
            if ($key === 'title') {
                $new_columns['post_author_info'] = '创建者';
            }
        }
        return $new_columns;
    }
    
    /**
     * 显示作者信息
     */
    public function show_author_column($column, $post_id) {
        if ($column === 'post_author_info') {
            $post = get_post($post_id);
            $author = get_userdata($post->post_author);
            if ($author) {
                $is_admin = user_can($author->ID, 'manage_options');
                $badge = $is_admin ? '<span style="background:#ff6b00;color:#fff;padding:2px 6px;border-radius:3px;font-size:11px;margin-left:5px;">管理员</span>' : '';
                echo esc_html($author->display_name) . $badge;
            }
        }
    }
    
    /**
     * 添加租户ID列
     */
    public function add_tenant_id_column($columns) {
        $new_columns = array();
        foreach ($columns as $key => $value) {
            $new_columns[$key] = $value;
            if ($key === 'title') {
                $new_columns['tenant_id_info'] = '租户ID';
            }
        }
        return $new_columns;
    }
    
    /**
     * 显示租户ID
     */
    public function show_tenant_id_column($column, $post_id) {
        if ($column === 'tenant_id_info') {
            $tenant_id = get_post_meta($post_id, 'tenant_id', true);
            echo esc_html($tenant_id);
        }
    }
}

// 初始化租户隔离系统
new Tenant_Isolation_System();

// ==========================================
// 2. 用户租户ID管理
// ==========================================

class Tenant_User_Management {
    
    public function __construct() {
        add_action('show_user_profile', array($this, 'add_tenant_id_field'));
        add_action('edit_user_profile', array($this, 'add_tenant_id_field'));
        add_action('personal_options_update', array($this, 'save_tenant_id_field'));
        add_action('edit_user_profile_update', array($this, 'save_tenant_id_field'));
    }
    
    public function add_tenant_id_field($user) {
        if (!current_user_can('manage_options')) {
            return;
        }
        
        $tenant_id = get_user_meta($user->ID, 'tenant_id', true);
        ?>
        <h3>租户设置</h3>
        <table class="form-table">
            <tr>
                <th><label for="tenant_id">租户ID</label></th>
                <td>
                    <input type="text" name="tenant_id" id="tenant_id" value="<?php echo esc_attr($tenant_id); ?>" class="regular-text" />
                    <p class="description">设置该用户所属的租户ID，用于多租户隔离。留空则使用用户名作为租户ID。</p>
                </td>
            </tr>
        </table>
        <?php
    }
    
    public function save_tenant_id_field($user_id) {
        if (!current_user_can('manage_options')) {
            return;
        }
        
        if (isset($_POST['tenant_id'])) {
            update_user_meta($user_id, 'tenant_id', sanitize_text_field($_POST['tenant_id']));
        }
    }
}

// 初始化用户管理
new Tenant_User_Management();

// ==========================================
// 3. 文章复制功能（增强版）
// ==========================================

class Tenant_Post_Duplicate {
    
    public function __construct() {
        // 普通用户：复制到我的账号
        add_filter('post_row_actions', array($this, 'add_duplicate_link'), 10, 2);
        add_action('admin_action_duplicate_post', array($this, 'duplicate_post'));
        
        // 管理员：复制到指定租户
        add_filter('post_row_actions', array($this, 'add_duplicate_to_tenant_action'), 10, 2);
        add_action('admin_footer', array($this, 'duplicate_to_tenant_modal'));
        add_action('admin_footer', array($this, 'duplicate_to_tenant_script'));
        add_action('wp_ajax_duplicate_post_to_tenant', array($this, 'handle_duplicate_post_to_tenant'));
        
        // 通知
        add_action('admin_notices', array($this, 'duplicate_admin_notice'));
    }
    
    // ========== 普通用户复制功能 ==========
    
    public function add_duplicate_link($actions, $post) {
        if ($post->post_type !== 'post') {
            return $actions;
        }
        
        if (current_user_can('manage_options')) {
            return $actions;
        }
        
        $can_edit = current_user_can('edit_post', $post->ID);
        
        if (!$can_edit) {
            $duplicate_url = wp_nonce_url(
                admin_url('admin.php?action=duplicate_post&post=' . $post->ID),
                'duplicate_post_' . $post->ID
            );
            
            $actions['duplicate'] = '<a href="' . $duplicate_url . '" title="复制这篇文章到我的账号下" style="color:#2271b1;">复制到我的账号</a>';
        }
        
        return $actions;
    }
    
    public function duplicate_post() {
        if (empty($_GET['post'])) {
            wp_die('没有指定要复制的文章！');
        }
        
        $post_id = absint($_GET['post']);
        
        if (!isset($_GET['_wpnonce']) || !wp_verify_nonce($_GET['_wpnonce'], 'duplicate_post_' . $post_id)) {
            wp_die('安全验证失败！');
        }
        
        $post = get_post($post_id);
        
        if (!$post) {
            wp_die('文章不存在！');
        }
        
        $post_author = get_userdata($post->post_author);
        if (!user_can($post_author->ID, 'manage_options')) {
            wp_die('您只能复制管理员的文章！');
        }
        
        global $user_ID;
        
        $new_post = array(
            'post_title'     => $post->post_title . ' (副本)',
            'post_content'   => $post->post_content,
            'post_excerpt'   => $post->post_excerpt,
            'post_status'    => 'draft',
            'post_type'      => $post->post_type,
            'post_author'    => $user_ID,
            'comment_status' => $post->comment_status,
            'ping_status'    => $post->ping_status,
        );
        
        $new_post_id = wp_insert_post($new_post);
        
        if (is_wp_error($new_post_id)) {
            wp_die('复制失败：' . $new_post_id->get_error_message());
        }
        
        // 复制分类和标签
        $taxonomies = get_object_taxonomies($post->post_type);
        foreach ($taxonomies as $taxonomy) {
            $terms = wp_get_object_terms($post_id, $taxonomy, array('fields' => 'slugs'));
            wp_set_object_terms($new_post_id, $terms, $taxonomy);
        }
        
        // 复制自定义字段（排除 tenant_id，让它自动生成）
        $post_meta = get_post_meta($post_id);
        foreach ($post_meta as $meta_key => $meta_values) {
            if (in_array($meta_key, array('_edit_lock', '_edit_last', 'tenant_id'))) {
                continue;
            }
            
            foreach ($meta_values as $meta_value) {
                add_post_meta($new_post_id, $meta_key, maybe_unserialize($meta_value));
            }
        }
        
        // 复制特色图片
        $thumbnail_id = get_post_thumbnail_id($post_id);
        if ($thumbnail_id) {
            set_post_thumbnail($new_post_id, $thumbnail_id);
        }
        
        wp_redirect(admin_url('post.php?action=edit&post=' . $new_post_id . '&duplicated=1'));
        exit;
    }
    
    // ========== 管理员复制到租户功能 ==========
    
    public function add_duplicate_to_tenant_action($actions, $post) {
        if (!current_user_can('manage_options')) {
            return $actions;
        }
        
        if ($post->post_type !== 'post') {
            return $actions;
        }
        
        $actions['duplicate_to_tenant'] = sprintf(
            '<a href="#" class="duplicate-to-tenant" data-post-id="%d" data-post-title="%s" style="color:#d63638;">复制到租户</a>',
            $post->ID,
            esc_attr($post->post_title)
        );
        
        return $actions;
    }
    
    public function duplicate_to_tenant_modal() {
        global $pagenow;
        
        if ($pagenow !== 'edit.php' || !current_user_can('manage_options')) {
            return;
        }
        
        $tenants = $this->get_tenant_list();
        ?>
        <div id="duplicate-to-tenant-modal" style="display:none;">
            <div class="duplicate-modal-overlay"></div>
            <div class="duplicate-modal-content">
                <div class="duplicate-modal-header">
                    <h2>复制文章到租户</h2>
                    <button class="duplicate-modal-close">&times;</button>
                </div>
                <div class="duplicate-modal-body">
                    <p class="duplicate-post-info"></p>
                    <div class="duplicate-tenant-select">
                        <label for="target-tenant">选择目标租户：</label>
                        <select id="target-tenant" style="width: 100%; padding: 8px; margin-top: 10px;">
                            <option value="">-- 请选择租户 --</option>
                            <?php foreach ($tenants as $tenant): ?>
                                <option value="<?php echo esc_attr($tenant['id']); ?>">
                                    <?php echo esc_html($tenant['name']); ?> (<?php echo esc_html($tenant['id']); ?>)
                                </option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    <div class="duplicate-options" style="margin-top: 20px;">
                        <label>
                            <input type="checkbox" id="copy-featured-image" checked>
                            复制特色图片
                        </label>
                        <br>
                        <label>
                            <input type="checkbox" id="copy-categories" checked>
                            复制分类和标签
                        </label>
                        <br>
                        <label>
                            <input type="checkbox" id="copy-custom-fields" checked>
                            复制自定义字段
                        </label>
                    </div>
                </div>
                <div class="duplicate-modal-footer">
                    <button class="button button-secondary duplicate-modal-cancel">取消</button>
                    <button class="button button-primary duplicate-modal-confirm">确认复制</button>
                </div>
            </div>
        </div>
        
        <style>
            .duplicate-modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                z-index: 100000;
            }
            .duplicate-modal-content {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                padding: 0;
                border-radius: 4px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                z-index: 100001;
                min-width: 500px;
                max-width: 600px;
            }
            .duplicate-modal-header {
                padding: 20px;
                border-bottom: 1px solid #ddd;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .duplicate-modal-header h2 {
                margin: 0;
                font-size: 18px;
            }
            .duplicate-modal-close {
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #666;
            }
            .duplicate-modal-body {
                padding: 20px;
            }
            .duplicate-post-info {
                background: #f0f0f0;
                padding: 10px;
                border-radius: 4px;
                margin-bottom: 20px;
            }
            .duplicate-modal-footer {
                padding: 15px 20px;
                border-top: 1px solid #ddd;
                text-align: right;
            }
            .duplicate-modal-footer .button {
                margin-left: 10px;
            }
        </style>
        <?php
    }
    
    public function duplicate_to_tenant_script() {
        global $pagenow;
        
        if ($pagenow !== 'edit.php' || !current_user_can('manage_options')) {
            return;
        }
        ?>
        <script>
        jQuery(document).ready(function($) {
            var currentPostId = null;
            var currentPostTitle = '';
            
            // 单个文章复制
            $(document).on('click', '.duplicate-to-tenant', function(e) {
                e.preventDefault();
                currentPostId = $(this).data('post-id');
                currentPostTitle = $(this).data('post-title');
                
                $('.duplicate-post-info').html('将复制文章：<strong>' + currentPostTitle + '</strong>');
                $('#duplicate-to-tenant-modal').show();
            });
            
            // 关闭弹窗
            $('.duplicate-modal-close, .duplicate-modal-cancel').click(function() {
                $('#duplicate-to-tenant-modal').hide();
            });
            
            // 点击遮罩关闭
            $('.duplicate-modal-overlay').click(function() {
                $('#duplicate-to-tenant-modal').hide();
            });
            
            // 确认复制
            $('.duplicate-modal-confirm').click(function() {
                var tenantId = $('#target-tenant').val();
                
                if (!tenantId) {
                    alert('请选择目标租户');
                    return;
                }
                
                var options = {
                    copyFeaturedImage: $('#copy-featured-image').is(':checked'),
                    copyCategories: $('#copy-categories').is(':checked'),
                    copyCustomFields: $('#copy-custom-fields').is(':checked')
                };
                
                // 显示加载状态
                $('.duplicate-modal-confirm').prop('disabled', true).text('复制中...');
                
                // 发送AJAX请求
                $.ajax({
                    url: ajaxurl,
                    type: 'POST',
                    data: {
                        action: 'duplicate_post_to_tenant',
                        post_id: currentPostId,
                        tenant_id: tenantId,
                        options: options,
                        nonce: '<?php echo wp_create_nonce('duplicate_to_tenant'); ?>'
                    },
                    success: function(response) {
                        if (response.success) {
                            alert('复制成功！新文章ID: ' + response.data.new_post_id);
                            $('#duplicate-to-tenant-modal').hide();
                            
                            // 刷新页面
                            location.reload();
                        } else {
                            alert('复制失败：' + response.data.message);
                        }
                    },
                    error: function() {
                        alert('复制失败，请重试');
                    },
                    complete: function() {
                        $('.duplicate-modal-confirm').prop('disabled', false).text('确认复制');
                    }
                });
            });
        });
        </script>
        <?php
    }
    
    public function handle_duplicate_post_to_tenant() {
        // 验证权限
        if (!current_user_can('manage_options')) {
            wp_send_json_error(['message' => '权限不足']);
            return;
        }
        
        // 验证nonce
        if (!isset($_POST['nonce']) || !wp_verify_nonce($_POST['nonce'], 'duplicate_to_tenant')) {
            wp_send_json_error(['message' => '安全验证失败']);
            return;
        }
        
        $post_id = intval($_POST['post_id']);
        $tenant_id = sanitize_text_field($_POST['tenant_id']);
        $options = isset($_POST['options']) ? $_POST['options'] : [];
        
        // 获取原文章
        $original_post = get_post($post_id);
        
        if (!$original_post) {
            wp_send_json_error(['message' => '文章不存在']);
            return;
        }
        
        // 创建新文章
        $new_post_data = array(
            'post_title'    => $original_post->post_title,
            'post_content'  => $original_post->post_content,
            'post_excerpt'  => $original_post->post_excerpt,
            'post_status'   => 'publish',
            'post_type'     => $original_post->post_type,
            'post_author'   => get_current_user_id(),
            'comment_status' => $original_post->comment_status,
            'ping_status'   => $original_post->ping_status,
        );
        
        $new_post_id = wp_insert_post($new_post_data);
        
        if (is_wp_error($new_post_id)) {
            wp_send_json_error(['message' => '创建文章失败']);
            return;
        }
        
        // 设置租户ID
        update_post_meta($new_post_id, 'tenant_id', $tenant_id);
        
        // 复制特色图片
        if (!empty($options['copyFeaturedImage'])) {
            $thumbnail_id = get_post_thumbnail_id($post_id);
            if ($thumbnail_id) {
                set_post_thumbnail($new_post_id, $thumbnail_id);
            }
        }
        
        // 复制分类和标签
        if (!empty($options['copyCategories'])) {
            $taxonomies = get_object_taxonomies($original_post->post_type);
            foreach ($taxonomies as $taxonomy) {
                $terms = wp_get_object_terms($post_id, $taxonomy, ['fields' => 'ids']);
                if (!is_wp_error($terms) && !empty($terms)) {
                    wp_set_object_terms($new_post_id, $terms, $taxonomy);
                }
            }
        }
        
        // 复制自定义字段（排除tenant_id）
        if (!empty($options['copyCustomFields'])) {
            $custom_fields = get_post_custom($post_id);
            foreach ($custom_fields as $key => $values) {
                // 跳过WordPress内部字段和tenant_id
                if (substr($key, 0, 1) === '_' || $key === 'tenant_id') {
                    continue;
                }
                foreach ($values as $value) {
                    add_post_meta($new_post_id, $key, maybe_unserialize($value));
                }
            }
        }
        
        wp_send_json_success([
            'new_post_id' => $new_post_id,
            'message' => '复制成功'
        ]);
    }
    
    public function get_tenant_list() {
        $tenants = [];
        
        // 从tenant_config文章类型获取租户列表
        $args = array(
            'post_type' => 'tenant_config',
            'posts_per_page' => -1,
            'post_status' => 'publish'
        );
        
        $tenant_posts = get_posts($args);
        
        foreach ($tenant_posts as $post) {
            $tenant_id = get_field('tenant_id', $post->ID);
            $app_name = get_field('app_name', $post->ID);
            
            if ($tenant_id) {
                $tenants[] = [
                    'id' => $tenant_id,
                    'name' => $app_name ? $app_name : $post->post_title,
                    'post_id' => $post->ID
                ];
            }
        }
        
        return $tenants;
    }
    
    public function duplicate_admin_notice() {
        if (isset($_GET['duplicated']) && $_GET['duplicated'] == '1') {
            ?>
            <div class="notice notice-success is-dismissible">
                <p><strong>✅ 文章复制成功！</strong>您现在可以编辑这篇文章了。文章已保存为草稿状态，记得修改标题并发布。</p>
            </div>
            <?php
        }
    }
}

// 初始化文章复制功能
new Tenant_Post_Duplicate();

// ==========================================
// 4. 管理工具（可选，用于调试和维护）
// ==========================================

// 查看 tenant_id 工具
add_action('admin_menu', function() {
    add_management_page(
        '查看tenant_id',
        '查看tenant_id',
        'manage_options',
        'view-tenant-ids',
        'render_view_tenant_ids_page'
    );
});

function render_view_tenant_ids_page() {
    if (!current_user_can('manage_options')) {
        wp_die('您没有权限访问此页面');
    }
    
    $posts = get_posts(array(
        'post_type' => 'post',
        'posts_per_page' => 50,
        'post_status' => 'any',
        'orderby' => 'date',
        'order' => 'DESC'
    ));
    
    ?>
    <div class="wrap">
        <h1>文章的 tenant_id 值</h1>
        
        <table class="widefat">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>标题</th>
                    <th>作者</th>
                    <th>tenant_id</th>
                    <th>分类</th>
                    <th>状态</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($posts as $post): 
                    $tenant_id = get_post_meta($post->ID, 'tenant_id', true);
                    $author = get_userdata($post->post_author);
                    $categories = get_the_category($post->ID);
                    $cat_names = array_map(function($cat) { return $cat->name; }, $categories);
                ?>
                <tr>
                    <td><?php echo $post->ID; ?></td>
                    <td><?php echo esc_html($post->post_title); ?></td>
                    <td><?php echo esc_html($author->display_name); ?></td>
                    <td><strong style="color: <?php echo empty($tenant_id) ? 'red' : 'green'; ?>">
                        <?php echo empty($tenant_id) ? '(空)' : esc_html($tenant_id); ?>
                    </strong></td>
                    <td><?php echo implode(', ', $cat_names); ?></td>
                    <td><?php echo $post->post_status; ?></td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
        
        <p style="margin-top: 20px;">
            <strong>说明：</strong>
            <ul>
                <li>绿色：已设置 tenant_id</li>
                <li>红色：缺少 tenant_id（新文章保存时会自动添加）</li>
            </ul>
        </p>
    </div>
    <?php
}

// ==========================================
// 5. 媒体库租户隔离
// ==========================================

class Media_Tenant_Isolation {
    
    public function __construct() {
        // 上传时自动添加 tenant_id
        add_action('add_attachment', array($this, 'add_tenant_id_to_media'));
        
        // 后台媒体库过滤
        add_filter('ajax_query_attachments_args', array($this, 'filter_media_library'));
        add_action('pre_get_posts', array($this, 'filter_media_query'));
        
        // 媒体列表添加租户ID列
        add_filter('manage_media_columns', array($this, 'add_media_tenant_column'));
        add_action('manage_media_custom_column', array($this, 'show_media_tenant_column'), 10, 2);
        
        // REST API 媒体隔离
        add_filter('rest_attachment_query', array($this, 'filter_rest_media'), 10, 2);
    }
    
    /**
     * 上传时自动添加 tenant_id
     */
    public function add_tenant_id_to_media($attachment_id) {
        // 获取当前用户
        $user_id = get_current_user_id();
        
        if (!$user_id) {
            return;
        }
        
        // 确定 tenant_id
        if (user_can($user_id, 'manage_options')) {
            // 管理员上传的媒体标记为 'admin'
            $tenant_id = 'admin';
        } else {
            // 普通用户使用其 tenant_id
            $tenant_id = get_user_meta($user_id, 'tenant_id', true);
            
            if (empty($tenant_id)) {
                $user = get_userdata($user_id);
                if (!$user) {
                    return;
                }
                $tenant_id = $user->user_login;
            }
        }
        
        // 添加 tenant_id 元数据
        update_post_meta($attachment_id, 'tenant_id', $tenant_id);
        
        // 同时添加上传者信息（用于调试）
        update_post_meta($attachment_id, 'uploaded_by', $user_id);
    }
    
    /**
     * 过滤媒体库（AJAX请求，用于媒体选择器）
     */
    public function filter_media_library($query) {
        // 管理员可以看到所有媒体
        if (current_user_can('manage_options')) {
            return $query;
        }
        
        // 获取当前用户的 tenant_id
        $user_id = get_current_user_id();
        $user_tenant_id = get_user_meta($user_id, 'tenant_id', true);
        
        if (empty($user_tenant_id)) {
            $user = get_userdata($user_id);
            if (!$user) {
                return $args;
            }
            $user_tenant_id = $user->user_login;
        }
        
        // 设置 meta_query：只显示自己的和管理员的媒体
        $query['meta_query'] = array(
            'relation' => 'OR',
            array(
                'key' => 'tenant_id',
                'value' => $user_tenant_id,
                'compare' => '='
            ),
            array(
                'key' => 'tenant_id',
                'value' => 'admin',
                'compare' => '='
            ),
            // 兼容旧媒体（没有 tenant_id 的）
            array(
                'key' => 'tenant_id',
                'compare' => 'NOT EXISTS'
            )
        );
        
        return $query;
    }
    
    /**
     * 过滤媒体查询（用于媒体库列表页面）
     */
    public function filter_media_query($query) {
        // 只在后台媒体库页面生效
        if (!is_admin() || !$query->is_main_query()) {
            return;
        }
        
        // 只处理附件查询
        if ($query->get('post_type') !== 'attachment') {
            return;
        }
        
        // 管理员可以看到所有媒体
        if (current_user_can('manage_options')) {
            return;
        }
        
        // 获取当前用户的 tenant_id
        $user_id = get_current_user_id();
        $user_tenant_id = get_user_meta($user_id, 'tenant_id', true);
        
        if (empty($user_tenant_id)) {
            $user = get_userdata($user_id);
            if (!$user) {
                return $args;
            }
            $user_tenant_id = $user->user_login;
        }
        
        // 设置 meta_query
        $meta_query = array(
            'relation' => 'OR',
            array(
                'key' => 'tenant_id',
                'value' => $user_tenant_id,
                'compare' => '='
            ),
            array(
                'key' => 'tenant_id',
                'value' => 'admin',
                'compare' => '='
            ),
            array(
                'key' => 'tenant_id',
                'compare' => 'NOT EXISTS'
            )
        );
        
        $query->set('meta_query', $meta_query);
    }
    
    /**
     * REST API 媒体隔离
     */
    public function filter_rest_media($args, $request) {
        // 获取 tenantId 参数
        $tenant_id = $request->get_param('tenantId');
        
        if (empty($tenant_id)) {
            return $args;
        }
        
        // 设置 meta_query
        if (!isset($args['meta_query'])) {
            $args['meta_query'] = array();
        }
        
        $args['meta_query'][] = array(
            'relation' => 'OR',
            array(
                'key' => 'tenant_id',
                'value' => $tenant_id,
                'compare' => '='
            ),
            array(
                'key' => 'tenant_id',
                'value' => 'admin',
                'compare' => '='
            )
        );
        
        if (count($args['meta_query']) > 1) {
            $args['meta_query']['relation'] = 'AND';
        }
        
        return $args;
    }
    
    /**
     * 添加租户ID列
     */
    public function add_media_tenant_column($columns) {
        $new_columns = array();
        foreach ($columns as $key => $value) {
            $new_columns[$key] = $value;
            if ($key === 'author') {
                $new_columns['media_tenant_id'] = '租户ID';
            }
        }
        return $new_columns;
    }
    
    /**
     * 显示租户ID
     */
    public function show_media_tenant_column($column, $attachment_id) {
        if ($column === 'media_tenant_id') {
            $tenant_id = get_post_meta($attachment_id, 'tenant_id', true);
            
            if (empty($tenant_id)) {
                echo '<span style="color:#999;">未设置</span>';
            } elseif ($tenant_id === 'admin') {
                echo '<span style="background:#ff6b00;color:#fff;padding:2px 8px;border-radius:3px;font-size:11px;">管理员</span>';
            } else {
                echo '<span style="background:#2271b1;color:#fff;padding:2px 8px;border-radius:3px;font-size:11px;">' . esc_html($tenant_id) . '</span>';
            }
        }
    }
}

// 初始化媒体租户隔离
new Media_Tenant_Isolation();

// ==========================================
// 6. 媒体租户ID管理工具
// ==========================================

add_action('admin_menu', function() {
    add_management_page(
        '媒体租户ID管理',
        '媒体租户ID',
        'manage_options',
        'media-tenant-ids',
        'render_media_tenant_ids_page'
    );
});

function render_media_tenant_ids_page() {
    if (!current_user_can('manage_options')) {
        wp_die('您没有权限访问此页面');
    }
    
    // 处理批量添加
    if (isset($_POST['batch_add_tenant_ids']) && check_admin_referer('batch_add_media_tenant_ids')) {
        $updated = 0;
        
        // 获取所有没有 tenant_id 的媒体
        $attachments = get_posts(array(
            'post_type' => 'attachment',
            'posts_per_page' => -1,
            'post_status' => 'any',
            'meta_query' => array(
                array(
                    'key' => 'tenant_id',
                    'compare' => 'NOT EXISTS'
                )
            )
        ));
        
        foreach ($attachments as $attachment) {
            $author_id = $attachment->post_author;
            
            if (user_can($author_id, 'manage_options')) {
                $tenant_id = 'admin';
            } else {
                $tenant_id = get_user_meta($author_id, 'tenant_id', true);
                
                if (empty($tenant_id)) {
                    $author = get_userdata($author_id);
                    $tenant_id = $author ? $author->user_login : 'unknown';
                }
            }
            
            update_post_meta($attachment->ID, 'tenant_id', $tenant_id);
            update_post_meta($attachment->ID, 'uploaded_by', $author_id);
            $updated++;
        }
        
        echo '<div class="notice notice-success"><p>成功为 ' . $updated . ' 个媒体文件添加了 tenant_id</p></div>';
    }
    
    // 统计信息
    $total_media = wp_count_posts('attachment')->inherit;
    
    $media_with_tenant = get_posts(array(
        'post_type' => 'attachment',
        'posts_per_page' => -1,
        'post_status' => 'any',
        'meta_query' => array(
            array(
                'key' => 'tenant_id',
                'compare' => 'EXISTS'
            )
        ),
        'fields' => 'ids'
    ));
    
    $media_without_tenant = get_posts(array(
        'post_type' => 'attachment',
        'posts_per_page' => -1,
        'post_status' => 'any',
        'meta_query' => array(
            array(
                'key' => 'tenant_id',
                'compare' => 'NOT EXISTS'
            )
        )
    ));
    
    ?>
    <div class="wrap">
        <h1>媒体租户ID管理</h1>
        
        <div class="card" style="max-width: 800px;">
            <h2>统计信息</h2>
            <table class="widefat">
                <tr>
                    <td><strong>媒体总数</strong></td>
                    <td><?php echo $total_media; ?></td>
                </tr>
                <tr>
                    <td><strong>已设置 tenant_id</strong></td>
                    <td style="color: green;"><?php echo count($media_with_tenant); ?></td>
                </tr>
                <tr>
                    <td><strong>未设置 tenant_id</strong></td>
                    <td style="color: red;"><?php echo count($media_without_tenant); ?></td>
                </tr>
            </table>
        </div>
        
        <?php if (count($media_without_tenant) > 0): ?>
        <div class="card" style="max-width: 800px; margin-top: 20px;">
            <h2>批量添加 tenant_id</h2>
            <p>为所有现有媒体自动添加 tenant_id（根据上传者判断）</p>
            
            <form method="post">
                <?php wp_nonce_field('batch_add_media_tenant_ids'); ?>
                <button type="submit" name="batch_add_tenant_ids" class="button button-primary">
                    批量添加 tenant_id（<?php echo count($media_without_tenant); ?> 个文件）
                </button>
            </form>
        </div>
        <?php endif; ?>
        
        <div class="card" style="max-width: 800px; margin-top: 20px;">
            <h2>未设置 tenant_id 的媒体</h2>
            <?php if (count($media_without_tenant) > 0): ?>
            <table class="widefat">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>文件名</th>
                        <th>上传者</th>
                        <th>上传时间</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach (array_slice($media_without_tenant, 0, 20) as $media): 
                        $author = get_userdata($media->post_author);
                    ?>
                    <tr>
                        <td><?php echo $media->ID; ?></td>
                        <td><?php echo esc_html(basename($media->guid)); ?></td>
                        <td><?php echo $author ? esc_html($author->display_name) : '未知'; ?></td>
                        <td><?php echo $media->post_date; ?></td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
            <?php if (count($media_without_tenant) > 20): ?>
            <p><em>只显示前 20 个，共 <?php echo count($media_without_tenant); ?> 个</em></p>
            <?php endif; ?>
            <?php else: ?>
            <p style="color: green;">✅ 所有媒体都已设置 tenant_id</p>
            <?php endif; ?>
        </div>
    </div>
    <?php
}

// ==========================================
// 引入租户小程序码生成功能
// ==========================================
// require_once get_template_directory() . '/tenant-qrcode.php';

// ==========================================
// 代码结束
// ==========================================

// ==========================================
// 7. 分类租户隔离功能
// ==========================================

class Category_Tenant_Isolation {
    
    public function __construct() {
        // 创建分类时自动添加 tenant_id
        add_action('created_category', array($this, 'add_tenant_id_to_category'), 10, 2);
        
        // 编辑分类时更新 tenant_id
        add_action('edited_category', array($this, 'update_tenant_id_for_category'), 10, 2);
        
        // 后台分类列表过滤（已禁用，避免无限递归内存溢出）
        // add_action('pre_get_terms', array($this, 'filter_terms_by_tenant'));
        
        // 文章编辑页面分类选择器过滤（已禁用，AJAX 时触发递归造成内存溢出）
        // add_filter('terms_clauses', array($this, 'filter_terms_sql'), 10, 3);
        
        // get_terms 参数过滤（已禁用）
        // add_filter('get_terms_args', array($this, 'filter_get_terms_args'), 10, 2);
        
        // 分类列表添加租户ID列
        add_filter('manage_edit-category_columns', array($this, 'add_category_tenant_column'));
        add_filter('manage_category_custom_column', array($this, 'show_category_tenant_column'), 10, 3);
        
        // REST API 分类隔离
        add_filter('rest_category_query', array($this, 'filter_rest_category'), 10, 2);
        
        // REST API 术语查询过滤（适用于所有分类法）
        add_filter('rest_term_query', array($this, 'filter_rest_term_query'), 10, 2);
    }
    
    /**
     * 创建分类时自动添加 tenant_id
     */
    public function add_tenant_id_to_category($term_id, $tt_id) {
        // 获取当前用户
        $user_id = get_current_user_id();
        
        if (!$user_id) {
            return;
        }
        
        // 确定 tenant_id
        if (user_can($user_id, 'manage_options')) {
            $tenant_id = 'default';
        } else {
            $tenant_id = get_user_meta($user_id, 'tenant_id', true);
            
            if (empty($tenant_id)) {
                $user = get_userdata($user_id);
                $tenant_id = $user->user_login;
            }
        }
        
        // 添加 tenant_id 到分类
        add_term_meta($term_id, 'tenant_id', $tenant_id, true);
    }
    
    /**
     * 编辑分类时更新 tenant_id
     */
    public function update_tenant_id_for_category($term_id, $tt_id) {
        // 只在管理员编辑时更新
        if (!current_user_can('manage_options')) {
            return;
        }
        
        // 检查是否有新的 tenant_id
        if (isset($_POST['tenant_id'])) {
            $new_tenant_id = sanitize_text_field($_POST['tenant_id']);
            update_term_meta($term_id, 'tenant_id', $new_tenant_id);
        }
    }
    
    /**
     * 过滤后台分类列表
     */
    public function filter_terms_by_tenant($query) {
        // 只在后台分类管理页面生效
        if (!is_admin()) {
            return;
        }

        // 排除 AJAX 请求，防止阻断分类创建流程
        if (defined('DOING_AJAX') && DOING_AJAX) {
            return;
        }

        // 额外排除分类创建/编辑相关的 AJAX action
        if (isset($_POST['action']) && in_array($_POST['action'], array(
            'add-tag', 'inline-save-tax', 'delete-tag', 'get-tagcloud'
        ))) {
            return;
        }
        
        // 管理员可以看到所有分类
        if (current_user_can('manage_options')) {
            return;
        }
        
        // 只处理分类（category）查询
        if (!isset($query->query_vars['taxonomy']) || $query->query_vars['taxonomy'] !== 'category') {
            return;
        }
        
        // 获取当前用户的 tenant_id
        $user_id = get_current_user_id();
        $user_tenant_id = get_user_meta($user_id, 'tenant_id', true);
        
        if (empty($user_tenant_id)) {
            $user = get_userdata($user_id);
            if (!$user) {
                return;
            }
            $user_tenant_id = $user->user_login;
        }
        
        // 后台分类列表：只显示当前租户的分类
        $query->query_vars['meta_query'] = array(
            array(
                'key' => 'tenant_id',
                'value' => $user_tenant_id,
                'compare' => '='
            )
        );
    }
    
    /**
     * REST API 分类隔离
     */
    public function filter_rest_category($args, $request) {
        if (current_user_can('manage_options')) {
            return $args;
        }
        
        $user_id = get_current_user_id();
        $user_tenant_id = get_user_meta($user_id, 'tenant_id', true);
        
        if (empty($user_tenant_id)) {
            $user = get_userdata($user_id);
            if (!$user) {
                return $args;
            }
            $user_tenant_id = $user->user_login;
        }
        
        if (!isset($args['meta_query'])) {
            $args['meta_query'] = array();
        }
        
        $args['meta_query'][] = array(
            'key' => 'tenant_id',
            'value' => $user_tenant_id,
            'compare' => '='
        );
        
        return $args;
    }
    
    /**
     * 过滤 get_terms 参数
     */
    public function filter_get_terms_args($args, $taxonomies) {
        if (!is_admin()) {
            return $args;
        }

        // 排除 AJAX 请求，防止阻断分类创建流程
        if (defined('DOING_AJAX') && DOING_AJAX) {
            return $args;
        }

        // 额外排除分类创建/编辑相关的 AJAX action
        if (isset($_POST['action']) && in_array($_POST['action'], array(
            'add-tag', 'inline-save-tax', 'delete-tag', 'get-tagcloud'
        ))) {
            return $args;
        }
        
        if (current_user_can('manage_options')) {
            return $args;
        }
        
        if (!in_array('category', (array)$taxonomies)) {
            return $args;
        }
        
        $user_id = get_current_user_id();
        $user_tenant_id = get_user_meta($user_id, 'tenant_id', true);
        
        if (empty($user_tenant_id)) {
            $user = get_userdata($user_id);
            if (!$user) {
                return $args;
            }
            $user_tenant_id = $user->user_login;
        }
        
        if (!isset($args['meta_query'])) {
            $args['meta_query'] = array();
        }
        
        $args['meta_query'][] = array(
            'key' => 'tenant_id',
            'value' => $user_tenant_id,
            'compare' => '='
        );
        
        return $args;
    }
    
    /**
     * REST API 术语查询过滤
     */
    public function filter_rest_term_query($args, $request) {
        if (current_user_can('manage_options')) {
            return $args;
        }
        
        $taxonomy = isset($args['taxonomy']) ? $args['taxonomy'] : array();
        if (!in_array('category', (array)$taxonomy)) {
            return $args;
        }
        
        $user_id = get_current_user_id();
        $user_tenant_id = get_user_meta($user_id, 'tenant_id', true);
        
        if (empty($user_tenant_id)) {
            $user = get_userdata($user_id);
            if (!$user) {
                return $args;
            }
            $user_tenant_id = $user->user_login;
        }
        
        if (!isset($args['meta_query'])) {
            $args['meta_query'] = array();
        }
        
        $args['meta_query'][] = array(
            'key' => 'tenant_id',
            'value' => $user_tenant_id,
            'compare' => '='
        );
        
        return $args;
    }
    
    /**
     * 过滤分类选择器（文章编辑页面）- 使用 get_terms 直接过滤
     */
    public function filter_category_selection($args, $taxonomies) {
        if (!in_array('category', $taxonomies)) {
            return $args;
        }
        
        if (current_user_can('manage_options')) {
            return $args;
        }
        
        $user_id = get_current_user_id();
        $user_tenant_id = get_user_meta($user_id, 'tenant_id', true);
        
        if (empty($user_tenant_id)) {
            $user = get_userdata($user_id);
            if (!$user) {
                return $args;
            }
            $user_tenant_id = $user->user_login;
        }
        
        if (!isset($args['meta_query'])) {
            $args['meta_query'] = array();
        }
        
        $args['meta_query'][] = array(
            'key' => 'tenant_id',
            'value' => $user_tenant_id,
            'compare' => '='
        );
        
        return $args;
    }
    
    /**
     * 过滤文章的分类关系（文章编辑页面）
     */
    public function filter_post_categories($query) {
        // 只在后台文章编辑页面生效
        if (!is_admin()) {
            return;
        }
        
        // 管理员可以看到所有分类
        if (current_user_can('manage_options')) {
            return;
        }
        
        // 只处理文章查询
        if ($query->get('post_type') !== 'post') {
            return;
        }
        
        // 获取当前用户的 tenant_id
        $user_id = get_current_user_id();
        $user_tenant_id = get_user_meta($user_id, 'tenant_id', true);
        
        if (empty($user_tenant_id)) {
            $user = get_userdata($user_id);
            if (!$user) {
                return $args;
            }
            $user_tenant_id = $user->user_login;
        }
        
        // 获取当前文章的分类
        $post_id = isset($_GET['post']) ? intval($_GET['post']) : 0;
        
        if ($post_id > 0) {
            $post_categories = wp_get_post_categories($post_id);
            
            if (!empty($post_categories)) {
                // 获取这些分类的 tenant_id
                $category_ids = array();
                $allowed_categories = array();
                
                foreach ($post_categories as $cat) {
                    $cat_tenant_id = get_term_meta($cat->term_id, 'tenant_id', true);
                    
                    if ($cat_tenant_id === $user_tenant_id) {
                        $allowed_categories[] = $cat->term_id;
                    }
                }
                
                // 设置分类查询参数
                $query->set('category__in', $allowed_categories);
            }
        }
    }
    
    /**
     * 添加JavaScript动态过滤分类选择器
     */
    public function add_category_filter_script() {
        // 只在文章编辑页面生效
        $screen = get_current_screen();
        if (!$screen || $screen->base !== 'post') {
            return;
        }
        
        // 管理员不过滤
        if (current_user_can('manage_options')) {
            return;
        }
        
        // 获取当前用户的 tenant_id
        $user_id = get_current_user_id();
        $user_tenant_id = get_user_meta($user_id, 'tenant_id', true);
        
        if (empty($user_tenant_id)) {
            $user = get_userdata($user_id);
            if (!$user) {
                return $args;
            }
            $user_tenant_id = $user->user_login;
        }
        ?>
        <script type="text/javascript">
        jQuery(document).ready(function($) {
            var userTenantId = '<?php echo esc_js($user_tenant_id); ?>';
            
            $('input[name="post_category[]"]').each(function() {
                var categoryTenantId = $(this).data('tenant-id');
                
                if (categoryTenantId !== userTenantId) {
                    $(this).closest('li').hide();
                }
            });
        });
        </script>
        <?php
    }
    
    /**
     * 过滤分类 SQL 查询（直接修改 SQL）
     */
    public function filter_terms_sql($clauses, $taxonomies, $args) {
        if (!is_admin()) {
            return $clauses;
        }

        // 排除 AJAX 请求（创建/编辑分类时内部会调用 get_terms，不能拦截）
        if (defined('DOING_AJAX') && DOING_AJAX) {
            return $clauses;
        }

        // 额外排除分类创建/编辑相关的 AJAX action
        if (isset($_POST['action']) && in_array($_POST['action'], array(
            'add-tag', 'inline-save-tax', 'delete-tag', 'get-tagcloud'
        ))) {
            return $clauses;
        }
        
        if (current_user_can('manage_options')) {
            return $clauses;
        }
        
        if (!in_array('category', (array)$taxonomies)) {
            return $clauses;
        }
        
        $user_id = get_current_user_id();
        $user_tenant_id = get_user_meta($user_id, 'tenant_id', true);
        
        if (empty($user_tenant_id)) {
            $user = get_userdata($user_id);
            if (!$user) {
                return $clauses;
            }
            $user_tenant_id = $user->user_login;
        }
        
        global $wpdb;
        
        // 使用 LEFT JOIN，避免过滤掉尚无 tenant_id 的新分类（创建过程中）
        $clauses['join'] .= " LEFT JOIN {$wpdb->termmeta} AS tm_filter ON (t.term_id = tm_filter.term_id AND tm_filter.meta_key = 'tenant_id')";
        
        $clauses['where'] .= $wpdb->prepare(
            " AND (tm_filter.meta_value = %s OR tm_filter.meta_value IS NULL)",
            $user_tenant_id
        );
        
        return $clauses;
    }
    
    /**
     * 添加分类租户ID列
     */
    public function add_category_tenant_column($columns) {
        $new_columns = array();
        foreach ($columns as $key => $value) {
            $new_columns[$key] = $value;
            if ($key === 'name') {
                $new_columns['category_tenant_id'] = '租户ID';
            }
        }
        return $new_columns;
    }
    
    /**
     * 显示分类租户ID
     */
    public function show_category_tenant_column($content, $column_name, $term_id) {
        if ($column_name === 'category_tenant_id') {
            $tenant_id = get_term_meta($term_id, 'tenant_id', true);
            
            if (empty($tenant_id)) {
                echo '<span style="color:#999;">未设置</span>';
            } elseif ($tenant_id === 'default') {
                echo '<span style="background:#ff6b00;color:#fff;padding:2px 8px;border-radius:3px;font-size:11px;">默认</span>';
            } else {
                echo '<span style="background:#2271b1;color:#fff;padding:2px 8px;border-radius:3px;font-size:11px;">' . esc_html($tenant_id) . '</span>';
            }
        }
    }
}

// 初始化分类租户隔离
new Category_Tenant_Isolation();

// ==========================================
// 8. 分类租户ID管理工具
// ==========================================

add_action('admin_menu', function() {
    add_management_page(
        '分类租户ID管理',
        '分类租户ID',
        'manage_options',
        'category-tenant-ids',
        'render_category_tenant_ids_page'
    );
});

function render_category_tenant_ids_page() {
    if (!current_user_can('manage_options')) {
        wp_die('您没有权限访问此页面');
    }
    
    // 处理批量添加
    if (isset($_POST['batch_add_category_tenant_ids']) && check_admin_referer('batch_add_category_tenant_ids')) {
        $updated = 0;
        
        // 获取所有没有 tenant_id 的分类
        $categories = get_categories(array(
            'hide_empty' => false,
            'meta_query' => array(
                array(
                    'key' => 'tenant_id',
                    'compare' => 'NOT EXISTS'
                )
            )
        ));
        
        foreach ($categories as $category) {
            // 检查该分类下是否有文章
            $posts = get_posts(array(
                'category' => $category->term_id,
                'posts_per_page' => 1,
                'fields' => 'ids'
            ));
            
            if (!empty($posts)) {
                // 获取第一篇文章的 tenant_id
                $post_tenant_id = get_post_meta($posts[0], 'tenant_id', true);
                
                if (!empty($post_tenant_id)) {
                    update_term_meta($category->term_id, 'tenant_id', $post_tenant_id);
                    $updated++;
                }
            } else {
                // 如果没有文章，设置为 'default'
                update_term_meta($category->term_id, 'tenant_id', 'default');
                $updated++;
            }
        }
        
        echo '<div class="notice notice-success"><p>成功为 ' . $updated . ' 个分类添加了 tenant_id</p></div>';
    }
    
    // 统计信息
    $all_categories = get_categories(array('hide_empty' => false));
    $categories_with_tenant = get_categories(array(
        'hide_empty' => false,
        'meta_query' => array(
            array(
                'key' => 'tenant_id',
                'compare' => 'EXISTS'
            )
        )
    ));
    
    $categories_without_tenant = get_categories(array(
        'hide_empty' => false,
        'meta_query' => array(
            array(
                'key' => 'tenant_id',
                'compare' => 'NOT EXISTS'
            )
        )
    ));
    
    ?>
    <div class="wrap">
        <h1>分类租户ID管理</h1>
        
        <div class="card" style="max-width: 800px;">
            <h2>统计信息</h2>
            <table class="widefat">
                <tr>
                    <td><strong>分类总数</strong></td>
                    <td><?php echo count($all_categories); ?></td>
                </tr>
                <tr>
                    <td><strong>已设置 tenant_id</strong></td>
                    <td style="color: green;"><?php echo count($categories_with_tenant); ?></td>
                </tr>
                <tr>
                    <td><strong>未设置 tenant_id</strong></td>
                    <td style="color: red;"><?php echo count($categories_without_tenant); ?></td>
                </tr>
            </table>
        </div>
        
        <?php if (count($categories_without_tenant) > 0): ?>
        <div class="card" style="max-width: 800px; margin-top: 20px;">
            <h2>批量添加 tenant_id</h2>
            <p>为所有现有分类自动添加 tenant_id（根据分类下的文章判断）</p>
            
            <form method="post">
                <?php wp_nonce_field('batch_add_category_tenant_ids'); ?>
                <button type="submit" name="batch_add_category_tenant_ids" class="button button-primary">
                    批量添加 tenant_id（<?php echo count($categories_without_tenant); ?> 个分类）
                </button>
            </form>
        </div>
        <?php endif; ?>
        
        <div class="card" style="max-width: 800px; margin-top: 20px;">
            <h2>所有分类的租户ID</h2>
            <table class="widefat">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>分类名称</th>
                        <th>文章数量</th>
                        <th>租户ID</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($all_categories as $category): 
                        $tenant_id = get_term_meta($category->term_id, 'tenant_id', true);
                        $count = $category->count;
                    ?>
                    <tr>
                        <td><?php echo $category->term_id; ?></td>
                        <td><?php echo esc_html($category->name); ?></td>
                        <td><?php echo $count; ?></td>
                        <td>
                            <?php if (empty($tenant_id)): ?>
                                <span style="color:#999;">未设置</span>
                            <?php elseif ($tenant_id === 'default'): ?>
                                <span style="background:#ff6b00;color:#fff;padding:2px 8px;border-radius:3px;font-size:11px;">默认</span>
                            <?php else: ?>
                                <span style="background:#2271b1;color:#fff;padding:2px 8px;border-radius:3px;font-size:11px;"><?php echo esc_html($tenant_id); ?></span>
                            <?php endif; ?>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    </div>
    <?php
}


