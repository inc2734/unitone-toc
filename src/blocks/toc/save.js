import { useBlockProps, RichText } from '@wordpress/block-editor';

export default function ( { attributes } ) {
	const { headings, displayTitle, title, id } = attributes;

	return (
		<div
			{ ...useBlockProps.save( {
				className: 'unitone-toc',
				'data-id': !! id ? id : undefined,
				'data-unitone-toc-headings': headings,
			} ) }
		>
			{ displayTitle && (
				<RichText.Content
					className="unitone-toc__title"
					tagName="div"
					value={ title }
				/>
			) }

			<div className="unitone-toc__content">
				<div className="contents-outline"></div>
			</div>
		</div>
	);
}
