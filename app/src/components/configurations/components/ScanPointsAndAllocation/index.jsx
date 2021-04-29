import * as React from 'react';
import PropTypes from 'prop-types';

import { Input } from '../../../../utility/widgets/input';
import Button from 'react-bootstrap/esm/Button'

class ScanPointsAndAllocation extends React.Component {

  state = {
    rows: [{}],
    dpList: [{}],
    valSelected: ''
  };

  handleDropdownChange = (event) => {
    this.setState({ valSelected: event.target.value });
    console.log("val :" & this.state.valSelected);
  }

  handleChange = idx => e => {
    const { name, value } = e.target;
    const rows = [...this.state.rows];
    rows[idx] = {
      [name]: value
    };
    this.setState({
      rows
    });
  };

  handleAddRow = () => {
    const item = {
      locationlevel: "",
      locationhierarchy: "",
      parentlocation: ""
    };

    this.setState({
      rows: [...this.state.rows, item],
      dpList: [...this.state.rows, item]
    });
    console.log(this.state.rows);
    console.log(this.state.dpList);
  };

  handleRemoveSpecificRow = (idx) => () => {
    const rows = [...this.state.rows]
    rows.splice(idx, 1)
    this.setState({ rows })

    const dpList = [...this.state.dpList]
    dpList.splice(idx, 1)
    this.setState({ dpList })
  }


  render() {
    const tableStyle = {
      border: "none", textAlign: "center", width: 185, height: 35
    };

    const tableHeaderStyle = {
      border: "none", textAlign: "Left", width: 185
    };

    const tablebtnStyle = {
      border: "none", width: 35, height: 35
    };

    const dpstyle = {
      width: 185, height: 35
    };

    const btnStyleAdd = {
      color: "white", background: "#89D329 0% 0% no-repeat padding-box",
      boxshadow: " 0px 3px 6px #00000029", opacity: 1,
      fontSize: "17px", fontweight: "bold", textalign: "center",
      width: 35, height: 35, borderRadius: 20, color: "white"
    }

    const btnStyleRemove = {
      color: "white", background: "#C1C1C1 0% 0% no-repeat padding-box",
      boxshadow: " 0px 3px 6px #00000029", opacity: 1,
      fontSize: "17px", fontweight: "bold", textalign: "center",
      width: 35, height: 35, borderRadius: 20, color: "white"
    }
    const tableScrollStyle = {
      maxHeight: "280px",
      overflowY: "auto"
    }

    return (
      <div className="col-md-10">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 column" style={tableScrollStyle}>
              <table className="table" id="tab_logic">
                <thead style={tableStyle} >
                  <tr>
                    <th style={tableHeaderStyle}>Position</th>
                    <th style={tableHeaderStyle}>Scanned By</th>
                    <th style={tableHeaderStyle}>Scanned Type</th>
                    <th style={tableHeaderStyle}>Packaging Level</th>
                    <th style={tableHeaderStyle}>Points Allocated</th>
                    <th style={tablebtnStyle} />
                  </tr>
                </thead>
                <tbody>
                  {this.state.rows.map((item, idx) => (
                    <tr id="addr0" key={idx}>
                      <td style={tableHeaderStyle}>
                        <select style={dpstyle} id="dropdown" onChange={(event) => this.handleDropdownChange(event)}>
                          <option value="Plant" key="Plant">Plant</option>
                          <option value="Warehouse" key="Warehouse">Warehouse</option>
                          {/* {idx > 0 && this.state.dpList.length > 0 && (
                          this.state.dpList.map(({ locationhierarchy }) => (
                            <option value={locationhierarchy} key={locationhierarchy}>
                              {locationhierarchy}
                            </option>
                          ))
                        )} */}
                        </select>
                      </td>
                      <td style={tableHeaderStyle}>
                        <select style={dpstyle} id="dropdown" onChange={(event) => this.handleDropdownChange(event)}>
                          <option value="Plant" key="Plant">Plant</option>
                          <option value="Warehouse" key="Warehouse">Warehouse</option>
                          {/* {idx > 0 && this.state.dpList.length > 0 && (
                          this.state.dpList.map(({ locationhierarchy }) => (
                            <option value={locationhierarchy} key={locationhierarchy}>
                              {locationhierarchy}
                            </option>
                          ))
                        )} */}
                        </select>
                      </td>

                      <td style={tableHeaderStyle}>
                        <select style={dpstyle} id="dropdown" onChange={(event) => this.handleDropdownChange(event)}>
                          <option value="NA" key="NA">NA</option>
                          <option value="Advisor" key="Advisor">Advisor</option>
                          <option value="Retailer" key="Retailer">Retailer</option>
                          <option value="Distributor" key="Distributor">Distributor</option>
                          {/* {idx > 0 && this.state.dpList.length > 0 && (
                          this.state.dpList.map(({ locationhierarchy }) => (
                            <option value={locationhierarchy} key={locationhierarchy}>
                              {locationhierarchy}
                            </option>
                          ))
                        )} */}
                        </select>
                      </td>
                      <td style={tableHeaderStyle}>
                        <select style={dpstyle} id="dropdown" onChange={(event) => this.handleDropdownChange(event)}>
                          <option value="SKU" key="SKU">SKU</option>
                          <option value="PalletBox" key="PalletBox">Pallet, Box</option>
                          {/* {idx > 0 && this.state.dpList.length > 0 && (
                          this.state.dpList.map(({ locationhierarchy }) => (
                            <option value={locationhierarchy} key={locationhierarchy}>
                              {locationhierarchy}
                            </option>
                          ))
                        )} */}
                        </select>
                      </td>

                      <td style={tableHeaderStyle}>
                        <select style={dpstyle} id="dropdown" onChange={(event) => this.handleDropdownChange(event)}>
                          <option value="Yes" key="Yes">Yes</option>
                          <option value="No" key="No">No</option>
                          {/* {idx > 0 && this.state.dpList.length > 0 && (
                          this.state.dpList.map(({ locationhierarchy }) => (
                            <option value={locationhierarchy} key={locationhierarchy}>
                              {locationhierarchy}
                            </option>
                          ))
                        )} */}
                        </select>
                      </td>

                      <td style={tablebtnStyle}>
                        {idx === this.state.rows.length - 1 ? (
                          <button className="btn" style={btnStyleAdd} onClick={this.handleAddRow}>+</button>
                        ) : (
                            <button className="btn" style={btnStyleRemove} onClick={this.handleRemoveSpecificRow(idx)}> - </button>
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

      // <div className="col-md-10" >
      //   <div className="container">
      //     <div className="row rm-group">
      //       <div className="col-sm-2">
      //         <div><label className="font-weight-bold pt-4">Position</label></div>
      //         <div>
      //           <Input style={dpstyle} type="text" className="form-control" name="position" />
      //         </div>
      //       </div>

      //       <div className="col-sm-2">
      //         <div><label className="font-weight-bold pt-4">Scanned By</label></div>
      //         <div>   <select style={dpstyle} id="dropdown">
      //           <option value="N/A">N/A</option>
      //           <option value="1">1</option>
      //           <option value="2">2</option>
      //           <option value="3">3</option>
      //           <option value="4">4</option>
      //         </select></div>
      //       </div>
      //       <div className="col-sm-2">
      //         <div><label className="font-weight-bold pt-4">Scan Type</label></div>
      //         <div>   <select style={dpstyle} id="dropdown">
      //           <option value="N/A">N/A</option>
      //           <option value="1">1</option>
      //           <option value="2">2</option>
      //           <option value="3">3</option>
      //           <option value="4">4</option>
      //         </select></div>
      //       </div>
      //       <div className="col-sm-2">
      //         <div><label className="font-weight-bold pt-4">packaging Level</label></div>
      //         <div>   <select style={dpstyle} id="dropdown">
      //           <option value="N/A">N/A</option>
      //           <option value="1">1</option>
      //           <option value="2">2</option>
      //           <option value="3">3</option>
      //           <option value="4">4</option>
      //         </select></div>
      //       </div>
      //       <div className="col-sm-2">
      //         <div><label className="font-weight-bold pt-4">Points Allocated</label></div>
      //         <div>   <select style={dpstyle} id="dropdown">
      //           <option value="N/A">N/A</option>
      //           <option value="1">1</option>
      //           <option value="2">2</option>
      //           <option value="3">3</option>
      //           <option value="4">4</option>
      //         </select></div>
      //       </div>
      //       <div className="col-sm-2">
      //         <div>
      //           <div><label className="pt-4"></label></div>
      //           <div><Button variant="success" style={btnStyleAdd} >+</Button>{' '}</div>
      //         </div>
      //       </div>


      //     </div>
      //   </div>
      // </div>

    )
  }
}
export { ScanPointsAndAllocation };
