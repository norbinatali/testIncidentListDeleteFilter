import {actionTypes} from '@servicenow/ui-core';
const {COMPONENT_BOOTSTRAPPED} = actionTypes;
import {createHttpEffect} from "@servicenow/ui-effect-http";
export const DELETE_INCIDENT = 'DELETE_INCIDENT';
export const DELETE_INCIDENT_EFFECT = 'DELETE_INCIDENT_EFFECT';
export const DELETE_INCIDENT_SUCCESS = 'DELETE_INCIDENT_SUCCESS';
export const NOW_DROPDOWN_PANEL_ITEM_CLICKED =
	'NOW_DROPDOWN_PANEL#ITEM_CLICKED';
export const DELETE_SEARCH_FIELD = 'DELETE_SEARCH_FIELD';
export const IS_LOADING = 'IS_LOADING';
export const CLOSE_MODAL = 'CLOSE_MODAL';
export const TOGGLE_CLICKED = 'NOW_TOGGLE#CHECKED_SET';
export const FETCH_LATEST_INCIDENT = "FETCH_LATEST_INCIDENT"
export const FETCH_INCIDENTS_PARAMS = "FETCH_INCIDENTS_PARAMS";
export const UPDATE_ITEM_REQUESTED = "UPDATE_ITEM_REQUESTED";
export const GET_ITEMS = "GET_ITEMS";
const FETCH_INCIDENT_SUCCESS = "FETCH_INCIDENT_SUCCESS";

export default {
	actionHandlers: {
		[COMPONENT_BOOTSTRAPPED]: (coeffects) => {
			const {dispatch, updateState} = coeffects;
			updateState({
				isLoading: true,
			});
			dispatch('FETCH_LATEST_INCIDENT', {
				sysparm_display_value: true,
			});
		},
		[FETCH_LATEST_INCIDENT]: createHttpEffect('api/now/table/incident', {
			method: 'GET',
			queryParams: ['sysparm_display_value', 'sysparm_query'],
			successActionType: 'FETCH_INCIDENT_SUCCESS'
		}),
		[FETCH_INCIDENT_SUCCESS]: (coeffects) => {
			const {action, updateState} = coeffects;
			const {result} = action.payload;
			updateState({result, isLoading: false});
		},
		[DELETE_INCIDENT]: ({action, dispatch, updateState}) => {
			updateState({
				isLoading: true,
				deletedIncidentId: action.payload.sys_id || '',
			});
			dispatch(CLOSE_MODAL);
			dispatch('DELETE_INCIDENT_EFFECT', {sys_id: action.payload.sys_id || ''});
		},
		'DELETE_INCIDENT_EFFECT': createHttpEffect(
			'api/now/table/incident/:sys_id',
			{
				method: 'DELETE',
				pathParams: ['sys_id'],
				successActionType: DELETE_INCIDENT_SUCCESS,
			}),
		'DELETE_INCIDENT_SUCCESS': ({state, updateState, dispatch}) => {
			dispatch('FETCH_LATEST_INCIDENT', {
				sysparm_display_value: true,
			});
			updateState({
				isLoading: false,
				incidents: state.result.filter(
					(incident) => incident.sys_id !== state.deletedIncidentId
				),
			});
		},
		[NOW_DROPDOWN_PANEL_ITEM_CLICKED]: ({action, state, dispatch, updateState,}) => {
			const {payload} = action;

			if (payload.item.id === 'delete') {
				dispatch(DELETE_INCIDENT, {sys_id: payload.item.cardId});
			} else {
				const incident = state.result.find(
					(incident) => incident.sys_id === payload.item.cardId
				);
				updateState({
					isModalOpen: true,
					modalIncident: incident,
				});
			}
		},
		[CLOSE_MODAL]: ({updateState}) => {
			updateState({
				isModalOpen: false,
				modalIncident: null,
			});
		},

		[GET_ITEMS]: ({dispatch, state}) => {
			const {searchString, sortBy} = state;

			const searchQuery = searchString ? `short_descriptionLIKE${searchString}^ORtextLIKE${searchString}` : '';
			const sortQuery = Array.from(sortBy).map(item => "ORDERBY" + item).join("^");
			const sysparm_query = `${sortQuery}^${searchQuery}`;

			dispatch(FETCH_LATEST_INCIDENT, {sysparm_query, sysparm_display_value: true});
		}

	},
};
