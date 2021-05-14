import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import "../../devconfig/devconfig.scss";
import plus_icon from "../../../assets/icons/plus_icon.svg";
import minus from "../../../assets/icons/minus.svg";
import { addRoleDpList, addRoleInputList } from '../../../redux/actions';
export interface IFormValue {
    id: string;
    label: string;
}

interface IRoleProps {
    // nextStep: () => void;
    // prevStep: () => void;
    role: any;
    setDpList: (data: any) => void;
    setInputList: (data: any) => void;
}


export const RoleHierarchy = (props: IRoleProps) => {
    const { role: { dpList, inputList }, setDpList, setInputList } = props;
    const [valSelected, setValSelected] = useState('NA');

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
        const dpLt = [...dpList]
        dpLt.splice(index, 1)
        setDpList(dpLt);
    };



    // handle click event of the Add button
    const handleAddClick = (index: any) => {
        setDpList([...inputList]);
        setInputList([...inputList, { rolecode: "", role: "", roletype: "", parentrole: { id: 0, value: "NA" } }]);
    };

    const handleDropdownChange = (event: any, index: any) => {
        const { name, value } = event.target;
        const list: any = [...inputList];
        list[index].parentrole.value = value;
        setInputList(list);
        setValSelected(event.target.value);
    }

    const handleDropdownRoleChange = (event: any, index: any) => {
        const { name, value } = event.target;
        const list: any = [...inputList];
        list[index].roletype = value;
        setInputList(list);
        setValSelected(event.target.value);
    }
    return (
        <div className="col-md-10">
            <div className="container">
                <div className="row">
                    <div className="col-xs-12  column tableScrollStyle">
                        <table className="table" id="tab_logic">
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
                                        <td className="tableStyle" >{idx}</td>
                                        <td className="tableHeaderStyle">
                                            <input className="form-control dpstyle"
                                                type="text"
                                                name="rolecode"
                                                value={item.rolecode}
                                                onChange={e => handleInputChange(e, idx)}
                                            />
                                        </td>
                                        <td className="tableHeaderStyle">
                                            <input className="form-control dpstyle"
                                                type="text"
                                                name="role"
                                                value={item.role}
                                                onChange={e => handleInputChange(e, idx)}
                                            />
                                        </td>
                                        <td className="tableHeaderStyle">
                                            <select className="dpstyle" name="roletype" id="dropdown" value={item.roletype} onChange={(event) => handleDropdownRoleChange(event, idx)}>
                                                <option value="Internal" key="Internal">Internal</option>
                                                <option value="External" key="External">External</option>
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
                                            <select className="dpstyle" name="parentrole" id="dropdown" value={item.parentrole.value} onChange={(event) => handleDropdownChange(event, idx)}>
                                                <option value="" key="">NA</option>
                                                {idx > 0 && dpList.length > 0 && (
                                                    dpList.map(({ rolecode }: any, index: number) => (
                                                        index < idx && <option value={rolecode} key={rolecode}>
                                                            {rolecode}
                                                        </option>
                                                    ))
                                                )}
                                            </select>
                                        </td>

                                        <td className="tablebtnStyle">
                                            {idx === inputList.length - 1 ? (
                                                <button className="btn btnStyleAdd" onClick={() => handleAddClick(idx)}><img src={plus_icon} /></button>
                                            ) : (
                                                    <button className="btn btnStyleRemove" onClick={() => handleRemoveClick(idx)}><img src={minus} /></button>
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
        role
    }
}

const mapDispatchToProps = {
    setDpList: addRoleDpList,
    setInputList: addRoleInputList
}

export default connect(mapStateToProps, mapDispatchToProps)(RoleHierarchy)