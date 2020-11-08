import '../now-modal-api/modal-body-items';
import '@servicenow/now-modal'

const MODAL_BODY_ITEMS_DATA = [
	{
		label: 'Incident',
		name: 'short_description',
	},
	{
		label: 'Number',
		name: 'number',
	},
	{
		label: 'State',
		name: 'state',
	},
	{
		label: 'Assignment Group',
		name: 'assignment_group',
	},
	{
		label: 'Assigned To',
		name: 'assigned_to',
	},
	{
		label: 'Opened At',
		name: 'opened_at',
	},
];

export const view = (state) => {
	const {
		properties: {isModalOpen, incident},
	} = state;

	return (
		<now-modal
			footerActions={[{label: 'Delete', variant: 'primary-negative'}]}
			size="lg"
			opened={isModalOpen}
		>
			<div className={'modal'}>
				{incident && MODAL_BODY_ITEMS_DATA.map((itemData) => {
					const value =
						(itemData.name === 'assignment_group' ||
							itemData.name === 'assigned_to') &&
						incident[itemData.name]
							? incident[itemData.name].display_value
							: incident[itemData.name];
					return (
						<modal-body-items
							className={'label'}
							label={itemData.label}
							value={value ? value : '-'}
						/>
					);
				})}
			</div>
		</now-modal>
	);
};
