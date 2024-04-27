<?php
/**
 * @package unitone-toc
 * @author Takashi Kitajima
 * @license GPL-2.0+
 */

use Inc2734\WP_GitHub_Plugin_Updater\Bootstrap as Updater;
use Unitone\App\Controller\Manager;

add_action(
	'init',
	function () {
		new Updater(
			plugin_basename( UNITONE_TOC_PATH . '/unitone-toc.php' ),
			'inc2734',
			'unitone-toc',
			array(
				'homepage' => 'https://unitone.2inc.org',
			)
		);
	}
);

/**
 * Force update check.
 */
add_action(
	'admin_init',
	function () {
		if ( is_admin() && current_user_can( 'update_core' ) ) {
			$force_check = filter_input( INPUT_GET, 'force-check' );
			if ( ! empty( $force_check ) ) {
				set_site_transient( 'update_plugins', null );
			}
		}
	}
);

/**
 * There is a case that comes back to GitHub's zip url.
 * In that case it returns false because it is illegal.
 *
 * @param string $url
 * @return string|false
 */
add_filter(
	'inc2734_github_plugin_updater_zip_url_inc2734/unitone-toc',
	function ( $url ) {
		if ( 0 !== strpos( $url, 'https://unitone.2inc.org/' ) ) {
			return false;
		}
		return $url;
	}
);

/**
 * Customize request URL that for updating.
 * Access https://unitone.2inc.org/wp-json/unitone-license-manager/v1/update/...?repository=unitone-toc
 * and return json after authentication passes.
 *
 * @return string
 */
add_filter(
	'inc2734_github_plugin_updater_request_url_inc2734/unitone-toc',
	function () {
		$license_key = Manager::get_option( 'license-key' );
		return sprintf(
			'https://unitone.2inc.org/wp-json/unitone-license-manager/v1/update/%1$s?repository=unitone-toc',
			esc_attr( $license_key )
		);
	}
);
