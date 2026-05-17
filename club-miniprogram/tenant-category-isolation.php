<?php
/**
 * Plugin Name: 租户分类隔离插件
 * Description: 为多租户系统提供独立的分类管理，每个租户只能看到和管理自己的分类
 * Version: 1.1
 * Author: Custom
 */

if (!defined('ABSPATH')) {
    exit;
}

class Tenant_Category_Isolation {
    
    private $table_name;
    
    public function __construct() {
        global $wpdb;
        $this->table_name = $wpdb->prefix . 'tenant_categories';
        
        register_activation_hook(__FILE__, array($this, 'create_table'));
        
        add_action('rest_api_init', array($this, 'register_rest_routes'));
        
        add_filter('determine_current_user', array($this, 'set_current_user_from_header'));
        
        add_action('init', array($this, 'add_category_tenant_field'));
        add_action('admin_init', array($this, 'filter_categories_by_tenant'));
        add_action('category_edit_form_fields', array($this, 'add_tenant_field_to_category'), 10, 2);
        add_action('category_add_form_fields', array($this, 'add_tenant_field_to_new_category'), 10, 2);
        add_action('edited_category', array($this, 'save_category_tenant_field'), 10, 2);
        add_action('created_category', array($this, 'save_category_tenant_field'), 10, 2);
        add_filter('map_meta_cap', array($this, 'restrict_category_editing'), 10, 4);
        add_filter('get_terms_args', array($this, 'filter_terms_args'), 10, 2);
    }
    
    public function create_table() {
        global $wpdb;
        
        $charset_collate = $wpdb->get_charset_collate();
        
        $sql = "CREATE TABLE {$this->table_name} (
            cat_id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
            tenant_id VARCHAR(100) NOT NULL,
            name VARCHAR(200) NOT NULL,
            slug VARCHAR(200) NOT NULL,
            description TEXT,
            parent_id BIGINT(20) DEFAULT 0,
            count INT(11) DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY  (cat_id),
            UNIQUE KEY idx_tenant_slug (tenant_id, slug),
            KEY idx_tenant_parent (tenant_id, parent_id),
            KEY idx_tenant_id (tenant_id)
        ) $charset_collate;";
        
        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($sql);
    }
    
    private function get_tenant_id($user_id = null) {
        if ($user_id === null && is_user_logged_in()) {
            $current_user = wp_get_current_user();
            $user_id = $current_user->ID;
        }
        
        if ($user_id) {
            $tenant_id = get_user_meta($user_id, 'tenant_id', true);
            if (empty($tenant_id)) {
                $user = get_userdata($user_id);
                $tenant_id = $user ? $user->user_login : '';
            }
            return $tenant_id;
        }
        
        return isset($_REQUEST['tenant_id']) ? sanitize_text_field($_REQUEST['tenant_id']) : '';
    }
    
    public function is_admin_or_manager() {
        if (!is_user_logged_in()) {
            return false;
        }
        return current_user_can('manage_options');
    }
    
    public function add_category_tenant_field() {
        add_term_meta('category', 'tenant_id', '', true);
    }
    
    public function filter_categories_by_tenant() {
        if ($this->is_admin_or_manager()) {
            return;
        }
        
        global $pagenow;
        
        if ($pagenow === 'edit-tags.php' && isset($_GET['taxonomy']) && $_GET['taxonomy'] === 'category') {
            $tenant_id = $this->get_tenant_id();
            if (empty($tenant_id)) {
                wp_die('您没有权限访问分类管理');
            }
        }
    }
    
    public function filter_terms_args($args, $taxonomies) {
        // AJAX 请求（含创建/编辑分类）时跳过过滤，避免递归导致内存溢出
        if (defined('DOING_AJAX') && DOING_AJAX) {
            return $args;
        }
        
        if (!is_admin() || $this->is_admin_or_manager()) {
            return $args;
        }
        
        if (in_array('category', $taxonomies)) {
            $tenant_id = $this->get_tenant_id();
            if (!empty($tenant_id)) {
                $args['meta_query'] = array(
                    array(
                        'key' => 'tenant_id',
                        'value' => $tenant_id,
                        'compare' => '='
                    )
                );
            }
        }
        
        return $args;
    }
    
    public function add_tenant_field_to_category($tag) {
        if ($this->is_admin_or_manager()) {
            return;
        }
        
        $tenant_id = $this->get_tenant_id();
        $current_tenant = get_term_meta($tag->term_id, 'tenant_id', true);
        ?>
        <tr class="form-field">
            <th scope="row">
                <label for="tenant_id">租户ID</label>
            </th>
            <td>
                <input type="text" name="tenant_id" id="tenant_id" value="<?php echo esc_attr($current_tenant ?: $tenant_id); ?>" readonly />
                <p class="description">该分类所属的租户ID</p>
            </td>
        </tr>
        <?php
    }
    
    public function add_tenant_field_to_new_category($taxonomy) {
        if ($this->is_admin_or_manager()) {
            return;
        }
        
        $tenant_id = $this->get_tenant_id();
        ?>
        <div class="form-field">
            <label for="tenant_id">租户ID</label>
            <input type="text" name="tenant_id" id="tenant_id" value="<?php echo esc_attr($tenant_id); ?>" readonly />
            <p class="description">该分类所属的租户ID</p>
        </div>
        <?php
    }
    
    public function save_category_tenant_field($term_id) {
        if ($this->is_admin_or_manager()) {
            $tenant_id = isset($_POST['tenant_id']) ? sanitize_text_field($_POST['tenant_id']) : '';
            if (!empty($tenant_id)) {
                update_term_meta($term_id, 'tenant_id', $tenant_id);
            }
            return;
        }
        
        $tenant_id = $this->get_tenant_id();
        if (!empty($tenant_id)) {
            update_term_meta($term_id, 'tenant_id', $tenant_id);
        }
    }
    
    public function restrict_category_editing($caps, $cap, $user_id, $args) {
        if ($cap !== 'manage_categories' && $cap !== 'edit_category' && $cap !== 'delete_category') {
            return $caps;
        }
        
        if ($this->is_admin_or_manager()) {
            return $caps;
        }
        
        if (!empty($args[0])) {
            $term_id = $args[0];
            $term_tenant = get_term_meta($term_id, 'tenant_id', true);
            $current_tenant = $this->get_tenant_id($user_id);
            
            if (!empty($term_tenant) && $term_tenant !== $current_tenant) {
                $caps[] = 'do_not_allow';
            }
        }
        
        return $caps;
    }
    
    public function set_current_user_from_header($user_id) {
        // 已有登录用户时不覆盖，避免干扰后台正常登录态
        if (!empty($user_id)) {
            return $user_id;
        }
        
        $tenant_id = isset($_REQUEST['tenant_id']) ? sanitize_text_field($_REQUEST['tenant_id']) : '';
        
        if (!empty($tenant_id)) {
            $tenant_user = get_users(array(
                'meta_key' => 'tenant_id',
                'meta_value' => $tenant_id,
                'number' => 1
            ));
            
            if (!empty($tenant_user)) {
                return $tenant_user[0]->ID;
            }
        }
        
        return $user_id;
    }
    
    public function register_rest_routes() {
        register_rest_route('wp/v2', '/tenant-categories', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_categories'),
            'permission_callback' => array($this, 'check_read_permission')
        ));
        
        register_rest_route('wp/v2', '/tenant-categories', array(
            'methods' => 'POST',
            'callback' => array($this, 'create_category'),
            'permission_callback' => array($this, 'check_write_permission')
        ));
        
        register_rest_route('wp/v2', '/tenant-categories/(?P<id>\d+)', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_category'),
            'permission_callback' => array($this, 'check_read_permission')
        ));
        
        register_rest_route('wp/v2', '/tenant-categories/(?P<id>\d+)', array(
            'methods' => 'POST',
            'callback' => array($this, 'update_category'),
            'permission_callback' => array($this, 'check_write_permission')
        ));
        
        register_rest_route('wp/v2', '/tenant-categories/(?P<id>\d+)', array(
            'methods' => 'DELETE',
            'callback' => array($this, 'delete_category'),
            'permission_callback' => array($this, 'check_write_permission')
        ));
    }
    
    public function check_read_permission() {
        $tenant_id = $this->get_tenant_id();
        return !empty($tenant_id);
    }
    
    public function check_write_permission() {
        if (!is_user_logged_in()) {
            return false;
        }
        return current_user_can('edit_posts');
    }
    
    public function get_categories($request) {
        global $wpdb;
        
        $tenant_id = $this->get_tenant_id();
        
        if (empty($tenant_id)) {
            return new WP_Error('no_tenant_id', '缺少租户ID', array('status' => 400));
        }
        
        $parent = $request->get_param('parent');
        $per_page = $request->get_param('per_page') ? intval($request->get_param('per_page')) : 100;
        $orderby = $request->get_param('orderby') ? $request->get_param('orderby') : 'cat_id';
        $order = $request->get_param('order') ? $request->get_param('order') : 'asc';
        
        $where = $wpdb->prepare("WHERE tenant_id = %s", $tenant_id);
        
        if ($parent !== null && $parent !== '') {
            $where .= $wpdb->prepare(" AND parent_id = %d", intval($parent));
        }
        
        $allowed_orderby = array('cat_id', 'name', 'count', 'created_at');
        if (!in_array($orderby, $allowed_orderby)) {
            $orderby = 'cat_id';
        }
        
        $allowed_order = array('asc', 'desc');
        if (!in_array(strtolower($order), $allowed_order)) {
            $order = 'asc';
        }
        
        $sql = "SELECT * FROM {$this->table_name} {$where} ORDER BY {$orderby} {$order} LIMIT {$per_page}";
        
        $categories = $wpdb->get_results($sql);
        
        $formatted = array();
        foreach ($categories as $cat) {
            $formatted[] = array(
                'id' => intval($cat->cat_id),
                'count' => intval($cat->count),
                'description' => $cat->description,
                'name' => $cat->name,
                'slug' => $cat->slug,
                'parent' => intval($cat->parent_id),
                'tenant_id' => $cat->tenant_id
            );
        }
        
        return new WP_REST_Response($formatted, 200);
    }
    
    public function get_category($request) {
        global $wpdb;
        
        $tenant_id = $this->get_tenant_id();
        $id = intval($request->get_param('id'));
        
        $category = $wpdb->get_row($wpdb->prepare(
            "SELECT * FROM {$this->table_name} WHERE cat_id = %d AND tenant_id = %s",
            $id, $tenant_id
        ));
        
        if (!$category) {
            return new WP_Error('not_found', '分类不存在', array('status' => 404));
        }
        
        return array(
            'id' => intval($category->cat_id),
            'count' => intval($category->count),
            'description' => $category->description,
            'name' => $category->name,
            'slug' => $category->slug,
            'parent' => intval($category->parent_id),
            'tenant_id' => $category->tenant_id
        );
    }
    
    public function create_category($request) {
        global $wpdb;
        
        $tenant_id = $this->get_tenant_id();
        
        if (empty($tenant_id)) {
            return new WP_Error('no_tenant_id', '缺少租户ID', array('status' => 400));
        }
        
        $name = sanitize_text_field($request->get_param('name'));
        $description = sanitize_textarea_field($request->get_param('description'));
        $parent_id = intval($request->get_param('parent'));
        
        if (empty($name)) {
            return new WP_Error('invalid_name', '分类名称不能为空', array('status' => 400));
        }
        
        $slug = sanitize_title($request->get_param('slug') ? $request->get_param('slug') : $name);
        
        $existing = $wpdb->get_row($wpdb->prepare(
            "SELECT cat_id FROM {$this->table_name} WHERE tenant_id = %s AND slug = %s",
            $tenant_id, $slug
        ));
        
        if ($existing) {
            $slug = $slug . '-' . time();
        }
        
        $result = $wpdb->insert(
            $this->table_name,
            array(
                'tenant_id' => $tenant_id,
                'name' => $name,
                'slug' => $slug,
                'description' => $description,
                'parent_id' => $parent_id,
                'count' => 0
            ),
            array('%s', '%s', '%s', '%s', '%d', '%d')
        );
        
        if ($result) {
            $cat_id = $wpdb->insert_id;
            
            return array(
                'id' => intval($cat_id),
                'count' => 0,
                'description' => $description,
                'name' => $name,
                'slug' => $slug,
                'parent' => $parent_id,
                'tenant_id' => $tenant_id
            );
        }
        
        return new WP_Error('create_failed', '创建分类失败', array('status' => 500));
    }
    
    public function update_category($request) {
        global $wpdb;
        
        $tenant_id = $this->get_tenant_id();
        $id = intval($request->get_param('id'));
        
        $category = $wpdb->get_row($wpdb->prepare(
            "SELECT * FROM {$this->table_name} WHERE cat_id = %d AND tenant_id = %s",
            $id, $tenant_id
        ));
        
        if (!$category) {
            return new WP_Error('not_found', '分类不存在', array('status' => 404));
        }
        
        $name = $request->get_param('name') ? sanitize_text_field($request->get_param('name')) : $category->name;
        $description = $request->get_param('description') ? sanitize_textarea_field($request->get_param('description')) : $category->description;
        $parent_id = $request->get_param('parent') !== null ? intval($request->get_param('parent')) : $category->parent_id;
        
        if ($request->get_param('slug')) {
            $slug = sanitize_title($request->get_param('slug'));
        } else {
            $slug = $category->slug;
        }
        
        $result = $wpdb->update(
            $this->table_name,
            array(
                'name' => $name,
                'slug' => $slug,
                'description' => $description,
                'parent_id' => $parent_id
            ),
            array('cat_id' => $id),
            array('%s', '%s', '%s', '%d'),
            array('%d')
        );
        
        if ($result !== false) {
            return array(
                'id' => intval($id),
                'count' => intval($category->count),
                'description' => $description,
                'name' => $name,
                'slug' => $slug,
                'parent' => $parent_id,
                'tenant_id' => $tenant_id
            );
        }
        
        return new WP_Error('update_failed', '更新分类失败', array('status' => 500));
    }
    
    public function delete_category($request) {
        global $wpdb;
        
        $tenant_id = $this->get_tenant_id();
        $id = intval($request->get_param('id'));
        
        $category = $wpdb->get_row($wpdb->prepare(
            "SELECT * FROM {$this->table_name} WHERE cat_id = %d AND tenant_id = %s",
            $id, $tenant_id
        ));
        
        if (!$category) {
            return new WP_Error('not_found', '分类不存在', array('status' => 404));
        }
        
        $children = $wpdb->get_var($wpdb->prepare(
            "SELECT COUNT(*) FROM {$this->table_name} WHERE parent_id = %d AND tenant_id = %s",
            $id, $tenant_id
        ));
        
        if ($children > 0) {
            return new WP_Error('has_children', '该分类下有子分类，无法删除', array('status' => 400));
        }
        
        $result = $wpdb->delete(
            $this->table_name,
            array('cat_id' => $id),
            array('%d')
        );
        
        if ($result) {
            return array('deleted' => true, 'id' => $id);
        }
        
        return new WP_Error('delete_failed', '删除分类失败', array('status' => 500));
    }
}

new Tenant_Category_Isolation();
