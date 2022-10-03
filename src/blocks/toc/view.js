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

		new ContentsOutline( toc, {
			headings,
			moveToBefore1stHeading: true,
		} );

		hasToc = true;
	} );

	if ( hasToc ) {
		let offset = 0;

		const header = document.querySelector( '.site-header' );
		if ( !! header ) {
			offset += header.offsetHeight;
		}

		const adminbar = document.getElementById( 'wpadminbar' );
		if ( !! header ) {
			offset += adminbar.offsetHeight;
		}

		if ( 0 < offset ) {
			const html = document.querySelector( 'html' );
			html.style.scrollPaddingTop = `${ offset }px`;
		}
	}
} );
