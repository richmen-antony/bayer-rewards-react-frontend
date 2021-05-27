import React, { useState, useEffect } from "react";
import "../../devconfig/devconfig.scss";
import plus_icon from "../../../assets/icons/plus_icon.svg";
import minus from "../../../assets/icons/minus.svg";
import { connect } from "react-redux";

import AddBtn from "../../../assets/icons/add_btn.svg";
import RemoveBtn from "../../../assets/icons/Remove_row.svg";

import { addPackagingDefinitionInputList } from "../../../redux/actions";

interface IPackagingDefinitionProps {
  packagingdefinition: any;
  setInputList: (data: any) => void;
}

export const PackagingDefinition = (props: IPackagingDefinitionProps) => {
  const {
    packagingdefinition: { inputList },
    setInputList,
  } = props;
  const [valSelected, setValSelected] = useState("NA");
  const [activeButton, SetActiveButton] = React.useState("Seed");

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
    setInputList([
      ...inputList,
      {
        packaginghierarchylevel: 0,
        packaginghierarchyname: "",
        parentpackage: -1,
      },
    ]);
  };

  const handleDropdownChange = (event: any, index: any) => {
    const { name, value } = event.target;
    const list: any = [...inputList];
    list[index].parentpackage = value;
    setInputList(list);
    setValSelected(event.target.value);
  };

  return (
    <div className="col-md-10">
      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-8  column tableScrollStyle">
            <div
              className="btn-group product-categeory"
              role="group"
              aria-label="Basic outlined"
            >
              <button
                type="button"
                className={`btn btn-outline-primary ${
                  activeButton === "Seed" ? "active" : ""
                }`}
              >
                Seed
              </button>
              <button
                type="button"
                className={`btn btn-outline-primary ${
                  activeButton === "CP" ? "active" : ""
                }`}
              >
                CP
              </button>
            </div>

            <table className="table" id="tab_logic">
              <thead className="tableStyle">
                <tr>
                  <th className="tableStyle text-center">Level</th>
                  <th className="tableHeaderStyle">Name</th>
                  <th className="tableHeaderStyle">Parent Name</th>
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
                        name="packaginghierarchyname"
                        value={item.packaginghierarchyname}
                        onChange={(e) => handleInputChange(e, idx)}
                      />
                    </td>

                    <td className="tableHeaderStyle">
                      <select
                        className="dpstyle selectoutline"
                        defaultValue="NA"
                        name="parentpackage"
                        data-id={idx}
                        id="dropdown"
                        value={item.parentpackage}
                        onChange={(event) => handleDropdownChange(event, idx)}
                      >
                        <option value="NA" key="NA">
                          NA
                        </option>
                        {idx > 0 &&
                          inputList.length > 0 &&
                          inputList.map(
                            ({ packaginghierarchyname }: any, index: number) =>
                              index < idx && (
                                <option
                                  value={index}
                                  key={packaginghierarchyname}
                                >
                                  {packaginghierarchyname}
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
                        // <button
                        //   className="btn btnStyleRemove"
                        //   onClick={() => handleRemoveClick(idx)}
                        // >
                        //   <img src={minus} />
                        // </button>
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

const mapStateToProps = ({ devconfig: { packagingdefinition } }: any) => {
  return {
    packagingdefinition,
  };
};

const mapDispatchToProps = {
  setInputList: addPackagingDefinitionInputList,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PackagingDefinition);
