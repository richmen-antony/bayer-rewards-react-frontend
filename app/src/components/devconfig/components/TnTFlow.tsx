import React from "react";
import "../../devconfig/devconfig.scss";
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
  // const [valSelected, setValSelected] = useState("NA");

  /**
   * To handle input change fields
   * @param e 
   * @param index 
   */
  const handleInputChange =(e: any, index: any) => {
    const { name, value } = e.target;
    const list: any = [...inputList];
    if (value) {
      // check for duplicate values from previous list array
      const isDuplicate = list.find(
        (duplicate: any) =>
          duplicate[name].toLowerCase() === value.toLowerCase()
      );
      if (isDuplicate) {
        //  getValidation();
        //append the value for duplicate(show up error )
        list[index][name + "IsDuplicate"] = true;
      } else {
        list[index][name + "IsDuplicate"] = false;
      }
    }
    list[index][name] = value;
    setInputList(list);
  };

  
  /**
   * handle click event of the Remove button
   * @param index 
   */
  const handleRemoveClick = (index: any) => {
    let list = [...inputList];
    list.splice(index, 1);
    list = setCorrectHierLvl(list, index);
    setInputList(list);
  };


  /**
   * handle click event of the Add button
   * @param index 
   */
  const handleAddClick = (index: any) => {
    const data = inputList[index];
    getValidation();
    if (data.code && data.position &&!data.codeIsDuplicate && !data.positionIsDuplicate) {
      setInputList([...inputList, { level: inputList.length, code: "", position: "" }]);
    }
  };

  /**
   * To set the hiearchy level order list
   * @param list 
   * @param index 
   * @returns 
   */
  const setCorrectHierLvl = (list: any, index: number) => {
    const newList = list.map((listItem: any, idx: number) => {
      return {
        ...listItem,
        level: idx,
      };
    });
    return newList;
  };

  // const handleDropdownChange = (event: any, index: any) => {
  //   const { name, value } = event.target;
  //   const list: any = [...inputList];
  //   list[index].parentlocation = value;
  //   setInputList(list);
  //   setValSelected(event.target.value);
  // };
  return (
    <div className="col-md-12">
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
                          onBlur={getValidation}
                        />
                        {isValidNext && item?.code_error ?  
                         <span className="error">
                         {"Please enter the code"}
                       </span> :item?.codeIsDuplicate && (
                          <span className="error">
                            {item.code + " is unavailable"}
                          </span>
                        )  }
                        {/* {item?.code_error && isValidNext && (
                          <span className="error">
                            {"Please enter the code"}{" "}
                          </span>
                        )}
                        {!item?.code_error&&item?.codeIsDuplicate && isValidNext && (
                          <span className="error">
                            {item.code + " is unavailable"}
                          </span>
                        )} */}
                      </td>

                      <td className="tableHeaderStyle">
                        <input
                          className="form-control dpstyle label"
                          type="text"
                          name="position"
                          value={item.position}
                          onChange={(e) => handleInputChange(e, idx)}
                          onBlur={getValidation}
                        />
                        {isValidNext && item?.position_error ? 
                        <span className="error">
                        {"Please enter the position"}
                      </span> :item?.positionIsDuplicate &&(
                          <span className="error">
                            {item.position + " is unavailable"}
                          </span>
                        )


                        }
                        {/* {item?.position_error && isValidNext && (
                          <span className="error">
                            {"Please enter the position"}
                          </span>
                        )}
                         {item?.positionIsDuplicate && isValidNext && (
                          <span className="error">
                            {item.position + " is unavailable"}
                          </span>
                        )} */}
                      </td>

                      <td className="tablebtnStyle ">
                        {/* {idx === inputList.length - 1 ? (
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
                        )} */}

                        {idx === inputList.length - 1 ? (
                          (() => {
                            if (idx === 0 && idx === inputList.length - 1) {
                              return (
                                <div>
                                  <img
                                    alt=""
                                    style={{ width: "50px", height: "50px" }}
                                    src={AddBtn}
                                    onClick={() => handleAddClick(idx)}
                                  />
                                </div>
                              );
                            } else if (
                              idx > 0 &&
                              idx === inputList.length - 1
                            ) {
                              return (
                                <div>
                                  <td style={{ border: "none" }}>
                                    <img
                                      alt=""
                                      style={{ width: "50px", height: "50px" }}
                                      src={RemoveBtn}
                                      onClick={() => handleRemoveClick(idx)}
                                    />
                                  </td>

                                  <td style={{ border: "none" }}>
                                    <img
                                      alt=""
                                      style={{ width: "50px", height: "50px" }}
                                      src={AddBtn}
                                      onClick={() => handleAddClick(idx)}
                                    />
                                  </td>
                                </div>
                              );
                            }
                          })()
                        ) : (
                          <img
                            alt=""
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
