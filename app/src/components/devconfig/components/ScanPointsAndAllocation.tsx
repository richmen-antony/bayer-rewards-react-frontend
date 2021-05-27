import React, { useState, useEffect } from "react";
import "../../devconfig/devconfig.scss";
import plus_icon from "../../../assets/icons/plus_icon.svg";
import minus from "../../../assets/icons/minus.svg";
import { connect } from "react-redux";
import { addScanpointsAndAllocationInputList } from "../../../redux/actions";

interface IScanPointsAndAllocationProps {
  scanpointsandallocation: any;
  setInputList: (data: any) => void;
}

export const ScanPointsAndAllocation = (
  props: IScanPointsAndAllocationProps
) => {
  const {
    scanpointsandallocation: { inputList },
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
      //   {
      //     position: { id: 0, value: "NA" },
      //     scannedby: { id: 0, value: "NA" },
      //     scannedtype: { id: 0, value: "NA" },
      //     packaginglevel: { id: 0, value: "NA" },
      //     pointsallocated: { id: 0, value: "NA" },
      //   },
      {
        position: 0,
        scannedby: -1,
        scantype: -1,
        packaginglevel: -1,
        pointallocated: -1,
      },
    ]);
  };

  const handleDropdownPostionChange = (event: any, index: any) => {
    const { name, value } = event.target;
    const list: any = [...inputList];
    list[index].position.value = value;
    setInputList(list);
    setValSelected(event.target.value);
  };

  const handleScannedbyChange = (event: any, index: any) => {
    const { name, value } = event.target;
    const list: any = [...inputList];
    list[index].scannedby.value = value;
    setInputList(list);
    setValSelected(event.target.value);
  };

  const handleScannedtypeChange = (event: any, index: any) => {
    const { name, value } = event.target;
    const list: any = [...inputList];
    list[index].scannedtype.value = value;
    setInputList(list);
    setValSelected(event.target.value);
  };

  const handlePackaginglevelChange = (event: any, index: any) => {
    const { name, value } = event.target;
    const list: any = [...inputList];
    list[index].packaginglevel.value = value;
    setInputList(list);
    setValSelected(event.target.value);
  };

  const handlePointsallocatedChange = (event: any, index: any) => {
    const { name, value } = event.target;
    const list: any = [...inputList];
    list[index].pointsallocated.value = value;
    setInputList(list);
    setValSelected(event.target.value);
  };

  return (
    <div className="col-md-12">
      <div className="container">
        <div className="row">
          <div className="col-xs-12 column tableScrollStyle">
            <table className="table" id="tab_logic">
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
                      <select
                        className="dpstyle selectoutline"
                        id="dropdown"
                        name="position"
                        value={item.position.value}
                        onChange={(event) =>
                          handleDropdownPostionChange(event, idx)
                        }
                      >
                        <option value="Plant" key="Plant">
                          Plant
                        </option>
                        <option value="Warehouse" key="Warehouse">
                          Warehouse
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
                        id="dropdown"
                        name="scannedby"
                        value={item.scannedby.value}
                        onChange={(event) => handleScannedbyChange(event, idx)}
                      >
                        <option value="Plant" key="Plant">
                          Plant
                        </option>
                        <option value="Warehouse" key="Warehouse">
                          Warehouse
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
                        id="dropdown"
                        name="scannedtype"
                        value={item.scannedtype.value}
                        onChange={(event) =>
                          handleScannedtypeChange(event, idx)
                        }
                      >
                        <option value="NA" key="NA">
                          NA
                        </option>
                        <option value="Advisor" key="Advisor">
                          Advisor
                        </option>
                        <option value="Retailer" key="Retailer">
                          Retailer
                        </option>
                        <option value="Distributor" key="Distributor">
                          Distributor
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
                        id="dropdown"
                        name="packaginglevel"
                        value={item.packaginglevel.value}
                        onChange={(event) =>
                          handlePackaginglevelChange(event, idx)
                        }
                      >
                        <option value="SKU" key="SKU">
                          SKU
                        </option>
                        <option value="PalletBox" key="PalletBox">
                          Pallet, Box
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
                        id="dropdown"
                        name="pointsallocated"
                        value={item.pointsallocated.value}
                        onChange={(event) =>
                          handlePointsallocatedChange(event, idx)
                        }
                      >
                        <option value="Yes" key="Yes">
                          Yes
                        </option>
                        <option value="No" key="No">
                          No
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

const mapStateToProps = ({ devconfig: { scanpointsandallocation } }: any) => {
  return {
    scanpointsandallocation,
  };
};

const mapDispatchToProps = {
  setInputList: addScanpointsAndAllocationInputList,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScanPointsAndAllocation);
