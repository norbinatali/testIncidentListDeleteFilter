import '@servicenow/now-template-card';

export const view = (state) => {
	const {
		properties: {
			sysId,
			shortDescription,
			number,
			incidentState,
			assignmentGroup,
			assignedTo,
			sysUpdatedOn,
		},
	} = state;
	return (
		<now-template-card-assist
			className={'card'}
			tagline={{icon: 'tree-view-long-outline', label: 'Incident'}}
			actions={[
				{id: 'open', label: 'Open Record', cardId: sysId},
				{id: 'delete', label: 'Delete', cardId: sysId},
			]}
			heading={{
				label: shortDescription,
			}}
			content={[
				{label: 'Number', value: {type: 'string', value: number}},
				{label: 'State', value: {type: 'string', value: incidentState}},
				{
					label: 'Assignment Group',
					value: {type: 'string', value: assignmentGroup},
				},
				{
					label: 'Assigned To',
					value: {type: 'string', value: assignedTo},
				},
			]}
			footerContent={{label: 'Updated', value: sysUpdatedOn}}
		/>
	);
};
