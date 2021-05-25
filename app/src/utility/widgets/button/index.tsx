import React from "react";
import ArrowIcon from "../../../assets/icons/dark bg.svg";
import RtButton from "../../../assets/icons/right_btn.svg";

function CustomButton(props: any) {
  const { label, style, handleClick } = props;
  return (
    <button className="cus-btn" style={style} onClick={handleClick}>
      {label}
      <span>
        <img src={ArrowIcon}  className="arrow-i"/> <img src={RtButton} className="layout" />
      </span>
    </button>
  );
}
export { CustomButton };
