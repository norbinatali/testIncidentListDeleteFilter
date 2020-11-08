import '@servicenow/now-label-value';
import '@servicenow/now-heading';

export const view = (state) => {
	const {
		properties: {label, value},
	} = state;
	const valueJSX = (
		<now-heading
			label={value}
			level="3"
			variant="title-tertiary"
			hasNoMargin={true}
		/>
	);

	return (
		<now-label-value-stacked
			items={[
				{
					label,
					value: {
						type: 'jsx',
						value: valueJSX,
					},
				},
			]}
		/>
	);
};
