import { Input, PasswordInput } from '@pheonixfe/components';

const LOGIN_CONTROLS = [
	{
		label: 'User Name',
		name: 'user_name',
		className: 'pb-4 w-full',
		component: Input,
		placeholder: 'User Name',
		rules: {
			required: 'user name is required',
		},
	},
	{
		label: 'Password',
		name: 'password',
		type: 'password',
		className: 'pb-4 w-full',
		component: PasswordInput,
		placeholder: 'Password',
		rules: {
			required: 'Password is required',
		},
	},
];

export default LOGIN_CONTROLS;
