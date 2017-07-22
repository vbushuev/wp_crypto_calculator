<?php
/*
Plugin Name: Crypto Calculator
Description: Calculating mining crypto currency
Version: 1.0
Author: pittsb
Author URI: https://kwork.ru/user/pittsb
Plugin URI: https://kwork.ru/track?id=762121
*/

define('WP_CRYPTO_CALCULATOR_DIR', plugin_dir_path(__FILE__));
define('WP_CRYPTO_CALCULATOR_URL', plugin_dir_url(__FILE__));


add_action( 'init', 'crypto_calculator_load_resources_and_shortcodes', 1 );
function crypto_calculator_load_resources_and_shortcodes(){
    add_shortcode( 'crypto_calculator', 'crypto_calculator_shortcode' );
    if( is_admin() ){
        include WP_CRYPTO_CALCULATOR_DIR.'includes/admin.php';
    }
}

function crypto_calculator_shortcode($a,$t){
    $template = file_get_contents(WP_CRYPTO_CALCULATOR_DIR.'templates/cc.html');
    $params = array("title"=>isset($a["title"])?$a["title"]:"Currency");
    $content = preg_replace_callback('/\{\{([^\}]+)\}\}/im',function($m)use($params){
        $var = strtolower(trim($m[1]));
        return isset($params[$var])?$params[$var]:'';
    },$template);
    return $content;
}
/** регистрация фильтров и действий * */
function vsb_crypto_calculator_init() {
    wp_deregister_script( 'jquery' );
    wp_enqueue_script( 'jquery', 'https://code.jquery.com/jquery-2.2.4.min.js');
    wp_enqueue_style( 'crypto_calculator',WP_CRYPTO_CALCULATOR_URL.'css/style.css', false, '1.0.0', 'all');
    wp_enqueue_style( 'bootsrap','https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css');
    wp_enqueue_script( 'crypto_calculator', WP_CRYPTO_CALCULATOR_URL.'js/cc.js', false, '1.0.0', 'all');
}
//
add_action('wp_enqueue_scripts', 'vsb_crypto_calculator_init');
//
// //
// add_action( 'wp_ajax_crypto_calculator_ajax_data',        'crypto_calculator_ajax_data' ); // For logged in users
// add_action( 'wp_ajax_nopriv_crypto_calculator_ajax_data', 'crypto_calculator_ajax_data' ); // For anonymous users
//
// function crypto_calculator_ajax_data(){
//     $res = get_option('crypto_calculator');
//     echo(json_encode( $res ));
//     wp_die();
// }

// где-то в functions.php
function crypto_calculator_js_variables(){
    $variables = array (
        'ajax_url' => admin_url('admin-ajax.php'),
        'is_mobile' => wp_is_mobile(),
        "currencies" => get_option('vsb_crypto_calculator_currencies')
    );
    echo '<script type="text/javascript">window.vsbCryptoCalculatorInitData = '.json_encode($variables).';</script>';
}
add_action('wp_head','crypto_calculator_js_variables');



?>
