import { ControlledComponent } from '@phoenixfe/hooks';

function Form({ controls = [], errors = {}, control, onClear = () => {} }) {
	return controls.map((eachControl) => {
		const errorMessage = errors?.[eachControl?.name]?.message || '';

		return (
			<ControlledComponent
				key={eachControl?.name}
				{...eachControl}
				control={control}
				errorMessage={eachControl?.needErrorMessage ? errorMessage : undefined}
				isInvalid={!!errorMessage}
				color={errorMessage ? 'danger' : 'default'}
				onClear={
					eachControl?.isClearable
						? () => {
								onClear(eachControl.name, '');
						  }
						: null
				}
			/>
		);
	});
}
export default Form;
