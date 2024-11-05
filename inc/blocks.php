<?php
/**
 * @package unitone-toc
 * @author Takashi Kitajima
 * @license GPL-2.0+
 */

function unitone_toc_register_blocks() {
	register_block_type( UNITONE_TOC_PATH . '/dist/blocks/toc' );
	wp_set_script_translations( 'unitone-toc-toc-editor-script', 'unitone-toc', UNITONE_TOC_PATH . '/languages' );
}
add_action( 'init', 'unitone_toc_register_blocks' );
