import React, { useState, useEffect } from "react";
import "../../devconfig/devconfig.scss";
import plus_icon from "../../../assets/icons/plus_icon.svg";
import minus from "../../../assets/icons/minus.svg";
import { connect } from "react-redux";
import AddBtn from "../../../assets/icons/add_btn.svg";
import RemoveBtn from "../../../assets/icons/Remove_row.svg";
import { addTnTFlowInputList } from "../../../redux/actions";

interface ITnTProps {
  inputList: any;
  setInputList: (data: any) => void;
  getValidation: () => void;
  isValidNext: boolean;
}

export const TnTFlow = (props: ITnTProps) => {
  const { inputList, setInputList, getValidation, isValidNext } = props;
  const [valSelected, setValSelected] = useState("NA");

  // handle input change
  const handleInputChange = (e: any, index: any) => {
    const { name, value } = e.target;
    const list: any = [...inputList];
    list[index][name] = value;
    setInputList(list);
  };

  // handle click event of the Remove button
  const handleRemoveClick = (index: any) => {
    const list = [...inputList];
    list.splice(index, 1);
    setInputList(list);
  };

  // handle click event of the Add button
  const handleAddClick = (index: any) => {
    const data = inputList[index];
    getValidation();
    if (data.code && data.position) {
      setInputList([...inputList, { level: 0, code: "", position: "" }]);
    }
  };

  const handleDropdownChange = (event: any, index: any) => {
    const { name, value } = event.target;
    const list: any = [...inputList];
    list[index].parentlocation = value;
    setInputList(list);
    setValSelected(event.target.value);
  };
  console.log("tnt", inputList);
  return (
    <div className="col-md-10">
      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-8  column tableScrollStyle">
            <table className="devconfig table label" id="tab_logic">
              <thead className="tableStyle">
                <tr>
                  <th className="tableStyle text-center">Level</th>
                  <th className="tableHeaderStyle">Code</th>
                  <th className="tableHeaderStyle">Position</th>
                  <th className="tablebtnStyle" />
                </tr>
              </thead>
              <tbody>
                {inputList.length > 0 &&
                  inputList.map((item: any, idx: number) => (
                    <tr id="addr0" key={idx}>
                      <td className="tableStyle">{idx}</td>
                      <td className="tableHeaderStyle">
                        <input
                          className="form-control dpstyle label"
                          type="text"
                          name="code"
                          value={item.code}
                          onChange={(e) => handleInputChange(e, idx)}
                        />
                        {item?.code_error && isValidNext && (
                          <span className="error">
                            {"Please enter the code"}{" "}
                          </span>
                        )}
                      </td>

                      <td className="tableHeaderStyle">
                        <input
                          className="form-control dpstyle label"
                          type="text"
                          name="position"
                          value={item.position}
                          onChange={(e) => handleInputChange(e, idx)}
                        />
                        {item?.position_error && isValidNext && (
                          <span className="error">
                            {"Please enter the position"}{" "}
                          </span>
                        )}
                      </td>

                      <td className="tablebtnStyle ">
                        {idx === inputList.length - 1 ? (
                          <img
                            style={{ width: "50px", height: "50px" }}
                            src={AddBtn}
                            onClick={() => handleAddClick(idx)}
                          />
                        ) : (
                          <img
                            style={{ width: "50px", height: "50px" }}
                            src={RemoveBtn}
                            onClick={() => handleRemoveClick(idx)}
                          />
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({ devconfig: { tntflow } }: any) => {
  return {
    tntflow,
  };
};

const mapDispatchToProps = {
  setInputList: addTnTFlowInputList,
};

export default connect(mapStateToProps, mapDispatchToProps)(TnTFlow);
