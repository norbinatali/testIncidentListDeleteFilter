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
import {CLOSE_MODAL, DELETE_INCIDENT, GET_ITEMS} from "./actions";
import actions from "./actions";

const view = (state, {dispatch, updateState,}) => {
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
	const sortByParam = (param) => {
		const {isLoading, sortBy} = state;
		if (sortBy.has(param)) {
			sortBy.delete(param)
		} else {
			sortBy.add(param)
		}
		if (!isLoading) {
			updateState({
				isLoading: true,
				sortBy,
			});
			dispatch(GET_ITEMS);
		}
	};

	const triggerSearch = ({target: {value}, keyCode}) => {
		if (!state.isLoading && keyCode === 13) {
			updateState({
				isLoading: true,
				searchString: value
			});
			dispatch(GET_ITEMS);
		}
	};

	const variantSort = (param) => state.sortBy.has(param) ? 'primary' : 'secondary';

	return (
		<div>
			<h2 className="title">Incidents</h2>
			<div className="wrap">
				<div className={'filter-search-menu'}>
					<div className={'filter-buttons'}>
						<now-button
							className="now-m-inline--xs"
							variant={variantSort('number')}
							size="sm"
							label="By Number"
							on-click={() => sortByParam('number')}
						/>
						<now-button
							className="now-m-inline--xs"
							variant={variantSort('short_description')}
							size="sm"
							label="By Short Description"
							on-click={() => sortByParam('short_description')}
						/>
						<now-button
							className="now-m-inline--xs"
							variant={variantSort('assignment_group')}
							size="sm"
							label="By Assigment Group"
							on-click={() => sortByParam('assignment_group')}
						/>
						<now-button
							className="now-m-inline--xs"
							variant={variantSort('state')}
							size="sm"
							label="By State"
							on-click={() => sortByParam('state')}
						/>
						<now-button
							className="now-m-inline--xs"
							variant={variantSort('assigned_to')}
							size="sm"
							label="By Assigned To"
							on-click={() => sortByParam('assigned_to')}
						/>
						<now-button
							className="now-m-inline--xs"
							variant={variantSort('updated_on')}
							size="sm"
							label="By Updated On"
							on-click={() => sortByParam('updated_on')}
						/>
					</div>
					<div className={'search'}>
						<input
							id={"input-search"}
							className="now-search-input"
							placeholder="Search"
							on-keydown={triggerSearch}
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
	initialState: {
		searchString: '',
		sortBy: new Set()
	},
	properties: {
		isLoading: {
			default: false
		},
		deletedIncidentId: '',
		isModalOpen: false,
		modalIncident: {},
	},
});
