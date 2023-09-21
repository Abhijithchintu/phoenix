'use client';

import { useForm } from '@phoenixfe/hooks';
import { Button } from '@pheonixfe/components';
import Link from 'next/link';
import LOGIN_CONTROLS from '../controlsConfigs/loginControls';
import Form from '../Form';
import useLoginUser from '../hooks/useLoginUser';

function SignUpForm() {
	const {
		control,
		formState: { errors },
		setValue,
		handleSubmit,
	} = useForm();

	const { loginUser, loading, serverError = '' } = useLoginUser();

	return (
		<div className="w-full h-full flex flex-col items-center justify-center">
			<h1 className="text-4xl pb-4 italic font-semibold">
				Sign In &{' '}
				<span className="font-pacifico text-primary-500 font-semibold">
					Sup
				</span>{' '}
				ercharge
			</h1>
			<form className="flex flex-wrap h-max w-full p-4 overflow-scroll">
				<Form
					controls={LOGIN_CONTROLS}
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
						onClick={handleSubmit(loginUser)}
						isLoading={loading}
					>
						Sign In
					</Button>
					<Link
						href="/signup"
						as="/signup"
						className="font-medium text-primary dark:focus underline"
					>
						Click here to sign up
					</Link>
				</div>
			</form>
		</div>
	);
}

export default SignUpForm;
