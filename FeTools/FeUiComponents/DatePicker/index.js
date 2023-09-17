'use client';

import TailwindDatepicker from 'tailwind-datepicker-react';
import { useState } from 'react';
import { Input } from '@nextui-org/react';

const DEFAULT_OPTIONS = {
	autoHide: true,
	todayBtn: false,
	clearBtn: false,
	language: 'en',
	datepickerClassNames: 'top-12 bg-white shadow-white rounded-lg',
	inputDateFormatProp: {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
	},
	theme: {
		background: '',
		todayBtn: '',
		clearBtn: '',
		icons: '',
		text: '',
		disabledText: '',
		input: '',
		inputIcon: '',
		selected: '',
	},
};

// todo format date also on outer click add event handler

const DatePicker = ({
	defaultDate = null,
	onChange = () => {},
	maxDate = null,
	minDate = null,
	value = '',
	label = 'Select Date',
	errorMessage = '',
	className = '',
	datePickerStyles = '',
	onClear = () => {},
	isClearable = false,
	...rest
}) => {
	const [show, setShow] = useState(false);

	return (
		<TailwindDatepicker
			options={{
				...DEFAULT_OPTIONS,
				selectedDate: defaultDate,
				maxDate,
				minDate,
			}}
			onChange={onChange}
			show={show}
			setShow={setShow}
			className={datePickerStyles}
		>
			<Input
				{...rest}
				type="text"
				value={value}
				onFocus={() => setShow(true)}
				readOnly
				label={label}
				isInvalid={!!errorMessage}
				errorMessage={errorMessage}
				className={className}
				isClearable={isClearable}
				onClear={onClear}
			/>
		</TailwindDatepicker>
	);
};

export default DatePicker;
