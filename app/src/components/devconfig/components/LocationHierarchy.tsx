import React, { useState } from "react";
import { connect } from "react-redux";
import "../../devconfig/devconfig.scss";
import AddBtn from "../../../assets/icons/add_btn.svg";
import RemoveBtn from "../../../assets/icons/Remove_row.svg";

import { addLocationInputList } from "../../../redux/actions";
import Dropdown from "../../../utility/widgets/dropdown";
import { handledropdownoption } from "../../../utility/helper";
import { ConfigSelect } from "../../../utility/widgets/dropdown/ConfigSelect";

interface ILocationProps {
  location: any;
  setInputList: (data: any) => void;
  getValidation: () => void;
  inputList: Array<any>;
  isValidNext: boolean;
}

const LocationHierarchy = (props: ILocationProps) => {
  const { inputList, setInputList, getValidation, isValidNext } = props;
  console.log({ inputList });

  const [valSelected, setValSelected] = useState("NA");

  // handle input change
  const handleInputChange = (e: any, index: any) => {
    const { name, value } = e.target;
    const list: any = [...inputList];
    if (value) {
      const isDuplicate = list.find(
        (duplicate: any) =>
          duplicate[name].toLowerCase() === value.toLowerCase()
      );
      if (isDuplicate) {
        getValidation();
        list[index]["isDuplicate"] = true;
      } else {
        list[index]["isDuplicate"] = false;
      }
    }

    list[index][name] = value;
    setInputList(list);
  };

  // handle click event of the Remove button
  const handleRemoveClick = (index: any) => {
    let list = [...inputList];
    list.splice(index, 1);
    list = setCorrectHierLvl(list, index);
    console.log(list);
    setInputList(list);
  };

  // handle click event of the Add button
  const handleAddClick = (index: any) => {
    const data = inputList[index];
    getValidation();
    if (data.locationhiername && !data.isDuplicate) {
      setInputList([
        ...inputList,
        {
          locationhierlevel: inputList.length + 1,
          locationhiername: "",
          parentlocation: -1,
        },
      ]);
    }
  };

  const handleDropdownChange = (event: any, index: any) => {
    const { name, value } = event.target;
    const list: any = [...inputList];
    list[index].parentlocation = value;
    setInputList(list);
    setValSelected(event.target.value);
  };

  const setCorrectHierLvl = (list: any, index: number) => {
    const newList = list.map((listItem: any, idx: number) => {
      return {
        ...listItem,
        locationhierlevel: idx,
        parentlocation:
          listItem.parentlocation >= index
            ? listItem.parentlocation - 1
            : listItem.parentlocation,
        // parentlocation : listItem.parentlocation === index ? -1 : listItem.parentlocation > index ? listItem.parentlocation-1 : listItem.parentlocation
      };
    });
    return newList;
  };

  const LocationDetailsOption = handledropdownoption(
    inputList,
    "locationhiername"
  );

  return (
    <div className="col-md-10">
      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-8  column tableScrollStyle">
            <table className="devconfig table label" id="tab_logic">
              <thead className="tableStyle">
                <tr>
                  <th className="text-center tableStyle">Location Level</th>
                  <th className="tableHeaderStyle">Location Hierarchy Name</th>
                  <th className="tableHeaderStyle">Parent Location</th>
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
                          className={`form-control dpstyle label ${
                            item?.error && isValidNext ? "invalid" : ""
                          }`}
                          type="text"
                          name="locationhiername"
                          value={item.locationhiername}
                          onChange={(e) => handleInputChange(e, idx)}
                          data-id={idx}
                        />
                        {item?.error && isValidNext && (
                          <span className="error">
                            {"Please enter Location Hierarchy"}
                          </span>
                        )}
                        {item?.isDuplicate && isValidNext && (
                          <span className="error">
                            {item.locationhiername + " is unavailable"}
                          </span>
                        )}
                      </td>

                      <td className="tableHeaderStyle">
                        <select
                          defaultValue="NA"
                          name="parentlocation"
                          data-id={idx}
                          className="dpstyle selectoutline label"
                          id="dropdown"
                          value={item.parentlocation}
                          onChange={(event) => handleDropdownChange(event, idx)}
                        >
                          <option value="NA" key="NA">
                            NA
                          </option>
                          {idx > 0 &&
                            inputList.length > 0 &&
                            inputList.map(
                              ({ locationhiername }: any, index: number) =>
                                index < idx && (
                                  <option value={index} key={locationhiername}>
                                    {locationhiername}
                                  </option>
                                )
                            )}
                        </select>

                        {/* <ConfigSelect
                          defaultValue="NA"
                          name="parentlocation"
                          options={LocationDetailsOption}
                          handleChange={(event: any) =>
                            handleDropdownChange(event, idx)
                          }
                          value={item.parentlocation}
                          isPlaceholder
                          parentIndex={idx}
                        /> */}
                      </td>
                      <td className="tablebtnStyle">
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
                                      style={{ width: "50px", height: "50px" }}
                                      src={RemoveBtn}
                                      onClick={() => handleRemoveClick(idx)}
                                    />
                                  </td>

                                  <td style={{ border: "none" }}>
                                    <img
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

const mapStateToProps = ({ devconfig: { location } }: any) => {
  return {
    location,
  };
};

const mapDispatchToProps = {
  setInputList: addLocationInputList,
};

export default connect(mapStateToProps, mapDispatchToProps)(LocationHierarchy);
