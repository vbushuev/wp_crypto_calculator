/*
Plugin Name: Crypto Calculator
Description: Calculating mining crypto
Version: 1.0
Author: pittsb
Author URI: https://kwork.ru/user/pittsb
Plugin URI: https://kwork.ru/user/pittsb
*/
<?php
define('WP_CRYPTO_CALCULATOR_DIR', plugin_dir_path(__FILE__));
define('WP_CRYPTO_CALCULATOR_URL', plugin_dir_url(__FILE__));
function wp_crypto_calculator_load(){

    if(is_admin()) // подключаем файлы администратора, только если он авторизован
        require_once(WP_CRYPTO_CALCULATOR_DIR.'includes/admin.php');

    require_once(WP_CRYPTO_CALCULATOR_DIR.'includes/core.php');
}
wp_crypto_calculator_load();
?>
