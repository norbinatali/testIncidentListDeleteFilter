import {createCustomElement} from '@servicenow/ui-core';
import snabbdom from '@servicenow/ui-renderer-snabbdom';
import styles from './styles.scss';
import '@servicenow/now-template-card'
import '@servicenow/now-modal'
import '@servicenow/now-button'
import './now-template-card-incident/incident-card'
import './now-modal-item/modal-element'
import './now-modal-api/modal-body-items'
import '@servicenow/now-loader';
import {CLOSE_MODAL, DELETE_INCIDENT, FETCH_LATEST_INCIDENT, SEARCH_REQUESTED} from "./actions";
import actions from "./actions";

const view = (state, {dispatch, updateProperties, updateState,}) => {
	const deleteIncedent = (incidentId) => {
		if (!state.isLoading) {
			updateState({
				isLoading: true,
			});
			dispatch(CLOSE_MODAL);
			dispatch(DELETE_INCIDENT, {sys_id: incidentId});
		}
	};
	const closeModal = () => dispatch(CLOSE_MODAL);
	const getItemsByParam = (param, desc) => {
		if (!state.isLoading) {
			updateState({
				isLoading: true,
			});
			const order = desc ? "ORDERBYDESC" : "ORDERBY";
			dispatch(FETCH_LATEST_INCIDENT, {sysparm_query: param ? order + param : '', sysparm_display_value: true});
			updateProperties({[param]: !desc});
		}
	};
	const triggerSearch = ({target: {value}}) => {
		if (!state.isLoading) {
			updateState({
				isLoading: true,
			});
			const searchValue = value.trim();
			if (searchValue === state.properties.searchString) {
				dispatch(FETCH_LATEST_INCIDENT, {sysparm_display_value: true});
			} else if (searchValue) {
				dispatch(SEARCH_REQUESTED, {searchString: searchValue});
			} else {
				updateState({
					searchString: searchValue,
					result: []
				});
			}
		}
	};

	return (
		<div>
			<h2 className="title">Incidents</h2>
			<div className="wrap">
				<div className={'filter-search-menu'}>
					<div className={'filter-buttons'}>
						<now-button className="now-button"
									variant={'secondary'}
									size="sm"
									label="Show All"
									on-click={() => getItemsByParam('')}
						/>
						<now-button
							className="now-m-inline--xs"
							variant={'secondary'}
							size="sm"
							label="By Number"
							on-click={() => getItemsByParam('number', state.properties.number)}
						/>
						<now-button
							className="now-m-inline--xs"
							variant={'secondary'}
							size="sm"
							label="By Short Description"
							on-click={() => getItemsByParam('short_description', state.properties.short_description)}
						/>
						<now-button
							className="now-m-inline--xs"
							variant={'secondary'}
							size="sm"
							label="By Assigment Group"
							on-click={() => getItemsByParam('assignment_group', state.properties.assignment_group)}
						/>
						<now-button
							className="now-m-inline--xs"
							variant={'secondary'}
							size="sm"
							label="By State"
							on-click={() => getItemsByParam('state', state.properties.state)}
						/>
						<now-button
							className="now-m-inline--xs"
							variant={'secondary'}
							size="sm"
							label="By Assigned To"
							on-click={() => getItemsByParam('assigned_to', state.properties.assigned_to)}
						/>
						<now-button
							className="now-m-inline--xs"
							variant={'secondary'}
							size="sm"
							label="By Updated On"
							on-click={() => getItemsByParam('assigned_to', state.properties.updated_on)}
						/>
					</div>
					<div className={'search'}>
						<input
							id={"input-search"}
							className="now-search-input"
							placeholder="Search"
							value={state.properties.searchString}
							on-blur={triggerSearch}
						/>
					</div>
				</div>
				{state.isLoading ? (
					<now-loader
						className='loader'
						label="Loading..."
						size="lg"
					/>
				) : (
					<div>
						<div className={"card-wrapper"}>
							<modal-element
								isModalOpen={state.isModalOpen}
								incident={state.modalIncident}
								closeModal={closeModal}
								deleteIncedent={deleteIncedent}
							/>

							{state.result.length ? (
								state.result && state.result.map(card => (
									<incident-card
										sysId={card.sys_id || ''}
										shortDescription={card.short_description}
										number={card.number}
										incidentState={card.state}
										assignmentGroup={card.assignment_group.display_value}
										assignedTo={card.assigned_to.display_value}
										sysUpdatedOn={card.sys_updated_on}
										className="card-content"
									/>
								))) : (
								<div className={'no-list-label'}>
								<span className="no-response-found">
				<now-heading label={"No matches found"} variant="title-tertiary"/>
								</span>
								</div>
							)}
						</div>
					</div>)}
			</div>
		</div>
	)
};

createCustomElement('x-550094-incident-list-delete', {
	...actions,
	renderer: {type: snabbdom},
	view,
	styles,
	properties: {
		sysUpdatedOn: '',
		number: {
			default: false
		},
		assignment_group: {
			default: false
		},
		state: {
			default: false
		},
		assigned_to: {
			default: false
		},
		updated_on: {
			default: false
		},
		short_description: {
			default: false
		},
		isLoading: {
			default: false
		},
		searchFields: ['short_description'],

		deletedIncidentId: '',
		isModalOpen: false,
		modalIncident: {},
		searchString: {
			default: ''
		}
	},
});
