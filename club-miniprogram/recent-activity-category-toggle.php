<?php
/**
 * Plugin Name: Recent Activity Category Toggle
 * Description: 为文章分类增加“近期活动展示”开关，并通过 REST 输出给小程序使用。
 * Version: 1.0.0
 * Author: Huwai
 */

if (!defined('ABSPATH')) {
    exit;
}

class Recent_Activity_Category_Toggle {
    private $meta_key = 'show_in_recent_activity';
    private $nonce_action = 'recent_activity_category_toggle_nonce_action';
    private $nonce_name = 'recent_activity_category_toggle_nonce';
    private $toggle_action = 'recent_activity_toggle';

    public function __construct() {
        add_action('init', array($this, 'register_term_meta'));
        add_action('rest_api_init', array($this, 'register_rest_fields'));
        add_action('category_edit_form_fields', array($this, 'render_edit_field'));
        add_action('created_category', array($this, 'save_field'));
        add_action('edited_category', array($this, 'save_field'));
        add_action('admin_init', array($this, 'handle_list_toggle_action'));
        add_filter('manage_edit-category_columns', array($this, 'add_admin_column'));
        add_filter('manage_category_custom_column', array($this, 'render_admin_column'), 10, 3);
    }

    public function register_term_meta() {
        register_term_meta('category', $this->meta_key, array(
            'type' => 'boolean',
            'single' => true,
            'default' => true,
            'show_in_rest' => true,
            'sanitize_callback' => array($this, 'sanitize_boolean'),
            'auth_callback' => '__return_true'
        ));
    }

    public function register_rest_fields() {
        register_rest_field('category', $this->meta_key, array(
            'get_callback' => array($this, 'get_rest_field_value'),
            'schema' => array(
                'description' => '近期活动展示开关',
                'type' => 'boolean',
                'context' => array('view', 'edit')
            )
        ));
    }

    public function get_rest_field_value($term_arr) {
        $term_id = is_array($term_arr) ? absint($term_arr['id'] ?? 0) : 0;
        if ($term_id <= 0) {
            return true;
        }
        return $this->get_enabled_state($term_id);
    }

    public function can_manage_categories() {
        return current_user_can('manage_categories');
    }

    public function sanitize_boolean($value) {
        if ($value === true || $value === 1 || $value === '1' || $value === 'true' || $value === 'on') {
            return 1;
        }
        return 0;
    }

    private function get_enabled_state($term_id) {
        if (!metadata_exists('term', $term_id, $this->meta_key)) {
            return true;
        }
        $value = get_term_meta($term_id, $this->meta_key, true);
        return $this->sanitize_boolean($value) === 1;
    }

    public function render_edit_field($term) {
        $enabled = $this->get_enabled_state($term->term_id);
        ?>
        <tr class="form-field term-group-wrap">
            <th scope="row"><label for="<?php echo esc_attr($this->meta_key); ?>">近期活动展示</label></th>
            <td>
                <?php wp_nonce_field($this->nonce_action, $this->nonce_name); ?>
                <label>
                    <input type="checkbox" id="<?php echo esc_attr($this->meta_key); ?>" name="<?php echo esc_attr($this->meta_key); ?>" value="1" <?php checked($enabled, true); ?>>
                    开启后该分类会在小程序“近期活动”中展示
                </label>
            </td>
        </tr>
        <?php
    }

    public function save_field($term_id) {
        if (!current_user_can('manage_categories')) {
            return;
        }

        if (!isset($_POST[$this->nonce_name]) || !wp_verify_nonce($_POST[$this->nonce_name], $this->nonce_action)) {
            return;
        }

        $enabled = isset($_POST[$this->meta_key]) ? 1 : 0;
        update_term_meta($term_id, $this->meta_key, $enabled);
    }

    public function add_admin_column($columns) {
        $columns['recent_activity_toggle'] = '近期活动';
        return $columns;
    }

    public function render_admin_column($content, $column_name, $term_id) {
        if ($column_name !== 'recent_activity_toggle') {
            return $content;
        }
        $enabled = $this->get_enabled_state($term_id);
        $url = wp_nonce_url(
            add_query_arg(
                array(
                    'taxonomy' => 'category',
                    'post_type' => 'post',
                    'action' => $this->toggle_action,
                    'term_id' => $term_id
                ),
                admin_url('edit-tags.php')
            ),
            $this->toggle_action . '_' . $term_id
        );
        $label = $enabled ? '已开启' : '已关闭';
        $btnText = $enabled ? '关闭' : '开启';
        $color = $enabled ? '#15803d' : '#b91c1c';
        return '<span style="display:inline-block;min-width:58px;color:' . esc_attr($color) . ';font-weight:600;">' . esc_html($label) . '</span>'
            . '<a class="button button-small" style="margin-left:6px;" href="' . esc_url($url) . '">' . esc_html($btnText) . '</a>';
    }

    public function handle_list_toggle_action() {
        if (!is_admin() || !current_user_can('manage_categories')) {
            return;
        }
        if (!isset($_GET['action']) || $_GET['action'] !== $this->toggle_action) {
            return;
        }
        if (!isset($_GET['term_id']) || !isset($_GET['_wpnonce'])) {
            return;
        }
        $term_id = absint($_GET['term_id']);
        if ($term_id <= 0) {
            return;
        }
        if (!wp_verify_nonce($_GET['_wpnonce'], $this->toggle_action . '_' . $term_id)) {
            return;
        }
        $enabled = $this->get_enabled_state($term_id);
        update_term_meta($term_id, $this->meta_key, $enabled ? 0 : 1);

        $redirect = remove_query_arg(array('action', 'term_id', '_wpnonce'));
        wp_safe_redirect($redirect);
        exit;
    }
}

new Recent_Activity_Category_Toggle();
