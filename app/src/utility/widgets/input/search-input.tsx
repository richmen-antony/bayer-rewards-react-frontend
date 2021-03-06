import React from "react";
import PropTypes from "prop-types";
import Layout from "../../../assets/icons/Search wth bg.svg";

function SearchInput(props: any) {
  let {
    className,
    name,
    type,
    disabled,
    value,
    placeHolder,
    maxLength,
    onChange,
    onKeyUp,
    width,
    tolltip,
    ...restProps
  } = props;
  return (
    <div className="search-input">
      <input
        name={name}
        disabled={disabled}
        type={type}
        maxLength={maxLength}
        className={className}
        value={value}
        onChange={props.onChange}
        {...restProps}
        placeholder={placeHolder}
        onKeyUp={props.onKeyUp}
        style={{ width: width ? width : "260px" }}
      />

      <img src={Layout} className="layout" alt=""/>
      {tolltip&& <i
        className="fa fa-info-circle"
        style={{ fontSize: "16px", fontFamily: "appRegular !important" }}
        title={tolltip}
      ></i>}
     
    </div>
  );
}

export { SearchInput };

SearchInput.propTypes = {
  type: PropTypes.any,
  className: PropTypes.any,
  disabled: PropTypes.bool,
  onChange: PropTypes.any,
  placeHolder: PropTypes.any,
  value: PropTypes.any,
  name: PropTypes.any,
  maxLength: PropTypes.any,
  onKeyUp: PropTypes.any,
  width: PropTypes.any,
  tolltip: PropTypes.string,
};
