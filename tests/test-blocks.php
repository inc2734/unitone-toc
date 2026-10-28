<?php
/**
 * Tests for block registration and updater integration.
 */
class BlocksTest extends WP_UnitTestCase {

	public function test_toc_block_is_registered() {
		$block = WP_Block_Type_Registry::get_instance()->get_registered( 'unitone-toc/toc' );

		$this->assertInstanceOf( WP_Block_Type::class, $block );
		$this->assertSame( 3, $block->api_version );
		$this->assertSame( 'h2,h3,h4', $block->attributes['headings']['default'] );
		$this->assertContains( 'unitone-toc-toc-editor-script', $block->editor_script_handles );
		$this->assertContains( 'unitone-toc-toc-view-script', $block->view_script_handles );
		$this->assertTrue( wp_script_is( 'unitone-toc-toc-view-script', 'registered' ) );
	}

	public function test_saved_toc_markup_is_preserved_when_rendered() {
		$content = '<!-- wp:unitone-toc/toc {"id":"test-toc"} -->'
			. '<div class="wp-block-unitone-toc-toc unitone-toc" data-id="test-toc" data-unitone-toc-headings="h2,h3,h4">'
			. '<div class="unitone-toc__content"><div class="contents-outline"></div></div></div>'
			. '<!-- /wp:unitone-toc/toc -->';

		$rendered = do_blocks( $content );

		$this->assertStringContainsString( 'data-id="test-toc"', $rendered );
		$this->assertStringContainsString( 'data-unitone-toc-headings="h2,h3,h4"', $rendered );
		$this->assertStringContainsString( 'class="contents-outline"', $rendered );
	}

	public function test_updater_uses_the_unitone_download_endpoint() {
		$filter = 'inc2734_github_plugin_updater_zip_url_inc2734/unitone-toc';
		$url    = 'https://unitone.2inc.org/download/unitone-toc.zip';

		$this->assertSame( $url, apply_filters( $filter, $url ) );
		$this->assertFalse( apply_filters( $filter, 'https://github.com/inc2734/unitone-toc/archive/main.zip' ) );
		$this->assertTrue( class_exists( Inc2734\WP_GitHub_Plugin_Updater\Bootstrap::class ) );
	}
}
