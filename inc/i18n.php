<?php
/**
 * @package unitone-toc
 * @author Takashi Kitajima
 * @license GPL-2.0+
 */

/**
 * Load textdomain.
 */
function unitone_toc_load_textdomain() {
	load_plugin_textdomain( 'unitone-toc', false, basename( UNITONE_TOC_PATH ) . '/languages' );
}
add_action( 'init', 'unitone_toc_load_textdomain', 1 );
