import React, { useState, useEffect } from "react";
import "../../devconfig/devconfig.scss";
import plus_icon from "../../../assets/icons/plus_icon.svg";
import minus from "../../../assets/icons/minus.svg";
import { connect } from "react-redux";
import AddBtn from "../../../assets/icons/add_btn.svg";
import RemoveBtn from "../../../assets/icons/Remove_row.svg";
import _ from "lodash";
import { addScanpointsAndAllocationInputList } from "../../../redux/actions";
import { ConfigSelect } from "../../../utility/widgets/dropdown/ConfigSelect";
import { handledropdownoption } from "../../../utility/helper";

interface IScanPointsAndAllocationProps {
  scanpointsandallocation: any;
  setInputList: (data: any) => void;
  tntflow: any;
  packagingdefinition: any;
}
const scanTypeOptions = [
  { value: "NA", text: "NA" },
  { value: "ADVISOR", text: "ADVISOR" },
  { value: "WALKIN", text: "WALKIN" },
  { value: "SEND GOODS", text: "SEND GOODS" },
];

const pointallocatedOptions = [
  { value: "true", text: "YES" },
  { value: "false", text: "NO" },
];

export const ScanPointsAndAllocation = (
  props: IScanPointsAndAllocationProps
) => {
  const {
    scanpointsandallocation: { inputList },
    setInputList,
  } = props;
  const [valSelected, setValSelected] = useState("NA");

  const paackaginglevelList = _.uniqBy(
    props.packagingdefinition.inputList,
    "packaginghierarchyname"
  );

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
      //   {
      //     position: { id: 0, value: "NA" },
      //     scannedby: { id: 0, value: "NA" },
      //     scantype: { id: 0, value: "NA" },
      //     packaginglevel: { id: 0, value: "NA" },
      //     pointallocated: { id: 0, value: "NA" },
      //   },
      {
        position: 0,
        scannedby: "",
        scantype: "",
        packaginglevel: "",
        pointallocated: false,
      },
    ]);
  };

  const handleDropdownPostionChange = (event: any, index: any) => {
    const { name, value } = event.target;
    const list: any = [...inputList];
    list[index].position = value;
    setInputList(list);
    setValSelected(event.target.value);
  };

  const handleScannedbyChange = (event: any, index: any) => {
    const { name, value } = event.target;
    const list: any = [...inputList];
    list[index].scannedby = value;
    setInputList(list);
    setValSelected(event.target.value);
  };

  const handleScannedtypeChange = (event: any, index: any) => {
    const { name, value } = event.target;
    const list: any = [...inputList];
    list[index].scantype = value;
    setInputList(list);
    setValSelected(event.target.value);
  };

  const handlePackaginglevelChange = (event: any, index: any) => {
    const { name, value } = event.target;
    const list: any = [...inputList];
    list[index].packaginglevel = value;
    setInputList(list);
    setValSelected(event.target.value);
  };

  const handlePointsallocatedChange = (event: any, index: any) => {
    const { name, value } = event.target;
    const list: any = [...inputList];
    console.log("value : ", value);
    list[index].pointallocated = value;
    setInputList(list);
    setValSelected(event.target.value);
  };

  const packaginglevelOptions = handledropdownoption(
    paackaginglevelList,
    "packaginghierarchyname"
  );

  const positionOptions = handledropdownoption(
    props.tntflow.inputList,
    "position"
  );

  return (
    <div className="col-md-12">
      <div className="container">
        <div className="row">
          <div className="col-xs-12 column tableScrollStyle">
            <table className="devconfig table label" id="tab_logic">
              <thead className="tableStyle">
                <tr>
                  <th className="tableHeaderStyle">Position</th>
                  <th className="tableHeaderStyle">Scanned By</th>
                  <th className="tableHeaderStyle">Scanned Type</th>
                  <th className="tableHeaderStyle">Packaging Level</th>
                  <th className="tableHeaderStyle">Points Allocated</th>
                  <th className="tablebtnStyle" />
                </tr>
              </thead>
              <tbody>
                {inputList.map((item: any, idx: number) => (
                  <tr id="addr0" key={idx}>
                    <td className="tableHeaderStyle">
                      {/* <select
                        className="dpstyle selectoutline label"
                        id="dropdown"
                        name="position"
                        value={item.position}
                        onChange={(event) =>
                          handleDropdownPostionChange(event, idx)
                        }
                      >
                        {props.tntflow.inputList.length > 0 &&
                          props.tntflow.inputList.map(({ position }: any) => (
                            <option value={position} key={position}>
                              {position}
                            </option>
                          ))}
                      </select> */}

                      <ConfigSelect
                        name="position"
                        options={positionOptions}
                        handleChange={(event: any) =>
                          handleDropdownPostionChange(event, idx)
                        }
                        value={item.position}
                        isPlaceholder
                        commonSelectType={true}
                      />
                    </td>
                    <td className="tableHeaderStyle">
                      {/* <select
                        className="dpstyle selectoutline label"
                        id="dropdown"
                        name="scannedby"
                        value={item.scannedby}
                        onChange={(event) => handleScannedbyChange(event, idx)}
                      >
                        {props.tntflow.inputList.length > 0 &&
                          props.tntflow.inputList.map(({ position }: any) => (
                            <option value={position} key={position}>
                              {position}
                            </option>
                          ))}
                      </select> */}

                      <ConfigSelect
                        name="scannedby"
                        options={positionOptions}
                        handleChange={(event: any) =>
                          handleScannedbyChange(event, idx)
                        }
                        value={item.scannedby}
                        isPlaceholder
                        commonSelectType={true}
                      />
                    </td>

                    <td className="tableHeaderStyle">
                      {/* <select
                        className="dpstyle selectoutline label"
                        id="dropdown"
                        name="scantype"
                        value={item.scantype}
                        onChange={(event) =>
                          handleScannedtypeChange(event, idx)
                        }
                      >
                        <option value="NA" key="NA">
                          NA
                        </option>
                        <option value="ADVISOR" key="ADVISOR">
                          ADVISOR
                        </option>
                        <option value="RETAILER" key="RETAILER">
                          WALKIN
                        </option>
                        <option value="DISTRIBUTOR" key="DISTRIBUTOR">
                          SEND GOODS
                        </option>
                      </select> */}

                      <ConfigSelect
                        name="scantype"
                        options={scanTypeOptions}
                        handleChange={(event: any) =>
                          handleScannedtypeChange(event, idx)
                        }
                        value={item.scantype}
                        isPlaceholder
                        commonSelectType={true}
                      />
                    </td>
                    <td className="tableHeaderStyle">
                      <select
                        className="dpstyle selectoutline label"
                        id="dropdown"
                        name="packaginglevel"
                        value={item.packaginglevel}
                        onChange={(event) =>
                          handlePackaginglevelChange(event, idx)
                        }
                      >
                        {paackaginglevelList.length > 0 &&
                          paackaginglevelList.map(
                            ({ packaginghierarchyname }: any) => (
                              <option
                                value={packaginghierarchyname}
                                key={packaginghierarchyname}
                              >
                                {packaginghierarchyname}
                              </option>
                            )
                          )}{" "}
                      </select>

                      {/* <ConfigSelect
                        name="packaginglevel"
                        options={packaginglevelOptions}
                        handleChange={(event: any) =>
                          handlePackaginglevelChange(event, idx)
                        }
                        value={item.packaginglevel}
                        isPlaceholder
                        commonSelectType={true}
                      /> */}
                    </td>

                    <td className="tableHeaderStyle">
                      {/* <select
                        className="dpstyle selectoutline label"
                        id="dropdown"
                        name="pointallocated"
                        value={item.pointallocated}
                        onChange={(event) =>
                          handlePointsallocatedChange(event, idx)
                        }
                      >
                        <option value="true" key="YES">
                          YES
                        </option>
                        <option value="false" key="NO">
                          NO
                        </option>
                      </select> */}

                      <ConfigSelect
                        name="scantype"
                        options={pointallocatedOptions}
                        handleChange={(event: any) =>
                          handlePointsallocatedChange(event, idx)
                        }
                        value={item.pointallocated}
                        isPlaceholder
                        commonSelectType={true}
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
                          } else if (idx > 0 && idx === inputList.length - 1) {
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

const mapStateToProps = ({
  devconfig: { scanpointsandallocation, tntflow, packagingdefinition },
}: any) => {
  return {
    scanpointsandallocation,
    tntflow,
    packagingdefinition,
  };
};

const mapDispatchToProps = {
  setInputList: addScanpointsAndAllocationInputList,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScanPointsAndAllocation);
