import React from 'react';
import { Controller } from 'react-hook-form';

function ControlledComponent(props) {
	const {
		name,
		control,
		value: defaultValue,
		rules,
		component: Component,
		...rest
	} = props;

	return (
		<Controller
			key={name}
			control={control}
			name={name}
			defaultValue={defaultValue}
			rules={rules}
			render={({ field: { onChange, onBlur, value } }) => (
				<Component
					{...rest}
					id={name}
					key={rest.id}
					onChange={onChange}
					value={value || ''}
					onBlur={onBlur}
				/>
			)}
		/>
	);
}
export default ControlledComponent;
