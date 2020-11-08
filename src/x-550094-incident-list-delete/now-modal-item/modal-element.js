import {createCustomElement} from '@servicenow/ui-core';
import snabbdom from '@servicenow/ui-renderer-snabbdom';
import actions from './actions';
import styles from './styles.scss';
import {view} from './view';

createCustomElement('modal-element', {
	renderer: {type: snabbdom},
	view,
	styles,
	properties: {
		incident: {},
		isModalOpen: true,
		closeModal: () => {
		},
		deleteIncedent: () => {
		},
	},
	...actions,
});
