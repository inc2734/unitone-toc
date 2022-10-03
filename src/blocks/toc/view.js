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

		const headings = [].slice.call(
			entryContent.querySelectorAll( headingsString )
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

		const header = document.querySelector(
			'.site-header.-header-position\\:fixed'
		);
		if ( !! header ) {
			offset += header.offsetHeight;
		}

		if ( defaultScrollPaddingTop < offset ) {
			html.style.scrollPaddingTop = `${ offset }px`;
		}
	}
} );
