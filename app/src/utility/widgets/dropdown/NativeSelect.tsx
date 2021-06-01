import React from "react";
import  '../../../assets/scss/nativeselect.scss'
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
}

export const NativeDropdown = ({
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
  ...props
}: DropdownProps) => {
  return (
    <div className="native-select">
        <label>{label}</label>
      <select
        name={name}
        value={value}
        onChange={handleChange}
        disabled={isDisabled ? true : false}
      >
        {defaultValue&&
        <option value={defaultValue}>
          {defaultValue}
        </option>
         }

        {options &&
          options.map((person: any) => (
            <option key={person.value} value={person.value}>
              {person.text}
            </option>
          ))}
      </select>
    </div>
  );
};
export default NativeDropdown;
