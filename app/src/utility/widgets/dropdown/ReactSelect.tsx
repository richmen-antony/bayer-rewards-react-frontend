import React from 'react';
import Select from 'react-select';
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
    id?:string;
    dataTestId?:string
  }

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
    ...props
  }: DropdownProps) {


  return (
    <div className="">
        <label>{label}</label>
      <Select
        onChange={handleChange}
        options={options}
        value={value}
        placeholder={label}
        isClearable={false}
        isSearchable
        name={name}
        defaultValue={options&&options[0]}
      />
    </div>
  );
}