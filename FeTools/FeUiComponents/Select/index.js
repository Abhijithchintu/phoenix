import { Select as NextUiSelect, SelectItem } from '@nextui-org/react';

function Select({
	options = [],
	label = '',
	className = '',
	selectItemClassName = '',
	...rest
}) {
	return (
		<NextUiSelect label={label} className={className} {...rest}>
			{options.map((option) => (
				<SelectItem
					key={option.value}
					value={option.value}
					className={selectItemClassName}
				>
					{option.label}
				</SelectItem>
			))}
		</NextUiSelect>
	);
}

export default Select;
