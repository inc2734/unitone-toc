import { registerBlockType } from '@wordpress/blocks';

import './style.scss';

import icon from '../icon';
import edit from './edit';
import save from './save';

registerBlockType( 'unitone-toc/toc', {
	icon: {
		src: icon,
	},
	edit,
	save,
} );
