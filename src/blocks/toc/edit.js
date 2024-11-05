import { compact, indexOf, remove, union } from 'lodash';

import {
	InspectorControls,
	useBlockProps,
	RichText,
} from '@wordpress/block-editor';

import {
	CheckboxControl,
	PanelBody,
	ToggleControl,
} from '@wordpress/components';

import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

export default function ( { attributes, setAttributes, clientId } ) {
	const { headings, displayTitle, title, moveToBefore1stHeading, id } =
		attributes;

	useEffect( () => {
		if ( !! id ) {
			return;
		}

		setAttributes( { id: clientId } );
	}, [ clientId ] );

	const _generateNewHeadings = ( isChecked, heading ) => {
		let newHeadings = headings.split( ',' );

		if ( isChecked ) {
			newHeadings.push( heading );
		} else {
			newHeadings = remove( newHeadings, ( value ) => heading !== value );
		}

		return compact( union( newHeadings ) ).join( ',' );
	};

	const blockProps = useBlockProps( {
		className: 'unitone-toc',
		'data-id': !! id ? id : undefined,
		'data-unitone-toc-headings': headings,
		'data-move-to-before-1st-heading': moveToBefore1stHeading,
	} );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'General', 'unitone-toc' ) }>
					<ToggleControl
						__nextHasNoMarginBottom
						label={ __( 'Display title', 'unitone-toc' ) }
						checked={ displayTitle }
						onChange={ ( value ) =>
							setAttributes( {
								displayTitle: value,
							} )
						}
					/>

					<CheckboxControl
						__nextHasNoMarginBottom
						name="headings[]"
						value="h2"
						label={ __( 'Show h2', 'unitone-toc' ) }
						checked={
							-1 !== indexOf( headings.split( ',' ), 'h2' )
						}
						onChange={ ( isChecked ) =>
							setAttributes( {
								headings: _generateNewHeadings(
									isChecked,
									'h2'
								),
							} )
						}
					/>

					<CheckboxControl
						__nextHasNoMarginBottom
						name="headings[]"
						value="h3"
						label={ __( 'Show h3', 'unitone-toc' ) }
						checked={
							-1 !== indexOf( headings.split( ',' ), 'h3' )
						}
						onChange={ ( isChecked ) =>
							setAttributes( {
								headings: _generateNewHeadings(
									isChecked,
									'h3'
								),
							} )
						}
					/>

					<CheckboxControl
						__nextHasNoMarginBottom
						name="headings[]"
						value="h4"
						label={ __( 'Show h4', 'unitone-toc' ) }
						checked={
							-1 !== indexOf( headings.split( ',' ), 'h4' )
						}
						onChange={ ( isChecked ) =>
							setAttributes( {
								headings: _generateNewHeadings(
									isChecked,
									'h4'
								),
							} )
						}
					/>

					<CheckboxControl
						__nextHasNoMarginBottom
						name="headings[]"
						value="h5"
						label={ __( 'Show h5', 'unitone-toc' ) }
						checked={
							-1 !== indexOf( headings.split( ',' ), 'h5' )
						}
						onChange={ ( isChecked ) =>
							setAttributes( {
								headings: _generateNewHeadings(
									isChecked,
									'h5'
								),
							} )
						}
					/>

					<CheckboxControl
						__nextHasNoMarginBottom
						name="headings[]"
						value="h6"
						label={ __( 'Show h6', 'unitone-toc' ) }
						checked={
							-1 !== indexOf( headings.split( ',' ), 'h6' )
						}
						onChange={ ( isChecked ) =>
							setAttributes( {
								headings: _generateNewHeadings(
									isChecked,
									'h6'
								),
							} )
						}
					/>

					<ToggleControl
						__nextHasNoMarginBottom
						label={ __(
							'Move to before 1st heading',
							'unitone-toc'
						) }
						checked={ moveToBefore1stHeading }
						onChange={ ( value ) =>
							setAttributes( {
								moveToBefore1stHeading: value,
							} )
						}
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps } aria-hidden="false">
				{ displayTitle && (
					<RichText
						className="unitone-toc__title"
						tagName="div"
						value={ title }
						onChange={ ( newAttribute ) => {
							setAttributes( {
								title: newAttribute,
							} );
						} }
						placeholder={ __( 'Enter title here', 'unitone-toc' ) }
					/>
				) }

				<div className="unitone-toc__content">
					<div className="contents-outline">
						<ol>
							<li>
								{ __(
									'In the actual screen, it is displayed when headings exists on the page.',
									'unitone-toc'
								) }
							</li>
						</ol>
					</div>
				</div>
			</div>
		</>
	);
}
