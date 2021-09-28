import React from "react";
import Select, { components } from "react-select";
import DropDownLayout from "../../../assets/icons/dropdown_background.png";
export interface DropdownProps {
	label?: string;
	control?: any;
	defaultValue?: any;
	options?: any;
	handleChange?: any;
	value: any;
	name: any;
	isPlaceholder?: boolean;
	isLabel?: boolean;
	isDisabled?: boolean;
	isNative?: boolean;
	id?: string;
	dataTestId?: string;
	inActiveFilter?: boolean;
  width?:string;
}

const customStyles = {
	control: (provided: any, { selectProps: { width }}:any) => ({
		...provided,
		border: "1px solid #1f445a",
    width: width,
		// This line disable the blue border
		boxShadow: "none",
		outline: "none",
		"&:hover": {
			outline: "none",
		},
	}),

	indicatorSeparator: (provided: any, state: any) => ({
		...provided,
		display: "none",
	}),
	dropdownIndicator: (provided: any, state: any) => ({
		...provided,
		padding: 0,
	}),
};
const DropdownIndicator = (props: any) => {
	return (
		<components.DropdownIndicator {...props}>
			<img src={DropDownLayout} alt="" className="layout" />
		</components.DropdownIndicator>
	);
};

export default function ReactSelect({
	label,
	control,
	defaultValue,
	options,
	handleChange,
	value,
	name,
	isPlaceholder,
	isLabel,
	isDisabled,
	isNative,
	id,
	dataTestId,
	inActiveFilter,
  width,
	...props
}: DropdownProps) {
	const defaultOptions = [{ value: "ALL", label: "ALL" }];
	return (
		<div className={`react-select ${inActiveFilter? "dropdown-year" :""}`}>
			{inActiveFilter ? (
				<div className="yearlabel">
					<label className="font-weight-bold yeartext">{label}</label>
				</div>
			) : (
				<label className="font-weight-bold">{label}</label>
			)}
      <Select
				onChange={handleChange}
				options={options}
				value={
					options?.length > 0 &&
					options.filter(function (option: any) {
						return option.value === value;
					})
				}
				placeholder={label}
				isClearable={false}
				isSearchable
				name={name}
				defaultValue={defaultOptions && defaultOptions[0]}
				isDisabled={isDisabled}
				noOptionsMessage={() => "No records found!"}
				components={{ DropdownIndicator }}
				styles={customStyles}
        width={width}
			/>		
		</div>
	);
}
