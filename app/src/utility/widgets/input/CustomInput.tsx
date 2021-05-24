import React from 'react';
import PropTypes from 'prop-types';
import "../../../assets/scss/common.scss"

function CustomInput(props: any) {
  let { className, name, type, disabled, value, placeHolder, maxLength, onChange,onKeyUp,width, ...restProps } = props;

  return (
    <div className="custom-input">
      <input style={{ width: width ? width : "215px", height: "40px" }} name={name} disabled={disabled} type={type} maxLength={maxLength} className={className}
        value={value} onChange={props.onChange} {...restProps} placeholder={placeHolder} onKeyUp={props.onKeyUp}  required/>
    </div>
  );
}

export {
  CustomInput
};


CustomInput.propTypes = {
  type: PropTypes.any,
  className: PropTypes.any,
  disabled: PropTypes.bool,
  onChange: PropTypes.any,
  placeHolder: PropTypes.any,
  value: PropTypes.any,
  name: PropTypes.any,
  maxLength: PropTypes.any,
  onKeyUp: PropTypes.any,
  width: PropTypes.any
};
