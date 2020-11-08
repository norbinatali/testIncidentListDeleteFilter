import {createCustomElement} from '@servicenow/ui-core';
import snabbdom from '@servicenow/ui-renderer-snabbdom';
import {view} from './view';

createCustomElement('modal-body-items', {
	renderer: {type: snabbdom},
	view,
	properties: {
		label: '',
		value: '',
	},
});
