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
  id?:string;
  dataTestId?:string
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
  id,
  dataTestId,
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
        id={id}
        data-testid={dataTestId}
      >
        {defaultValue&&
        <option value={defaultValue} data-testid={defaultValue} key={defaultValue}>
          {defaultValue}
        </option>
         }

        { options?.length>0 &&
          options.map((person: any, index:number) => (
            <option key={person.value+index} value={person.value}>
              {person.text}
            </option>
          ))}
      </select>
    </div>
  );
};
export default NativeDropdown;
