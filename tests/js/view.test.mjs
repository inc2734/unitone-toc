import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import { JSDOM } from 'jsdom';

let dom;
let importCount = 0;

const tocMarkup = ( attributes = '' ) =>
	`<div class="unitone-toc" data-id="toc" data-unitone-toc-headings="h2,h3,h4" ${ attributes }><div class="contents-outline"></div></div>`;

async function initialize( content, { header = '', beforeInit } = {} ) {
	dom = new JSDOM(
		`${ header }<main class="entry-content">${ content }</main>`,
		{
			pretendToBeVisual: true,
			url: 'https://example.com/',
		}
	);
	for ( const key of [ 'window', 'document', 'NodeList', 'HTMLElement' ] ) {
		globalThis[ key ] = key === 'window' ? dom.window : dom.window[ key ];
	}
	beforeInit?.();
	await import( `../../src/blocks/toc/view.js?test=${ ++importCount }` );
	document.dispatchEvent( new window.Event( 'DOMContentLoaded' ) );
	return document;
}

afterEach( () => {
	dom?.window.close();
	for ( const key of [ 'window', 'document', 'NodeList', 'HTMLElement' ] ) {
		delete globalThis[ key ];
	}
} );

test( 'builds nested links for native and ARIA headings, preserving existing anchors', async () => {
	const doc = await initialize(
		`${ tocMarkup() }<h2 id="existing">First</h2><div role="heading" aria-level="3">Second</div><h4>Third</h4><h2>Fourth</h2><h5>Excluded</h5>`
	);
	const links = [ ...doc.querySelectorAll( '.contents-outline a' ) ];
	assert.deepEqual(
		links.map( ( link ) => link.textContent ),
		[ 'First', 'Second', 'Third', 'Fourth' ]
	);
	assert.equal( links[ 0 ].getAttribute( 'href' ), '#existing' );
	assert.ok(
		doc.querySelector( '.contents-outline > ol > li > ol > li > ol > li' )
	);
	for ( const link of links ) {
		assert.ok( doc.querySelector( link.getAttribute( 'href' ) ) );
	}
} );

test( 'excludes hidden headings and hidden ancestors', async () => {
	const doc = await initialize(
		`${ tocMarkup() }<h2>Visible</h2><h3 style="display:none">Hidden</h3><div style="visibility:hidden"><h2>Hidden parent</h2></div>`
	);
	assert.deepEqual(
		[ ...doc.querySelectorAll( '.contents-outline a' ) ].map(
			( link ) => link.textContent
		),
		[ 'Visible' ]
	);
} );

test( 'moves the TOC before the first heading when enabled', async () => {
	const doc = await initialize(
		`<p>Introduction</p><h2>First</h2>${ tocMarkup( 'data-move-to-before-1st-heading="true"' ) }`
	);
	assert.equal(
		doc.querySelector( 'h2' ).previousElementSibling,
		doc.querySelector( '.unitone-toc' )
	);
} );

test( 'removes the TOC when no matching heading exists', async () => {
	const doc = await initialize( `${ tocMarkup() }<h5>Excluded</h5>` );
	assert.equal( doc.querySelector( '.unitone-toc' ), null );
} );

test( 'ignores a TOC without its required identifier', async () => {
	const doc = await initialize(
		`${ tocMarkup().replace( 'data-id="toc"', '' ) }<h2>First</h2>`
	);
	assert.equal(
		doc.querySelector( '.unitone-toc' ).hasAttribute( 'data-initialized' ),
		false
	);
} );

test( 'includes the sticky header height in anchor scroll padding', async () => {
	const doc = await initialize( `${ tocMarkup() }<h2>First</h2>`, {
		header: '<header class="site-header"><div data-unitone-layout="-position:sticky"></div></header>',
		beforeInit() {
			document.documentElement.style.scrollPaddingTop = '20px';
			Object.defineProperty(
				document.querySelector( '.site-header div' ),
				'offsetHeight',
				{ value: 60 }
			);
		},
	} );
	assert.equal( doc.documentElement.style.scrollPaddingTop, '80px' );
} );

test( 'updates the current item after scrolling', async () => {
	let secondTop = 1000;
	const doc = await initialize(
		`${ tocMarkup() }<h2>First</h2><h2>Second</h2>`,
		{
			beforeInit() {
				const headings = document.querySelectorAll( 'h2' );
				headings[ 0 ].getBoundingClientRect = () => ( { top: 0 } );
				headings[ 1 ].getBoundingClientRect = () => ( {
					top: secondTop,
				} );
			},
		}
	);
	const nextFrame = () =>
		new Promise( ( resolve ) => window.requestAnimationFrame( resolve ) );
	await nextFrame();
	assert.equal(
		doc.querySelector( '[data-is-current] > a' ).textContent,
		'First'
	);
	secondTop = 100;
	window.dispatchEvent( new window.Event( 'scroll' ) );
	await nextFrame();
	assert.equal(
		doc.querySelector( '[data-is-current] > a' ).textContent,
		'Second'
	);
	assert.equal( doc.querySelectorAll( '[data-is-current]' ).length, 1 );
} );
