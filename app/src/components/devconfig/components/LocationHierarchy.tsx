import React, { useState, useEffect } from 'react';
import "../../devconfig/devconfig.scss";
import plus_icon from "../../../assets/icons/plus_icon.svg";
import minus from "../../../assets/icons/minus.svg";

export interface IFormValue {
    id: string;
    label: string;
}

interface ILocationProps {
    nextStep: () => void;
    prevStep: () => void;
    setLocation: (data: any) => void;
}

export interface IDropdownValue {
    id: string;
    value: string[];
}

interface IParentLoaction {
    locationhierarchy: string;
    parentlocation: IDropdownValue[];
}

export const LocationHierarchy = (props: ILocationProps) => {
    const { setLocation } = props;
    const [dpList, setDpList] = useState([{ locationhierarchy: "", parentlocation: { id: 0, value: "NA" } }]);
    const [inputList, setInputList] = useState([{ locationhierarchy: "", parentlocation: { id: 0, value: "NA" } }]);
    const [valSelected, setValSelected] = useState('NA');

    useEffect(() => {
        return () => {
            setLocation(inputList)
        }
    }, []);


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
        setInputList([...inputList, { locationhierarchy: "", parentlocation: { id: 0, value: "NA" } }]);
        const list = [...inputList];
        const list1 = [...dpList];

    };

    const handleDropdownChange = (event: any, index: any) => {

        // const key = event.target.name;
        // const value = event.target.value;

        const { name, value } = event.target;
        const list: any = [...inputList];
        list[index].parentlocation.value = value;
        setInputList(list);
        setValSelected(event.target.value);
    }

    return (
        <div className="col-md-10">
            <div className="container">
                <div className="row">
                    <div className="col-xs-12 col-md-8  column tableScrollStyle">
                        <table className="table" id="tab_logic">
                            <thead className="tableStyle">
                                <tr>
                                    <th className="text-center tableStyle">Location Level</th>
                                    <th className="tableHeaderStyle">Location Hierarchy Name</th>
                                    <th className="tableHeaderStyle">Parent Location</th>
                                    <th className="tablebtnStyle" />
                                </tr>
                            </thead>
                            <tbody>
                                {inputList.map((item, idx) => (
                                    <tr id="addr0" key={idx}>
                                        <td className="tableStyle">{idx}</td>
                                        <td className="tableHeaderStyle">
                                            <input className="form-control dpstyle"
                                                type="text"
                                                name="locationhierarchy"
                                                value={item.locationhierarchy}
                                                onChange={e => handleInputChange(e, idx)}
                                                data-id={idx}
                                            />
                                        </td>

                                        <td className="tableHeaderStyle">
                                            <select defaultValue="NA" name="parentlocation" data-id={idx} className="dpstyle" id="dropdown" value={item.parentlocation.value} onChange={(event) => handleDropdownChange(event, idx)}>
                                                <option value="NA" key="NA">NA</option>
                                                {idx > 0 && dpList.length > 0 && (
                                                    dpList.map(({ locationhierarchy }, index) => (
                                                        index < idx && <option value={locationhierarchy} key={locationhierarchy}>
                                                            {locationhierarchy}
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
