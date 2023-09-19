'use client';

import { useForm } from '@phoenixfe/hooks';
import { Button } from '@pheonixfe/components';
import Link from 'next/link';
import getControls from '../controlsConfigs/singupConfig';
import Form from '../Form';
import useRegisterUser from '../hooks/useRegisterUser';

function SignUpForm() {
	const {
		control,
		formState: { errors },
		watch,
		setValue,
		handleSubmit,
	} = useForm();

	const { registerUser, loading, serverError = '' } = useRegisterUser();

	const { primaryControls, dobControls, passwordControls } = getControls({
		watchPassword: watch('password'),
	});

	return (
		<div className="w-full h-full flex flex-col items-center justify-center">
			<h1 className="text-4xl pb-4 italic font-semibold w-full text-center">
				Sign up &{' '}
				<span className="font-pacifico text-primary-500 font-semibold">
					Sup
				</span>{' '}
				ercharge
			</h1>

			<form className="flex flex-wrap h-max w-full p-4 overflow-scroll">
				<Form
					controls={primaryControls}
					errors={errors}
					control={control}
					onClear={setValue}
				/>
				<label
					className="w-full text-left text-foreground text-base pb-2"
					htmlFor="date"
				>
					Date of Birth
				</label>
				<Form
					controls={dobControls}
					errors={errors}
					control={control}
					onClear={setValue}
				/>
				<Form
					controls={passwordControls}
					errors={errors}
					control={control}
					onClear={setValue}
				/>
				<div className="text-danger-600 h-6 text-base italic mb-2  w-full">
					{serverError || ''}
				</div>
				<div className="flex flex-col md:flex-row md:justify-between md:items-center w-full">
					<Button
						color="primary"
						onClick={handleSubmit(registerUser)}
						loading={loading}
						size="md"
					>
						Sign up
					</Button>
					<Link
						href="/login"
						as="/login"
						className="font-medium text-primary dark:focus underline"
					>
						Already have an account?
					</Link>
				</div>
			</form>
		</div>
	);
}

export default SignUpForm;
