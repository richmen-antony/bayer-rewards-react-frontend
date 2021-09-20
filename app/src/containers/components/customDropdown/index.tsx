import React,{useState} from "react";
import ReactSelect from "../../../utility/widgets/dropdown/ReactSelect";
import "../../../assets/scss/filter.scss";
import Layout from "../../../assets/icons/Search wth bg.svg";

export type CustomDropdownProps = {
    name : String;
    value : any;
    options : any;
    handleReactSelect : any;
    title? : String;
    width?:string;
    inActiveFilter?:boolean;
}

/**
 * @CustomDropdown
 *
 * Defines the Dropdown component (React Select plus Custom Image). This component is reusable and can be custom
 * rendered with props.
 *
 * @example
 *  import { CustomDropdown }  from "../../utility/widgets/dropdown/CustomDropdown";
 * 
 * <CustomDropdown name="selectedYear" value={value} options={options} handleReactSelect=     
 *  {handleReactSelect} title="Fiscal Year" />
 * 
 *	const handleReactSelect = (selectedOption: any, e: any, optionName?: string) => {
 *	    if(e.name === 'selectedYear') { 
 *           setSelectedYear(selectedOption);
 *       } 
 *	};
 */

function CustomDropdown({
    name,
    value,
    options,
    handleReactSelect,
    title,
    width,
    inActiveFilter
}:CustomDropdownProps)  {
    let i = 1990;
	let year = [];
	for ( i === 1990; i <= new Date().getFullYear(); i++) {
        let yearObj = { label : i , value : i};
		year.push(yearObj);
	}
    year.reverse();	
   
	return (
        <div className="dropdown-year" >
            <div className="yearlabel">
                <label className="font-weight-bold yeartext">{title}</label>
            </div>
            <div className="select" style={{width:width}}>
                <ReactSelect
                    name={name}
                    value={value}
                    handleChange={(selectedOptions: any, e: any) =>
                    	handleReactSelect(selectedOptions, e ,inActiveFilter)
                    }
                    options={options}
                    defaultValue={value}
                    id="batchno-test"
                    dataTestId="batchno-test"
                />
            </div>
        </div>
	);
}
export {  CustomDropdown };
