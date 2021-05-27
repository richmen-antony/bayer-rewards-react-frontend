import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import "../../devconfig/devconfig.scss";
import plus_icon from "../../../assets/icons/plus_icon.svg";
import minus from "../../../assets/icons/minus.svg";
import AddBtn from "../../../assets/icons/add_btn.svg";
import RemoveBtn from "../../../assets/icons/Remove_row.svg";
import { addRoleInputList } from "../../../redux/actions";

interface IRoleProps {
  role: any;
  setInputList: (data: any) => void;
  inputList:Array<any>,
  isValidNext:boolean,
  getValidation:()=>void;
}

export const RoleHierarchy = (props: IRoleProps) => {
  const {
    inputList,
    setInputList,
    isValidNext,
    getValidation
  } = props;
  const [valSelected, setValSelected] = useState("NA");

  // handle input change
  const handleInputChange = (e: any, index: any) => {
    const { name, value } = e.target;
    const list: any = [...inputList];
    list[index][name] = value;
    setInputList(list);
  };

  const setCorrectHierLvl = (list: any, index: number) => {
    const newList = list.map((listItem: any, idx: number) => {
      return {
        ...listItem,
        rolehierarchylevel: idx,
        parentrole:
          listItem.parentrole >= index
            ? listItem.parentrole - 1
            : listItem.parentrole,
        // parentrole : listItem.parentrole === index ? -1 : listItem.parentrole > index ? listItem.parentrole-1 : listItem.parentrole
      };
    });
    return newList;
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
    const data =inputList[index];
    getValidation();
    if(data.rolehierarchyname && data.rolecode){
    setInputList([
      ...inputList,
      {
        rolehierarchylevel: inputList.length + 1,
        rolecode: "",
        rolehierarchyname: "",
        roletype: "",
        parentrole: "NONE",
      },
    ]);
  }
  };

  const handleDropdownChange = (event: any, index: any) => {
    const { name, value } = event.target;
    const list: any = [...inputList];
    list[index].parentrole = value;
    setInputList(list);
    setValSelected(event.target.value);
  };

  const handleDropdownRoleChange = (event: any, index: any) => {
    const { name, value } = event.target;
    const list: any = [...inputList];
    list[index].roletype = value;
    setInputList(list);
    setValSelected(event.target.value);
  };
  return (
    <div className="col-md-10">
      <div className="container">
        <div className="row">
          <div className="col-xs-12  column tableScrollStyle">
            <table className="devconfig table" id="tab_logic">
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
                {inputList.map((item: any, idx: number) => (
                  <tr id="addr0" key={idx}>
                    <td className="tableStyle">{idx}</td>
                    <td className="tableHeaderStyle">
                      <input
                        className="form-control dpstyle"
                        type="text"
                        name="rolecode"
                        value={item.rolecode}
                        onChange={(e) => handleInputChange(e, idx)}
                      />
                         {item?.rolecode_error&&isValidNext&&<span className="error">{"Please enter Role Code"} </span>}
                    </td>
                    <td className="tableHeaderStyle">
                      <input
                        className="form-control dpstyle"
                        type="text"
                        name="rolehierarchyname"
                        value={item.rolehierarchyname}
                        onChange={(e) => handleInputChange(e, idx)}
                      />
                      {item?.rolehierarchyname_error&&isValidNext&&<span className="error">{"Please enter Role Hierarchy"} </span>}
                    </td>
                    <td className="tableHeaderStyle">
                      <select
                        className="dpstyle selectoutline"
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
                        {/* {idx > 0 && this.state.dpList.length > 0 && (
                          this.state.dpList.map(({ locationhierarchy }) => (
                            <option value={locationhierarchy} key={locationhierarchy}>
                              {locationhierarchy}
                            </option>
                          ))
                        )} */}
                      </select>
                    </td>
                    <td className="tableHeaderStyle">
                      <select
                        className="dpstyle selectoutline"
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
                      </select>
                    </td>

                    <td className="tablebtnStyle">
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

const mapStateToProps = ({ devconfig: { role } }: any) => {
  return {
    role,
  };
};

const mapDispatchToProps = {
  setInputList: addRoleInputList,
};

export default connect(mapStateToProps, mapDispatchToProps)(RoleHierarchy);
