const NOW_MODAL_FOOTER_ACTION_CLICKED =
	'NOW_MODAL#FOOTER_ACTION_CLICKED';
const NOW_MODAL_OPENED_SET = 'NOW_MODAL#OPENED_SET';

export default {
	actionHandlers: {
		[NOW_MODAL_OPENED_SET]: ({state}) => {
			state.properties.closeModal();
		},
		[NOW_MODAL_FOOTER_ACTION_CLICKED]: ({state}) => {
			state.properties.deleteIncedent(state.properties.incident.sys_id);
		},
	},
};
