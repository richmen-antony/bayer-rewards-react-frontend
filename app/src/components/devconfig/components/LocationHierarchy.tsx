import React, { useState } from "react";
import { connect } from "react-redux";
import "../../devconfig/devconfig.scss";
import plus_icon from "../../../assets/icons/plus_icon.svg";
import minus from "../../../assets/icons/minus.svg";
import { addLocationInputList } from "../../../redux/actions";

interface ILocationProps {
  location: any;
  setInputList: (data: any) => void;
}

const LocationHierarchy = (props: ILocationProps) => {
  const {
    location: { dpList, inputList },
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
    setInputList([
      ...inputList,
      { locationhierlevel: 0, locationhiername: "", parentlocation: -1 },
    ]);
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

const mapStateToProps = ({ devconfig: { location } }: any) => {
  return {
    location,
  };
};

const mapDispatchToProps = {
  setInputList: addLocationInputList,
};

export default connect(mapStateToProps, mapDispatchToProps)(LocationHierarchy);
