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
	function ( $url, $user_name, $repository, $version ) {
		return add_query_arg(
			array(
				'repository' => 'unitone-toc',
				'version'    => (string) $version,
			),
			'https://unitone.2inc.org/wp-json/unitone-license-manager/v1/update/'
		);
	},
	10,
	4
);

add_filter(
	'inc2734_github_plugin_updater_requester_args',
	function ( $args, $url, $user_name, $repository ) {
		if ( 'inc2734' !== $user_name || 'unitone-toc' !== $repository ) {
			return $args;
		}

		$license_key = Manager::get_option( 'license-key' );
		$headers     = isset( $args['headers'] ) && is_array( $args['headers'] )
			? $args['headers']
			: array();

		$headers['X-Unitone-License-Key'] = (string) $license_key;

		$args['headers'] = $headers;

		return $args;
	},
	10,
	4
);
