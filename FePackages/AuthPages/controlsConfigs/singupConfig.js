import { Input, Select, PasswordInput } from '@pheonixfe/components';
import { MONTHS, DAYS } from '../constants/dateMappings';

import {
	validateUserName,
	validateMobileNo,
	validateYear,
	validatePassword,
} from '../helpers/registerValidators';

const PRIMARY_CONTROLS = [
	{
		label: 'User Name',
		name: 'user_name',
		className: 'pb-4 w-full md:w-2/5',
		component: Input,
		needErrorMessage: true,
		placeholder: 'User Name',
		rules: {
			required: 'user name is required',
			validate: validateUserName,
		},
	},
	{
		label: 'Mobile Number',
		name: 'mobile',
		type: 'number',
		className: 'pb-4 w-full md:w-3/5 md:pl-4',
		component: Input,
		needErrorMessage: true,
		placeholder: 'Mobile Number',
		rules: {
			required: 'Mobile Number is required',
			validate: validateMobileNo,
		},
	},
	{
		label: 'Name',
		name: 'name',
		className: 'pb-4 w-full md:w-8/12',
		component: Input,
		placeholder: 'name',
		rules: { required: 'name is required' },
	},
	{
		label: 'Gender',
		name: 'gender',
		className: 'pb-4 md:pl-4 md:w-4/12 w-full',
		placeholder: 'Gender',
		options: [
			{ label: 'Male', value: 0 },
			{ label: 'Female', value: 1 },
		],
		component: Select,
		rules: { required: 'gender is required' },
	},
];

const DOB_CONTROLS = [
	{
		label: 'Day',
		name: 'dob_day',
		className: 'pb-4 w-full md:w-4/12',
		component: Select,
		options: DAYS,
		rules: { required: 'date is required' },
	},
	{
		label: 'Month',
		name: 'dob_month',
		className: 'pb-4 w-full md:w-4/12 md:px-2',
		component: Select,
		options: MONTHS,
		rules: { required: 'month is required' },
	},
	{
		label: 'Year',
		name: 'dob_year',
		className: 'pb-4 w-full md:w-4/12',
		needErrorMessage: true,
		component: Input,
		type: 'number',
		rules: { required: 'year is required', validate: validateYear },
	},
];

const getPasswordControls = ({ watchPassword }) => [
	{
		label: 'Password',
		name: 'password',
		type: 'password',
		className: 'pb-4 w-full md:w-1/2',
		component: PasswordInput,
		placeholder: 'Password',
		needErrorMessage: true,
		rules: {
			required: 'Password is required',
			validate: validatePassword,
		},
	},
	{
		label: 'Confirm Password',
		name: 'confirm_password',
		type: 'password',
		className: 'pb-4 w-full md:w-1/2 md:pl-2',
		component: PasswordInput,
		placeholder: 'Password',
		needErrorMessage: true,
		rules: {
			required: 'Password is required',
			validate: (val) =>
				val === watchPassword ? true : `Password doesn't match`,
		},
	},
];

function getControls({ watchPassword }) {
	return {
		primaryControls: PRIMARY_CONTROLS,
		dobControls: DOB_CONTROLS,
		passwordControls: getPasswordControls({ watchPassword }),
	};
}

export default getControls;
