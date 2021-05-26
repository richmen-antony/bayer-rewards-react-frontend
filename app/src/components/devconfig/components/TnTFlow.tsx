import React, { useState, useEffect } from "react";
import "../../devconfig/devconfig.scss";
import plus_icon from "../../../assets/icons/plus_icon.svg";
import minus from "../../../assets/icons/minus.svg";
import { connect } from "react-redux";
import { addTnTFlowInputList } from "../../../redux/actions";

interface ITnTProps {
  tntflow: any;
  setInputList: (data: any) => void;
}

export const TnTFlow = (props: ITnTProps) => {
  const {
    tntflow: { inputList },
    setInputList,
  } = props;
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
    setInputList([...inputList, { level: 0, code: "", position: "" }]);
  };

  const handleDropdownChange = (event: any, index: any) => {
    const { name, value } = event.target;
    const list: any = [...inputList];
    list[index].parentlocation = value;
    setInputList(list);
    setValSelected(event.target.value);
  };

  return (
    <div className="col-md-10">
      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-8  column tableScrollStyle">
            <table className="table" id="tab_logic">
              <thead className="tableStyle">
                <tr>
                  <th className="tableStyle text-center">Level</th>
                  <th className="tableHeaderStyle">Code</th>
                  <th className="tableHeaderStyle">Position</th>
                  <th className="tablebtnStyle" />
                </tr>
              </thead>
              <tbody>
                {inputList.map((item: any, idx: number) => (
                  <tr id="addr0" key={idx}>
                    <td className="tableStyle">{idx}</td>
                    <td className="tableHeaderStyle">
                      <input
                        className="form-control dpstyle"
                        type="text"
                        name="code"
                        value={item.code}
                        onChange={(e) => handleInputChange(e, idx)}
                      />
                    </td>

                    <td className="tableHeaderStyle">
                      <input
                        className="form-control dpstyle"
                        type="text"
                        name="position"
                        value={item.position}
                        onChange={(e) => handleInputChange(e, idx)}
                      />
                    </td>

                    <td className="tablebtnStyle">
                      {idx === inputList.length - 1 ? (
                        <button
                          className="btn btnStyleAdd"
                          onClick={() => handleAddClick(idx)}
                        >
                          <img src={plus_icon} />
                        </button>
                      ) : (
                        <button
                          className="btn btnStyleRemove"
                          onClick={() => handleRemoveClick(idx)}
                        >
                          <img src={minus} />
                        </button>
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
