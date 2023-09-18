'use client';

import { useState } from 'react';

import { Input } from '@nextui-org/react';
import EyeIcon from './EyeIcon';
import EyeSlashedIcon from './EyeSlashedIcon';

function PasswordInput({
	value = '',
	onChange = () => {},
	errorMessage = '',
	label = '',
	...rest
}) {
	const [isVisible, setIsVisible] = useState(false);

	const { type, ...newRest } = rest;

	return (
		<Input
			label={label}
			endContent={
				<button
					className="focus:outline-none"
					type="button"
					onClick={() => setIsVisible((p) => !p)}
				>
					{isVisible ? (
						<EyeSlashedIcon className="text-2xl text-default-400 pointer-events-none" />
					) : (
						<EyeIcon className="text-2xl text-default-400 pointer-events-none" />
					)}
				</button>
			}
			type={isVisible ? 'text' : 'password'}
			className="max-w-xs"
			{...newRest}
			value={value}
			onChange={onChange}
			isInvalid={!!errorMessage}
			errorMessage={errorMessage}
		/>
	);
}

export default PasswordInput;
