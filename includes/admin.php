<?php


// create custom plugin settings menu
add_action('admin_menu', 'vsb_crypto_calculator_create_menu');
function vsb_crypto_calculator_create_menu() {

	//create new top-level menu
	add_menu_page(
		'Crypto Calculator Settings',
		'Crypto Calculator',
		'administrator', __FILE__,
		'vsb_crypto_calculator_settings_page' , WP_CRYPTO_CALCULATOR_URL.'/img/icon.png' );

	//call register settings function
	add_action( 'admin_init', 'register_vsb_crypto_calculator_settings' );
}

/* register menu item */
//menu setup
add_action('admin_menu', 'vsb_crypto_calculator_admin_menu_setup');
function vsb_crypto_calculator_admin_menu_setup() {
    add_submenu_page(
        'options-general.php',
        'CryptoCalculator Settings',
        'CryptoCalculator',
        'manage_options',
        'vsb_crypto_calculator',
        'vsb_crypto_calculator_admin_page_screen'
    );
}

function register_vsb_crypto_calculator_settings() {
	//register our settings
	register_setting( 'vsb-crypto-calculator-settings-group', 'vsb_crypto_calculator_currencies' );
}
//
function vsb_crypto_calculator_settings_page() {
	$curs = get_option('vsb_crypto_calculator_currencies');
	if(!is_array($curs) || count($curs)<3){
		$curs = array(
			 array("name"=>"BTC", "complex"=>708659466230,"hashingPower"=>1,"hashingPowerUnit"=>1000000000000,"powerConsumption"=>1000,"powerCost"=>"0.1"),
			 array("name"=>"LTC", "complex"=>275721,"hashingPower"=>20,"hashingPowerUnit"=>1000000,"powerConsumption"=>1000,"powerCost"=>"0.1"),
			 array("name"=>"ETH", "complex"=>1215000000000,"hashingPower"=>40,"hashingPowerUnit"=>1000000000000,"powerConsumption"=>1000,"powerCost"=>"0.1"),
			 array("name"=>"ETC", "complex"=>1215000000000,"hashingPower"=>50,"hashingPowerUnit"=>1000000000000,"powerConsumption"=>1000,"powerCost"=>"0.1"),
			 array("name"=>"XMR", "complex"=>14.08*1000000000,"hashingPower"=>3,"hashingPowerUnit"=>1000000000000,"powerConsumption"=>1000,"powerCost"=>"0.1"),
			 array("name"=>"ZEC", "complex"=>365064,"hashingPower"=>1,"hashingPowerUnit"=>1000000000,"powerConsumption"=>1000,"powerCost"=>"0.1"),
			 array("name"=>"DASH", "complex"=>365064,"hashingPower"=>1,"hashingPowerUnit"=>1000000000,"powerConsumption"=>1000,"powerCost"=>"0.1"),
		);
		update_option('vsb_crypto_calculator_currencies',$curs);
	}
	// $curs = is_array($curs)?$curs:[];
	/*
	 array(

	)
	 complex:708659466230,
	 hashingPower:1,
	 hashingPowerUnit:1073741824,
	 powerConsumption:1000,
	 powerCost:.4,
	 */
?>
<div class="wrap">
<h1>Crypto Calulator</h1>

<form method="post" action="options.php">
    <?php settings_fields( 'vsb-crypto-calculator-settings-group' ); ?>
    <?php do_settings_sections( 'vsb-crypto-calculator-settings-group' ); ?>
	<script>
		function addCurrency(){
			var s = '<tr>',i=document.getElementsByClassName("currency_row").length, table = document.getElementById("currencies");
			s+= '<td scope="row"><input type="text" name="vsb_crypto_calculator_currencies['+i+'][name]" value="" /></td>';
			s+= '<td><input type="text" name="vsb_crypto_calculator_currencies['+i+'][complex]" value="" /></td>';
	        s+= '<td><input type="text" name="vsb_crypto_calculator_currencies['+i+'][hashingPower]" value="20" /></td>';
	        s+= '<td><select name="vsb_crypto_calculator_currencies['+i+'][hashingPowerUnit]">';
			s+= '<option value="1">H/s</option>';
			s+= '<option value="1000">KH/s</option>';
			s+= '<option value="1000000" selected="selected">MH/s</option>';
			s+= '<option value="1000000000">G/s</option>';
			s+= '<option value="1000000000000">TH/s</option>';
			s+= '</select></td>';
	        s+= '<td><input type="text" name="vsb_crypto_calculator_currencies['+i+'][powerConsumption]" value="1200" /></td>';
	        s+= '<td><input type="text" name="vsb_crypto_calculator_currencies['+i+'][powerCost]" value="0.1" /></td>';
	        s+= '</tr>';
			table.innerHTML = table.innerHTML + s;
		}
	</script>
    <table class="form-table" id="currencies">
		<tr>
			<th colspan="4"><button type="button" class="button button-primary" onclick="addCurrency();">Добавить валюту</button></th>
		</tr>
		<tr>
			<th rowspan="2">Валюта</th>
			<th rowspan="2">Текущая сложность</th>
			<th colspan="4">Параметры по-умолчанию</th>
		</tr>
		<tr>
			<th>Hashing</th>
			<th>Hashing unit</th>
			<th>Потребляемая мощность (КВ/ч)</th>
			<th>Стоимость КВ/ч</th>
		</tr>
		<?php
		for($i=0;$i<count($curs);++$i){
			echo '<tr valign="top" class="currency_row" id="currency_'.$cur.'">';
			echo '<td scope="row"><input type="text" name="vsb_crypto_calculator_currencies['.$i.'][name]" value="'.$curs[$i]["name"].'" /></td>';
			echo '<td><input type="text" name="vsb_crypto_calculator_currencies['.$i.'][complex]" value="'.$curs[$i]["complex"].'" /></td>';
	        echo '<td><input type="text" name="vsb_crypto_calculator_currencies['.$i.'][hashingPower]" value="'.$curs[$i]["hashingPower"].'" /></td>';
	        echo '<td><select name="vsb_crypto_calculator_currencies['.$i.'][hashingPowerUnit]">';
			echo '<option value="1"'.(($curs[$i]["hashingPowerUnit"]=="1")?' selected="selected"':'').'>H/s</option>';
			echo '<option value="1000"'.(($curs[$i]["hashingPowerUnit"]=="1000")?' selected="selected"':'').'>KH/s</option>';
			echo '<option value="1000000"'.(($curs[$i]["hashingPowerUnit"]=="1000000")?' selected="selected"':'').'>MH/s</option>';
			echo '<option value="1000000000"'.(($curs[$i]["hashingPowerUnit"]=="1000000000")?' selected="selected"':'').'>G/s</option>';
			echo '<option value="1000000000000"'.(($curs[$i]["hashingPowerUnit"]=="1000000000000")?' selected="selected"':'').'>TH/s</option>';
			echo '</select></td>';
	        echo '<td><input type="text" name="vsb_crypto_calculator_currencies['.$i.'][powerConsumption]" value="'.$curs[$i]["powerConsumption"].'" /></td>';
	        echo '<td><input type="text" name="vsb_crypto_calculator_currencies['.$i.'][powerCost]" value="'.$curs[$i]["powerCost"].'" /></td>';
	        echo '</tr>';
		} ?>
	</table>

    <?php submit_button(); ?>

</form>
</div>
<?php
}

/* display page content */
function vsb_crypto_calculator_admin_page_screen() {
    global $submenu;

    // access page settings
    $page_data = array();

    foreach ($submenu['options-general.php'] as $i => $menu_item) {
        if ($submenu['options-general.php'][$i][2] == 'vsb_crypto_calculator') {
            $page_data = $submenu['options-general.php'][$i];
        }
    }
    // output
?>
    <div class="wrap">
        <?php screen_icon(); ?>
        <h2><?php echo $page_data[3]; ?></h2>
        <form id="vsb_crypto_calculator_options" action="options.php" method="post">
            <?php
            settings_fields('vsb_crypto_calculator_options');
            do_settings_sections('vsb_crypto_calculator');
            submit_button('Save options', 'primary', 'vsb_crypto_calculator_options_submit');
            ?>
        </form>
    </div>
    <?php
}

/* settings link in plugin management screen */
add_filter('plugin_action_links', 'vsb_crypto_calculator_settings_link', 2, 2);
function vsb_crypto_calculator_settings_link($actions, $file) {
    if (false !== strpos($file, 'CryptoCalculator')) {
        $actions['settings'] = '<a href="options-general.php?page=vsb_crypto_calculator">Settings</a>';
    }

    return $actions;
}



/* регистрация настроек в системе */
add_action('admin_init', 'vsb_crypto_calculator_settings_init');
function vsb_crypto_calculator_settings_init() {
    register_setting(
        'vsb_crypto_calculator_options',
        'vsb_crypto_calculator_options',
        'vsb_crypto_calculator_options_validate'
    );

    add_settings_section(
        'vsb_crypto_calculator_authorbox',
        'Author\'s box',
        'vsb_crypto_calculator_authorbox_desc',
        'vsb_crypto_calculator'
    );

    add_settings_field(
        'vsb_crypto_calculator_authorbox_template',
        'Template',
        'vsb_crypto_calculator_authorbox_field',
        'vsb_crypto_calculator',
        'vsb_crypto_calculator_authorbox'
    );
}



/* обработка ввода */

function vsb_crypto_calculator_options_validate($input) {
    global $allowedposttags, $allowedrichhtml;

    if (isset($input['authorbox_template'])) {
        $input['authorbox_template'] = wp_kses_post($input['authorbox_template']);
    }

    return $input;
}

/* описание */

function vsb_crypto_calculator_authorbox_desc() {
    echo "<p>Enter the template markup for author box using placeholders: [gauthor_name], [gauthor_url], [gauthor_desc] for name, URL and description of author correspondingly.</p>";
}

/* вывод полей */

function vsb_crypto_calculator_authorbox_field() {
    $options = get_option('vsb_crypto_calculator_options');
    $authorbox = (isset($options['authorbox_template'])) ? $options['authorbox_template'] : '';
    $authorbox = esc_textarea($authorbox);
?>
    <textarea id="authorbox_template" name="vsb_crypto_calculator_options[authorbox_template]" cols="50" rows="5" class="large-text code">
    <?php echo $authorbox; ?>
    </textarea>
<?php
}
