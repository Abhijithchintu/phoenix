'use client';

import { useForm, ControlledComponent } from '@phoenixfe/hooks';
import { Button } from '@pheonixfe/components';
import getControls from '../controlsConfigs/singupConfig';

function SignUpForm() {
	const {
		control,
		formState: { errors },
		watch,
		setValue,
		handleSubmit,
	} = useForm();

	const supervisedControls = getControls({
		watchPassword: watch('password'),
	});

	return (
		<div className="flex flex-wrap h-max w-full p-4 overflow-scroll">
			<h1 className="text-4xl pb-8 italic font-semibold">
				Sign up &{' '}
				<span className="font-pacifico text-primary-500 font-semibold">
					Sup
				</span>{' '}
				ercharge
			</h1>
			{supervisedControls.map((eachControl) => {
				const errorMessage = errors?.[eachControl?.name]?.message || '';

				return (
					<ControlledComponent
						key={eachControl?.name}
						{...eachControl}
						control={control}
						isInvalid={!!errorMessage}
						errorMessage={errorMessage}
						color={errorMessage ? 'danger' : 'default'}
						onClear={
							eachControl?.isClearable
								? () => {
										setValue(eachControl.name, '');
								  }
								: null
						}
					/>
				);
			})}
			<Button
				color="primary"
				onClick={handleSubmit((v) => {
					console.log('___  v--', v);
				})}
			>
				Sign up
			</Button>
		</div>
	);
}

export default SignUpForm;
