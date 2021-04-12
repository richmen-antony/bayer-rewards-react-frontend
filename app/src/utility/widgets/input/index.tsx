import React from 'react';
import PropTypes from 'prop-types';

function Input(props: any) {
  let { className, name,type, disabled, value, placeHolder, maxLength, onChange, ...restProps } = props;
  console.log("value-->", value);
  return (
    <div className="">
      <input name={name} disabled={disabled} type={type} maxLength={maxLength} className={className}
        value={value} onChange={props.onChange} {...restProps} placeholder={placeHolder}/>
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
  maxLength: PropTypes.any
};
