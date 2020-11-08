import {createCustomElement} from '@servicenow/ui-core';
import snabbdom from '@servicenow/ui-renderer-snabbdom';

import {view} from './view';

createCustomElement('incident-card', {
	renderer: {type: snabbdom},
	view,
	properties: {
		sysId: '',
		shortDescription: '',
		number: '',
		incidentState: '',
		assignmentGroup: '',
		assignedTo: '',
		sysUpdatedOn: '',
	},
});
