import React from 'react';
import PropTypes from 'prop-types';

function Input(props: any) {
  let { className, name, type, disabled, value, placeHolder, maxLength, onChange,onKeyUp,onKeyPress,width, ...restProps } = props;
  return (
    <div className="">
      <input style={{ width: width ? width : "215px", height: "40px" }} name={name} disabled={disabled} type={type} maxLength={maxLength} className={className}
        value={value} onChange={props.onChange} {...restProps} placeholder={placeHolder} onKeyUp={props.onKeyUp} onKeyPress={props.onKeyPress} />
    </div>
  );
}

export {
  Input
};


Input.propTypes = {
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
  onKeyPress: PropTypes.any
};
