import React, { useState } from "react";
import { connect } from "react-redux";
import "../../devconfig/devconfig.scss";
import AddBtn from "../../../assets/icons/add_btn.svg";
import RemoveBtn from "../../../assets/icons/Remove_row.svg";

import { addLocationInputList } from "../../../redux/actions";

interface ILocationProps {
  location: any;
  setInputList: (data: any) => void;
}

const LocationHierarchy = (props: ILocationProps) => {
  const {
    location: { inputList },
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
    let list = [...inputList];
    list.splice(index, 1);
    list = setCorrectHierLvl(list, index);
    console.log(list);
    setInputList(list);
  };

  // handle click event of the Add button
  const handleAddClick = (index: any) => {
    setInputList([
      ...inputList,
      {
        locationhierlevel: inputList.length + 1,
        locationhiername: "",
        parentlocation: -1,
      },
    ]);
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

  return (
    <div className="col-md-10">
      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-8  column tableScrollStyle">
            <table className="devconfig table" id="tab_logic">
              <thead className="tableStyle">
                <tr>
                  <th className="text-center tableStyle">Location Level</th>
                  <th className="tableHeaderStyle">Location Hierarchy Name</th>
                  <th className="tableHeaderStyle">Parent Location</th>
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
                        name="locationhiername"
                        value={item.locationhiername}
                        onChange={(e) => handleInputChange(e, idx)}
                        data-id={idx}
                      />
                    </td>

                    <td className="tableHeaderStyle">
                      <select
                        defaultValue="NA"
                        name="parentlocation"
                        data-id={idx}
                        className="dpstyle selectoutline"
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
                    </td>
                    <td className="tablebtnStyle">
                      {idx === inputList.length - 1 ? (
                        // <button
                        //   className="btn btnStyleAdd"
                        //   onClick={() => handleAddClick(idx)}
                        // >
                        //   <img src={plus_icon} />
                        // </button>
                        <img
                          style={{ width: "50px", height: "50px" }}
                          src={AddBtn}
                          onClick={() => handleAddClick(idx)}
                        />
                      ) : (
                        //   <button
                        //     className="btn btnStyleRemove"
                        //     onClick={() => handleRemoveClick(idx)}
                        //   >

                        //     {/* <img src={minus} /> */}
                        //   </button>
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
