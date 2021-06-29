import React, { useState } from "react";
import { connect } from "react-redux";
import "../../devconfig/devconfig.scss";
import AddBtn from "../../../assets/icons/add_btn.svg";
import RemoveBtn from "../../../assets/icons/Remove_row.svg";
import { addRoleInputList } from "../../../redux/actions";
import { ConfigSelect } from "../../../utility/widgets/dropdown/ConfigSelect";
import { handledropdownoption } from "../../../utility/helper";

interface IRoleProps {
  role: any;
  setInputList: (data: any) => void;
  inputList: Array<any>;
  isValidNext: boolean;
  getValidation: () => void;
}
const roleTypeOptions = [
  { value: "INTERNAL", text: "INTERNAL" },
  { value: "EXTERNAL", text: "EXTERNAL" },
];

export const RoleHierarchy = (props: IRoleProps) => {
  const { inputList, setInputList, isValidNext, getValidation } = props;
  const [valSelected, setValSelected] = useState("NA");

  
  /**
   * handle input change
   * @param e 
   * @param index 
   */
  const handleInputChange = (e: any, index: any) => {
    const { name, value } = e.target;
    const list: any = [...inputList];
    if (value) {
       // check for duplicate values from previous list array
      const isDuplicate = list.find(
        (duplicate: any) =>
          duplicate[name].toLowerCase() === value.toLowerCase()
      );
      if (isDuplicate) {
        list[index][name + "IsDuplicate"] = true;
      } else {
        list[index][name + "IsDuplicate"] = false;
      }
    }
    list[index][name] = value;
    setInputList(list);
    // getValidation();
  };


  
  /**
   *  handle click event of the Remove button
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
    if (
      data.rolehierarchyname &&
      data.rolecode &&
      !data.rolehierarchynameIsDuplicate &&
      !data.rolecodeIsDuplicate
    ) {
      setInputList([
        ...inputList,
        {
          rolehierarchylevel: inputList.length,
          rolecode: "",
          rolehierarchyname: "",
          roletype: "INTERNAL",
          parentrole: inputList[inputList.length-1].rolecode,
        },
      ]);
    }
  };
  /**
   * To handle drop down values
   * @param event 
   * @param index 
   */
  const handleDropdownChange = (event: any, index: any) => {
    const { name, value } = event.target;
    const list: any = [...inputList];
    list[index].parentrole = value;
    setInputList(list);
    setValSelected(event.target.value);
  };
/**
 * To handle drop down values for roles
 * @param event 
 * @param index 
 */
  const handleDropdownRoleChange = (event: any, index: any) => {
    const { name, value } = event.target;
    const list: any = [...inputList];
    list[index].roletype = value;
    setInputList(list);
    setValSelected(event.target.value);
  };
/**
 * To set the hiearchy order wise level
 * @param list 
 * @param index 
 * @returns 
 */
  const setCorrectHierLvl = (list: any, index: number) => {
    const newList = list.map((listItem: any, idx: number) => {
      return {
        ...listItem,
        rolehierarchylevel: idx,
        // parentrole:
        //   listItem.parentrole >= index
        //     ? listItem.parentrole - 1
        //     : listItem.parentrole,

        // rolehierarchylevel: idx,
        parentrole: idx >= index ? list[idx - 1].rolecode : listItem.parentrole,
      };
    });
    return newList;
  };
  // role dropdown list
  const roleOptions = handledropdownoption(inputList, "rolecode");

  return (
    <div className="col-md-12">
      <div className="container">
        <div className="row">
          <div className="col-xs-12  column tableScrollStyle">
            <table className="devconfig table label" id="tab_logic">
              <thead className="tableStyle">
                <tr>
                  <th className="text-center tableStyle">Role Level</th>
                  <th className="tableHeaderStyle">Role Code</th>
                  <th className="tableHeaderStyle">Role</th>
                  <th className="tableHeaderStyle">Role Type</th>
                  <th className="tableHeaderStyle">Parent Role</th>
                  <th className="tablebtnStyle" />
                </tr>
              </thead>
              <tbody>
                {inputList.length > 0 &&
                  inputList.map((item: any, idx: number) => (
                    <tr id="addr0" key={idx}>
                      <td className="tableStyle label">{idx}</td>
                      <td className="tableHeaderStyle">
                        <input
                          className="form-control dpstyle label"
                          type="text"
                          name="rolecode"
                          value={item.rolecode}
                          onChange={(e) => handleInputChange(e, idx)}
                        />
                        {isValidNext && item?.rolecode_error ? 
                        <span className="error">
                        {"Please enter the Role Code"}
                      </span> :item?.rolecodeIsDuplicate &&(
                          <span className="error">
                            {item.rolecode + " is unavailable"}
                          </span>
                        )}
                        
                      </td>
                      <td className="tableHeaderStyle">
                        <input
                          className="form-control dpstyle label"
                          type="text"
                          name="rolehierarchyname"
                          value={item.rolehierarchyname}
                          onChange={(e) => handleInputChange(e, idx)}
                        />
                        {isValidNext && item?.rolehierarchyname_error ? 
                        <span className="error">
                        {"Please enter the Role Hierarchy"}
                      </span> :item?.rolehierarchynameIsDuplicate &&(
                          <span className="error">
                            {item.rolehierarchyname + " is unavailable"}
                          </span>
                        )}
                        
                      </td>
                      <td className="tableHeaderStyle">
                        {/* <select
                          className="dpstyle selectoutline label"
                          name="roletype"
                          id="dropdown"
                          value={item.roletype}
                          onChange={(event) =>
                            handleDropdownRoleChange(event, idx)
                          }
                        >
                          <option value="INTERNAL" key="INTERNAL">
                            INTERNAL
                          </option>
                          <option value="EXTERNAL" key="EXTERNAL">
                            EXTERNAL
                          </option>
                        </select> */}

                        <ConfigSelect
                          name="roletype"
                          options={roleTypeOptions}
                          handleChange={(event: any) =>
                            handleDropdownRoleChange(event, idx)
                          }
                          value={item.roletype || "INTERNAL"}
                          isPlaceholder
                          commonSelectType={true}
                        />
                      </td>
                      <td className="tableHeaderStyle">
                        {/* <select
                          className="dpstyle selectoutline label"
                          name="parentrole"
                          id="dropdown"
                          value={item.parentrole}
                          onChange={(event) => handleDropdownChange(event, idx)}
                        >
                          <option value="" key="">
                            NONE
                          </option>
                          {idx > 0 &&
                            inputList.length > 0 &&
                            inputList.map(
                              ({ rolecode }: any, index: number) =>
                                index < idx && (
                                  <option value={rolecode} key={rolecode}>
                                    {rolecode}
                                  </option>
                                )
                            )}
                        </select> */}

                        <ConfigSelect
                          defaultValue="NONE"
                          name="parentrole"
                          options={roleOptions}
                          handleChange={(event: any) =>
                            handleDropdownChange(event, idx)
                          }
                          value={
                            item.parentrole === "NONE"
                              ? "NONE"
                              : item.parentrole
                          }
                          isPlaceholder
                          parentIndex={idx}
                        />
                      </td>

                      <td className="tablebtnStyle">
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

const mapStateToProps = ({ devconfig: { role } }: any) => {
  return {
    role,
  };
};

const mapDispatchToProps = {
  setInputList: addRoleInputList,
};

export default connect(mapStateToProps, mapDispatchToProps)(RoleHierarchy);
