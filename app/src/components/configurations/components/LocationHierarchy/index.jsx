import React from "react";
import { render } from "react-dom";


class LocationHierarchy extends React.Component {
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
      border: "none",
      textAlign: "center",
      width: 185,
      height: 35
    };

    const tableHeaderStyle = {
      border: "none",
      textAlign: "Left",
      width: 185
    };

    const tablebtnStyle = {
      border: "none",
      width: 35,
      height: 35
    };

    const dpstyle = {
      width: 185,
      height: 35
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

    //  var filtered = this.state.dpList.filter(function (el) {
    //   return el != null;
    //  });

    //   console.log(filtered);

    return (
      <div className="col-md-10">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-8  column" style={tableScrollStyle}>
              <table className="table" id="tab_logic">
                <thead style={tableStyle} >
                  <tr>
                    <th style={tableStyle} className="text-center">Location Level</th>
                    <th style={tableHeaderStyle}>Location Hierarchy Name</th>
                    <th style={tableHeaderStyle}>Parent Location</th>
                    <th style={tablebtnStyle} />
                  </tr>
                </thead>
                <tbody>
                  {this.state.rows.map((item, idx) => (
                    <tr id="addr0" key={idx}>
                      <td style={tableStyle} >{idx}</td>
                      <td style={tableHeaderStyle}>
                        <input style={dpstyle}
                          type="text"
                          name="locationhierarchy"
                          value={this.state.rows[idx].locationhierarchy}
                          onChange={this.handleChange(idx)}
                          className="form-control"
                        />
                      </td>


                      <td style={tableHeaderStyle}>
                        <select style={dpstyle} id="dropdown" value={this.state.valSelected} onChange={(event) => this.handleDropdownChange(event)}>
                          <option value="" key="">NA</option>
                          {idx > 0 && this.state.dpList.length > 0 && (
                            this.state.dpList.map(({ locationhierarchy }) => (
                              <option value={locationhierarchy} key={locationhierarchy}>
                                {locationhierarchy}
                              </option>
                            ))

                          )}
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
    );
  }
}

export { LocationHierarchy };


// import * as React from 'react';
// import PropTypes from 'prop-types';

// import { Input } from '../../../../utility/widgets/input';
// import Button from 'react-bootstrap/esm/Button'
// const dpstyle = {
//   width: 185, 
//   height: 35
// };
// const btncircle = {
//   width: 40,
//   height: 40,
//   borderRadius:20,
//   marginTop:10,
// }

// export const LocationHierarchy = (props) => {
//   const _onChangeActiveStep = nextActiveStep => {
//     const { onChangeActiveStep } = props;

//     if (onChangeActiveStep && typeof onChangeActiveStep === "function") {
//       onChangeActiveStep(nextActiveStep);
//     }

//     // this.handleDropdownChange = this.handleDropdownChange.bind(this);
//   }

//   // handleDropdownChange(e) {
//   //   this.setState({ selectValue: e.target.value });
//   // }

//   return (
//     <div className="col-md-10">
//       <div className="container">
//         <div className="row rm-group">
//           <div className="col-sm-2">
//             <div><label className="font-weight-bold pt-4">Location Level</label></div>
//             <div><label className="font-weight-bold">0</label></div>
//           </div>
//           <div className="col-sm-3">
//             <div><label className="font-weight-bold pt-4">Country</label></div>
//             <div>   <select style={dpstyle} id="dropdown">
//               <option value="N/A">N/A</option>
//               <option value="1">1</option>
//               <option value="2">2</option>
//               <option value="3">3</option>
//               <option value="4">4</option>
//             </select></div>
//           </div>
//           <div className="col-sm-3">
//             <div><label className="font-weight-bold pt-4">Parent Location</label></div>
//             <div>   <select style={dpstyle} id="dropdown">
//               <option value="N/A">N/A</option>
//               <option value="1">1</option>
//               <option value="2">2</option>
//               <option value="3">3</option>
//               <option value="4">4</option>
//             </select></div>
//           </div>
//           <div>
//             <div><label className="pt-4"></label></div>
//             <div><Button variant="success" style={btncircle} >+</Button>{' '}</div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// };

// LocationHierarchy.propTypes = {
//     onChangeActiveStep: PropTypes.func.isRequired
//  };
