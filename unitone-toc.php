<?php
/**
 * Plugin name: unitone TOC
 * Version: 1.0.6
 * Tested up to: 6.8
 * Requires at least: 6.7
 * Requires PHP: 7.4
 * Description: This plugin adds the table of contents block.
 * Author: Takashi Kitajima
 * Author URI: https://2inc.org
 * License: GPL2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: unitone-toc
 *
 * @package unitone-toc
 * @author inc2734
 * @license GPL-2.0+
 */

namespace UnitoneToc;

use Unitone\App\DynamicBlock;

define( 'UNITONE_TOC_URL', untrailingslashit( plugin_dir_url( __FILE__ ) ) );
define( 'UNITONE_TOC_PATH', untrailingslashit( plugin_dir_path( __FILE__ ) ) );

class Bootstrap {

	/**
	 * Constructor.
	 */
	public function __construct() {
		add_action( 'plugins_loaded', array( $this, '_bootstrap' ) );
	}

	/**
	 * Bootstrap.
	 */
	public function _bootstrap() {
		require UNITONE_TOC_PATH . '/inc/updater.php';

		$theme = wp_get_theme( get_template() );
		if ( 'unitone' !== $theme->template ) {
			add_action(
				'admin_notices',
				function () {
					?>
					<div class="notice notice-warning is-dismissible">
						<p>
							<?php esc_html_e( '[unitone TOC] Needs the unitone.', 'unitone-toc' ); ?>
						</p>
					</div>
					<?php
				}
			);
			return;
		}

		require UNITONE_TOC_PATH . '/inc/i18n.php';
		require UNITONE_TOC_PATH . '/inc/blocks.php';
	}
}

require_once __DIR__ . '/vendor/autoload.php';
new \UnitoneToc\Bootstrap();
