import {
	Input,
	Select,
	PasswordInput,
	DatePicker,
} from '@pheonixfe/components';

const getControls = ({ watchPassword }) => [
	{
		label: 'User Name',
		name: 'user_name',
		className: 'pb-4',
		component: Input,
		rules: { required: 'user name is required' },
	},
	{
		label: 'Mobile Number',
		name: 'mobile_no',
		type: 'number',
		className: 'pb-4 md:w-2/3 w-full',
		component: Input,
		stepper: 'false',
		rules: { required: 'user name is required' },
	},
	{
		label: 'Gender',
		name: 'gender',
		className: 'pb-4 md:pl-4  md:w-1/3 w-full',
		options: [
			{ label: 'Male', value: 0 },
			{ label: 'Female', value: 1 },
		],
		component: Select,
		rules: { required: 'gender is required' },
	},
	{
		label: 'Date of Birth',
		name: 'dob',
		className: 'pb-4',
		component: DatePicker,
		rules: { required: 'dob is required' },
	},
	{
		label: 'Password',
		name: 'password',
		type: 'password',
		className: 'pb-4',
		component: PasswordInput,
		rules: {
			required: 'Password is required',
			// validate:()=>{} todo
		},
	},
	{
		label: 'Confirm Password',
		name: 'confirm_password',
		type: 'password',
		className: 'pb-4',
		component: PasswordInput,
		rules: {
			required: 'Password is required',
			validate: (val) => val === watchPassword,
		},
	},
];

export default getControls;
