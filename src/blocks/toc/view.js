import ContentsOutline from '@inc2734/contents-outline';

document.addEventListener( 'DOMContentLoaded', () => {
	const entryContent = document.querySelector( '.entry-content' );
	if ( ! entryContent ) {
		return;
	}

	let hasToc = false;

	const toces = document.querySelectorAll( '.unitone-toc' );
	[].slice.call( toces ).forEach( ( toc ) => {
		const id = toc.getAttribute( 'data-id' );
		if ( ! id ) {
			return;
		}

		const headingsString = toc.getAttribute( 'data-unitone-toc-headings' );
		if ( ! headingsString ) {
			return;
		}

		const headingsSelector = headingsString
			.split( ',' )
			.map( ( selector ) => {
				const heading = selector.trim();
				const match = heading.match( /^h([1-6])$/i );

				return match
					? `${ heading },[role="heading"][aria-level="${ match[ 1 ] }"]`
					: heading;
			} )
			.join( ',' );

		const headings = [].slice.call(
			entryContent.querySelectorAll( headingsSelector )
		);

		const moveToBefore1stHeading =
			'true' === toc.getAttribute( 'data-move-to-before-1st-heading' )
				? true
				: false;

		new ContentsOutline( toc, {
			headings,
			moveToBefore1stHeading,
		} );

		hasToc = true;
	} );

	if ( hasToc ) {
		const html = document.querySelector( 'html' );
		const htmlStyle = window.getComputedStyle( html );
		const defaultScrollPaddingTop =
			parseInt( htmlStyle.getPropertyValue( 'scroll-padding-top' ) ) || 0;
		let offset = defaultScrollPaddingTop;

		// Deprecated
		const headerV1 = document.querySelector(
			'.site-header.-header-position\\:fixed'
		);
		if ( !! headerV1 ) {
			offset += headerV1.offsetHeight;
		}

		const headerV2 = document.querySelector(
			'.site-header :is([data-unitone-layout~="-position:sticky"], [data-unitone-layout~="-position:sticky-top-admin-bar"], [data-unitone-layout~="-position:fixed"], [data-unitone-layout~="-position:fixed-top-admin-bar"])'
		);
		if ( !! headerV2 ) {
			offset += headerV2.offsetHeight;
		}

		if ( defaultScrollPaddingTop < offset ) {
			html.style.scrollPaddingTop = `${ offset }px`;
		}
	}
} );
